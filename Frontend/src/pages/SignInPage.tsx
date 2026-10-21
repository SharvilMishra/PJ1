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
        <svg className="auth-divider-wave" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="authDivider" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fa4861"/><stop offset=".55" stopColor="#b90d30"/><stop offset="1" stopColor="#760b28"/></linearGradient></defs><path d="M0 0C84 72 18 170 63 270S107 437 28 525 21 710 83 818 69 941 0 1000Z" fill="url(#authDivider)"/><path d="M7 0C92 79 27 170 72 270S116 437 37 525 30 710 92 818 78 941 9 1000" fill="none" stroke="#ffb3bd" strokeOpacity=".65" strokeWidth="3" vectorEffect="non-scaling-stroke" /></svg>
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
        <svg className="auth-wave auth-wave-white" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><path className="auth-wave-base" d="M0 0H610C735 92 572 203 677 306S765 497 650 588 568 791 704 870 720 948 636 1000H0Z" /><path className="auth-wave-line wave-line-one" d="M-30 245C190 118 348 367 674 203"/><path className="auth-wave-line wave-line-two" d="M-25 565C190 432 422 684 672 506"/><path className="auth-wave-line wave-line-three" d="M-20 850C205 716 431 959 699 800"/></svg>
        <svg className="auth-wave auth-wave-crimson" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="authCrimson" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff304b"/><stop offset=".5" stopColor="#c80e2e"/><stop offset="1" stopColor="#65091e"/></linearGradient></defs><path d="M1000 0H802C698 105 857 207 754 312S697 495 824 600 854 810 737 900 724 962 792 1000H1000Z" fill="url(#authCrimson)"/><path className="auth-wave-ribbon" d="M1000 90H887C796 184 909 245 831 342S790 526 900 619 909 788 828 861"/><path className="auth-wave-ribbon auth-wave-ribbon-two" d="M1000 270C918 324 979 397 905 465S872 608 966 679"/></svg>
        <img className="auth-phone-photo" src={`${import.meta.env.BASE_URL}assets/login-phone-cutout.png`} alt="A glossy crimson smartphone with a triple camera" />
      </aside>
    </main>
  );
}
