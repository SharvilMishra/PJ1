import { DeveloperContacts } from "../components/DeveloperContacts";
import { Link } from "react-router-dom";

export function TermsPage() {
  return <main className="page-wrap legal-page"><header className="page-heading"><span className="eyebrow">A FEW THINGS TO KNOW</span><h1>Terms of use</h1><p className="lead">The terms for using ELYVEX phone discovery and comparison.</p><p className="legal-updated">Last updated: 28 October 2026</p></header><article className="legal-document">
    <section><h2>1. About the service</h2><p>ELYVEX is an independent phone discovery and comparison project maintained by Sharvil Mishra in India. It lets visitors browse a phone catalog, filter and compare devices, and view recommendations based on catalog specifications and selected preferences. You can use the discovery features as a guest; an account is optional.</p><p>These terms are governed by the laws of India. Courts in India that have jurisdiction under applicable law may hear disputes. Nothing in these terms removes consumer rights or other protections that cannot legally be waived where you live. For service-related contact, email <a href="mailto:eng.sharvilmishra@gmail.com">eng.sharvilmishra@gmail.com</a>; no public postal address is provided.</p></section>

    <section><h2>2. Informational service, not a seller</h2><p>ELYVEX is not a phone manufacturer, retailer, marketplace, or payment service. It does not sell devices, take orders, process purchases, check live stock, arrange delivery, or provide a manufacturer’s warranty. A catalog price is not an offer to sell a phone.</p></section>

    <section><h2>3. Catalog details and prices</h2><p>Phone specifications and prices are taken from a supplied workbook. The records have not been independently verified and may be incomplete, inaccurate, or out of date. The source does not confirm price currency or some measurement units. Category labels are inferred by ELYVEX from catalog thresholds. Illustrative phone artwork may not depict the listed model.</p><p>Before making a purchase, verify the current price, currency, specifications, compatibility, availability, and warranty with the manufacturer or seller.</p></section>

    <section><h2>4. Recommendations and comparisons</h2><p>Recommendation scores rank phones using the catalog values and weights shown in the app. A selected budget excludes listed prices above that amount; a missing specification contributes no points. A score is a decision aid, not a guarantee of quality, suitability, or real-world performance. Comparisons reflect the values recorded in the catalog and may omit details that matter to you.</p></section>

    <section><h2>5. Accounts and saved choices</h2><p>You are responsible for keeping your sign-in credentials secure and for activity performed through your account. Provide accurate account information and contact the developer if you believe your account has been accessed without permission. Recommendation profiles are stored with Firebase; saved phones, comparison selections, and certain preferences remain in the browser you use. Review the <Link to="/privacy">Privacy Policy</Link> for details.</p></section>

    <section><h2>6. Acceptable use</h2><p>Use ELYVEX lawfully. Do not disrupt the service, attempt unauthorized access, introduce malicious code, misrepresent the service as a seller or manufacturer, or use the service to infringe another person’s rights.</p></section>

    <section><h2>7. Intellectual property and third parties</h2><p>ELYVEX branding and original interface materials belong to the project operator or its licensors. Phone names, marks, and product references belong to their respective owners. Firebase, Google sign-in, hosting providers, and linked third-party sites are provided under their own terms. ELYVEX is not responsible for third-party services or content outside its control.</p></section>

    <section><h2>8. Availability and changes</h2><p>Features, catalog records, and recommendations may change as the project develops. The service may occasionally be unavailable or contain errors. We may suspend or change a feature when needed to maintain or protect the service.</p></section>

    <section><h2>9. Liability</h2><p>To the extent permitted by applicable law, ELYVEX is provided for general informational use without a promise that catalog data, recommendations, or service availability will be complete, current, or error-free. We do not exclude liability or remedies that applicable law does not allow us to exclude or limit.</p></section>

    <section><h2>10. Contact</h2><p>Questions or concerns about these terms? Contact the developer:</p><DeveloperContacts /></section>
  </article></main>;
}
