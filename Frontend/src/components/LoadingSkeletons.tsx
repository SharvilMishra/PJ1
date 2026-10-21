export function PhoneCardsSkeleton({ count = 3 }: { count?: number }) {
  return <div className="phone-grid" aria-label="Loading phones" role="status">
    {Array.from({ length: count }, (_, index) => <article className="phone-card skeleton-card" key={index} aria-hidden="true">
      <div className="skeleton-block skeleton-phone-art"><span className="skeleton-phone" /></div>
      <div className="phone-info"><div className="skeleton-block skeleton-line short" /><div className="skeleton-block skeleton-line title" /><div className="skeleton-block skeleton-line specs" /><div className="skeleton-block skeleton-line price" /></div>
    </article>)}
  </div>;
}

export function PreferenceRowsSkeleton({ count = 5 }: { count?: number }) {
  return <div className="toggle-list" aria-label="Loading saved preferences" role="status">
    {Array.from({ length: count }, (_, index) => <div className="toggle-row skeleton-toggle-row" key={index} aria-hidden="true">
      <div><span className="skeleton-block skeleton-line title" /><span className="skeleton-block skeleton-line description" /></div>
      <span className="skeleton-block skeleton-toggle" />
    </div>)}
  </div>;
}

export function AppPageSkeleton() {
  return <div className="app-page-skeleton" role="status" aria-label="Loading ELYVEX">
    <div className="skeleton-header"><span className="skeleton-block skeleton-logo" /><span className="skeleton-block skeleton-nav" /><span className="skeleton-block skeleton-action" /></div>
    <main className="page-wrap"><span className="skeleton-block skeleton-line short" /><span className="skeleton-block skeleton-page-title" /><span className="skeleton-block skeleton-page-lead" /><div className="skeleton-block skeleton-hero" /><div className="skeleton-grid">{Array.from({ length: 3 }, (_, index) => <span className="skeleton-block skeleton-tile" key={index} />)}</div></main>
  </div>;
}
