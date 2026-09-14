import { name } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import { Dossier } from '../Dossier/Dossier.tsx';
import { DossierField } from '../Dossier/DossierField.tsx';
import { OutlinedRansom } from '../OutlinedRansom/OutlinedRansom.tsx';
import { PaperSheet } from '../PaperSheet/PaperSheet.tsx';
import { RansomText } from '../RansomText/RansomText.tsx';
import { Shards } from '../Shards/Shards.tsx';
import { COPY_STATUS_ID, EMAIL_TEXT_ID, useContact } from './useContact.ts';
import { CONTACT_TITLE, useContactWords } from './useContactWords.ts';
import styles from './Contact.module.css';

/** The page's closing scene: the hero's language mirrored, with the page footer on the same glass. */
export const Contact = () => {
  const { email, mailto, profiles, emailRef, label, announcement, copy } = useContact();
  const { titleLabel, titleLines, kicker, headlineLabel, headlineWords } = useContactWords();
  return (
    <div className={styles.ending}>
      <Shards mirror edge="top" className={styles.shards} />
      <div className={cx('wrap', styles.stage)}>
        <section id="contact" aria-labelledby="contact-h" className={styles.contact}>
          <div className={styles.title}>
            <p className={styles.tag}>
              <span>the heist starts with one message.</span>
            </p>
            <OutlinedRansom as="h2" id="contact-h" label={titleLabel} className={styles.name}>
              {titleLines.map((line) => (
                <span key={line.key} className={styles.line} aria-hidden="true">
                  {line.words.map((word) => (
                    <span key={word.key} className={styles.w}>
                      <RansomText text={word.text} startIndex={word.startIndex} salt={CONTACT_TITLE} style="mix" leadTone="ink" />
                    </span>
                  ))}
                </span>
              ))}
            </OutlinedRansom>
          </div>

          <Dossier mirror className={styles.dossier}>
            <dl className={styles.fields}>
              <DossierField
                label="email"
                value={email}
                plain
                valueId={EMAIL_TEXT_ID}
                valueRef={emailRef}
                tab={{ kind: 'button', text: label, onClick: copy, describedBy: EMAIL_TEXT_ID }}
              />
              {profiles.map((profile) => (
                <DossierField key={profile.key} label={profile.label} value={profile.display} href={profile.href} plain />
              ))}
            </dl>
            <span className="vh" id={COPY_STATUS_ID} aria-live="polite">
              {announcement}
            </span>
          </Dossier>

          <PaperSheet mirror className={styles.sheet} sheetClassName={styles.sheetInner}>
            <p className={cx('label', styles.kicker)}>
              <span>{kicker}</span>
            </p>
            <p className={styles.sheetHeadline} aria-label={headlineLabel}>
              {headlineWords.map((word) => (
                <span key={word.key} className={styles.w} aria-hidden="true">
                  <RansomText text={word.text} startIndex={word.startIndex} style="mix" />
                </span>
              ))}
            </p>
            <a className={styles.btn} href={mailto} target="_blank" rel="noopener">
              <span>Send calling card</span>
            </a>
          </PaperSheet>
        </section>

        <footer className={styles.footer}>
          <p className={styles.chip}>
            <span>© 2026 {name} · Built with React, Vite, and a lot of red.</span>
          </p>
        </footer>
      </div>
    </div>
  );
};
