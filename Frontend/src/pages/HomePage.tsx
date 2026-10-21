import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePhoneActions } from "../auth/PhoneActionsProvider";
import { useUserPreferences, type PreferenceCategory } from "../auth/UserPreferencesProvider";
import { formatPrice, formatRating, phones, phoneSpecs, rankPhones } from "../data/catalog";
import { PhoneCardsSkeleton } from "../components/LoadingSkeletons";

const categories: { name: string; note: string; icon: string; tone: string; id: PreferenceCategory }[] = [
  { name: "Camera", note: "Higher camera specs", icon: "◉", tone: "camera", id: "camera" },
  { name: "Gaming", note: "More memory for play", icon: "⌘", tone: "gaming", id: "gaming" },
  { name: "Battery", note: "Longer-lasting picks", icon: "ϟ", tone: "battery", id: "battery" },
  { name: "Budget", note: "Lower catalog prices", icon: "↘", tone: "budget", id: "budget" },
];

const preferenceNames: Record<PreferenceCategory, string> = {
  gaming: "Gaming", battery: "Battery", camera: "Camera", budget: "Best value", flagship: "Premium",
};

export function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { preferences, loading: preferencesLoading } = useUserPreferences();
  const { savedIds, compareIds, toggleSaved, toggleCompare } = usePhoneActions();
  const rankedPhones = rankPhones(preferences.categories).slice(0, 3);
  const preferredLabels = categories.filter((category) => preferences.categories.includes(category.id)).map((category) => category.name);

  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(`/search${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  }

  return <main className="page-wrap home-page">
    <section className="home-hero">
      <div className="hero-text"><span className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT UPGRADE STARTS HERE</span><h1>Find the phone<br />that <em>gets you.</em></h1><p>Less scrolling. More finding the one. Search the real catalog or pick what matters most to you.</p>
        <form className="hero-search" onSubmit={search}><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search the phone catalog" placeholder="Search brand, model, or processor" /><button type="submit">Find phones <span>↗</span></button></form>
        <div className="hero-trust"><span>{phones.length} phones in the catalog</span><span className="trust-stars">★ {rankedPhones[0] ? formatRating(rankedPhones[0].rating) : "—"}</span></div>
      </div>
      <div className="hero-visual"><div className="visual-orbit orbit-large" /><div className="visual-orbit orbit-small" /><div className="visual-spark spark-a">✳</div><div className="visual-spark spark-b">✦</div><div className="hero-device"><div className="device-camera c1" /><div className="device-camera c2" /><div className="device-camera c3" /><div className="device-flash" /><div className="device-screen"><span>catalog match</span><b>{phones.length}</b><i>phones to explore</i></div></div><div className="match-bubble"><span className="match-heart">✦</span><span><b>Built from your priorities</b><small>Ranked from the catalog</small></span><strong>✓</strong></div><div className="visual-label">FIND YOUR NEXT FAVORITE <i /></div></div>
    </section>

    <section className="category-section"><div className="section-heading"><div><span className="eyebrow">START WITH WHAT MATTERS</span><h2>What’s your priority?</h2></div><Link to="/search" className="text-link">Explore all filters <span>↗</span></Link></div><div className="category-grid">{categories.map((category) => <Link to={`/search?category=${category.id}`} className={`category-card ${category.tone}`} key={category.name}><span className="category-icon">{category.icon}</span><span><b>{category.name}</b><small>{category.note}</small></span><span className="category-arrow">↗</span></Link>)}</div></section>

    <section className="picks-section"><div className="section-heading"><div><span className="eyebrow">{preferredLabels.length ? "RANKED FOR YOUR PREFERENCES" : "FROM THE PHONE CATALOG"}</span><h2>{preferredLabels.length ? "Your top matches" : "Top-rated phones"}</h2></div><Link to="/search" className="text-link">See all {phones.length} phones <span>↗</span></Link></div>
      {preferredLabels.length > 0 && <div className="preference-summary">Prioritizing {preferredLabels.map((label) => <span key={label}>{label}</span>)}<Link to="/settings">Edit preferences</Link></div>}
      {preferencesLoading ? <PhoneCardsSkeleton /> : <div className="phone-grid">{rankedPhones.map((phone, index) => { const selected = compareIds.includes(phone.id); return <article className="phone-card" key={phone.id}><div className={`phone-art ${["rose", "sand", "lavender"][index]}`}><span className="phone-tag">{phone.categories.filter((category) => preferences.categories.includes(category)).length ? "Matches your priorities" : `${formatRating(phone.rating)} rating`}</span><div className="phone-render"><i /><i /><i /></div><button className="heart-button" aria-label={`${savedIds.includes(phone.id) ? "Unsave" : "Save"} ${phone.name}`} aria-pressed={savedIds.includes(phone.id)} onClick={() => toggleSaved(phone.id)}>{savedIds.includes(phone.id) ? "♥" : "♡"}</button></div><div className="phone-info"><div className="phone-brandline"><span>{phone.brand}</span><span>★ {formatRating(phone.rating)}</span></div><h3>{phone.model}</h3><div className="phone-specs">{phoneSpecs(phone).map((spec) => <span key={spec}>{spec}</span>)}</div><div className="phone-card-bottom"><b>{formatPrice(phone.price)}</b><button className="text-action" aria-pressed={selected} onClick={() => toggleCompare(phone.id)}>{selected ? "Selected ✓" : "＋ Compare"}</button></div></div></article>; })}</div>}
      {compareIds.length > 0 && <p className="dataset-note">{compareIds.length} of 2 phones selected for comparison. <Link to="/compare">Open comparison ↗</Link></p>}
    </section>

    <section className="home-cta"><div><span className="eyebrow">YOUR NEEDS, YOUR SHORTLIST</span><h2>Know what you’re looking for?</h2><p>Filter the full catalog by price, brand, battery, camera, memory, and display.</p></div><Link className="button-primary" to="/search">Open advanced search <span>↗</span></Link></section>
  </main>;
}
