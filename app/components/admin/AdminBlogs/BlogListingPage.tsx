"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  RiDeleteBinLine,
  RiExternalLinkLine,
  RiEyeLine,
  RiEyeOffLine,
  RiPencilLine,
  RiCheckLine,
  RiCloseLine,
  RiPriceTag3Line,
} from "react-icons/ri";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CustomButton from "../../client/common/CustomButton";
import ReorderableList from "../common/ReorderableList";

const TABS = [
  { key: "blogs", label: "Blogs" },
  { key: "topics", label: "Topics" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

type Topic = { _id: string; title: string };
type BlogListItem = {
  _id: string;
  title?: string;
  slug?: string;
  isHidden?: boolean;
  topic?: string[];
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
  // active tab lives in the URL (?tab=topics) so it survives refreshes
  // and can be linked to directly
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: TabKey =
    TABS.find((t) => t.key === tabParam)?.key ?? "blogs";
  const setActiveTab = (tab: TabKey) =>
    router.replace(`${pathname}?${new URLSearchParams({ tab })}`, {
      scroll: false,
    });


  const [topics, setTopics] = useState<Topic[]>([]);
  const [blogs, setBlogs] = useState<BlogListItem[]>([]);

  const [newTopic, setNewTopic] = useState("");
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editingTopicTitle, setEditingTopicTitle] = useState("");
  const [topicError, setTopicError] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const topicTitles = new Map(topics.map((t) => [t._id, t.title]));

  const fetchAll = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        toast.error("Failed to load page");
        return;
      }
      const { data } = await res.json();
      setTopics(data.topics || []);
      setBlogs(data.blogs || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load page");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

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
      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white border border-secondary rounded-[10px] p-2 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-itc-medium transition-all ${
              activeTab === tab.key
                ? "bg-primary text-white"
                : "text-description-color hover:bg-secondary/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Blogs */}
      {activeTab === "blogs" && (
        <ReorderableList
          title="Blogs"
          noun="blogs"
          items={blogs}
          onItemsChange={setBlogs}
          searchPlaceholder="Search title, slug or topic"
          getSearchValues={(blog) => [
            blog.title,
            blog.slug,
            ...(blog.topic ?? []).map((id) => topicTitles.get(id)),
          ]}
          reorderEndpoint="/api/admin/blogs/reorder"
          onReorderFailed={fetchAll}
          onRowClick={(blog) =>
            router.push(`/4dm1n-br1ght0n/blogs/${blog._id}`)
          }
          headerActions={
            <CustomButton
              variant="3"
              type="button"
              text="Add Blog"
              showIcon={false}
              onClick={() => router.push("/4dm1n-br1ght0n/blogs/new")}
            />
          }
          renderContent={(blog) => (
            <div className="flex flex-col items-start">
              <span className="text-md font-itc-medium leading-tight">
                {blog.title || "Untitled Blog"}
              </span>
              <span className="text-[12px] text-description-color font-itc-book leading-tight mt-0.5">
                {blog.slug}
              </span>
              <div className="flex flex-wrap items-center gap-1.5 mt-2 empty:hidden">
                {(blog.topic ?? [])
                  .map((id) => topicTitles.get(id))
                  .filter(Boolean)
                  .map((title) => (
                    <span
                      key={title}
                      title="Topic"
                      className="inline-flex items-center gap-1 rounded-full border border-secondary bg-secondary/10 px-2.5 py-1 text-[11px] font-itc-medium text-description-color"
                    >
                      <RiPriceTag3Line size={12} />
                      <span className="text-trim">{title}</span>
                    </span>
                  ))}
                {blog.isHidden && (
                  <span className="inline-flex items-center rounded-full border border-red-300 bg-red-50 px-2.5 py-1 text-[10px] uppercase font-semibold text-red-500">
                    <span className="text-trim">Hidden</span>
                  </span>
                )}
              </div>
            </div>
          )}
          renderActions={(blog) => (
            <>
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
            </>
          )}
        />
      )}

      {/* Topics */}
      {activeTab === "topics" && (
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
      )}

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
