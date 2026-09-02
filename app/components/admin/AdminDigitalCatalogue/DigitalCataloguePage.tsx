"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { FileUploader } from "@/components/ui/file-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import { toast } from "sonner";
import { useEffect } from "react";
import CustomButton from "../../client/common/CustomButton";

interface DigitalCatalogueForm {
  seo: { metaTitle: string; metaDescription: string; script: string };
  firstSection: {
    isHidden: boolean;
    title: string;
    subTitle: string;
    catalogueText: string;
    catalogueLink: string;
    image: string;
    imageAlt: string;
  };
  ctaSection: {
    isHidden: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

const defaultValues: DigitalCatalogueForm = {
  seo: { metaTitle: "", metaDescription: "", script: "" },
  firstSection: {
    isHidden: false,
    title: "",
    subTitle: "",
    catalogueText: "",
    catalogueLink: "",
    image: "",
    imageAlt: "",
  },
  ctaSection: {
    isHidden: false,
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
  },
};

export default function DigitalCataloguePage() {
  const { register, handleSubmit, control, reset } =
    useForm<DigitalCatalogueForm>({ defaultValues });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/digital-catalogue");
      if (res.ok) {
        const { data } = await res.json();
        reset({
          seo: { ...defaultValues.seo, ...data.seo },
          firstSection: { ...defaultValues.firstSection, ...data.firstSection },
          ctaSection: { ...defaultValues.ctaSection, ...data.ctaSection },
        });
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: DigitalCatalogueForm) => {
    try {
      const res = await fetch("/api/admin/digital-catalogue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { message } = await res.json();
        toast.success(message);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        {/* First Section */}
        <AdminItemContainer>
          <Controller
            name="firstSection.isHidden"
            control={control}
            render={({ field }) => (
              <Label
                main
                isHidden={field.value}
                onToggleHidden={() => field.onChange(!field.value)}
              >
                First Section
              </Label>
            )}
          />
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Image</Label>
                <Controller
                  name="firstSection.image"
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
                  {...register("firstSection.imageAlt")}
                  placeholder="Image Alt"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input
                  {...register("firstSection.title")}
                  placeholder="Title"
                />
                <Label className="font-bold">Sub Title</Label>
                <Input
                  {...register("firstSection.subTitle")}
                  placeholder="Sub Title"
                />
                <Label className="font-bold">Catalogue Text</Label>
                <Input
                  {...register("firstSection.catalogueText")}
                  placeholder="Catalogue Text"
                />
                <Label className="font-bold">Catalogue File</Label>
                <Controller
                  name="firstSection.catalogueLink"
                  control={control}
                  render={({ field }) => (
                    <FileUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </AdminItemContainer>

        {/* CTA Section */}
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

        {/* SEO */}
        <AdminItemContainer>
          <Label main>SEO</Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Meta Title</Label>
            <Input {...register("seo.metaTitle")} placeholder="Meta Title" />
            <Label className="font-bold">Meta Description</Label>
            <Input
              {...register("seo.metaDescription")}
              placeholder="Meta Description"
            />
            <Label className="font-bold">Script</Label>
            <Textarea {...register("seo.script")} placeholder="Script" />
          </div>
        </AdminItemContainer>

        <div className="fixed top-2 right-8 z-50">
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