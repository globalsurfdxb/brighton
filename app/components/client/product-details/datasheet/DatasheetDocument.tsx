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

import React from "react";
import {
  Document,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
  Circle,
  Line,
  Polyline,
  Rect,
} from "@react-pdf/renderer";
import type { DatasheetData, PhotometricDistribution } from "./types";

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
    alignItems: "flex-start",
    marginBottom: 16,
  },
  wordmark: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    letterSpacing: 3,
    color: COLORS.ink,
  },
  docTitle: {
    fontSize: 20,
    color: "#c7c7c7",
    letterSpacing: 0.5,
  },

  body: { flexDirection: "row", gap: 18 },
  rail: { width: 150 },
  main: { flex: 1 },

  fieldGroup: { marginBottom: 18 },
  fieldLabel: { color: COLORS.muted, fontSize: 7.5, marginBottom: 10 },
  fieldLine: { borderBottomWidth: 0.75, borderBottomColor: COLORS.ink },

  qrBox: {
    width: 96,
    height: 96,
    marginTop: 4,
    marginBottom: 4,
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

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 14,
  },
  badge: {
    borderWidth: 0.75,
    borderColor: COLORS.hairline,
    borderRadius: 2,
    paddingVertical: 3,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  badgeLabel: { fontSize: 6.5, fontFamily: "Helvetica-Bold", color: COLORS.ink },
  badgeCaption: { fontSize: 5, color: COLORS.muted },

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
    left: 34,
    right: 34,
    textAlign: "center",
    fontSize: 6,
    color: COLORS.muted,
  },
  installNote: { fontSize: 6.5, color: COLORS.muted, marginTop: 6 },
});

/* ----------------------------- sub-components ----------------------------- */

const SCAN_MODULES = 21;

/**
 * Builds a deterministic module matrix for the scan-code block: a stable
 * pattern derived from the configuration code, framed by the three finder
 * squares of a QR symbol. Pure geometry — this is a visual element, not an
 * encoder. Computed at module scope so no mutable state lives in render.
 */
function buildScanMatrix(seedText: string): { x: number; y: number }[] {
  let seed = 0;
  for (let i = 0; i < seedText.length; i += 1) {
    seed = (seed * 33 + seedText.charCodeAt(i)) >>> 0;
  }
  const rand = () => {
    let s = seed;
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    seed = s >>> 0;
    return seed / 0xffffffff;
  };

  const finderOrigins = [
    [0, 0],
    [0, SCAN_MODULES - 7],
    [SCAN_MODULES - 7, 0],
  ];
  const inFinderArea = (r: number, c: number) =>
    finderOrigins.some(
      ([fr, fc]) => r >= fr - 1 && r <= fr + 7 && c >= fc - 1 && c <= fc + 7,
    );
  const isFinderModule = (r: number, c: number) =>
    finderOrigins.some(([fr, fc]) => {
      const dr = r - fr;
      const dc = c - fc;
      if (dr < 0 || dr > 6 || dc < 0 || dc > 6) return false;
      const ring = Math.max(Math.abs(dr - 3), Math.abs(dc - 3));
      return ring !== 2;
    });

  const cells: { x: number; y: number }[] = [];
  for (let r = 0; r < SCAN_MODULES; r += 1) {
    for (let c = 0; c < SCAN_MODULES; c += 1) {
      if (inFinderArea(r, c)) {
        if (isFinderModule(r, c)) cells.push({ x: c, y: r });
      } else if (rand() > 0.55) {
        cells.push({ x: c, y: r });
      }
    }
  }
  return cells;
}

function ScanCode({ seedText }: { seedText: string }) {
  const cells = buildScanMatrix(seedText);
  return (
    <Svg style={styles.qrBox} viewBox={`0 0 ${SCAN_MODULES} ${SCAN_MODULES}`}>
      <Rect
        x={0}
        y={0}
        width={SCAN_MODULES}
        height={SCAN_MODULES}
        fill="#ffffff"
      />
      {cells.map((cell, i) => (
        <Rect
          key={i}
          x={cell.x}
          y={cell.y}
          width={1}
          height={1}
          fill={COLORS.ink}
        />
      ))}
    </Svg>
  );
}

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

function PhotometricChart({ data }: { data: PhotometricDistribution }) {
  const SIZE = 168;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R = SIZE / 2 - 16;
  const { samples, stepDeg, maxScale, ringStep } = data;

  const rings: number[] = [];
  for (let v = ringStep; v <= maxScale + 0.001; v += ringStep) rings.push(v);

  const radial = [0, 15, 30, 45, 60, 75, 90];

  const toPoint = (angleDeg: number, value: number, mirror: boolean) => {
    const r = (Math.min(value, maxScale) / maxScale) * R;
    const rad = (angleDeg * Math.PI) / 180;
    const x = cx + (mirror ? -1 : 1) * r * Math.sin(rad);
    const y = cy + r * Math.cos(rad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  const leftPts = samples
    .map((v, i) => ({ v, a: i * stepDeg }))
    .slice()
    .reverse()
    .map(({ v, a }) => toPoint(a, v, true));
  const rightPts = samples.map((v, i) => toPoint(i * stepDeg, v, false));
  const curve = [...leftPts, ...rightPts].join(" ");

  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {rings.map((v, i) => (
        <Circle
          key={i}
          cx={cx}
          cy={cy}
          r={(v / maxScale) * R}
          stroke={COLORS.hairline}
          strokeWidth={0.5}
          fill="none"
        />
      ))}

      {radial.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const dx = R * Math.sin(rad);
        const dy = R * Math.cos(rad);
        // Lower half only (0° = straight down), mirrored left and right.
        return (
          <React.Fragment key={angle}>
            <Line
              x1={cx}
              y1={cy}
              x2={cx + dx}
              y2={cy + dy}
              stroke={COLORS.hairline}
              strokeWidth={0.4}
            />
            <Line
              x1={cx}
              y1={cy}
              x2={cx - dx}
              y2={cy + dy}
              stroke={COLORS.hairline}
              strokeWidth={0.4}
            />
          </React.Fragment>
        );
      })}

      {/* upper reference spokes (dashed feel via light stroke) */}
      <Line
        x1={cx}
        y1={cy}
        x2={cx}
        y2={cy - R}
        stroke={COLORS.hairline}
        strokeWidth={0.4}
      />

      <Polyline
        points={curve}
        stroke={COLORS.accent}
        strokeWidth={1.1}
        fill="none"
      />

      {radial.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const lx = cx + (R + 8) * Math.sin(rad);
        const ly = cy + (R + 8) * Math.cos(rad);
        return (
          <Text
            key={`l-${angle}`}
            x={lx}
            y={ly}
            style={{ fontSize: 5, fill: COLORS.muted }}
            textAnchor="middle"
          >
            {`${angle}°`}
          </Text>
        );
      })}
    </Svg>
  );
}

/* --------------------------------- page --------------------------------- */

export function DatasheetDocument({ data }: { data: DatasheetData }) {
  const generated = new Date(data.meta.generatedAt);
  const generatedLabel = `${generated.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;

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
          <Text style={styles.wordmark}>{data.brand.name}</Text>
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

            <ScanCode seedText={data.product.code} />
            <Text style={styles.qrCaption}>Installation</Text>

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
              <DimensionDrawing
                diameter={data.dimensions.diameter}
                height={data.dimensions.height}
                cutout={data.dimensions.cutout}
              />
            </View>

            <View style={styles.badgeRow}>
              {data.badges.map((badge) => (
                <View key={badge.label} style={styles.badge}>
                  <Text style={styles.badgeLabel}>{badge.label}</Text>
                  {badge.caption ? (
                    <Text style={styles.badgeCaption}>{badge.caption}</Text>
                  ) : null}
                </View>
              ))}
            </View>

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

            <View style={{ marginTop: 12 }}>
              <Text style={styles.sectionHeading}>Photometric</Text>
              <PhotometricChart data={data.photometric} />
              <Text style={styles.installNote}>{data.installationNote}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer} fixed>
          {data.operatingNote}
          {"\n"}
          {`${data.product.code}   ·   Generated ${generatedLabel}`}
        </Text>
      </Page>
    </Document>
  );
}

export default DatasheetDocument;
