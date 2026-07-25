export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/social-posts/:path*",
    "/seo-content/:path*",
    "/keywords/:path*",
    "/ga4/:path*",
    "/search-console/:path*",
    "/ahrefs/:path*",
    "/screaming-frog/:path*",
  ],
};
