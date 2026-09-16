import connectDB from "@/lib/mongodb";
import {
  Category as CategoryModel,
  SubCategory as SubCategoryModel,
  Product as ProductModel,
  ConfigOption as ConfigOptionModel,
} from "@/app/models/product";
import {
  Category,
  SubCategory,
  Product,
  ProductConfiguration,
  ConfigCategory,
  ConfigOption,
  GetProductsResult,
  GetProductResult,
} from "@/app/types/product";
import { slugify } from "@/lib/utils/slugify";

function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc));
}

async function getCategories(): Promise<Category[]> {
  await connectDB();
  const categories = await CategoryModel.find().sort({ _id: -1 });
  return serialize(categories);
}

async function getSubCategories(): Promise<SubCategory[]> {
  await connectDB();
  const subCategories = await SubCategoryModel.find()
    .populate("category")
    .sort({ _id: -1 });
  return serialize(subCategories);
}

async function getProducts(filter: Record<string, string> = {}): Promise<Product[]> {
  await connectDB();
  const products = await ProductModel.find(filter)
    .populate("category")
    .populate("subCategory")
    .sort({ _id: -1 });
  return serialize(products);
}

export async function getProductsPageData(): Promise<GetProductsResult> {
  const [categories, subCategories, products] = await Promise.all([
    getCategories(),
    getSubCategories(),
    getProducts(),
  ]);
  return { categories, subCategories, products };
}

function populateProductDetail(query: ReturnType<typeof ProductModel.findOne>) {
  return query
    .populate("category")
    .populate("subCategory")
    .populate("secondSection.configurations.category")
    .populate("secondSection.configurations.options")
    .populate("secondSection.configurations.defaultOption")
    .populate("secondSection.commonConfigurations.category")
    .populate("specs.common.spec")
    .populate("datasheet.icons.common.icon")
    .populate("datasheet.icons.specific");
}

/**
 * Common config categories aren't stored pre-expanded — each product just
 * toggles them on/off. Here (once, at read time) we pull in every current
 * option for the enabled ones and merge them into `configurations`, so
 * every consumer downstream can keep treating it as one flat list.
 */
async function mergeCommonConfigurations(
  product: Product & {
    secondSection: {
      commonConfigurations?: { category: unknown; enabled: boolean }[];
    };
  },
): Promise<ProductConfiguration[]> {
  const enabled = (product.secondSection.commonConfigurations ?? [])
    .filter((c) => c.enabled && c.category && typeof c.category === "object")
    .map((c) => c.category as ConfigCategory);

  if (!enabled.length) return product.secondSection.configurations;

  const categoryIds = enabled.map((c) => c._id);
  const options = serialize<ConfigOption[]>(
    await ConfigOptionModel.find({ category: { $in: categoryIds } }).sort({
      order: 1,
      _id: 1,
    }),
  );

  const commonEntries: ProductConfiguration[] = enabled.map((category) => ({
    category,
    options: options.filter(
      (o) =>
        (typeof o.category === "string" ? o.category : o.category._id) ===
        category._id,
    ),
  }));

  return [...product.secondSection.configurations, ...commonEntries];
}

export async function getProductBySlug(
  slug: string,
): Promise<GetProductResult | null> {
  await connectDB();

  let productDoc = await populateProductDetail(ProductModel.findOne({ slug }));

  if (!productDoc) {
    const products = await getProducts();
    const match = products.find((p) => slugify(p.title) === slug);
    if (!match) return null;
    productDoc = await populateProductDetail(ProductModel.findById(match._id));
  }
  if (!productDoc) return null;

  const product = serialize<Product>(productDoc);
  product.secondSection.configurations =
    await mergeCommonConfigurations(product);

  const relatedProducts = await getProducts(
    product.category?._id ? { category: product.category._id } : {},
  );
  const moreProducts = relatedProducts.filter((p) => p._id !== product._id);

  return { product, moreProducts };
}
