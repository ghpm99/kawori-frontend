"use client";

import { signoutThunk } from "@/lib/features/auth";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Signout() {
    console.log("Page Signout")
    const dispatch = useAppDispatch();
    const navigate = useRouter();
    const authStore = useAppSelector((state) => state.auth);
    const loadingStore = useAppSelector(state => state.loading)

    const loading = loadingStore.effects["auth/signout"] !== "idle"

    useEffect(() => {
        dispatch(signoutThunk());
    },[dispatch])

    useEffect(() => {
        console.log("auth/signout", loading)
        if(loading) return

        navigate.push("/");

    }, [loading, navigate]);

    return <div>Deslogando</div>;
}
