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
      <aside className="auth-art" aria-label="Crimson smartphone against a red abstract background">
        <img className="auth-phone-illustration" src={`${import.meta.env.BASE_URL}assets/phone-hero.svg`} alt="A crimson smartphone" />
      </aside>
    </main>
  );
}
