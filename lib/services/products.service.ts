import connectDB from "@/lib/mongodb";
import {
  Category as CategoryModel,
  SubCategory as SubCategoryModel,
  Product as ProductModel,
} from "@/app/models/product";
import {
  Category,
  SubCategory,
  Product,
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
    .populate("specs.common.spec")
    .populate("datasheet.icons.common.icon");
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

  const relatedProducts = await getProducts(
    product.category?._id ? { category: product.category._id } : {},
  );
  const moreProducts = relatedProducts.filter((p) => p._id !== product._id);

  return { product, moreProducts };
}
