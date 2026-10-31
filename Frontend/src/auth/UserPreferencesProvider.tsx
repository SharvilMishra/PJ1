import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthProvider";
import { db } from "./firebase";

export const preferenceCategories = ["gaming", "battery", "camera", "budget", "flagship"] as const;
export type PreferenceCategory = typeof preferenceCategories[number];
export const recommendationPersonas = ["student", "creator", "gaming", "business", "senior"] as const;
export type RecommendationPersona = typeof recommendationPersonas[number];
export type UserPreferences = { categories: PreferenceCategory[]; persona: RecommendationPersona | null; maxPrice: number };

const DEFAULT_MAX_PRICE = 2000;
const emptyPreferences: UserPreferences = { categories: [], persona: null, maxPrice: DEFAULT_MAX_PRICE };
const PreferencesContext = createContext<{
  preferences: UserPreferences;
  loading: boolean;
  saving: boolean;
  error: string;
  savePreferences: (next: UserPreferences) => Promise<void>;
}>({ preferences: emptyPreferences, loading: true, saving: false, error: "", savePreferences: async () => {} });

function normalizeCategories(value: unknown): PreferenceCategory[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is PreferenceCategory =>
    typeof item === "string" && (preferenceCategories as readonly string[]).includes(item),
  ))];
}

function normalizePersona(value: unknown): RecommendationPersona | null {
  return typeof value === "string" && (recommendationPersonas as readonly string[]).includes(value)
    ? value as RecommendationPersona
    : null;
}

export function UserPreferencesProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(emptyPreferences);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    setLoading(true);
    setError("");

    async function loadPreferences() {
      if (!user) {
        let guestPreferences = emptyPreferences;
        try {
          const saved = localStorage.getItem("elyvex.guest.preferences");
          if (saved) {
            const data = JSON.parse(saved) as Record<string, unknown>;
            guestPreferences = {
              categories: normalizeCategories(data.categories),
              persona: normalizePersona(data.persona),
              maxPrice: typeof data.maxPrice === "number" && Number.isFinite(data.maxPrice)
                ? Math.min(DEFAULT_MAX_PRICE, Math.max(0, data.maxPrice)) : DEFAULT_MAX_PRICE,
            };
          }
        } catch { /* Storage is optional. */ }
        if (!cancelled) { setPreferences(guestPreferences); setLoading(false); }
        return;
      }
      if (!db) {
        if (!cancelled) { setPreferences(emptyPreferences); setError("Firebase is not configured."); setLoading(false); }
        return;
      }
      try {
        const reference = doc(db, "userPreferences", user.uid);
        const snapshot = await getDoc(reference);
        if (cancelled) return;
        if (snapshot.exists()) {
          const data = snapshot.data();
          const maxPrice = typeof data.maxPrice === "number" && Number.isFinite(data.maxPrice)
            ? Math.min(DEFAULT_MAX_PRICE, Math.max(0, data.maxPrice))
            : DEFAULT_MAX_PRICE;
          setPreferences({ categories: normalizeCategories(data.categories), persona: normalizePersona(data.persona), maxPrice });
        } else {
          setPreferences(emptyPreferences);
        }
      } catch {
        if (!cancelled) {
          setPreferences(emptyPreferences);
          setError("Could not load your saved preferences. Check your connection and Firestore setup.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadPreferences();
    return () => { cancelled = true; };
  }, [user, authLoading]);

  const savePreferences = useCallback(async (next: UserPreferences) => {
    const safePreferences = {
      categories: normalizeCategories(next.categories),
      persona: normalizePersona(next.persona),
      maxPrice: Number.isFinite(next.maxPrice) ? Math.min(DEFAULT_MAX_PRICE, Math.max(0, next.maxPrice)) : DEFAULT_MAX_PRICE,
    };
    setSaving(true);
    setError("");
    try {
      if (!user) {
        try { localStorage.setItem("elyvex.guest.preferences", JSON.stringify(safePreferences)); } catch { /* Storage is optional. */ }
        setPreferences(safePreferences);
        return;
      }
      if (!db) throw new Error("Firebase is not configured.");
      await setDoc(doc(db, "userPreferences", user.uid), {
        categories: safePreferences.categories,
        persona: safePreferences.persona,
        maxPrice: safePreferences.maxPrice,
        updatedAt: serverTimestamp(),
      });
      setPreferences(safePreferences);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Could not save preferences.";
      setError(message.includes("permission")
        ? "Firestore blocked this save. Deploy the included Firestore security rules and try again."
        : "Could not save your preferences. Check your connection and Firestore setup.");
      throw cause;
    } finally {
      setSaving(false);
    }
  }, [user]);

  return <PreferencesContext.Provider value={{ preferences, loading: loading || authLoading, saving, error, savePreferences }}>{children}</PreferencesContext.Provider>;
}

export function useUserPreferences() { return useContext(PreferencesContext); }
