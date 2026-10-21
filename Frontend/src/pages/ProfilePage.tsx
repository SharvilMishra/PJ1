import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { usePhoneActions } from "../auth/PhoneActionsProvider";
import { useUserPreferences, type PreferenceCategory } from "../auth/UserPreferencesProvider";
import { formatPrice, phoneById } from "../data/catalog";

const preferenceLabels: Record<PreferenceCategory, string> = { gaming: "Gaming first", battery: "Long battery", camera: "Camera first", budget: "Best value", flagship: "Premium phones" };

export function ProfilePage() {
  const { user } = useAuth();
  const { savedIds, compareIds, toggleSaved, toggleCompare } = usePhoneActions();
  const { preferences, loading: preferencesLoading } = useUserPreferences();
  const displayName = user?.displayName || "Phone enthusiast";
  const savedPhones = savedIds.map((id) => phoneById.get(id)).filter((phone) => phone !== undefined);

  return <main className="page-wrap profile-page"><div className="page-heading"><span className="eyebrow">YOUR ELYVEX</span><h1>Your profile</h1><p className="lead">Your phone priorities and saved catalog picks.</p></div>
    <section className="profile-card"><div className="profile-avatar">{displayName.slice(0, 1).toUpperCase()}</div><div className="profile-identity"><h2>{displayName}</h2><p>{user?.email || "Browsing as guest"}</p><span className="member-since">{user ? "SIGNED-IN ACCOUNT" : "GUEST PROFILE · THIS DEVICE"}</span></div><Link className="outline-button" to="/settings">Edit preferences <span>↗</span></Link></section>
    <div className="profile-stats"><article><span>♡</span><b>{savedPhones.length.toString().padStart(2, "0")}</b><small>Saved phones</small></article><article><span>⇄</span><b>{compareIds.length}/2</b><small>Phones selected to compare</small></article></div>
    <section className="profile-section" id="saved"><div className="section-heading"><div><span className="eyebrow">KEEP YOUR SHORTLIST CLOSE</span><h2>Saved phones</h2></div><Link to="/search" className="text-link">Discover more <span>↗</span></Link></div>
      {savedPhones.length ? <div className="saved-grid">{savedPhones.map((phone) => <article className="saved-card" key={phone.id}><div className="saved-art rose"><div className="saved-device"><i /><i /><i /></div></div><div className="saved-details"><span>{phone.brand}</span><h3>{phone.model}</h3><b>{formatPrice(phone.price)}</b><div><button onClick={() => toggleCompare(phone.id)}>{compareIds.includes(phone.id) ? "Selected for compare" : "＋ Compare"}</button><button aria-label={`Remove ${phone.name} from saved phones`} onClick={() => toggleSaved(phone.id)}>Remove</button></div></div></article>)}</div> : <div className="empty-saved-state"><h3>No saved phones yet</h3><p>Save phones from the catalog and they’ll appear here on this device.</p><Link className="button-primary" to="/search">Explore phones <span>↗</span></Link></div>}
    </section>
    <section className="preferences-card"><div><span className="pref-icon">✳</span><div><h3>Your phone priorities</h3><p>Used to rank catalog recommendations.</p></div></div>{preferencesLoading ? <div className="preference-chips"><span className="skeleton-block skeleton-chip" /><span className="skeleton-block skeleton-chip" /></div> : <div className="preference-chips">{preferences.categories.length ? preferences.categories.map((category) => <span key={category}>{preferenceLabels[category]}</span>) : <span>No priorities selected yet</span>}<Link to="/settings">Edit preferences</Link></div>}</section>
  </main>;
}
