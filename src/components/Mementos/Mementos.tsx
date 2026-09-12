import { projects } from '../../content/profile.ts';
import { Gallery } from '../Gallery/Gallery.tsx';
import { Panel } from '../Panel/Panel.tsx';
import { SectionHead } from '../SectionHead/SectionHead.tsx';
import { ScreenshotFan } from './ScreenshotFan.tsx';
import { useMementos } from './useMementos.ts';
import styles from './Mementos.module.css';

export const Mementos = () => {
  const { gallery, closeGallery, onCardClick, onCardKeyDown } = useMementos();
  return (
    <section id="projects" aria-labelledby="projects-h">
      <SectionHead id="projects" title="M[E]MENT[O]S" sub="Projects · targets taken, hearts changed." />

      <div className={styles.cards}>
        {projects.map((project) => (
          <article
            key={project.target}
            className={styles.card}
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            data-target={project.target}
            onClick={onCardClick}
            onKeyDown={onCardKeyDown}
          >
            <ScreenshotFan screenshots={project.screenshots} name={project.name} />
            <span className="vh">Press to open screenshots</span>
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
          </article>
        ))}
      </div>

      {gallery !== null && <Gallery project={gallery.project} opener={gallery.opener} onClose={closeGallery} />}
    </section>
  );
};
