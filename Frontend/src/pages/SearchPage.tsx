import { useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { usePhoneActions } from "../auth/PhoneActionsProvider";
import { catalogBrands, catalogPriceBounds, formatPrice, formatProcessor, formatRating, phones, phoneSpecs } from "../data/catalog";
import type { Phone } from "../types/phone";

const categories = ["All phones", "Camera", "Gaming", "Battery", "Budget", "Premium"] as const;
const categoryIds: Record<string, string> = { Camera: "camera", Gaming: "gaming", Battery: "battery", Budget: "budget", Premium: "flagship" };
const minCatalogPrice = Number.isFinite(catalogPriceBounds.min) ? catalogPriceBounds.min : 0;
const maxCatalogPrice = Number.isFinite(catalogPriceBounds.max) ? catalogPriceBounds.max : 2000;
const displayTypes = [...new Set(phones.map((phone) => phone.displayType).filter((type): type is string => Boolean(type)))].sort();
const weightBounds = phones.reduce((bounds, phone) => phone.weightG === null ? bounds : { min: Math.min(bounds.min, phone.weightG), max: Math.max(bounds.max, phone.weightG) }, { min: Infinity, max: -Infinity });

function FilterGroup({ title, children }: { title: string; children: ReactNode }) { return <section className="filter-group"><h3>{title}</h3>{children}</section>; }
function ActiveFilter({ label, onRemove }: { label: string; onRemove: () => void }) { return <button type="button" className="filter-pill" onClick={onRemove} aria-label={`Remove ${label} filter`}>{label}<span aria-hidden="true">×</span></button>; }

function meetsThreshold(value: number | null, threshold: number) { return value !== null && value >= threshold; }

export function SearchPage() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const initialCategory = params.get("category") || "";
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedDisplays, setSelectedDisplays] = useState<string[]>([]);
  const [priceFloor, setPriceFloor] = useState(minCatalogPrice);
  const [priceCap, setPriceCap] = useState(maxCatalogPrice);
  const [minDisplaySize, setMinDisplaySize] = useState(0);
  const [maxWeight, setMaxWeight] = useState(weightBounds.max);
  const [minRating, setMinRating] = useState(0);
  const [activeCategory, setActiveCategory] = useState(() => categories.find((item) => categoryIds[item] === initialCategory) || "All phones");
  const [minRam, setMinRam] = useState(0);
  const [minStorage, setMinStorage] = useState(0);
  const [minBattery, setMinBattery] = useState(0);
  const [minCamera, setMinCamera] = useState(0);
  const [sort, setSort] = useState("match");
  const [visibleCount, setVisibleCount] = useState(24);
  const [compareMessage, setCompareMessage] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { savedIds, compareIds, toggleSaved, toggleCompare } = usePhoneActions();
  const query = (params.get("q") || "").trim().toLocaleLowerCase();

  const filteredPhones = useMemo(() => {
    const categoryId = categoryIds[activeCategory];
    const found = phones.filter((phone) => {
      const text = `${phone.name} ${phone.brand} ${phone.model} ${phone.processor || ""}`.toLocaleLowerCase();
      return (!query || text.includes(query))
        && (activeCategory === "All phones" || Boolean(categoryId && phone.categories.includes(categoryId as Phone["categories"][number])))
        && (phone.price !== null && phone.price >= priceFloor && phone.price <= priceCap)
        && (!selectedBrands.length || selectedBrands.includes(phone.brand))
        && (!selectedDisplays.length || (phone.displayType !== null && selectedDisplays.includes(phone.displayType)))
        && (!minRam || meetsThreshold(phone.ramGb, minRam))
        && (!minStorage || meetsThreshold(phone.storageGb, minStorage))
        && (!minBattery || meetsThreshold(phone.batteryMah, minBattery))
        && (!minCamera || meetsThreshold(phone.cameraMainMp, minCamera))
        && (!minDisplaySize || meetsThreshold(phone.displaySizeIn, minDisplaySize))
        && (phone.weightG !== null && phone.weightG <= maxWeight)
        && (!minRating || meetsThreshold(phone.rating, minRating));
    });
    return found.sort((left, right) => {
      if (sort === "price-asc") return (left.price ?? Infinity) - (right.price ?? Infinity);
      if (sort === "price-desc") return (right.price ?? -Infinity) - (left.price ?? -Infinity);
      if (sort === "rating") return (right.rating ?? 0) - (left.rating ?? 0);
      return (right.rating ?? 0) - (left.rating ?? 0) || (left.price ?? Infinity) - (right.price ?? Infinity);
    });
  }, [activeCategory, maxWeight, minBattery, minCamera, minDisplaySize, minRam, minRating, minStorage, priceCap, priceFloor, query, selectedBrands, selectedDisplays, sort]);

  function toggleBrand(brand: string) { setSelectedBrands((current) => current.includes(brand) ? current.filter((value) => value !== brand) : [...current, brand]); setVisibleCount(24); }
  function chooseCategory(item: typeof categories[number]) {
    const nextCategory = activeCategory === item && item !== "All phones" ? "All phones" : item;
    setActiveCategory(nextCategory);
    setParams((current) => { const next = new URLSearchParams(current); if (nextCategory === "All phones") next.delete("category"); else next.set("category", categoryIds[nextCategory]); return next; });
    setVisibleCount(24);
  }
  function clear() { setParams({}); setSelectedBrands([]); setSelectedDisplays([]); setPriceFloor(minCatalogPrice); setPriceCap(maxCatalogPrice); setActiveCategory("All phones"); setMinRam(0); setMinStorage(0); setMinBattery(0); setMinCamera(0); setMinDisplaySize(0); setMaxWeight(weightBounds.max); setMinRating(0); setVisibleCount(24); }
  function addToCompare(id: string) {
    const success = toggleCompare(id);
    setCompareMessage(success ? "Comparison selection updated." : "Two phones are already selected. Remove one before adding another.");
  }
  const hasFilters = activeCategory !== "All phones" || selectedBrands.length > 0 || selectedDisplays.length > 0 || priceFloor > minCatalogPrice || priceCap < maxCatalogPrice || minRam > 0 || minStorage > 0 || minBattery > 0 || minCamera > 0 || minDisplaySize > 0 || maxWeight < weightBounds.max || minRating > 0 || Boolean(query);
  const activeFilterCount = [activeCategory !== "All phones", priceFloor > minCatalogPrice || priceCap < maxCatalogPrice, minRam > 0, minStorage > 0, minBattery > 0, minCamera > 0, minDisplaySize > 0, maxWeight < weightBounds.max, minRating > 0, Boolean(query)].filter(Boolean).length + selectedBrands.length + selectedDisplays.length;

  return <main className="page-wrap search-page"><div className="page-heading search-heading"><div><span className="eyebrow">MADE FOR YOUR MUST-HAVES</span><h1>Search phones</h1><p className="lead">Search and filter all {phones.length} phones from the supplied catalog.</p></div>{compareIds.length > 0 && <Link className="saved-filter-button" to="/compare">⇄ Compare {compareIds.length}/2</Link>}</div><button type="button" className="mobile-filter-trigger" aria-expanded={mobileFiltersOpen} aria-controls="phone-filters" onClick={() => setMobileFiltersOpen(true)}><span>☷ Filters{activeFilterCount ? ` · ${activeFilterCount} applied` : ""}</span><span>Open filters ↓</span></button>{mobileFiltersOpen && <button type="button" className="mobile-filter-scrim" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)} />}<div className="search-layout"><aside id="phone-filters" className={`filters-panel${mobileFiltersOpen ? " mobile-open" : ""}`} role={mobileFiltersOpen ? "dialog" : undefined} aria-modal={mobileFiltersOpen || undefined} aria-label="Phone filters"><div className="filters-title"><div><h2>Filters</h2><span>{activeFilterCount ? `${activeFilterCount} filters applied` : "Make it yours"}</span></div><div className="filter-panel-actions"><button onClick={clear}>Clear all</button><button type="button" className="mobile-filter-close" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)}>×</button></div></div>
    <FilterGroup title="Category"><div className="filter-chips">{categories.map((item) => <button aria-pressed={activeCategory === item} onClick={() => chooseCategory(item)} className={activeCategory === item ? "selected" : ""} key={item}>{item}</button>)}</div></FilterGroup>
    <FilterGroup title="Catalog price range"><div className="range-labels"><span>{formatPrice(priceFloor)}</span><span>{formatPrice(priceCap)}</span></div><input className="range-input" type="range" min={minCatalogPrice} max={maxCatalogPrice} step="10" value={priceFloor} onChange={(event) => { setPriceFloor(Math.min(Number(event.target.value), priceCap)); setVisibleCount(24); }} aria-label="Minimum catalog price"/><input className="range-input" type="range" min={minCatalogPrice} max={maxCatalogPrice} step="10" value={priceCap} onChange={(event) => { setPriceCap(Math.max(Number(event.target.value), priceFloor)); setVisibleCount(24); }} aria-label="Maximum catalog price"/><div className="range-extremes"><span>Source price units</span><span>{formatPrice(maxCatalogPrice)}</span></div></FilterGroup>
    <FilterGroup title="Brand"><div className="check-list">{catalogBrands.map((brand) => <label key={brand}><input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} /><span className="custom-check" />{brand}<small>{phones.filter((phone) => phone.brand === brand).length}</small></label>)}</div></FilterGroup>
    <FilterGroup title="RAM"><div className="filter-chips compact">{[4, 6, 8, 12].map((size) => <button key={size} aria-pressed={minRam === size} className={minRam === size ? "selected" : ""} onClick={() => { setMinRam(minRam === size ? 0 : size); setVisibleCount(24); }}>{size} GB+</button>)}</div></FilterGroup>
    <FilterGroup title="Storage"><div className="filter-chips compact">{[128, 256, 512].map((size) => <button key={size} aria-pressed={minStorage === size} className={minStorage === size ? "selected" : ""} onClick={() => { setMinStorage(minStorage === size ? 0 : size); setVisibleCount(24); }}>{size} GB+</button>)}</div></FilterGroup>
    <FilterGroup title="Battery"><div className="filter-chips compact">{[4000, 5000, 6000].map((size) => <button key={size} aria-pressed={minBattery === size} className={minBattery === size ? "selected" : ""} onClick={() => { setMinBattery(minBattery === size ? 0 : size); setVisibleCount(24); }}>{size.toLocaleString()} mAh+</button>)}</div></FilterGroup>
    <FilterGroup title="Main camera"><div className="filter-chips compact">{[12, 24, 48, 100].map((size) => <button key={size} aria-pressed={minCamera === size} className={minCamera === size ? "selected" : ""} onClick={() => { setMinCamera(minCamera === size ? 0 : size); setVisibleCount(24); }}>{size} MP+</button>)}</div></FilterGroup>
    <FilterGroup title="Display type"><div className="filter-chips compact">{displayTypes.map((type) => <button key={type} aria-pressed={selectedDisplays.includes(type)} className={selectedDisplays.includes(type) ? "selected" : ""} onClick={() => { setSelectedDisplays((current) => current.includes(type) ? current.filter((item) => item !== type) : [...current, type]); setVisibleCount(24); }}>{type}</button>)}</div></FilterGroup>
    <FilterGroup title="Minimum display size"><div className="filter-chips compact">{[6, 6.5, 7].map((size) => <button key={size} aria-pressed={minDisplaySize === size} className={minDisplaySize === size ? "selected" : ""} onClick={() => { setMinDisplaySize(minDisplaySize === size ? 0 : size); setVisibleCount(24); }}>{size}″+</button>)}</div></FilterGroup>
    <FilterGroup title="Maximum weight"><div className="range-labels"><span>Any listed weight</span><span>{maxWeight} g</span></div><input className="range-input" type="range" min={weightBounds.min} max={weightBounds.max} step="1" value={maxWeight} onChange={(event) => { setMaxWeight(Number(event.target.value)); setVisibleCount(24); }} aria-label="Maximum phone weight"/></FilterGroup>
    <FilterGroup title="Minimum rating"><div className="filter-chips compact">{[3.5, 4, 4.5].map((rating) => <button key={rating} aria-pressed={minRating === rating} className={minRating === rating ? "selected" : ""} onClick={() => { setMinRating(minRating === rating ? 0 : rating); setVisibleCount(24); }}>{rating.toFixed(1)} ★+</button>)}</div></FilterGroup><div className="mobile-filter-footer"><span>{filteredPhones.length} phones match</span><button type="button" className="button-primary" onClick={() => setMobileFiltersOpen(false)}>Show results</button></div>
  </aside><section className="results-panel"><div className="results-toolbar"><div><span className="results-count">{filteredPhones.length} phones</span><span className="results-context">matching your filters</span></div><div className="sort-control"><label htmlFor="sort">Sort by</label><select id="sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="match">Top rated</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Rating</option></select><span>⌄</span></div></div>
    {hasFilters && <div className="active-filters">
      {activeCategory !== "All phones" && <ActiveFilter label={activeCategory} onRemove={() => chooseCategory(activeCategory)} />}
      {query && <ActiveFilter label={`Search: ${params.get("q")}`} onRemove={() => setParams((current) => { const next = new URLSearchParams(current); next.delete("q"); return next; })} />}
      {selectedBrands.map((brand) => <ActiveFilter key={brand} label={brand} onRemove={() => setSelectedBrands((current) => current.filter((item) => item !== brand))} />)}
      {selectedDisplays.map((type) => <ActiveFilter key={type} label={type} onRemove={() => setSelectedDisplays((current) => current.filter((item) => item !== type))} />)}
      {minRam > 0 && <ActiveFilter label={`RAM ${minRam} GB+`} onRemove={() => setMinRam(0)} />}
      {minStorage > 0 && <ActiveFilter label={`Storage ${minStorage} GB+`} onRemove={() => setMinStorage(0)} />}
      {minBattery > 0 && <ActiveFilter label={`Battery ${minBattery.toLocaleString()} mAh+`} onRemove={() => setMinBattery(0)} />}
      {minCamera > 0 && <ActiveFilter label={`Camera ${minCamera} MP+`} onRemove={() => setMinCamera(0)} />}
      {minDisplaySize > 0 && <ActiveFilter label={`Display ${minDisplaySize}″+`} onRemove={() => setMinDisplaySize(0)} />}
      {minRating > 0 && <ActiveFilter label={`Rating ${minRating} ★+`} onRemove={() => setMinRating(0)} />}
      {maxWeight < weightBounds.max && <ActiveFilter label={`Weight ≤ ${maxWeight} g`} onRemove={() => setMaxWeight(weightBounds.max)} />}
      {(priceFloor > minCatalogPrice || priceCap < maxCatalogPrice) && <ActiveFilter label={`Price ${formatPrice(priceFloor)}–${formatPrice(priceCap)}`} onRemove={() => { setPriceFloor(minCatalogPrice); setPriceCap(maxCatalogPrice); }} />}
      <button type="button" onClick={clear}>Clear filters</button>
    </div>}
    {compareMessage && <p className="settings-status" role="status">{compareMessage}</p>}
    <div className="results-list">{filteredPhones.slice(0, visibleCount).map((phone, index) => <article className="result-card" key={phone.id}><Link className={`result-phone ${["rose", "sand", "lavender"][index % 3]}`} to={`/phone/${phone.id}`} state={{ from: `${location.pathname}${location.search}` }} aria-label={`View details for ${phone.name}`}><span className="mini-device"><i /><i /><i /></span></Link><div className="result-details"><span className="result-brand">{phone.brand} <span>·</span> <em>{formatRating(phone.rating)} rating</em></span><h3><Link to={`/phone/${phone.id}`} state={{ from: `${location.pathname}${location.search}` }}>{phone.model}</Link></h3><div className="result-specs">{phoneSpecs(phone).map((spec) => <span key={spec}>{spec}</span>)}{phone.displaySizeIn !== null && <span>{phone.displaySizeIn}″ display</span>}{phone.processor && <span>{formatProcessor(phone.processor)}</span>}</div><div className="result-actions"><button className="text-action" aria-pressed={savedIds.includes(phone.id)} onClick={() => toggleSaved(phone.id)}>{savedIds.includes(phone.id) ? "♥ Saved" : "♡ Save"}</button><button className="text-action" aria-pressed={compareIds.includes(phone.id)} onClick={() => addToCompare(phone.id)}>{compareIds.includes(phone.id) ? "✓ Selected" : "＋ Compare"}</button></div></div><div className="result-price"><span>Catalog price</span><b>{formatPrice(phone.price)}</b><span className="result-catalog-rating">★ {formatRating(phone.rating)}</span></div></article>)}</div>
    {!filteredPhones.length && <div className="empty-saved-state"><h3>No phones match these filters</h3><p>Try a wider price range or clear some filters.</p><button className="button-primary" onClick={clear}>Clear filters</button></div>}
    {filteredPhones.length > visibleCount && <button className="outline-button" onClick={() => setVisibleCount((count) => count + 24)}>Show more phones ({filteredPhones.length - visibleCount} remaining)</button>}
    <p className="dataset-note">Showing normalized records from the supplied workbook. Prices use the source catalog’s numeric values; currency is not specified in the source.</p>
  </section></div></main>;
}
