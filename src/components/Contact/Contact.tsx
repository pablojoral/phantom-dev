import { Panel } from '../Panel/Panel.tsx';
import { SectionHead } from '../SectionHead/SectionHead.tsx';
import { Tab } from '../Tab/Tab.tsx';
import { COPY_STATUS_ID, EMAIL_TEXT_ID, useContact } from './useContact.ts';
import styles from './Contact.module.css';

export const Contact = () => {
  const { email, mailto, socials, emailRef, label, announcement, copy } = useContact();
  return (
    <section id="contact" aria-labelledby="contact-h">
      <SectionHead id="contact" title="S[E]ND A C[A]LLING C[A]RD" sub="Contact · the heist starts with one message." />

      <Panel tone="red" tilt="l" alt className={styles.contact}>
        <p className="label">
          <span>Your heart will be taken</span>
        </p>
        <p className={styles.big}>Take your heart</p>
        <a className={styles.btn} href={mailto} target="_blank" rel="noopener">
          <span>Send calling card</span>
        </a>
        <div className={styles.emailRow}>
          <p className={styles.email}>
            <span id={EMAIL_TEXT_ID} ref={emailRef}>
              {email}
            </span>
          </p>
          <button type="button" className={styles.copy} aria-describedby={EMAIL_TEXT_ID} onClick={copy}>
            <span>{label}</span>
          </button>
          <span className="vh" id={COPY_STATUS_ID} aria-live="polite">
            {announcement}
          </span>
        </div>
        <ul className={styles.social} aria-label="Profiles">
          {socials.map((social) => (
            <li key={social.label}>
              <Tab kind="link" href={social.href} ink>
                {social.label}
              </Tab>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  );
};
