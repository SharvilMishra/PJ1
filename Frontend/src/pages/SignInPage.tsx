import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { firebaseConfigured } from "../auth/firebase";
import { signIn, signInWithGoogle } from "../auth/authActions";

export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try { await signIn(email, password); navigate("/"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "We couldn't sign you in. Please try again."); }
    finally { setBusy(false); }
  }

  async function handleGoogle() {
    setError(""); setBusy(true);
    try { await signInWithGoogle(); navigate("/"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Google sign-in didn't work. Please try again."); }
    finally { setBusy(false); }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link className="auth-brand" to="/" aria-label="ELYVEX home"><span>ELYVEX</span><small>BETTER CHOICES BEGIN HERE</small></Link>
        <div className="auth-content">
          <div className="auth-heading"><h1>Sign in</h1><p>Your perfect phone match,<br />just a sign in away.</p></div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <div className="password-label"><label htmlFor="password">Password</label></div>
            <div className="password-input"><input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} /><button type="button" className="show-password" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? "Hide" : "Show"}</button></div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {!firebaseConfigured && <p className="auth-config-note">Sign in is temporarily unavailable. You can continue browsing as a guest.</p>}
            <button className="auth-submit" type="submit" disabled={busy || !firebaseConfigured}>{busy ? "Signing in…" : "Sign in"}</button>
          </form>
          <div className="auth-divider"><span />or<span /></div>
          <button className="google-button" type="button" onClick={() => void handleGoogle()} disabled={busy || !firebaseConfigured}><span className="google-g">G</span>Continue with Google</button>
          <p className="auth-switch">Don’t have an account? <Link to="/signup">Create one</Link></p>
        </div>
        <p className="auth-legal">By continuing, you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
      </section>
      <aside className="auth-art" aria-label="A crimson smartphone framed by white and red flowing waves">
        <svg className="auth-wave auth-wave-white" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0H610C735 92 572 203 677 306S765 497 650 588 568 791 704 870 720 948 636 1000H0Z" /></svg>
        <svg className="auth-wave auth-wave-crimson" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="authCrimson" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff304b"/><stop offset=".5" stopColor="#c80e2e"/><stop offset="1" stopColor="#65091e"/></linearGradient></defs><path d="M1000 0H802C698 105 857 207 754 312S697 495 824 600 854 810 737 900 724 962 792 1000H1000Z" fill="url(#authCrimson)"/><path className="auth-wave-ribbon" d="M1000 90H887C796 184 909 245 831 342S790 526 900 619 909 788 828 861" /></svg>
        <img className="auth-phone-photo" src={`${import.meta.env.BASE_URL}assets/login-phone-cutout.png`} alt="A glossy crimson smartphone with a triple camera" />
      </aside>
    </main>
  );
}
