"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useWatch,
  type Control,
  type FieldValues,
  type UseFormGetValues,
} from "react-hook-form";

const serialize = (values: unknown) =>
  JSON.stringify(values, (_key, value) =>
    value === "" || value === null || value === undefined ? undefined : value,
  );

const LABELS: Record<string, string> = { seo: "SEO", ctaSection: "CTA Section" };

const sectionLabel = (key: string) =>
  LABELS[key] ??
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

export type UnsavedChange = { section: string; fields: string[] };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const unionKeys = (a: object, b: object) => [
  ...new Set([...Object.keys(a), ...Object.keys(b)]),
];

const FIELD_LABELS: Record<string, string> = {
  isHidden: "Visibility",
  seo: "SEO",
};

const fieldLabel = (key: string) =>
  FIELD_LABELS[key] ??
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

function diffFields(before: unknown, after: unknown, prefix = ""): string[] {
  if (serialize(before) === serialize(after)) return [];

  if (Array.isArray(before) || Array.isArray(after)) {
    const a = Array.isArray(before) ? before : [];
    const b = Array.isArray(after) ? after : [];
    const out: string[] = [];
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const item = `${prefix}Item ${i + 1}`;
      if (i >= a.length) out.push(`${item} (added)`);
      else if (i >= b.length) out.push(`${item} (removed)`);
      else
        out.push(
          ...diffFields(a[i], b[i], `${item} › `).map((f) => f || item),
        );
    }
    return out;
  }

  if (isObject(before) || isObject(after)) {
    const a = isObject(before) ? before : {};
    const b = isObject(after) ? after : {};
    return unionKeys(a, b).flatMap((key) =>
      diffFields(a[key], b[key], `${prefix}${fieldLabel(key)} › `),
    );
  }

  return [prefix.replace(/ › $/, "")];
}

export function useUnsavedChanges<T extends FieldValues>(
  control: Control<T>,
  getValues: UseFormGetValues<T>,
) {
  const values = useWatch({ control });
  const [baseline, setBaseline] = useState<string | null>(null);

  const markClean = useCallback(() => {
    requestAnimationFrame(() =>
      requestAnimationFrame(() => setBaseline(serialize(getValues()))),
    );
  }, [getValues]);

  const current = serialize(values);
  const isDirty = baseline !== null && current !== baseline;

  const changes = useMemo(() => {
    if (!isDirty || baseline === null) return [];
    const before = (JSON.parse(baseline) ?? {}) as Record<string, unknown>;
    const after = (JSON.parse(current) ?? {}) as Record<string, unknown>;
    return unionKeys(before, after)
      .filter((key) => serialize(before[key]) !== serialize(after[key]))
      .map((key) => ({
        section: sectionLabel(key),
        fields: diffFields(before[key], after[key]),
      }));
  }, [isDirty, baseline, current]);

  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  return { isDirty, markClean, changes };
}
