export const LIGHT_HEADER_ROUTES = [
  "/interior-lighting/*",
  "/projects",
  "/resources/digital-catalogue",
  "/contact-us",
  "/news/*",
  "/blog/*",
];

export const matchesRoute = (pathname: string, route: string) => {
  if (route.endsWith("/*")) {
    const baseRoute = route.slice(0, -2);
    return pathname === baseRoute || pathname.startsWith(`${baseRoute}/`);
  }
  return pathname === route;
};

export const isLightHeaderRoute = (pathname: string) =>
  LIGHT_HEADER_ROUTES.some((route) => matchesRoute(pathname, route));
