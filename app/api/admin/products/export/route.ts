import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { ConfigCategory, Icon, Product } from "@/app/models/product";
import { verifyAdmin } from "@/lib/verifyAdmin";
import { slugify } from "@/lib/utils/slugify";
import {
  CSV_COLUMNS,
  productToCells,
  toCsv,
  type CommonRefs,
} from "@/lib/productCsv";

// multi-value cells put one entry per line (Excel wraps them inside the cell)
function productRow(p: any, origin: string, refs: CommonRefs): string[] {
  const cells = productToCells(p, refs);
  const configurations = (p.secondSection?.configurations ?? [])
    .filter((c: any) => c.category)
    .map(
      (c: any) =>
        `${c.category.title}: ${(c.options ?? [])
          .map((o: any) => o.label)
          .join(", ")}`,
    );

  const byColumn: Record<(typeof CSV_COLUMNS)[number], string> = {
    Title: cells.title,
    "Product Code": cells.productCode,
    Category: cells.category,
    "Sub Category": cells.subCategory,
    Status: cells.status,
    Featured: cells.featured,
    "Product URL": `${origin}/v2/lighting/${p.slug || slugify(p.title ?? "")}`,
    Description: cells.description,
    "Key Specs": cells.keySpecs,
    Configurations: configurations.join("\n"),
    "Common Configurations": cells.commonConfigurations,
    "Technical Specifications": cells.technicalSpecs,
    "Thumb Image": cells.thumbImage,
    "Hover Image": cells.hoverImage,
    "Gallery Images": cells.galleryImages,
    "Photometric Images": cells.photometrics,
    Resources: cells.resources,
    "Installation Guide": cells.installationGuide,
    "Common Icons": cells.commonIcons,
  };
  return CSV_COLUMNS.map((col) => byColumn[col]);
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ message: "No products selected" }, { status: 400 });
  }

  await connectDB();
  const [commonConfigs, commonIcons] = await Promise.all([
    ConfigCategory.find({ isCommon: true }).sort({ order: 1, _id: 1 }).lean<any[]>(),
    Icon.find({ isCommon: true }).sort({ _id: -1 }).lean<any[]>(),
  ]);
  const products = await Product.find({ _id: { $in: ids } })
    .populate("category")
    .populate("subCategory")
    .populate("specs.common.spec")
    .populate("secondSection.configurations.category")
    .populate("secondSection.configurations.options")
    .lean();

  // keep the order the admin saw in the list
  const byId = new Map(products.map((p: any) => [String(p._id), p]));
  const rows = ids
    .map((id: string) => byId.get(id))
    .filter(Boolean)
    .map((p: any) =>
      productRow(p, req.nextUrl.origin, { commonConfigs, commonIcons }),
    );

  return new NextResponse(toCsv([[...CSV_COLUMNS], ...rows]), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="products-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
