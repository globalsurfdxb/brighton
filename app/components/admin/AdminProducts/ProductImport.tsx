"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import {
  RiUploadCloud2Line,
  RiFileTextLine,
  RiDownload2Line,
  RiArrowDownSLine,
  RiDeleteBinLine,
  RiErrorWarningLine,
  RiAlertLine,
  RiInformationLine,
  RiCheckboxCircleLine,
  RiAddCircleLine,
  RiRefreshLine,
  RiFolderAddLine,
  RiCheckLine,
  RiFileZipLine,
  RiCloseLine,
} from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomButton from "../../client/common/CustomButton";
import {
  CELL_COLUMN,
  CSV_COLUMNS,
  FILE_COLUMNS,
  FILE_TYPES,
  REQUIRED_CELLS,
  cellsToProduct,
  changedCells,
  csvToCells,
  fileExt,
  fileRefs,
  isLink,
  lines,
  norm,
  productToCells,
  replaceFileRefs,
  toCsv,
  type FileKind,
  type ImportProduct,
  type ImportResult,
  type ProductCells,
} from "@/lib/productCsv";
import {
  closeZip,
  extractFromZip,
  findInZip,
  readZip,
  zipPreviewUrl,
  type ImportZip,
} from "@/lib/importZip";
import { uploadFile } from "@/lib/uploadFile";

type Ref = { _id: string; title: string };
type SubRef = Ref & { category: string | Ref };
type ExistingProduct = Record<string, any> & {
  _id: string;
  title: string;
  productCode?: string;
};

type SpecRef = { _id: string; label: string; order: number };
type CommonConfigRef = { _id: string; title: string; isCommon?: boolean };
type CommonIconRef = { _id: string; image: string; isCommon?: boolean };
/** Master lists for everything that is shared by all products. */
type CommonLists = {
  specs: SpecRef[];
  configs: CommonConfigRef[];
  icons: CommonIconRef[];
};

type Row = { row: number; include: boolean; cells: ProductCells };
type Mode = "new" | "update" | "unchanged" | "error" | "skipped";
type Analysis = {
  mode: Mode;
  product: ImportProduct;
  errors: string[];
  warnings: string[];
  newCategory: boolean;
  newSubCategory: boolean;
  /** Labels of fields that differ from the existing product (updates only). */
  changes: string[];
  /** Columns this row writes: all of them when new, the changed ones on update. */
  writtenKeys: (keyof ProductCells)[];
  /** The existing product as cells (updates only). */
  before?: ProductCells;
};
type Filter = "all" | "new" | "update" | "unchanged" | "attention" | "skipped";

const MODE_STYLE: Record<
  Mode,
  { label: string; badge: string; border: string }
> = {
  new: {
    label: "New product",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    border: "border-l-emerald-500",
  },
  update: {
    label: "Update",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
    border: "border-l-sky-500",
  },
  error: {
    label: "Error",
    badge: "bg-red-50 text-red-600 border-red-200",
    border: "border-l-red-500",
  },
  unchanged: {
    label: "No changes",
    badge: "bg-gray-50 text-gray-600 border-gray-200",
    border: "border-l-gray-400",
  },
  skipped: {
    label: "Skipped",
    badge: "bg-gray-100 text-gray-500 border-gray-200",
    border: "border-l-gray-300",
  },
};

const CHANGE_LABELS: Partial<Record<keyof ProductCells, string>> = {
  title: "Title",
  category: "Category",
  subCategory: "Sub category",
  status: "Status",
  featured: "Featured",
  description: "Description",
  keySpecs: "Key specs",
  technicalSpecs: "Technical specs",
  thumbImage: "Thumb image",
  hoverImage: "Hover image",
  galleryImages: "Gallery",
  photometrics: "Photometrics",
  resources: "Resources",
  installationGuide: "Installation guide",
  commonConfigurations: "Common configurations",
  commonIcons: "Common icons",
};

/** Cell text for a set of enabled common entries; all enabled = blank. */
function commonCellFor(enabled: string[], all: string[]): string {
  if (enabled.length === 0) return "None";
  if (all.every((a) => enabled.some((e) => norm(e) === norm(a)))) return "";
  return all.filter((a) => enabled.some((e) => norm(e) === norm(a))).join("\n");
}

function downloadText(text: string, fileName: string) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

const transferKey = (kind: FileKind, ref: string) => `${kind}|${ref}`;

/** A file to copy into storage before the rows are imported. */
type Transfer = { kind: FileKind; ref: string; zipPath?: string };

/** Rows sent to the import API per request, so a large CSV stays well under
 *  the serverless function timeout and progress can be shown per batch. */
const IMPORT_CHUNK = 25;

/** Run `work` over `items`, at most `limit` at a time. */
async function runPool<T>(items: T[], limit: number, work: (item: T) => Promise<void>) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) await work(items[next++]);
    }),
  );
}

export default function ProductImport({
  onImported,
}: {
  /** Called after an import so other tabs can refresh categories etc. */
  onImported?: () => void;
}) {
  const [products, setProducts] = useState<ExistingProduct[]>([]);
  const [categories, setCategories] = useState<Ref[]>([]);
  const [subCategories, setSubCategories] = useState<SubRef[]>([]);
  const [common, setCommon] = useState<CommonLists>({
    specs: [],
    configs: [],
    icons: [],
  });

  const [fileName, setFileName] = useState("");
  const [columns, setColumns] = useState<(keyof ProductCells)[]>([]);
  const [missingColumns, setMissingColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const [zip, setZip] = useState<ImportZip | null>(null);
  const [blobBaseUrl, setBlobBaseUrl] = useState("");
  const [fileProgress, setFileProgress] = useState<{ done: number; total: number } | null>(null);
  const [rowProgress, setRowProgress] = useState<{ done: number; total: number } | null>(null);

  const loadReferences = useCallback(
    () =>
      Promise.all(
        [
          "/api/admin/products",
          "/api/admin/products/category",
          "/api/admin/products/subcategory",
          "/api/admin/products/spec",
          "/api/admin/products/config-category",
          "/api/admin/products/icon",
        ].map((url) => fetch(url).then((res) => res.json())),
      )
        .then(([p, c, s, sp, cc, ic]) => {
          setProducts(p);
          setCategories(c);
          setSubCategories(s);
          setCommon({
            specs: [...sp].sort(
              (a: SpecRef, b: SpecRef) => a.order - b.order,
            ),
            configs: cc.filter((x: CommonConfigRef) => x.isCommon),
            icons: ic.filter((x: CommonIconRef) => x.isCommon),
          });
        })
        .catch(() => toast.error("Failed to load existing products")),
    [],
  );

  useEffect(() => {
    loadReferences();
    fetch("/api/admin/products/import/file")
      .then((res) => res.json())
      .then((data) => setBlobBaseUrl(data.blobBaseUrl ?? ""))
      .catch(() => {});
  }, [loadReferences]);

  // object URLs of ZIP thumbnails are released with the ZIP
  useEffect(() => () => closeZip(zip), [zip]);

  /** Links already in our storage are kept as they are. */
  const isStored = useCallback(
    (ref: string) => !!blobBaseUrl && ref.split("?")[0].startsWith(blobBaseUrl),
    [blobBaseUrl],
  );

  const preview = useCallback(
    (ref: string) => {
      if (isLink(ref)) return ref;
      const found = findInZip(zip, ref);
      return zip && "path" in found ? zipPreviewUrl(zip, found.path) : undefined;
    },
    [zip],
  );

  // ------------------------------------------------------------ analysis

  const analyses = useMemo(() => {
    const productsByCode = new Map<string, ExistingProduct[]>();
    products.forEach((p) => {
      if (!p.productCode) return;
      const key = norm(p.productCode);
      productsByCode.set(key, [...(productsByCode.get(key) ?? []), p]);
    });
    const categoryByTitle = new Map(categories.map((c) => [norm(c.title), c]));
    const subKeys = new Set(
      subCategories.map((s) => {
        const categoryId = typeof s.category === "string" ? s.category : s.category?._id;
        return `${categoryId}|${norm(s.title)}`;
      }),
    );
    const specLabels = new Map(common.specs.map((x) => [x._id, x.label]));
    const configTitles = common.configs.map((c) => c.title);
    const iconImages = common.icons.map((i) => i.image);
    const firstRowByCode = new Map<string, number>();
    rows.forEach((r) => {
      const code = norm(r.cells.productCode);
      if (code && r.include && !firstRowByCode.has(code))
        firstRowByCode.set(code, r.row);
    });

    return new Map<number, Analysis>(
      rows.map((r) => {
        const { product, warnings } = cellsToProduct(r.cells);
        const errors: string[] = [];
        const code = norm(product.productCode);
        const matches = code ? (productsByCode.get(code) ?? []) : [];

        if (!product.title) errors.push("Title is required");
        if (!product.category) errors.push("Category is required");
        if (code && r.include && firstRowByCode.get(code) !== r.row)
          errors.push(
            `Same product code as row ${firstRowByCode.get(code)} — only one row per code`,
          );
        if (matches.length > 1)
          errors.push(
            `Code matches ${matches.length} existing products — fix the duplicates in the CMS first`,
          );
        if (!code)
          warnings.unshift(
            "No product code — will always be added as a new product",
          );
        product.commonConfigurations
          ?.filter((t) => !configTitles.some((c) => norm(c) === norm(t)))
          .forEach((t) =>
            warnings.push(`Common configuration "${t}" doesn't exist, ignored`),
          );
        product.commonIcons
          ?.filter((i) => !iconImages.includes(i))
          .forEach(() =>
            warnings.push("A common icon link doesn't match any common icon, ignored"),
          );

        const category = categoryByTitle.get(norm(product.category));
        const newCategory = !!product.category && !category;
        const newSubCategory =
          !!product.subCategory &&
          (newCategory ||
            !subKeys.has(`${category?._id}|${norm(product.subCategory)}`));

        const existing = matches.length === 1 ? matches[0] : undefined;
        const changes: string[] = [];
        let before: ProductCells | undefined;
        let writtenKeys = columns;
        if (existing) {
          before = productToCells(existing, {
            specLabel: (spec) => specLabels.get(String(spec?._id ?? spec)),
            commonConfigs: common.configs,
            commonIcons: common.icons,
          });
          writtenKeys = changedCells(before, r.cells, { configTitles, iconImages }, columns);
          writtenKeys
            .filter((key) => CHANGE_LABELS[key])
            .forEach((key) => changes.push(CHANGE_LABELS[key]!));
        }

        // ZIP file names: must be in the ZIP, and the right kind of file
        writtenKeys
          .filter((key) => FILE_COLUMNS[key])
          .forEach((key) => {
            const kind = FILE_COLUMNS[key]!;
            fileRefs(key, r.cells[key])
              .filter((ref) => !isLink(ref))
              .forEach((ref) => {
                const found = findInZip(zip, ref);
                if ("error" in found)
                  warnings.push(`${CHANGE_LABELS[key]}: ${found.error}`);
                else if (!(FILE_TYPES[kind] as readonly string[]).includes(fileExt(ref)))
                  warnings.push(
                    `${CHANGE_LABELS[key]}: "${ref}" is a .${fileExt(ref)} file — this column takes ${FILE_TYPES[kind].join(", ")}`,
                  );
              });
          });

        const mode: Mode = errors.length
          ? "error"
          : !r.include
            ? "skipped"
            : existing
              ? changes.length
                ? "update"
                : "unchanged"
              : "new";
        return [
          r.row,
          {
            mode,
            product,
            errors,
            warnings,
            newCategory,
            newSubCategory,
            changes,
            writtenKeys,
            before,
          },
        ];
      }),
    );
  }, [rows, products, categories, subCategories, common, columns, zip]);

  /** Files the import will copy into storage, keyed by kind + reference. */
  const transfers = useMemo(() => {
    const plan = new Map<string, Transfer>();
    rows.forEach((r) => {
      const a = analyses.get(r.row);
      if (a?.mode !== "new" && a?.mode !== "update") return;
      a.writtenKeys
        .filter((key) => FILE_COLUMNS[key])
        .forEach((key) => {
          const kind = FILE_COLUMNS[key]!;
          fileRefs(key, r.cells[key]).forEach((ref) => {
            if (isStored(ref) || plan.has(transferKey(kind, ref))) return;
            if (isLink(ref)) {
              plan.set(transferKey(kind, ref), { kind, ref });
              return;
            }
            const found = findInZip(zip, ref);
            if ("path" in found)
              plan.set(transferKey(kind, ref), { kind, ref, zipPath: found.path });
          });
        });
    });
    return plan;
  }, [rows, analyses, zip, isStored]);

  const counts = useMemo(() => {
    const list = [...analyses.values()];
    return {
      new: list.filter((a) => a.mode === "new").length,
      update: list.filter((a) => a.mode === "update").length,
      unchanged: list.filter((a) => a.mode === "unchanged").length,
      error: list.filter((a) => a.mode === "error").length,
      skipped: list.filter((a) => a.mode === "skipped").length,
      attention: list.filter(
        (a) =>
          a.mode === "error" ||
          a.warnings.length ||
          a.newCategory ||
          a.newSubCategory,
      ).length,
    };
  }, [analyses]);

  /** Categories / sub categories the import will create, with their rows. */
  const newReferences = useMemo(() => {
    const refs = new Map<string, { kind: "Category" | "Sub category"; name: string; parent?: string; rows: number[] }>();
    rows.forEach((r) => {
      const a = analyses.get(r.row);
      if (!a || a.mode === "error" || a.mode === "skipped") return;
      const add = (kind: "Category" | "Sub category", name: string, parent?: string) => {
        const key = `${kind}|${norm(parent)}|${norm(name)}`;
        const ref = refs.get(key) ?? { kind, name, parent, rows: [] };
        ref.rows.push(r.row);
        refs.set(key, ref);
      };
      if (a.newCategory) add("Category", a.product.category);
      if (a.newSubCategory)
        add("Sub category", a.product.subCategory, a.product.category);
    });
    return [...refs.values()];
  }, [rows, analyses]);

  const visibleRows = rows.filter((r) => {
    const a = analyses.get(r.row)!;
    if (filter === "all") return true;
    if (filter === "attention")
      return (
        a.mode === "error" || a.warnings.length || a.newCategory || a.newSubCategory
      );
    return a.mode === filter;
  });

  // ------------------------------------------------------------- actions

  const onZipDrop = useCallback(async (file: File) => {
    try {
      const next = readZip(file.name, new Uint8Array(await file.arrayBuffer()));
      if (!next.fileCount) {
        toast.error(`${file.name} has no files`);
        return;
      }
      setZip(next);
      toast.success(`${file.name} added — ${next.fileCount} files`);
    } catch {
      toast.error(`Couldn't read ${file.name} — is it a valid ZIP?`);
    }
  }, []);

  const onDrop = useCallback(async (files: File[]) => {
    const zipFile = files.find((f) => /\.zip$/i.test(f.name));
    if (zipFile) await onZipDrop(zipFile);
    const file = files.find((f) => /\.csv$/i.test(f.name));
    if (!file) return;
    const text = await file.text();
    const { rows: parsed, missingColumns: missing } = csvToCells(text);

    const missingRequired = REQUIRED_CELLS.filter((key) =>
      missing.includes(CELL_COLUMN[key]),
    );
    if (missingRequired.length) {
      toast.error(
        `Missing required column${missingRequired.length > 1 ? "s" : ""}: ${missingRequired
          .map((k) => CELL_COLUMN[k])
          .join(", ")}`,
      );
      return;
    }
    if (!parsed.length) {
      toast.error("The file has no product rows");
      return;
    }

    setFileName(file.name);
    setMissingColumns(missing);
    setColumns(
      (Object.keys(CELL_COLUMN) as (keyof ProductCells)[]).filter(
        (key) => !missing.includes(CELL_COLUMN[key]),
      ),
    );
    // spreadsheet row numbers: header is row 1
    setRows(parsed.map((cells, i) => ({ row: i + 2, include: true, cells })));
    setExpanded(new Set());
    setFilter("all");
    setResults(null);
  }, [onZipDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
    maxFiles: 2,
  });

  const zipDropzone = useDropzone({
    onDrop: (files) => files[0] && onZipDrop(files[0]),
    accept: {
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
    maxFiles: 1,
    multiple: false,
  });

  const updateCell = (row: number, key: keyof ProductCells, value: string) =>
    setRows((prev) =>
      prev.map((r) =>
        r.row === row ? { ...r, cells: { ...r.cells, [key]: value } } : r,
      ),
    );

  const setInclude = (row: number, include: boolean) =>
    setRows((prev) => prev.map((r) => (r.row === row ? { ...r, include } : r)));

  const removeRow = (row: number) =>
    setRows((prev) => prev.filter((r) => r.row !== row));

  const toggleExpanded = (row: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(row)) next.delete(row);
      else next.add(row);
      return next;
    });

  const reset = () => {
    setRows([]);
    setFileName("");
    setResults(null);
    setZip(null);
  };

  /**
   * Copy every linked / ZIP file into storage and swap the cells over to the
   * stored links. A column with a file that failed keeps its current value
   * (new products just leave that file out), and the failure is reported.
   */
  const storeFiles = async (importRows: Row[]) => {
    const stored = new Map<string, { url?: string; error?: string }>();
    const queue = [...transfers.values()];
    setFileProgress({ done: 0, total: queue.length });
    let done = 0;
    await runPool(queue, 4, async (t) => {
      try {
        // ZIP files go straight to a staging blob; the API checks and stores it
        const body = t.zipPath
          ? {
              kind: t.kind,
              staged: await uploadFile(
                extractFromZip(zip!, t.zipPath),
                t.zipPath,
                { purpose: "import" },
              ),
            }
          : { kind: t.kind, url: t.ref };
        const res = await fetch("/api/admin/products/import/file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        stored.set(
          transferKey(t.kind, t.ref),
          res.ok ? { url: data.url } : { error: data.message || "Upload failed" },
        );
      } catch (e) {
        stored.set(transferKey(t.kind, t.ref), {
          error: e instanceof Error ? e.message : "Upload failed",
        });
      }
      setFileProgress({ done: ++done, total: queue.length });
    });

    const fileWarnings = new Map<number, string[]>();
    const payload = importRows.map((r) => {
      const a = analyses.get(r.row)!;
      const cells = { ...r.cells };
      const warnings: string[] = [];
      a.writtenKeys
        .filter((key) => FILE_COLUMNS[key])
        .forEach((key) => {
          const kind = FILE_COLUMNS[key]!;
          const failed: string[] = [];
          const value = replaceFileRefs(key, cells[key], (ref) => {
            if (isStored(ref)) return ref;
            const result = isLink(ref)
              ? stored.get(transferKey(kind, ref))
              : stored.get(transferKey(kind, ref)) ?? {
                  error: (findInZip(zip, ref) as { error?: string }).error,
                };
            if (result?.url) return result.url;
            failed.push(`"${ref}" — ${result?.error ?? "not uploaded"}`);
            return null;
          });
          if (!failed.length) {
            cells[key] = value;
            return;
          }
          // existing product: leave the whole column as it is
          cells[key] = a.before ? a.before[key] : value;
          warnings.push(
            `${CHANGE_LABELS[key]}${a.before ? " (left unchanged)" : ""}: ${failed.join("; ")}`,
          );
        });
      if (warnings.length) fileWarnings.set(r.row, warnings);
      return { row: r.row, cells };
    });
    return { payload, fileWarnings };
  };

  const runImport = async () => {
    const importRows = rows.filter((r) => {
      const mode = analyses.get(r.row)?.mode;
      return mode === "new" || mode === "update";
    });
    if (!importRows.length) return;

    setIsImporting(true);
    try {
      const { payload, fileWarnings } = await storeFiles(importRows);
      setFileProgress(null);

      // Rows go up in chunks: each request stays under the function timeout,
      // and progress / a partial result survive if a later chunk fails.
      const collected: ImportResult[] = [];
      setRowProgress({ done: 0, total: payload.length });
      try {
        for (let i = 0; i < payload.length; i += IMPORT_CHUNK) {
          const chunk = payload.slice(i, i + IMPORT_CHUNK);
          const res = await fetch("/api/admin/products/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rows: chunk, columns }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          collected.push(...(data.results as ImportResult[]));
          setRowProgress({ done: collected.length, total: payload.length });
        }
      } catch (e) {
        // show what did import before surfacing the failure
        if (collected.length) {
          setResults(
            collected.map((result) => ({
              ...result,
              fileWarnings: fileWarnings.get(result.row),
            })),
          );
          await loadReferences();
          onImported?.();
        }
        throw e;
      }

      setResults(
        collected.map((result) => ({
          ...result,
          fileWarnings: fileWarnings.get(result.row),
        })),
      );
      await loadReferences();
      onImported?.();
    } catch (e) {
      toast.error(e instanceof Error && e.message ? e.message : "Import failed");
    } finally {
      setIsImporting(false);
      setFileProgress(null);
      setRowProgress(null);
    }
  };

  // ------------------------------------------------------------ results

  if (results) {
    const created = results.filter((r) => r.status === "created").length;
    const updated = results.filter((r) => r.status === "updated");
    const unchanged = results.filter((r) => r.status === "unchanged").length;
    const failed = results.filter((r) => r.status === "failed");
    const withFileWarnings = results.filter((r) => r.fileWarnings?.length);
    return (
      <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between border-b border-secondary pb-3">
          <Label className="!text-xl !font-semibold">Import complete</Label>
          <CustomButton
            variant="3"
            type="button"
            text="Import another file"
            showIcon={false}
            onClick={reset}
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatTile tone="emerald" label="Created" value={created} />
          <StatTile tone="sky" label="Updated" value={updated.length} />
          <StatTile tone="gray" label="No changes" value={unchanged} />
          <StatTile tone="red" label="Failed" value={failed.length} />
        </div>
        {updated.length > 0 && (
          <div className="rounded-lg border border-sky-200 bg-sky-50/60 p-4 flex flex-col gap-2">
            <span className="text-sm font-itc-medium text-sky-700">
              Updated fields — everything else on these products was left as it was
            </span>
            {updated.map((u) => (
              <div key={u.row} className="text-sm text-sky-800">
                <span className="font-itc-medium">Row {u.row}</span>
                {u.title && ` · ${u.title}`} —{" "}
                {(u.changed ?? [])
                  .map((key) => CHANGE_LABELS[key] ?? CELL_COLUMN[key])
                  .join(", ")}
              </div>
            ))}
          </div>
        )}
        {withFileWarnings.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-4 flex flex-col gap-2">
            <span className="text-sm font-itc-medium text-amber-700">
              Files that couldn&apos;t be stored — fix the link or ZIP and import
              these rows again
            </span>
            {withFileWarnings.map((r) => (
              <div key={r.row} className="text-sm text-amber-800 flex flex-col gap-0.5">
                <span>
                  <span className="font-itc-medium">Row {r.row}</span>
                  {r.title && ` · ${r.title}`}
                </span>
                {r.fileWarnings!.map((w) => (
                  <span key={w} className="pl-3 break-all">
                    {w}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
        {failed.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50/60 p-4 flex flex-col gap-2">
            <span className="text-sm font-itc-medium text-red-700">
              These rows were not imported
            </span>
            {failed.map((f) => (
              <div key={f.row} className="text-sm text-red-700">
                <span className="font-itc-medium">Row {f.row}</span>
                {f.title && ` · ${f.title}`} — {f.message}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ------------------------------------------------------------- upload

  if (!rows.length) {
    return (
      <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 border-b border-secondary pb-3">
          <Label className="!text-xl !font-semibold">Import Products</Label>
          <button
            type="button"
            onClick={() =>
              downloadText(toCsv([[...CSV_COLUMNS]]), "products-template.csv")
            }
            className="flex items-center gap-1.5 text-sm text-primary hover:underline cursor-pointer"
          >
            <RiDownload2Line size={16} />
            Download template
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-secondary hover:border-primary/50 hover:bg-secondary/5"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/20">
            <RiUploadCloud2Line size={28} className="text-primary" />
          </div>
          <span className="text-md font-itc-medium">
            {isDragActive
              ? "Drop the files here"
              : "Drop a .csv file here, or click to browse"}
          </span>
          <span className="text-sm text-description-color">
            Add a .zip of images and files too if the CSV names files instead of
            linking them. Tip: export products from the Export tab, edit the
            file, then import it back.
          </span>
        </div>

        {zip && <ZipChip zip={zip} onRemove={() => setZip(null)} />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <InfoCard
            icon={<RiRefreshLine size={18} />}
            title="Matched by product code"
            text="A row whose product code already exists updates that product. Any other row creates a new product."
          />
          <InfoCard
            icon={<RiFolderAddLine size={18} />}
            title="Missing categories are created"
            text="Categories and sub categories that don't exist yet are created, and flagged in the preview first."
          />
          <InfoCard
            icon={<RiInformationLine size={18} />}
            title="Links or ZIP files"
            text="Image and file cells take a link (OneDrive, SharePoint or Google Drive shared with “Anyone with the link”, Dropbox, or any public URL) or a file name from the ZIP. Every file is copied into our storage. Product-specific configurations are not imported."
          />
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------ preview

  const importable = counts.new + counts.update;
  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: rows.length },
    { key: "new", label: "New", count: counts.new },
    { key: "update", label: "Updates", count: counts.update },
    { key: "unchanged", label: "No changes", count: counts.unchanged },
    { key: "attention", label: "Needs attention", count: counts.attention },
    { key: "skipped", label: "Skipped", count: counts.skipped },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Header + summary */}
      <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/20">
              <RiFileTextLine size={20} className="text-primary" />
            </div>
            <div className="flex flex-col min-w-0">
              <Label className="!text-xl !font-semibold">Import Preview</Label>
              <span className="text-sm text-description-color truncate">
                {fileName} · {rows.length} row{rows.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-sm text-description-color hover:text-primary hover:underline cursor-pointer"
          >
            Choose another file
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <StatTile tone="emerald" label="New products" value={counts.new} />
          <StatTile tone="sky" label="Updates" value={counts.update} />
          <StatTile tone="gray" label="No changes" value={counts.unchanged} />
          <StatTile tone="amber" label="New categories / subs" value={newReferences.length} />
          <StatTile tone="red" label="Errors" value={counts.error} />
          <StatTile tone="gray" label="Skipped" value={counts.skipped} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {zip ? (
            <ZipChip zip={zip} onRemove={() => setZip(null)} />
          ) : (
            <div
              {...zipDropzone.getRootProps()}
              className={`flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm cursor-pointer transition-colors ${
                zipDropzone.isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-secondary hover:border-primary/50"
              }`}
            >
              <input {...zipDropzone.getInputProps()} />
              <RiFileZipLine size={18} className="text-primary" />
              Add a ZIP of images and files
            </div>
          )}
          {transfers.size > 0 && (
            <span className="text-sm text-description-color">
              {(() => {
                const all = [...transfers.values()];
                const fromZip = all.filter((t) => t.zipPath).length;
                const linked = all.length - fromZip;
                return [
                  linked && `${linked} linked file${linked === 1 ? "" : "s"} will be downloaded`,
                  fromZip && `${fromZip} file${fromZip === 1 ? "" : "s"} uploaded from the ZIP`,
                ]
                  .filter(Boolean)
                  .join(" and ");
              })()}{" "}
              into storage before saving.
            </span>
          )}
        </div>

        {missingColumns.length > 0 && (
          <Notice tone="sky" icon={<RiInformationLine size={18} />}>
            <span className="font-itc-medium">Not in this file:</span>{" "}
            {missingColumns.join(", ")}. Existing products keep their current
            values for these; new products start empty.
          </Notice>
        )}

        {newReferences.length > 0 && (
          <Notice tone="amber" icon={<RiAddCircleLine size={18} />}>
            <div className="flex flex-col gap-2">
              <span>
                <span className="font-itc-medium">These will be created.</span>{" "}
                If one should match an existing entry, fix its spelling in the
                rows below.
              </span>
              <div className="flex flex-wrap gap-2">
                {newReferences.map((ref) => (
                  <span
                    key={`${ref.kind}-${ref.parent}-${ref.name}`}
                    className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-xs"
                  >
                    <span className="text-amber-700">{ref.kind}</span>
                    <span className="font-itc-medium text-foreground">
                      {ref.parent ? `${ref.parent} › ${ref.name}` : ref.name}
                    </span>
                    <span className="text-description-color">
                      · row{ref.rows.length > 1 ? "s" : ""} {ref.rows.join(", ")}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </Notice>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 bg-white border border-secondary rounded-[10px] p-2 w-fit">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-itc-medium transition-all ${
              filter === f.key
                ? "bg-primary text-white"
                : "text-description-color hover:bg-secondary/10"
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-2 text-xs ${
                filter === f.key ? "bg-white/20" : "bg-secondary/20"
              }`}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Rows */}
      <datalist id="import-categories">
        {categories.map((c) => (
          <option key={c._id} value={c.title} />
        ))}
      </datalist>

      <div className="flex flex-col gap-3">
        {visibleRows.length === 0 && (
          <p className="bg-white border border-secondary rounded-[10px] p-6 text-sm text-black/40">
            No rows in this view.
          </p>
        )}
        {visibleRows.map((r) => (
          <PreviewRow
            key={r.row}
            row={r}
            analysis={analyses.get(r.row)!}
            expanded={expanded.has(r.row)}
            common={common}
            preview={preview}
            subCategoryOptions={subCategories
              .filter((s) => {
                const cat = categories.find(
                  (c) => norm(c.title) === norm(r.cells.category),
                );
                const id = typeof s.category === "string" ? s.category : s.category?._id;
                return cat && id === cat._id;
              })
              .map((s) => s.title)}
            onChange={(key, value) => updateCell(r.row, key, value)}
            onInclude={(include) => setInclude(r.row, include)}
            onRemove={() => removeRow(r.row)}
            onToggle={() => toggleExpanded(r.row)}
          />
        ))}
      </div>

      {/* Action bar */}
      <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-secondary bg-white/95 backdrop-blur px-5 py-4 shadow-lg">
        <span className="text-sm text-description-color">
          <span className="font-itc-medium text-foreground">
            {importable} product{importable === 1 ? "" : "s"}
          </span>{" "}
          will be imported — {counts.new} new, {counts.update} updated.
          {counts.unchanged > 0 &&
            ` ${counts.unchanged} unchanged row${counts.unchanged === 1 ? "" : "s"} will be left as they are.`}
          {counts.error > 0 && ` ${counts.error} row${counts.error === 1 ? "" : "s"} with errors will be left out.`}
        </span>
        <CustomButton
          variant="3"
          type="button"
          text={
            fileProgress
              ? `Storing files ${fileProgress.done} / ${fileProgress.total}...`
              : rowProgress
                ? `Importing ${rowProgress.done} / ${rowProgress.total}...`
                : isImporting
                  ? "Importing..."
                  : `Import ${importable} product${importable === 1 ? "" : "s"}`
          }
          showIcon={false}
          disabled={isImporting || importable === 0}
          onClick={runImport}
        />
      </div>
    </div>
  );
}

// ------------------------------------------------------------ pieces

const TONES = {
  emerald: "border-emerald-200 bg-emerald-50/60 text-emerald-700",
  sky: "border-sky-200 bg-sky-50/60 text-sky-700",
  amber: "border-amber-200 bg-amber-50/60 text-amber-700",
  red: "border-red-200 bg-red-50/60 text-red-600",
  gray: "border-gray-200 bg-gray-50 text-gray-500",
};

function StatTile({
  tone,
  label,
  value,
}: {
  tone: keyof typeof TONES;
  label: string;
  value: number;
}) {
  return (
    <div className={`rounded-lg border px-4 py-3 flex flex-col gap-1 ${TONES[tone]}`}>
      <span className="text-2xl font-itc-medium">{value}</span>
      <span className="text-xs uppercase tracking-wide">{label}</span>
    </div>
  );
}

function Notice({
  tone,
  icon,
  children,
}: {
  tone: keyof typeof TONES;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex gap-3 rounded-lg border px-4 py-3 text-sm ${TONES[tone]}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div className="text-foreground/80">{children}</div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-lg border border-secondary/60 p-4">
      <span className="flex items-center gap-2 text-sm font-itc-medium text-primary">
        {icon}
        {title}
      </span>
      <span className="text-sm text-description-color">{text}</span>
    </div>
  );
}

function ZipChip({ zip, onRemove }: { zip: ImportZip; onRemove: () => void }) {
  return (
    <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-secondary bg-secondary/10 px-3 py-2 text-sm">
      <RiFileZipLine size={18} className="text-primary" />
      <span className="font-itc-medium">{zip.name}</span>
      <span className="text-description-color">· {zip.fileCount} files</span>
      <button
        type="button"
        onClick={onRemove}
        className="text-description-color hover:text-red-600 cursor-pointer"
        aria-label="Remove ZIP"
      >
        <RiCloseLine size={16} />
      </button>
    </span>
  );
}

function NewBadge() {
  return (
    <span className="rounded border border-amber-300 bg-amber-50 px-1.5 text-[10px] font-itc-medium uppercase tracking-wide text-amber-700">
      Will be created
    </span>
  );
}

function PreviewRow({
  row,
  analysis: a,
  expanded,
  common,
  preview,
  subCategoryOptions,
  onChange,
  onInclude,
  onRemove,
  onToggle,
}: {
  row: Row;
  analysis: Analysis;
  expanded: boolean;
  common: CommonLists;
  /** Displayable URL for a link or ZIP file name. */
  preview: (ref: string) => string | undefined;
  subCategoryOptions: string[];
  onChange: (key: keyof ProductCells, value: string) => void;
  onInclude: (include: boolean) => void;
  onRemove: () => void;
  onToggle: () => void;
}) {
  const style = MODE_STYLE[a.mode];
  const p = a.product;
  const listId = `import-subs-${row.row}`;

  // key specs = enabled common spec labels + free-text custom specs
  const specLines = lines(row.cells.keySpecs);
  const enabledSpecs = common.specs
    .map((s) => s.label)
    .filter((label) => specLines.some((l) => norm(l) === norm(label)));
  // raw lines (blank ones kept) so typing a new line in the textarea sticks
  const customSpecs = row.cells.keySpecs
    .split(/\r?\n/)
    .filter((l) => !common.specs.some((s) => norm(s.label) === norm(l)));
  const toggleSpec = (label: string) =>
    onChange(
      "keySpecs",
      [
        ...common.specs
          .map((s) => s.label)
          .filter((l) =>
            l === label ? !enabledSpecs.includes(label) : enabledSpecs.includes(l),
          ),
        ...customSpecs,
      ].join("\n"),
    );

  const configTitles = common.configs.map((c) => c.title);
  const iconImages = common.icons.map((i) => i.image);
  const enabledConfigs = configTitles.filter((t) =>
    (p.commonConfigurations ?? configTitles).some((e) => norm(e) === norm(t)),
  );
  const enabledIcons = iconImages.filter((i) =>
    (p.commonIcons ?? iconImages).includes(i),
  );
  const summary = [
    p.galleryImages.length && `${p.galleryImages.length} gallery image${p.galleryImages.length > 1 ? "s" : ""}`,
    p.photometrics.length && `${p.photometrics.length} photometric${p.photometrics.length > 1 ? "s" : ""}`,
    p.resources.length &&
      `${p.resources.reduce((n, t) => n + t.items.length, 0)} resource file(s)`,
    p.keySpecs.length && `${p.keySpecs.length} key spec${p.keySpecs.length > 1 ? "s" : ""}`,
    p.technicalSpecs.length &&
      `${p.technicalSpecs.reduce((n, g) => n + g.items.length, 0)} technical spec(s)`,
  ].filter(Boolean);

  return (
    <div
      className={`bg-white border border-secondary border-l-4 ${style.border} rounded-[10px] ${
        a.mode === "skipped" ? "opacity-60" : ""
      }`}
    >
      <div className="p-4 flex flex-col gap-3">
        {/* Top line */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-itc-medium text-description-color w-14 shrink-0">
            Row {row.row}
          </span>
          <span
            className={`rounded-md border px-2 py-0.5 text-xs font-itc-medium ${style.badge}`}
          >
            {style.label}
          </span>
          {p.thumbImage && <ImageThumb src={preview(p.thumbImage)} small />}
          <div className="flex-1" />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="size-4"
              checked={row.include}
              onChange={(e) => onInclude(e.target.checked)}
            />
            Include
          </label>
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
            aria-label="Remove row"
          >
            <RiDeleteBinLine size={16} />
          </button>
        </div>

        {/* Key fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-3">
          <Field label="Title" className="xl:col-span-2">
            <Input value={row.cells.title} onChange={(e) => onChange("title", e.target.value)} />
          </Field>
          <Field label="Product Code">
            <Input
              value={row.cells.productCode}
              onChange={(e) => onChange("productCode", e.target.value)}
            />
          </Field>
          <Field label="Category" badge={a.newCategory && <NewBadge />}>
            <Input
              list="import-categories"
              value={row.cells.category}
              onChange={(e) => onChange("category", e.target.value)}
            />
          </Field>
          <Field label="Sub Category" badge={a.newSubCategory && <NewBadge />}>
            <Input
              list={listId}
              value={row.cells.subCategory}
              onChange={(e) => onChange("subCategory", e.target.value)}
            />
            <datalist id={listId}>
              {subCategoryOptions.map((title) => (
                <option key={title} value={title} />
              ))}
            </datalist>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <div className="relative">
                <span
                  className={`pointer-events-none absolute left-2.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ${
                    p.isHidden
                      ? "bg-red-500 ring-4 ring-red-100"
                      : "bg-emerald-500 ring-4 ring-emerald-100"
                  }`}
                />
                <select
                  value={p.isHidden ? "Hidden" : "Visible"}
                  onChange={(e) => onChange("status", e.target.value)}
                  className="h-9 w-full rounded-md border border-secondary bg-white pl-7 pr-2 text-sm"
                >
                  <option>Visible</option>
                  <option>Hidden</option>
                </select>
              </div>
            </Field>
            <Field label="Featured">
              <label className="flex h-9 items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="size-4"
                  checked={p.featured}
                  onChange={(e) => onChange("featured", e.target.checked ? "Yes" : "No")}
                />
                {p.featured ? "Yes" : "No"}
              </label>
            </Field>
          </div>
        </div>

        {/* What happens */}
        <div className="flex flex-col gap-1.5 text-sm">
          {a.mode === "update" && (
            <span className="flex items-start gap-2 text-sky-700">
              <RiRefreshLine size={16} className="mt-0.5 shrink-0" />
              Changes: {a.changes.join(", ")}
            </span>
          )}
          {a.mode === "unchanged" && (
            <span className="flex items-start gap-2 text-gray-500">
              <RiCheckboxCircleLine size={16} className="mt-0.5 shrink-0" />
              Matches the current product — nothing to import. Edit any field
              to turn it into an update.
            </span>
          )}
          {a.mode === "new" && (
            <span className="flex items-start gap-2 text-emerald-700">
              <RiCheckboxCircleLine size={16} className="mt-0.5 shrink-0" />
              {summary.length ? `Includes ${summary.join(" · ")}` : "Basic details only"}
            </span>
          )}
          {a.errors.map((e) => (
            <span key={e} className="flex items-start gap-2 text-red-600">
              <RiErrorWarningLine size={16} className="mt-0.5 shrink-0" />
              {e}
            </span>
          ))}
          {a.warnings.map((w) => (
            <span key={w} className="flex items-start gap-2 text-amber-700">
              <RiAlertLine size={16} className="mt-0.5 shrink-0" />
              {w}
            </span>
          ))}
        </div>
      </div>

      {/* Details */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between border-t border-secondary/60 px-4 py-2.5 text-sm text-description-color hover:bg-secondary/5 cursor-pointer"
      >
        <span>{expanded ? "Hide details" : "Edit details — description, specs, images, files"}</span>
        <RiArrowDownSLine
          size={18}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5 border-t border-secondary/60 bg-secondary/5 p-4">
          <DetailGroup title="Content">
            <Field label="Description">
              <Textarea
                rows={4}
                value={row.cells.description}
                onChange={(e) => onChange("description", e.target.value)}
              />
            </Field>
            <Field label="Custom Key Specs" hint="One per line — common specs are below">
              <Textarea
                rows={3}
                value={customSpecs.join("\n")}
                onChange={(e) =>
                  onChange(
                    "keySpecs",
                    [...enabledSpecs, ...e.target.value.split("\n")].join("\n"),
                  )
                }
              />
            </Field>
            <Field label="Technical Specifications" hint="Group > Key: Value — one per line">
              <Textarea
                rows={6}
                value={row.cells.technicalSpecs}
                onChange={(e) => onChange("technicalSpecs", e.target.value)}
              />
            </Field>
          </DetailGroup>

          <DetailGroup title="Images & files">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Thumb Image" hint="Link or file name">
                <Input
                  value={row.cells.thumbImage}
                  onChange={(e) => onChange("thumbImage", e.target.value)}
                />
              </Field>
              <Field label="Hover Image" hint="Link or file name">
                <Input
                  value={row.cells.hoverImage}
                  onChange={(e) => onChange("hoverImage", e.target.value)}
                />
              </Field>
            </div>
            <Field label="Gallery Images" hint="One link or file name per line, in display order">
              <Textarea
                rows={4}
                value={row.cells.galleryImages}
                onChange={(e) => onChange("galleryImages", e.target.value)}
              />
              {p.galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {p.galleryImages.map((url, i) => (
                    <ImageThumb key={`${url}-${i}`} src={preview(url)} />
                  ))}
                </div>
              )}
            </Field>
            <Field label="Photometric Images" hint="Name: link or file name — one per line">
              <Textarea
                rows={3}
                value={row.cells.photometrics}
                onChange={(e) => onChange("photometrics", e.target.value)}
              />
            </Field>
            <Field label="Resources" hint="Tile > Title: link or file name — one per line">
              <Textarea
                rows={4}
                value={row.cells.resources}
                onChange={(e) => onChange("resources", e.target.value)}
              />
            </Field>
            <Field label="Installation Guide" hint="Link or file name">
              <Input
                value={row.cells.installationGuide}
                onChange={(e) => onChange("installationGuide", e.target.value)}
              />
            </Field>
          </DetailGroup>

          <div className="lg:col-span-2">
            <DetailGroup title="Common to all products">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <CommonBlock
                  title="Common Specs"
                  enabled={enabledSpecs.length}
                  total={common.specs.length}
                >
                  {common.specs.map((spec) => (
                    <ToggleChip
                      key={spec._id}
                      active={enabledSpecs.includes(spec.label)}
                      onClick={() => toggleSpec(spec.label)}
                    >
                      {spec.label}
                    </ToggleChip>
                  ))}
                </CommonBlock>
                <CommonBlock
                  title="Common Configurations"
                  enabled={enabledConfigs.length}
                  total={configTitles.length}
                >
                  {configTitles.map((title) => (
                    <ToggleChip
                      key={title}
                      active={enabledConfigs.includes(title)}
                      onClick={() =>
                        onChange(
                          "commonConfigurations",
                          commonCellFor(toggle(enabledConfigs, title), configTitles),
                        )
                      }
                    >
                      {title}
                    </ToggleChip>
                  ))}
                </CommonBlock>
                <CommonBlock
                  title="Common Icons"
                  enabled={enabledIcons.length}
                  total={iconImages.length}
                >
                  {iconImages.map((image) => {
                    const active = enabledIcons.includes(image);
                    return (
                      <button
                        key={image}
                        type="button"
                        onClick={() =>
                          onChange(
                            "commonIcons",
                            commonCellFor(toggle(enabledIcons, image), iconImages),
                          )
                        }
                        className={`relative h-12 w-12 rounded-md border bg-white p-1.5 transition-all cursor-pointer ${
                          active
                            ? "border-primary ring-1 ring-primary"
                            : "border-secondary/60 opacity-40 hover:opacity-70"
                        }`}
                        aria-pressed={active}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt="" className="h-full w-full object-contain" />
                        {active && (
                          <RiCheckLine
                            size={12}
                            className="absolute -right-1 -top-1 rounded-full bg-primary text-white"
                          />
                        )}
                      </button>
                    );
                  })}
                </CommonBlock>
              </div>
            </DetailGroup>
          </div>
        </div>
      )}
    </div>
  );
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function CommonBlock({
  title,
  enabled,
  total,
  children,
}: {
  title: string;
  enabled: number;
  total: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2.5 rounded-lg border border-secondary/60 bg-white p-3">
      <span className="flex items-center justify-between text-xs font-itc-medium text-description-color">
        {title}
        <span>
          {enabled} of {total} enabled
        </span>
      </span>
      {total === 0 ? (
        <span className="text-xs text-black/40">None set up in Master Data.</span>
      ) : (
        <div className="flex flex-wrap gap-2">{children}</div>
      )}
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-all cursor-pointer ${
        active
          ? "bg-primary text-white border-primary"
          : "border-secondary/60 text-description-color hover:border-primary/50"
      }`}
    >
      {active && <RiCheckLine size={12} />}
      {children}
    </button>
  );
}

function ImageThumb({ src, small = false }: { src?: string; small?: boolean }) {
  if (!src) {
    return (
      <span
        className={`${small ? "h-8 w-8" : "h-14 w-14"} rounded-md border border-dashed border-secondary bg-white`}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={`${small ? "h-8 w-8" : "h-14 w-14"} rounded-md border border-secondary/60 bg-white object-contain`}
    />
  );
}

function Field({
  label,
  hint,
  badge,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  badge?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 min-w-0 ${className}`}>
      <span className="flex items-center gap-2 text-xs font-itc-medium text-description-color">
        {label}
        {hint && <span className="font-normal opacity-70">· {hint}</span>}
        {badge}
      </span>
      {children}
    </div>
  );
}

function DetailGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-itc-medium text-primary border-b border-secondary/60 pb-1.5">
        {title}
      </span>
      {children}
    </div>
  );
}
