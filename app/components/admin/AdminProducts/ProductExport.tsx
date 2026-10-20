"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { RiSearchLine, RiDeleteBinLine } from "react-icons/ri";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomButton from "../../client/common/CustomButton";

type Option = { _id: string; title: string };
type ExportProduct = {
  _id: string;
  title: string;
  productCode?: string;
  isHidden?: boolean;
  category?: Option;
  subCategory?: Option;
};

// Radix Select can't hold "" as a value
const ALL = "all";

export default function ProductExport({ categories }: { categories: Option[] }) {
  const [categoryId, setCategoryId] = useState(ALL);
  const [subCategoryId, setSubCategoryId] = useState(ALL);
  const [subCategories, setSubCategories] = useState<Option[]>([]);
  const [products, setProducts] = useState<ExportProduct[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // query string of the last finished product fetch; differs while loading
  const [loadedQuery, setLoadedQuery] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExportProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const query = new URLSearchParams({
    ...(categoryId !== ALL && { category: categoryId }),
    ...(subCategoryId !== ALL && { subCategory: subCategoryId }),
  }).toString();
  const isLoading = loadedQuery !== query;

  const changeCategory = (id: string) => {
    setCategoryId(id);
    setSubCategoryId(ALL);
    setSubCategories([]);
    if (id === ALL) return;
    fetch(`/api/admin/products/subcategory?category=${id}`)
      .then((res) => res.json())
      .then(setSubCategories)
      .catch(() => toast.error("Failed to load sub categories"));
  };

  useEffect(() => {
    fetch(`/api/admin/products?${query}`)
      .then((res) => res.json())
      .then((data: ExportProduct[]) => {
        setProducts(data);
        setSelected(new Set());
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoadedQuery(query));
  }, [query]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(term) ||
        p.productCode?.toLowerCase().includes(term),
    );
  }, [products, search]);

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((p) => selected.has(p._id));

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAllFiltered = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      filtered.forEach((p) =>
        allFilteredSelected ? next.delete(p._id) : next.add(p._id),
      );
      return next;
    });

  const exportCsv = async (ids: string[]) => {
    if (!ids.length) return;
    setIsExporting(true);
    try {
      const res = await fetch("/api/admin/products/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error();

      const fileName =
        res.headers
          .get("Content-Disposition")
          ?.match(/filename="(.+)"/)?.[1] ?? "products.csv";
      const url = URL.createObjectURL(await res.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${ids.length} product${ids.length > 1 ? "s" : ""}`);
    } catch {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget._id);
        return next;
      });
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // export in list order, not click order
  const selectedIds = products
    .filter((p) => selected.has(p._id))
    .map((p) => p._id);

  return (
    <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 border-b border-secondary pb-3">
        <Label className="!text-xl !font-semibold">
          Export Products {`(${filtered.length})`}
        </Label>
        <div className="flex items-center gap-2">
          <CustomButton
            variant="3"
            type="button"
            text={`Export Selected (${selectedIds.length})`}
            showIcon={false}
            disabled={isExporting || selectedIds.length === 0}
            onClick={() => exportCsv(selectedIds)}
          />
          <CustomButton
            variant="3"
            type="button"
            text={isExporting ? "Exporting..." : `Export All (${filtered.length})`}
            showIcon={false}
            disabled={isExporting || filtered.length === 0}
            onClick={() => exportCsv(filtered.map((p) => p._id))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col gap-2">
          <Label className="font-bold">Category</Label>
          <Select value={categoryId} onValueChange={changeCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-bold">Sub Category</Label>
          <Select
            value={subCategoryId}
            onValueChange={setSubCategoryId}
            disabled={categoryId === ALL}
          >
            <SelectTrigger>
              <SelectValue placeholder="All sub categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All sub categories</SelectItem>
              {subCategories.map((s) => (
                <SelectItem key={s._id} value={s._id}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-bold">Search</Label>
          <div className="relative">
            <RiSearchLine
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-description-color"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Product name or code"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="border border-secondary/60 rounded-md overflow-hidden">
        <div className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_80px_44px] items-center gap-3 px-4 py-2 bg-secondary/10 text-sm font-itc-medium">
          <input
            type="checkbox"
            className="size-4"
            checked={allFilteredSelected}
            onChange={toggleAllFiltered}
            disabled={filtered.length === 0}
            aria-label="Select all listed products"
          />
          <span>Product</span>
          <span>Code</span>
          <span>Category</span>
          <span>Sub Category</span>
          <span>Status</span>
          <span className="text-center">Delete</span>
        </div>
        <div className="max-h-[520px] overflow-y-auto">
          {isLoading ? (
            <p className="px-4 py-6 text-sm text-black/40">Loading products...</p>
          ) : filtered.length === 0 ? (
            <p className="px-4 py-6 text-sm text-black/40">No products found.</p>
          ) : (
            filtered.map((p) => (
              <label
                key={p._id}
                className="grid grid-cols-[40px_2fr_1fr_1fr_1fr_80px_44px] items-center gap-3 px-4 py-2 border-t border-secondary/40 text-sm cursor-pointer hover:bg-secondary/5"
              >
                <input
                  type="checkbox"
                  className="size-4"
                  checked={selected.has(p._id)}
                  onChange={() => toggleOne(p._id)}
                />
                <span className="truncate">{p.title || "Untitled product"}</span>
                <span className="truncate text-description-color">
                  {p.productCode || "—"}
                </span>
                <span className="truncate text-description-color">
                  {p.category?.title || "—"}
                </span>
                <span className="truncate text-description-color">
                  {p.subCategory?.title || "—"}
                </span>
                <span className="flex items-center gap-2 text-description-color">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                      p.isHidden
                        ? "bg-red-500 ring-4 ring-red-100"
                        : "bg-emerald-500 ring-4 ring-emerald-100"
                    }`}
                  />
                  {p.isHidden ? "Hidden" : "Visible"}
                </span>
                <button
                  type="button"
                  title="Delete product"
                  aria-label={`Delete ${p.title || "Untitled product"}`}
                  className="justify-self-center"
                  onClick={(e) => {
                    // the row is a <label>; stop it toggling selection
                    e.preventDefault();
                    e.stopPropagation();
                    setDeleteTarget(p);
                  }}
                >
                  <RiDeleteBinLine
                    className="text-red-400 hover:text-red-600"
                    size={18}
                  />
                </button>
              </label>
            ))
          )}
        </div>
      </div>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && !isDeleting && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="!text-xl !font-itc-medium">
              Delete product
            </DialogTitle>
          </DialogHeader>
          <p className="text-md text-description-color">
            Are you sure you want to delete{" "}
            <span className="font-semibold font-tasa text-primary font-itc-medium">
              {deleteTarget?.title || "Untitled product"}
            </span>
            ? This cannot be undone.
          </p>
          <DialogFooter>
            <CustomButton
              variant="2"
              type="button"
              text="Cancel"
              showIcon={false}
              disabled={isDeleting}
              onClick={() => setDeleteTarget(null)}
            />
            <CustomButton
              variant="3"
              type="button"
              text={isDeleting ? "Deleting..." : "Delete"}
              showIcon={false}
              disabled={isDeleting}
              onClick={confirmDelete}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
