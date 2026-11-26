type Subdoc = { _id: unknown; toObject: () => object };

export function reorderEmbedded(items: Subdoc[], ids: unknown) {
  if (!Array.isArray(ids)) return null;
  const byId = new Map(items.map((item) => [String(item._id), item]));
  const valid =
    ids.length === byId.size &&
    new Set(ids.map(String)).size === ids.length &&
    ids.every((id) => byId.has(String(id)));
  if (!valid) return null;
  return ids.map((id) => byId.get(String(id))!.toObject());
}
