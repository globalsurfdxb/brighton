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

  /** The main specification table, already ordered for display. */
  specs: SpecRow[];

  /** The product's uploaded datasheet image, shown alongside the dimension drawing. */
  datasheetImage: string;

  /** Feature icon images (enabled common + product-specific). */
  icons: string[];

  /**
   * URL of the uploaded installation guide file. The QR block only renders
   * when this is set — there's nothing to point to otherwise.
   */
  installationGuideLink: string;

  /**
   * A real, scannable QR code (data URI PNG) encoding `installationGuideLink`
   * — generated once up front rather than drawn as a decorative pattern, so
   * scanning it actually opens the guide.
   */
  qrCodeImage: string;

  disclaimer: string;
  operatingNote: string;
  installationNote: string;
}
