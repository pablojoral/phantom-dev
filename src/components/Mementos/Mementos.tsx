import { cx } from '../../utils/cx.ts';
import { Gallery } from '../Gallery/Gallery.tsx';
import { Panel } from '../Panel/Panel.tsx';
import { SectionHead } from '../SectionHead/SectionHead.tsx';
import { ClassifiedNotice } from './ClassifiedNotice.tsx';
import { ScreenshotFan } from './ScreenshotFan.tsx';
import { useMementos } from './useMementos.ts';
import styles from './Mementos.module.css';

export const Mementos = () => {
  const { cards, gallery, closeGallery, announcement, onCardClick, onCardKeyDown, onCardPointerEnter, onCardPointerLeave } =
    useMementos();
  return (
    <section id="projects" aria-labelledby="projects-h">
      <SectionHead id="projects" title="Pr[o]je[c]t[s]" sub="targets taken, hearts changed." />

      <div className={styles.cards}>
        {cards.map(({ project, confidential, fanOpen, fanClosing, hoverClosing, notice, hint }) => (
          <article
            key={project.target}
            className={cx(styles.card, fanOpen && styles.fanOpen, fanClosing && styles.fanClosing, hoverClosing && styles.hoverClosing)}
            role="button"
            tabIndex={0}
            aria-haspopup={confidential ? undefined : 'dialog'}
            data-target={project.target}
            onClick={onCardClick}
            onKeyDown={onCardKeyDown}
            onPointerEnter={onCardPointerEnter}
            onPointerLeave={onCardPointerLeave}
          >
            <ScreenshotFan screenshots={project.screenshots} name={project.name} open={fanOpen} closing={fanClosing} />
            <span className="vh">{hint}</span>
            {/* Keyed by the notice, so every activation remounts the wrapper and the shake restarts. */}
            <div key={`body-${notice?.key ?? 0}`} className={cx(styles.body, notice !== null && styles.shake)}>
              <Panel tone={project.tone} alt={project.tone === 'red'}>
                <p className="label">
                  <span>Target {project.target}</span>
                </p>
                <h3>{project.name}</h3>
                <p className={styles.heist}>{project.summary}</p>
                <ul className={styles.chips} aria-label="Stack">
                  {project.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={styles.result}>
                  <strong>Result</strong>
                  {project.result}
                </p>
              </Panel>
            </div>
            {notice !== null && <ClassifiedNotice key={`notice-${notice.key}`} leaving={notice.leaving} />}
          </article>
        ))}
      </div>
      <p className="vh" aria-live="polite">
        {announcement}
      </p>

      {gallery !== null && <Gallery project={gallery.project} opener={gallery.opener} onClose={closeGallery} />}
    </section>
  );
};
