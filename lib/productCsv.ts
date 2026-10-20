/**
 * Shared CSV format for product export / import. Both sides go through
 * `productToCells` / `cellsToProduct`, so an exported file re-imports as-is.
 *
 * Multi-value cells hold one entry per line:
 *   Key Specs                 label
 *   Technical Specifications  Group > Key: Value
 *   Gallery Images            https://…
 *   Photometric Images        Name: https://…
 *   Resources                 Tile > Title: https://…
 *   Common Configurations     configuration name   (blank = all on, "None" = all off)
 *   Common Icons              https://…            (blank = all on, "None" = all off)
 *
 * Image / file cells (see FILE_COLUMNS) take a link or the name of a file in
 * the images ZIP uploaded with the CSV. Before rows are imported, every one
 * that isn't already in our storage is copied there and the cell is rewritten
 * to the stored link, so the database only ever holds our own links.
 */

export const CSV_COLUMNS = [
  "Title",
  "Product Code",
  "Category",
  "Sub Category",
  "Status",
  "Featured",
  "Product URL",
  "Description",
  "Key Specs",
  "Configurations",
  "Common Configurations",
  "Technical Specifications",
  "Thumb Image",
  "Hover Image",
  "Gallery Images",
  "Photometric Images",
  "Resources",
  "Installation Guide",
  "Common Icons",
] as const;

/** Export-only columns; ignored on import. */
export const EXPORT_ONLY_COLUMNS = ["Product URL", "Configurations"];

/** The editable, string-per-column shape of one product row. */
export type ProductCells = {
  title: string;
  productCode: string;
  category: string;
  subCategory: string;
  status: string;
  featured: string;
  description: string;
  keySpecs: string;
  technicalSpecs: string;
  thumbImage: string;
  hoverImage: string;
  galleryImages: string;
  photometrics: string;
  resources: string;
  installationGuide: string;
  commonConfigurations: string;
  commonIcons: string;
};

export const CELL_COLUMN: Record<keyof ProductCells, (typeof CSV_COLUMNS)[number]> = {
  title: "Title",
  productCode: "Product Code",
  category: "Category",
  subCategory: "Sub Category",
  status: "Status",
  featured: "Featured",
  description: "Description",
  keySpecs: "Key Specs",
  technicalSpecs: "Technical Specifications",
  thumbImage: "Thumb Image",
  hoverImage: "Hover Image",
  galleryImages: "Gallery Images",
  photometrics: "Photometric Images",
  resources: "Resources",
  installationGuide: "Installation Guide",
  commonConfigurations: "Common Configurations",
  commonIcons: "Common Icons",
};

export type ImportProduct = {
  title: string;
  productCode: string;
  category: string;
  subCategory: string;
  isHidden: boolean;
  featured: boolean;
  description: string;
  keySpecs: string[];
  technicalSpecs: { title: string; items: { key: string; value: string }[] }[];
  thumbImage: string;
  hoverImage: string;
  galleryImages: string[];
  photometrics: { name: string; image: string }[];
  resources: { title: string; items: { title: string; link: string }[] }[];
  installationGuide: string;
  /** Enabled common entries (titles / icon links); null = all enabled. */
  commonConfigurations: string[] | null;
  commonIcons: string[] | null;
};

export type ImportResult = {
  row: number;
  title: string;
  status: "created" | "updated" | "unchanged" | "failed";
  /** Columns written, for updates. */
  changed?: (keyof ProductCells)[];
  message?: string;
  /** Files that couldn't be stored; their column was left as it was. */
  fileWarnings?: string[];
};

/** Columns an import file must have. */
export const REQUIRED_CELLS: (keyof ProductCells)[] = [
  "title",
  "productCode",
  "category",
];

export const norm = (value: unknown) =>
  String(value ?? "").trim().replace(/\s+/g, " ").toLowerCase();

export const isLink = (value: string) => /^https?:\/\/\S+$/i.test(value.trim());

// ---------------------------------------------------------- file cells

/** File types each kind of file column accepts, by extension. */
export const FILE_TYPES = {
  image: ["jpg", "jpeg", "png", "webp", "gif", "avif", "svg"],
  // .lbx / .ies / .ldt are photometric data files
  document: ["pdf", "doc", "docx", "xls", "xlsx", "lbx", "ies", "ldt"],
} as const;
export type FileKind = keyof typeof FILE_TYPES;

/** Largest image / file an import stores, whether linked or from the ZIP. */
export const MAX_IMPORT_FILE_BYTES = 25 * 1024 * 1024;

/** Columns that hold files, and the kind of file each one takes. */
export const FILE_COLUMNS: Partial<Record<keyof ProductCells, FileKind>> = {
  thumbImage: "image",
  hoverImage: "image",
  galleryImages: "image",
  photometrics: "image",
  resources: "document",
  installationGuide: "document",
};

const FILE_EXT = new RegExp(
  `\\.(${[...FILE_TYPES.image, ...FILE_TYPES.document].join("|")})$`,
  "i",
);

/** Lower-case extension of a link or file name, without query / hash. */
export const fileExt = (ref: string) =>
  ref.split(/[?#]/)[0].match(/\.([a-z0-9]+)$/i)?.[1].toLowerCase() ?? "";

/** A file name (or path) inside the images ZIP, e.g. "BR-1020/thumb.jpg". */
export const isFileName = (value: string) => {
  const v = value.trim();
  return !/[:*?"<>|\r\n]/.test(v) && FILE_EXT.test(v);
};

/** A link, or a file name to look up in the images ZIP. */
export const isFileRef = (value: string) => isLink(value) || isFileName(value);

export const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`;
}

// ---------------------------------------------------------------- CSV text

export function toCsvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows: unknown[][]): string {
  // BOM so Excel opens UTF-8 (°, ±, etc.) correctly
  return "﻿" + rows.map((r) => r.map(toCsvCell).join(",")).join("\r\n");
}

/** RFC 4180 parser: quoted cells may contain commas, quotes and line breaks. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += ch;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

/** CSV text → one ProductCells per data row, matched by header name. */
export function csvToCells(text: string): {
  rows: ProductCells[];
  missingColumns: string[];
} {
  const [header = [], ...data] = parseCsv(text);
  const index = new Map(header.map((h, i) => [norm(h), i]));
  const missingColumns = Object.values(CELL_COLUMN).filter(
    (col) => !index.has(norm(col)),
  );

  const rows = data.map((cells) => {
    const row = {} as ProductCells;
    (Object.keys(CELL_COLUMN) as (keyof ProductCells)[]).forEach((key) => {
      const i = index.get(norm(CELL_COLUMN[key]));
      row[key] = i === undefined ? "" : (cells[i] ?? "").trim();
    });
    return row;
  });
  return { rows, missingColumns };
}

// ------------------------------------------------------ product ⇄ cells

export type CommonRefs = {
  /** Resolves a specs.common entry's spec (populated doc or bare id) to its label. */
  specLabel?: (spec: any) => string | undefined;
  /** Master lists of common config categories / icons, in display order. */
  commonConfigs?: { _id: unknown; title: string }[];
  commonIcons?: { _id: unknown; image: string }[];
};

/** Enabled common entries as cell text; missing entries count as enabled. */
function commonCell<T extends { _id: unknown }>(
  entries: any[] | undefined,
  key: string,
  list: T[],
  label: (item: T) => string,
): string {
  if (!list.length) return "";
  const enabled = list.filter((item) => {
    const entry = (entries ?? []).find(
      (e) => String(e[key]?._id ?? e[key]) === String(item._id),
    );
    return entry ? entry.enabled : true;
  });
  return enabled.length ? enabled.map(label).join("\n") : "None";
}

/** Product document → cells. */
export function productToCells(
  p: any,
  {
    specLabel = (spec) => spec?.label,
    commonConfigs = [],
    commonIcons = [],
  }: CommonRefs = {},
): ProductCells {
  const keySpecs = [
    ...(p.specs?.custom ?? []),
    ...(p.specs?.common ?? [])
      .filter((c: any) => c.enabled && c.spec)
      .map((c: any) => ({ label: specLabel(c.spec), order: c.spec?.order ?? 0 }))
      .filter((c: any) => c.label)
      .sort((a: any, b: any) => a.order - b.order)
      .map((c: any) => c.label),
  ];

  const technicalSpecs = (p.thirdSection?.items ?? []).flatMap((group: any) =>
    (group.items ?? [])
      .filter((i: any) => i.key || i.value)
      .map((i: any) =>
        [group.title, `${i.key}: ${i.value}`].filter(Boolean).join(" > "),
      ),
  );

  const sources: Record<string, string> = {
    thumb: p.showThumbInGallery !== false ? p.thumbImage : "",
    hover: p.showHoverInGallery !== false ? p.hoverImage : "",
  };
  const images: any[] = p.images ?? [];
  // same ordering rule as the detail page: unsaved products lead with thumb/hover
  const ordered = images.some((img) => img.source)
    ? images
    : [{ source: "thumb" }, { source: "hover" }, ...images];
  const galleryImages = ordered
    .map((img) => (img.source ? sources[img.source] : img.image))
    .filter(Boolean);

  const photometrics = (p.photometrics ?? [])
    .filter((ph: any) => ph.image)
    .map((ph: any) => (ph.name ? `${ph.name}: ${ph.image}` : ph.image));

  const resources = (p.fourthSection ?? []).flatMap((tile: any) =>
    (tile.items ?? [])
      .filter((item: any) => item.link)
      .map((item: any) => `${tile.title} > ${item.title}: ${item.link}`),
  );

  return {
    title: p.title ?? "",
    productCode: p.productCode ?? "",
    category: p.category?.title ?? "",
    subCategory: p.subCategory?.title ?? "",
    status: p.isHidden ? "Hidden" : "Visible",
    featured: p.featured ? "Yes" : "No",
    description: p.description ?? "",
    keySpecs: keySpecs.join("\n"),
    technicalSpecs: technicalSpecs.join("\n"),
    thumbImage: p.thumbImage ?? "",
    hoverImage: p.hoverImage ?? "",
    galleryImages: galleryImages.join("\n"),
    photometrics: photometrics.join("\n"),
    resources: resources.join("\n"),
    installationGuide: p.datasheet?.installationGuide?.link ?? "",
    commonConfigurations: commonCell(
      p.secondSection?.commonConfigurations,
      "category",
      commonConfigs,
      (c) => c.title,
    ),
    commonIcons: commonCell(
      p.datasheet?.icons?.common,
      "icon",
      commonIcons,
      (i) => i.image,
    ),
  };
}

/** Split "a > b" on the first separator; `before` is "" when absent. */
function splitFirst(value: string, sep: string): [string, string] {
  const i = value.indexOf(sep);
  return i === -1
    ? ["", value.trim()]
    : [value.slice(0, i).trim(), value.slice(i + sep.length).trim()];
}

/** Trailing link or file name of a "Label: https://…" / "Label: file.pdf" line. */
function splitLink(line: string): { label: string; link: string } | null {
  const value = line.trim();
  if (isFileRef(value)) return { label: "", link: value };
  const url = value.match(/^(.*?):\s*(https?:\/\/\S+)$/i);
  if (url) return { label: url[1].trim(), link: url[2] };
  const file = value.match(/^(.*):\s*([^:]+)$/);
  return file && isFileName(file[2])
    ? { label: file[1].trim(), link: file[2].trim() }
    : null;
}

/** Every file reference (link or ZIP file name) in a file column's cell. */
export function fileRefs(key: keyof ProductCells, value: string): string[] {
  if (!FILE_COLUMNS[key]) return [];
  return lines(value).flatMap((line) => {
    const ref = splitLink(line)?.link;
    return ref ? [ref] : [];
  });
}

/** Rewrite the file references in a cell; a null replacement drops the line. */
export function replaceFileRefs(
  key: keyof ProductCells,
  value: string,
  replace: (ref: string) => string | null,
): string {
  if (!FILE_COLUMNS[key]) return value;
  return lines(value)
    .flatMap((line) => {
      const ref = splitLink(line)?.link;
      if (!ref) return [line];
      const next = replace(ref);
      // the reference is always the end of the line
      return next === null ? [] : [line.slice(0, line.lastIndexOf(ref)) + next];
    })
    .join("\n");
}

/** Blank = all enabled (null), "None" = none enabled. */
export function parseCommon(cell: string): string[] | null {
  if (!cell.trim()) return null;
  if (norm(cell) === "none") return [];
  return lines(cell);
}

/** Cells → structured product, plus warnings for values that were dropped. */
export function cellsToProduct(cells: ProductCells): {
  product: ImportProduct;
  warnings: string[];
} {
  const warnings: string[] = [];
  const linkOrEmpty = (value: string, label: string) => {
    if (!value || isFileRef(value)) return value;
    warnings.push(`${label}: "${value}" is not a link or file name, left empty`);
    return "";
  };

  const technicalSpecs: ImportProduct["technicalSpecs"] = [];
  lines(cells.technicalSpecs).forEach((line) => {
    const [group, rest] = splitFirst(line, " > ");
    const [key, value] = rest.includes(":")
      ? [rest.slice(0, rest.indexOf(":")).trim(), rest.slice(rest.indexOf(":") + 1).trim()]
      : [rest, ""];
    let target = technicalSpecs.find((g) => g.title === group);
    if (!target) {
      target = { title: group, items: [] };
      technicalSpecs.push(target);
    }
    target.items.push({ key, value });
  });

  const galleryImages = lines(cells.galleryImages).filter((line) => {
    if (isFileRef(line)) return true;
    warnings.push(`Gallery: "${line}" is not a link or file name, skipped`);
    return false;
  });

  const photometrics = lines(cells.photometrics).flatMap((line) => {
    const parsed = splitLink(line);
    if (parsed) return [{ name: parsed.label, image: parsed.link }];
    warnings.push(`Photometric: "${line}" has no link or file name, skipped`);
    return [];
  });

  const resources: ImportProduct["resources"] = [];
  lines(cells.resources).forEach((line) => {
    const parsed = splitLink(line);
    if (!parsed) {
      warnings.push(`Resource: "${line}" has no link or file name, skipped`);
      return;
    }
    const [tile, title] = splitFirst(parsed.label, " > ");
    const tileTitle = tile || "Resources";
    let target = resources.find((t) => t.title === tileTitle);
    if (!target) {
      target = { title: tileTitle, items: [] };
      resources.push(target);
    }
    target.items.push({
      title: title || parsed.link.split("/").pop() || "File",
      link: parsed.link,
    });
  });

  return {
    product: {
      title: cells.title.trim(),
      productCode: cells.productCode.trim(),
      category: cells.category.trim(),
      subCategory: cells.subCategory.trim(),
      isHidden: norm(cells.status) === "hidden",
      featured: ["yes", "true", "1"].includes(norm(cells.featured)),
      description: cells.description.trim(),
      keySpecs: lines(cells.keySpecs),
      technicalSpecs,
      thumbImage: linkOrEmpty(cells.thumbImage.trim(), "Thumb image"),
      hoverImage: linkOrEmpty(cells.hoverImage.trim(), "Hover image"),
      galleryImages,
      photometrics,
      resources,
      installationGuide: linkOrEmpty(
        cells.installationGuide.trim(),
        "Installation guide",
      ),
      commonConfigurations: parseCommon(cells.commonConfigurations),
      commonIcons: parseCommon(cells.commonIcons),
    },
    warnings,
  };
}

// ------------------------------------------------------------ changes

/** Compare cells the way the import reads them, so formatting isn't a change. */
function comparable(
  key: keyof ProductCells,
  value: string,
  common: { configTitles: string[]; iconImages: string[] },
): string {
  if (key === "status") return norm(value) === "hidden" ? "hidden" : "visible";
  if (key === "featured")
    return ["yes", "true", "1"].includes(norm(value)) ? "yes" : "no";
  // whitespace-insensitive but case-sensitive, so "spin" → "Spin" is a change
  const tidy = (l: string) => l.replace(/\s+/g, " ");
  // spec order follows the master list, so compare as a set
  if (key === "keySpecs") return lines(value).map(tidy).sort().join("\n");
  // names match case-insensitively on import; blank = all enabled
  if (key === "commonConfigurations")
    return (parseCommon(value) ?? common.configTitles).map(norm).sort().join("\n");
  if (key === "commonIcons")
    return (parseCommon(value) ?? common.iconImages).sort().join("\n");
  return lines(value).map(tidy).join("\n");
}

/**
 * Columns whose value differs between the current product and the import
 * row. Only these are written when updating an existing product.
 */
export function changedCells(
  before: ProductCells,
  after: ProductCells,
  common: { configTitles: string[]; iconImages: string[] },
  columns: (keyof ProductCells)[],
): (keyof ProductCells)[] {
  return columns.filter(
    (key) =>
      comparable(key, before[key], common) !== comparable(key, after[key], common),
  );
}
