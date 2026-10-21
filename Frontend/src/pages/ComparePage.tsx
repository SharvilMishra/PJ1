import { Link } from "react-router-dom";
import { usePhoneActions } from "../auth/PhoneActionsProvider";
import { useUserPreferences } from "../auth/UserPreferencesProvider";
import { formatPrice, formatProcessor, formatRating, phoneById, phones, recommendationScore } from "../data/catalog";
import type { Phone } from "../types/phone";

type Row = { label: string; left: string; right: string; winner?: "left" | "right" };

function value(value: number | string | null | undefined, suffix = "") {
  return value === null || value === undefined || value === "" ? "Not listed" : `${value}${suffix}`;
}

function rowsFor(left: Phone, right: Phone): Row[] {
  const numericRows = [
    { label: "Price (catalog units)", left: left.price, right: right.price, suffix: "", lower: true },
    { label: "Rating", left: left.rating, right: right.rating, suffix: " / 5", lower: false },
    { label: "RAM", left: left.ramGb, right: right.ramGb, suffix: " GB", lower: false },
    { label: "Storage", left: left.storageGb, right: right.storageGb, suffix: " GB", lower: false },
    { label: "Battery", left: left.batteryMah, right: right.batteryMah, suffix: " mAh", lower: false },
    { label: "Main camera", left: left.cameraMainMp, right: right.cameraMainMp, suffix: " MP", lower: false },
    { label: "Display size", left: left.displaySizeIn, right: right.displaySizeIn, suffix: "″", lower: false },
    { label: "Weight", left: left.weightG, right: right.weightG, suffix: " g", lower: true },
  ];
  const rows: Row[] = numericRows.map((row) => ({
    label: row.label,
    left: row.label.startsWith("Price") ? formatPrice(row.left) : value(row.left, row.suffix),
    right: row.label.startsWith("Price") ? formatPrice(row.right) : value(row.right, row.suffix),
    winner: row.left === null || row.right === null || row.left === row.right ? undefined : ((row.lower ? row.left < row.right : row.left > row.right) ? "left" : "right"),
  }));
  rows.push(
    { label: "Display type", left: value(left.displayType), right: value(right.displayType) },
    { label: "Processor", left: formatProcessor(left.processor), right: formatProcessor(right.processor) },
  );
  return rows;
}

export function ComparePage() {
  const { compareIds, setCompareIds } = usePhoneActions();
  const { preferences } = useUserPreferences();
  const left = compareIds[0] ? phoneById.get(compareIds[0]) : undefined;
  const right = compareIds[1] ? phoneById.get(compareIds[1]) : undefined;

  function updateSlot(slot: 0 | 1, id: string) {
    const next = [...compareIds];
    if (!id) next.splice(slot, 1);
    else next[slot] = id;
    setCompareIds(next.filter(Boolean));
  }

  const leftScore = left ? recommendationScore(left, preferences.categories) : 0;
  const rightScore = right ? recommendationScore(right, preferences.categories) : 0;
  const bestFit = left && right
    ? (preferences.categories.length && leftScore !== rightScore ? (leftScore > rightScore ? left : right)
      : (left.rating ?? 0) !== (right.rating ?? 0) ? ((left.rating ?? 0) > (right.rating ?? 0) ? left : right)
        : (left.price ?? Infinity) <= (right.price ?? Infinity) ? left : right)
    : undefined;
  const fitReason = preferences.categories.length
    ? `${bestFit?.name} has the stronger ${Math.round(Math.max(leftScore, rightScore))}% preference score across your selected priorities.`
    : `${bestFit?.name} ranks first by rating${left?.rating === right?.rating ? " and catalog price" : ""}. Set priorities in Settings to personalize this result.`;

  return <main className="page-wrap compare-page"><div className="page-heading"><span className="eyebrow">THE DETAILS, SIDE BY SIDE</span><h1>Compare your picks.</h1><p className="lead">Choose two phones from the supplied catalog to compare their recorded specifications.</p></div>
    <div className="compare-topline"><div><span className="compare-count">YOUR COMPARISON</span><h2>{compareIds.length} of 2 phones selected</h2></div><Link className="outline-button" to="/search">＋ Search phone</Link></div>
    <div className="compare-products">{([left, right] as const).map((phone, slot) => <article className="compare-product" key={slot}><div className={`compare-device ${slot === 0 ? "rose" : "sand"}`}><i /><i /><i /></div>{phone && <button className="remove-compare" aria-label={`Remove ${phone.name}`} onClick={() => updateSlot(slot as 0 | 1, "")}>×</button>}<span className="compare-brand">{phone?.brand || `PHONE ${slot + 1}`}</span><h3>{phone?.model || "Choose a phone"}</h3>{phone && <b className="compare-product-price">{formatPrice(phone.price)}</b>}<div className="compare-select"><label htmlFor={`phone-${slot}`}>SELECT FROM CATALOG</label><select id={`phone-${slot}`} value={phone?.id || ""} onChange={(event) => updateSlot(slot as 0 | 1, event.target.value)}><option value="">Choose a phone…</option>{phones.map((item) => <option key={item.id} value={item.id} disabled={item.id === (slot === 0 ? right?.id : left?.id)}>{item.name}</option>)}</select></div></article>)}</div>
    {left && right ? <><section className="fit-summary"><div className="fit-icon">✦</div><div><span className="eyebrow">BEST SUITED FROM YOUR SELECTIONS</span><h2>{bestFit?.name}</h2><p>{fitReason}</p></div><div className="fit-score"><b>{preferences.categories.length ? `${Math.round(bestFit === left ? leftScore : rightScore)}%` : formatRating(bestFit?.rating ?? null)}</b><span>{preferences.categories.length ? "preference score" : "top rated"}</span></div></section><section className="spec-table"><div className="spec-table-heading"><div><span className="eyebrow">THE FULL PICTURE</span><h2>Compare specifications</h2></div></div><div className="spec-header"><span>SPECIFICATION</span><span>{left.name}</span><span>{right.name}</span></div>{rowsFor(left, right).map((row) => { const advantage = row.label.startsWith("Price") ? "Lower price" : row.label === "Weight" ? "Lower weight" : `Higher ${row.label.toLowerCase()}`; return <div className="spec-row" key={row.label}><b>{row.label}</b><span className={row.winner === "left" ? "spec-winner" : ""}>{row.left}{row.winner === "left" && <i>{advantage}</i>}</span><span className={row.winner === "right" ? "spec-winner" : ""}>{row.right}{row.winner === "right" && <i>{advantage}</i>}</span></div>; })}</section><p className="dataset-note">Price currency and some measurement units are not specified in the source workbook. Numeric price comparison uses the dataset values as provided.</p></> : <div className="empty-saved-state"><h3>Select two phones to compare</h3><p>Your selections are saved on this device while you browse.</p><Link className="button-primary" to="/search">Browse catalog <span>↗</span></Link></div>}
  </main>;
}
