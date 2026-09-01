"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ImageUploader } from "@/components/ui/image-uploader";
import { Textarea } from "@/components/ui/textarea";
import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import { toast } from "sonner";
import { useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import TinyEditor from "../common/TinyMceEditor";
import CustomButton from "../../client/common/CustomButton";

interface AboutForm {
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
    description: string;
    items: { value: string; label: string }[];
  };
  secondSection: {
    isHidden: boolean;
    Image: string;
    ImageAlt: string;
    items: { title: string; description: string }[];
  };
  thirdSection: {
    isHidden: boolean;
    title: string;
    subTitle: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  fourthSection: {
    isHidden: boolean;
    title: string;
    items: { image: string; imageAlt: string; title: string }[];
  };
  fifthSection: {
    isHidden: boolean;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  sixthSection: {
    isHidden: boolean;
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  };
  seventhSection: {
    isHidden: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export default function AboutPage() {
  const { register, handleSubmit, setValue, control, watch } =
    useForm<AboutForm>();

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
  const {
    fields: fourthItems,
    append: appendFourth,
    remove: removeFourth,
    replace: replaceFourth,
  } = useFieldArray({ control, name: "fourthSection.items" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/about");
      if (res.ok) {
        const { data } = await res.json();
        setValue("seo", data.seo);
        setValue("bannerSection", data.bannerSection);
        setValue("firstSection.isHidden", data.firstSection?.isHidden);
        setValue("firstSection.title", data.firstSection?.title);
        setValue("firstSection.description", data.firstSection?.description);
        setValue("secondSection.isHidden", data.secondSection?.isHidden);
        setValue("secondSection.Image", data.secondSection?.Image);
        setValue("secondSection.ImageAlt", data.secondSection?.ImageAlt);
        setValue("thirdSection", data.thirdSection);
        setValue("fourthSection.isHidden", data.fourthSection?.isHidden);
        setValue("fourthSection.title", data.fourthSection?.title);
        setValue("fifthSection", data.fifthSection);
        setValue("sixthSection", data.sixthSection);
        setValue("seventhSection", data.seventhSection);

        replaceFirst(data.firstSection?.items || []);
        replaceSecond(data.secondSection?.items || []);
        replaceFourth(data.fourthSection?.items || []);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: AboutForm) => {
    try {
      const res = await fetch("/api/admin/about", {
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
        {/* Banner Section */}
        <AdminItemContainer>
          <Label main>Banner Section</Label>
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
                <Label className="font-bold">Alt Tag</Label>
                <Input
                  {...register("bannerSection.imageAlt")}
                  placeholder="Alt Tag"
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
            <Label className="font-bold">Title</Label>
            <Input {...register("firstSection.title")} placeholder="Title" />
            <Label className="font-bold">Description</Label>
            <Controller
              name="firstSection.description"
              control={control}
              render={({ field }) => (
                <TinyEditor
                  setNewsContent={field.onChange}
                  newsContent={field.value}
                />
              )}
            />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() => appendFirst({ value: "", label: "" })}
              >
                + Add Item
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {firstItems.map((field, index) => (
                <div
                  key={field.id}
                  className="border border-black/10 rounded-lg p-4 flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold">Item {index + 1}</Label>
                    <Button type="button" onClick={() => removeFirst(index)}>
                      <RiDeleteBinLine size={16} />
                    </Button>
                  </div>
                  <Label className="font-bold">Value</Label>
                  <Input
                    {...register(`firstSection.items.${index}.value`)}
                    placeholder="Value"
                  />
                  <Label className="font-bold">Label</Label>
                  <Input
                    {...register(`firstSection.items.${index}.label`)}
                    placeholder="Label"
                  />
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
                  name="secondSection.Image"
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
                  {...register("secondSection.ImageAlt")}
                  placeholder="Image Alt"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() => appendSecond({ title: "", description: "" })}
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

        {/* Third Section */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("thirdSection.isHidden")}
            onToggleHidden={() =>
              setValue("thirdSection.isHidden", !watch("thirdSection.isHidden"))
            }
          >
            Third Section
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Image</Label>
                <Controller
                  name="thirdSection.image"
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
                  {...register("thirdSection.imageAlt")}
                  placeholder="Image Alt"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input
                  {...register("thirdSection.title")}
                  placeholder="Title"
                />
                <Label className="font-bold">Sub Title</Label>
                <Input
                  {...register("thirdSection.subTitle")}
                  placeholder="Sub Title"
                />
                <Label className="font-bold">Description</Label>
                <Textarea
                  {...register("thirdSection.description")}
                  placeholder="Description"
                />
              </div>
            </div>
          </div>
        </AdminItemContainer>

        {/* Fourth Section */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("fourthSection.isHidden")}
            onToggleHidden={() =>
              setValue(
                "fourthSection.isHidden",
                !watch("fourthSection.isHidden"),
              )
            }
          >
            Fourth Section
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("fourthSection.title")} placeholder="Title" />
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendFourth({ image: "", imageAlt: "", title: "" })
                }
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
                  <Label className="font-bold">Image</Label>
                  <Controller
                    name={`fourthSection.items.${index}.image`}
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
                    {...register(`fourthSection.items.${index}.imageAlt`)}
                    placeholder="Image Alt"
                  />
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register(`fourthSection.items.${index}.title`)}
                    placeholder="Title"
                  />
                </div>
              ))}
            </div>
          </div>
        </AdminItemContainer>

        {/* Fifth Section */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("fifthSection.isHidden")}
            onToggleHidden={() =>
              setValue("fifthSection.isHidden", !watch("fifthSection.isHidden"))
            }
          >
            Fifth Section
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Image</Label>
                <Controller
                  name="fifthSection.image"
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
                  {...register("fifthSection.imageAlt")}
                  placeholder="Image Alt"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input
                  {...register("fifthSection.title")}
                  placeholder="Title"
                />
                <Label className="font-bold">Description</Label>
                <Textarea
                  {...register("fifthSection.description")}
                  placeholder="Description"
                />
              </div>
            </div>
          </div>
        </AdminItemContainer>

        {/* Sixth Section */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("sixthSection.isHidden")}
            onToggleHidden={() =>
              setValue("sixthSection.isHidden", !watch("sixthSection.isHidden"))
            }
          >
            Sixth Section
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Image</Label>
                <Controller
                  name="sixthSection.image"
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
                  {...register("sixthSection.imageAlt")}
                  placeholder="Image Alt"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input
                  {...register("sixthSection.title")}
                  placeholder="Title"
                />
                <Label className="font-bold">Description</Label>
                <Textarea
                  {...register("sixthSection.description")}
                  placeholder="Description"
                />
              </div>
            </div>
          </div>
        </AdminItemContainer>

        {/* Seventh Section */}
        <AdminItemContainer>
          <Label
            main
            isHidden={watch("seventhSection.isHidden")}
            onToggleHidden={() =>
              setValue(
                "seventhSection.isHidden",
                !watch("seventhSection.isHidden"),
              )
            }
          >
            Seventh Section
          </Label>
          <div className="p-5 flex flex-col gap-4">
            <Label className="font-bold">Title</Label>
            <Input {...register("seventhSection.title")} placeholder="Title" />
            <Label className="font-bold">Description</Label>
            <Textarea
              {...register("seventhSection.description")}
              placeholder="Description"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Button Text</Label>
                <Input
                  {...register("seventhSection.buttonText")}
                  placeholder="Button Text"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Button Link</Label>
                <Input
                  {...register("seventhSection.buttonLink")}
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
          <CustomButton variant="3" type="submit" text="Page Submit" showIcon={false} />
        </div>
      </form>
    </div>
  );
}
