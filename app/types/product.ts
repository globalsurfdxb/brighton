export interface HomeSection {
  description: string;
  video: string;
  videoAlt: string;
  posterImage: string;
  posterImageAlt: string;
  btnText: string;
  btnLink: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: string;
  homeSection: HomeSection;
}

export interface SubCategory {
  _id: string;
  title: string;
  slug: string;
  icon: string;
  iconAlt: string;
  category: string | Category;
}

export type PreviewType =
  | "none"
  | "shape"
  | "swatch"
  | "size"
  | "beam"
  | "gradient";

export type ShapeType =
  | "round"
  | "square"
  | "round-thick"
  | "square-thick"
  | "circle-dot"
  | "trimless"
  | "trim";

export interface ConfigOptionPreview {
  type: PreviewType;
  shape?: ShapeType;
  color?: string;
  gradient?: string;
  sizeBox?: { width?: number; height?: number };
  beamAngle?: number;
}

export interface ConfigCategory {
  _id: string;
  title: string;
  previewType: PreviewType;
}

export interface ConfigOption {
  _id: string;
  category: string | ConfigCategory;
  label: string;
  code: string;
  swatchColor?: string;
  tooltip: {
    label: string;
    meta?: string;
    preview: ConfigOptionPreview;
  };
}

export interface Spec {
  _id: string;
  label: string;
}

export interface Icon {
  _id: string;
  image: string;
  isCommon?: boolean;
}

export interface ProductSpecCommon {
  spec: Spec;
  enabled: boolean;
}

export interface ProductPhotometric {
  image: string;
  imageAlt: string;
  name: string;
}

export interface ProductImage {
  image: string;
  imageAlt: string;
}

export interface ProductConfiguration {
  category: ConfigCategory;
  options: ConfigOption[];
  defaultOption?: ConfigOption;
}

export interface ProductSpecTableItem {
  key: string;
  value: string;
}

export interface ProductSpecTableGroup {
  title: string;
  items: ProductSpecTableItem[];
}

export interface ProductDatasheetIconCommon {
  icon: Icon;
  enabled: boolean;
}

export interface ProductResourceItem {
  title: string;
  link: string;
  size: string;
}

export interface ProductResourceTile {
  title: string;
  items: ProductResourceItem[];
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  isHidden: boolean;
  category: Category;
  subCategory: SubCategory;

  thumbImage: string;
  thumbImageAlt: string;
  hoverImage: string;
  hoverImageAlt: string;
  productCode: string;
  featured: boolean;

  description: string;
  specs: {
    common: ProductSpecCommon[];
    custom: string[];
  };
  images: ProductImage[];
  photometrics: ProductPhotometric[];

  secondSection: {
    title: string;
    description: string;
    configurations: ProductConfiguration[];
  };

  thirdSection: {
    title: string;
    items: ProductSpecTableGroup[];
  };

  fourthSection: ProductResourceTile[];

  datasheet: {
    image: string;
    installationGuide: {
      link: string;
      size: string;
    };
    icons: {
      // common icons toggled on/off for this product, default enabled
      common: ProductDatasheetIconCommon[];
      // icons picked specifically for this product from the non-common list
      specific: Icon[];
    };
  };
}

export interface GetProductsResult {
  categories: Category[];
  subCategories: SubCategory[];
  products: Product[];
}

export interface GetProductResult {
  product: Product;
  moreProducts: Product[];
}
