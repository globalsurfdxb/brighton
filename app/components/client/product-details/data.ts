export const productBannerData = {
  category: "Ceiling Recessed Downlight",
  subCategory: "Interior Lighting",
  name: "Spin",
  description:
    "Architectural recessed downlight engineered for atmospheric, application-led interior lighting. Configurable across 6 reflector finishes, 5 frame options, and 4 beam angles.",
  images: [
    {
      src: "/assets/images/product-details/1.png",
      alt: "Spin downlight angled view",
    },
    {
      src: "/assets/images/product-details/2.png",
      alt: "Spin downlight housing",
    },
    {
      src: "/assets/images/product-details/3.png",
      alt: "Spin downlight top view",
    },
    {
      src: "/assets/images/product-details/4.png",
      alt: "Spin downlight close up",
    },
  ],
  specs: ["14 Variants", "IP44 / IP55", "3-Step MacAdam", "DALI . ON/OFF"],
  buttons: [
    { text: "Download Datasheet", link: "#" },
    { text: "Configure Variant", link: "#" },
  ],
};

// product-details
export const product = {
  brand: "BR",
  productCode: "SP",
  name: "Spin",
  category: "Interior Lighting",
};

export const attributes = [
  {
    id: "form",
    label: "Form",
    options: [
      {
        id: "round",
        code: "R",
        label: "Round",
        default: true,
        tooltip: { label: "Round", preview: { type: "shape", shape: "round" } },
      },
      {
        id: "square",
        code: "S",
        label: "Square",
        tooltip: {
          label: "Square",
          preview: { type: "shape", shape: "square" },
        },
      },
    ],
  },
  {
    id: "trim",
    label: "Trim",
    options: [
      {
        id: "trimless",
        code: "W",
        label: "Trimless",
        default: true,
        tooltip: {
          label: "Trimless",
          meta: "Flush · no visible frame",
          preview: { type: "shape", shape: "trimless" },
        },
      },
      {
        id: "trim",
        code: "L",
        label: "Trim",
        tooltip: {
          label: "Trim",
          meta: "Visible bezel",
          preview: { type: "shape", shape: "trim" },
        },
      },
    ],
  },
  {
    id: "reflector",
    label: "Reflector Finish",
    options: [
      {
        id: "white",
        code: "WH",
        label: "White",
        swatchColor: "linear-gradient(180deg, #FFFFFF 0%, #FEFEFE 100%)",
        tooltip: {
          label: "White",
          preview: {
            type: "swatch",
            color: "linear-gradient(180deg, #FFFFFF 0%, #FEFEFE 100%)",
          },
        },
      },
      {
        id: "glossy-black",
        code: "GB",
        label: "Glossy Black",
        swatchColor: "linear-gradient(180deg, #868686 0%, #000000 100%)",
        tooltip: {
          label: "Glossy Black",
          preview: {
            type: "swatch",
            color: "linear-gradient(180deg, #868686 0%, #000000 100%)",
          },
        },
      },
      {
        id: "glossy-silver",
        code: "GS",
        label: "Glossy Silver",
        swatchColor: "linear-gradient(180deg, #F2F2F2 0%, #DADADA 100%)",
        tooltip: {
          label: "Glossy Silver",
          preview: {
            type: "swatch",
            gradient: "linear-gradient(180deg, #F2F2F2 0%, #DADADA 100%)",
          },
        },
      },
      {
        id: "matt-silver",
        code: "MS",
        label: "Matt Silver",
        swatchColor: "linear-gradient(180deg, #E4E4E4 0%, #D0D0D0 100%)",
        tooltip: {
          label: "Matt Silver",
          preview: {
            type: "swatch",
            color: "linear-gradient(180deg, #E4E4E4 0%, #D0D0D0 100%)",
          },
        },
      },
      {
        id: "matt-black",
        code: "MB",
        label: "Matt Black",
        swatchColor: "linear-gradient(180deg, #474747 0%, #000000 100%)",
        default: true,
        tooltip: {
          label: "Matt Black",
          preview: {
            type: "swatch",
            color: "linear-gradient(180deg, #474747 0%, #000000 100%)",
          },
        },
      },
      {
        id: "gold",
        code: "GO",
        label: "Gold",
        swatchColor: "linear-gradient(180deg, #E6D196 0%, #C0A351 100%)",
        tooltip: {
          label: "Gold",
          preview: {
            type: "swatch",
            gradient: "linear-gradient(180deg, #E6D196 0%, #C0A351 100%)",
          },
        },
      },
    ],
  },
  {
    id: "size",
    label: "Size",
    options: [
      {
        id: "62x85",
        code: "62×85",
        label: "62 × 85",
        default: true,
        tooltip: {
          label: "62 × 85 mm",
          meta: "For 7W / 10W",
          preview: { type: "size", sizeBox: { width: 38, height: 26 } },
        },
      },
      {
        id: "84x110",
        code: "84×110",
        label: "84 × 110",
        tooltip: {
          label: "84 × 110 mm",
          meta: "For 12W / 18W",
          preview: { type: "size", sizeBox: { width: 46, height: 32 } },
        },
      },
      {
        id: "105x130",
        code: "105×130",
        label: "105 × 130",
        tooltip: {
          label: "105 × 130 mm",
          meta: "For 20W / 25W",
          preview: { type: "size", sizeBox: { width: 54, height: 38 } },
        },
      },
    ],
  },
  {
    id: "wattage",
    label: "Wattage",
    options: [
      {
        id: "7w",
        code: "7",
        label: "7W",
        tooltip: {
          label: "7W",
          meta: "700 lm output",
          preview: { type: "none" },
        },
      },
      {
        id: "10w",
        code: "10",
        label: "10W",
        default: true,
        tooltip: {
          label: "10W",
          meta: "1000 lm output",
          preview: { type: "none" },
        },
      },
      {
        id: "12w",
        code: "12",
        label: "12W",
        tooltip: {
          label: "12W",
          meta: "1200 lm output",
          preview: { type: "none" },
        },
      },
      {
        id: "18w",
        code: "18",
        label: "18W",
        tooltip: {
          label: "18W",
          meta: "1800 lm output",
          preview: { type: "none" },
        },
      },
      {
        id: "25w",
        code: "25",
        label: "25W",
        tooltip: {
          label: "25W",
          meta: "2500 lm output",
          preview: { type: "none" },
        },
      },
    ],
  },
  {
    id: "cct",
    label: "CCT",
    options: [
      {
        id: "2700k",
        code: "27",
        label: "2700K",
        tooltip: {
          label: "2700K Warm White",
          preview: {
            type: "gradient",
            gradient: "linear-gradient(135deg, #FFD9A8, #FFB76A)",
          },
        },
      },
      {
        id: "3000k",
        code: "30",
        label: "3000K",
        default: true,
        tooltip: {
          label: "3000K Warm",
          preview: {
            type: "gradient",
            gradient: "linear-gradient(135deg, #FFEAC8, #FFCB8C)",
          },
        },
      },
      {
        id: "4000k",
        code: "40",
        label: "4000K",
        tooltip: {
          label: "4000K Neutral",
          preview: {
            type: "gradient",
            gradient: "linear-gradient(135deg, #FFF8E8, #F0EAD8)",
          },
        },
      },
    ],
  },
  {
    id: "cri",
    label: "CRI",
    options: [
      {
        id: "cri80",
        code: "80",
        label: "80",
        tooltip: {
          label: "CRI 80",
          meta: "Standard quality",
          preview: { type: "none" },
        },
      },
      {
        id: "cri90",
        code: "90",
        label: "90",
        default: true,
        tooltip: {
          label: "CRI 90",
          meta: "High colour rendering",
          preview: { type: "none" },
        },
      },
    ],
  },
  {
    id: "ip",
    label: "IP Rating",
    options: [
      {
        id: "ip44",
        code: "44",
        label: "IP44",
        tooltip: {
          label: "IP44",
          meta: "Splash resistant",
          preview: { type: "none" },
        },
      },
      {
        id: "ip65",
        code: "65",
        label: "IP65",
        default: true,
        tooltip: {
          label: "IP65",
          meta: "Dust + water resistant",
          preview: { type: "none" },
        },
      },
    ],
  },
  {
    id: "beam",
    label: "Beam Angle",
    options: [
      {
        id: "15",
        code: "15",
        label: "15°",
        tooltip: {
          label: "15° Spot",
          meta: "Accent art lighting",
          preview: { type: "beam", beamAngle: 15 },
        },
      },
      {
        id: "24",
        code: "24",
        label: "24°",
        tooltip: {
          label: "24° Narrow",
          meta: "Wall washing",
          preview: { type: "beam", beamAngle: 24 },
        },
      },
      {
        id: "38",
        code: "38",
        label: "38°",
        default: true,
        tooltip: {
          label: "38° Medium",
          meta: "General lighting",
          preview: { type: "beam", beamAngle: 38 },
        },
      },
      {
        id: "60",
        code: "60",
        label: "60°",
        tooltip: {
          label: "60° Wide",
          meta: "Ambient lobby",
          preview: { type: "beam", beamAngle: 60 },
        },
      },
    ],
  },
  {
    id: "frame",
    label: "Frame",
    options: [
      {
        id: "round-trimless",
        code: "RT",
        label: "Round Trimless",
        default: true,
        tooltip: {
          label: "Round Trimless",
          preview: { type: "shape", shape: "round" },
        },
      },
      {
        id: "square-trimless",
        code: "ST",
        label: "Square Trimless",
        tooltip: {
          label: "Square Trimless",
          preview: { type: "shape", shape: "square" },
        },
      },
      {
        id: "round-trim",
        code: "RTR",
        label: "Round Trim",
        tooltip: {
          label: "Round Trim",
          preview: { type: "shape", shape: "round-thick" },
        },
      },
      {
        id: "square-trim",
        code: "STR",
        label: "Square Trim",
        tooltip: {
          label: "Square Trim",
          preview: { type: "shape", shape: "square-thick" },
        },
      },
      {
        id: "pin-hole",
        code: "PH",
        label: "Pin Hole",
        tooltip: {
          label: "Pin Hole",
          preview: { type: "shape", shape: "circle-dot" },
        },
      },
    ],
  },
  {
    id: "control",
    label: "Control",
    options: [
      {
        id: "dali",
        code: "D",
        label: "DALI",
        default: true,
        tooltip: {
          label: "DALI",
          meta: "Digital dimming",
          preview: { type: "none" },
        },
      },
      {
        id: "onoff",
        code: "O",
        label: "ON/OFF",
        tooltip: {
          label: "ON/OFF",
          meta: "Non-dimmable",
          preview: { type: "none" },
        },
      },
    ],
  },
];

// Wrap in data.ts — swap this for a fetch() later, same shape, nothing else changes.

export const Specification = {
  title: "Technical Specification",
  groups: [
    {
      id: "electrical",
      label: "Electrical",
      rows: [
        { label: "Wattage", value: "10 W" },
        { label: "Voltage", value: "220-240 V AC" },
        { label: "Current", value: "350 mA" },
        { label: "Power Factor", value: "λ > 0.95" },
        { label: "THD", value: "< 10%" },
        { label: "Dimming", value: "DALI · ON/OFF" },
      ],
    },
    {
      id: "photometric-top",
      label: "Photometric",
      rows: [
        { label: "Wattage", value: "10 W" },
        { label: "Voltage", value: "220-240 V AC" },
        { label: "Current", value: "350 mA" },
        { label: "Power Factor", value: "λ > 0.95" },
        { label: "THD", value: "< 10%" },
        { label: "Dimming", value: "DALI · ON/OFF" },
      ],
    },
    {
      id: "photometric-bottom",
      label: "Photometric",
      rows: [
        { label: "Lumen Output", value: "1000 lm" },
        { label: "CCT", value: "3000K" },
        { label: "CRI", value: "90" },
        { label: "Beam Angle", value: "38°" },
        { label: "MacAdam", value: "3-Step" },
      ],
    },
    {
      id: "environmental",
      label: "Environmental",
      rows: [
        { label: "IP Rating", value: "IP65" },
        { label: "IK Rating", value: "IK02" },
        { label: "Ambient Temp", value: "-20° to +45°C" },
        { label: "Lifetime", value: "L70 > 50,000 hrs" },
        { label: "Warranty", value: "5 years" },
      ],
    },
  ],
};

export const resourceData = {
  resourcesTitle: "Specifier Resources",
  certificationsTitle: "Certifications",

  specifierResources: [
    {
      id: "datasheet",
      fileType: "PDF",
      name: "Datasheet",
      meta: "2.4 MB",
      action: "Download",
      href: "/downloads/spin-datasheet.pdf",
    },
    {
      id: "photometric",
      fileType: "IES",
      name: "Photometric File",
      meta: "160 KB",
      action: "Download",
      href: "/downloads/spin-photometric.ies",
    },
    {
      id: "cad",
      fileType: "DWG",
      name: "2D Drawings (CAD)",
      meta: "2.4 MB",
      action: "Download",
      href: "/downloads/spin-drawings.dwg",
    },
    {
      id: "revit",
      fileType: "RFA",
      name: "Revit Family (BIM)",
      meta: "1.6 MB",
      action: "Email required",
      href: "/downloads/spin-revit.rfa",
    },
    {
      id: "imagery",
      fileType: "IMG",
      name: "High-Res Imagery",
      meta: "12 MB",
      action: "Email required",
      href: "/downloads/spin-imagery.zip",
    },
    {
      id: "qr",
      fileType: "QR",
      name: "QR Code · Variant Link",
      meta: "PNG + SVG",
      action: "Opens this exact configuration",
      href: "/downloads/spin-qr.zip",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      fileType: "PDF",
      name: "Certificate Name",
      href: "/downloads/certificate-1.pdf",
    },
    {
      id: "cert-2",
      fileType: "PDF",
      name: "Certificate Name",
      href: "/downloads/certificate-2.pdf",
    },
    {
      id: "cert-3",
      fileType: "PDF",
      name: "Certificate Name",
      href: "/downloads/certificate-3.pdf",
    },
  ],
};

export const moreProductsData = {
  sectionTitle: "Explore More Families",
  products: [
    {
      id: "spin-e",
      title: "Spin E",
      subtitle: "LED Recessed Downlight",
      image: "/assets/images/products/interior/1.png",
      hoverImage: "/assets/images/products/interior/hover.jpg",
      category: "interior",
      subcategoryId: "ceiling-recessed-downlight",
    },
    {
      id: "rusty",
      title: "Rusty",
      subtitle: "LED Recessed Downlight",
      image: "/assets/images/products/interior/2.png",
      hoverImage: "/assets/images/products/interior/hover.jpg",
      category: "interior",
      subcategoryId: "ceiling-recessed-downlight",
    },
    {
      id: "zen",
      title: "Zen",
      subtitle: "LED Recessed Downlight",
      image: "/assets/images/products/interior/3.png",
      hoverImage: "/assets/images/products/interior/hover.jpg",
      category: "interior",
      subcategoryId: "ceiling-recessed-downlight",
    },
    {
      id: "loro-p",
      title: "Loro P",
      subtitle: "LED Recessed Downlight",
      image: "/assets/images/products/interior/4.png",
      hoverImage: "/assets/images/products/interior/hover.jpg",
      category: "interior",
      subcategoryId: "ceiling-recessed-downlight",
    },
    {
      id: "rusty-2",
      title: "Rusty",
      subtitle: "LED Recessed Downlight",
      image: "/assets/images/products/interior/2.png",
      hoverImage: "/assets/images/products/interior/hover.jpg",
      category: "interior",
      subcategoryId: "surface-mounted-downlight",
    },
    {
      id: "zen-2",
      title: "Zen",
      subtitle: "LED Recessed Downlight",
      image: "/assets/images/products/interior/3.png",
      hoverImage: "/assets/images/products/interior/hover.jpg",
      category: "interior",
      subcategoryId: "ceiling-recessed-suspended-profiles",
    },
    {
      id: "loro-p-2",
      title: "Loro P",
      subtitle: "LED Recessed Downlight",
      image: "/assets/images/products/interior/4.png",
      hoverImage: "/assets/images/products/interior/hover.jpg",
      category: "interior",
      subcategoryId: "ceiling-recessed-suspended-panel-light",
    },
    {
      id: "loro-p-3",
      title: "Loro P",
      subtitle: "LED Recessed Downlight",
      image: "/assets/images/products/interior/2.png",
      hoverImage: "/assets/images/products/interior/hover.jpg",
      category: "interior",
      subcategoryId: "track-lighting",
    },
  ],
};


export const productDetailsCtaData = {
  title: "Let's Talk Lighting",
  description: "Discuss your project, technical requirements, or product selection with our specialists.",
  button: {
    text: "Connect With Us",
    href: "#",
  }
}