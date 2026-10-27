const contacts = [
  { label: "GitHub", href: "https://github.com/SharvilMishra" },
  { label: "Instagram", href: "https://www.instagram.com/sharvil.tech/" },
  { label: "Reddit", href: "https://www.reddit.com/user/voidwalker-dev/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/sharvil-mishra-07888238a/" },
];

export function DeveloperContacts() {
  return <div className="developer-contacts">
    <a className="developer-email" href="mailto:eng.sharvilmishra@gmail.com">eng.sharvilmishra@gmail.com</a>
    <div className="developer-social-links">
      {contacts.map(({ label, href }) => <a href={href} key={label} target="_blank" rel="noreferrer">{label}<span aria-hidden="true">↗</span></a>)}
    </div>
  </div>;
}
