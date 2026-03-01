import { store } from "@/lib/store";
import { useState } from "react";
import { Provider } from "react-redux";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    const [appStore] = useState(store);

    return <Provider store={appStore}>{children}</Provider>;
}
