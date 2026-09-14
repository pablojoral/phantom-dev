import { Fragment } from 'react';
import { cx } from '../../utils/cx.ts';
import type { ShardTone } from './shards.ts';
import { useShards } from './useShards.ts';
import styles from './Shards.module.css';

export type ShardsEdge = 'bottom' | 'top';

export interface ShardsProps {
  readonly className?: string | undefined;
  /** Flip the glass horizontally. */
  readonly mirror?: boolean;
  /** Which edge gets the angled cut. */
  readonly edge?: ShardsEdge;
}

const TONE_CLASS: Readonly<Record<ShardTone, string | undefined>> = {
  red: styles.red,
  deep: styles.deep,
  ink: styles.ink,
  paperFaint: styles.paperFaint,
  paper: styles.paper,
  paperStrong: styles.paperStrong,
};

const EDGE_CLASS: Readonly<Record<ShardsEdge, string | undefined>> = {
  bottom: styles.edgeBottom,
  top: styles.edgeTop,
};

/** Shattered-glass ground, absolutely filling its positioned parent. Decorative. */
export const Shards = ({ className, mirror = false, edge = 'bottom' }: ShardsProps) => {
  const { patternId, textureFill, shards } = useShards();
  return (
    <div className={cx(styles.shards, EDGE_CLASS[edge], className)} aria-hidden="true">
      <svg
        className={cx(styles.svg, mirror && styles.mirror)}
        viewBox="0 0 1200 760"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
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
