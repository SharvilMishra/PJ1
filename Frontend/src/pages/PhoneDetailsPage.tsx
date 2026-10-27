import { Link, useLocation, useParams } from "react-router-dom";
import { usePhoneActions } from "../auth/PhoneActionsProvider";
import { formatPrice, formatProcessor, formatRating, phoneById } from "../data/catalog";

const categoryLabels: Record<string, string> = { gaming: "Gaming", battery: "Battery", camera: "Camera", budget: "Best value", flagship: "Premium" };

export function PhoneDetailsPage() {
  const { id = "" } = useParams();
  const location = useLocation();
  const backTo = (location.state as { from?: string } | null)?.from || "/search";
  const phone = phoneById.get(id);
  const { savedIds, compareIds, toggleSaved, toggleCompare } = usePhoneActions();
  if (!phone) return <main className="page-wrap"><div className="empty-saved-state"><h1>Phone not found</h1><p>This device isn’t in the current catalog.</p><Link className="button-primary" to="/search">Search phones <span>↗</span></Link></div></main>;

  const saved = savedIds.includes(phone.id);
  const compared = compareIds.includes(phone.id);
  const specs = [
    ["Catalog price", formatPrice(phone.price)], ["Rating", phone.rating === null ? "Not rated" : `${formatRating(phone.rating)} / 5`],
    ["RAM", phone.ramGb === null ? "Not listed" : `${phone.ramGb} GB`], ["Storage", phone.storageGb === null ? "Not listed" : `${phone.storageGb} GB`],
    ["Battery", phone.batteryMah === null ? "Not listed" : `${phone.batteryMah.toLocaleString()} mAh`], ["Main camera", phone.cameraMainMp === null ? "Not listed" : `${phone.cameraMainMp} MP`],
    ["Display", [phone.displaySizeIn === null ? null : `${phone.displaySizeIn}″`, phone.displayType].filter(Boolean).join(" · ") || "Not listed"],
    ["Processor", formatProcessor(phone.processor)], ["Weight", phone.weightG === null ? "Not listed" : `${phone.weightG} g`], ["Operating system", phone.os || "Not listed"],
  ];

  return <main className="page-wrap phone-details-page">
    <Link className="phone-details-back" to={backTo}>← Back</Link>
    <section className="phone-details-hero"><div className={`phone-details-art ${["rose", "sand", "lavender"][Math.abs(phone.name.length) % 3]}`}>
      <img src={phone.imageUrl || `${import.meta.env.BASE_URL}assets/login-phone-cutout.png`} alt={phone.imageUrl ? phone.name : "Illustrative crimson smartphone; product-specific image is not in the catalog"} />
      {!phone.imageUrl && <small>Illustrative device image</small>}
    </div><div className="phone-details-intro"><span className="eyebrow">{phone.brand.toUpperCase()} · DEVICE DETAILS</span><h1>{phone.model}</h1><p className="phone-details-name">{phone.name}</p><div className="phone-details-rating">★ {formatRating(phone.rating)} <span>catalog rating</span></div><div className="phone-details-categories">{phone.categories.map((category) => <span key={category}>{categoryLabels[category] || category}</span>)}</div><div className="phone-details-actions"><b>{formatPrice(phone.price)}</b><button className="outline-button" type="button" aria-pressed={saved} onClick={() => toggleSaved(phone.id)}>{saved ? "♥ Saved" : "♡ Save phone"}</button><button className="button-primary" type="button" aria-pressed={compared} onClick={() => toggleCompare(phone.id)}>{compared ? "✓ Added to compare" : "＋ Compare phone"}</button></div></div></section>
    <section className="phone-spec-detail"><div><span className="eyebrow">THE FULL PICTURE</span><h2>Specifications</h2></div><dl>{specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
    <p className="dataset-note">Catalog source: the supplied SIC mobile specification workbook. These details have not been independently verified; price currency and suspected measurement units are unconfirmed. Category labels are inferred from catalog thresholds. Check current specifications and price with the manufacturer or seller before buying.</p>
  </main>;
}
