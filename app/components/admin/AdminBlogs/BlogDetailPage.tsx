"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdminItemContainer from "../common/AdminItemContainer";
import CustomButton from "../../client/common/CustomButton";
import TinyEditor from "../common/TinyMceEditor";
import { ImageUploader } from "@/components/ui/image-uploader";

type BlogForm = {
  title: string;
  slug: string;
  topic: string;
  date: Date;
  thumbImage: string;
  thumbImageAlt: string;
  bannerImage: string;
  bannerImageAlt: string;
  content: string;
  ctaSection: {
    isHidden: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
};

const defaultValues: BlogForm = {
  title: "",
  slug: "",
  topic: "",
  date: new Date(),
  thumbImage: "",
  thumbImageAlt: "",
  bannerImage: "",
  bannerImageAlt: "",
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

export default function BlogDetail() {
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
  } = useForm<BlogForm>({ defaultValues });
  const [isSaving, setIsSaving] = useState(false);
  const [topics, setTopics] = useState<Option[]>([]);

  const fetchOptions = async () => {
    try {
      const [topicsRes] = await Promise.all([fetch("/api/admin/blogs/topics")]);
      const { data: topicsData } = await topicsRes.json();
      setTopics(topicsData || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/admin/blogs/blog-item/${params.id}`);
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        toast.error("Failed to load blog");
        return;
      }
      const { data } = await res.json();
      reset({
        ...defaultValues,
        ...data,
        topic: data.topic || "",
        ctaSection: { ...defaultValues.ctaSection, ...data.ctaSection },
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to load blog");
    }
  };

  const onSubmit = async (formData: BlogForm) => {
    setIsSaving(true);
    try {
      const res = await fetch(
        isNew
          ? "/api/admin/blogs/blog-item"
          : `/api/admin/blogs/blog-item/${params.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const { message, data } = await res.json();
      if (res.ok) {
        toast.success(message || "Blog saved");
        if (isNew && data?._id) {
          router.replace(`/4dm1n-br1ght0n/blogs/${data._id}`);
        }
      } else {
        toast.error(message || "Failed to save blog");
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
    if (!isNew) fetchBlog();
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
                <Label className="font-bold">Topic</Label>
                <select
                  {...register("topic", { required: "Topic is required" })}
                  className="border border-secondary rounded-md px-3 py-2 text-md"
                >
                  <option value="">Select topic</option>
                  {topics.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                      {topic.title}
                    </option>
                  ))}
                </select>
                {errors.topic && (
                  <p className="text-red-500 text-sm">{errors.topic.message}</p>
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
          <Label main>Content</Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Content</Label>
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
            text="Back to Blogs"
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
