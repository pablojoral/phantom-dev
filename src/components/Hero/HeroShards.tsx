import { Fragment } from 'react';
import { cx } from '../../utils/cx.ts';
import type { ShardTone } from './heroShards.ts';
import { useHeroShards } from './useHeroShards.ts';
import styles from './HeroShards.module.css';

export interface HeroShardsProps {
  readonly className?: string | undefined;
}

const TONE_CLASS: Readonly<Record<ShardTone, string | undefined>> = {
  red: styles.red,
  deep: styles.deep,
  ink: styles.ink,
  paperFaint: styles.paperFaint,
  paper: styles.paper,
  paperStrong: styles.paperStrong,
};

export const HeroShards = ({ className }: HeroShardsProps) => {
  const { patternId, textureFill, shards } = useHeroShards();
  return (
    <div className={cx(styles.shards, className)} aria-hidden="true">
      <svg className={styles.svg} viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <defs>
          <pattern id={patternId} width="7" height="7" patternUnits="userSpaceOnUse">
            <circle className={styles.dot} cx="3.5" cy="3.5" r="1" />
          </pattern>
        </defs>
        {shards.map((shard) => (
          <Fragment key={shard.key}>
            <polygon className={TONE_CLASS[shard.tone]} points={shard.points} />
            {shard.textured && <polygon fill={textureFill} points={shard.points} />}
          </Fragment>
        ))}
      </svg>
    </div>
  );
};
