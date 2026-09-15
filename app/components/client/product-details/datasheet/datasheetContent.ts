/**
 * Static content for the Technical Data Sheet.
 *
 * These are the "additional data" that don't come from the configurator:
 * fixed engineering values, legal copy, and the labels used on the sheet.
 * Keeping them here (rather than inline in the renderer) means the wording
 * can be reviewed and updated without touching layout code, and swapped for
 * a CMS/`fetch()` source later with no change to `buildDatasheetData`.
 */

import type { FormField } from "./types";

export const BRAND = {
  name: "BRIGHTON",
  documentTitle: "Technical Data Sheet",
} as const;

export const FORM_FIELDS: FormField[] = [
  { label: "Name" },
  { label: "Client" },
  { label: "Project Name" },
  { label: "Type | Quantity" },
];

/**
 * Values that are constant across every configuration of this family.
 * `buildDatasheetData` merges these with the configured values.
 */
export const FIXED_SPECS = {
  finish: "White",
  material: "Die Cast Aluminium",
  diffuser: "Polycarbonate",
  lifetime: "L70 > 50,000 hrs",
  voltage: "220-240V AC",
  current: "350 mA",
  electricalClass: "II",
  ikProtection: "IK 02",
  ambientTemp: "-20° ~ 45°C",
  powerFactor: "λ > 0.95  EN55015",
  thd: "< 10%",
  weight: "0.3 KG",
  macadam: "3 step",
} as const;

/** Lumen output per wattage option id, in lumens. */
export const LUMEN_BY_WATTAGE: Record<string, number> = {
  "7w": 700,
  "10w": 1000,
  "12w": 1200,
  "18w": 1800,
  "25w": 2500,
};

/**
 * Physical envelope per size option id, in millimetres.
 * diameter = outer body, height = overall, cutout = ceiling aperture.
 */
export const DIMENSIONS_BY_SIZE: Record<
  string,
  { diameter: number; height: number; cutout: number }
> = {
  "62x85": { diameter: 85, height: 76, cutout: 75 },
  "84x110": { diameter: 110, height: 90, cutout: 100 },
  "105x130": { diameter: 130, height: 105, cutout: 120 },
};

export const DISCLAIMER =
  "Brighton Lighting reserves the right to revise, modify, or discontinue any product in this catalogue without prior notice as LED technology evolves. Information herein is for general purposes only and based on data available at publication. Tolerances are ±10% luminous flux, ±12% efficacy, and ±1.5 CRI. All sales are subject to Brighton Lighting's general terms and conditions.";

export const OPERATING_NOTE =
  "Values are based on nominal current at a case temperature of 45°C under normal operating conditions. These values are provided for informational purposes only and do not constitute a warranty or guarantee of performance.";

export const INSTALLATION_NOTE =
  "For detailed installation instructions, please consult the QR code.";
