"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RiDraggable } from "react-icons/ri";
import { cn } from "@/lib/utils/cn";

function SortableItem({
  id,
  disabled,
  children,
}: {
  id: string;
  disabled: boolean;
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
      disabled={disabled}
      title={disabled ? undefined : "Drag to reorder"}
      aria-label="Drag to reorder"
      className={cn(
        "flex h-7 w-5 shrink-0 touch-none items-center justify-center text-description-color",
        disabled
          ? "cursor-not-allowed opacity-30"
          : "cursor-grab active:cursor-grabbing hover:text-primary",
      )}
    >
      <RiDraggable size={18} />
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        position: "relative",
        zIndex: isDragging ? 10 : undefined,
      }}
      className={cn(isDragging && "shadow-[0_10px_24px_-12px_rgba(10,10,10,0.35)]")}
    >
      {children(handle)}
    </div>
  );
}

export default function AdminSortableList<T extends { _id: string }>({
  items,
  onReorder,
  disabled = false,
  className,
  children,
}: {
  items: T[];
  onReorder: (items: T[]) => void;
  disabled?: boolean;
  className?: string;
  children: (item: T, index: number, handle: React.ReactNode) => React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = items.findIndex((item) => item._id === active.id);
    const to = items.findIndex((item) => item._id === over.id);
    if (from === -1 || to === -1) return;
    onReorder(arrayMove(items, from, to));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={cn("flex flex-col gap-2", className)}>
          {items.map((item, index) => (
            <SortableItem key={item._id} id={item._id} disabled={disabled}>
              {(handle) => children(item, index, handle)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
