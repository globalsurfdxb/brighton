"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdminItemContainer from "../common/AdminItemContainer";
import AdminPageActions from "../common/AdminPageActions";
import CustomButton from "../../client/common/CustomButton";
import Link from "next/link";

type TopLevelForm = {
  seo: { metaTitle: string; metaDescription: string; script: string };
  bannerSection: { title: string };
  ctaSection: {
    isHidden: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
};

const defaultValues: TopLevelForm = {
  seo: { metaTitle: "", metaDescription: "", script: "" },
  bannerSection: { title: "" },
  ctaSection: {
    isHidden: false,
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
  },
};

export default function ProjectMainPage() {
  const { register, control, reset, handleSubmit } = useForm<TopLevelForm>({
    defaultValues,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchPage = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        toast.error("Failed to load page");
        return;
      }
      const { data } = await res.json();
      reset({
        ...defaultValues,
        seo: { ...defaultValues.seo, ...data.seo },
        bannerSection: {
          ...defaultValues.bannerSection,
          ...data.bannerSection,
        },
        ctaSection: { ...defaultValues.ctaSection, ...data.ctaSection },
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to load page");
    }
  };

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (formData: TopLevelForm) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const { message } = await res.json();
      if (res.ok) {
        toast.success(message || "Saved");
      } else {
        toast.error(message || "Failed to save");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <AdminPageActions>
        <Link href={`/projects`} target="_blank">
          <CustomButton variant="2" type="button" text="Visit page" />
        </Link>
        <CustomButton
          variant="3"
          type="submit"
          text={isSaving ? "Saving..." : "Page Submit"}
          showIcon={false}
        />
      </AdminPageActions>

      <AdminItemContainer expansion={false}>
        <div className="flex items-center justify-between border-b border-secondary">
          <Label main>Banner Section</Label>
        </div>
        <div className="p-5 flex flex-col gap-2">
          <Label className="font-bold">Title</Label>
          <Input {...register("bannerSection.title")} placeholder="Title" />
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
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Title</Label>
            <Input {...register("ctaSection.title")} placeholder="Title" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Description</Label>
            <Textarea
              {...register("ctaSection.description")}
              placeholder="Description"
            />
          </div>
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

      <AdminItemContainer>
        <Label main>SEO</Label>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Meta Title</Label>
            <Input {...register("seo.metaTitle")} placeholder="Meta Title" />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Meta Description</Label>
            <Input
              {...register("seo.metaDescription")}
              placeholder="Meta Description"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="font-bold">Script</Label>
            <Textarea {...register("seo.script")} placeholder="Script" />
          </div>
        </div>
      </AdminItemContainer>
    </form>
  );
}
