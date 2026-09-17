"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { RiDeleteBinLine, RiSearchLine } from "react-icons/ri";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CustomButton from "../../client/common/CustomButton";
import { CatalogueRequestDoc } from "@/app/types/catalogueRequest";

const formatDate = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function CatalogueRequestsPage() {
  const [requests, setRequests] = useState<CatalogueRequestDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<CatalogueRequestDoc | null>(
    null,
  );
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/admin/digital-catalogue/requests");
      const { data, message } = await res.json();
      if (!res.ok) {
        toast.error(message || "Failed to load requests");
        return;
      }
      setRequests(data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return requests;
    return requests.filter((r) =>
      [r.name, r.company, r.email, r.role]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(query)),
    );
  }, [requests, search]);

  const approve = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await fetch(
        `/api/admin/digital-catalogue/requests/${id}/approve`,
        { method: "POST" },
      );
      const { data, message } = await res.json();
      if (!res.ok) {
        toast.error(message || "Failed to approve request");
        return;
      }
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, ...data } : r)),
      );
      toast.success(message || "Catalogue emailed successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to approve request");
    } finally {
      setApprovingId(null);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const allVisibleSelected =
    filteredRequests.length > 0 &&
    filteredRequests.every((r) => selectedIds.includes(r._id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const visibleIds = new Set(filteredRequests.map((r) => r._id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      const visibleIds = filteredRequests.map((r) => r._id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const confirmDeleteSingle = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/admin/digital-catalogue/requests/${deleteTarget._id}`,
        { method: "DELETE" },
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.message || "Failed to delete request");
        return;
      }
      setRequests((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget._id));
      toast.success(body.message || "Request deleted");
      setDeleteTarget(null);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete request");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteBulk = async () => {
    if (selectedIds.length === 0) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/digital-catalogue/requests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.message || "Failed to delete requests");
        return;
      }
      const deleted = new Set(selectedIds);
      setRequests((prev) => prev.filter((r) => !deleted.has(r._id)));
      setSelectedIds([]);
      toast.success(body.message || "Requests deleted");
      setBulkDeleteOpen(false);
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete requests");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white border border-secondary rounded-[10px] p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary pb-3">
          <Label className="text-xl! font-semibold!">
            Catalogue Requests {`(${filteredRequests.length})`}
          </Label>

          <div className="flex items-center gap-3">
            <div className="relative">
              <RiSearchLine
                className="absolute left-3 top-1/2 -translate-y-1/2 text-description-color/60"
                size={16}
              />
              <Input
                type="text"
                placeholder="Search by name, company, email, role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9.25 md:h-10.5 w-64 md:w-80"
              />
            </div>

            {selectedIds.length > 0 && (
              <CustomButton
                variant="3"
                type="button"
                text={`Delete Selected (${selectedIds.length})`}
                showIcon={false}
                onClick={() => setBulkDeleteOpen(true)}
              />
            )}
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-black/40">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-sm text-black/40">No catalogue requests yet.</p>
        ) : filteredRequests.length === 0 ? (
          <p className="text-sm text-black/40">
            No catalogue requests match your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[12.5px] uppercase tracking-wide text-description-color border-b border-secondary/60">
                  <th className="py-3 pr-4 font-semibold w-10">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 cursor-pointer accent-primary"
                      aria-label="Select all"
                    />
                  </th>
                  <th className="py-3 pr-4 font-semibold">Name</th>
                  <th className="py-3 pr-4 font-semibold">Company</th>
                  <th className="py-3 pr-4 font-semibold">Email</th>
                  <th className="py-3 pr-4 font-semibold">Role</th>
                  <th className="py-3 pr-4 font-semibold">Requested</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b border-secondary/40 text-sm"
                  >
                    <td className="py-3 pr-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(r._id)}
                        onChange={() => toggleSelect(r._id)}
                        className="h-4 w-4 cursor-pointer accent-primary"
                        aria-label={`Select ${r.name}`}
                      />
                    </td>
                    <td className="py-3 pr-4 font-itc-medium">{r.name}</td>
                    <td className="py-3 pr-4 text-description-color">
                      {r.company || "-"}
                    </td>
                    <td className="py-3 pr-4 text-description-color">
                      {r.email}
                    </td>
                    <td className="py-3 pr-4 text-description-color">
                      {r.role || "-"}
                    </td>
                    <td className="py-3 pr-4 text-description-color">
                      {formatDate(r.createdAt)}
                    </td>
                    <td className="py-3 pr-4">
                      {r.status === "approved" ? (
                        <span className="text-[11px] uppercase font-semibold text-green-600 border border-green-300 rounded px-1.5 py-0.5">
                          Approved
                        </span>
                      ) : (
                        <span className="text-[11px] uppercase font-semibold text-yellow-600 border border-yellow-300 rounded px-1.5 py-0.5">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center justify-end gap-4">
                        <CustomButton
                          variant="3"
                          type="button"
                          text={
                            approvingId === r._id
                              ? "Sending..."
                              : r.status === "approved"
                                ? "Approved"
                                : "Approve"
                          }
                          showIcon={false}
                          disabled={
                            r.status === "approved" || approvingId === r._id
                          }
                          onClick={() => approve(r._id)}
                        />
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(r)}
                          title="Delete request"
                        >
                          <RiDeleteBinLine
                            className="text-red-400 hover:text-red-600 hover:scale-110 transition-all cursor-pointer"
                            size={20}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="!text-xl !font-itc-medium">
              Delete Request
            </DialogTitle>
          </DialogHeader>
          <p className="text-md text-description-color">
            Are you sure you want to delete the request from{" "}
            <span className="font-semibold font-itc-medium">
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
              disabled={isDeleting}
            />
            <CustomButton
              variant="3"
              type="button"
              text={isDeleting ? "Deleting..." : "Delete"}
              showIcon={false}
              onClick={confirmDeleteSingle}
              disabled={isDeleting}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={bulkDeleteOpen}
        onOpenChange={(open) => !open && setBulkDeleteOpen(false)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="!text-xl !font-itc-medium">
              Delete {selectedIds.length} Requests
            </DialogTitle>
          </DialogHeader>
          <p className="text-md text-description-color">
            Are you sure you want to delete{" "}
            <span className="font-semibold font-itc-medium">
              {selectedIds.length} selected request
              {selectedIds.length === 1 ? "" : "s"}
            </span>
            ? This cannot be undone.
          </p>
          <DialogFooter>
            <CustomButton
              variant="2"
              type="button"
              text="Cancel"
              showIcon={false}
              onClick={() => setBulkDeleteOpen(false)}
              disabled={isDeleting}
            />
            <CustomButton
              variant="3"
              type="button"
              text={isDeleting ? "Deleting..." : "Delete"}
              showIcon={false}
              onClick={confirmDeleteBulk}
              disabled={isDeleting}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
