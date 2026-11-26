"use client";

import AdminLoadable from "@/app/components/admin/common/AdminLoadable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import AdminPageActions from "@/app/components/admin/common/AdminPageActions";
import AdminSubmitButton from "@/app/components/admin/common/AdminSubmitButton";
import { useUnsavedChanges } from "@/app/components/admin/common/useUnsavedChanges";
import AdminVisitLink from "@/app/components/admin/common/AdminVisitLink";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";

interface DesignPhilosophyForm {
  seo: { metaTitle: string; metaDescription: string; script: string };
  bannerSection: {
    image: string;
    imageAlt: string;
    title: string;
  };
  firstSection: {
    isHidden: boolean;
    title: string;
    subTitle: string;
    items: {
      title: string;
      description: string;
      image: string;
      imageAlt: string;
    }[];
  };
  secondSection: {
    isHidden: boolean;
    title: string;
    subTitle: string;
    description: string;
    image: string;
    imageAlt: string;
    items: { title: string; icon: string; iconAlt: string }[];
  };
  ctaSection: {
    isHidden: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export default function DesignPhilosophyPage() {
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, setValue, control, watch, getValues, formState } =
    useForm<DesignPhilosophyForm>();
  const { isDirty, markClean, changes } = useUnsavedChanges(control, getValues);

  const {
    fields: firstItems,
    append: appendFirst,
    remove: removeFirst,
    replace: replaceFirst,
  } = useFieldArray({ control, name: "firstSection.items" });

  const {
    fields: secondItems,
    append: appendSecond,
    remove: removeSecond,
    replace: replaceSecond,
  } = useFieldArray({ control, name: "secondSection.items" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/design-philosophy");
      if (res.ok) {
        const { data } = await res.json();
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection.isHidden", data.firstSection?.isHidden);
        setValue("firstSection.title", data.firstSection?.title);
        setValue("firstSection.subTitle", data.firstSection?.subTitle);
        setValue("secondSection.isHidden", data.secondSection?.isHidden);
        setValue("secondSection.title", data.secondSection?.title);
        setValue("secondSection.subTitle", data.secondSection?.subTitle);
        setValue("secondSection.description", data.secondSection?.description);
        setValue("secondSection.image", data.secondSection?.image);
        setValue("secondSection.imageAlt", data.secondSection?.imageAlt);
        setValue("ctaSection", data.ctaSection);

        replaceFirst(data.firstSection?.items || []);
        replaceSecond(data.secondSection?.items || []);
        markClean();
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: DesignPhilosophyForm) => {
    try {
      const res = await fetch("/api/admin/design-philosophy", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const { message } = await res.json();
        toast.success(message);
        markClean();
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, []);

  return (
    <AdminLoadable loading={loading}>
      <div className="flex flex-col gap-5">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <AdminPageActions isDirty={isDirty} changes={changes}>
            <AdminVisitLink href="/about/design-philosophy" />
            <AdminSubmitButton saving={formState.isSubmitting} />
          </AdminPageActions>

          {/* Banner Section */}
          <AdminItemContainer>
            <Label main>Banner Section</Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Image</Label>
                    <Controller
                      name="bannerSection.image"
                      control={control}
                      render={({ field }) => (
                        <ImageUploader
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Alt Tag</Label>
                    <Input
                      {...register("bannerSection.imageAlt")}
                      placeholder="Alt Tag"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register("bannerSection.title")}
                    placeholder="Title"
                  />
                </div>
              </div>
            </div>
          </AdminItemContainer>

          {/* First Section */}
          <AdminItemContainer>
            <Label
              main
              isHidden={watch("firstSection.isHidden")}
              onToggleHidden={() =>
                setValue("firstSection.isHidden", !watch("firstSection.isHidden"))
              }
            >
              First Section
            </Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input {...register("firstSection.title")} placeholder="Title" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Sub Title</Label>
                <Input
                  {...register("firstSection.subTitle")}
                  placeholder="Sub Title"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <Label className="font-bold">Items</Label>
                <Button
                  type="button"
                  addItem
                  onClick={() =>
                    appendFirst({
                      title: "",
                      description: "",
                      image: "",
                      imageAlt: "",
                    })
                  }
                >
                  + Add Item
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {firstItems.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-secondary/60 rounded-lg p-4 flex flex-col gap-3 bg-cream-background/40"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="font-bold">Item {index + 1}</Label>
                      <Button type="button" onClick={() => removeFirst(index)}>
                        <RiDeleteBinLine size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Image</Label>
                      <Controller
                        name={`firstSection.items.${index}.image`}
                        control={control}
                        render={({ field }) => (
                          <ImageUploader
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Image Alt</Label>
                      <Input
                        {...register(`firstSection.items.${index}.imageAlt`)}
                        placeholder="Image Alt"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`firstSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Description</Label>
                      <Textarea
                        {...register(`firstSection.items.${index}.description`)}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AdminItemContainer>

          {/* Second Section */}
          <AdminItemContainer>
            <Label
              main
              isHidden={watch("secondSection.isHidden")}
              onToggleHidden={() =>
                setValue(
                  "secondSection.isHidden",
                  !watch("secondSection.isHidden"),
                )
              }
            >
              Second Section
            </Label>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Image</Label>
                  <Controller
                    name="secondSection.image"
                    control={control}
                    render={({ field }) => (
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Image Alt</Label>
                  <Input
                    {...register("secondSection.imageAlt")}
                    placeholder="Image Alt"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input {...register("secondSection.title")} placeholder="Title" />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Sub Title</Label>
                <Input
                  {...register("secondSection.subTitle")}
                  placeholder="Sub Title"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Description</Label>
                <Textarea
                  {...register("secondSection.description")}
                  placeholder="Description"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <Label className="font-bold">Items</Label>
                <Button
                  type="button"
                  addItem
                  onClick={() =>
                    appendSecond({ title: "", icon: "", iconAlt: "" })
                  }
                >
                  + Add Item
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {secondItems.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-secondary/60 rounded-lg p-4 flex flex-col gap-3 bg-cream-background/40"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="font-bold">Item {index + 1}</Label>
                      <Button type="button" onClick={() => removeSecond(index)}>
                        <RiDeleteBinLine size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Icon</Label>
                      <Controller
                        name={`secondSection.items.${index}.icon`}
                        control={control}
                        render={({ field }) => (
                          <ImageUploader
                            value={field.value}
                            onChange={field.onChange}
                            isLogo
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Icon Alt</Label>
                      <Input
                        {...register(`secondSection.items.${index}.iconAlt`)}
                        placeholder="Icon Alt"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`secondSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AdminItemContainer>

          {/* CTA Section */}
          <AdminItemContainer>
            <Label
              main
              isHidden={watch("ctaSection.isHidden")}
              onToggleHidden={() =>
                setValue("ctaSection.isHidden", !watch("ctaSection.isHidden"))
              }
            >
              CTA Section
            </Label>
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

          {/* SEO */}
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
      </div>
    </AdminLoadable>
  );
}
