"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { RiDeleteBinLine, RiPencilLine, RiDraggable } from "react-icons/ri";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
import { Home } from "lucide-react";

const TABS = [
  { key: "category", label: "Category" },
  { key: "configuration", label: "Configuration" },
  { key: "masterData", label: "Master Data" },
  { key: "qrGenerated", label: "QR Generated" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const COMMON_DATA_SUB_TABS = [
  { key: "product", label: "Product" },
  { key: "icons", label: "Icons" },
] as const;
type CommonDataSubTabKey = (typeof COMMON_DATA_SUB_TABS)[number]["key"];

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
  order: number;
  previewType: "none" | "shape" | "swatch" | "size" | "beam" | "gradient";
  isCommon?: boolean;
};
type ConfigOption = {
  _id: string;
  category: string | ConfigCategory;
  order: number;
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

type Spec = {
  _id: string;
  label: string;
};

type Icon = {
  _id: string;
  image: string;
  isCommon?: boolean;
};

type GeneratedQr = {
  _id: string;
  product?: string;
  productTitle?: string;
  productCode?: string;
  url: string;
  image: string;
  createdAt: string;
};

type DeleteTarget = {
  type: "category" | "configCategory" | "configOption" | "spec" | "icon" | "qr";
  id: string;
  label: string;
};

const deleteLabels: Record<DeleteTarget["type"], string> = {
  category: "Category",
  configCategory: "Config Category",
  configOption: "Config Option",
  spec: "Spec",
  icon: "Icon",
  qr: "Generated QR",
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

// Narrow: 0°-24°, Medium: above 24° to 40°, Wide: above 40°
function beamClassification(angle: number) {
  if (angle <= 24) return "NARROW";
  if (angle <= 40) return "MEDIUM";
  return "WIDE";
}

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
/* SORTABLE CONFIG CATEGORY CARD                                             */
/* -------------------------------------------------------------------------- */

function SortableConfigCategoryCard({
  configCategory,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}: {
  configCategory: ConfigCategory;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: configCategory._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`cursor-pointer flex items-center gap-10 border rounded-md px-4 py-2 transition-all ${
        isActive ? "border-primary bg-primary text-white" : "border-secondary/60"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab active:cursor-grabbing touch-none"
        aria-label="Drag to reorder"
      >
        <RiDraggable size={18} />
      </button>
      <div className="flex flex-col gap-1">
        <span className="text-md font-itc-medium flex items-center gap-2">
          {configCategory.title}
          {configCategory.isCommon && (
            <span
              className={`text-[10px] font-itc-medium uppercase text-trim rounded-full px-2 py-1.5 border ml-5 ${
                isActive
                  ? "border-white text-white"
                  : "border-primary text-primary"
              }`}
            >
              Common
            </span>
          )}
        </span>
        <span className="text-xs">
          Preview Type: {configCategory.previewType.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="cursor-pointer hover:scale-110 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <RiPencilLine size={16} />
        </button>
        <button
          type="button"
          className="cursor-pointer hover:scale-110 transition-all"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <RiDeleteBinLine className="text-red-400 hover:text-red-600" size={16} />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SORTABLE CONFIG OPTION CARD                                               */
/* -------------------------------------------------------------------------- */

function SortableConfigOptionCard({
  option,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onEdit,
  onDelete,
}: {
  option: ConfigOption;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: option._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex items-center justify-between border border-secondary/60 rounded-md px-4 py-2"
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none shrink-0"
          aria-label="Drag to reorder"
        >
          <RiDraggable size={18} />
        </button>
        <div className="w-[80px] h-[56px] p-4 shrink-0 flex items-center justify-center rounded-[6px] bg-[#161618] border border-[#2A2A2A] overflow-hidden">
          <TooltipPreview preview={option.tooltip.preview} />
        </div>

        {/* hover preview — same tooltip shown to shoppers on the storefront */}
        {isHovered && (
          <div className="pointer-events-none absolute bottom-[calc(100%+10px)] left-4 z-20 flex min-w-[120px] flex-col items-center gap-2 whitespace-nowrap rounded-[8px] border border-primary bg-primary px-[14px] py-3 text-[10px] tracking-[0.05em] text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
            <TooltipPreview preview={option.tooltip.preview} />
            <span className="text-[12px] font-itc-medium uppercase tracking-[0.01em] mt-2">
              {option.tooltip.label}
            </span>
            {option.tooltip.meta && (
              <span className="text-center text-[11px] font-itc-medium tracking-[0.01em] text-white/60">
                {option.tooltip.meta}
              </span>
            )}
            <span className="absolute top-full left-6 border-[6px] border-transparent border-t-black" />
          </div>
        )}
        <span className="text-md font-itc-medium flex items-center gap-3">
          {option.swatchColor && (
            <span
              className="h-5 w-5 rounded-full border border-secondary/40 shrink-0"
              style={{ background: option.swatchColor }}
            />
          )}
          <span className="flex flex-col">
            {option.label}
            <span className="text-sm text-description-color font-itc-book">
              {option.code}
            </span>
          </span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="cursor-pointer hover:scale-110 transition-all"
          onClick={onEdit}
        >
          <RiPencilLine className="text-gray-500 hover:text-primary" size={20} />
        </button>
        <button
          type="button"
          className="cursor-pointer hover:scale-110 transition-all"
          onClick={onDelete}
        >
          <RiDeleteBinLine className="text-red-400 hover:text-red-600" size={20} />
        </button>
      </div>
    </div>
  );
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
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [icons, setIcons] = useState<Icon[]>([]);
  const [qrs, setQrs] = useState<GeneratedQr[]>([]);

  const [activeConfigCategoryId, setActiveConfigCategoryId] = useState<
    string | null
  >(null);
  const [hoveredOptionId, setHoveredOptionId] = useState<string | null>(null);

  const [categoryDialog, setCategoryDialog] = useState<Category | null | "new">(
    null,
  );
  const [configCategoryDialog, setConfigCategoryDialog] = useState<
    ConfigCategory | null | "new"
  >(null);
  const [configOptionDialog, setConfigOptionDialog] = useState<
    ConfigOption | null | "new"
  >(null);
  const [specDialog, setSpecDialog] = useState<Spec | null | "new">(null);
  const [iconDialog, setIconDialog] = useState<Icon | null | "new">(null);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("category");
  const [activeCommonDataSubTab, setActiveCommonDataSubTab] =
    useState<CommonDataSubTabKey>("product");
  const [configCategoryHasOptions, setConfigCategoryHasOptions] =
    useState(false);

  const dndSensors = useSensors(useSensor(PointerSensor));

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

  const openConfigCategoryDialog = async (cc: ConfigCategory | "new") => {
    if (cc === "new") {
      setConfigCategoryHasOptions(false);
      setConfigCategoryDialog("new");
      return;
    }
    const res = await fetch(
      `/api/admin/products/config-option?category=${cc._id}`,
    );
    const options = await res.json();
    setConfigCategoryHasOptions(options.length > 0);
    setConfigCategoryDialog(cc);
  };

  const handleConfigCategoryDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = configCategories.findIndex((c) => c._id === active.id);
    const newIndex = configCategories.findIndex((c) => c._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(configCategories, oldIndex, newIndex);
    setConfigCategories(reordered);

    const res = await fetch("/api/admin/products/config-category/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((c) => c._id) }),
    });
    if (res.ok) {
      toast.success("Config category order updated");
    } else {
      toast.error("Failed to save order");
      fetchConfigCategories();
    }
  };

  const handleConfigOptionDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = configOptions.findIndex((o) => o._id === active.id);
    const newIndex = configOptions.findIndex((o) => o._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(configOptions, oldIndex, newIndex);
    setConfigOptions(reordered);

    const res = await fetch("/api/admin/products/config-option/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((o) => o._id) }),
    });
    if (res.ok) {
      toast.success("Option order updated");
    } else {
      toast.error("Failed to save order");
      if (activeConfigCategoryId) fetchConfigOptions(activeConfigCategoryId);
    }
  };

  const fetchSpecs = async () => {
    const res = await fetch("/api/admin/products/spec");
    setSpecs(await res.json());
  };

  const fetchIcons = async () => {
    const res = await fetch("/api/admin/products/icon");
    setIcons(await res.json());
  };

  const fetchQrs = async () => {
    const res = await fetch("/api/admin/products/qr");
    setQrs(await res.json());
  };

  useEffect(() => {
    fetchCategories();
    fetchConfigCategories();
    fetchSpecs();
    fetchIcons();
    fetchQrs();
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
      spec: `/api/admin/products/spec/${id}`,
      icon: `/api/admin/products/icon/${id}`,
      qr: `/api/admin/products/qr/${id}`,
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
      if (type === "spec") fetchSpecs();
      if (type === "icon") fetchIcons();
      if (type === "qr") fetchQrs();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white border border-secondary rounded-[10px] p-2 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-itc-medium transition-all ${
              activeTab === tab.key
                ? "bg-primary text-white"
                : "text-description-color hover:bg-secondary/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category */}
      {activeTab === "category" && (
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
      )}

      {/* Configuration */}
      {activeTab === "configuration" && (
      <>
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
            onClick={() => openConfigCategoryDialog("new")}
          />
        </div>
        {configCategories.length === 0 ? (
          <p className="text-sm text-black/40">
            No config categories added yet.
          </p>
        ) : (
          <DndContext
            sensors={dndSensors}
            collisionDetection={closestCenter}
            onDragEnd={handleConfigCategoryDragEnd}
          >
            <SortableContext
              items={configCategories.map((c) => c._id)}
              strategy={rectSortingStrategy}
            >
              <div className="flex flex-wrap gap-2">
                {configCategories.map((cc) => (
                  <SortableConfigCategoryCard
                    key={cc._id}
                    configCategory={cc}
                    isActive={activeConfigCategoryId === cc._id}
                    onSelect={() => setActiveConfigCategoryId(cc._id)}
                    onEdit={() => openConfigCategoryDialog(cc)}
                    onDelete={() =>
                      setDeleteTarget({
                        type: "configCategory",
                        id: cc._id,
                        label: cc.title,
                      })
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
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
          {configOptions.length === 0 ? (
            <p className="text-sm text-black/40">No options added yet.</p>
          ) : (
            <DndContext
              sensors={dndSensors}
              collisionDetection={closestCenter}
              onDragEnd={handleConfigOptionDragEnd}
            >
              <SortableContext
                items={configOptions.map((o) => o._id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
                  {configOptions.map((opt) => (
                    <SortableConfigOptionCard
                      key={opt._id}
                      option={opt}
                      isHovered={hoveredOptionId === opt._id}
                      onHoverStart={() => setHoveredOptionId(opt._id)}
                      onHoverEnd={() => setHoveredOptionId(null)}
                      onEdit={() => setConfigOptionDialog(opt)}
                      onDelete={() =>
                        setDeleteTarget({
                          type: "configOption",
                          id: opt._id,
                          label: opt.label,
                        })
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}
      </>
      )}

      {/* Master Data */}
      {activeTab === "masterData" && (
        <>
          <div className="flex items-center gap-2 bg-white border border-secondary rounded-[10px] p-2 w-fit">
            {COMMON_DATA_SUB_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveCommonDataSubTab(tab.key)}
                className={`px-4 py-2 rounded-md text-sm font-itc-medium transition-all ${
                  activeCommonDataSubTab === tab.key
                    ? "bg-primary text-white"
                    : "text-description-color hover:bg-secondary/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Product — Specs */}
          {activeCommonDataSubTab === "product" && (
            <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-secondary pb-3">
                <div className="flex flex-col gap-1">
                  <Label className="!text-xl !font-semibold">
                    Specs {`(${specs.length})`}
                  </Label>
                  <span className="text-sm text-description-color">
                    Master list of specs available to every product. Each
                    product can enable/disable individual specs, plus add its
                    own product-specific ones.
                  </span>
                </div>
                <CustomButton
                  variant="3"
                  type="button"
                  text="Add Spec"
                  showIcon={false}
                  onClick={() => setSpecDialog("new")}
                />
              </div>
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-2">
                {specs.length === 0 && (
                  <p className="text-sm text-black/40">No specs added yet.</p>
                )}
                {specs.map((spec) => (
                  <div
                    key={spec._id}
                    className="flex items-center justify-between border border-secondary/60 rounded-md px-4 py-2"
                  >
                    <span className="text-md font-itc-medium">
                      {spec.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => setSpecDialog(spec)}
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
                            type: "spec",
                            id: spec._id,
                            label: spec.label,
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

          {/* Icons — master list for every product's datasheet */}
          {activeCommonDataSubTab === "icons" && (
            <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-secondary pb-3">
                <div className="flex flex-col gap-1">
                  <Label className="!text-xl !font-semibold">
                    Icons {`(${icons.length})`}
                  </Label>
                  <span className="text-sm text-description-color">
                    Common icons are added to every product&apos;s datasheet
                    automatically. Others can be picked per product.
                  </span>
                </div>
                <CustomButton
                  variant="3"
                  type="button"
                  text="Add Icon"
                  showIcon={false}
                  onClick={() => setIconDialog("new")}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                {icons.length === 0 && (
                  <p className="text-sm text-black/40">No icons added yet.</p>
                )}
                {icons.map((icon) => (
                  <div
                    key={icon._id}
                    className="flex items-center justify-between border border-secondary/60 rounded-md px-3 py-2 gap-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 shrink-0 rounded-[4px] border border-[#2A2A2A] flex items-center justify-center overflow-hidden">
                        {icon.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={icon.image}
                            alt=""
                            className="w-8 h-8 object-contain"
                          />
                        )}
                      </div>
                      {icon.isCommon && (
                        <span className="text-[10px] font-itc-medium uppercase text-trim rounded-full px-2 py-1.5 border border-primary text-primary">
                          Common
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        type="button"
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => setIconDialog(icon)}
                      >
                        <RiPencilLine
                          className="text-gray-500 hover:text-primary"
                          size={18}
                        />
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() =>
                          setDeleteTarget({
                            type: "icon",
                            id: icon._id,
                            label: "this icon",
                          })
                        }
                      >
                        <RiDeleteBinLine
                          className="text-red-400 hover:text-red-600"
                          size={18}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* QR Generated */}
      {activeTab === "qrGenerated" && (
        <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-secondary pb-3">
            <Label className="!text-xl !font-semibold">
              Generated QR Codes {`(${qrs.length})`}
            </Label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {qrs.length === 0 && (
              <p className="text-sm text-black/40">
                No QR codes generated yet.
              </p>
            )}
            {qrs.map((qr) => (
              <div
                key={qr._id}
                className="flex flex-col gap-3 border border-secondary/60 rounded-md p-3"
              >
                <div className="w-full aspect-square rounded-[6px] border border-[#2A2A2A] flex items-center justify-center overflow-hidden p-3">
                  {qr.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qr.image}
                      alt={qr.productTitle ?? "Generated QR code"}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-md font-itc-medium truncate">
                    {qr.productTitle || "Untitled product"}
                  </span>
                  {qr.productCode && (
                    <span className="text-sm text-description-color truncate">
                      {qr.productCode}
                    </span>
                  )}
                  <span className="text-xs text-description-color">
                    {new Date(qr.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <a
                    href={qr.image}
                    download={`${qr.productCode || "product"}-qr.png`}
                    className="text-sm font-itc-medium text-primary hover:underline"
                  >
                    Download
                  </a>
                  <button
                    type="button"
                    className="cursor-pointer hover:scale-110 transition-all"
                    onClick={() =>
                      setDeleteTarget({
                        type: "qr",
                        id: qr._id,
                        label: qr.productTitle || "this QR code",
                      })
                    }
                  >
                    <RiDeleteBinLine
                      className="text-red-400 hover:text-red-600"
                      size={18}
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

      {specDialog !== null && (
        <SpecFormDialog
          initial={specDialog === "new" ? null : specDialog}
          onClose={() => setSpecDialog(null)}
          onSaved={() => {
            setSpecDialog(null);
            fetchSpecs();
          }}
        />
      )}

      {iconDialog !== null && (
        <IconFormDialog
          initial={iconDialog === "new" ? null : iconDialog}
          onClose={() => setIconDialog(null)}
          onSaved={() => {
            setIconDialog(null);
            fetchIcons();
          }}
        />
      )}

      {configCategoryDialog !== null && (
        <ConfigCategoryFormDialog
          initial={configCategoryDialog === "new" ? null : configCategoryDialog}
          hasOptions={configCategoryHasOptions}
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
                <div className="flex items-center gap-2">
                  Home Page Section
                  <Home className="h-5 w-5 text-secondary -mt-1" />
                </div>
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
/* SPEC DIALOG                                                                */
/* -------------------------------------------------------------------------- */

function SpecFormDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial: Spec | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { register, handleSubmit } = useForm<{ label: string }>({
    defaultValues: { label: initial?.label ?? "" },
  });
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data: { label: string }) => {
    setIsSaving(true);
    try {
      const res = initial
        ? await fetch(`/api/admin/products/spec/${initial._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        : await fetch("/api/admin/products/spec", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
      if (!res.ok) return toast.error("Failed to save spec");
      toast.success(initial ? "Spec updated" : "Spec added");
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
            {initial ? "Edit Spec" : "Add Spec"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Label</Label>
            <Input {...register("label")} placeholder="e.g. IP44 / IP55" />
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
/* ICON DIALOG                                                                */
/* -------------------------------------------------------------------------- */

function IconFormDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial: Icon | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { control, register, handleSubmit } = useForm<{
    image: string;
    isCommon: boolean;
  }>({
    defaultValues: {
      image: initial?.image ?? "",
      isCommon: initial?.isCommon ?? false,
    },
  });
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data: { image: string; isCommon: boolean }) => {
    setIsSaving(true);
    try {
      const res = initial
        ? await fetch(`/api/admin/products/icon/${initial._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          })
        : await fetch("/api/admin/products/icon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
      if (!res.ok) return toast.error("Failed to save icon");
      toast.success(initial ? "Icon updated" : "Icon added");
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
            {initial ? "Edit Icon" : "Add Icon"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Image</Label>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <ImageUploader value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="size-4"
              {...register("isCommon")}
            />
            <Label className="font-bold text-trim">
              Common — include on every product&apos;s datasheet automatically
            </Label>
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
/* CONFIG CATEGORY DIALOG                                                     */
/* -------------------------------------------------------------------------- */

function ConfigCategoryFormDialog({
  initial,
  hasOptions,
  onClose,
  onSaved,
}: {
  initial: ConfigCategory | null;
  hasOptions: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  type FormValues = { title: string; previewType: string; isCommon: boolean };

  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: initial?.title ?? "",
      previewType: initial?.previewType ?? "none",
      isCommon: initial?.isCommon ?? false,
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
                  <Select
                    disabled={hasOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
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
              {hasOptions && (
                <span className="text-xs text-description-color">
                  Locked — this category already has options. Delete all its
                  options first to change the preview type.
                </span>
              )}
          </div>
          <div className="flex items-center gap-2">
            <Controller
              name="isCommon"
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
            <Label className="font-bold text-trim">
              Common — include in every product automatically
            </Label>
          </div>
          <span className="text-xs text-description-color -mt-2">
            Shows up pre-ticked under Second Section → Common Configurations
            on every product, with all of this category&apos;s options
            included. Admins can untick it per product to exclude it.
          </span>
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

  // tooltip.label auto-fills from label (or beam angle) until manually edited
  const [tooltipTouched, setTooltipTouched] = useState(
    !!initial?.tooltip?.label,
  );

  const label = watch("label");
  const beamAngle = watch("beamAngle");

  useEffect(() => {
    if (tooltipTouched) return;
    if (previewType === "beam") {
      const angle = Number(beamAngle);
      setValue(
        "tooltipLabel",
        beamAngle ? `${angle}° ${beamClassification(angle)}` : "",
      );
    } else {
      setValue("tooltipLabel", label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [label, beamAngle, previewType]);

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
              placeholder={
                previewType === "beam"
                  ? "Auto-fills from Beam Angle, e.g. 15° NARROW"
                  : "Auto-fills from Label"
              }
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
