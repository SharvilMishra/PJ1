import { useEffect, useState } from "react";

const updateVersion = "welcome-elyvex-v1";

export function LatestUpdatesDialog({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      setOpen(localStorage.getItem(`elyvex-update:${userId}`) !== updateVersion);
    } catch {
      setOpen(true);
    }
  }, [userId]);

  function dismiss() {
    try { localStorage.setItem(`elyvex-update:${userId}`, updateVersion); } catch { /* Keep dismissing for this visit if storage is unavailable. */ }
    setOpen(false);
  }

  if (!open) return null;

  return <div className="updates-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
    <section className="updates-dialog" role="dialog" aria-modal="true" aria-labelledby="updates-title">
      <button className="updates-close" onClick={dismiss} aria-label="Dismiss updates">×</button>
      <div className="updates-art"><span>EX</span><i /><i /><i /></div>
      <div className="updates-body"><span className="eyebrow">THE LATEST FROM ELYVEX</span><h2 id="updates-title">Better choices begin here.</h2><p>Welcome to ELYVEX. Browse phones as a guest, explore what matters to you, and compare two picks side by side.</p><ul><li><span>✦</span> Search by budget, camera, battery, and more</li><li><span>⇄</span> Compare two phones in one clear view</li><li><span>♡</span> Sign in to receive occasional product updates</li></ul><button className="button-primary" onClick={dismiss}>Sounds good <span>↗</span></button><small>We’ll only show this announcement once on this browser.</small></div>
    </section>
  </div>;
}
