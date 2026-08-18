"use client";

import { useMemo, useState } from "react";
import { attributes, product } from "../../data";
import OptionButton from "./OptionButton";
import AnimatedTitle from "../../../animations/AnimatedTitle";
import CustomButton from "../../../common/CustomButton";

function buildDefaultSelections() {
  const initial: Record<string, string> = {};
  attributes.forEach((attr) => {
    const defaultOption =
      attr.options.find((o) => o.default) ?? attr.options[0];
    initial[attr.id] = defaultOption.id;
  });
  return initial;
}

export default function ProductConfigurator() {
  const [selections, setSelections] = useState(buildDefaultSelections);
  const [copied, setCopied] = useState(false);

  const selectedOptions = useMemo(
    () =>
      attributes.map((attr) => {
        const option =
          attr.options.find((o) => o.id === selections[attr.id]) ??
          attr.options[0];
        return { attribute: attr, option };
      }),
    [selections],
  );

  const productCode = useMemo(() => {
    const codeParts = [
      product.brand,
      product.productCode,
      ...selectedOptions.map((s) => s.option.code),
    ];
    return codeParts.join("-");
  }, [selectedOptions]);

  const summary = useMemo(
    () =>
      selectedOptions
        .map((s) => s.option.tooltip.label?.trim())
        .filter(Boolean)
        .join(" - "),
    [selectedOptions],
  );

  const handleSelect = (attributeId: string, optionId: string) => {
    setSelections((prev) => ({ ...prev, [attributeId]: optionId }));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(productCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently ignore, code is still visible on screen
    }
  };

  const handleDownload = () => {
    // Placeholder — wire this up to the actual datasheet-generation endpoint later
    console.log("Download configured datasheet for:", productCode);
  };

  return (
    <section className="w-full bg-white py-100">
      <div className="container mx-auto px-4">
        <div className="mb-50">
          <AnimatedTitle
            tag="h1"
            className="section-title mb-20"
            text={`Configure Your ${product.name}`}
          />
          <p className="text-description text-description-color">
            Hover any option to preview the visual or property. Click to select.
            The product code rebuilds in real time from your selections.
          </p>
        </div>

        <div className="flex flex-col xl:flex-row justify-between gap-40">
          {/* Attributes */}
          <div className="flex flex-col md:flex-row gap-x-60 min-[1900px]:gap-x-[207px]">
            {[0, 1].map((colIndex) => (
              <div
                key={colIndex}
                className="flex flex-col gap-y-40 3xl:gap-y-[44px] flex-1"
              >
                {attributes
                  .filter((_, i) => i % 2 === colIndex)
                  .map((attr) => (
                    <div
                      key={attr.id}
                      className="flex flex-col gap-[16px] max-w-[481px]"
                    >
                      <span className="text-description-color text-subtitle-2 text-trim">
                        {attr.label}
                      </span>
                      <div className="flex flex-wrap gap-[6px]">
                        {attr.options.map((option: any) => (
                          <OptionButton
                            key={option.id}
                            option={option}
                            isActive={selections[attr.id] === option.id}
                            onSelect={(optionId: string) =>
                              handleSelect(attr.id, optionId)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Summary / live code sidebar */}
          <aside className="max-w-[463px] h-fit xl:sticky xl:top-20 bg-cream-background p-40 rounded-[10px]">
            <h3 className="text-subtitle mb-20 max-w-[27ch]">
              {product.name} Ceiling Recessed Downlight
              <span className="block">- {product.category}</span>
            </h3>

            <p className="text-description text-trim text-description-color mb-60">
              {summary}
            </p>

            <div className="mb-20">
              <div className="bg-white border-secondary border px-[27px] py-[30.35px] rounded-[10px] flex items-center justify-center">
                <span className="text-description-color text-description text-trim">{productCode}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <CustomButton
                text="Download Configured Datasheet"
                link="#"
                variant="3"
                iconDirection="down"
                btnClass="xl:!px-40"
              />
              <CustomButton
                text={copied ? "Copied!" : "Copy Code"}
                onClick={handleCopy}
                variant="2"
                showIcon={false}
              />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
