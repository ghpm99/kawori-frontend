"use client";

import { userGroups } from "@/components/constants";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const navigate = useRouter();

    const { user, status, groups } = useAppSelector((state) => state.auth);
    const loadingStore = useAppSelector((state) => state.loading);

    useEffect(() => {
        const loadingToken = loadingStore.effects["auth/verify"] !== "idle";
        const loadingUserDetails = loadingStore.effects["profile/userDetail"] !== "idle";
        const loadingUserGroups = loadingStore.effects["profile/userGroups"] !== "idle";

        if (loadingToken || loadingUserDetails || loadingUserGroups) return;

        const hasGroups = groups.includes(userGroups.blackdesert);

        if (status === "unauthenticated" || !user.is_active || !hasGroups) {
            navigate.push("/");
        }
    }, [status, loadingStore.effects, user.is_active, navigate, groups]);

    return children;
}
