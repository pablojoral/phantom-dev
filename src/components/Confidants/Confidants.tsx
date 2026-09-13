import { cx } from '../../utils/cx.ts';
import { Panel } from '../Panel/Panel.tsx';
import { SectionHead } from '../SectionHead/SectionHead.tsx';
import { useConfidants } from './useConfidants.ts';
import styles from './Confidants.module.css';

export const Confidants = () => {
  const rows = useConfidants();
  return (
    <section id="skills" aria-labelledby="skills-h">
      <SectionHead id="skills" title="Sk[i]ll[s]" sub="the crew I roll with. Rank up by shipping." />

      <Panel tone="paper" tilt="l" bare>
        <ol className={styles.ranks}>
          {rows.map((row) => (
            <li key={row.key} className={styles.rank}>
              <span className={styles.arcana}>{row.arcana}</span>
              <span className={styles.name}>{row.name}</span>
              <span className={styles.meter} role="img" aria-label={row.meterLabel}>
                {row.segments.map((on, i) => (
                  <span key={i} className={cx(styles.seg, on && styles.on)} />
                ))}
              </span>
              <span className={styles.num}>{row.rankLabel}</span>
            </li>
          ))}
        </ol>
      </Panel>
    </section>
  );
};
