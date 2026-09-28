"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useSyncExternalStore,
    type ReactNode,
} from "react";

export type Density = "compact" | "comfortable" | "spacious";

const STORAGE_KEY = "app-density";
const CHANGE_EVENT = "app-density-change";
const DEFAULT_DENSITY: Density = "compact";

function isDensity(value: string | null): value is Density {
    return value === "compact" || value === "comfortable" || value === "spacious";
}

// External store: localStorage is the source of truth.
function subscribe(callback: () => void) {
    window.addEventListener("storage", callback); // other tabs
    window.addEventListener(CHANGE_EVENT, callback); // this tab
    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(CHANGE_EVENT, callback);
    };
}

function getSnapshot(): Density {
    const saved = localStorage.getItem(STORAGE_KEY);
    return isDensity(saved) ? saved : DEFAULT_DENSITY;
}

// Used on the server and during hydration, so no mismatch
function getServerSnapshot(): Density {
    return DEFAULT_DENSITY;
}

type DensityContextValue = {
    density: Density;
    setDensity: (d: Density) => void;
    sidebarCollapsed: boolean;
};

const DensityContext = createContext<DensityContextValue | null>(null);

export function DensityProvider({ children }: { children: ReactNode }) {
    const density = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Sync the DOM (an external system), so no setState here
    useEffect(() => {
        document.documentElement.dataset.density = density;
    }, [density]);

    const setDensity = useCallback((d: Density) => {
        localStorage.setItem(STORAGE_KEY, d);
        window.dispatchEvent(new Event(CHANGE_EVENT));
    }, []);

    return (
        <DensityContext.Provider
            value={{ density, setDensity, sidebarCollapsed: density === "spacious" }}
        >
            {children}
        </DensityContext.Provider>
    );
}

export function useDensity() {
    const ctx = useContext(DensityContext);
    if (!ctx) throw new Error("useDensity must be used within DensityProvider");
    return ctx;
}