"use client";

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
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RiDeleteBinLine } from "react-icons/ri";
import CustomButton from "../../client/common/CustomButton";
import { FileText, Home } from "lucide-react";

interface ServiceForm {
  name: string;
  slug: string;
  isHidden: boolean;
  seo: { metaTitle: string; metaDescription: string; script: string };
  homePageSection: {
    title: string;
    image: string;
    imageAlt: string;
    description: string;
  };
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
  homePageSection: {
    title: "",
    image: "",
    imageAlt: "",
    description: "",
  },
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

const SERVICE_TABS = [
  { value: "page", label: "Page", icon: FileText },
  { value: "home", label: "Home", icon: Home },
] as const;

export default function ServiceDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const isNew = params.id === "new";

  const { register, handleSubmit, control, reset, watch, setValue, getValues } =
    useForm<ServiceForm>({ defaultValues });
  const { isDirty, markClean, changes } = useUnsavedChanges(control, getValues);
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab] = useState<"page" | "home">("page");
  const [isHomeTitleTouched, setIsHomeTitleTouched] = useState(false);
  const nameValue = watch("name");

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
        homePageSection: {
          ...defaultValues.homePageSection,
          ...data.homePageSection,
        },
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
      markClean();

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
        markClean();
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
    if (!isHomeTitleTouched) {
      setValue("homePageSection.title", nameValue);
    }
  }, [nameValue, isHomeTitleTouched, setValue]);

  useEffect(() => {
    if (!isNew) fetchService();
    else markClean();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <AdminPageActions isDirty={isDirty} changes={changes}>
          <CustomButton
            iconDirection="down"
            imageClass="!-rotate-135"
            variant="2"
            type="button"
            text="Back to Services"
            onClick={() => router.back()}
          />
          <AdminSubmitButton saving={isSaving} />
        </AdminPageActions>

        <AdminItemContainer expansion={false} >
              <div className="border-b border-secondary">
                <Label
                  main
                >
                  Service Details
                </Label>
              </div>
          <div className="p-5 flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Name</Label>
              <Input
                {...register("name")}
                placeholder="e.g. Real Estate Service"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="font-bold">Slug</Label>
              <div className="flex gap-2">
                <Input
                  {...register("slug")}
                  placeholder="e.g. real-estate-service"
                />
                  <CustomButton
                    btnClass="-mt-[2px]"
                    variant="3"
                    text="Generate"
                    type="button"
                    onClick={() =>
                      setValue(
                        "slug",
                        watch("name").toLowerCase().replace(/\s+/g, "-"),
                      )
                    }
                  />
              </div>
            </div>
          </div>
        </AdminItemContainer>

        <div className="flex items-center justify-between">
          <div
            role="tablist"
            aria-label="Service content"
            className="relative grid w-fit grid-cols-2 rounded-full border border-secondary/60 bg-white p-1 shadow-[0_1px_2px_rgba(10,10,10,0.04)]"
          >
            <span
              aria-hidden
              className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-primary shadow-[0_6px_14px_-8px_rgba(10,10,10,0.7)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.5,1)] ${
                tab === "home" ? "translate-x-full" : "translate-x-0"
              }`}
            />
            {SERVICE_TABS.map(({ value, label, icon: Icon }) => {
              const active = tab === value;
              const edited = changes.some((c) =>
                value === "home"
                  ? c.section === "Home Page Section"
                  : !["Home Page Section", "Name", "Slug"].includes(c.section),
              );
              return (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(value)}
                  className={`relative z-[1] flex min-w-[130px] cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-medium transition-colors duration-200 ${
                    active ? "text-white" : "text-description-color hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-trim">{label}</span>
                  {edited && (
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[12.5px] text-description-color">
            <span className="text-trim">
              {tab === "home"
                ? "How this service appears on the home page"
                : "Content of the service page"}
            </span>
          </p>
        </div>

        <div className={tab === "page" ? "flex flex-col gap-5" : "hidden"}>
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
                    <Label className="font-bold">Image Alt</Label>
                    <Input
                      {...register("bannerSection.imageAlt")}
                      placeholder="Image Alt"
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
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Description</Label>
                <Textarea
                  {...register("firstSection.title")}
                  placeholder="Description"
                />
              </div>
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
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input {...register("secondSection.title")} placeholder="Title" />
              </div>
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
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Image Alt</Label>
                      <Input
                        {...register(`secondSection.items.${index}.imageAlt`)}
                        placeholder="Image Alt"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`secondSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Description</Label>
                      <Textarea
                        {...register(`secondSection.items.${index}.description`)}
                        placeholder="Description"
                      />
                    </div>
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
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input {...register("thirdSection.title")} placeholder="Title" />
              </div>
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
              <div className="grid grid-cols-3 gap-4">
                {thirdItems.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-secondary/60 rounded-lg p-4 flex flex-col gap-3 bg-cream-background/40"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="font-bold">Item {index + 1}</Label>
                      <Button type="button" onClick={() => removeThird(index)}>
                        <RiDeleteBinLine size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
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
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Icon Alt</Label>
                      <Input
                        {...register(`thirdSection.items.${index}.iconAlt`)}
                        placeholder="Icon Alt"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`thirdSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                    </div>
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
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input {...register("fourthSection.title")} placeholder="Title" />
              </div>
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
                    className="border border-secondary/60 rounded-lg p-4 flex flex-col gap-3 bg-cream-background/40"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="font-bold">Item {index + 1}</Label>
                      <Button type="button" onClick={() => removeFourth(index)}>
                        <RiDeleteBinLine size={16} />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Title</Label>
                      <Input
                        {...register(`fourthSection.items.${index}.title`)}
                        placeholder="Title"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label className="font-bold">Description</Label>
                      <Textarea
                        {...register(`fourthSection.items.${index}.description`)}
                        placeholder="Description"
                      />
                    </div>
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
        </div>

        <div className={tab === "home" ? "flex flex-col gap-5" : "hidden"}>
          <AdminItemContainer expansion={false}>
            <div className="border-b border-secondary/60">
              <Label main>Home Page Section</Label>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-bold">Title</Label>
                <Input
                  {...register("homePageSection.title", {
                    onChange: () => setIsHomeTitleTouched(true),
                  })}
                  placeholder="e.g. Real Estate Service"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <Label className="font-bold">Image</Label>
                    <Controller
                      name="homePageSection.image"
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
                      {...register("homePageSection.imageAlt")}
                      placeholder="Image Alt"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="font-bold">Description</Label>
                  <Input
                    {...register("homePageSection.description")}
                    placeholder="Description"
                  />
                </div>
              </div>
            </div>
          </AdminItemContainer>
        </div>
      </form>
    </div>
  );
}
