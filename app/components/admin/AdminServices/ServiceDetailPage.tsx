"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RiDeleteBinLine } from "react-icons/ri";
import CustomButton from "../../client/common/CustomButton";

interface ServiceForm {
  name: string;
  slug: string;
  isHidden: boolean;
  seo: { metaTitle: string; metaDescription: string; script: string };
  bannerSection: {
    isHidden: boolean;
    image: string;
    imageAlt: string;
    title: string;
  };
  firstSection: {
    isHidden: boolean;
    title: string;
    btnText: string;
    btnLink: string;
  };
  secondSection: {
    isHidden: boolean;
    title: string;
    items: {
      title: string;
      description: string;
      image: string;
      imageAlt: string;
    }[];
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    items: { title: string; icon: string; iconAlt: string }[];
  };
  fourthSection: {
    isHidden: boolean;
    title: string;
    items: { title: string; description: string }[];
  };
  ctaSection: {
    isHidden: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

const defaultValues: ServiceForm = {
  name: "",
  slug: "",
  isHidden: false,
  seo: { metaTitle: "", metaDescription: "", script: "" },
  bannerSection: { isHidden: false, image: "", imageAlt: "", title: "" },
  firstSection: { isHidden: false, title: "", btnText: "", btnLink: "" },
  secondSection: { isHidden: false, title: "", items: [] },
  thirdSection: { isHidden: false, title: "", items: [] },
  fourthSection: { isHidden: false, title: "", items: [] },
  ctaSection: {
    isHidden: false,
    title: "",
    description: "",
    buttonText: "",
    buttonLink: "",
  },
};

export default function ServiceDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";

  const { register, handleSubmit, control, reset, watch, setValue } =
    useForm<ServiceForm>({ defaultValues });
  const [isSaving, setIsSaving] = useState(false);

  const {
    fields: secondItems,
    append: appendSecond,
    remove: removeSecond,
    replace: replaceSecond,
  } = useFieldArray({ control, name: "secondSection.items" });

  const {
    fields: thirdItems,
    append: appendThird,
    remove: removeThird,
    replace: replaceThird,
  } = useFieldArray({ control, name: "thirdSection.items" });

  const {
    fields: fourthItems,
    append: appendFourth,
    remove: removeFourth,
    replace: replaceFourth,
  } = useFieldArray({ control, name: "fourthSection.items" });

  const fetchService = async () => {
    try {
      const res = await fetch(`/api/admin/services/${params.id}`);
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        toast.error("Failed to load service");
        return;
      }
      const { data } = await res.json();
      reset({
        ...defaultValues,
        ...data,
        seo: { ...defaultValues.seo, ...data.seo },
        bannerSection: {
          ...defaultValues.bannerSection,
          ...data.bannerSection,
        },
        firstSection: { ...defaultValues.firstSection, ...data.firstSection },
        secondSection: {
          ...defaultValues.secondSection,
          ...data.secondSection,
        },
        thirdSection: { ...defaultValues.thirdSection, ...data.thirdSection },
        fourthSection: {
          ...defaultValues.fourthSection,
          ...data.fourthSection,
        },
        ctaSection: { ...defaultValues.ctaSection, ...data.ctaSection },
      });

      replaceSecond(data.secondSection?.items || []);
      replaceThird(data.thirdSection?.items || []);
      replaceFourth(data.fourthSection?.items || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load service");
    }
  };

  const onSubmit = async (formData: ServiceForm) => {
    setIsSaving(true);
    try {
      const res = await fetch(
        isNew ? "/api/admin/services" : `/api/admin/services/${params.id}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      const { message } = await res.json();
      if (res.ok) {
        toast.success(message || "Service saved");
        // router.push("/4dm1n-br1ght0n/services");
      } else {
        toast.error(message || "Failed to save service");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!isNew) fetchService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <AdminItemContainer>
          <Controller
            name="isHidden"
            control={control}
            render={({ field }) => (
              <Label
                main
                isHidden={field.value}
                onToggleHidden={() => field.onChange(!field.value)}
              >
                Service Details
              </Label>
            )}
          />
          <div className="p-5 flex flex-col gap-2">
            <Label className="font-bold">Name</Label>
            <Input
              {...register("name")}
              placeholder="e.g. Real Estate Service"
            />
          </div>
          <div className="p-5 flex flex-col gap-2">
            <Label className="font-bold">Slug</Label>
            <div className="flex gap-2">
              <Input
                {...register("slug")}
                placeholder="e.g. real-estate-service"
              />
              <Button
                addItem
                type="button"
                onClick={() =>
                  setValue(
                    "slug",
                    watch("name").toLowerCase().replace(/\s+/g, "-"),
                  )
                }
              >
                Generate
              </Button>
            </div>
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <Controller
            name="bannerSection.isHidden"
            control={control}
            render={({ field }) => (
              <Label
                main
                isHidden={field.value}
                onToggleHidden={() => field.onChange(!field.value)}
              >
                Banner Section
              </Label>
            )}
          />
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label className="font-bold">Image Alt</Label>
                <Input
                  {...register("bannerSection.imageAlt")}
                  placeholder="Image Alt"
                />
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
            <Label className="font-bold">Title</Label>
            <Input {...register("firstSection.title")} placeholder="Title" />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Button Text</Label>
                <Input
                  {...register("firstSection.btnText")}
                  placeholder="Button Text"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Button Link</Label>
                <Input
                  {...register("firstSection.btnLink")}
                  placeholder="Button Link"
                />
              </div>
            </div>
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <Controller
            name="secondSection.isHidden"
            control={control}
            render={({ field }) => (
              <Label
                main
                isHidden={field.value}
                onToggleHidden={() => field.onChange(!field.value)}
              >
                Second Section
              </Label>
            )}
          />
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("secondSection.title")} placeholder="Title" />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendSecond({
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
              {secondItems.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Item {index + 1}</Label>
                    <Button type="button" onClick={() => removeSecond(index)}>
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                  <Label className="font-bold">Image</Label>
                  <Controller
                    name={`secondSection.items.${index}.image`}
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
                    {...register(`secondSection.items.${index}.imageAlt`)}
                    placeholder="Image Alt"
                  />
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register(`secondSection.items.${index}.title`)}
                    placeholder="Title"
                  />
                  <Label className="font-bold">Description</Label>
                  <Textarea
                    {...register(`secondSection.items.${index}.description`)}
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <Controller
            name="thirdSection.isHidden"
            control={control}
            render={({ field }) => (
              <Label
                main
                isHidden={field.value}
                onToggleHidden={() => field.onChange(!field.value)}
              >
                Third Section
              </Label>
            )}
          />
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("thirdSection.title")} placeholder="Title" />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendThird({ title: "", icon: "", iconAlt: "" })
                }
              >
                + Add Item
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {thirdItems.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Item {index + 1}</Label>
                    <Button type="button" onClick={() => removeThird(index)}>
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                  <Label className="font-bold">Icon</Label>
                  <Controller
                    name={`thirdSection.items.${index}.icon`}
                    control={control}
                    render={({ field }) => (
                      <ImageUploader
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Label className="font-bold">Icon Alt</Label>
                  <Input
                    {...register(`thirdSection.items.${index}.iconAlt`)}
                    placeholder="Icon Alt"
                  />
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register(`thirdSection.items.${index}.title`)}
                    placeholder="Title"
                  />
                </div>
              ))}
            </div>
          </div>
        </AdminItemContainer>

        <AdminItemContainer>
          <Controller
            name="fourthSection.isHidden"
            control={control}
            render={({ field }) => (
              <Label
                main
                isHidden={field.value}
                onToggleHidden={() => field.onChange(!field.value)}
              >
                Fourth Section
              </Label>
            )}
          />
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("fourthSection.title")} placeholder="Title" />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() => appendFourth({ title: "", description: "" })}
              >
                + Add Item
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {fourthItems.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Item {index + 1}</Label>
                    <Button type="button" onClick={() => removeFourth(index)}>
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register(`fourthSection.items.${index}.title`)}
                    placeholder="Title"
                  />
                  <Label className="font-bold">Description</Label>
                  <Textarea
                    {...register(`fourthSection.items.${index}.description`)}
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>
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

        <div className="fixed top-2 right-8 z-50 flex gap-5">
          <CustomButton
            iconDirection="down"
            imageClass="!-rotate-135"
            variant="2"
            type="button"
            text="Back to Services"
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
