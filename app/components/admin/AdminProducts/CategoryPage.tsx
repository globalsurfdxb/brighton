"use client";

import AdminRowNumber from "@/app/components/admin/common/AdminRowNumber";
import AdminTabs from "@/app/components/admin/common/AdminTabs";
import AdminButton from "@/app/components/admin/common/AdminButton";
import AdminSectionCard from "@/app/components/admin/common/AdminSectionCard";
import ReorderableList from "@/app/components/admin/common/ReorderableList";
import { Layers, Package, Plus } from "lucide-react";
import { AdminSkeleton } from "@/app/components/admin/common/AdminLoadable";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { usePathname, useRouter, useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  RiDeleteBinLine,
  RiPencilLine,
  RiExternalLinkLine,
  RiEyeLine,
  RiEyeOffLine,
  RiDraggable,
} from "react-icons/ri";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/ui/image-uploader";
import CustomButton from "../../client/common/CustomButton";
import AdminPageActions from "../common/AdminPageActions";
import AdminVisitLink from "@/app/components/admin/common/AdminVisitLink";
import Image from "next/image";
import { slugify } from "@/lib/utils/slugify";

type Category = { _id: string; title: string; slug: string };
type SubCategory = {
  _id: string;
  title: string;
  slug: string;
  order: number;
  icon: string;
  iconAlt: string;
  category: string | Category;
};
type ProductListItem = {
  _id: string;
  title: string;
  slug: string;
  productCode?: string;
  isHidden?: boolean;
  subCategory?: { _id: string; title: string };
};

type DeleteTarget = {
  type: "subcategory" | "product";
  id: string;
  label: string;
};

const TABS = [
  { key: "products", label: "Products", icon: Package },
  { key: "subcategories", label: "Subcategories", icon: Layers },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const deleteLabels: Record<DeleteTarget["type"], string> = {
  subcategory: "Subcategory",
  product: "Product",
};

function SortableSubCategoryCard({
  index,
  subCategory,
  onEdit,
  onDelete,
}: {
  index: number;
  subCategory: SubCategory;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: subCategory._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between rounded-lg border border-secondary/60 bg-white px-4 py-3"
    >
      <div className="flex items-center justify-center gap-3">
        <AdminRowNumber value={index + 1} />
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing touch-none"
          aria-label="Drag to reorder"
        >
          <RiDraggable size={18} />
        </button>
        <Image
          src={subCategory.icon || "/assets/images/placeholder.png"}
          alt={subCategory.iconAlt || ""}
          width={40}
          height={40}
          className="object-cover"
        />
        <span className="text-md font-itc-medium">{subCategory.title}</span>
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

export default function CategoryProductsPage() {
  const router = useRouter();
  const params = useParams<{ category: string }>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: TabKey =
    TABS.find((t) => t.key === tabParam)?.key ?? "products";
  const setActiveTab = (tab: TabKey) =>
    router.replace(`${pathname}?${new URLSearchParams({ tab })}`, {
      scroll: false,
    });
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);

  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);

  const [subCategoryDialog, setSubCategoryDialog] = useState<
    SubCategory | null | "new"
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const dndSensors = useSensors(useSensor(PointerSensor));

  const handleSubCategoryDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = subCategories.findIndex((s) => s._id === active.id);
    const newIndex = subCategories.findIndex((s) => s._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(subCategories, oldIndex, newIndex);
    setSubCategories(reordered);

    const res = await fetch("/api/admin/products/subcategory/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((s) => s._id) }),
    });
    if (res.ok) {
      toast.success("Subcategory order updated");
    } else {
      toast.error("Failed to save order");
      if (category) fetchSubCategories(category._id);
    }
  };

  const fetchCategory = async () => {
    const res = await fetch("/api/admin/products/category");
    const all: Category[] = await res.json();
    const found = all.find((c) => c.slug === params.category) ?? null;
    setCategory(found);
    return found;
  };

  const fetchSubCategories = async (categoryId: string) => {
    const res = await fetch(
      `/api/admin/products/subcategory?category=${categoryId}`,
    );
    setSubCategories(await res.json());
  };

  const fetchProducts = async (categoryId: string) => {
    const res = await fetch(`/api/admin/products?category=${categoryId}`);
    setProducts(await res.json());
  };

  const loadAll = async () => {
    const slug = params.category;
    const cat = await fetchCategory();
    if (cat) {
      await Promise.all([fetchSubCategories(cat._id), fetchProducts(cat._id)]);
    }
    setLoadedSlug(slug);
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.category]);

  const toggleHidden = async (
    e: React.MouseEvent,
    product: ProductListItem,
  ) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !product.isHidden }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error("Failed to update product");
      setProducts((prev) =>
        prev.map((p) => (p._id === data._id ? { ...p, ...data } : p)),
      );
      toast.success(data.isHidden ? "Product hidden" : "Product shown");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !category) return;
    const { type, id } = deleteTarget;

    const endpoint =
      type === "subcategory"
        ? `/api/admin/products/subcategory/${id}`
        : `/api/admin/products/${id}`;

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Failed to delete");
        return;
      }
      toast.success(`${deleteLabels[type]} deleted`);
      if (type === "subcategory") fetchSubCategories(category._id);
      if (type === "product") fetchProducts(category._id);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setDeleteTarget(null);
    }
  };

  if (!category || loadedSlug !== params.category) {
    return <AdminSkeleton variant="list" />;
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <AdminPageActions>
        <AdminVisitLink href={`/lighting?category=${params.category}`} />
      </AdminPageActions>

      <AdminTabs
        label={`${category.title} content`}
        tabs={[
          { ...TABS[0], count: products.length },
          { ...TABS[1], count: subCategories.length },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "products" && (
        <ReorderableList
          title={`${category.title} Products`}
          noun="products"
          items={products}
          onItemsChange={setProducts}
          searchPlaceholder="Search name, code or sub category"
          getSearchValues={(product) => [
            product.title,
            product.productCode,
            product.subCategory?.title,
          ]}
          reorderEndpoint="/api/admin/products/reorder"
          onReorderFailed={() => fetchProducts(category._id)}
          onRowClick={(product) =>
            router.push(`/4dm1n-br1ght0n/products/${params.category}/${product._id}`)
          }
          headerActions={
            <AdminButton
              icon={Plus}
              onClick={() =>
                router.push(`/4dm1n-br1ght0n/products/${params.category}/new`)
              }
            >
              Add Product
            </AdminButton>
          }
          renderContent={(product) => (
            <div className="flex flex-col items-start">
              <span className="text-md font-itc-medium leading-tight">
                {product.title || "Untitled Product"}
              </span>
              <span className="mt-0.5 text-[12px] leading-tight text-description-color font-itc-book">
                {[product.productCode, product.subCategory?.title]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
              {product.isHidden && (
                <span className="mt-1.5 rounded border border-red-300 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-500">
                  Hidden
                </span>
              )}
            </div>
          )}
          renderActions={(product) => (
            <>
              <div className="relative group mt-2">
                <button
                  type="button"
                  className="cursor-pointer hover:scale-110 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `/lighting/${product.slug || slugify(product.title)}`,
                      "_blank",
                    );
                  }}
                >
                  <RiExternalLinkLine
                    className="text-gray-500 hover:text-primary"
                    size={22}
                  />
                </button>
                <span
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
            whitespace-nowrap rounded-md bg-primary px-2 py-2 text-[11px] text-white font-itc-medium
            opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition-opacity duration-400"
                >
                  Visit page
                </span>
              </div>
              <button
                onClick={(e) => toggleHidden(e, product)}
                type="button"
                className="cursor-pointer hover:scale-110 transition-all"
                title={product.isHidden ? "Show product" : "Hide product"}
              >
                {product.isHidden ? (
                  <RiEyeOffLine className="text-gray-500" size={22} />
                ) : (
                  <RiEyeLine className="text-green-600" size={22} />
                )}
              </button>
              <button
                type="button"
                className="cursor-pointer hover:scale-110 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteTarget({
                    type: "product",
                    id: product._id,
                    label: product.title || "Untitled Product",
                  });
                }}
                title="Delete product"
              >
                <RiDeleteBinLine
                  className="text-red-400 hover:text-red-600"
                  size={22}
                />
              </button>
            </>
          )}
        />
      )}

      {activeTab === "subcategories" && (
        <div className="admin-list-scroll -mr-3 min-h-0 flex-1 overflow-y-auto pb-1 pr-3">
          <AdminSectionCard
            title={`${category.title} Subcategories`}
            count={subCategories.length}
            description="Drag to reorder. The order is used for the subcategory tabs on the website."
            actions={
              <AdminButton icon={Plus} onClick={() => setSubCategoryDialog("new")}>
                Add Subcategory
              </AdminButton>
            }
          >
            {subCategories.length === 0 ? (
              <p className="rounded-lg border border-dashed border-secondary/70 py-8 text-center text-sm text-description-color">
                No subcategories added yet.
              </p>
            ) : (
              <DndContext
                sensors={dndSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleSubCategoryDragEnd}
              >
                <SortableContext
                  items={subCategories.map((s) => s._id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-2 gap-3 2xl:grid-cols-3">
                    {subCategories.map((sub, index) => (
                      <SortableSubCategoryCard
                        key={sub._id}
                        index={index}
                        subCategory={sub}
                        onEdit={() => setSubCategoryDialog(sub)}
                        onDelete={() =>
                          setDeleteTarget({
                            type: "subcategory",
                            id: sub._id,
                            label: sub.title,
                          })
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </AdminSectionCard>
        </div>
      )}

      {subCategoryDialog !== null && (
        <SubCategoryFormDialog
          initial={subCategoryDialog === "new" ? null : subCategoryDialog}
          categoryId={category._id}
          onClose={() => setSubCategoryDialog(null)}
          onSaved={() => {
            setSubCategoryDialog(null);
            fetchSubCategories(category._id);
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

function SubCategoryFormDialog({
  initial,
  categoryId,
  onClose,
  onSaved,
}: {
  initial: SubCategory | null;
  categoryId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  type FormValues = {
    title: string;
    slug: string;
    icon: string;
    iconAlt: string;
  };

  const { register, control, handleSubmit, setValue, watch } =
    useForm<FormValues>({
      defaultValues: {
        title: initial?.title ?? "",
        slug: initial?.slug ?? "",
        icon: initial?.icon ?? "",
        iconAlt: initial?.iconAlt ?? "",
      },
    });
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    try {
      const payload = { ...data, category: categoryId };
      const res = initial
        ? await fetch(`/api/admin/products/subcategory/${initial._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products/subcategory", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      if (!res.ok) return toast.error("Failed to save subcategory");
      toast.success(initial ? "Subcategory updated" : "Subcategory added");
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
            {initial ? "Edit Subcategory" : "Add Subcategory"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Icon</Label>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <ImageUploader
 contain value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Icon Alt</Label>
            <Input {...register("iconAlt")} placeholder="Icon Alt" />
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
