export interface CatalogueRequestDoc {
  _id: string;
  name: string;
  company?: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogueAccess {
  viewUrl: string;
  downloadUrl: string;
}
