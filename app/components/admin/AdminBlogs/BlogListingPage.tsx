"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiEyeLine,
  RiEyeOffLine,
  RiPencilLine,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AdminItemContainer from "../common/AdminItemContainer";
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

type Topic = { _id: string; title: string };
type BlogListItem = {
  _id: string;
  title?: string;
  slug?: string;
  isHidden?: boolean;
};

type DeleteTarget = {
  type: "topic" | "blog";
  id: string;
  label: string;
};

const deleteLabels: Record<DeleteTarget["type"], string> = {
  topic: "Topic",
  blog: "Blog",
};

export default function BlogsListingPage() {
  const router = useRouter();
  const { register, control, reset, handleSubmit } = useForm<TopLevelForm>({
    defaultValues,
  });
  const [isSaving, setIsSaving] = useState(false);

  const [topics, setTopics] = useState<Topic[]>([]);
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);

  const [newTopic, setNewTopic] = useState("");
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicTitle, setEditingTopicTitle] = useState("");
  const [topicError, setTopicError] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const fetchAll = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
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
      setTopics(data.topics || []);
      setBlogs(data.blogs || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load page");
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (formData: TopLevelForm) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/blogs", {
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

  // ---- Topics ----
  const addTopic = async () => {
    if (!newTopic.trim()) return;
    try {
      const res = await fetch("/api/admin/blogs/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTopic.trim() }),
      });
      const { message, data } = await res.json();
      if (!res.ok) return toast.error(message || "Failed to add topic");
      setTopics(data);
      setNewTopic("");
      toast.success("Topic added");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  const saveTopic = async (id: string) => {
    try {
      const res = await fetch("/api/admin/blogs/topics", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: editingTopicTitle.trim() }),
      });
      const { message, data } = await res.json();
      if (!res.ok) return toast.error(message || "Failed to update topic");
      setTopics(data);
      setEditingTopicId(null);
      toast.success("Topic updated");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  // ---- Blogs ----
  const toggleHidden = async (e: React.MouseEvent, blog: BlogListItem) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/blogs/blog-item/${blog._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !blog.isHidden }),
      });
      const { message, data } = await res.json();
      if (!res.ok) return toast.error(message || "Failed to update blog");
      setBlogs((prev) =>
        prev.map((p) => (p._id === data._id ? { ...p, ...data } : p)),
      );
      toast.success(
        data.isHidden ? "Blog hidden successfully" : "Blog shown successfully",
      );
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  // ---- Unified delete (topic / blog) ----
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    try {
      if (type === "topic") {
        const res = await fetch(`/api/admin/blogs/topics?id=${id}`, {
          method: "DELETE",
        });
        const { message, data } = await res.json();
        if (!res.ok) {
          toast.error(message || "Failed to delete topic");
          return;
        }
        setTopics(data);
        toast.success("Topic deleted");
      } else {
        const res = await fetch(`/api/admin/blogs/blog-item/${id}`, {
          method: "DELETE",
        });
        const { message, data } = await res.json();
        if (!res.ok) {
          toast.error(message || "Failed to delete blog");
          return;
        }
        setBlogs(data);
        toast.success("Blog deleted");
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
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
          <Link href="/blog" target="_blank">
            <CustomButton variant="2" type="button" text="Visit Page" />
          </Link>
          <CustomButton
            variant="3"
            type="submit"
            text={isSaving ? "Saving..." : "Page Submit"}
            showIcon={false}
          />
        </div>
      </form>

      {/* Regions & Sectors */}
      <div className="grid grid-cols-[33%_1fr] gap-5">
        <div className="flex h-fit">
          <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between border-b border-secondary pb-3">
              <Label className="!text-xl !font-semibold">
                Topics {`(${topics?.length})`}
              </Label>
            </div>
            <div className="flex gap-2 items-center">
              <Input
                value={newTopic}
                onChange={(e) => {
                  setNewTopic(e.target.value);
                  setTopicError(false);
                }}
                placeholder={topicError ? "Add name for topic" : "New topic"}
                className={topicError ? "placeholder:text-red-500" : ""}
              />
              <CustomButton
                variant="3"
                type="button"
                text="Add Topic"
                showIcon={false}
                onClick={() => {
                  if (!newTopic.trim()) {
                    setTopicError(true);
                    return;
                  }
                  addTopic();
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              {topics?.length === 0 && (
                <p className="text-sm text-black/40">No topics added yet.</p>
              )}
              {topics?.map((topic) => (
                <div
                  key={topic._id}
                  className="flex items-center justify-between border border-secondary/60 rounded-md px-4 py-2"
                >
                  {editingTopicId === topic._id ? (
                    <Input
                      value={editingTopicTitle}
                      onChange={(e) => setEditingTopicTitle(e.target.value)}
                      className="mr-2"
                    />
                  ) : (
                    <span className="text-md font-itc-medium">
                      {topic.title}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    {editingTopicId === topic._id ? (
                      <>
                        <button
                          type="button"
                          className="cursor-pointer hover:scale-110 transition-all"
                          onClick={() => saveTopic(topic._id)}
                        >
                          <RiCheckLine className="text-green-600" size={20} />
                        </button>
                        <button
                          type="button"
                          className="cursor-pointer hover:scale-110 transition-all"
                          onClick={() => setEditingTopicId(null)}
                        >
                          <RiCloseLine className="text-gray-500" size={20} />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="cursor-pointer hover:scale-110 transition-all"
                        onClick={() => {
                          setEditingTopicId(topic._id);
                          setEditingTopicTitle(topic.title);
                        }}
                      >
                        <RiPencilLine
                          className="text-gray-500 hover:text-primary"
                          size={20}
                        />
                      </button>
                    )}
                    <button
                      type="button"
                      className="cursor-pointer hover:scale-110 transition-all"
                      onClick={() =>
                        setDeleteTarget({
                          type: "topic",
                          id: topic._id,
                          label: topic.title,
                        })
                      }
                    >
                      <RiDeleteBinLine
                        className="text-red-400 hover:text-red-600"
                        size={20}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Projects list */}
        <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-secondary pb-3">
            <Label className="!text-xl !font-semibold">
              Blogs {`(${blogs?.length})`}
            </Label>
            <CustomButton
              variant="3"
              type="button"
              text="Add Blog"
              showIcon={false}
              onClick={() => router.push("/4dm1n-br1ght0n/blogs/new")}
            />
          </div>
          <div className="grid grid-cols-1 gap-5">
            {blogs?.length === 0 && (
              <p className="text-sm text-black/40">No blogs added yet.</p>
            )}
            {blogs?.map((blog) => (
              <div
                key={blog._id}
                className="flex items-center justify-between border border-secondary/60 rounded-md px-4 py-3 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => router.push(`/4dm1n-br1ght0n/blogs/${blog._id}`)}
              >
                <span className="text-md font-itc-medium flex flex-col items-start gap-2">
                  {blog.title || "Untitled Blog"}
                  <span className="text-sm text-description-color font-itc-book">
                    {blog.slug}
                  </span>
                  {blog.isHidden && (
                    <span className="text-[10px] uppercase font-semibold text-red-500 border border-red-300 rounded px-1.5 py-0.5">
                      Hidden
                    </span>
                  )}
                </span>
                <div className="flex items-center justify-center gap-4">
                  <div className="relative group mt-2">
                    <button
                      type="button"
                      className="cursor-pointer hover:scale-110 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/blog/${blog.slug}`, "_blank");
                      }}
                    >
                      <RiExternalLinkLine
                        className="text-gray-500 hover:text-primary"
                        size={22}
                      />
                    </button>
                    <span
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
              whitespace-nowrap rounded-md bg-primary px-2 py-2 text-[11px] text-white font-itc-medium
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-opacity duration-400"
                    >
                      Visit page
                    </span>
                  </div>
                  <button
                    onClick={(e) => toggleHidden(e, blog)}
                    type="button"
                    className="cursor-pointer hover:scale-110 transition-all"
                    title={blog.isHidden ? "Show blog" : "Hide blog"}
                  >
                    {blog.isHidden ? (
                      <RiEyeOffLine className="text-gray-500" size={22} />
                    ) : (
                      <RiEyeLine className="text-green-600" size={22} />
                    )}
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer hover:scale-110 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget({
                        type: "blog",
                        id: blog._id,
                        label: blog.title || "Untitled Blog",
                      });
                    }}
                    title="Delete blog"
                  >
                    <RiDeleteBinLine
                      className="text-red-400 hover:text-red-600"
                      size={22}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="!text-xl !font-itc-medium">
              Delete {deleteTarget ? deleteLabels[deleteTarget.type] : ""}
            </DialogTitle>
          </DialogHeader>
          <p className="text-md text-description-color">
            Are you sure you want to delete{" "}
            <span className="font-semibold font-tasa text-primary font-itc-medium">
              {deleteTarget?.label}
            </span>
            ? This cannot be undone.
          </p>
          <DialogFooter>
            <CustomButton
              variant="2"
              type="button"
              text="Cancel"
              showIcon={false}
              onClick={() => setDeleteTarget(null)}
            />
            <CustomButton
              variant="3"
              type="button"
              text="Delete"
              showIcon={false}
              onClick={confirmDelete}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
