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
import CustomButton from "../../client/common/CustomButton";
import Link from "next/link";

interface ContactForm {
  seo: { metaTitle: string; metaDescription: string; script: string };
  firstSection: {
    isHidden: boolean;
    title: string;
    address: string;
    phone: string;
    email: string;
    subTitle: string;
    mapLink: string;
  };
  secondSection: {
    isHidden: boolean;
    image: string;
    imageAlt: string;
    items: { title: string; link: string; icon: string; iconAlt: string }[];
  };
  ctaSection: {
    isHidden: boolean;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export default function ContactPage() {
  const { register, handleSubmit, setValue, control, watch } =
    useForm<ContactForm>();

  const {
    fields: secondItems,
    append: appendSecond,
    remove: removeSecond,
    replace: replaceSecond,
  } = useFieldArray({ control, name: "secondSection.items" });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/contact");
      if (res.ok) {
        const { data } = await res.json();
        setValue("seo", data.seo);
        setValue("firstSection", data.firstSection);
        setValue("secondSection.isHidden", data.secondSection?.isHidden);
        setValue("secondSection.image", data.secondSection?.image);
        setValue("secondSection.imageAlt", data.secondSection?.imageAlt);
        setValue("ctaSection", data.ctaSection);

        replaceSecond(data.secondSection?.items || []);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch("/api/admin/contact", {
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
            <div className="grid grid-cols-2 gap-4">
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
                <Label className="font-bold">Address</Label>
                <Textarea
                  {...register("firstSection.address")}
                  placeholder="Address"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Phone</Label>
                <Input
                  {...register("firstSection.phone")}
                  placeholder="Phone"
                />
                <Label className="font-bold">Email</Label>
                <Input
                  {...register("firstSection.email")}
                  placeholder="Email"
                />
                <Label className="font-bold">Map Link</Label>
                <Input
                  {...register("firstSection.mapLink")}
                  placeholder="Map Link"
                />
              </div>
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
              <Label className="font-bold">Image Alt</Label>
              <Input
                {...register("secondSection.imageAlt")}
                placeholder="Image Alt"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <Label className="font-bold">Items</Label>
              <Button
                type="button"
                addItem
                onClick={() =>
                  appendSecond({ title: "", link: "", icon: "", iconAlt: "" })
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
                  <Label className="font-bold">Icon</Label>
                  <Controller
                    name={`secondSection.items.${index}.icon`}
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
                    {...register(`secondSection.items.${index}.iconAlt`)}
                    placeholder="Icon Alt"
                  />
                  <Label className="font-bold">Title</Label>
                  <Input
                    {...register(`secondSection.items.${index}.title`)}
                    placeholder="Title"
                  />
                  <Label className="font-bold">Link</Label>
                  <Input
                    {...register(`secondSection.items.${index}.link`)}
                    placeholder="Link"
                  />
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

        <div className="fixed top-2 right-8 z-50 flex gap-5">
          <Link href={`/contact-us`} target="_blank">
            <CustomButton variant="2" type="button" text="Visit page" />
          </Link>
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
