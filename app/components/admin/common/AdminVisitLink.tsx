"use client";

import { createContext, useContext, useEffect, useState } from "react";

type VisitLinkState = {
  href: string | null;
  setHref: (href: string | null) => void;
};

const VisitLinkContext = createContext<VisitLinkState>({
  href: null,
  setHref: () => {},
});

export const useAdminVisitLink = () => useContext(VisitLinkContext).href;

export function AdminVisitLinkProvider({ children }: { children: React.ReactNode }) {
  const [href, setHref] = useState<string | null>(null);
  return (
    <VisitLinkContext.Provider value={{ href, setHref }}>
      {children}
    </VisitLinkContext.Provider>
  );
}

export default function AdminVisitLink({ href }: { href: string }) {
  const { setHref } = useContext(VisitLinkContext);
  useEffect(() => {
    setHref(href);
    return () => setHref(null);
  }, [href, setHref]);
  return null;
}
