import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import ClientSideLink from "../client-side-link";
import AdminNavbar from "@/app/components/admin/AdminNavbar/Index";
import AdminPageHeader from "@/app/components/admin/common/AdminPageHeader";
import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-cream-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-sm flex flex-col h-screen overflow-y-auto border-r border-secondary/60">
        <div className="flex-1">
          <Link href="/4dm1n-br1ght0n" className="cursor-pointer">
            <div className="px-6 flex items-center justify-center bg-white py-8 border-b border-secondary/60">
              <Image
                src="/assets/logos/header-logo.svg"
                alt="Logo"
                width={160}
                height={160}
              />
            </div>
          </Link>

          <nav className="flex flex-col gap-1 px-3 py-4">
            <AdminNavbar />
          </nav>
        </div>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-secondary/60">
          <ClientSideLink
            href="/admin/logout"
            name="Logout"
            icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
            className="text-red-600 hover:text-white rounded-[8px]"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-cream-background">
        <AdminPageHeader />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
