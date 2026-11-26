import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import ClientSideLink from "../client-side-link";
import AdminNavbar from "@/app/components/admin/AdminNavbar/Index";
import { AdminShell } from "@/app/components/admin/AdminNavbar/AdminShell";
import AdminPageHeader from "@/app/components/admin/common/AdminPageHeader";
import { AdminVisitLinkProvider } from "@/app/components/admin/common/AdminVisitLink";
import Image from "next/image";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminShell>
      {/* Sidebar */}
      <aside className="admin-sidebar relative z-20 flex h-screen w-[var(--admin-sidebar-w)] shrink-0 flex-col overflow-hidden shadow-[8px_0_30px_-12px_rgba(0,0,0,0.45)] transition-[width] duration-300 ease-out group-data-[ready=false]/shell:transition-none">
        <Link
          href="/4dm1n-br1ght0n"
          className="group relative flex shrink-0 flex-col items-center gap-3 border-b border-white/20 px-6 pb-5 pt-8 transition-[padding] duration-300 group-data-[collapsed=true]/shell:px-2 group-data-[collapsed=true]/shell:pb-4 group-data-[collapsed=true]/shell:pt-6"
        >
          <span className="block h-[22px] w-[164px] overflow-hidden transition-[width] duration-300 group-data-[collapsed=true]/shell:w-[18px]">
            <Image
              src="/assets/logos/header-logo.svg"
              alt="Brighton"
              width={180}
              height={24}
              className="h-[22px] w-auto max-w-none brightness-0 invert"
              priority
            />
          </span>
          <span className="whitespace-nowrap rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60 group-data-[collapsed=true]/shell:hidden">
            Admin Console
          </span>
        </Link>

        <div className="admin-sidebar-scroll relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5 group-data-[collapsed=true]/shell:px-2.5">
          <nav>
            <AdminNavbar />
          </nav>
          <div className="pointer-events-none sticky -bottom-5 -mx-3 -mb-5 h-8 bg-gradient-to-t from-[#0d0d0d] to-transparent" />
        </div>

        <div className="shrink-0 border-t border-white/20 p-3 group-data-[collapsed=true]/shell:p-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.05] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] group-data-[collapsed=true]/shell:p-1.5">
            <div className="flex items-center gap-3 px-2 py-1.5 group-data-[collapsed=true]/shell:justify-center group-data-[collapsed=true]/shell:px-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-primary ring-2 ring-white/15">
                B
              </span>
              <span className="min-w-0 leading-tight group-data-[collapsed=true]/shell:hidden">
                <span className="block truncate text-[13px] font-semibold text-white">
                  Administrator
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-white/55">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Signed in
                </span>
              </span>
            </div>
            <div className="mt-1.5 border-t border-white/10 pt-1.5">
              <ClientSideLink
                href="/admin/logout"
                name="Logout"
                icon={<ArrowRightOnRectangleIcon className="h-[18px] w-[18px]" />}
                className="text-red-300 hover:bg-red-500/10 hover:text-red-200"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <AdminVisitLinkProvider>
      <main className="flex flex-1 flex-col overflow-hidden bg-cream-background">
        <AdminPageHeader />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">{children}</div>
      </main>
      </AdminVisitLinkProvider>
    </AdminShell>
  );
}
