import { Link } from "react-router-dom";
import { DeveloperContacts } from "../components/DeveloperContacts";

const principles = [
  { number: "01", title: "Start with what matters", body: "Search the catalog by brand, price, camera, battery, memory, display, weight, and rating." },
  { number: "02", title: "Compare the trade-offs", body: "Put two phones side by side and see their listed specifications together." },
  { number: "03", title: "Understand every match", body: "Choose a persona and budget to rank phones by weighted catalog specifications, with score contributions you can inspect." },
];

export function AboutPage() {
  return <main className="page-wrap about-page">
    <section className="about-hero">
      <span className="eyebrow"><span className="eyebrow-dot" /> A LITTLE ABOUT ELYVEX</span>
      <h1>Better choices<br />begin with <em>what matters to you.</em></h1>
      <p>ELYVEX is an independent phone discovery tool. It helps you make sense of a catalog, explore the features you care about, and compare your shortlist.</p>
      <div className="about-hero-actions"><Link className="button-primary" to="/search">Explore the catalog <span>↗</span></Link><Link className="about-text-link" to="/recommendations">How recommendations work <span>↗</span></Link></div>
      <div className="about-hero-mark" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}assets/elyvex-symbol.png`} alt="" /></div>
    </section>

    <section className="about-how"><div className="section-heading"><div><span className="eyebrow">A CLEARER WAY TO CHOOSE</span><h2>From browsing to a shortlist.</h2></div></div><div className="about-principles">{principles.map((item) => <article className="about-principle" key={item.number}><span>{item.number}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div></section>

    <section className="about-data-panel"><div><span className="eyebrow">OPEN ABOUT OUR DATA</span><h2>A useful starting point, with limits made clear.</h2><p>The current catalog contains 413 records normalized from the supplied SIC mobile specification workbook. ELYVEX has not independently verified those specifications or prices. The source does not confirm price currency or several suspected measurement units, and its records do not include manufacturer links.</p><p>Category labels such as Gaming, Battery, Camera, Budget, and Premium are ELYVEX classifications derived from catalog thresholds. A missing specification is shown as unavailable. Phone illustrations may be generic rather than product photographs.</p><Link className="text-link" to="/search">Read the catalog notes on Search phones <span>↗</span></Link></div><div className="about-data-stat"><b>413</b><span>catalog records</span><small>Source workbook<br />Verification date not recorded</small></div></section>

    <section className="about-account-panel"><div><span className="eyebrow">BROWSE YOUR WAY</span><h2>Guest browsing is welcome.</h2></div><p>Explore and compare phones without an account. Sign in is optional and is used to save your recommendation profile. Saved phones, compare selections, theme choice, and search filters are stored in your browser; they do not currently sync between devices.</p><Link className="text-link" to="/privacy">How ELYVEX handles data <span>↗</span></Link></section>

    <section className="about-contact-panel"><div><span className="eyebrow">BUILT BY A PERSON, NOT A PHONE STORE</span><h2>Questions or feedback?</h2><p>Contact the ELYVEX developer about the app, catalog, accessibility, or your account.</p></div><DeveloperContacts /></section>
  </main>;
}
