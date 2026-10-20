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
  RiMapPinLine,
  RiBuilding2Line,
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
  { key: "projects", label: "Projects" },
  { key: "regions", label: "Regions" },
  { key: "sectors", label: "Sectors" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

type Region = { _id: string; title: string };
type Sector = { _id: string; title: string };
type ProjectListItem = {
  _id: string;
  title?: string;
  slug?: string;
  isHidden?: boolean;
  region?: string;
  sector?: string[];
};

type DeleteTarget = {
  type: "region" | "sector" | "project";
  id: string;
  label: string;
};

const deleteLabels: Record<DeleteTarget["type"], string> = {
  region: "Region",
  sector: "Sector",
  project: "Project",
};

export default function ProjectListingPage() {
  const router = useRouter();
  // active tab lives in the URL (?tab=regions) so it survives refreshes
  // and can be linked to directly
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab: TabKey =
    TABS.find((t) => t.key === tabParam)?.key ?? "projects";
  const setActiveTab = (tab: TabKey) =>
    router.replace(`${pathname}?${new URLSearchParams({ tab })}`, {
      scroll: false,
    });

  const [regions, setRegions] = useState<Region[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [projects, setProjects] = useState<ProjectListItem[]>([]);

  const [newRegion, setNewRegion] = useState("");
  const [newSector, setNewSector] = useState("");
  const [editingRegionId, setEditingRegionId] = useState<string | null>(null);
  const [editingRegionTitle, setEditingRegionTitle] = useState("");
  const [editingSectorId, setEditingSectorId] = useState<string | null>(null);
  const [editingSectorTitle, setEditingSectorTitle] = useState("");
  const [sectorError, setSectorError] = useState(false);
  const [regionError, setRegionError] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const regionTitles = new Map(regions.map((r) => [r._id, r.title]));
  const sectorTitles = new Map(sectors.map((s) => [s._id, s.title]));

  const fetchAll = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        toast.error("Failed to load page");
        return;
      }
      const { data } = await res.json();
      setRegions(data.regions || []);
      setSectors(data.sectors || []);
      setProjects(data.projects || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load page");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ---- Regions ----
  const addRegion = async () => {
    if (!newRegion.trim()) return;
    try {
      const res = await fetch("/api/admin/projects/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newRegion.trim() }),
      });
      const { message, data } = await res.json();
      if (!res.ok) return toast.error(message || "Failed to add region");
      setRegions(data);
      setNewRegion("");
      toast.success("Region added");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  const saveRegion = async (id: string) => {
    try {
      const res = await fetch("/api/admin/projects/regions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: editingRegionTitle.trim() }),
      });
      const { message, data } = await res.json();
      if (!res.ok) return toast.error(message || "Failed to update region");
      setRegions(data);
      setEditingRegionId(null);
      toast.success("Region updated");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  // ---- Sectors ----
  const addSector = async () => {
    if (!newSector.trim()) return;
    try {
      const res = await fetch("/api/admin/projects/sectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newSector.trim() }),
      });
      const { message, data } = await res.json();
      if (!res.ok) return toast.error(message || "Failed to add sector");
      setSectors(data);
      setNewSector("");
      toast.success("Sector added");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  const saveSector = async (id: string) => {
    try {
      const res = await fetch("/api/admin/projects/sectors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: editingSectorTitle.trim() }),
      });
      const { message, data } = await res.json();
      if (!res.ok) return toast.error(message || "Failed to update sector");
      setSectors(data);
      setEditingSectorId(null);
      toast.success("Sector updated");
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  // ---- Projects ----
  const toggleHidden = async (
    e: React.MouseEvent,
    project: ProjectListItem,
  ) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/projects/project/${project._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !project.isHidden }),
      });
      const { message, data } = await res.json();
      if (!res.ok) return toast.error(message || "Failed to update project");
      setProjects((prev) =>
        prev.map((p) => (p._id === data._id ? { ...p, ...data } : p)),
      );
      toast.success(
        data.isHidden
          ? "Project hidden successfully"
          : "Project shown successfully",
      );
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  // ---- Unified delete (region / sector / project) ----
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    try {
      if (type === "region") {
        const res = await fetch(`/api/admin/projects/regions?id=${id}`, {
          method: "DELETE",
        });
        const { message, data } = await res.json();
        if (!res.ok) {
          toast.error(message || "Failed to delete region");
          return;
        }
        setRegions(data);
        toast.success("Region deleted");
      } else if (type === "sector") {
        const res = await fetch(`/api/admin/projects/sectors?id=${id}`, {
          method: "DELETE",
        });
        const { message, data } = await res.json();
        if (!res.ok) {
          toast.error(message || "Failed to delete sector");
          return;
        }
        setSectors(data);
        toast.success("Sector deleted");
      } else {
        const res = await fetch(`/api/admin/projects/project/${id}`, {
          method: "DELETE",
        });
        const { message } = await res.json();
        if (!res.ok) {
          toast.error(message || "Failed to delete project");
          return;
        }
        setProjects((prev) => prev.filter((p) => p._id !== id));
        toast.success("Project deleted");
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

      {/* Projects */}
      {activeTab === "projects" && (
        <ReorderableList
          title="Projects"
          noun="projects"
          items={projects}
          onItemsChange={setProjects}
          searchPlaceholder="Search name, slug, region or sector"
          getSearchValues={(project) => [
            project.title,
            project.slug,
            project.region && regionTitles.get(project.region),
            ...(project.sector ?? []).map((id) => sectorTitles.get(id)),
          ]}
          reorderEndpoint="/api/admin/projects/reorder"
          onReorderFailed={fetchAll}
          onRowClick={(project) =>
            router.push(`/4dm1n-br1ght0n/projects/${project._id}`)
          }
          headerActions={
            <CustomButton
              variant="3"
              type="button"
              text="Add Project"
              showIcon={false}
              onClick={() => router.push("/4dm1n-br1ght0n/projects/new")}
            />
          }
          renderContent={(project) => (
            <div className="flex flex-col items-start">
              <span className="text-md font-itc-medium leading-tight">
                {project.title || "Untitled Project"}
              </span>
              <span className="text-[12px] text-description-color font-itc-book leading-tight mt-0.5">
                {project.slug}
              </span>
              <div className="flex flex-wrap items-center gap-1.5 mt-2 empty:hidden">
                {project.region && regionTitles.has(project.region) && (
                  <span title="Region" className="inline-flex items-center gap-1 rounded-full border border-secondary bg-secondary/10 px-2.5 py-1 text-[11px] font-itc-medium text-description-color">
                    <RiMapPinLine size={12} />
                    <span className="text-trim">
                      {regionTitles.get(project.region)}
                    </span>
                  </span>
                )}
                {(project.sector ?? [])
                  .map((id) => sectorTitles.get(id))
                  .filter(Boolean)
                  .map((title) => (
                    <span
                      key={title}
                      title="Sector"
                      className="inline-flex items-center gap-1 rounded-full border border-secondary bg-secondary/10 px-2.5 py-1 text-[11px] font-itc-medium text-description-color"
                    >
                      <RiBuilding2Line size={12} />
                      <span className="text-trim">{title}</span>
                    </span>
                  ))}
                {project.isHidden && (
                  <span className="inline-flex items-center rounded-full border border-red-300 bg-red-50 px-2.5 py-1 text-[10px] uppercase font-semibold text-red-500">
                    <span className="text-trim">Hidden</span>
                  </span>
                )}
              </div>
            </div>
          )}
          renderActions={(project) => (
            <>
              <div className="relative group mt-2">
                <button
                  type="button"
                  className="cursor-pointer hover:scale-110 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `/projects/${project.slug}`,
                      "_blank",
                    );
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
                onClick={(e) => toggleHidden(e, project)}
                type="button"
                className="cursor-pointer hover:scale-110 transition-all"
                title={
                  project.isHidden ? "Show project" : "Hide project"
                }
              >
                {project.isHidden ? (
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
                    type: "project",
                    id: project._id,
                    label: project.title || "Untitled Project",
                  });
                }}
                title="Delete project"
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

      {/* Regions */}
      {activeTab === "regions" && (
      <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4 h-fit">
        <div className="flex items-center justify-between border-b border-secondary pb-3">
          <Label className="!text-xl !font-semibold">
            Regions {`(${regions?.length})`}
          </Label>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            value={newRegion}
            onChange={(e) => {
              setNewRegion(e.target.value);
              setRegionError(false);
            }}
            placeholder={regionError ? "Add name for region" : "New region"}
            className={regionError ? "placeholder:text-red-500" : ""}
          />

          <CustomButton
            variant="3"
            type="button"
            text="Add Region"
            showIcon={false}
            onClick={() => {
              if (!newRegion.trim()) {
                setRegionError(true);
                return;
              }

              addRegion();
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          {regions?.length === 0 && (
            <p className="text-sm text-black/40">No regions added yet.</p>
          )}
          {regions?.map((region) => (
            <div
              key={region._id}
              className="flex items-center justify-between border border-secondary/60 rounded-md px-4 py-2"
            >
              {editingRegionId === region._id ? (
                <Input
                  value={editingRegionTitle}
                  onChange={(e) => setEditingRegionTitle(e.target.value)}
                  className="mr-2"
                />
              ) : (
                <span className="text-md font-itc-medium">
                  {region.title}
                </span>
              )}
              <div className="flex items-center gap-3">
                {editingRegionId === region._id ? (
                  <>
                    <button
                      type="button"
                      className="cursor-pointer hover:scale-110 transition-all"
                      onClick={() => saveRegion(region._id)}
                    >
                      <RiCheckLine className="text-green-600" size={20} />
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer hover:scale-110 transition-all"
                      onClick={() => setEditingRegionId(null)}
                    >
                      <RiCloseLine className="text-gray-500" size={20} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="cursor-pointer hover:scale-110 transition-all"
                    onClick={() => {
                      setEditingRegionId(region._id);
                      setEditingRegionTitle(region.title);
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
                      type: "region",
                      id: region._id,
                      label: region.title,
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

      {/* Sectors */}
      {activeTab === "sectors" && (
      <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4 h-fit">
        <div className="flex items-center justify-between border-b border-secondary pb-3">
          <Label className="!text-xl !font-semibold">
            Sectors {`(${sectors?.length})`}
          </Label>
        </div>
        <div className="flex gap-2 items-center">
          <Input
            value={newSector}
            onChange={(e) => {
              setNewSector(e.target.value);
              setSectorError(false);
            }}
            placeholder={sectorError ? "Add name for sector" : "New sector"}
            className={sectorError ? "placeholder:text-red-500" : ""}
          />

          <CustomButton
            variant="3"
            type="button"
            text="Add Sector"
            showIcon={false}
            onClick={() => {
              if (!newSector.trim()) {
                setSectorError(true);
                return;
              }

              addSector();
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          {sectors?.length === 0 && (
            <p className="text-sm text-black/40">No sectors added yet.</p>
          )}
          {sectors?.map((sector) => (
            <div
              key={sector._id}
              className="flex items-center justify-between border border-secondary/60 rounded-md px-4 py-2"
            >
              {editingSectorId === sector._id ? (
                <Input
                  value={editingSectorTitle}
                  onChange={(e) => setEditingSectorTitle(e.target.value)}
                  className="mr-2"
                />
              ) : (
                <span className="text-md font-itc-medium">
                  {sector.title}
                </span>
              )}
              <div className="flex items-center gap-3">
                {editingSectorId === sector._id ? (
                  <>
                    <button
                      type="button"
                      className="cursor-pointer hover:scale-110 transition-all"
                      onClick={() => saveSector(sector._id)}
                    >
                      <RiCheckLine className="text-green-600" size={20} />
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer hover:scale-110 transition-all"
                      onClick={() => setEditingSectorId(null)}
                    >
                      <RiCloseLine className="text-gray-500" size={20} />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="cursor-pointer hover:scale-110 transition-all"
                    onClick={() => {
                      setEditingSectorId(sector._id);
                      setEditingSectorTitle(sector.title);
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
                      type: "sector",
                      id: sector._id,
                      label: sector.title,
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
