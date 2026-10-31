import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

function isInstalled() {
  return window.matchMedia("(display-mode: standalone)").matches
    || ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
}

export function InstallAppAction({ onDone }: { onDone: () => void }) {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    setInstalled(isInstalled());
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => { setInstalled(true); setInstallPrompt(null); setShowHelp(false); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function install() {
    if (!installPrompt) { setShowHelp(true); return; }
    onDone();
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  }

  if (installed) return null;

  return <>
    <button type="button" className="menu-signout install-app-action" onClick={() => void install()}><span>⬇</span>Install app</button>
    {showHelp && <div className="install-help-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowHelp(false); }}>
      <section className="install-help" role="dialog" aria-modal="true" aria-labelledby="install-help-title">
        <button className="install-help-close" type="button" aria-label="Close install instructions" onClick={() => setShowHelp(false)}>×</button>
        <span className="recommendation-gate-icon">⬇</span>
        <span className="eyebrow">TAKE ELYVEX WITH YOU</span>
        <h2 id="install-help-title">Add ELYVEX to your home screen</h2>
        <p>{isIos
          ? "In Safari, tap Share, then choose Add to Home Screen and tap Add."
          : "Open your browser menu and choose Install app or Add to Home screen. The option appears when this site meets your browser’s install requirements."}</p>
        <button className="button-primary" type="button" onClick={() => setShowHelp(false)}>Got it</button>
      </section>
    </div>}
  </>;
}
