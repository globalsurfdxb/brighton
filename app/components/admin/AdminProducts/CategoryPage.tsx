"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  RiDeleteBinLine,
  RiPencilLine,
  RiExternalLinkLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";

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
import Image from "next/image";

type Category = { _id: string; title: string; slug: string };
type SubCategory = {
  _id: string;
  title: string;
  icon: string;
  iconAlt: string;
  category: string | Category;
};
type ProductListItem = {
  _id: string;
  title: string;
  isHidden?: boolean;
  subCategory?: { _id: string; title: string };
};

type DeleteTarget = {
  type: "subcategory" | "product";
  id: string;
  label: string;
};

const deleteLabels: Record<DeleteTarget["type"], string> = {
  subcategory: "Subcategory",
  product: "Product",
};

export default function CategoryProductsPage() {
  const router = useRouter();
  const params = useParams<{ category: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<ProductListItem[]>([]);

  const [subCategoryDialog, setSubCategoryDialog] = useState<
    SubCategory | null | "new"
  >(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

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
    const cat = await fetchCategory();
    if (cat) {
      fetchSubCategories(cat._id);
      fetchProducts(cat._id);
    }
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

  if (!category) {
    return <p className="text-sm text-black/40">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Subcategories */}
      <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-secondary pb-3">
          <Label className="!text-xl !font-semibold">
            {category.title} Subcategories {`(${subCategories.length})`}
          </Label>
          <CustomButton
            variant="3"
            type="button"
            text="Add Subcategory"
            showIcon={false}
            onClick={() => setSubCategoryDialog("new")}
          />
        </div>
        <div className="grid grid-cols-2 2xl:grid-cols-3 gap-4">
          {subCategories.length === 0 && (
            <p className="text-sm text-black/40">No subcategories added yet.</p>
          )}
          {subCategories.map((sub) => (
            <div
              key={sub._id}
              className="flex items-center justify-between border border-secondary/60 rounded-md px-4 py-2"
            >
              <div className="flex items-center justify-center gap-2">
                <div>
                  <Image
                    src={sub.icon || "/assets/images/placeholder.png"}
                    alt={sub.iconAlt || ""}
                    width={60}
                    height={60}
                    className="object-cover"
                  />
                </div>
                <span className="text-md font-itc-medium">{sub.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="cursor-pointer hover:scale-110 transition-all"
                  onClick={() => setSubCategoryDialog(sub)}
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
                      type: "subcategory",
                      id: sub._id,
                      label: sub.title,
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

      {/* Products */}
      <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-secondary pb-3">
          <Label className="!text-xl !font-semibold">
            Products {`(${products.length})`}
          </Label>
          <CustomButton
            variant="3"
            type="button"
            text="Add Product"
            showIcon={false}
            onClick={() =>
              router.push(`/4dm1n-br1ght0n/products/${params.category}/new`)
            }
          />
        </div>
        <div className="grid grid-cols-1 gap-5">
          {products.length === 0 && (
            <p className="text-sm text-black/40">No products added yet.</p>
          )}
          {products.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between border border-secondary/60 rounded-md px-4 py-3 hover:shadow-sm transition-all cursor-pointer"
              onClick={() =>
                router.push(
                  `/4dm1n-br1ght0n/products/${params.category}/${product._id}`,
                )
              }
            >
              <span className="text-md font-itc-medium flex flex-col items-start gap-2">
                {product.title || "Untitled Product"}
                {product.subCategory && (
                  <span className="text-sm text-description-color font-itc-book">
                    {product.subCategory.title}
                  </span>
                )}
                {product.isHidden && (
                  <span className="text-[10px] uppercase font-semibold text-red-500 border border-red-300 rounded px-1.5 py-0.5">
                    Hidden
                  </span>
                )}
              </span>
              <div className="flex items-center justify-center gap-4">
                <div className="relative group mt-2">
                  <button
                    type="button"
                    className="cursor-pointer hover:scale-110 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/products/${product._id}`, "_blank");
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
              </div>
            </div>
          ))}
        </div>
      </div>

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
  type FormValues = { title: string; icon: string; iconAlt: string };

  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: initial?.title ?? "",
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
            <Label className="font-bold">Icon</Label>
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <ImageUploader value={field.value} onChange={field.onChange} />
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
