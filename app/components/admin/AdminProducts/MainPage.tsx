"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { RiDeleteBinLine, RiPencilLine } from "react-icons/ri";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomButton from "../../client/common/CustomButton";
import { VideoUploader } from "@/components/ui/video-uploader";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "../common/AdminItemContainer";
import TooltipPreview from "../../client/product-details/sections/ProductConfiguration/ToolTip";

type Category = {
  _id: string;
  title: string;
  slug: string;
  homeSection: {
    description: string;
    video: string;
    videoAlt: string;
    posterImage: string;
    posterImageAlt: string;
    btnText: string;
    btnLink: string;
  };
};
type ConfigCategory = {
  _id: string;
  title: string;
  previewType: "none" | "shape" | "swatch" | "size" | "beam" | "gradient";
};
type ConfigOption = {
  _id: string;
  category: string | ConfigCategory;
  label: string;
  code: string;
  swatchColor?: string;
  tooltip: {
    label: string;
    meta?: string;
    preview: {
      type: string;
      shape?: string;
      color?: string;
      gradient?: string;
      sizeBox?: { width?: number; height?: number };
      beamAngle?: number;
    };
  };
};

type DeleteTarget = {
  type: "category" | "configCategory" | "configOption";
  id: string;
  label: string;
};

const deleteLabels: Record<DeleteTarget["type"], string> = {
  category: "Category",
  configCategory: "Config Category",
  configOption: "Config Option",
};

const shapeOptions = [
  "round",
  "square",
  "round-thick",
  "square-thick",
  "circle-dot",
  "trimless",
  "trim",
];

const previewTypeOptions = [
  "none",
  "shape",
  "swatch",
  "size",
  "beam",
  "gradient",
];

function PreviewTypeIcon({ type }: { type: string }) {
  const base =
    "w-12 h-12 shrink-0 rounded-[4px] bg-[#161618] border border-[#2A2A2A] flex items-center justify-center overflow-hidden";

  switch (type) {
    case "shape":
      return (
        <div className={base}>
          <div className="w-5 h-5 rounded-full border-[1.5px] border-white" />
        </div>
      );
    case "swatch":
      return (
        <div className={base}>
          <div
            className="w-5 h-5 rounded-full border border-white/30"
            style={{
              background: "linear-gradient(180deg, #E6D196 0%, #C0A351 100%)",
            }}
          />
        </div>
      );
    case "size":
      return (
        <div className={base}>
          <div className="w-5 h-4 border border-white" />
        </div>
      );
    case "beam":
      return (
        <div className={base}>
          <svg viewBox="0 0 20 16" width={35} height={25}>
            <circle cx="10" cy="2" r="1.3" fill="#FFFFFF" />
            <polygon
              points="10,3 4,14 16,14"
              stroke="#FFFFFF"
              strokeWidth="0.6"
              fill="rgba(255,255,255,0.18)"
            />
          </svg>
        </div>
      );
    case "gradient":
      return (
        <div className={base}>
          <div
            className="w-full h-full"
            style={{
              background: "linear-gradient(135deg, #FFD9A8, #FFB76A)",
            }}
          />
        </div>
      );
    default:
      return (
        <div className={base}>
          <div className="w-5 h-[1.5px] bg-white/40" />
        </div>
      );
  }
}

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

export default function ProductsMainPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [configCategories, setConfigCategories] = useState<ConfigCategory[]>(
    [],
  );
  const [configOptions, setConfigOptions] = useState<ConfigOption[]>([]);

  const [activeConfigCategoryId, setActiveConfigCategoryId] = useState<
    string | null
  >(null);

  const [categoryDialog, setCategoryDialog] = useState<Category | null | "new">(
    null,
  );
  const [configCategoryDialog, setConfigCategoryDialog] = useState<
    ConfigCategory | null | "new"
  >(null);
  const [configOptionDialog, setConfigOptionDialog] = useState<
    ConfigOption | null | "new"
  >(null);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/products/category");
    setCategories(await res.json());
  };

  const fetchConfigCategories = async () => {
    const res = await fetch("/api/admin/products/config-category");
    const data = await res.json();
    setConfigCategories(data);
    if (!activeConfigCategoryId && data.length) {
      setActiveConfigCategoryId(data[0]._id);
    }
  };

  const fetchConfigOptions = async (categoryId: string) => {
    const res = await fetch(
      `/api/admin/products/config-option?category=${categoryId}`,
    );
    setConfigOptions(await res.json());
  };

  useEffect(() => {
    fetchCategories();
    fetchConfigCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeConfigCategoryId) fetchConfigOptions(activeConfigCategoryId);
  }, [activeConfigCategoryId]);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;

    const endpointMap: Record<DeleteTarget["type"], string> = {
      category: `/api/admin/products/category/${id}`,
      configCategory: `/api/admin/products/config-category/${id}`,
      configOption: `/api/admin/products/config-option/${id}`,
    };

    try {
      const res = await fetch(endpointMap[type], { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to delete");
        return;
      }
      toast.success(`${deleteLabels[type]} deleted`);

      if (type === "category") fetchCategories();
      if (type === "configCategory") fetchConfigCategories();
      if (type === "configOption" && activeConfigCategoryId)
        fetchConfigOptions(activeConfigCategoryId);
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Categories */}
      <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-secondary pb-3">
          <Label className="!text-xl !font-semibold">
            Categories {`(${categories.length})`}
          </Label>
          <CustomButton
            variant="3"
            type="button"
            text="Add Category"
            showIcon={false}
            onClick={() => setCategoryDialog("new")}
          />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
          {categories.length === 0 && (
            <p className="text-sm text-black/40">No categories added yet.</p>
          )}
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between border border-secondary/60 rounded-md px-4 py-2"
            >
              <span className="text-md font-itc-medium">{cat.title}</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="cursor-pointer hover:scale-110 transition-all"
                  onClick={() => setCategoryDialog(cat)}
                >
                  <RiPencilLine
                    className="text-gray-500 hover:text-primary"
                    size={20}
                  />
                </button>
                <button
                  type="button"
                  className="cursor-pointer hover:scale-110 transition-all"
                  onClick={() =>
                    setDeleteTarget({
                      type: "category",
                      id: cat._id,
                      label: cat.title,
                    })
                  }
                >
                  <RiDeleteBinLine
                    className="text-red-400 hover:text-red-600"
                    size={20}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Config Categories */}
      <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-secondary pb-3">
          <Label className="!text-xl !font-semibold">
            Config Categories {`(${configCategories.length})`}
          </Label>
          <CustomButton
            variant="3"
            type="button"
            text="Add Config Category"
            showIcon={false}
            onClick={() => setConfigCategoryDialog("new")}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {configCategories.length === 0 && (
            <p className="text-sm text-black/40">
              No config categories added yet.
            </p>
          )}
          {configCategories.map((cc) => (
            <div
              key={cc._id}
              onClick={() => setActiveConfigCategoryId(cc._id)}
              className={`cursor-pointer flex items-center gap-10 border rounded-md px-4 py-2 transition-all ${
                activeConfigCategoryId === cc._id
                  ? "border-primary bg-primary text-white"
                  : "border-secondary/60"
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="text-md font-itc-medium">{cc.title}</span>
                <span className="text-xs">
                  Preview Type: {cc.previewType.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="cursor-pointer hover:scale-110 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfigCategoryDialog(cc);
                  }}
                >
                  <RiPencilLine size={16} />
                </button>
                <button
                  type="button"
                  className="cursor-pointer hover:scale-110 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget({
                      type: "configCategory",
                      id: cc._id,
                      label: cc.title,
                    });
                  }}
                >
                  <RiDeleteBinLine
                    className="text-red-400 hover:text-red-600"
                    size={16}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Config Options — scoped to selected config category */}
      {activeConfigCategoryId && (
        <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-secondary pb-3">
            <div className="flex flex-col gap-1">
              <Label className="!text-xl !font-semibold">
                Options {`(${configOptions.length})`}
              </Label>
              <span className="text-sm text-description-color">
                Adding options under{" "}
                <span className="font-itc-medium text-primary">
                  {
                    configCategories.find(
                      (c) => c._id === activeConfigCategoryId,
                    )?.title
                  }
                </span>
                {" "} category
              </span>
            </div>
            <CustomButton
              variant="3"
              type="button"
              text="Add Option"
              showIcon={false}
              onClick={() => setConfigOptionDialog("new")}
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
            {configOptions.length === 0 && (
              <p className="text-sm text-black/40">No options added yet.</p>
            )}
            {configOptions.map((opt) => (
              <div
                key={opt._id}
                className="flex items-center justify-between border border-secondary/60 rounded-md px-4 py-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-[80px] h-[56px] p-4 shrink-0 flex items-center justify-center rounded-[6px] bg-[#161618] border border-[#2A2A2A] overflow-hidden">
                    <TooltipPreview preview={opt.tooltip.preview} />
                  </div>
                  <span className="text-md font-itc-medium flex items-center gap-3">
                    {opt.swatchColor && (
                      <span
                        className="h-5 w-5 rounded-full border border-secondary/40 shrink-0"
                        style={{ background: opt.swatchColor }}
                      />
                    )}
                    <span className="flex flex-col">
                      {opt.label}
                      <span className="text-sm text-description-color font-itc-book">
                        {opt.code}
                      </span>
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="cursor-pointer hover:scale-110 transition-all"
                    onClick={() => setConfigOptionDialog(opt)}
                  >
                    <RiPencilLine
                      className="text-gray-500 hover:text-primary"
                      size={20}
                    />
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer hover:scale-110 transition-all"
                    onClick={() =>
                      setDeleteTarget({
                        type: "configOption",
                        id: opt._id,
                        label: opt.label,
                      })
                    }
                  >
                    <RiDeleteBinLine
                      className="text-red-400 hover:text-red-600"
                      size={20}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- Dialogs ---- */}
      {categoryDialog !== null && (
        <CategoryFormDialog
          initial={categoryDialog === "new" ? null : categoryDialog}
          onClose={() => setCategoryDialog(null)}
          onSaved={() => {
            setCategoryDialog(null);
            fetchCategories();
          }}
        />
      )}

      {configCategoryDialog !== null && (
        <ConfigCategoryFormDialog
          initial={configCategoryDialog === "new" ? null : configCategoryDialog}
          onClose={() => setConfigCategoryDialog(null)}
          onSaved={() => {
            setConfigCategoryDialog(null);
            fetchConfigCategories();
          }}
        />
      )}

      {configOptionDialog !== null && activeConfigCategoryId && (
        <ConfigOptionFormDialog
          initial={configOptionDialog === "new" ? null : configOptionDialog}
          categoryId={activeConfigCategoryId}
          previewType={
            configCategories.find((c) => c._id === activeConfigCategoryId)
              ?.previewType ?? "none"
          }
          onClose={() => setConfigOptionDialog(null)}
          onSaved={() => {
            setConfigOptionDialog(null);
            fetchConfigOptions(activeConfigCategoryId);
          }}
        />
      )}

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="!text-xl !font-itc-medium">
              Delete {deleteTarget ? deleteLabels[deleteTarget.type] : ""}
            </DialogTitle>
          </DialogHeader>
          <p className="text-md text-description-color">
            Are you sure you want to delete{" "}
            <span className="font-semibold font-tasa text-primary font-itc-medium">
              {deleteTarget?.label}
            </span>
            ? This cannot be undone.
          </p>
          <DialogFooter>
            <CustomButton
              variant="2"
              type="button"
              text="Cancel"
              showIcon={false}
              onClick={() => setDeleteTarget(null)}
            />
            <CustomButton
              variant="3"
              type="button"
              text="Delete"
              showIcon={false}
              onClick={confirmDelete}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* CATEGORY DIALOG                                                            */
/* -------------------------------------------------------------------------- */

function CategoryFormDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial: Category | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { register, control, handleSubmit, setValue, watch } =
    useForm<Category>({
      defaultValues: {
        title: initial?.title ?? "",
        slug: initial?.slug ?? "",
        homeSection: {
          description: initial?.homeSection.description ?? "",
          video: initial?.homeSection.video ?? "",
          videoAlt: initial?.homeSection.videoAlt ?? "",
          posterImage: initial?.homeSection.posterImage ?? "",
          posterImageAlt: initial?.homeSection.posterImageAlt ?? "",
          btnText: initial?.homeSection.btnText ?? "",
          btnLink: initial?.homeSection.btnLink ?? "",
        },
      },
    });
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data: Category) => {
    setIsSaving(true);
    try {
      const res = initial
        ? await fetch(`/api/admin/products/category/${initial._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        : await fetch("/api/admin/products/category", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
      if (!res.ok) return toast.error("Failed to save category");
      toast.success(initial ? "Category updated" : "Category added");
      onSaved();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="min-w-[50vw]">
        <DialogHeader>
          <DialogTitle className="!text-xl !font-itc-medium">
            {initial ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 "
        >
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Title</Label>
            <Input {...register("title")} placeholder="Title" />
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
                onClick={() =>
                  setValue(
                    "slug",
                    watch("title")
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-"),
                  )
                }
              />
            </div>
          </div>

          <AdminItemContainer>
            <div className="flex flex-col gap-2">
              <Label main className="font-bold">
                Home Page Section
              </Label>
            </div>
            <div className="p-5">
              <div className="flex flex-col gap-2 mb-5">
                <Label className="font-bold">Description</Label>
                <Textarea
                  {...register("homeSection.description")}
                  placeholder="Description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Video</Label>
                    <Controller
                      name="homeSection.video"
                      control={control}
                      render={({ field }) => (
                        <VideoUploader
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Video Alt</Label>
                    <Input
                      {...register("homeSection.videoAlt")}
                      placeholder="Video Alt"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Poster Image</Label>
                    <Controller
                      name="homeSection.posterImage"
                      control={control}
                      render={({ field }) => (
                        <ImageUploader
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Poster Image Alt</Label>
                    <Input
                      {...register("homeSection.posterImageAlt")}
                      placeholder="Poster Image Alt"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Button Text</Label>
                  <Input
                    {...register("homeSection.btnText")}
                    placeholder="Button Text"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Button Link</Label>
                  <Input
                    {...register("homeSection.btnLink")}
                    placeholder="Button Link"
                  />
                </div>
              </div>
            </div>
          </AdminItemContainer>
          <DialogFooter>
            <CustomButton
              variant="2"
              type="button"
              text="Cancel"
              showIcon={false}
              onClick={onClose}
            />
            <CustomButton
              variant="3"
              type="submit"
              text={isSaving ? "Saving..." : "Save"}
              showIcon={false}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* CONFIG CATEGORY DIALOG                                                     */
/* -------------------------------------------------------------------------- */

function ConfigCategoryFormDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial: ConfigCategory | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  type FormValues = { title: string; previewType: string };

  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: initial?.title ?? "",
      previewType: initial?.previewType ?? "none",
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      const res = initial
        ? await fetch(`/api/admin/products/config-category/${initial._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        : await fetch("/api/admin/products/config-category", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
      if (!res.ok) return toast.error("Failed to save config category");
      toast.success(
        initial ? "Config category updated" : "Config category added",
      );
      onSaved();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="!text-xl !font-itc-medium">
            {initial ? "Edit Config Category" : "Add Config Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Title</Label>
            <Input
              {...register("title")}
              placeholder="e.g. Form, Wattage"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Preview Type</Label>
              <Controller
                name="previewType"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-15">
                      <SelectValue placeholder="Select preview type">
                        {field.value && (
                          <div className="flex items-center gap-2.5">
                            <PreviewTypeIcon type={field.value} />
                            <span className="capitalize">{field.value}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {previewTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2.5">
                            <PreviewTypeIcon type={type} />
                            <span className="capitalize">{type}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
          </div>
          <DialogFooter>
            <CustomButton
              variant="2"
              type="button"
              text="Cancel"
              showIcon={false}
              onClick={onClose}
            />
            <CustomButton
              variant="3"
              type="submit"
              text={isSaving ? "Saving..." : "Save"}
              showIcon={false}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* CONFIG OPTION DIALOG — fields shown conditionally by previewType           */
/* -------------------------------------------------------------------------- */

function ConfigOptionFormDialog({
  initial,
  categoryId,
  previewType,
  onClose,
  onSaved,
}: {
  initial: ConfigOption | null;
  categoryId: string;
  previewType: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  type FormValues = {
    label: string;
    code: string;
    swatchColor: string;
    tooltipLabel: string;
    tooltipMeta: string;
    shape: string;
    color: string;
    gradient: string;
    sizeWidth: string;
    sizeHeight: string;
    beamAngle: string;
  };

  const { register, control, handleSubmit, watch, setValue } =
    useForm<FormValues>({
      defaultValues: {
        label: initial?.label ?? "",
        code: initial?.code ?? "",
        swatchColor: initial?.swatchColor ?? "",
        tooltipLabel: initial?.tooltip?.label ?? "",
        tooltipMeta: initial?.tooltip?.meta ?? "",
        shape: initial?.tooltip?.preview?.shape ?? "",
        color: initial?.tooltip?.preview?.color ?? "",
        gradient: initial?.tooltip?.preview?.gradient ?? "",
        sizeWidth: initial?.tooltip?.preview?.sizeBox?.width?.toString() ?? "",
        sizeHeight:
          initial?.tooltip?.preview?.sizeBox?.height?.toString() ?? "",
        beamAngle: initial?.tooltip?.preview?.beamAngle?.toString() ?? "",
      },
    });
  const [isSaving, setIsSaving] = useState(false);

  // tooltip.label auto-fills from label until manually edited
  const [tooltipTouched, setTooltipTouched] = useState(
    !!initial?.tooltip?.label,
  );

  const label = watch("label");
  useEffect(() => {
    if (!tooltipTouched) {
      setValue("tooltipLabel", label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label]);

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      const payload = {
        category: categoryId,
        label: data.label,
        code: data.code,
        swatchColor: data.swatchColor || undefined,
        tooltip: {
          label: data.tooltipLabel,
          meta: data.tooltipMeta || undefined,
          preview: {
            type: previewType,
            ...(previewType === "shape" && { shape: data.shape }),
            ...(previewType === "swatch" && {
              color: data.color || undefined,
              gradient: data.gradient || undefined,
            }),
            ...(previewType === "size" && {
              sizeBox: {
                width: data.sizeWidth ? Number(data.sizeWidth) : undefined,
                height: data.sizeHeight ? Number(data.sizeHeight) : undefined,
              },
            }),
            ...(previewType === "beam" && {
              beamAngle: data.beamAngle ? Number(data.beamAngle) : undefined,
            }),
            ...(previewType === "gradient" && { gradient: data.gradient }),
          },
        },
      };

      const res = initial
        ? await fetch(`/api/admin/products/config-option/${initial._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products/config-option", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) return toast.error("Failed to save option");
      toast.success(initial ? "Option updated" : "Option added");
      onSaved();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="!text-xl !font-itc-medium">
            {initial ? "Edit Option" : "Add Option"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex justify-center">
            <div className="w-[80px] h-[56px] shrink-0 flex items-center justify-center rounded-[2px] bg-[#161618] border border-[#2A2A2A] overflow-hidden">
              <TooltipPreview
                preview={{
                  type: previewType,
                  shape: watch("shape"),
                  color: watch("color"),
                  gradient: watch("gradient"),
                  sizeBox: {
                    width: Number(watch("sizeWidth")) || 0,
                    height: Number(watch("sizeHeight")) || 0,
                  },
                  beamAngle: Number(watch("beamAngle")) || 0,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Label</Label>
              <Input
                {...register("label")}
                placeholder="e.g. Matt Black"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Code</Label>
              <Input
                {...register("code")}
                placeholder="e.g. MB"
              />
            </div>
          </div>

          {previewType === "swatch" && (
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Swatch Color (dot)</Label>
              <Input
                {...register("swatchColor")}
                placeholder="e.g. linear-gradient(...)"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label className="font-bold">Tooltip Label</Label>
            <Input
              {...register("tooltipLabel")}
              onChange={(e) => {
                setTooltipTouched(true);
                setValue("tooltipLabel", e.target.value);
              }}
              placeholder="Auto-fills from Label"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Tooltip Meta</Label>
            <Input
              {...register("tooltipMeta")}
              placeholder="Optional subtitle"
            />
          </div>

          {previewType === "shape" && (
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Shape</Label>
              <Controller
                name="shape"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      {shapeOptions.map((shape) => (
                        <SelectItem key={shape} value={shape}>
                          {shape}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          {previewType === "swatch" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Preview Color</Label>
                <Input {...register("color")} placeholder="#000000" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Preview Gradient</Label>
                <Input
                  {...register("gradient")}
                  placeholder="linear-gradient(...)"
                />
              </div>
            </div>
          )}

          {previewType === "gradient" && (
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Gradient</Label>
              <Input
                {...register("gradient")}
                placeholder="linear-gradient(...)"
              />
            </div>
          )}

          {previewType === "size" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Width</Label>
                <Input
                  type="number"
                  {...register("sizeWidth")}
                  placeholder="38"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Height</Label>
                <Input
                  type="number"
                  {...register("sizeHeight")}
                  placeholder="26"
                />
              </div>
            </div>
          )}

          {previewType === "beam" && (
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Beam Angle</Label>
              <Input
                type="number"
                {...register("beamAngle")}
                placeholder="38"
              />
            </div>
          )}

          <DialogFooter>
            <CustomButton
              variant="2"
              type="button"
              text="Cancel"
              showIcon={false}
              onClick={onClose}
            />
            <CustomButton
              variant="3"
              type="submit"
              text={isSaving ? "Saving..." : "Save"}
              showIcon={false}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
