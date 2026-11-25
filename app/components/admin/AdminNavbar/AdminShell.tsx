"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

const STORAGE_KEY = "admin-sidebar-collapsed";
export const SIDEBAR_WIDTH = { expanded: 264, collapsed: 76 };

type AdminSidebarState = {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggle: () => void;
};

const AdminSidebarContext = createContext<AdminSidebarState>({
  collapsed: false,
  setCollapsed: () => {},
  toggle: () => {},
});
export const useAdminSidebar = () => useContext(AdminSidebarContext);

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let second = 0;
    const first = requestAnimationFrame(() => {
      try {
        if (window.localStorage.getItem(STORAGE_KEY) === "1")
          setCollapsedState(true);
      } catch {}
      second = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
    } catch {}
  }, []);
  const toggle = useCallback(
    () => setCollapsed(!collapsed),
    [collapsed, setCollapsed],
  );

  const width = collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded;

  return (
    <AdminSidebarContext.Provider value={{ collapsed, setCollapsed, toggle }}>
      <div
        data-collapsed={collapsed}
        data-ready={ready}
        style={{ "--admin-sidebar-w": `${width}px` } as React.CSSProperties}
        className="group/shell relative flex h-screen overflow-hidden bg-cream-background"
      >
        {children}

        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className="absolute top-[22px] z-30 flex h-7 w-7 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-secondary/70 bg-white text-description-color shadow-[0_2px_8px_rgba(10,10,10,0.08)] transition-[left,color,border-color,box-shadow] duration-300 ease-out hover:border-primary/40 hover:text-primary hover:shadow-[0_4px_14px_rgba(10,10,10,0.16)] group-data-[ready=false]/shell:transition-none"
          style={{ left: "var(--admin-sidebar-w)" }}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </AdminSidebarContext.Provider>
  );
}
