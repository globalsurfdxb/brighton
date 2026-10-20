"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowUpLine,
  RiArrowUpSLine,
  RiDraggable,
  RiSearchLine,
} from "react-icons/ri";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CustomButton from "../../client/common/CustomButton";

type Item = { _id: string };

interface ReorderableListProps<T extends Item> {
  title: string;
  /** plural, lowercase — used in empty / no-match messages */
  noun: string;
  items: T[];
  onItemsChange: (items: T[]) => void;
  searchPlaceholder: string;
  getSearchValues: (item: T) => (string | undefined)[];
  reorderEndpoint: string;
  /** refetch after a failed save so the list matches the server again */
  onReorderFailed?: () => void;
  onRowClick: (item: T) => void;
  /** extra header buttons (e.g. "Add Project"), hidden while reordering */
  headerActions?: React.ReactNode;
  renderContent: (item: T) => React.ReactNode;
  /** row action buttons, hidden while reordering */
  renderActions: (item: T) => React.ReactNode;
}

const iconButton =
  "cursor-pointer hover:scale-110 transition-all text-description-color hover:text-primary disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:scale-100";

function SortableRow({
  id,
  disabled,
  rowRef,
  children,
}: {
  id: string;
  disabled: boolean;
  rowRef: (el: HTMLDivElement | null) => void;
  children: (handle: React.ReactNode) => React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const handle = (
    <button
      type="button"
      {...attributes}
      {...listeners}
      title="Drag to reorder"
      aria-label="Drag to reorder"
      className="touch-none cursor-grab active:cursor-grabbing text-description-color"
    >
      <RiDraggable size={18} />
    </button>
  );

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        rowRef(el);
      }}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
        zIndex: isDragging ? 10 : undefined,
      }}
    >
      {children(handle)}
    </div>
  );
}

/**
 * List card with search and an explicit reorder mode.
 *
 * Normal mode: search filters the list, rows navigate on click.
 * Reorder mode: the full list stays visible (so positions are meaningful),
 * search jumps to and highlights matches instead of filtering, and the new
 * order is only saved when "Done" is pressed.
 */
export default function ReorderableList<T extends Item>({
  title,
  noun,
  items,
  onItemsChange,
  searchPlaceholder,
  getSearchValues,
  reorderEndpoint,
  onReorderFailed,
  onRowClick,
  headerActions,
  renderContent,
  renderActions,
}: ReorderableListProps<T>) {
  const [search, setSearch] = useState("");
  const [reordering, setReordering] = useState(false);
  const [draft, setDraft] = useState<T[]>([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());

  const dndSensors = useSensors(useSensor(PointerSensor));

  const searchTerm = search.trim().toLowerCase();
  const isMatch = (item: T) =>
    !!searchTerm &&
    getSearchValues(item).some((v) => v?.toLowerCase().includes(searchTerm));

  const list = reordering ? draft : items;
  const matches = searchTerm ? list.filter(isMatch) : [];
  const visible = reordering || !searchTerm ? list : matches;
  const activeMatchIndex = matches.findIndex((m) => m._id === activeMatchId);
  const isDirty =
    reordering && draft.some((item, i) => item._id !== items[i]?._id);

  const scrollToRow = (id: string) =>
    rowRefs.current
      .get(id)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });

  const focusMatch = (index: number) => {
    if (matches.length === 0) return;
    const next = matches[(index + matches.length) % matches.length];
    setActiveMatchId(next._id);
    scrollToRow(next._id);
  };

  // in reorder mode, typing jumps to the first match
  const jumpToFirstMatch = (term: string, rows: T[]) => {
    const t = term.trim().toLowerCase();
    const first = t
      ? rows.find((item) =>
          getSearchValues(item).some((v) => v?.toLowerCase().includes(t)),
        )
      : undefined;
    setActiveMatchId(first?._id ?? null);
    // wait for the highlight / rows to render before scrolling
    if (first) requestAnimationFrame(() => scrollToRow(first._id));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (reordering) jumpToFirstMatch(value, draft);
  };

  const startReorder = () => {
    setDraft(items);
    setReordering(true);
    jumpToFirstMatch(search, items);
  };

  const cancelReorder = () => {
    setReordering(false);
    setActiveMatchId(null);
  };

  const saveReorder = async () => {
    if (!isDirty) return cancelReorder();
    setIsSavingOrder(true);
    try {
      const res = await fetch(reorderEndpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: draft.map((item) => item._id) }),
      });
      const { message } = await res.json();
      if (!res.ok) {
        toast.error(message || "Failed to save order");
        onReorderFailed?.();
        return;
      }
      onItemsChange(draft);
      toast.success(message || "Order updated");
      cancelReorder();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save order");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= draft.length) return;
    setDraft(arrayMove(draft, from, to));
    // keep the moved row in view as it travels
    requestAnimationFrame(() => scrollToRow(draft[from]._id));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = draft.findIndex((item) => item._id === active.id);
    const to = draft.findIndex((item) => item._id === over.id);
    if (from === -1 || to === -1) return;
    setDraft(arrayMove(draft, from, to));
  };

  const count = reordering
    ? `(${list.length})`
    : searchTerm
      ? `(${matches.length} of ${items.length})`
      : `(${items.length})`;

  return (
    <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary pb-3">
        <Label className="!text-xl !font-semibold">
          {title} {count}
        </Label>
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative w-72">
            <RiSearchLine
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-description-color"
            />
            <Input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (!reordering || e.key !== "Enter") return;
                e.preventDefault();
                focusMatch(activeMatchIndex + (e.shiftKey ? -1 : 1));
              }}
              placeholder={reordering ? "Find item to move" : searchPlaceholder}
              className={`pl-9 ${reordering && searchTerm ? "pr-28" : ""}`}
            />
            {reordering && searchTerm && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[12px] text-description-color">
                <span className="text-trim whitespace-nowrap">
                  {matches.length
                    ? `${activeMatchIndex + 1} of ${matches.length}`
                    : "No match"}
                </span>
                <button
                  type="button"
                  className={iconButton}
                  disabled={matches.length < 2}
                  onClick={() => focusMatch(activeMatchIndex - 1)}
                  title="Previous match (Shift+Enter)"
                >
                  <RiArrowUpSLine size={18} />
                </button>
                <button
                  type="button"
                  className={iconButton}
                  disabled={matches.length < 2}
                  onClick={() => focusMatch(activeMatchIndex + 1)}
                  title="Next match (Enter)"
                >
                  <RiArrowDownSLine size={18} />
                </button>
              </div>
            )}
          </div>
          {reordering ? (
            <>
              <CustomButton
                variant="2"
                type="button"
                text="Cancel"
                showIcon={false}
                onClick={cancelReorder}
              />
              <CustomButton
                variant="3"
                type="button"
                text={isSavingOrder ? "Saving..." : "Done"}
                showIcon={false}
                disabled={isSavingOrder}
                onClick={saveReorder}
              />
            </>
          ) : (
            <>
              <CustomButton
                variant="2"
                type="button"
                text="Reorder"
                showIcon={false}
                disabled={items.length < 2}
                onClick={startReorder}
              />
              {headerActions}
            </>
          )}
        </div>
      </div>

      {reordering && (
        <p className="text-[13px] text-description-color -mt-1">
          Drag rows or use the arrows to change the order, then press Done.
          {isDirty && (
            <span className="ml-2 text-primary font-itc-medium">
              Unsaved changes
            </span>
          )}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5">
        {items.length === 0 && (
          <p className="text-sm text-black/40">No {noun} added yet.</p>
        )}
        {!reordering && items.length > 0 && searchTerm && !matches.length && (
          <p className="text-sm text-black/40">
            No {noun} match &quot;{search.trim()}&quot;.
          </p>
        )}
        <DndContext
          sensors={dndSensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visible.map((item) => item._id)}
            strategy={verticalListSortingStrategy}
          >
            {visible.map((item, index) => {
              const matched = reordering && isMatch(item);
              const active = reordering && item._id === activeMatchId;
              return (
                <SortableRow
                  key={item._id}
                  id={item._id}
                  disabled={!reordering}
                  rowRef={(el) => {
                    if (el) rowRefs.current.set(item._id, el);
                    else rowRefs.current.delete(item._id);
                  }}
                >
                  {(handle) => (
                    <div
                      className={`flex items-center justify-between border rounded-md px-4 py-3 transition-all ${
                        active
                          ? "border-primary bg-secondary/10 ring-2 ring-primary/20"
                          : matched
                            ? "border-primary/50 bg-white"
                            : "border-secondary/60 bg-white"
                      } ${reordering ? "" : "hover:shadow-sm cursor-pointer"}`}
                      onClick={() => !reordering && onRowClick(item)}
                    >
                      <div className="flex items-center gap-4">
                        {reordering && (
                          <>
                            <span className="text-[12px] text-description-color w-6 text-right tabular-nums">
                              {index + 1}
                            </span>
                            {handle}
                          </>
                        )}
                        {renderContent(item)}
                      </div>
                      {reordering ? (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className={iconButton}
                            disabled={index === 0}
                            onClick={() => move(index, index - 1)}
                            title="Move up"
                          >
                            <RiArrowUpLine size={20} />
                          </button>
                          <button
                            type="button"
                            className={iconButton}
                            disabled={index === visible.length - 1}
                            onClick={() => move(index, index + 1)}
                            title="Move down"
                          >
                            <RiArrowDownLine size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-4">
                          {renderActions(item)}
                        </div>
                      )}
                    </div>
                  )}
                </SortableRow>
              );
            })}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
