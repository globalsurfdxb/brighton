export type CatalogueRequestStatus = "pending" | "approved";

export interface CatalogueRequestDoc {
  _id: string;
  name: string;
  company?: string;
  email: string;
  role?: string;
  status: CatalogueRequestStatus;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}
