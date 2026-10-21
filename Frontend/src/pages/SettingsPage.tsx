import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useUserPreferences, type PreferenceCategory } from "../auth/UserPreferencesProvider";
import { applyTheme, getThemeChoice, type ThemeChoice } from "../theme";
import { PreferenceRowsSkeleton } from "../components/LoadingSkeletons";

const categories: { id: PreferenceCategory; label: string; description: string }[] = [
  { id: "gaming", label: "Gaming", description: "Fast chips, sustained performance, and smooth displays" },
  { id: "battery", label: "Battery life", description: "Phones that can comfortably last through your day" },
  { id: "camera", label: "Camera quality", description: "Strong photo and video features" },
  { id: "budget", label: "Best value", description: "Get more for the price you want to pay" },
  { id: "flagship", label: "Premium phones", description: "Top-tier features and build quality" },
];

export function SettingsPage() {
  const { user } = useAuth();
  const { preferences, loading, saving, error, savePreferences } = useUserPreferences();
  const [draftCategories, setDraftCategories] = useState<PreferenceCategory[]>([]);
  const [theme, setTheme] = useState<ThemeChoice>(getThemeChoice);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!loading) setDraftCategories(preferences.categories);
  }, [loading, preferences.categories]);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("elyvex.theme", theme);
  }, [theme]);

  function toggleCategory(category: PreferenceCategory) {
    setDraftCategories((current) => current.includes(category)
      ? current.filter((item) => item !== category)
      : [...current, category]);
    setSaved(false);
    setSaveError("");
  }

  async function save() {
    setSaveError("");
    try {
      await savePreferences({ categories: draftCategories });
      setSaved(true);
    } catch {
      setSaved(false);
      setSaveError("Your changes are still on screen. Please try saving again.");
    }
  }

  return <main className="page-wrap settings-page">
    <div className="page-heading"><span className="eyebrow">MAKE IT FEEL LIKE YOURS</span><h1>Settings</h1><p className="lead">Choose what matters. Your recommendations will remember.</p></div>
    <div className="settings-layout">
      <aside className="settings-nav"><a className="current" href="#account"><span>◉</span>Account</a><a href="#recommendations"><span>✦</span>Recommendations</a><a href="#appearance"><span>◐</span>Appearance</a><a href="#notifications"><span>♧</span>Notifications</a><a href="#privacy"><span>◇</span>Privacy</a></aside>
      <div className="settings-content">
        <section className="settings-card" id="account"><span className="settings-icon">◉</span><div className="settings-card-title"><h2>Account details</h2><p>Keep your account information up to date.</p></div><div className="settings-fields"><label>Display name<input value={user?.displayName || "Guest"} readOnly /></label><label>Email address<input value={user?.email || "Browsing as guest"} readOnly /></label><Link className="inline-link" to={user ? "/profile" : "/signin"}>{user ? "View your profile ↗" : "Sign in to create an account ↗"}</Link></div></section>
        <section className="settings-card" id="recommendations"><span className="settings-icon">✦</span><div className="settings-card-title"><h2>Your phone priorities</h2><p>Choose one or more categories. We’ll bring phones matching these priorities to the top each time you visit.</p></div>{loading ? <PreferenceRowsSkeleton /> : <div className="toggle-list preference-toggle-list">{categories.map(({ id, label, description }) => <div className="toggle-row" key={id}><div><b>{label}</b><small>{description}</small></div><button type="button" role="switch" aria-label={`${label} priority`} aria-checked={draftCategories.includes(id)} className={`toggle ${draftCategories.includes(id) ? "on" : ""}`} onClick={() => toggleCategory(id)}><span /></button></div>)}</div>}{!user && <p className="guest-save-note">You’re browsing as a guest. Your choices save on this browser; <Link to="/signin">sign in</Link> to sync them to your account for future visits on any device.</p>}{(error || saveError) && <p className="settings-error" role="alert">{saveError || error}</p>}</section>
        <section className="settings-card" id="appearance"><span className="settings-icon">◐</span><div className="settings-card-title"><h2>Appearance</h2><p>Choose the look that feels right.</p></div><div className="appearance-options"><button type="button" aria-pressed={theme === "light"} className={theme === "light" ? "chosen" : ""} onClick={() => setTheme("light")}><span className="theme-preview light-preview">☼</span>Light</button><button type="button" aria-pressed={theme === "dark"} className={theme === "dark" ? "chosen" : ""} onClick={() => setTheme("dark")}><span className="theme-preview dark-preview">☾</span>Dark</button><button type="button" aria-pressed={theme === "system"} className={theme === "system" ? "chosen" : ""} onClick={() => setTheme("system")}><span className="theme-preview system-preview">◐</span>System</button></div></section>
        <section className="settings-card" id="notifications"><span className="settings-icon">♧</span><div className="settings-card-title"><h2>Product updates</h2><p>Signed-in users see occasional ELYVEX announcements. Dismiss an announcement whenever you like.</p></div></section>
        <div className="settings-save"><span>{saved ? "Your phone priorities are saved." : user ? "Saved to your ELYVEX account." : "Guest choices are stored in this browser."}</span><button className="button-primary" onClick={() => void save()} disabled={loading || saving}>{saving ? "Saving…" : saved ? "Saved ✓" : "Save priorities"}</button></div>
      </div>
    </div>
  </main>;
}
