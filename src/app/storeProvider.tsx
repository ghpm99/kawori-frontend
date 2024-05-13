"use client";
import { AppStore, store } from "@/lib/store";
import { useEffect, useRef } from "react";
import { setupListeners } from "@reduxjs/toolkit/query";
import { Provider } from "react-redux";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore>();
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = store();
    }

    useEffect(() => {
        if (storeRef.current != null) {
            // configure listeners using the provided defaults
            // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
            const unsubscribe = setupListeners(storeRef.current.dispatch);
            return unsubscribe;
        }
    }, []);

    return <Provider store={storeRef.current}>{children}</Provider>;
}
