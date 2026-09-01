"use client";

import AdminItemContainer from "@/app/components/admin/common/AdminItemContainer";
import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Enquiry {
  _id: string;
  firstName: string;
  secondName: string;
  email: string;
  contactNo: string;
  message: string;
  createdAt: string;
}

const MESSAGE_PREVIEW_LIMIT = 20;

export default function ContactEnquiryPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [viewEnquiry, setViewEnquiry] = useState<Enquiry | null>(null);

  // Fetch all enquiries on mount
  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/forms/contact-enquiries");
      const json = await res.json();
      setEnquiries(json.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  // Toggle a single row checkbox
  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Toggle "select all" checkbox
  const toggleAll = () => {
    if (selectedIds.size === enquiries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(enquiries.map((e) => e._id)));
    }
  };

  // Delete a single enquiry
  const handleDeleteOne = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/forms/contact-enquiries/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      setEnquiries((prev) => prev.filter((e) => e._id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      console.error(err);
      alert("Failed to delete enquiry");
    } finally {
      setDeletingId(null);
    }
  };

  // Delete all selected enquiries
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} selected enquiries?`)) return;

    setBulkDeleting(true);
    try {
      const res = await fetch("/api/admin/forms/contact-enquiries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });
      if (!res.ok) throw new Error("Bulk delete failed");

      setEnquiries((prev) => prev.filter((e) => !selectedIds.has(e._id)));
      setSelectedIds(new Set());
    } catch (err) {
      console.error(err);
      alert("Failed to delete selected enquiries");
    } finally {
      setBulkDeleting(false);
    }
  };

  // Truncate long messages for the table view
  const truncateMessage = (message: string) => {
    if (message.length <= MESSAGE_PREVIEW_LIMIT) return message;
    return `${message.slice(0, MESSAGE_PREVIEW_LIMIT)}...`;
  };

  if (loading) {
    return <div className="p-6">Loading enquiries...</div>;
  }

  return (
    <AdminItemContainer>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Contact Enquiries</h1>

          {/* Bulk delete button only shows when rows are selected */}
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              <Trash2 size={16} />
              {bulkDeleting
                ? "Deleting..."
                : `Delete Selected (${selectedIds.size})`}
            </button>
          )}
        </div>

        {enquiries.length === 0 ? (
          <p className="text-gray-500">No enquiries found.</p>
        ) : (
          <div className="overflow-x-auto border rounded">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === enquiries.length &&
                        enquiries.length > 0
                      }
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Contact No</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="border-t">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(enquiry._id)}
                        onChange={() => toggleOne(enquiry._id)}
                      />
                    </td>
                    <td className="p-3">
                      {enquiry.firstName} {enquiry.secondName}
                    </td>
                    <td className="p-3">{enquiry.email}</td>
                    <td className="p-3">{enquiry.contactNo}</td>
                    <td className="p-3 max-w-[240px]">
                      {truncateMessage(enquiry.message)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="">
                      <div className="flex items-center gap-5">
                        {/* View full details */}
                        <button
                          onClick={() => setViewEnquiry(enquiry)}
                          className="text-gray-600 hover:text-gray-900 cursor-pointer"
                          title="View"
                        >
                          <Eye size={22} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteOne(enquiry._id)}
                          disabled={deletingId === enquiry._id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={22} />
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

      {/* View full enquiry dialog */}
      <Dialog
        open={!!viewEnquiry}
        onOpenChange={(open) => !open && setViewEnquiry(null)}
      >
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          {viewEnquiry && (
            <>
              {/* Header block */}
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-border-color">
                <DialogTitle className="text-16 font-bold text-secondary">
                  {viewEnquiry.firstName} {viewEnquiry.secondName}
                </DialogTitle>
                <p className="text-14 text-secondary mt-1">
                  Submitted on{" "}
                  {new Date(viewEnquiry.createdAt).toLocaleString()}
                </p>
              </DialogHeader>

              {/* Contact info block */}
              <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-border-color bg-cream-background">
                <div>
                  <p className="text-16 font-bold text-secondary uppercase tracking-wide">
                    Email
                  </p>
                  <p className="text-14 text-secondary break-all">
                    {viewEnquiry.email}
                  </p>
                </div>
                <div>
                  <p className="text-16 font-bold text-secondary uppercase tracking-wide">
                    Contact No
                  </p>
                  <p className="text-14 text-secondary">
                    {viewEnquiry.contactNo}
                  </p>
                </div>
              </div>

              {/* Message block */}
              <div className="px-6 py-4">
                <p className="text-16 font-bold text-secondary uppercase tracking-wide mb-2">
                  Message
                </p>
                {/* Full message, wrapped, scrollable if very long */}
                <p className="text-14 text-secondary whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                  {viewEnquiry.message}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminItemContainer>
  );
}
