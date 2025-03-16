"use client";

import { userGroups } from "@/components/constants";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const navigate = useRouter();

    const { status, user, groups } = useAppSelector((state) => state.auth);
    const loadingStore = useAppSelector((state) => state.loading);

    const loading = ((): boolean => {
        const loadingToken = loadingStore.effects["auth/verify"] === "pending";
        const loadingUserDetails = loadingStore.effects["profile/userDetail"] === "pending";
        const loadingUserGroups = loadingStore.effects["profile/userGroups"] !== "idle";

        return loadingToken || loadingUserDetails || loadingUserGroups;
    })();

    useEffect(() => {
        if (loading) return;

        const hasGroups = groups.includes(userGroups.admin);

        if (status === "unauthenticated" || !user.is_superuser || !hasGroups) {
            navigate.push("/");
        }
    }, [status, loading, user.is_superuser, navigate, groups]);

    return children;
}
