"use client";

import { useEffect, useRef, useState } from "react";
import {
  useFieldArray,
  useForm,
  Controller,
  type Control,
  type UseFormRegister,
} from "react-hook-form";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  PanelBottom,
  PanelTop,
  Plus,
  Trash2,
} from "lucide-react";
import AdminLoadable from "@/app/components/admin/common/AdminLoadable";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import AdminPageActions from "@/app/components/admin/common/AdminPageActions";
import AdminSubmitButton from "@/app/components/admin/common/AdminSubmitButton";
import AdminVisitLink from "@/app/components/admin/common/AdminVisitLink";
import AdminTabs from "@/app/components/admin/common/AdminTabs";
import { useUnsavedChanges } from "@/app/components/admin/common/useUnsavedChanges";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
import { cn } from "@/lib/utils/cn";
import type { HeaderFooterDoc, LinkItem } from "@/app/types/headerFooter";

type Form = Omit<HeaderFooterDoc, "_id">;

type LinkArrayPath =
  | `header.navItems.${number}.items`
  | `footer.columns.${number}.links`
  | "footer.socials"
  | "footer.legalLinks";

const TABS = [
  { key: "header", label: "Header", icon: PanelTop },
  { key: "footer", label: "Footer", icon: PanelBottom },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const emptyLink: LinkItem = { label: "", link: "" };

const defaultValues: Form = {
  header: {
    logo: "",
    logoAlt: "",
    navItems: [],
    buttonText: "",
    buttonLink: "",
  },
  footer: {
    columns: [],
    address: "",
    addressLink: "",
    phone: "",
    email: "",
    socials: [],
    catalogueButtonText: "",
    copyright: "",
    legalLinks: [],
  },
};

const iconButton =
  "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-secondary/70 bg-white text-description-color transition-colors duration-200 hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-35";

function RowControls({
  index,
  total,
  onMove,
  onRemove,
  noun,
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
  noun: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        className={iconButton}
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        aria-label={`Move ${noun} up`}
        title="Move up"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className={iconButton}
        disabled={index === total - 1}
        onClick={() => onMove(index, index + 1)}
        aria-label={`Move ${noun} down`}
        title="Move down"
      >
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        className={cn(iconButton, "hover:border-red-300 hover:text-red-600")}
        onClick={() => onRemove(index)}
        aria-label={`Remove ${noun}`}
        title="Remove"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AddButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-secondary text-[13px] font-medium text-description-color transition-colors duration-200 hover:border-primary/40 hover:bg-cream-background/60 hover:text-primary"
    >
      <Plus className="h-4 w-4" />
      <span className="text-trim">{children}</span>
    </button>
  );
}

function LinkList({
  control,
  register,
  name,
  noun = "link",
  addLabel = "Add link",
}: {
  control: Control<Form>;
  register: UseFormRegister<Form>;
  name: LinkArrayPath;
  noun?: string;
  addLabel?: string;
}) {
  const { fields, append, remove, move } = useFieldArray({ control, name });

  return (
    <div className="flex flex-col gap-2">
      {fields.length > 0 && (
        <div className="grid grid-cols-[24px_1fr_1fr_auto] items-center gap-2 px-1 text-[11.5px] font-medium uppercase tracking-[0.08em] text-description-color/70">
          <span />
          <span>Label</span>
          <span>Link</span>
          <span className="w-[108px]" />
        </div>
      )}
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-[24px_1fr_1fr_auto] items-center gap-2"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cream-background text-[11px] text-description-color">
            <span className="text-trim">{index + 1}</span>
          </span>
          <Input {...register(`${name}.${index}.label`)} placeholder="Label" />
          <Input
            {...register(`${name}.${index}.link`)}
            placeholder="/page or https://"
          />
          <RowControls
            index={index}
            total={fields.length}
            onMove={move}
            onRemove={remove}
            noun={noun}
          />
        </div>
      ))}
      <AddButton onClick={() => append({ ...emptyLink })}>{addLabel}</AddButton>
    </div>
  );
}

function SubCard({
  title,
  controls,
  children,
}: {
  title: string;
  controls: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-secondary/60 bg-cream-background/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <Label className="font-bold">{title}</Label>
        {controls}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-bold">{label}</Label>
      {children}
      {hint && <p className="text-[12px] text-description-color/80">{hint}</p>}
    </div>
  );
}

export default function HeaderFooterPage() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>("header");
  const scrollRef = useRef<HTMLDivElement>(null);
  const changeTab = (next: TabKey) => {
    setTab(next);
    scrollRef.current?.scrollTo({ top: 0 });
  };
  const { register, handleSubmit, reset, control, getValues, formState } =
    useForm<Form>({ defaultValues });
  const { isDirty, markClean, changes } = useUnsavedChanges(control, getValues);

  const nav = useFieldArray({ control, name: "header.navItems" });
  const columns = useFieldArray({ control, name: "footer.columns" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/header-footer");
      if (!res.ok) {
        const { message } = await res.json();
        toast.error(message || "Failed to load header & footer");
        return;
      }
      const { data } = await res.json();
      reset({
        header: { ...defaultValues.header, ...data.header },
        footer: { ...defaultValues.footer, ...data.footer },
      });
      markClean();
    } catch (e) {
      console.error(e);
      toast.error("Failed to load header & footer");
    }
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: Form) => {
    try {
      const res = await fetch("/api/admin/header-footer", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const { message } = await res.json();
      if (res.ok) {
        toast.success(message);
        markClean();
      } else {
        toast.error(message || "Failed to save");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  return (
    <AdminLoadable loading={loading} fill>
      <form
        className="flex h-full min-h-0 flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <AdminPageActions isDirty={isDirty} changes={changes}>
          <AdminVisitLink href="/" />
          <AdminSubmitButton saving={formState.isSubmitting} />
        </AdminPageActions>

        <div className="flex shrink-0 items-center justify-between">
          <AdminTabs
            label="Site layout"
            tabs={TABS.map((t) => ({
              ...t,
              edited: changes.some((c) => c.section.toLowerCase() === t.key),
            }))}
            active={tab}
            onChange={changeTab}
          />
          <p className="text-[12.5px] text-description-color">
            <span className="text-trim">
              {tab === "header"
                ? "Shown at the top of every page"
                : "Shown at the bottom of every page"}
            </span>
          </p>
        </div>

        <div
          ref={scrollRef}
          className="admin-list-scroll -mr-3 min-h-0 flex-1 overflow-y-auto pb-1 pr-3"
        >
          <div className={tab === "header" ? "flex flex-col gap-5" : "hidden"}>
            <AdminItemContainer>
              <Label main>Logo</Label>
              <div className="grid grid-cols-2 gap-4 p-5">
                <Field label="Image">
                  <Controller
                    name="header.logo"
                    control={control}
                    render={({ field }) => (
                      <ImageUploader
                          contain
                          value={field.value}
                          onChange={field.onChange}
                        />
                    )}
                  />
                </Field>
                <Field label="Alt Tag">
                  <Input {...register("header.logoAlt")} placeholder="Alt Tag" />
                </Field>
              </div>
            </AdminItemContainer>

            <AdminItemContainer>
              <Label main>Navigation</Label>
              <div className="flex flex-col gap-4 p-5">
                <p className="text-[12.5px] text-description-color">
                  Items with dropdown links open a menu; items without them link
                  straight to their page.
                </p>
                {nav.fields.map((field, index) => (
                  <SubCard
                    key={field.id}
                    title={`Menu Item ${index + 1}`}
                    controls={
                      <RowControls
                        index={index}
                        total={nav.fields.length}
                        onMove={nav.move}
                        onRemove={nav.remove}
                        noun="menu item"
                      />
                    }
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Label">
                        <Input
                          {...register(`header.navItems.${index}.label`)}
                          placeholder="Label"
                        />
                      </Field>
                      <Field
                        label="Link"
                        hint="Leave empty when the item only opens a dropdown."
                      >
                        <Input
                          {...register(`header.navItems.${index}.link`)}
                          placeholder="/page"
                        />
                      </Field>
                    </div>
                    <Field label="Dropdown Links">
                      <LinkList
                        control={control}
                        register={register}
                        name={`header.navItems.${index}.items`}
                        addLabel="Add dropdown link"
                      />
                    </Field>
                  </SubCard>
                ))}
                <AddButton
                  onClick={() => nav.append({ label: "", link: "", items: [] })}
                >
                  Add menu item
                </AddButton>
              </div>
            </AdminItemContainer>

            <AdminItemContainer>
              <Label main>Contact Button</Label>
              <div className="grid grid-cols-2 gap-4 p-5">
                <Field label="Button Text">
                  <Input
                    {...register("header.buttonText")}
                    placeholder="Button Text"
                  />
                </Field>
                <Field label="Button Link">
                  <Input
                    {...register("header.buttonLink")}
                    placeholder="/contact-us"
                  />
                </Field>
              </div>
            </AdminItemContainer>
          </div>

          <div className={tab === "footer" ? "flex flex-col gap-5" : "hidden"}>
            <AdminItemContainer>
              <Label main>Link Columns</Label>
              <div className="flex flex-col gap-4 p-5">
                <div className="grid grid-cols-2 gap-4">
                  {columns.fields.map((field, index) => (
                    <SubCard
                      key={field.id}
                      title={`Column ${index + 1}`}
                      controls={
                        <RowControls
                          index={index}
                          total={columns.fields.length}
                          onMove={columns.move}
                          onRemove={columns.remove}
                          noun="column"
                        />
                      }
                    >
                      <Field label="Title">
                        <Input
                          {...register(`footer.columns.${index}.title`)}
                          placeholder="Title"
                        />
                      </Field>
                      <Field label="Links">
                        <LinkList
                          control={control}
                          register={register}
                          name={`footer.columns.${index}.links`}
                        />
                      </Field>
                    </SubCard>
                  ))}
                </div>
                <AddButton
                  onClick={() => columns.append({ title: "", links: [] })}
                >
                  Add column
                </AddButton>
              </div>
            </AdminItemContainer>

            <AdminItemContainer>
              <Label main>Contact Details</Label>
              <div className="grid grid-cols-2 gap-4 p-5">
                <div className="flex flex-col gap-4">
                  <Field label="Address">
                    <Textarea
                      {...register("footer.address")}
                      placeholder="Address"
                    />
                  </Field>
                  <Field label="Address Link">
                    <Input
                      {...register("footer.addressLink")}
                      placeholder="https://maps.app.goo.gl/..."
                    />
                  </Field>
                </div>
                <div className="flex flex-col gap-4">
                  <Field label="Phone">
                    <Input {...register("footer.phone")} placeholder="Phone" />
                  </Field>
                  <Field label="Email">
                    <Input {...register("footer.email")} placeholder="Email" />
                  </Field>
                </div>
              </div>
            </AdminItemContainer>

            <AdminItemContainer>
              <Label main>Social Links</Label>
              <div className="p-5">
                <LinkList
                  control={control}
                  register={register}
                  name="footer.socials"
                  noun="social link"
                  addLabel="Add social link"
                />
              </div>
            </AdminItemContainer>

            <AdminItemContainer>
              <Label main>Bottom Bar</Label>
              <div className="flex flex-col gap-4 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Catalogue Button Text">
                    <Input
                      {...register("footer.catalogueButtonText")}
                      placeholder="Download Catalogue"
                    />
                  </Field>
                  <Field label="Copyright">
                    <Input
                      {...register("footer.copyright")}
                      placeholder="©2026 Brighton Lighting. All rights reserved"
                    />
                  </Field>
                </div>
                <Field label="Legal Links">
                  <LinkList
                    control={control}
                    register={register}
                    name="footer.legalLinks"
                    noun="legal link"
                    addLabel="Add legal link"
                  />
                </Field>
              </div>
            </AdminItemContainer>
          </div>
        </div>
      </form>
    </AdminLoadable>
  );
}
