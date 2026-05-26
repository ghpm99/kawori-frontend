"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/lib/hooks";

// Client-side replacement for the old middleware redirect: the JWT lives in
// localStorage, so the edge can't gate routes. Authenticated users hitting a
// public page are bounced to the given internal destination.
const RedirectIfAuthenticated = ({ to }: { to: string }) => {
    const router = useRouter();
    const { status } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (status === "authenticated") router.replace(to);
    }, [status, to, router]);

    return null;
};

export default RedirectIfAuthenticated;
