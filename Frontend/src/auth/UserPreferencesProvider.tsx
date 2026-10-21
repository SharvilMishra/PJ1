import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthProvider";
import { db } from "./firebase";

export const preferenceCategories = ["gaming", "battery", "camera", "budget", "flagship"] as const;
export type PreferenceCategory = typeof preferenceCategories[number];
export type UserPreferences = { categories: PreferenceCategory[] };

const emptyPreferences: UserPreferences = { categories: [] };
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
        try { localStorage.removeItem("elyvex.guest.preferences"); } catch { /* Storage is optional. */ }
        if (!cancelled) { setPreferences(emptyPreferences); setLoading(false); }
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
          setPreferences({ categories: normalizeCategories(snapshot.data().categories) });
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
    const safePreferences = { categories: normalizeCategories(next.categories) };
    if (!user) throw new Error("Sign in to save recommendation priorities.");
    setSaving(true);
    setError("");
    try {
      if (!db) throw new Error("Firebase is not configured.");
      await setDoc(doc(db, "userPreferences", user.uid), {
        categories: safePreferences.categories,
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
