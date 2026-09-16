"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import OptionButton from "./OptionButton-v2";
import AnimatedTitle from "../../../animations/AnimatedTitle";
import CustomButton from "../../../common/CustomButton";
import SectionDescription from "../../../animations/SectionDescription";
import { motion } from "framer-motion";
import { moveUp } from "../../../animations/motionVariants";
import { Product, ProductConfiguration } from "@/app/types/product";
import { slugify } from "@/lib/utils/slugify";

function configKey(cfg: ProductConfiguration): string {
  return slugify(cfg.category.title);
}

/**
 * @react-pdf/renderer's <Image> fetches its src directly from the browser.
 * Our uploads live on Azure Blob Storage, which isn't CORS-configured for
 * this origin, so that fetch fails silently and the PDF renders blank.
 * Routing through our same-origin proxy avoids the cross-origin request.
 */
function proxiedImageUrl(url: string): string {
  return url ? `/api/proxy-image?url=${encodeURIComponent(url)}` : url;
}

function buildInitialSelections(
  product: Product,
  searchParams: URLSearchParams,
) {
  const initial: Record<string, string> = {};
  product.secondSection.configurations.forEach((cfg) => {
    const fromUrl = searchParams.get(configKey(cfg));
    const matched = fromUrl && cfg.options.find((o) => o.code === fromUrl);
    const optionId = matched ? matched._id : cfg.defaultOption?._id;
    if (optionId) initial[cfg.category._id] = optionId;
  });
  return initial;
}

export default function ProductConfigurator({ product }: { product: Product }) {
  const configurations = product.secondSection.configurations;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selections, setSelections] = useState(() =>
    buildInitialSelections(product, searchParams),
  );
  const [copied, setCopied] = useState(false);
  const [downloadState, setDownloadState] = useState<
    "idle" | "working" | "error"
  >("idle");
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const qrSavedFor = useRef<string | null>(null);

  const selectedOptions = useMemo(
    () =>
      configurations.map((cfg) => {
        const option = cfg.options.find(
          (o) => o._id === selections[cfg.category._id],
        );
        return { configuration: cfg, option };
      }),
    [configurations, selections],
  );

  const hasSelection = useMemo(
    () => selectedOptions.some((s) => s.option),
    [selectedOptions],
  );

  const productCode = useMemo(() => {
    const codeParts = [
      "BR",
      product.productCode,
      ...selectedOptions
        // Size stays selectable and keeps every other effect it has —
        // it just doesn't appear in the printed/displayed code itself.
        .filter((s) => configKey(s.configuration) !== "size")
        .map((s) => s.option?.code)
        .filter(Boolean),
    ];
    return codeParts.join("-");
  }, [product.productCode, selectedOptions]);

  const summary = useMemo(
    () =>
      selectedOptions
        .map((s) => s.option?.tooltip.label?.trim())
        .filter(Boolean)
        .join(" - "),
    [selectedOptions],
  );

  const handleSelect = (cfg: ProductConfiguration, optionId: string) => {
    const isDeselecting = selections[cfg.category._id] === optionId;

    setSelections((prev) => {
      if (!isDeselecting) return { ...prev, [cfg.category._id]: optionId };
      const next = { ...prev };
      delete next[cfg.category._id];
      return next;
    });

    const params = new URLSearchParams(searchParams.toString());
    if (isDeselecting) {
      params.delete(configKey(cfg));
    } else {
      const option = cfg.options.find((o) => o._id === optionId);
      if (!option) return;
      params.set(configKey(cfg), option.code);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(productCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleGenerateQr = () => {
    setQrUrl(window.location.href);
  };

  // Once the QR canvas has rendered for a newly generated URL, download it
  // and persist a record so admins can see it under Products → QR Generated.
  useEffect(() => {
    if (!qrUrl || qrSavedFor.current === qrUrl) return;
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    qrSavedFor.current = qrUrl;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `${productCode || "product"}-qr.png`;
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    }, "image/png");

    fetch("/api/admin/products/qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: product._id,
        productTitle: product.title,
        productCode,
        url: qrUrl,
        image: canvas.toDataURL("image/png"),
      }),
    }).catch((error) => {
      console.error("Failed to save generated QR code", error);
    });
  }, [qrUrl, product._id, product.title, productCode]);

  const handleDownload = async () => {
    if (downloadState === "working") return;
    setDownloadState("working");
    try {
      const [{ buildDatasheetData }, { downloadDatasheet }, QRCode] =
        await Promise.all([
          import("../../datasheet/buildDatasheetData"),
          import("../../datasheet/generateDatasheet"),
          import("qrcode"),
        ]);
      const icons = [
        ...product.datasheet.icons.common
          .filter((c) => c.enabled && c.icon?.image)
          .map((c) => c.icon.image),
        ...product.datasheet.icons.specific.map((i) => i.image),
      ].filter(Boolean);

      const guideLink = product.datasheet.installationGuide?.link;
      const qrCodeImage = guideLink
        ? await QRCode.toDataURL(guideLink, { margin: 1, width: 300 })
        : undefined;

      const data = buildDatasheetData({
        product: {
          name: product.title,
          category: product.category?.title ?? "",
          description: product.description,
        },
        selectedOptions: selectedOptions
          .filter((s) => s.option)
          .map((s) => ({
            attribute: {
              id: s.configuration.category._id,
              label: s.configuration.category.title,
            },
            option: {
              id: s.option!._id,
              code: s.option!.code,
              label: s.option!.label,
              tooltip: s.option!.tooltip,
            },
          })),
        productCode,
        summary,
        datasheetImage: proxiedImageUrl(product.datasheet.image),
        installationGuideLink: guideLink,
        qrCodeImage,
        icons: icons.map(proxiedImageUrl),
      });
      await downloadDatasheet(data);
      setDownloadState("idle");
    } catch (error) {
      console.error("Failed to generate configured datasheet", error);
      setDownloadState("error");
    }
  };

  if (!configurations.length) return null;

  return (
    <section id="product-configuration" className="w-full bg-white py-100">
      <div className="container mx-auto px-4">
        <div className="mb-50">
          <AnimatedTitle
            tag="h1"
            className="section-title mb-20"
            text={`Configure Your ${product.title}`}
          />
          <SectionDescription
            text="Hover any option to preview the visual or property. Click to select.
            The product code rebuilds in real time from your selections."
            direction="y"
            className="text-description text-description-color"
          />
        </div>

        <div className="flex flex-col xl:flex-row justify-between gap-40">
          {/* Attributes */}
          <div className="flex flex-col md:flex-row gap-y-6 md:gap-y-0 gap-x-60 min-[1900px]:gap-x-[207px]">
            {[0, 1].map((colIndex) => (
              <div
                key={colIndex}
                className="flex flex-col gap-y-6 sm:gap-y-40 3xl:gap-y-[44px] flex-1"
              >
                {configurations
                  .filter((_, i) => i % 2 === colIndex)
                  .map((cfg, i) => (
                    <motion.div
                      variants={moveUp(i * 0.006)}
                      initial="hidden"
                      whileInView={"show"}
                      viewport={{ once: true }}
                      key={cfg.category._id}
                      className="flex flex-col gap-[16px] max-w-[481px]"
                    >
                      <span className="text-description-color text-subtitle-2 text-trim">
                        {cfg.category.title}
                      </span>
                      <div className="flex flex-wrap gap-[6px]">
                        {cfg.options.map((option) => (
                          <OptionButton
                            key={option._id}
                            option={option}
                            isActive={selections[cfg.category._id] === option._id}
                            onSelect={(optionId) => handleSelect(cfg, optionId)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </div>
            ))}
          </div>

          {/* Summary / live code sidebar */}
          <aside className="xl:max-w-[463px] h-fit xl:sticky xl:top-20 bg-cream-background p-5 sm:p-40 rounded-[10px]">
            <h3 className="text-subtitle mb-20 xl:max-w-[27ch]">
              {product.title} {product.subCategory?.title}
              <span className="block">- {product.category?.title} Lighting</span>
            </h3>

            <p className="text-description text-trim text-description-color mb-6 md:mb-60">
              {summary}
            </p>

            <div className="mb-20">
              <div className="bg-white border-secondary border px-4 md:px-[27px] py-4 md:py-[30.35px] rounded-[10px] flex items-center justify-center">
                <span className="text-description-color text-description text-trim">
                  {hasSelection
                    ? productCode
                    : "Select an option to generate your product code."}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <CustomButton
                text={
                  downloadState === "working"
                    ? "Generating…"
                    : downloadState === "error"
                      ? "Retry Download"
                      : "Download Configured Datasheet"
                }
                onClick={handleDownload}
                variant="3"
                iconDirection="down"
                btnClass="xl:!px-40"
                disabled={!hasSelection}
              />
              {downloadState === "error" && (
                <span className="text-13 text-red-600">
                  Could not generate the datasheet. Please try again.
                </span>
              )}
              <CustomButton
                text={copied ? "Copied!" : "Copy Code"}
                onClick={handleCopy}
                variant="2"
                disabled={!hasSelection}
                showIcon={false}
              />
              <CustomButton
                text="Generate QR Code"
                onClick={handleGenerateQr}
                variant="3"
                showIcon={false}
                disabled={!hasSelection}
              />
              {qrUrl && (
                <div className="mt-2 flex flex-col items-center gap-3 rounded-[10px] p-5">
                  <QRCodeCanvas
                    ref={qrCanvasRef}
                    bgColor="transparent"
                    value={qrUrl}
                    size={200}
                  />
                  {/* <p className="text-center text-xs break-all text-description-color">
                    {qrUrl}
                  </p> */}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
