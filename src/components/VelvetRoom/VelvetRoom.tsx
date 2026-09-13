import { Panel } from '../Panel/Panel.tsx';
import { SectionHead } from '../SectionHead/SectionHead.tsx';
import { Education } from './Education.tsx';
import { useVelvetRoom } from './useVelvetRoom.ts';
import styles from './VelvetRoom.module.css';

export const VelvetRoom = () => {
  const entries = useVelvetRoom();
  return (
    <section id="experience" aria-labelledby="experience-h">
      <SectionHead id="experience" title="Ex[p]eri[e]nc[e]" sub="contracts signed and fulfilled." />

      <ol className={styles.timeline}>
        {entries.map((entry) => (
          <li key={entry.key} className={styles.entry}>
            <Panel tone={entry.tone} tilt={entry.tilt} alt={entry.alt}>
              <p className="label">
                <span>{entry.label}</span>
              </p>
              <h3>{entry.role}</h3>
              <p className={styles.co}>{entry.company}</p>
              <ul className={styles.outcomes}>
                {entry.outcomes.map((outcome) => (
                  <li key={outcome.key} style={outcome.style}>
                    {outcome.text}
                  </li>
                ))}
              </ul>
            </Panel>
          </li>
        ))}
      </ol>
      <Education />
    </section>
  );
};
