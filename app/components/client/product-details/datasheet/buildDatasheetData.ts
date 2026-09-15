/**
 * Resolves the live configurator state into a `DatasheetData` payload.
 *
 * This is the only place that knows how a selection maps to a printed value.
 * It is a pure function of its inputs (no DOM, no globals) so it can be unit
 * tested and reused server-side unchanged.
 */

import {
  BRAND,
  DIMENSIONS_BY_SIZE,
  DISCLAIMER,
  FIXED_SPECS,
  FORM_FIELDS,
  INSTALLATION_NOTE,
  LUMEN_BY_WATTAGE,
  OPERATING_NOTE,
} from "./datasheetContent";
import type { DatasheetData, SpecRow } from "./types";

/** Minimal view of a configurator option — matches `data.ts` and stays lax on extras. */
interface OptionLike {
  id: string;
  code: string;
  label: string;
  tooltip?: { label?: string; meta?: string };
}

interface AttributeLike {
  id: string;
  label: string;
}

export interface SelectedOption {
  attribute: AttributeLike;
  option: OptionLike;
}

export interface BuildDatasheetInput {
  product: { name: string; category: string; description: string };
  selectedOptions: SelectedOption[];
  productCode: string;
  summary: string;
  datasheetImage?: string;
  installationGuideLink?: string;
  qrCodeImage?: string;
  icons?: string[];
}

const DEFAULT_DIMENSIONS = { diameter: 85, height: 76, cutout: 75 };

function pick(selected: SelectedOption[], attributeId: string) {
  return selected.find((s) => s.attribute.id === attributeId)?.option;
}

/** e.g. "38°" | "38" -> 38; falls back to `fallback` when unparseable. */
function toAngle(label: string | undefined, fallback: number): number {
  const n = Number.parseInt((label ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function buildDatasheetData(input: BuildDatasheetInput): DatasheetData {
  const {
    product,
    selectedOptions,
    productCode,
    summary,
    datasheetImage,
    installationGuideLink,
    qrCodeImage,
    icons,
  } = input;

  const reflector = pick(selectedOptions, "reflector");
  const size = pick(selectedOptions, "size");
  const wattage = pick(selectedOptions, "wattage");
  const cct = pick(selectedOptions, "cct");
  const cri = pick(selectedOptions, "cri");
  const ip = pick(selectedOptions, "ip");
  const beam = pick(selectedOptions, "beam");
  const control = pick(selectedOptions, "control");

  const dimensions = DIMENSIONS_BY_SIZE[size?.id ?? ""] ?? DEFAULT_DIMENSIONS;
  const lumen = LUMEN_BY_WATTAGE[wattage?.id ?? ""] ?? 1000;
  const wattageLabel = wattage?.label ?? "10W";
  const criValue = cri?.label === "90" ? "> 90" : (cri?.label ?? "80");
  const beamAngle = toAngle(beam?.label, 38);

  const specs: SpecRow[] = [
    { label: "Finish", value: FIXED_SPECS.finish },
    { label: "Reflector", value: reflector?.label ?? "White" },
    {
      label: "Dimension",
      value: `Dia ${dimensions.diameter}mm  |  H ${dimensions.height}mm`,
    },
    { label: "Cutout", value: `Dia ${dimensions.cutout}mm` },
    { label: "Wattage", value: wattageLabel },
    { label: "Lumen", value: `${lumen} lm` },
    { label: "CCT", value: cct?.label ?? "3000K" },
    { label: "CRI", value: criValue },
    { label: "Protection Rating", value: ip?.label ?? "IP44" },
    { label: "Macadam", value: FIXED_SPECS.macadam },
    { label: "Material", value: FIXED_SPECS.material },
    { label: "Lifetime", value: FIXED_SPECS.lifetime },
    { label: "Voltage", value: FIXED_SPECS.voltage },
    { label: "Class", value: FIXED_SPECS.electricalClass },
    { label: "IK Protection", value: FIXED_SPECS.ikProtection },
    { label: "Diffuser", value: FIXED_SPECS.diffuser },
    { label: "Ambient Temp [C°]", value: FIXED_SPECS.ambientTemp },
    { label: "Power Factor", value: FIXED_SPECS.powerFactor },
    { label: "THD", value: FIXED_SPECS.thd },
    { label: "Weight", value: FIXED_SPECS.weight },
    { label: "DC (mA)", value: FIXED_SPECS.current },
    { label: "Control", value: control?.label ?? "DALI" },
    { label: "Beam Angle", value: `${beamAngle}°` },
  ];

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      fileName: `${productCode}-datasheet`,
    },
    brand: { name: BRAND.name, documentTitle: BRAND.documentTitle },
    product: {
      name: product.name,
      code: productCode,
      summary: summary || `${product.name} configured datasheet`,
      description: product.description,
      category: product.category,
    },
    formFields: FORM_FIELDS,
    dimensions,
    specs,
    datasheetImage: datasheetImage ?? "",
    icons: icons ?? [],
    installationGuideLink: installationGuideLink ?? "",
    qrCodeImage: qrCodeImage ?? "",
    disclaimer: DISCLAIMER,
    operatingNote: OPERATING_NOTE,
    installationNote: INSTALLATION_NOTE,
  };
}
