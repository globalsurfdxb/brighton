"use client";

import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RiDeleteBinLine,
  RiEyeLine,
  RiEyeOffLine,
  RiExternalLinkLine,
} from "react-icons/ri";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import CustomButton from "../../client/common/CustomButton";

interface ServiceListItem {
  _id: string;
  slug: string;
  name: string;
  isHidden: boolean;
}

export default function ServicesListPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceListItem[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<ServiceListItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        toast.error("Failed to load services");
        return;
      }
      const { data } = await res.json();
      setServices(data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load services");
    }
  };

  const toggleHidden = async (
    e: React.MouseEvent,
    service: ServiceListItem,
  ) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/admin/services/${service._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isHidden: !service.isHidden }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) =>
            s._id === service._id ? { ...s, isHidden: !s.isHidden } : s,
          ),
        );
        toast.success(service.isHidden ? "Service shown" : "Service hidden");
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/services/${deleteTarget._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setServices((prev) => prev.filter((s) => s._id !== deleteTarget._id));
        toast.success("Service deleted");
        setDeleteTarget(null);
      } else {
        const { message } = await res.json();
        toast.error(message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-secondary pb-3">
          <Label className="!text-xl !font-semibold">
            Services {`(${services.length})`}
          </Label>
          <CustomButton
            variant="3"
            type="button"
            text="Add Service"
            showIcon={false}
            onClick={() => router.push("/4dm1n-br1ght0n/services/new")}
          />
        </div>
        <div className="grid grid-cols-1 gap-5">
          {services.length === 0 && (
            <p className="text-sm text-black/40">No services added yet.</p>
          )}
          {services.map((service) => (
            <div
              key={service._id}
              className="flex items-center justify-between border border-secondary/60 rounded-md px-4 py-3 hover:shadow-sm transition-all cursor-pointer"
              onClick={() =>
                router.push(`/4dm1n-br1ght0n/services/${service._id}`)
              }
            >
              <span className="text-md font-itc-medium flex flex-col items-start gap-2">
                {service.name || "Untitled Service"}
                <span className="text-sm text-description-color font-itc-book">
                  {service.slug}
                </span>
                {service.isHidden && (
                  <span className="text-[10px] uppercase font-semibold text-red-500 border border-red-300 rounded px-1.5 py-0.5">
                    Hidden
                  </span>
                )}
              </span>
              <div className="flex items-center justify-center gap-4">
                <div className="relative group mt-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`/services/${service.slug}`, "_blank");
                    }}
                  >
                    <RiExternalLinkLine
                      className="text-gray-500 hover:text-primary hover:scale-110 transition-all cursor-pointer"
                      size={22}
                    />
                  </button>

                  <span
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1
    whitespace-nowrap rounded-md bg-primary px-2 py-2 text-[11px] text-white font-itc-medium
    opacity-0 invisible group-hover:opacity-100 group-hover:visible
    transition-opacity duration-400"
                  >
                    View on website
                  </span>
                </div>
                <button
                  onClick={(e) => toggleHidden(e, service)}
                  type="button"
                  className="cursor-pointer"
                  title={service.isHidden ? "Show service" : "Hide service"}
                >
                  {service.isHidden ? (
                    <RiEyeOffLine className="text-gray-500" size={22} />
                  ) : (
                    <RiEyeLine className="text-green-600" size={22} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget(service);
                  }}
                  title="Delete service"
                >
                  <RiDeleteBinLine
                    className="text-red-400 hover:text-red-600 hover:scale-110 transition-all cursor-pointer"
                    size={22}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="!text-xl !font-itc-medium">
              Delete Service
            </DialogTitle>
          </DialogHeader>
          <p className="text-md text-description-color">
            Are you sure you want to delete{" "}
            <span className="font-semibold font-tasa text-primary font-itc-medium">
              {deleteTarget?.name}
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
