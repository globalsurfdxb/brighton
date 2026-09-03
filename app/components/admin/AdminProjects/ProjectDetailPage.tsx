"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { RiDeleteBinLine } from "react-icons/ri";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdminItemContainer from "../common/AdminItemContainer";
import { Button } from "@/components/ui/button";
import CustomButton from "../../client/common/CustomButton";
import { ImageUploader } from "@/components/ui/image-uploader";
import TinyEditor from "../common/TinyMceEditor";

type ProjectImage = { url: string; alt: string };

type ProjectForm = {
  title: string;
  slug: string;
  featured: boolean;
  region: string;
  sector: string[];
  thumbImage: string;
  thumbImageAlt: string;
  bannerImage: string;
  bannerImageAlt: string;
  images: ProjectImage[];
  contentTitle: string;
  content: string;
  ctaSection: {
    isHidden: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
};

const defaultValues: ProjectForm = {
  title: "",
  slug: "",
  featured: false,
  region: "",
  sector: [],
  thumbImage: "",
  thumbImageAlt: "",
  bannerImage: "",
  bannerImageAlt: "",
  images: [],
  contentTitle: "",
  content: "",
  ctaSection: {
    isHidden: false,
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
  },
};

type Option = { _id: string; title: string };

export default function ProjectDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectForm>({ defaultValues });
  const [isSaving, setIsSaving] = useState(false);
  const [regions, setRegions] = useState<Option[]>([]);
  const [sectors, setSectors] = useState<Option[]>([]);

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
    replace: replaceImages,
  } = useFieldArray({ control, name: "images" });

  const fetchOptions = async () => {
    try {
      const [regionsRes, sectorsRes] = await Promise.all([
        fetch("/api/admin/projects/regions"),
        fetch("/api/admin/projects/sectors"),
      ]);
      const { data: regionsData } = await regionsRes.json();
      const { data: sectorsData } = await sectorsRes.json();
      setRegions(regionsData || []);
      setSectors(sectorsData || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/admin/projects/project/${params.id}`);
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        toast.error("Failed to load project");
        return;
      }
      const { data } = await res.json();
      reset({
        ...defaultValues,
        ...data,
        region: data.region || "",
        sector: data.sector || [],
        ctaSection: { ...defaultValues.ctaSection, ...data.ctaSection },
      });
      replaceImages(data.images || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load project");
    }
  };

  const onSubmit = async (formData: ProjectForm) => {
    setIsSaving(true);
    try {
      const res = await fetch(
        isNew
          ? "/api/admin/projects/project"
          : `/api/admin/projects/project/${params.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const { message, data } = await res.json();
      if (res.ok) {
        toast.success(message || "Project saved");
        if (isNew && data?._id) {
          router.replace(`/4dm1n-br1ght0n/projects/${data._id}`);
        }
      } else {
        toast.error(message || "Failed to save project");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    if (!isNew) fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <AdminItemContainer expansion={false}>
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input
                  {...register("title")}
                  placeholder="e.g. Marina Heights"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Slug</Label>
                <div className="flex gap-2">
                  <Input
                    {...register("slug")}
                    placeholder="e.g. marina-heights"
                  />
                  <CustomButton
                    btnClass="-mt-[2px]"
                    variant="3"
                    text="Generate"
                    type="button"
                    onClick={() =>
                      setValue(
                        "slug",
                        watch("title").toLowerCase().replace(/\s+/g, "-"),
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Region</Label>
                <select
                  {...register("region", { required: "Region is required" })}
                  className="border border-secondary rounded-md px-3 py-2 text-md"
                >
                  <option value="">Select region</option>
                  {regions.map((region) => (
                    <option key={region._id} value={region._id}>
                      {region.title}
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <p className="text-red-500 text-sm">
                    {errors.region.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 mt-8">
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
                <Label className="font-bold text-trim">Featured</Label>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label className="font-bold text-trim">Sectors</Label>
              <div className="flex flex-wrap gap-4">
                {sectors.map((sector) => (
                  <label
                    key={sector._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Controller
                      name="sector"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          className="size-4"
                          checked={field.value?.includes(sector._id)}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...(field.value || []), sector._id]
                              : (field.value || []).filter(
                                  (id) => id !== sector._id,
                                );
                            field.onChange(next);
                          }}
                        />
                      )}
                    />
                    {sector.title}
                  </label>
                ))}
                {sectors.length === 0 && (
                  <p className="text-sm text-black/40">No sectors added yet.</p>
                )}
              </div>
            </div>
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <Label main>Thumbnail and Banner</Label>
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Thumbnail</Label>
                <Controller
                  name="thumbImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Label className="font-bold">Image Alt</Label>
                <Input {...register("thumbImageAlt")} placeholder="Image Alt" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Banner</Label>
                <Controller
                  name="bannerImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Label className="font-bold">Banner Alt</Label>
                <Input
                  {...register("bannerImageAlt")}
                  placeholder="Image Alt"
                />
              </div>
            </div>
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <Label
            main
            className={`!text-lg ${imageFields.length > 0 ? "pb-7" : ""}`}
          >
            Images ({imageFields.length})
          </Label>

          <CustomButton
            variant="3"
            btnClass="w-fit ml-auto mr-5 mt-5"
            text="Add Image"
            type="button"
            onClick={() => appendImage({ url: "", alt: "" })}
          />

          <div className="p-5 flex flex-col gap-4">
            <div className="grid 3xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 gap-4">
              {imageFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Image {index + 1}</Label>

                    <Button type="button" onClick={() => removeImage(index)}>
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>

                  <Controller
                    name={`images.${index}.url`}
                    control={control}
                    render={({ field }) => (
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />

                  <Label className="font-bold">Image Alt</Label>

                  <Input
                    {...register(`images.${index}.alt`)}
                    placeholder="Image Alt"
                  />
                </div>
              ))}
            </div>
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <Label main>Content</Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Content Title</Label>
            <Input {...register("contentTitle")} placeholder="Content Title" />
            <Label className="font-bold">Content</Label>
            {/* <Textarea {...register("content")} placeholder="Content" rows={8} /> */}
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <TinyEditor
                  newsContent={field.value}
                  setNewsContent={field.onChange}
                />
              )}
            />
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <Controller
            name="ctaSection.isHidden"
            control={control}
            render={({ field }) => (
              <Label
                main
                isHidden={field.value}
                onToggleHidden={() => field.onChange(!field.value)}
              >
                CTA Section
              </Label>
            )}
          />
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("ctaSection.title")} placeholder="Title" />
            <Label className="font-bold">Description</Label>
            <Textarea
              {...register("ctaSection.description")}
              placeholder="Description"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Button Text</Label>
                <Input
                  {...register("ctaSection.buttonText")}
                  placeholder="Button Text"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Button Link</Label>
                <Input
                  {...register("ctaSection.buttonLink")}
                  placeholder="Button Link"
                />
              </div>
            </div>
          </div>
        </AdminItemContainer>

        <div className="fixed top-2 right-8 z-50 flex gap-5">
          <CustomButton
            iconDirection="down"
            imageClass="!-rotate-135"
            variant="2"
            type="button"
            text="Back to Projects"
            onClick={() => router.back()}
          />
          <CustomButton
            variant="3"
            type="submit"
            text="Page Submit"
            showIcon={false}
          />
        </div>
      </form>
    </div>
  );
}
