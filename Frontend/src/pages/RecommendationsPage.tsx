import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { usePhoneActions } from "../auth/PhoneActionsProvider";
import { recommendationPersonas, useUserPreferences, type RecommendationPersona } from "../auth/UserPreferencesProvider";
import { formatPrice, formatProcessor, personaLabels, phones, phoneSpecs } from "../data/catalog";
import { DEFAULT_HYBRID_WEIGHTS, rankHybridRecommendations } from "../data/recommendationEngine";
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

  const ranked = useMemo(() => rankHybridRecommendations(phones, appliedPersona, preferences.categories, appliedMaxPrice)
    .slice(0, 5), [appliedPersona, appliedMaxPrice, preferences.categories]);

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
      <section className="recommendation-method"><div><span className="eyebrow">YOUR RECOMMENDATION PROFILE</span><div className="recommendation-priorities"><span>{personaLabels[appliedPersona]}</span><span>Up to {formatPrice(appliedMaxPrice)}</span>{preferences.categories.map((category) => <span key={category}>{category}</span>)}</div></div><Link className="text-link" to="/settings#recommendations">Preferences ↗</Link><p>Phones over your budget are excluded. The score combines a weighted sum (WSM), TOPSIS closeness, and cosine preference match. Default blend: {Math.round(DEFAULT_HYBRID_WEIGHTS.wsm * 100)}% WSM, {Math.round(DEFAULT_HYBRID_WEIGHTS.topsis * 100)}% TOPSIS, and {Math.round(DEFAULT_HYBRID_WEIGHTS.similarity * 100)}% cosine. Saved priority toggles increase the matching persona weights. Each component and criterion contribution is shown below; unavailable specifications are flagged and score zero.</p></section>
      <section className="recommendation-run-panel"><div><span className="eyebrow">TUNE YOUR SHORTLIST</span><p>Switch personas to change which specifications matter most. The price limit can be set up to 2,000.</p></div>{setupControls}</section>
      {message && <p className="settings-status" role="status">{message}</p>}
      <section className="recommendation-results"><div className="section-heading"><div><span className="eyebrow">RANKED FROM YOUR CATALOG</span><h2>Top five for {personaLabels[appliedPersona]}</h2></div><span className="recommendation-count">{ranked.length} phones within budget</span></div><div className="recommendation-list">{ranked.map((result, index) => { const { phone } = result; const score = Math.round(result.score); const selected = compareIds.includes(phone.id); const detailState = { from: "/recommendations" }; return <article className="recommendation-card" key={phone.id}><span className="recommendation-rank">{String(result.rank).padStart(2, "0")}</span><Link to={`/phone/${phone.id}`} state={detailState} className={`recommendation-phone-art ${["rose", "sand", "lavender"][index % 3]}`} aria-label={`View details for ${phone.name}`}><div className="phone-render"><i /><i /><i /></div></Link><div className="recommendation-details"><span className="result-brand">{phone.brand}</span><h3><Link to={`/phone/${phone.id}`} state={detailState}>{phone.model}</Link></h3><p>{formatProcessor(phone.processor)}</p><div className="result-specs">{phoneSpecs(phone).map((spec) => <span key={spec}>{spec}</span>)}</div><details className="score-breakdown"><summary>How this {score}% match was calculated</summary><div className="hybrid-components"><span>WSM <b>{Math.round(result.wsmScore * 100)}%</b></span><span>TOPSIS <b>{Math.round(result.topsisScore * 100)}%</b></span><span>Cosine <b>{Math.round(result.similarityScore * 100)}%</b></span></div><ul>{result.criteria.map((item) => <li key={item.metric}><span><b>{item.label} · {Math.round(item.weight)}% weight</b><small>{item.missing ? "Spec not listed · 0 contribution" : `${item.value} · ${Math.round((item.normalized ?? 0) * 100)}% normalized`}</small></span><strong>+{item.missing ? 0 : item.contribution.toFixed(1)}<i> WSM pts</i></strong></li>)}</ul><p>Final score blends all three components using the weights shown above. Missing values are not estimated.</p></details></div><div className="recommendation-score"><b>{score}%</b><span>suitability</span><div><i style={{ width: `${score}%` }} /></div><strong>{formatPrice(phone.price)}</strong><div className="recommendation-actions"><button type="button" onClick={() => toggleSaved(phone.id)}>{savedIds.includes(phone.id) ? "♥ Saved" : "♡ Save"}</button><button type="button" aria-pressed={selected} onClick={() => toggleCompare(phone.id)}>{selected ? "✓ Compare" : "+ Compare"}</button></div></div></article>; })}</div>{!ranked.length && <div className="empty-saved-state"><h3>No catalog phones are within that price limit</h3><p>Raise the slider to see phones up to 2,000.</p></div>}<p className="dataset-note">Source: supplied SIC mobile specification workbook. WSM and cosine use min-max normalized catalog values; TOPSIS compares each eligible phone to the best and worst observed values. Identical available values are neutral, missing fields score zero, and phones without catalog prices are excluded by the budget. The dataset has no GPU, refresh-rate, or video capability fields; processor values are model names without benchmark scores, and display type is categorical, so the engine cannot rank those aspects reliably. Catalog values and currency are not independently verified; confirm details with the seller.</p></section>
    </>}
  </main>;
}
