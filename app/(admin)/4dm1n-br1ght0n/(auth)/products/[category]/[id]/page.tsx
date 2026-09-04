"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { RiDeleteBinLine, RiAddLine, RiSearchLine } from "react-icons/ri";

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
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import CustomButton from "@/app/components/client/common/CustomButton";

type ConfigCategory = {
  _id: string;
  title: string;
  previewType: string;
};
type ConfigOption = { _id: string; label: string; code: string };
type SubCategoryOption = { _id: string; title: string };

type ProductForm = {
  title: string;
  category: string;
  subCategory: string;
  thumbImage: string;
  thumbImageAlt: string;
  hoverImage: string;
  hoverImageAlt: string;
  productCode: string;
  description: string;
  stats: { value: string }[];
  images: { value: string }[];
  secondSection: {
    title: string;
    description: string;
    configurations: {
      category: string;
      options: string[];
      defaultOption: string;
    }[];
  };
  thirdSection: {
    title: string;
    items: {
      title: string;
      items: { key: string; value: string }[];
    }[];
  };
};

const defaultValues: ProductForm = {
  title: "",
  category: "",
  subCategory: "",
  thumbImage: "",
  thumbImageAlt: "",
  hoverImage: "",
  hoverImageAlt: "",
  productCode: "",
  description: "",
  stats: [],
  images: [],
  secondSection: { title: "", description: "", configurations: [] },
  thirdSection: { title: "", items: [] },
};

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

  const { register, control, handleSubmit, reset, watch, setValue } =
    useForm<ProductForm>({ defaultValues });
  const [isSaving, setIsSaving] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategoryOption[]>([]);
  const [configCategories, setConfigCategories] = useState<ConfigCategory[]>(
    [],
  );
  const [optionsByCategory, setOptionsByCategory] = useState<
    Record<string, ConfigOption[]>
  >({});
  // per-config-row search term, keyed by the useFieldArray field id
  const [optionSearch, setOptionSearch] = useState<Record<string, string>>(
    {},
  );

  const statsArray = useFieldArray({ control, name: "stats" });
  const imagesArray = useFieldArray({ control, name: "images" });
  const configArray = useFieldArray({
    control,
    name: "secondSection.configurations",
  });
  const sectionItemsArray = useFieldArray({
    control,
    name: "thirdSection.items",
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
        stats: (data.stats ?? []).map((v: string) => ({ value: v })),
        images: (data.images ?? []).map((v: string) => ({ value: v })),
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
        },
        thirdSection: {
          title: data.thirdSection?.title ?? "",
          items: data.thirdSection?.items ?? [],
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
        stats: formData.stats.map((s) => s.value),
        images: formData.images.map((i) => i.value),
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

  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Key Details */}
        <AdminItemContainer expansion={false}>
          <Label main>Key Details</Label>
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
                <Label className="font-bold">Subcategory</Label>
                <Controller
                  name="subCategory"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories.map((sub) => (
                          <SelectItem key={sub._id} value={sub._id}>
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

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="font-bold">Stats</Label>
                <button
                  type="button"
                  onClick={() => statsArray.append({ value: "" })}
                  className={addIconBtnClass}
                  aria-label="Add stat"
                >
                  <RiAddLine size={18} />
                </button>
              </div>
              {statsArray.fields.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {statsArray.fields.map((field, i) => (
                    <div key={field.id} className="flex items-center gap-2 border border-secondary rounded-lg p-2">
                      <Input
                        {...register(`stats.${i}.value`)}
                        placeholder="Stat"
                      />
                      <button
                        type="button"
                        onClick={() => statsArray.remove(i)}
                        className={deleteIconBtnClassSm}
                        aria-label="Remove stat"
                      >
                        <RiDeleteBinLine size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Divider />

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label className="font-bold">Images</Label>
                <button
                  type="button"
                  onClick={() => imagesArray.append({ value: "" })}
                  className={addIconBtnClass}
                  aria-label="Add image"
                >
                  <RiAddLine size={18} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {imagesArray.fields.map((field, i) => (
                  <div
                    key={field.id}
                    className="flex flex-col gap-2 p-2 rounded-lg border border-secondary/20"
                  >
                    <Controller
                      name={`images.${i}.value`}
                      control={control}
                      render={({ field }) => (
                        <ImageUploader
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
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
                              <SelectTrigger>
                                <SelectValue placeholder="Select config category" />
                              </SelectTrigger>
                              <SelectContent>
                                {configCategories.map((cc) => (
                                  <SelectItem key={cc._id} value={cc._id}>
                                    {cc.title}
                                  </SelectItem>
                                ))}
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
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select default" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableOptions
                                      .filter((o) =>
                                        selectedOptions.includes(o._id),
                                      )
                                      .map((o) => (
                                        <SelectItem key={o._id} value={o._id}>
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