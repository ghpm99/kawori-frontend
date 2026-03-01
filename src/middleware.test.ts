/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

function createRequest(pathname: string, cookies: Record<string, string> = {}): NextRequest {
    const url = new URL(pathname, "http://localhost:3000");
    const req = new NextRequest(url);
    for (const [key, value] of Object.entries(cookies)) {
        req.cookies.set(key, value);
    }
    return req;
}

describe("middleware", () => {
    describe("rotas privadas sem autenticação", () => {
        it("deve redirecionar /internal para /signout quando sem cookie", () => {
            const req = createRequest("/internal/facetexture");
            const response = middleware(req);

            expect(response.status).toBe(307);
            expect(new URL(response.headers.get("location")!).pathname).toBe("/signout");
        });

        it("deve redirecionar /admin para /signout quando sem cookie", () => {
            const req = createRequest("/admin/dashboard");
            const response = middleware(req);

            expect(response.status).toBe(307);
            expect(new URL(response.headers.get("location")!).pathname).toBe("/signout");
        });

        it("deve redirecionar /financial para /signout quando sem cookie", () => {
            const req = createRequest("/financial/overview");
            const response = middleware(req);

            expect(response.status).toBe(307);
            expect(new URL(response.headers.get("location")!).pathname).toBe("/signout");
        });
    });

    describe("rotas privadas com autenticação", () => {
        it("deve permitir acesso a /internal com cookie lifetimetoken", () => {
            const req = createRequest("/internal/facetexture", { lifetimetoken: "valid-token" });
            const response = middleware(req);

            expect(response.status).toBe(200);
        });

        it("deve permitir acesso a /admin com cookie lifetimetoken", () => {
            const req = createRequest("/admin/dashboard", { lifetimetoken: "valid-token" });
            const response = middleware(req);

            expect(response.status).toBe(200);
        });
    });

    describe("rota /facetexture com redirect quando autenticado", () => {
        it("deve redirecionar /facetexture para /internal/facetexture quando autenticado", () => {
            const req = createRequest("/facetexture", { lifetimetoken: "valid-token" });
            const response = middleware(req);

            expect(response.status).toBe(307);
            expect(new URL(response.headers.get("location")!).pathname).toBe("/internal/facetexture");
        });

        it("deve permitir acesso a /facetexture quando não autenticado", () => {
            const req = createRequest("/facetexture");
            const response = middleware(req);

            expect(response.status).toBe(200);
        });
    });

    describe("rotas públicas", () => {
        it("deve permitir acesso à raiz sem cookie", () => {
            const req = createRequest("/");
            const response = middleware(req);

            expect(response.status).toBe(200);
        });

        it("deve permitir acesso a /rank sem cookie", () => {
            const req = createRequest("/rank");
            const response = middleware(req);

            expect(response.status).toBe(200);
        });

        it("deve permitir acesso a /news sem cookie", () => {
            const req = createRequest("/news/some-article");
            const response = middleware(req);

            expect(response.status).toBe(200);
        });

        it("deve permitir acesso a /reset-password sem cookie", () => {
            const req = createRequest("/reset-password");
            const response = middleware(req);

            expect(response.status).toBe(200);
        });

        it("deve permitir acesso a rotas públicas com cookie sem redirect", () => {
            const req = createRequest("/rank", { lifetimetoken: "valid-token" });
            const response = middleware(req);

            expect(response.status).toBe(200);
        });
    });
});
