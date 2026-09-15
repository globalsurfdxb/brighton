"use client";

/**
 * The Technical Data Sheet, rendered with `@react-pdf/renderer`.
 *
 * Why this library: it draws to PDF primitives (no HTML string, no headless
 * browser, no `dangerouslySetInnerHTML`), so there is no injection surface —
 * every value in `data` is placed as plain text or numeric geometry. It also
 * runs fully client-side, so no configuration data leaves the browser.
 *
 * Layout targets A4. All sizing is in PostScript points (1/72").
 */

import {
  Document,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
  Image,
  Line,
} from "@react-pdf/renderer";
import type { DatasheetData } from "./types";

const COLORS = {
  ink: "#1a1a1a",
  body: "#3f3f3f",
  muted: "#8a8a8a",
  hairline: "#d9d9d9",
  accent: "#b91c1c",
  panel: "#f4f2ee",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 44,
    paddingHorizontal: 34,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: COLORS.body,
    lineHeight: 1.45,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  wordmark: { width: 120, height: 16, objectFit: "contain" },
  docTitle: {
    fontSize: 20,
    color: "#c7c7c7",
    letterSpacing: 0.5,
  },

  body: { flexDirection: "row", gap: 18, height: 700, overflow: "hidden" },
  rail: { width: 150, marginTop: 40 },
  main: { flex: 1 },

  fieldGroup: { marginBottom: 18 },
  fieldLabel: { color: COLORS.muted, fontSize: 7.5, marginBottom: 10 },
  fieldLine: { borderBottomWidth: 0.75, borderBottomColor: COLORS.ink },

  qrBox: {
    width: 96,
    height: 96,
    marginTop: 4,
    marginBottom: 4,
    objectFit: "contain",
  },
  qrCaption: {
    backgroundColor: COLORS.ink,
    color: "#fff",
    fontSize: 6.5,
    paddingVertical: 2,
    paddingHorizontal: 4,
    alignSelf: "flex-start",
  },

  sectionHeading: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: COLORS.ink,
    marginBottom: 5,
  },
  disclaimerText: { fontSize: 6.5, color: COLORS.muted, textAlign: "justify" },

  productName: { fontFamily: "Helvetica-Bold", fontSize: 13, color: COLORS.ink },
  productCode: { fontSize: 8, color: COLORS.muted, marginTop: 2, marginBottom: 12 },

  visualRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  datasheetImage: { width: 200, height: 140, objectFit: "contain" },

  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderWidth: 0.75,
    borderColor: COLORS.hairline,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: { width: 18, height: 18, objectFit: "contain" },

  descBlock: { flexDirection: "row", gap: 8, marginBottom: 12 },
  descLabel: { width: 78, color: COLORS.ink, fontSize: 7.5 },
  descText: { flex: 1, fontSize: 7.5, textAlign: "justify" },

  specRow: {
    flexDirection: "row",
    paddingVertical: 3.4,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.hairline,
  },
  specLabel: { width: 96, color: COLORS.ink, fontSize: 7.5 },
  specColon: { width: 10, color: COLORS.muted },
  specValue: { flex: 1, fontSize: 7.5 },

  footer: {
    position: "absolute",
    bottom: 22,
    left: "20%",
    right: "20%",
    textAlign: "center",
    fontSize: 6,
    color: COLORS.muted,
  },
  installNote: { fontSize: 6.5, color: COLORS.muted, marginTop: 6 },
});

/* ----------------------------- sub-components ----------------------------- */

/** Simple recessed-downlight cross-section with dimension callouts. */
function DimensionDrawing({
  diameter,
  height,
  cutout,
}: {
  diameter: number;
  height: number;
  cutout: number;
}) {
  const W = 150;
  const H = 96;
  const bodyW = 96;
  const bodyH = 46;
  const x0 = (W - bodyW) / 2;
  const y0 = 14;

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* ceiling line */}
      <Line
        x1={6}
        y1={y0}
        x2={W - 6}
        y2={y0}
        stroke={COLORS.hairline}
        strokeWidth={1}
      />
      {/* body */}
      <Path
        d={`M ${x0} ${y0} H ${x0 + bodyW} V ${y0 + bodyH * 0.6} L ${
          x0 + bodyW - 12
        } ${y0 + bodyH} H ${x0 + 12} L ${x0} ${y0 + bodyH * 0.6} Z`}
        stroke={COLORS.ink}
        strokeWidth={0.9}
        fill="#fbfbfb"
      />
      {/* aperture */}
      <Line
        x1={x0 + 12}
        y1={y0 + bodyH}
        x2={x0 + bodyW - 12}
        y2={y0 + bodyH}
        stroke={COLORS.ink}
        strokeWidth={1.4}
      />

      {/* diameter dimension */}
      <Line
        x1={x0}
        y1={y0 - 6}
        x2={x0 + bodyW}
        y2={y0 - 6}
        stroke={COLORS.muted}
        strokeWidth={0.6}
      />
      <Text
        x={W / 2}
        y={y0 - 8}
        style={{ fontSize: 6, fill: COLORS.body }}
        textAnchor="middle"
      >
        {`Ø ${diameter}`}
      </Text>

      {/* height dimension */}
      <Line
        x1={x0 + bodyW + 8}
        y1={y0}
        x2={x0 + bodyW + 8}
        y2={y0 + bodyH}
        stroke={COLORS.muted}
        strokeWidth={0.6}
      />
      <Text
        x={x0 + bodyW + 11}
        y={y0 + bodyH / 2 + 2}
        style={{ fontSize: 6, fill: COLORS.body }}
      >
        {`${height}`}
      </Text>

      {/* cutout label */}
      <Text
        x={W / 2}
        y={y0 + bodyH + 12}
        style={{ fontSize: 6, fill: COLORS.muted }}
        textAnchor="middle"
      >
        {`Cutout Ø ${cutout}`}
      </Text>
    </Svg>
  );
}

/* --------------------------------- page --------------------------------- */

export function DatasheetDocument({ data }: { data: DatasheetData }) {
  return (
    <Document
      title={`${data.product.name} ${data.product.code} — ${data.brand.documentTitle}`}
      author={data.brand.name}
      subject={data.product.summary}
      creator={data.brand.name}
      producer={data.brand.name}
    >
      <Page size="A4" style={styles.page}>
        {/* header */}
        <View style={styles.header}>
          <Image src="/assets/logos/brighton-wordmark.png" style={styles.wordmark} />
          <Text style={styles.docTitle}>{data.brand.documentTitle}</Text>
        </View>

        <View style={styles.body}>
          {/* left rail */}
          <View style={styles.rail}>
            {data.formFields.map((field) => (
              <View key={field.label} style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <View style={styles.fieldLine} />
              </View>
            ))}

            {data.installationGuideLink && data.qrCodeImage ? (
              <>
                <Image src={data.qrCodeImage} style={styles.qrBox} />
                <Text style={styles.qrCaption}>Installation</Text>
                <Text style={styles.installNote}>{data.installationNote}</Text>
              </>
            ) : null}

            <View style={{ marginTop: 16 }}>
              <Text style={styles.sectionHeading}>Disclaimer</Text>
              <Text style={styles.disclaimerText}>{data.disclaimer}</Text>
            </View>
          </View>

          {/* main column */}
          <View style={styles.main}>
            <Text style={styles.productName}>{data.product.name}</Text>
            <Text style={styles.productCode}>{data.product.code}</Text>

            <View style={styles.visualRow}>
              {data.datasheetImage ? (
                <Image src={data.datasheetImage} style={styles.datasheetImage} />
              ) : (
                <DimensionDrawing
                  diameter={data.dimensions.diameter}
                  height={data.dimensions.height}
                  cutout={data.dimensions.cutout}
                />
              )}
            </View>

            {data.icons.length > 0 ? (
              <View style={styles.iconRow}>
                {data.icons.map((icon, i) => (
                  <View key={i} style={styles.iconBox}>
                    <Image src={icon} style={styles.iconImage} />
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.descBlock}>
              <Text style={styles.descLabel}>Product Description</Text>
              <Text style={styles.descText}>{data.product.description}</Text>
            </View>

            <View>
              {data.specs.map((row) => (
                <View key={row.label} style={styles.specRow}>
                  <Text style={styles.specLabel}>{row.label}</Text>
                  <Text style={styles.specColon}>:</Text>
                  <Text style={styles.specValue}>{row.value}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          {data.operatingNote}
        </Text>
      </Page>
    </Document>
  );
}

export default DatasheetDocument;
