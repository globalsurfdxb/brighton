import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import {
  Category,
  ConfigCategory,
  Icon,
  Product,
  Spec,
  SubCategory,
} from "@/app/models/product";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { slugify } from "@/lib/utils/slugify";
import {
  CELL_COLUMN,
  FILE_COLUMNS,
  cellsToProduct,
  changedCells,
  fileRefs,
  formatBytes,
  isLink,
  norm,
  productToCells,
  type ImportResult,
  type ProductCells,
} from "@/lib/productCsv";

/** Product fields each import column writes. */
const COLUMN_FIELDS: Record<keyof ProductCells, string[]> = {
  title: ["title"],
  productCode: ["productCode"],
  category: ["category"],
  subCategory: [], // set / unset separately, see below
  status: ["isHidden"],
  featured: ["featured"],
  description: ["description"],
  keySpecs: ["specs.common", "specs.custom"],
  technicalSpecs: ["thirdSection.items"],
  thumbImage: ["thumbImage"],
  hoverImage: ["hoverImage"],
  galleryImages: ["images", "showThumbInGallery", "showHoverInGallery"],
  photometrics: ["photometrics"],
  resources: ["fourthSection"],
  installationGuide: ["datasheet.installationGuide"],
  commonConfigurations: ["secondSection.commonConfigurations"],
  commonIcons: ["datasheet.icons.common"],
};

/** File size from a HEAD request; "" when the server doesn't say. */
async function remoteSize(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    const length = Number(res.headers.get("content-length"));
    return res.ok && length > 0 ? formatBytes(length) : "";
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { rows, columns } = (await req.json()) as {
    rows: { row: number; cells: ProductCells }[];
    /** Columns present in the file; absent ones leave existing values alone. */
    columns: (keyof ProductCells)[];
  };
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ message: "Nothing to import" }, { status: 400 });
  }
  const fileColumns = (Object.keys(CELL_COLUMN) as (keyof ProductCells)[]).filter(
    (key) => columns?.includes(key),
  );
  const has = (column: keyof ProductCells) => fileColumns.includes(column);

  await connectDB();
  const [categories, subCategories, specs, commonConfigs, commonIcons, existing] =
    await Promise.all([
      Category.find().lean<any[]>(),
      SubCategory.find().lean<any[]>(),
      Spec.find().sort({ order: 1, _id: 1 }).lean<any[]>(),
      ConfigCategory.find({ isCommon: true }).sort({ order: 1, _id: 1 }).lean<any[]>(),
      Icon.find({ isCommon: true }).sort({ _id: -1 }).lean<any[]>(),
      Product.find().lean<any[]>(),
    ]);

  const categoryById = new Map(categories.map((c) => [String(c._id), c]));
  const categoryByTitle = new Map(categories.map((c) => [norm(c.title), c]));
  const subKey = (categoryId: unknown, title: string) =>
    `${String(categoryId)}|${norm(title)}`;
  const subById = new Map(subCategories.map((s) => [String(s._id), s]));
  const subByKey = new Map(
    subCategories.map((s) => [subKey(s.category, s.title), s]),
  );
  const specLabelById = new Map(specs.map((s) => [String(s._id), s.label]));
  const specByLabel = new Map(specs.map((s) => [norm(s.label), s]));
  const commonLists = {
    configTitles: commonConfigs.map((c) => c.title),
    iconImages: commonIcons.map((i) => i.image),
  };
  const productsByCode = new Map<string, any[]>();
  existing.forEach((p) => {
    if (!p.productCode) return;
    const key = norm(p.productCode);
    productsByCode.set(key, [...(productsByCode.get(key) ?? []), p]);
  });
  const usedSlugs = new Set(existing.map((p) => p.slug).filter(Boolean));

  const results: ImportResult[] = [];

  for (const { row, cells } of rows) {
    const { product: p } = cellsToProduct(cells);
    try {
      if (!p.title) throw new Error("Title is required");
      if (!p.category) throw new Error("Category is required");
      // ZIP file names are swapped for stored links before rows are sent;
      // one still here means its upload never happened
      const unresolved = (Object.keys(FILE_COLUMNS) as (keyof ProductCells)[])
        .filter(has)
        .flatMap((key) => fileRefs(key, cells[key]))
        .filter((ref) => !isLink(ref));
      if (unresolved.length) {
        throw new Error(`Files not uploaded: ${unresolved.join(", ")}`);
      }

      const matches = p.productCode
        ? (productsByCode.get(norm(p.productCode)) ?? [])
        : [];
      if (matches.length > 1) {
        throw new Error(
          `Product code matches ${matches.length} existing products`,
        );
      }
      const current = matches[0];

      // ---- existing product: work out which columns actually changed
      const changed = current
        ? changedCells(
            productToCells(
              {
                ...current,
                category: categoryById.get(String(current.category)),
                subCategory: subById.get(String(current.subCategory)),
              },
              {
                specLabel: (spec) => specLabelById.get(String(spec?._id ?? spec)),
                commonConfigs,
                commonIcons,
              },
            ),
            cells,
            commonLists,
            fileColumns,
          )
        : fileColumns;
      const writes = (column: keyof ProductCells) =>
        !current || changed.includes(column);

      if (current && changed.length === 0) {
        results.push({ row, title: p.title, status: "unchanged" });
        continue;
      }

      // ---- references: only resolved / created when they're being written
      const writesCategory = writes("category") || writes("subCategory");
      let category: any = null;
      let subCategory: any = null;
      if (writesCategory) {
        category = categoryByTitle.get(norm(p.category));
        if (!category) {
          category = (
            await Category.create({ title: p.category, slug: slugify(p.category) })
          ).toObject();
          categoryByTitle.set(norm(p.category), category);
          categoryById.set(String(category._id), category);
        }
        if (p.subCategory) {
          subCategory = subByKey.get(subKey(category._id, p.subCategory));
          if (!subCategory) {
            const order = [...subByKey.values()].filter(
              (s) => String(s.category) === String(category._id),
            ).length;
            subCategory = (
              await SubCategory.create({
                title: p.subCategory,
                slug: slugify(p.subCategory),
                category: category._id,
                order,
              })
            ).toObject();
            subByKey.set(subKey(category._id, p.subCategory), subCategory);
            subById.set(String(subCategory._id), subCategory);
          }
        }
      }

      // ---- key specs: known labels toggle common specs, the rest are custom
      const enabledSpecIds = new Set<string>();
      const customSpecs: string[] = [];
      p.keySpecs.forEach((label) => {
        const spec = specByLabel.get(norm(label));
        if (spec) enabledSpecIds.add(String(spec._id));
        else customSpecs.push(label);
      });

      // ---- keep alt texts / file sizes of links that were already there
      const altByImage = new Map<string, string>(
        [...(current?.images ?? []), ...(current?.photometrics ?? [])]
          .filter((img: any) => img.image)
          .map((img: any) => [img.image, img.imageAlt ?? ""]),
      );
      const sizeByLink = new Map<string, string>(
        [
          ...(current?.fourthSection ?? []).flatMap((t: any) => t.items ?? []),
          current?.datasheet?.installationGuide ?? {},
        ]
          .filter((item: any) => item.link && item.size)
          .map((item: any) => [item.link, item.size]),
      );
      const sizeOf = async (link: string) =>
        sizeByLink.get(link) ?? (await remoteSize(link));

      // ---- gallery: thumb / hover links become their slots. When the
      // thumb / hover column isn't being written, the current image counts.
      const thumbImage = writes("thumbImage") ? p.thumbImage : current?.thumbImage;
      const hoverImage = writes("hoverImage") ? p.hoverImage : current?.hoverImage;
      let thumbPlaced = false;
      let hoverPlaced = false;
      const images = p.galleryImages.map((url) => {
        if (thumbImage && url === thumbImage && !thumbPlaced) {
          thumbPlaced = true;
          return { image: "", imageAlt: "", source: "thumb" };
        }
        if (hoverImage && url === hoverImage && !hoverPlaced) {
          hoverPlaced = true;
          return { image: "", imageAlt: "", source: "hover" };
        }
        return { image: url, imageAlt: altByImage.get(url) ?? "" };
      });

      // sizes may need network requests, so only for columns being written
      const [fourthSection, installationGuideSize] = await Promise.all([
        writes("resources")
          ? Promise.all(
              p.resources.map(async (tile) => ({
                title: tile.title,
                items: await Promise.all(
                  tile.items.map(async (item) => ({
                    ...item,
                    size: await sizeOf(item.link),
                  })),
                ),
              })),
            )
          : [],
        writes("installationGuide") && p.installationGuide
          ? sizeOf(p.installationGuide)
          : "",
      ]);

      const fields: Record<string, unknown> = {
        title: p.title,
        productCode: p.productCode,
        category: category?._id,
        isHidden: p.isHidden,
        featured: p.featured,
        description: p.description,
        "specs.common": specs.map((s) => ({
          spec: s._id,
          enabled: enabledSpecIds.has(String(s._id)),
        })),
        "specs.custom": customSpecs,
        "thirdSection.items": p.technicalSpecs,
        thumbImage: p.thumbImage,
        hoverImage: p.hoverImage,
        // with no image there's nothing to hide; keep the default
        showThumbInGallery: thumbImage ? thumbPlaced : true,
        showHoverInGallery: hoverImage ? hoverPlaced : true,
        images,
        photometrics: p.photometrics.map((ph) => ({
          ...ph,
          imageAlt: altByImage.get(ph.image) ?? "",
        })),
        fourthSection,
        "datasheet.installationGuide": {
          link: p.installationGuide,
          size: installationGuideSize,
        },
        // common entries: null = all enabled, otherwise only the listed ones
        "secondSection.commonConfigurations": commonConfigs.map((c) => ({
          category: c._id,
          enabled:
            p.commonConfigurations === null ||
            p.commonConfigurations.some((t) => norm(t) === norm(c.title)),
        })),
        "datasheet.icons.common": commonIcons.map((i) => ({
          icon: i._id,
          enabled: p.commonIcons === null || p.commonIcons.includes(i.image),
        })),
      };

      if (current) {
        // only changed columns are written; every other field — including
        // product-specific configurations — stays exactly as it is
        const $set: Record<string, unknown> = {};
        changed.forEach((column) =>
          COLUMN_FIELDS[column].forEach((field) => {
            $set[field] = fields[field];
          }),
        );
        const update: Record<string, unknown> = { $set };
        if (has("subCategory") && writesCategory) {
          if (subCategory) $set.subCategory = subCategory._id;
          else update.$unset = { subCategory: 1 };
        }
        await Product.updateOne({ _id: current._id }, update);
        results.push({ row, title: p.title, status: "updated", changed });
      } else {
        const base = slugify(p.title) || "product";
        let slug = base;
        for (let n = 2; usedSlugs.has(slug); n++) slug = `${base}-${n}`;
        usedSlugs.add(slug);

        // dotted paths only work in updates; build the nested document here
        const created = await Product.create({
          title: p.title,
          slug,
          productCode: p.productCode,
          category: category._id,
          subCategory: subCategory?._id,
          isHidden: p.isHidden,
          featured: p.featured,
          description: p.description,
          specs: { common: fields["specs.common"], custom: fields["specs.custom"] },
          thirdSection: { title: "", items: fields["thirdSection.items"] },
          thumbImage: p.thumbImage,
          hoverImage: p.hoverImage,
          showThumbInGallery: fields.showThumbInGallery,
          showHoverInGallery: fields.showHoverInGallery,
          images,
          photometrics: fields.photometrics,
          fourthSection,
          // product-specific configurations are not imported
          secondSection: {
            title: "",
            description: "",
            configurations: [],
            commonConfigurations: fields["secondSection.commonConfigurations"],
          },
          datasheet: {
            image: "",
            installationGuide: fields["datasheet.installationGuide"],
            icons: {
              common: fields["datasheet.icons.common"],
              specific: [],
            },
          },
        });
        if (p.productCode) {
          productsByCode.set(norm(p.productCode), [created.toObject()]);
        }
        results.push({ row, title: p.title, status: "created" });
      }
    } catch (e: any) {
      results.push({
        row,
        title: p.title,
        status: "failed",
        message: e?.message || "Import failed",
      });
    }
  }

  return NextResponse.json({ results });
}
