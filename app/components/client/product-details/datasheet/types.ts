/**
 * Shared types for the configured Technical Data Sheet PDF.
 *
 * `DatasheetData` is the single, fully-resolved payload handed to the PDF
 * renderer. Nothing in the render layer reads from `data.ts` or the DOM
 * directly — everything it needs is computed once in `buildDatasheetData`
 * and passed in through this shape.
 */

export interface SpecRow {
  label: string;
  value: string;
}

/** A single labelled line on the sheet header that the specifier fills in by hand. */
export interface FormField {
  label: string;
}

/** Small capability badges shown under the product images (IP44, IK02, …). */
export interface DatasheetBadge {
  label: string;
  /** Optional second line, e.g. "Warranty". */
  caption?: string;
}

/**
 * Polar photometric distribution.
 *
 * `samples` holds candela values sampled at evenly spaced angles from 0°
 * (nadir / straight down) to 90° (horizon). The curve is drawn symmetrically
 * about the vertical axis, matching the reference sheet.
 */
export interface PhotometricDistribution {
  /** Candela readings from 0°..90°, `stepDeg` apart. */
  samples: number[];
  stepDeg: number;
  /** Outer ring value for the grid, in candela. */
  maxScale: number;
  /** Ring interval in candela. */
  ringStep: number;
}

export interface DatasheetData {
  meta: {
    /** ISO timestamp, used only for the footer line. */
    generatedAt: string;
    /** Suggested download filename, without extension. */
    fileName: string;
  };

  brand: {
    name: string;
    documentTitle: string;
  };

  product: {
    /** Display name, e.g. "Spin". */
    name: string;
    /** Fully built configuration code. */
    code: string;
    /** Human readable one-line summary of the selected options. */
    summary: string;
    description: string;
    category: string;
  };

  /** Blank labelled lines on the left rail. */
  formFields: FormField[];

  dimensions: {
    /** Outer diameter, mm. */
    diameter: number;
    /** Overall height, mm. */
    height: number;
    /** Ceiling cut-out diameter, mm. */
    cutout: number;
  };

  badges: DatasheetBadge[];

  /** The main specification table, already ordered for display. */
  specs: SpecRow[];

  photometric: PhotometricDistribution;

  disclaimer: string;
  operatingNote: string;
  installationNote: string;
}
