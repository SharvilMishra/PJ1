import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { phoneById } from "../data/catalog";

const SAVED_KEY = "elyvex.saved-phone-ids";
const COMPARE_KEY = "elyvex.compare-phone-ids";

function readIds(key: string): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(stored) ? stored.filter((id): id is string => typeof id === "string" && phoneById.has(id)) : [];
  } catch {
    return [];
  }
}

type PhoneActions = {
  savedIds: string[];
  compareIds: string[];
  toggleSaved: (id: string) => void;
  toggleCompare: (id: string) => boolean;
  setCompareIds: (ids: string[]) => void;
};
const PhoneActionsContext = createContext<PhoneActions | null>(null);

export function PhoneActionsProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState(() => readIds(SAVED_KEY));
  const [compareIds, setCompare] = useState(() => readIds(COMPARE_KEY).slice(0, 2));

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const setCompareIds = useCallback((ids: string[]) => {
    const next = [...new Set(ids)].slice(0, 2);
    setCompare(next);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
  }, []);

  const toggleCompare = useCallback((id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((item) => item !== id));
      return true;
    }
    if (compareIds.length === 2) return false;
    setCompareIds([...compareIds, id]);
    return true;
  }, [compareIds, setCompareIds]);

  return <PhoneActionsContext.Provider value={{ savedIds, compareIds, toggleSaved, toggleCompare, setCompareIds }}>{children}</PhoneActionsContext.Provider>;
}

export function usePhoneActions() {
  const context = useContext(PhoneActionsContext);
  if (!context) throw new Error("usePhoneActions must be used within PhoneActionsProvider");
  return context;
}
