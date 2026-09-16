"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  RiDeleteBinLine,
  RiAddLine,
  RiSearchLine,
  RiCheckLine,
} from "react-icons/ri";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/ui/image-uploader";
import { MultiImageUploader } from "@/components/ui/multi-image-uploader";
import { FileUploader } from "@/components/ui/file-uploader";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import CustomButton from "@/app/components/client/common/CustomButton";
import { slugify } from "@/lib/utils/slugify";

type ConfigCategory = {
  _id: string;
  title: string;
  previewType: string;
  isCommon?: boolean;
};
type ConfigOption = { _id: string; label: string; code: string };
type SubCategoryOption = { _id: string; title: string };
type SpecOption = { _id: string; label: string };
type IconOption = { _id: string; image: string; isCommon?: boolean };

type ProductForm = {
  title: string;
  slug: string;
  category: string;
  subCategory: string;
  thumbImage: string;
  thumbImageAlt: string;
  hoverImage: string;
  hoverImageAlt: string;
  productCode: string;
  featured: boolean;
  description: string;
  specs: {
    common: { spec: string; enabled: boolean }[];
    custom: { value: string }[];
  };
  images: { image: string; imageAlt: string }[];
  photometrics: { image: string; imageAlt: string; name: string }[];
  secondSection: {
    title: string;
    description: string;
    configurations: {
      category: string;
      options: string[];
      defaultOption: string;
    }[];
    commonConfigurations: { category: string; enabled: boolean }[];
  };
  thirdSection: {
    title: string;
    items: {
      title: string;
      items: { key: string; value: string }[];
    }[];
  };
  fourthSection: {
    title: string;
    items: { title: string; link: string; size: string }[];
  }[];
  datasheet: {
    image: string;
    installationGuide: { link: string; size: string };
    icons: {
      common: { icon: string; enabled: boolean }[];
      specific: string[];
    };
  };
};

const defaultValues: ProductForm = {
  title: "",
  slug: "",
  category: "",
  subCategory: "",
  thumbImage: "",
  thumbImageAlt: "",
  hoverImage: "",
  hoverImageAlt: "",
  productCode: "",
  featured: false,
  description: "",
  specs: { common: [], custom: [] },
  images: [],
  photometrics: [],
  secondSection: {
    title: "",
    description: "",
    configurations: [],
    commonConfigurations: [],
  },
  thirdSection: { title: "", items: [] },
  fourthSection: [],
  datasheet: {
    image: "",
    installationGuide: { link: "", size: "" },
    icons: { common: [], specific: [] },
  },
};

// sentinel for the "no default" choice — the actual stored value stays ""
const NO_DEFAULT_OPTION = "none";

const addIconBtnClass =
  "flex items-center justify-center h-9 w-9 shrink-0 rounded-lg border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 active:scale-95 transition-all cursor-pointer";
const deleteIconBtnClass =
  "flex items-center justify-center h-9 w-9 shrink-0 rounded-lg border border-red-200 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 active:scale-95 transition-all cursor-pointer";
const deleteIconBtnClassSm =
  "flex items-center justify-center h-8 w-8 shrink-0 rounded-md border border-red-200 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 active:scale-95 transition-all cursor-pointer";

function Divider({ className = "" }: { className?: string }) {
  return <div className={`h-px w-full bg-secondary ${className}`} />;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ category: string; id: string }>();
  const isNew = params.id === "new";

  const { register, control, handleSubmit, reset, watch, setValue, getValues } =
    useForm<ProductForm>({ defaultValues });
  const [isSaving, setIsSaving] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategoryOption[]>([]);
  const [configCategories, setConfigCategories] = useState<ConfigCategory[]>(
    [],
  );
  const [commonSpecs, setCommonSpecs] = useState<SpecOption[]>([]);
  const [allIcons, setAllIcons] = useState<IconOption[]>([]);
  const [optionsByCategory, setOptionsByCategory] = useState<
    Record<string, ConfigOption[]>
  >({});
  // per-config-row search term, keyed by the useFieldArray field id
  const [optionSearch, setOptionSearch] = useState<Record<string, string>>(
    {},
  );

  const customSpecsArray = useFieldArray({ control, name: "specs.custom" });
  const imagesArray = useFieldArray({ control, name: "images" });
  const photometricsArray = useFieldArray({ control, name: "photometrics" });
  const configArray = useFieldArray({
    control,
    name: "secondSection.configurations",
  });
  const sectionItemsArray = useFieldArray({
    control,
    name: "thirdSection.items",
  });
  const fourthSectionArray = useFieldArray({
    control,
    name: "fourthSection",
  });
  const resolveCategory = async () => {
    const res = await fetch("/api/admin/products/category");
    const all = await res.json();
    const found = all.find((c: any) => c.slug === params.category);
    if (found) {
      setCategoryId(found._id);
      setValue("category", found._id);
      const subRes = await fetch(
        `/api/admin/products/subcategory?category=${found._id}`,
      );
      setSubCategories(await subRes.json());
    }
  };

  const fetchConfigCategories = async () => {
    const res = await fetch("/api/admin/products/config-category");
    setConfigCategories(await res.json());
  };

  const fetchCommonSpecs = async () => {
    const res = await fetch("/api/admin/products/spec");
    setCommonSpecs(await res.json());
  };

  const fetchIcons = async () => {
    const res = await fetch("/api/admin/products/icon");
    setAllIcons(await res.json());
  };

  const fetchOptionsForCategory = async (configCategoryId: string) => {
    if (optionsByCategory[configCategoryId]) return;
    const res = await fetch(
      `/api/admin/products/config-option?category=${configCategoryId}`,
    );
    const data = await res.json();
    setOptionsByCategory((prev) => ({ ...prev, [configCategoryId]: data }));
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.id}`);
      if (!res.ok) return toast.error("Failed to load product");
      const data = await res.json();
      reset({
        ...defaultValues,
        ...data,
        category: data.category?._id ?? data.category,
        subCategory: data.subCategory?._id ?? data.subCategory,
        specs: {
          common: (data.specs?.common ?? []).map((c: any) => ({
            spec: c.spec?._id ?? c.spec,
            enabled: c.enabled,
          })),
          custom: (data.specs?.custom ?? []).map((v: string) => ({ value: v })),
        },
        images: (data.images ?? []).map((img: any) =>
          typeof img === "string"
            ? { image: img, imageAlt: "" }
            : { image: img.image ?? "", imageAlt: img.imageAlt ?? "" },
        ),
        photometrics: data.photometrics ?? [],
        secondSection: {
          title: data.secondSection?.title ?? "",
          description: data.secondSection?.description ?? "",
          configurations: (data.secondSection?.configurations ?? []).map(
            (c: any) => ({
              category: c.category?._id ?? c.category,
              options: (c.options ?? []).map((o: any) => o._id ?? o),
              defaultOption: c.defaultOption?._id ?? c.defaultOption ?? "",
            }),
          ),
          commonConfigurations: (
            data.secondSection?.commonConfigurations ?? []
          ).map((c: any) => ({
            category: c.category?._id ?? c.category,
            enabled: c.enabled,
          })),
        },
        thirdSection: {
          title: data.thirdSection?.title ?? "",
          items: data.thirdSection?.items ?? [],
        },
        fourthSection: (Array.isArray(data.fourthSection)
          ? data.fourthSection
          : []
        ).map((tile: any) => ({
          title: tile.title ?? "",
          items: tile.items ?? [],
        })),
        datasheet: {
          image: data.datasheet?.image ?? "",
          installationGuide: {
            link: data.datasheet?.installationGuide?.link ?? "",
            size: data.datasheet?.installationGuide?.size ?? "",
          },
          icons: {
            common: (data.datasheet?.icons?.common ?? []).map((c: any) => ({
              icon: c.icon?._id ?? c.icon,
              enabled: c.enabled,
            })),
            specific: (data.datasheet?.icons?.specific ?? []).map(
              (v: any) => v?._id ?? v,
            ),
          },
        },
      });
      // preload options for already-selected config categories
      (data.secondSection?.configurations ?? []).forEach((c: any) => {
        const id = c.category?._id ?? c.category;
        if (id) fetchOptionsForCategory(id);
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to load product");
    }
  };

  useEffect(() => {
    resolveCategory();
    fetchConfigCategories();
    fetchCommonSpecs();
    fetchIcons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category]);

  useEffect(() => {
    if (!isNew) fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const onSubmit = async (formData: ProductForm) => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        secondSection: {
          ...formData.secondSection,
          // resolve against the live common-category list so newly marked
          // common categories that were never toggled still default to enabled
          commonConfigurations: configCategories
            .filter((cc) => cc.isCommon)
            .map((cc) => {
              const found = formData.secondSection.commonConfigurations.find(
                (c) => c.category === cc._id,
              );
              return { category: cc._id, enabled: found ? found.enabled : true };
            }),
        },
        specs: {
          // resolve against the live common-spec list so newly added ones
          // that were never toggled still default to enabled
          common: commonSpecs.map((cs) => {
            const found = formData.specs.common.find(
              (c) => c.spec === cs._id,
            );
            return { spec: cs._id, enabled: found ? found.enabled : true };
          }),
          custom: formData.specs.custom.map((s) => s.value),
        },
        datasheet: {
          image: formData.datasheet.image,
          installationGuide: formData.datasheet.installationGuide,
          icons: {
            // resolve against the live common-icon list so newly marked
            // common icons that were never toggled still default to enabled
            common: commonIcons.map((ci) => {
              const found = formData.datasheet.icons.common.find(
                (c) => c.icon === ci._id,
              );
              return { icon: ci._id, enabled: found ? found.enabled : true };
            }),
            specific: formData.datasheet.icons.specific,
          },
        },
      };

      const res = isNew
        ? await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/products/${params.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Failed to save product");

      toast.success(isNew ? "Product added" : "Product updated");
      if (isNew && data?._id) {
        router.replace(
          `/4dm1n-br1ght0n/products/${params.category}/${data._id}`,
        );
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const commonConfigCategories = configCategories.filter((cc) => cc.isCommon);
  const commonIcons = allIcons.filter((i) => i.isCommon);
  const nonCommonIcons = allIcons.filter((i) => !i.isCommon);

  const watchedConfigurations = watch("secondSection.configurations");
  const watchedCommonSpecs = watch("specs.common");
  const watchedCommonIcons = watch("datasheet.icons.common");
  const watchedSpecificIcons = watch("datasheet.icons.specific");
  const watchedCommonConfigurations = watch(
    "secondSection.commonConfigurations",
  );

  const toggleCommonSpec = (specId: string, enabled: boolean) => {
    const current = getValues("specs.common") ?? [];
    const idx = current.findIndex((c) => c.spec === specId);
    if (idx === -1) {
      setValue("specs.common", [...current, { spec: specId, enabled }]);
    } else {
      const next = [...current];
      next[idx] = { ...next[idx], enabled };
      setValue("specs.common", next);
    }
  };

  const toggleCommonIcon = (iconId: string, enabled: boolean) => {
    const current = getValues("datasheet.icons.common") ?? [];
    const idx = current.findIndex((c) => c.icon === iconId);
    if (idx === -1) {
      setValue("datasheet.icons.common", [
        ...current,
        { icon: iconId, enabled },
      ]);
    } else {
      const next = [...current];
      next[idx] = { ...next[idx], enabled };
      setValue("datasheet.icons.common", next);
    }
  };

  const toggleSpecificIcon = (iconId: string) => {
    const current = getValues("datasheet.icons.specific") ?? [];
    setValue(
      "datasheet.icons.specific",
      current.includes(iconId)
        ? current.filter((id) => id !== iconId)
        : [...current, iconId],
    );
  };

  const toggleCommonConfiguration = (categoryId: string, enabled: boolean) => {
    const current = getValues("secondSection.commonConfigurations") ?? [];
    const idx = current.findIndex((c) => c.category === categoryId);
    if (idx === -1) {
      setValue("secondSection.commonConfigurations", [
        ...current,
        { category: categoryId, enabled },
      ]);
    } else {
      const next = [...current];
      next[idx] = { ...next[idx], enabled };
      setValue("secondSection.commonConfigurations", next);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Key Details */}
        <AdminItemContainer expansion={false}>
          <div className="border-b border-secondary">
            <Label main>Key Details</Label>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input
                  {...register("title", { required: true })}
                  placeholder="Title"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Slug</Label>
                <div className="flex items-center gap-2">
                  <Input {...register("slug")} placeholder="Slug" />
                  <CustomButton
                    btnClass="-mt-[2px]"
                    variant="3"
                    text="Generate"
                    type="button"
                    onClick={() => setValue("slug", slugify(watch("title")))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Subcategory</Label>
                <Controller
                  name="subCategory"
                  control={control}
                  render={({ field }) => (
                    <Select
                      key={subCategories.length > 0 ? "loaded" : "empty"}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories.map((sub) => (
                          <SelectItem
                            className="cursor-pointer"
                            key={sub._id}
                            value={sub._id}
                          >
                            {sub.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Thumb Image</Label>
                <Controller
                  name="thumbImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Input
                  {...register("thumbImageAlt")}
                  placeholder="Thumb Image Alt"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Hover Image</Label>
                <Controller
                  name="hoverImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Input
                  {...register("hoverImageAlt")}
                  placeholder="Hover Image Alt"
                />
              </div>
            </div>

            <Divider className="my-1" />

            <div className="flex flex-col gap-2">
              <Label className="font-bold">Product Code</Label>
              <Input {...register("productCode")} placeholder="Product Code" />
            </div>

              <div className="flex items-center gap-2">
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
                <Label className="font-bold text-trim">Featured</Label>
              </div>
          </div>
        </AdminItemContainer>

        {/* First section */}
        <AdminItemContainer>
          <Label main>First Section</Label>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Description"
              />
            </div>

            <Divider />

            <div className="flex flex-col gap-4">
              <Label className="font-bold">Specs</Label>

              {/* product-specific specs, unique to this product only */}
              <div className="rounded-lg border border-secondary/30 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Product Specific Specs</Label>
                  <button
                    type="button"
                    onClick={() => customSpecsArray.append({ value: "" })}
                    className={addIconBtnClass}
                    aria-label="Add spec"
                  >
                    <RiAddLine size={18} />
                  </button>
                </div>
                {customSpecsArray.fields.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {customSpecsArray.fields.map((field, i) => (
                      <div
                        key={field.id}
                        className="flex items-center gap-2 border border-secondary rounded-lg p-2"
                      >
                        <Input
                          {...register(`specs.custom.${i}.value`)}
                          placeholder="Spec"
                        />
                        <button
                          type="button"
                          onClick={() => customSpecsArray.remove(i)}
                          className={deleteIconBtnClassSm}
                          aria-label="Remove spec"
                        >
                          <RiDeleteBinLine size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-description-color">
                    No product-specific specs added yet.
                  </p>
                )}
              </div>

              {/* common specs — managed under Products > Master Data, enabled by default */}
              <div className="rounded-lg border border-secondary/30 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm">Common Specs</Label>
                  <span className="text-xs text-description-color">
                    {commonSpecs.filter((cs) => {
                      const entry = watchedCommonSpecs?.find(
                        (c) => c.spec === cs._id,
                      );
                      return entry ? entry.enabled : true;
                    }).length}{" "}
                    of {commonSpecs.length} enabled
                  </span>
                </div>
                {commonSpecs.length === 0 ? (
                  <p className="text-sm text-description-color">
                    No common specs added yet. Add some under Products →
                    Master Data.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {commonSpecs.map((cs) => {
                      const entry = watchedCommonSpecs?.find(
                        (c) => c.spec === cs._id,
                      );
                      const enabled = entry ? entry.enabled : true;
                      return (
                        <button
                          key={cs._id}
                          type="button"
                          onClick={() => toggleCommonSpec(cs._id, !enabled)}
                          className={`flex items-center gap-1.5 text-sm rounded-md px-3 py-1.5 border transition-all cursor-pointer ${
                            enabled
                              ? "bg-primary text-white border-primary"
                              : "border-secondary/60 text-description-color hover:border-primary/50"
                          }`}
                        >
                          {enabled && <RiCheckLine size={14} />}
                          {cs.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <Divider />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="font-bold">Images</Label>
                <button
                  type="button"
                  onClick={() => imagesArray.append({ image: "", imageAlt: "" })}
                  className={addIconBtnClass}
                  aria-label="Add image"
                >
                  <RiAddLine size={18} />
                </button>
              </div>
              <MultiImageUploader
                onUpload={(urls) =>
                  urls.forEach((url) =>
                    imagesArray.append({ image: url, imageAlt: "" }),
                  )
                }
              />
              <div className="grid grid-cols-4 gap-4">
                {imagesArray.fields.map((field, i) => (
                  <div
                    key={field.id}
                    className="flex flex-col gap-2 p-2 rounded-lg border border-secondary/20"
                  >
                    <Controller
                      name={`images.${i}.image`}
                      control={control}
                      render={({ field }) => (
                        <ImageUploader
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                    <Input
                      {...register(`images.${i}.imageAlt`)}
                      placeholder="Image Alt"
                    />
                    <button
                      type="button"
                      onClick={() => imagesArray.remove(i)}
                      className="flex items-center justify-center gap-1 text-xs rounded-md py-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <RiDeleteBinLine size={14} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Divider />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="font-bold">Photometric Images</Label>
                <button
                  type="button"
                  onClick={() =>
                    photometricsArray.append({
                      image: "",
                      imageAlt: "",
                      name: "",
                    })
                  }
                  className={addIconBtnClass}
                  aria-label="Add photometric image"
                >
                  <RiAddLine size={18} />
                </button>
              </div>
              {photometricsArray.fields.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {photometricsArray.fields.map((field, i) => (
                    <div
                      key={field.id}
                      className="flex flex-col gap-2 p-2 rounded-lg border border-secondary/20"
                    >
                      <Controller
                        name={`photometrics.${i}.image`}
                        control={control}
                        render={({ field }) => (
                          <ImageUploader
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      <Input
                        {...register(`photometrics.${i}.name`)}
                        placeholder="Name"
                      />
                      <Input
                        {...register(`photometrics.${i}.imageAlt`)}
                        placeholder="Image Alt"
                      />
                      <button
                        type="button"
                        onClick={() => photometricsArray.remove(i)}
                        className="flex items-center justify-center gap-1 text-xs rounded-md py-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <RiDeleteBinLine size={14} />
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-description-color">
                  No photometric images added yet.
                </p>
              )}
            </div>
          </div>
        </AdminItemContainer>

        {/* Second section — configurations */}
        <AdminItemContainer>
          <Label main>Second Section</Label>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Title</Label>
              <Input {...register("secondSection.title")} placeholder="Title" />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Description</Label>
              <Textarea
                {...register("secondSection.description")}
                placeholder="Description"
              />
            </div>

            <Divider />

            {/* common config categories — managed under Products > Configuration, enabled by default */}
            <div className="rounded-lg border border-secondary/30 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm">Common Configurations</Label>
                <span className="text-xs text-description-color">
                  {
                    commonConfigCategories.filter((cc) => {
                      const entry = watchedCommonConfigurations?.find(
                        (c) => c.category === cc._id,
                      );
                      return entry ? entry.enabled : true;
                    }).length
                  }{" "}
                  of {commonConfigCategories.length} enabled
                </span>
              </div>
              {commonConfigCategories.length === 0 ? (
                <p className="text-sm text-description-color">
                  No common config categories added yet. Add some under
                  Products → Configuration.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {commonConfigCategories.map((cc) => {
                    const entry = watchedCommonConfigurations?.find(
                      (c) => c.category === cc._id,
                    );
                    const enabled = entry ? entry.enabled : true;
                    return (
                      <button
                        key={cc._id}
                        type="button"
                        onClick={() =>
                          toggleCommonConfiguration(cc._id, !enabled)
                        }
                        className={`flex items-center gap-1.5 text-sm rounded-md px-3 py-1.5 border transition-all cursor-pointer ${
                          enabled
                            ? "bg-primary text-white border-primary"
                            : "border-secondary/60 text-description-color hover:border-primary/50"
                        }`}
                      >
                        {enabled && <RiCheckLine size={14} />}
                        {cc.title}
                      </button>
                    );
                  })}
                </div>
              )}
              <span className="text-xs text-description-color">
                Includes the category and every one of its current options.
                Untick to exclude it from this product.
              </span>
            </div>

            <Divider />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Label className="font-bold">Configurations</Label>
                <CustomButton
                  variant="3"
                  type="button"
                  text="Add Configuration"
                  showIcon={false}
                  onClick={() =>
                    configArray.append({
                      category: "",
                      options: [],
                      defaultOption: "",
                    })
                  }
                />
              </div>

              {configArray.fields.map((field, i) => {
                const selectedConfigCategory = watch(
                  `secondSection.configurations.${i}.category`,
                );
                const selectedOptions =
                  watch(`secondSection.configurations.${i}.options`) ?? [];
                const availableOptions = selectedConfigCategory
                  ? (optionsByCategory[selectedConfigCategory] ?? [])
                  : [];
                const searchTerm = optionSearch[field.id] ?? "";
                const filteredOptions = searchTerm
                  ? availableOptions.filter((opt) =>
                      opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                  : availableOptions;

                // categories already picked in OTHER rows — hide them from
                // this row's dropdown so the same category can't be added twice
                const usedElsewhere = new Set(
                  (watchedConfigurations ?? [])
                    .filter((_, idx) => idx !== i)
                    .map((c) => c?.category)
                    .filter(Boolean),
                );
                const selectableConfigCategories = configCategories.filter(
                  (cc) =>
                    cc._id === selectedConfigCategory ||
                    (!cc.isCommon && !usedElsewhere.has(cc._id)),
                );

                return (
                  <div
                    key={field.id}
                    className="border border-secondary/30 rounded-lg p-5 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <Controller
                          name={`secondSection.configurations.${i}.category`}
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(val) => {
                                field.onChange(val);
                                fetchOptionsForCategory(val);
                                setValue(
                                  `secondSection.configurations.${i}.options`,
                                  [],
                                );
                                setValue(
                                  `secondSection.configurations.${i}.defaultOption`,
                                  "",
                                );
                              }}
                            >
                              <SelectTrigger className="cursor-pointer">
                                <SelectValue placeholder="Select config category" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectableConfigCategories.length > 0 ? (
                                  selectableConfigCategories.map((cc) => (
                                    <SelectItem
                                      className="cursor-pointer"
                                      key={cc._id}
                                      value={cc._id}
                                    >
                                      {cc.title}
                                    </SelectItem>
                                  ))
                                ) : (
                                  <div className="px-2 py-1.5 text-sm text-description-color">
                                    All categories already added
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => configArray.remove(i)}
                        className={deleteIconBtnClass}
                        aria-label="Remove configuration"
                      >
                        <RiDeleteBinLine size={18} />
                      </button>
                    </div>

                    {selectedConfigCategory && (
                      <>
                        <Divider />

                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-3">
                            <Label className="text-sm">Options</Label>
                            <span className="text-xs text-description-color">
                              {selectedOptions.length} selected
                            </span>
                          </div>

                          {availableOptions.length > 5 && (
                            <div className="relative">
                              <RiSearchLine
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-description-color"
                              />
                              <Input
                                value={searchTerm}
                                onChange={(e) =>
                                  setOptionSearch((prev) => ({
                                    ...prev,
                                    [field.id]: e.target.value,
                                  }))
                                }
                                placeholder="Search options..."
                                className="pl-9"
                              />
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                            {filteredOptions.length > 0 ? (
                              filteredOptions.map((opt) => {
                                const isChecked = selectedOptions.includes(
                                  opt._id,
                                );
                                return (
                                  <button
                                    key={opt._id}
                                    type="button"
                                    onClick={() => {
                                      const next = isChecked
                                        ? selectedOptions.filter(
                                            (o) => o !== opt._id,
                                          )
                                        : [...selectedOptions, opt._id];
                                      setValue(
                                        `secondSection.configurations.${i}.options`,
                                        next,
                                      );

                                      // clear the default back to "no default"
                                      // if the option it pointed to was removed
                                      const currentDefault = watch(
                                        `secondSection.configurations.${i}.defaultOption`,
                                      );
                                      if (isChecked && currentDefault === opt._id) {
                                        setValue(
                                          `secondSection.configurations.${i}.defaultOption`,
                                          "",
                                        );
                                      }
                                    }}
                                    className={`text-sm rounded-md px-3 py-1.5 border transition-all cursor-pointer ${
                                      isChecked
                                        ? "bg-primary text-white border-primary"
                                        : "border-secondary/60 hover:border-primary/50"
                                    }`}
                                  >
                                    {opt.label}
                                  </button>
                                );
                              })
                            ) : (
                              <p className="text-sm text-description-color py-1">
                                No options match “{searchTerm}”.
                              </p>
                            )}
                          </div>
                        </div>

                        {selectedOptions.length > 0 && (
                          <div className="flex flex-col gap-2">
                            <Label className="text-sm">Default Option</Label>
                            <Controller
                              name={`secondSection.configurations.${i}.defaultOption`}
                              control={control}
                              render={({ field }) => (
                                <Select
                                  value={field.value || NO_DEFAULT_OPTION}
                                  onValueChange={(val) =>
                                    field.onChange(
                                      val === NO_DEFAULT_OPTION ? "" : val,
                                    )
                                  }
                                >
                                  <SelectTrigger className="cursor-pointer">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      className="cursor-pointer"
                                      value={NO_DEFAULT_OPTION}
                                    >
                                      No default option needed
                                    </SelectItem>
                                    {availableOptions
                                      .filter((o) =>
                                        selectedOptions.includes(o._id),
                                      )
                                      .map((o) => (
                                        <SelectItem
                                          className="cursor-pointer"
                                          key={o._id}
                                          value={o._id}
                                        >
                                          {o.label}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </AdminItemContainer>

        {/* Third section */}
        <AdminItemContainer>
          <Label main>Third Section</Label>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Title</Label>
              <Input {...register("thirdSection.title")} placeholder="Title" />
            </div>

            <Divider />

            <div className="flex items-center justify-between">
              <Label className="font-bold">Items</Label>
              <CustomButton
                variant="3"
                type="button"
                text="Add Item"
                showIcon={false}
                onClick={() =>
                  sectionItemsArray.append({ title: "", items: [] })
                }
              />
            </div>

            <div className="flex flex-col gap-4">
              {sectionItemsArray.fields.map((field, i) => (
                <ThirdSectionItem
                  key={field.id}
                  control={control}
                  register={register}
                  index={i}
                  onRemove={() => sectionItemsArray.remove(i)}
                />
              ))}
            </div>
          </div>
        </AdminItemContainer>

        {/* Fourth section — downloadable resource tiles */}
        <AdminItemContainer>
          <Label main>Fourth Section</Label>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <Label className="font-bold">Tiles</Label>
              <CustomButton
                variant="3"
                type="button"
                text="Add Tile"
                showIcon={false}
                onClick={() =>
                  fourthSectionArray.append({ title: "", items: [] })
                }
              />
            </div>

            <div className="flex flex-col gap-4">
              {fourthSectionArray.fields.map((field, i) => (
                <FourthSectionTile
                  key={field.id}
                  control={control}
                  register={register}
                  setValue={setValue}
                  getValues={getValues}
                  watch={watch}
                  index={i}
                  onRemove={() => fourthSectionArray.remove(i)}
                />
              ))}
            </div>
            {fourthSectionArray.fields.length === 0 && (
              <p className="text-sm text-description-color">
                No tiles added yet.
              </p>
            )}
          </div>
        </AdminItemContainer>

        {/* Datasheet */}
        <AdminItemContainer>
          <Label main>Datasheet</Label>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Datasheet Image</Label>
              <Controller
                name="datasheet.image"
                control={control}
                render={({ field }) => (
                  <ImageUploader value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            <Divider />

            <div className="flex flex-col gap-2">
              <Label className="font-bold">Installation Guide</Label>
              <span className="text-xs text-description-color">
                Used by the QR code on the generated datasheet PDF — the QR
                only appears when a guide is uploaded here.
              </span>
              <Controller
                name="datasheet.installationGuide.link"
                control={control}
                render={({ field }) => (
                  <FileUploader
                    value={field.value}
                    onChange={(url, _fileName, size) => {
                      field.onChange(url);
                      setValue("datasheet.installationGuide.size", size);
                    }}
                  />
                )}
              />
              {watch("datasheet.installationGuide.size") ? (
                <span className="text-xs text-description-color">
                  {watch("datasheet.installationGuide.size")}
                </span>
              ) : null}
            </div>

            <Divider />

            <div className="flex flex-col gap-4">
              <Label className="font-bold">Icons</Label>

              {/* common icons — managed under Products > Master Data > Icons, enabled by default */}
              <div className="rounded-lg border border-secondary/30 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm">Common Icons</Label>
                  <span className="text-xs text-description-color">
                    {commonIcons.filter((ci) => {
                      const entry = watchedCommonIcons?.find(
                        (c) => c.icon === ci._id,
                      );
                      return entry ? entry.enabled : true;
                    }).length}{" "}
                    of {commonIcons.length} enabled
                  </span>
                </div>
                {commonIcons.length === 0 ? (
                  <p className="text-sm text-description-color">
                    No common icons added yet. Add some under Products →
                    Master Data → Icons.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {commonIcons.map((ci) => {
                      const entry = watchedCommonIcons?.find(
                        (c) => c.icon === ci._id,
                      );
                      const enabled = entry ? entry.enabled : true;
                      return (
                        <button
                          key={ci._id}
                          type="button"
                          onClick={() => toggleCommonIcon(ci._id, !enabled)}
                          className={`relative flex items-center justify-center h-14 w-14 rounded-lg border transition-all cursor-pointer ${
                            enabled
                              ? "border-primary ring-1 ring-primary"
                              : "border-secondary/40 opacity-50 hover:opacity-80"
                          }`}
                        >
                          {ci.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={ci.image}
                              alt=""
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          {enabled && (
                            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-4 w-4 rounded-full bg-primary text-white">
                              <RiCheckLine size={11} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* product-specific icons, picked from the non-common master list */}
              <div className="rounded-lg border border-secondary/30 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <Label className="text-sm">Product Specific Icons</Label>
                  <span className="text-xs text-description-color">
                    {watchedSpecificIcons?.length ?? 0} of{" "}
                    {nonCommonIcons.length} selected
                  </span>
                </div>
                {nonCommonIcons.length === 0 ? (
                  <p className="text-sm text-description-color">
                    No non-common icons added yet. Add some under Products →
                    Master Data → Icons.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {nonCommonIcons.map((ci) => {
                      const selected = !!watchedSpecificIcons?.includes(
                        ci._id,
                      );
                      return (
                        <button
                          key={ci._id}
                          type="button"
                          onClick={() => toggleSpecificIcon(ci._id)}
                          className={`relative flex items-center justify-center h-14 w-14 rounded-lg border transition-all cursor-pointer ${
                            selected
                              ? "border-primary ring-1 ring-primary"
                              : "border-secondary/40 opacity-50 hover:opacity-80"
                          }`}
                        >
                          {ci.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={ci.image}
                              alt=""
                              className="w-8 h-8 object-contain"
                            />
                          )}
                          {selected && (
                            <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-4 w-4 rounded-full bg-primary text-white">
                              <RiCheckLine size={11} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </AdminItemContainer>

        <div className="fixed top-2 right-8 z-50 flex gap-5">
          <CustomButton
            iconDirection="down"
            imageClass="!-rotate-135"
            variant="2"
            type="button"
            text="Back to Products"
            onClick={() => router.back()}
          />
          <CustomButton
            variant="3"
            type="submit"
            text={isSaving ? "Saving..." : "Page Submit"}
            showIcon={false}
          />
        </div>
      </form>
    </div>
  );
}

function ThirdSectionItem({
  control,
  register,
  index,
  onRemove,
}: {
  control: any;
  register: any;
  index: number;
  onRemove: () => void;
}) {
  const subItems = useFieldArray({
    control,
    name: `thirdSection.items.${index}.items`,
  });

  return (
    <div className="border border-secondary/30 rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          {...register(`thirdSection.items.${index}.title`)}
          placeholder="Item Title"
        />
        <button
          type="button"
          onClick={onRemove}
          className={deleteIconBtnClass}
          aria-label="Remove item"
        >
          <RiDeleteBinLine size={18} />
        </button>
      </div>

      <Divider />

      <div className="flex flex-col gap-2">
        {subItems.fields.map((f, j) => (
          <div key={f.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
            <Input
              {...register(`thirdSection.items.${index}.items.${j}.key`)}
              placeholder="Key"
            />
            <Input
              {...register(`thirdSection.items.${index}.items.${j}.value`)}
              placeholder="Value"
            />
            <button
              type="button"
              onClick={() => subItems.remove(j)}
              className={deleteIconBtnClassSm}
              aria-label="Remove key/value"
            >
              <RiDeleteBinLine size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => subItems.append({ key: "", value: "" })}
          className="flex items-center gap-1.5 text-sm text-primary self-start mt-1 hover:underline cursor-pointer"
        >
          <RiAddLine size={16} />
          Add key/value
        </button>
      </div>
    </div>
  );
}

function FourthSectionTile({
  control,
  register,
  setValue,
  getValues,
  watch,
  index,
  onRemove,
}: {
  control: any;
  register: any;
  setValue: any;
  getValues: any;
  watch: any;
  index: number;
  onRemove: () => void;
}) {
  const itemsArray = useFieldArray({
    control,
    name: `fourthSection.${index}.items`,
  });

  return (
    <div className="border border-secondary/30 rounded-lg p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Input
          {...register(`fourthSection.${index}.title`)}
          placeholder="Tile Title"
        />
        <button
          type="button"
          onClick={onRemove}
          className={deleteIconBtnClass}
          aria-label="Remove tile"
        >
          <RiDeleteBinLine size={18} />
        </button>
      </div>

      <Divider />

      <div className="flex items-center justify-between">
        <Label className="text-sm">Items</Label>
        <button
          type="button"
          onClick={() =>
            itemsArray.append({ title: "", link: "", size: "" })
          }
          className={addIconBtnClass}
          aria-label="Add item"
        >
          <RiAddLine size={18} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {itemsArray.fields.map((field, j) => (
          <FourthSectionItem
            key={field.id}
            control={control}
            register={register}
            setValue={setValue}
            getValues={getValues}
            watch={watch}
            tileIndex={index}
            itemIndex={j}
            onRemove={() => itemsArray.remove(j)}
          />
        ))}
      </div>
      {itemsArray.fields.length === 0 && (
        <p className="text-sm text-description-color">
          No items added yet.
        </p>
      )}
    </div>
  );
}

function FourthSectionItem({
  control,
  register,
  setValue,
  getValues,
  watch,
  tileIndex,
  itemIndex,
  onRemove,
}: {
  control: any;
  register: any;
  setValue: any;
  getValues: any;
  watch: any;
  tileIndex: number;
  itemIndex: number;
  onRemove: () => void;
}) {
  const path = `fourthSection.${tileIndex}.items.${itemIndex}` as const;
  const size = watch(`${path}.size`);

  return (
    <div className="border border-secondary/30 rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <Input
          {...register(`${path}.title`)}
          placeholder="Item Title"
        />
        <button
          type="button"
          onClick={onRemove}
          className={deleteIconBtnClassSm}
          aria-label="Remove item"
        >
          <RiDeleteBinLine size={16} />
        </button>
      </div>

      <Controller
        name={`${path}.link`}
        control={control}
        render={({ field }) => (
          <FileUploader
            value={field.value}
            onChange={(url, fileName, fileSize) => {
              field.onChange(url);
              setValue(`${path}.size`, fileSize);
              if (!getValues(`${path}.title`)) {
                setValue(`${path}.title`, fileName);
              }
            }}
          />
        )}
      />
      {size ? (
        <span className="text-xs text-description-color">{size}</span>
      ) : null}
    </div>
  );
}