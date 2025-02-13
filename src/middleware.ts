import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import path from "path"

const publicRoutes = [
    {path: '/', whenAuthenticated: 'next'},
    {path: '/admin', whenAuthenticated: 'next'},
    {path: '/internal', whenAuthenticated: 'next'},
    {path: '/login', whenAuthenticated: 'redirect'},
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = "/";

export function middleware(request: NextRequest) {
    console.log(request);
    const path = request.nextUrl.pathname;
    const publicRoute = publicRoutes.find(route => route.path === path)
    const authToken = request.cookies.get("authToken");

    if(!authToken && publicRoute)
        return NextResponse.next()

    if(!authToken && !publicRoute){
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE
        return NextResponse.redirect(redirectUrl);
    }

    if(authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect'){
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/"
        return NextResponse.redirect(redirectUrl);
    }

    if(authToken && !publicRoute){

        return NextResponse.next()
    }

    return NextResponse.next();
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
