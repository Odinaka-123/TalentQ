"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import {
    getPreferredLanguage,
    updatePreferredLanguage,
} from "@/lib/queries/language";
import { translations, type LanguageCode } from "./translations";

type LanguageContextValue = {
    language: LanguageCode;
    setLanguage: (language: LanguageCode) => void;
    loading: boolean;
    /**
     * t("settings.appearance.theme.title") -> translated string.
     * Falls back to en-GB, then to the raw key, so nothing ever renders blank
     * while new keys are still being migrated across the app.
     */
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<LanguageCode>("en-GB");
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                setUserId(user.id);
                try {
                    const preferred = await getPreferredLanguage(user.id);
                    setLanguageState(preferred);
                } catch {
                    // fall back to default en-GB, already set above
                }
            }

            setLoading(false);
        };

        init();
    }, []);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = useCallback(
        (next: LanguageCode) => {
            setLanguageState(next);
            if (userId) {
                updatePreferredLanguage(userId, next).catch(() => {
                    // best-effort — keep the local selection even if persisting fails
                });
            }
        },
        [userId],
    );

    const t = useCallback(
        (key: string): string => {
            return (
                translations[language]?.[key] ?? translations["en-GB"][key] ?? key
            );
        },
        [language],
    );

    const value = useMemo(
        () => ({ language, setLanguage, loading, t }),
        [language, setLanguage, loading, t],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextValue {
    const ctx = useContext(LanguageContext);

    // SSG / Prerender fallback to prevent Next.js build crashes
    if (!ctx) {
        return {
            language: "en-GB",
            setLanguage: () => { },
            loading: false,
            t: (key: string) => translations["en-GB"]?.[key] ?? key,
        };
    }

    return ctx;
}