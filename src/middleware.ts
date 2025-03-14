import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";

const MainRoutes = [
    {
        subdomain: "",
        path: "/",
        private: false,
        whenAuthenticated: "next",
    },
    {
        subdomain: "",
        path: "/news",
        private: false,
        whenAuthenticated: "next",
    },
    {
        subdomain: "",
        path: "/user",
        private: true,
        whenAuthenticated: "next",
    },
];

const BlackDesertRoutes = [
    {
        subdomain: "blackdesert",
        path: "/facetexture",
        private: false,
        whenAuthenticated: "redirect",
        to: "/internal/facetexture",
    },
    {
        subdomain: "blackdesert",
        path: "/rank",
        private: false,
        whenAuthenticated: "next",
    },
    {
        subdomain: "blackdesert",
        path: "/overlay",
        private: false,
        whenAuthenticated: "next",
    },
] as const;

const FinancialRoutes = [
    {
        subdomain: "financial",
        path: "/financial",
        private: true,
        whenAuthenticated: "next",
    },
] as const;

const Routes = [
    ...MainRoutes,
    ...BlackDesertRoutes,
    ...FinancialRoutes,
    { subdomain: "", path: "/", private: false, whenAuthenticated: "next" },
    { subdomain: "", path: "/news", private: false, whenAuthenticated: "next" },
    { subdomain: "", path: "/internal", private: true, whenAuthenticated: "next" },
    { subdomain: "", path: "/admin", private: true, whenAuthenticated: "next" },
    { subdomain: "financial", path: "/financial", private: true, whenAuthenticated: "next" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/signout";

function getSubdomain(request: NextRequest) {
    console.log("request", request);
    const host = request.headers.get("host");
    const subdomain = host.split(".")[0];
    return subdomain;
}

function hasAuthenticated(request: NextRequest) {
    if (request.nextUrl.hostname === "localhost") return true;

    return !!request.cookies.get("lifetimetoken");
}

export function middleware(request: NextRequest) {
    console.log("====================================");
    const subdomain = getSubdomain(request);
    console.log("subdomain", subdomain);
    const path = getPrefixRequestPathname(request);
    console.log("path", path);
    const route = Routes.find((route) => route.path === path && route.subdomain === subdomain);
    console.log("route", route);
    console.log("cookies", request.cookies);
    const authenticated = hasAuthenticated(request);
    console.log("authenticated", authenticated);

    if (!authenticated && route?.private) return redirectToPathname(request, REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE);

    if (authenticated && !route?.private && route?.whenAuthenticated === "redirect")
        return redirectToPathname(request, route.to);

    if (authenticated && route?.private) return NextResponse.next();

    return NextResponse.next();
}

function redirectToPathname(request: NextRequest, pathname: string, searchParams?: string) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = pathname;

    if (searchParams) {
        redirectUrl.search = searchParams;
    }

    return NextResponse.redirect(redirectUrl);
}

function getPrefixRequestPathname(request: NextRequest): string {
    const path = request.nextUrl.pathname;
    const splitPath = path
        .split(/\/([^\/]+)/)
        .slice(1, 3)
        .map((segment) => `/${segment}`)[0];

    return splitPath;
}

export const config: MiddlewareConfig = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};
