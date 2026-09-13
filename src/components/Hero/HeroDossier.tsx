import { cx } from '../../utils/cx.ts';
import { Dossier } from '../Dossier/Dossier.tsx';
import { DossierField } from '../Dossier/DossierField.tsx';
import { useHeroDossier } from './useHeroDossier.ts';
import styles from './HeroDossier.module.css';

export interface HeroDossierProps {
  readonly className?: string | undefined;
}

/** The "login form": the tagline as two filled-in fields, then the lede. */
export const HeroDossier = ({ className }: HeroDossierProps) => {
  const { fields, lede } = useHeroDossier();
  return (
    <div className={cx(styles.dossier, className)}>
      <Dossier>
        <dl className={styles.fields}>
          {fields.map((field) => (
            <DossierField key={field.key} label={field.label} value={field.value} tab={field.tab} />
          ))}
        </dl>
        <p className={styles.lede}>{lede}</p>
      </Dossier>
    </div>
  );
};
