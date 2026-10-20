import { useUserPreferences, type PreferenceCategory } from "../auth/UserPreferencesProvider";

const categories = [
  { name: "Camera", note: "For your best shots", icon: "◉", tone: "camera", id: "camera" as PreferenceCategory },
  { name: "Gaming", note: "Power through play", icon: "⌘", tone: "gaming", id: "gaming" as PreferenceCategory },
  { name: "Battery", note: "Go further, longer", icon: "ϟ", tone: "battery", id: "battery" as PreferenceCategory },
  { name: "Budget", note: "More for your money", icon: "₹", tone: "budget", id: "budget" as PreferenceCategory },
];

const picks = [
  { name: "Pixel 9 Pro", brand: "Google", price: "₹1,09,999", rating: "4.9", tag: "Best camera", tone: "rose", categories: ["camera", "battery", "budget"] as PreferenceCategory[], specs: ["50 MP camera", "16 GB RAM", "4700 mAh"] },
  { name: "Galaxy S24 Ultra", brand: "Samsung", price: "₹1,29,999", rating: "4.8", tag: "Best all-rounder", tone: "sand", categories: ["gaming", "battery", "flagship"] as PreferenceCategory[], specs: ["200 MP camera", "12 GB RAM", "5000 mAh"] },
  { name: "iPhone 16 Pro", brand: "Apple", price: "₹1,19,900", rating: "4.9", tag: "Best performance", tone: "lavender", categories: ["gaming", "camera", "flagship"] as PreferenceCategory[], specs: ["48 MP camera", "8 GB RAM", "3582 mAh"] },
];

export function HomePage() {
  const { preferences, loading: preferencesLoading } = useUserPreferences();
  const rankedPicks = [...picks].sort((left, right) => {
    const leftMatches = left.categories.filter((category) => preferences.categories.includes(category)).length;
    const rightMatches = right.categories.filter((category) => preferences.categories.includes(category)).length;
    return rightMatches - leftMatches || Number(right.rating) - Number(left.rating);
  });
  const preferredLabels = categories.filter((category) => preferences.categories.includes(category.id)).map((category) => category.name);

  return <main className="page-wrap home-page">
    <section className="home-hero"><div className="hero-text"><span className="eyebrow"><span className="eyebrow-dot" /> YOUR NEXT UPGRADE STARTS HERE</span><h1>Find the phone<br />that <em>gets you.</em></h1><p>Less scrolling. More finding the one. Tell us what matters and we’ll bring your best matches into focus.</p><form className="hero-search" action="/search"><span>⌕</span><input name="q" aria-label="Describe what you need" placeholder="Try “great camera under ₹50,000”" /><button>Find my match <span>↗</span></button></form><div className="hero-trust"><span className="trust-avatars"><b>A</b><b>R</b><b>K</b></span><span>Smarter choices, made simple</span><span className="trust-stars">★★★★★</span></div></div><div className="hero-visual"><div className="visual-orbit orbit-large" /><div className="visual-orbit orbit-small" /><div className="visual-spark spark-a">✳</div><div className="visual-spark spark-b">✦</div><div className="hero-device"><div className="device-camera c1" /><div className="device-camera c2" /><div className="device-camera c3" /><div className="device-flash" /><div className="device-screen"><span>your match</span><b>01</b><i>just for you</i></div></div><div className="match-bubble"><span className="match-heart">♥</span><span><b>It's a match</b><small>Made around you</small></span><strong>98%</strong></div><div className="visual-label">FIND YOUR NEXT FAVORITE <i /></div></div></section>
    <section className="category-section"><div className="section-heading"><div><span className="eyebrow">START WITH WHAT MATTERS</span><h2>What’s your priority?</h2></div><a href="/search" className="text-link">Explore all filters <span>↗</span></a></div><div className="category-grid">{categories.map((category) => <a href={`/search?category=${category.name.toLowerCase()}`} className={`category-card ${category.tone}`} key={category.name}><span className="category-icon">{category.icon}</span><span><b>{category.name}</b><small>{category.note}</small></span><span className="category-arrow">↗</span></a>)}</div></section>
    <section className="picks-section"><div className="section-heading"><div><span className="eyebrow">{preferredLabels.length ? "RANKED FOR YOUR PREFERENCES" : "A GOOD PLACE TO START"}</span><h2>{preferredLabels.length ? "Your top matches" : "Phones people love"}</h2></div><a href="/search" className="text-link">See all phones <span>↗</span></a></div>{preferredLabels.length > 0 && <div className="preference-summary">Prioritizing {preferredLabels.map((label) => <span key={label}>{label}</span>)}<a href="/settings">Edit preferences</a></div>}{preferencesLoading ? <p className="dataset-note">Loading your saved phone priorities…</p> : <><div className="phone-grid">{rankedPicks.map((phone) => { const matchCount = phone.categories.filter((category) => preferences.categories.includes(category)).length; return <article className="phone-card" key={phone.name}><div className={`phone-art ${phone.tone}`}><span className="phone-tag">{matchCount ? `Matches ${matchCount} of your priorities` : phone.tag}</span><div className="phone-render"><i /><i /><i /></div><button className="heart-button" aria-label={`Save ${phone.name}`}>♡</button></div><div className="phone-info"><div className="phone-brandline"><span>{phone.brand}</span><span>★ {phone.rating}</span></div><h3>{phone.name}</h3><div className="phone-specs">{phone.specs.map((spec) => <span key={spec}>{spec}</span>)}</div><div className="phone-card-bottom"><b>{phone.price}</b><a href="/compare" aria-label={`Compare ${phone.name}`}>Compare <span>↗</span></a></div></div></article>; })}</div><p className="dataset-note">Example recommendations shown for the UI preview. Your saved priorities rank the available phones here; the supplied CSV will replace these samples.</p></>}</section>
    <section className="home-cta"><div><span className="eyebrow">YOUR NEEDS, YOUR SHORTLIST</span><h2>Know what you’re looking for?</h2><p>Fine-tune your search and get recommendations that feel personal.</p></div><a className="button-primary" href="/search">Open advanced search <span>↗</span></a></section>
  </main>;
}
