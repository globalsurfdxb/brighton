"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Controller,
  useFieldArray,
  useForm,
  type Control,
  type FieldPath,
} from "react-hook-form";
import { toast } from "sonner";
import { ArrowUpRight, Plus } from "lucide-react";
import { RiDeleteBinLine } from "react-icons/ri";
import AdminLoadable from "@/app/components/admin/common/AdminLoadable";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import AdminPageActions from "@/app/components/admin/common/AdminPageActions";
import AdminSubmitButton from "@/app/components/admin/common/AdminSubmitButton";
import AdminVisitLink from "@/app/components/admin/common/AdminVisitLink";
import { useUnsavedChanges } from "@/app/components/admin/common/useUnsavedChanges";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/ui/image-uploader";
import { VideoUploader } from "@/components/ui/video-uploader";
import type { HomeDoc } from "@/app/types/home";

type Form = Omit<HomeDoc, "_id"> & {
  seo: { metaTitle: string; metaDescription: string; script: string };
};

const defaultValues: Form = {
  seo: { metaTitle: "", metaDescription: "", script: "" },
  heroSection: { title: "", description: "", video: "", poster: "", buttons: [] },
  overviewSection: { isHidden: false, stats: [], cards: [] },
  trustedBySection: { isHidden: false, title: "", logos: [] },
  servicesSection: { isHidden: false, title: "" },
  certifiedBySection: { isHidden: false, title: "", logos: [] },
  ctaSection: {
    isHidden: false,
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
  },
};

type HiddenPath =
  | "overviewSection.isHidden"
  | "trustedBySection.isHidden"
  | "servicesSection.isHidden"
  | "certifiedBySection.isHidden"
  | "ctaSection.isHidden";

function SectionLabel({
  control,
  name,
  children,
}: {
  control: Control<Form>;
  name?: HiddenPath;
  children: React.ReactNode;
}) {
  if (!name) return <Label main>{children}</Label>;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Label
          main
          isHidden={!!field.value}
          onToggleHidden={() => field.onChange(!field.value)}
        >
          {children}
        </Label>
      )}
    />
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-bold">{label}</Label>
      {children}
    </div>
  );
}

function ItemsHeader({
  label,
  onAdd,
  addLabel = "Add Item",
}: {
  label: string;
  onAdd: () => void;
  addLabel?: string;
}) {
  return (
    <div className="mt-2 flex items-center justify-between">
      <Label className="font-bold">{label}</Label>
      <Button type="button" addItem onClick={onAdd}>
        <Plus className="h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  );
}

function ItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-secondary/60 bg-cream-background/40 p-4">
      <div className="flex items-center justify-between">
        <Label className="font-bold">{title}</Label>
        <Button type="button" onClick={onRemove} aria-label={`Remove ${title}`}>
          <RiDeleteBinLine size={16} />
        </Button>
      </div>
      {children}
    </div>
  );
}

function LogoGrid({
  control,
  register,
  name,
}: {
  control: Control<Form>;
  register: ReturnType<typeof useForm<Form>>["register"];
  name: "trustedBySection.logos" | "certifiedBySection.logos";
}) {
  const { fields, append, remove } = useFieldArray({ control, name });
  return (
    <>
      <ItemsHeader
        label="Logos"
        addLabel="Add Logo"
        onAdd={() => append({ image: "", imageAlt: "" })}
      />
      <div className="grid grid-cols-5 gap-4">
        {fields.map((field, index) => (
          <ItemCard
            key={field.id}
            title={`Logo ${index + 1}`}
            onRemove={() => remove(index)}
          >
            <Controller
              name={`${name}.${index}.image` as FieldPath<Form>}
              control={control}
              render={({ field: f }) => (
                <ImageUploader
                  contain
                  value={f.value as string}
                  onChange={f.onChange}
                />
              )}
            />
            <Field label="Alt Tag">
              <Input
                {...register(`${name}.${index}.imageAlt`)}
                placeholder="Alt Tag"
              />
            </Field>
          </ItemCard>
        ))}
      </div>
    </>
  );
}

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, control, getValues, formState } =
    useForm<Form>({ defaultValues });
  const { isDirty, markClean, changes } = useUnsavedChanges(control, getValues);

  const buttons = useFieldArray({ control, name: "heroSection.buttons" });
  const stats = useFieldArray({ control, name: "overviewSection.stats" });
  const cards = useFieldArray({ control, name: "overviewSection.cards" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/home");
      if (!res.ok) {
        const { message } = await res.json();
        toast.error(message || "Failed to load home page");
        return;
      }
      const { data } = await res.json();
      reset({
        seo: { ...defaultValues.seo, ...data.seo },
        heroSection: { ...defaultValues.heroSection, ...data.heroSection },
        overviewSection: {
          ...defaultValues.overviewSection,
          ...data.overviewSection,
        },
        trustedBySection: {
          ...defaultValues.trustedBySection,
          ...data.trustedBySection,
        },
        servicesSection: {
          ...defaultValues.servicesSection,
          ...data.servicesSection,
        },
        certifiedBySection: {
          ...defaultValues.certifiedBySection,
          ...data.certifiedBySection,
        },
        ctaSection: { ...defaultValues.ctaSection, ...data.ctaSection },
      });
      markClean();
    } catch (e) {
      console.error(e);
      toast.error("Failed to load home page");
    }
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: Form) => {
    try {
      const res = await fetch("/api/admin/home", {
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
    <AdminLoadable loading={loading}>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <AdminPageActions isDirty={isDirty} changes={changes}>
          <AdminVisitLink href="/" />
          <AdminSubmitButton saving={formState.isSubmitting} />
        </AdminPageActions>

        <AdminItemContainer>
          <SectionLabel control={control}>Hero Section</SectionLabel>
          <div className="flex flex-col gap-4 p-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Background Video">
                <Controller
                  name="heroSection.video"
                  control={control}
                  render={({ field }) => (
                    <VideoUploader value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
              <Field label="Poster Image">
                <Controller
                  name="heroSection.poster"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader value={field.value} onChange={field.onChange} />
                  )}
                />
              </Field>
            </div>
            <Field label="Title">
              <Input {...register("heroSection.title")} placeholder="Title" />
            </Field>
            <Field label="Description">
              <Textarea
                {...register("heroSection.description")}
                placeholder="Description"
              />
            </Field>
            <ItemsHeader
              label="Buttons"
              addLabel="Add Button"
              onAdd={() => buttons.append({ text: "", link: "" })}
            />
            <div className="grid grid-cols-2 gap-4">
              {buttons.fields.map((field, index) => (
                <ItemCard
                  key={field.id}
                  title={`Button ${index + 1}`}
                  onRemove={() => buttons.remove(index)}
                >
                  <Field label="Text">
                    <Input
                      {...register(`heroSection.buttons.${index}.text`)}
                      placeholder="Text"
                    />
                  </Field>
                  <Field label="Link">
                    <Input
                      {...register(`heroSection.buttons.${index}.link`)}
                      placeholder="/page"
                    />
                  </Field>
                </ItemCard>
              ))}
            </div>
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <SectionLabel control={control} name="overviewSection.isHidden">
            Overview Section
          </SectionLabel>
          <div className="flex flex-col gap-4 p-5">
            <ItemsHeader
              label="Stats"
              addLabel="Add Stat"
              onAdd={() =>
                stats.append({ label: "", value: "", icon: "", iconAlt: "" })
              }
            />
            <div className="grid grid-cols-3 gap-4">
              {stats.fields.map((field, index) => (
                <ItemCard
                  key={field.id}
                  title={`Stat ${index + 1}`}
                  onRemove={() => stats.remove(index)}
                >
                  <Field label="Icon">
                    <Controller
                      name={`overviewSection.stats.${index}.icon`}
                      control={control}
                      render={({ field: f }) => (
                        <ImageUploader contain value={f.value} onChange={f.onChange} />
                      )}
                    />
                  </Field>
                  <Field label="Icon Alt">
                    <Input
                      {...register(`overviewSection.stats.${index}.iconAlt`)}
                      placeholder="Icon Alt"
                    />
                  </Field>
                  <Field label="Label">
                    <Input
                      {...register(`overviewSection.stats.${index}.label`)}
                      placeholder="Label"
                    />
                  </Field>
                  <Field label="Value">
                    <Textarea
                      {...register(`overviewSection.stats.${index}.value`)}
                      placeholder="Value"
                    />
                  </Field>
                </ItemCard>
              ))}
            </div>

            <ItemsHeader
              label="Cards"
              addLabel="Add Card"
              onAdd={() =>
                cards.append({
                  title: "",
                  description: "",
                  buttonText: "",
                  buttonLink: "",
                  video: "",
                  poster: "",
                  posterAlt: "",
                })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              {cards.fields.map((field, index) => (
                <ItemCard
                  key={field.id}
                  title={`Card ${index + 1}`}
                  onRemove={() => cards.remove(index)}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Video">
                      <Controller
                        name={`overviewSection.cards.${index}.video`}
                        control={control}
                        render={({ field: f }) => (
                          <VideoUploader value={f.value} onChange={f.onChange} />
                        )}
                      />
                    </Field>
                    <Field label="Poster Image">
                      <Controller
                        name={`overviewSection.cards.${index}.poster`}
                        control={control}
                        render={({ field: f }) => (
                          <ImageUploader value={f.value} onChange={f.onChange} />
                        )}
                      />
                    </Field>
                  </div>
                  <Field label="Poster Alt">
                    <Input
                      {...register(`overviewSection.cards.${index}.posterAlt`)}
                      placeholder="Poster Alt"
                    />
                  </Field>
                  <Field label="Title">
                    <Input
                      {...register(`overviewSection.cards.${index}.title`)}
                      placeholder="Title"
                    />
                  </Field>
                  <Field label="Description">
                    <Textarea
                      {...register(`overviewSection.cards.${index}.description`)}
                      placeholder="Description"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Button Text">
                      <Input
                        {...register(`overviewSection.cards.${index}.buttonText`)}
                        placeholder="Button Text"
                      />
                    </Field>
                    <Field label="Button Link">
                      <Input
                        {...register(`overviewSection.cards.${index}.buttonLink`)}
                        placeholder="/page"
                      />
                    </Field>
                  </div>
                </ItemCard>
              ))}
            </div>
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <SectionLabel control={control} name="trustedBySection.isHidden">
            Trusted By Section
          </SectionLabel>
          <div className="flex flex-col gap-4 p-5">
            <Field label="Title">
              <Input {...register("trustedBySection.title")} placeholder="Title" />
            </Field>
            <LogoGrid
              control={control}
              register={register}
              name="trustedBySection.logos"
            />
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <SectionLabel control={control} name="servicesSection.isHidden">
            Services Section
          </SectionLabel>
          <div className="flex flex-col gap-4 p-5">
            <Field label="Title">
              <Input {...register("servicesSection.title")} placeholder="Title" />
            </Field>
            <div className="flex items-center justify-between gap-4 rounded-lg border border-secondary/60 bg-cream-background/40 px-4 py-3">
              <p className="text-[13px] text-description-color">
                Service cards come from the <strong>Home</strong> tab of each
                visible service.
              </p>
              <Link
                href="/4dm1n-br1ght0n/services"
                className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-primary underline-offset-4 hover:underline"
              >
                Manage services
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <SectionLabel control={control} name="certifiedBySection.isHidden">
            Certified By Section
          </SectionLabel>
          <div className="flex flex-col gap-4 p-5">
            <Field label="Title">
              <Input
                {...register("certifiedBySection.title")}
                placeholder="Title"
              />
            </Field>
            <LogoGrid
              control={control}
              register={register}
              name="certifiedBySection.logos"
            />
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <SectionLabel control={control} name="ctaSection.isHidden">
            CTA Section
          </SectionLabel>
          <div className="flex flex-col gap-4 p-5">
            <Field label="Title">
              <Input {...register("ctaSection.title")} placeholder="Title" />
            </Field>
            <Field label="Description">
              <Textarea
                {...register("ctaSection.description")}
                placeholder="Description"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Button Text">
                <Input
                  {...register("ctaSection.buttonText")}
                  placeholder="Button Text"
                />
              </Field>
              <Field label="Button Link">
                <Input
                  {...register("ctaSection.buttonLink")}
                  placeholder="/contact-us"
                />
              </Field>
            </div>
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <SectionLabel control={control}>SEO</SectionLabel>
          <div className="flex flex-col gap-4 p-5">
            <Field label="Meta Title">
              <Input {...register("seo.metaTitle")} placeholder="Meta Title" />
            </Field>
            <Field label="Meta Description">
              <Textarea
                {...register("seo.metaDescription")}
                placeholder="Meta Description"
              />
            </Field>
            <Field label="Script">
              <Textarea {...register("seo.script")} placeholder="Script" />
            </Field>
          </div>
        </AdminItemContainer>
      </form>
    </AdminLoadable>
  );
}
