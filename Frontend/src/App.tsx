import { useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthProvider";
import { signOutUser } from "./auth/authActions";
import { HomePage } from "./pages/HomePage";
import { ComparePage } from "./pages/ComparePage";
import { RecommendationsPage } from "./pages/RecommendationsPage";
import { PhoneDetailsPage } from "./pages/PhoneDetailsPage";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { SearchPage } from "./pages/SearchPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { AboutPage } from "./pages/AboutPage";
import { DeveloperContacts } from "./components/DeveloperContacts";
import { LatestUpdatesDialog } from "./components/LatestUpdatesDialog";
import { UserPreferencesProvider } from "./auth/UserPreferencesProvider";
import { PhoneActionsProvider } from "./auth/PhoneActionsProvider";
import { AppPageSkeleton } from "./components/LoadingSkeletons";

function HomeLoadingSplash() {
  return <div className="home-loading-splash" role="status" aria-label="Loading ELYVEX">
    <span>BETTER CHOICES BEGIN HERE</span>
    <i aria-hidden="true"><b /><b /><b /></i>
  </div>;
}

function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const authPage = ["/signin", "/signup"].includes(location.pathname);
  const [showHomeSplash, setShowHomeSplash] = useState(false);

  useEffect(() => {
    if (location.pathname !== "/") { setShowHomeSplash(false); return; }
    setShowHomeSplash(true);
    const timer = window.setTimeout(() => setShowHomeSplash(false), 1500);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  if (authPage) return <Routes><Route path="/signin" element={<SignInPage />} /><Route path="/signup" element={<SignUpPage />} /></Routes>;
  if (authLoading) return <><AppPageSkeleton />{showHomeSplash && <HomeLoadingSplash />}</>;

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Elyvex home"><img className="brand-mark" src={`${import.meta.env.BASE_URL}assets/elyvex-symbol.png`} alt="" /><span>ELYVEX<small>BETTER CHOICES BEGIN HERE</small></span></Link>
        <nav className="primary-nav" aria-label="Main navigation">
          <Link className={location.pathname === "/" ? "active" : ""} to="/">Discover</Link>
          <Link className={location.pathname === "/compare" ? "active" : ""} to="/compare">Compare</Link>
          <Link className={location.pathname === "/recommendations" ? "active" : ""} to="/recommendations">What we recommend</Link>
          <Link className={location.pathname === "/search" ? "active" : ""} to="/search">Search phone</Link>
        </nav>
        <div className="header-actions">
          {user ? <Link className="avatar-button" to="/profile" aria-label="Your profile">{user.displayName?.slice(0, 1) || user.email?.slice(0, 1) || "U"}</Link> : <><span className="guest-pill">Browsing as guest</span><Link className="header-signin" to="/signin">Sign in</Link></>}
          <div className="menu-wrap">
            <button className="icon-button menu-trigger" aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span>•••</span></button>
            {menuOpen && <><button className="menu-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} /><div className="menu-popover">
              <p className="menu-label">EXPLORE</p>
              <Link to="/" onClick={() => setMenuOpen(false)}><span>⌂</span>Home</Link>
              <Link to="/search" onClick={() => setMenuOpen(false)}><span>⌕</span>Search phone</Link>
              <Link to="/compare" onClick={() => setMenuOpen(false)}><span>⇄</span>Compare phones</Link>
              <Link to="/recommendations" onClick={() => setMenuOpen(false)}><span>✦</span>What we recommend</Link>
              <Link to="/profile#saved" onClick={() => setMenuOpen(false)}><span>♡</span>Saved phones</Link>
              <div className="menu-divider" />
              <p className="menu-label">YOUR ACCOUNT</p>
              <Link to="/profile" onClick={() => setMenuOpen(false)}><span>◉</span>Profile</Link>
              <Link to="/settings" onClick={() => setMenuOpen(false)}><span>⚙</span>Settings</Link>
              <Link to="/help" onClick={() => setMenuOpen(false)}><span>?</span>Help &amp; feedback</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)}><span>ⓘ</span>About ELYVEX</Link>
              <div className="menu-divider" />
              {user ? <button className="menu-signout" onClick={() => { void signOutUser(); setMenuOpen(false); }}><span>↪</span>Sign out</button> : <Link to="/signin" onClick={() => setMenuOpen(false)}><span>↪</span>Sign in</Link>}
            </div></>}
          </div>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
        <Route path="/phone/:id" element={<PhoneDetailsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/help" element={<main className="page-wrap legal-page"><section className="page-heading"><span className="eyebrow">WE’RE HERE TO HELP</span><h1>Help &amp; feedback</h1><p className="lead">Questions about a phone, recommendation, or your account? Contact the ELYVEX developer.</p></section><article className="legal-document"><section id="support"><h2>Developer support</h2><p>For support, reach out by email or choose a social channel:</p><DeveloperContacts /><p>You can browse ELYVEX without an account. For account requests, include the email address associated with the account and avoid sending passwords or verification codes.</p></section></article></main>} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <footer className="site-footer"><span>© 2026 ELYVEX</span><span className="footer-links"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/about">About</Link></span><span>Better choices begin here <i>♥</i></span></footer>
      {user && <LatestUpdatesDialog userId={user.uid} />}
      {showHomeSplash && <HomeLoadingSplash />}
    </div>
  );
}

export default function App() {
  return <AuthProvider><UserPreferencesProvider><PhoneActionsProvider><AppShell /></PhoneActionsProvider></UserPreferencesProvider></AuthProvider>;
}
