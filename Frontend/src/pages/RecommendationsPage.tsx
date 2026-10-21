import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { usePhoneActions } from "../auth/PhoneActionsProvider";
import { recommendationPersonas, useUserPreferences, type RecommendationPersona } from "../auth/UserPreferencesProvider";
import { formatPrice, formatProcessor, personaLabels, personaRecommendationScore, personaScoreBreakdown, personaWeights, phones, phoneSpecs } from "../data/catalog";
import { PhoneCardsSkeleton } from "../components/LoadingSkeletons";

export function RecommendationsPage() {
  const { user } = useAuth();
  const { preferences, loading, saving, error, savePreferences } = useUserPreferences();
  const { savedIds, compareIds, toggleSaved, toggleCompare } = usePhoneActions();
  const [persona, setPersona] = useState<RecommendationPersona>("student");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [appliedPersona, setAppliedPersona] = useState<RecommendationPersona>("student");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(2000);
  const [message, setMessage] = useState("");
  const needsSetup = !preferences.persona;

  useEffect(() => {
    if (!loading) {
      setPersona(preferences.persona || "student");
      setMaxPrice(preferences.maxPrice);
      setAppliedPersona(preferences.persona || "student");
      setAppliedMaxPrice(preferences.maxPrice);
    }
  }, [loading, preferences.persona, preferences.maxPrice]);

  const ranked = useMemo(() => [...phones]
    .filter((phone) => phone.price !== null && phone.price <= appliedMaxPrice)
    .sort((a, b) => personaRecommendationScore(b, appliedPersona) - personaRecommendationScore(a, appliedPersona)
      || (b.rating ?? 0) - (a.rating ?? 0) || (a.price ?? Infinity) - (b.price ?? Infinity))
    .slice(0, 5), [appliedPersona, appliedMaxPrice]);

  async function runRecommender() {
    setMessage("");
    try {
      await savePreferences({ ...preferences, persona, maxPrice });
      setAppliedPersona(persona);
      setAppliedMaxPrice(maxPrice);
      setMessage("Your profile is saved. These are your five best matches.");
    } catch {
      setMessage("Could not save your profile. Please check your connection and try again.");
    }
  }

  const setupControls = <div className="persona-controls">
    <label htmlFor="recommendation-persona">Persona<select id="recommendation-persona" value={persona} onChange={(event) => setPersona(event.target.value as RecommendationPersona)}>{recommendationPersonas.map((item) => <option value={item} key={item}>{personaLabels[item]}</option>)}</select></label>
    <label htmlFor="recommendation-budget">Maximum price <b>{maxPrice.toLocaleString("en-US")}</b><input id="recommendation-budget" type="range" min="0" max="2000" step="25" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))}/><span className="persona-budget-ends"><span>0</span><span>2,000</span></span></label>
    {user && <button type="button" className="button-primary" onClick={() => void runRecommender()} disabled={saving}>{saving ? "Saving…" : "Run recommender"}<span>↗</span></button>}
  </div>;

  return <main className="page-wrap recommendations-page">
    <header className="page-heading"><span className="eyebrow">A SHORTLIST BUILT AROUND YOU</span><h1>What we recommend.</h1><p className="lead">Choose a persona and budget. We’ll rank the top five phones using weighted catalog specifications.</p></header>
    {loading ? <PhoneCardsSkeleton /> : error && needsSetup ? <div className="empty-saved-state"><h3>We couldn’t load your saved profile</h3><p>{error}</p><Link className="button-primary" to="/settings">Open settings <span>↗</span></Link></div> : needsSetup ? <div className="recommendation-gate-backdrop"><section className="recommendation-gate recommendation-setup-gate" role="dialog" aria-modal="true" aria-labelledby="recommendation-gate-title"><span className="recommendation-gate-icon">✦</span><span className="eyebrow">PERSONALIZE YOUR RESULTS</span><h2 id="recommendation-gate-title">Set up your recommender</h2><p>{user ? "Choose a persona and price limit to calculate your first shortlist. Your settings will be saved to your account." : "Sign in to choose a persona and save your recommendation profile for future visits."}</p>{user ? setupControls : <Link className="button-primary" to="/signin" state={{ returnTo: "/recommendations" }}>Sign in to set up <span>↗</span></Link>}{message && <p className="settings-error" role="status">{message}</p>}<Link className="recommendation-secondary" to="/">Back to Discover</Link></section></div> : <>
      <section className="recommendation-method"><div><span className="eyebrow">YOUR RECOMMENDATION PROFILE</span><div className="recommendation-priorities"><span>{personaLabels[appliedPersona]}</span><span>Up to {formatPrice(appliedMaxPrice)}</span></div></div><Link className="text-link" to="/settings#recommendations">Preferences ↗</Link><p>Phones over your budget are excluded. The remaining phones are scored as a weighted sum of the persona’s priorities. Each specification is normalized against the catalog; missing specifications contribute zero and are flagged in each score breakdown.</p></section>
      <section className="recommendation-run-panel"><div><span className="eyebrow">TUNE YOUR SHORTLIST</span><p>Switch personas to change which specifications matter most. The price limit can be set up to 2,000.</p></div>{setupControls}</section>
      {message && <p className="settings-status" role="status">{message}</p>}
      <section className="recommendation-results"><div className="section-heading"><div><span className="eyebrow">RANKED FROM YOUR CATALOG</span><h2>Top five for {personaLabels[appliedPersona]}</h2></div><span className="recommendation-count">{ranked.length} phones within budget</span></div><div className="recommendation-list">{ranked.map((phone, index) => { const score = Math.round(personaRecommendationScore(phone, appliedPersona)); const breakdown = personaScoreBreakdown(phone, appliedPersona); const selected = compareIds.includes(phone.id); const detailState = { from: "/recommendations" }; return <article className="recommendation-card" key={phone.id}><span className="recommendation-rank">{String(index + 1).padStart(2, "0")}</span><Link to={`/phone/${phone.id}`} state={detailState} className={`recommendation-phone-art ${["rose", "sand", "lavender"][index % 3]}`} aria-label={`View details for ${phone.name}`}><div className="phone-render"><i /><i /><i /></div></Link><div className="recommendation-details"><span className="result-brand">{phone.brand}</span><h3><Link to={`/phone/${phone.id}`} state={detailState}>{phone.model}</Link></h3><p>{formatProcessor(phone.processor)}</p><div className="result-specs">{phoneSpecs(phone).map((spec) => <span key={spec}>{spec}</span>)}</div><details className="score-breakdown"><summary>Score contribution by priority</summary><ul>{breakdown.map((item) => <li key={item.metric}><span><b>{item.label} · {item.weight}%</b><small>{item.value === null ? "Spec missing · 0 contribution" : `${item.value} · ${Math.round((item.normalized || 0) * 100)}% catalog score`}</small></span><strong>+{Math.round(item.contribution)}<i> pts</i></strong></li>)}</ul><p>Weighted contributions add up to the match score. Missing specs are not estimated.</p></details></div><div className="recommendation-score"><b>{score}%</b><span>match</span><div><i style={{ width: `${score}%` }} /></div><strong>{formatPrice(phone.price)}</strong><div className="recommendation-actions"><button type="button" onClick={() => toggleSaved(phone.id)}>{savedIds.includes(phone.id) ? "♥ Saved" : "♡ Save"}</button><button type="button" aria-pressed={selected} onClick={() => toggleCompare(phone.id)}>{selected ? "✓ Compare" : "+ Compare"}</button></div></div></article>; })}</div>{!ranked.length && <div className="empty-saved-state"><h3>No catalog phones are within that price limit</h3><p>Raise the slider to see phones up to 2,000.</p></div>}<p className="dataset-note">Prices use the source catalog values; currency is not specified. Phones without a listed price are not included in a budget-filtered ranking.</p></section>
    </>}
  </main>;
}
