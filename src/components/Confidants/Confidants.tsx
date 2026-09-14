import type { SkillTier } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import { SectionHead } from '../SectionHead/SectionHead.tsx';
import { useConfidants } from './useConfidants.ts';
import styles from './Confidants.module.css';

const KIND_CLASS: Readonly<Record<SkillTier, string | undefined>> = {
  signature: styles.signature,
  core: styles.core,
  support: styles.support,
};

/** Skills as a cluster of cut-outs: emphasis comes from size and material, never from a score. */
export const Confidants = () => {
  const pieces = useConfidants();
  return (
    <section id="skills" aria-labelledby="skills-h">
      <SectionHead id="skills" title="Sk[i]ll[s]" sub="The crew I roll with." />

      <ul className={styles.collage}>
        {pieces.map((piece) => (
          <li key={piece.key} className={cx(styles.piece, KIND_CLASS[piece.kind])} style={piece.style}>
            {piece.kind === 'core' ? (
              <span className={cx(styles.body, styles.chip, styles.chipMedium)}>
                <span>
                  <span className={styles.coreName}>{piece.name}</span>
                  {piece.detail !== undefined && <span className={styles.coreDetail}>{piece.detail}</span>}
                </span>
              </span>
            ) : (
              <span className={cx(styles.body, styles.chip, piece.kind === 'signature' && styles.chipLarge)}>
                <span>
                  {piece.name}
                  {piece.detail !== undefined && (
                    <>
                      <span className={styles.sep}> · </span>
                      <span className={styles.chipDetail}>{piece.detail}</span>
                    </>
                  )}
                </span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
