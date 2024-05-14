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

    return <Provider store={storeRef.current}>{children}</Provider>;
}
