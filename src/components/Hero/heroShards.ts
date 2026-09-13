export type ShardTone = 'red' | 'deep' | 'ink' | 'paperFaint' | 'paper' | 'paperStrong';

export interface Shard {
  readonly key: string;
  /** SVG `points` in the 1200×760 viewBox. */
  readonly points: string;
  readonly tone: ShardTone;
  /** Lay the halftone dot pattern over this shard. */
  readonly textured: boolean;
}

/*
 * Shattered-glass ground, drawn in paint order. The first eight wedges fan out from a point
 * behind the dossier (≈560,360) and tile the whole viewBox; the rest are splinters on top.
 */
export const HERO_SHARDS: ReadonlyArray<Shard> = [
  { key: 'w1', points: '0,0 520,0 560,360 0,210', tone: 'red', textured: true },
  { key: 'w2', points: '520,0 760,0 560,360', tone: 'deep', textured: false },
  { key: 'w3', points: '760,0 1200,0 1200,300 560,360', tone: 'red', textured: true },
  { key: 'w4', points: '560,360 1200,300 1200,520', tone: 'deep', textured: false },
  { key: 'w5', points: '560,360 1200,520 1200,760 820,760', tone: 'red', textured: true },
  { key: 'w6', points: '300,760 560,360 820,760', tone: 'deep', textured: false },
  { key: 'w7', points: '0,470 560,360 300,760 0,760', tone: 'red', textured: true },
  { key: 'w8', points: '0,210 560,360 0,470', tone: 'deep', textured: false },
  { key: 's1', points: '300,90 610,60 470,250', tone: 'red', textured: true },
  { key: 's2', points: '880,520 1140,420 1040,700', tone: 'deep', textured: false },
  { key: 's3', points: '0,300 470,330 520,390 0,380', tone: 'ink', textured: false },
  { key: 's4', points: '640,0 700,0 590,330 560,300', tone: 'ink', textured: false },
  { key: 's5', points: '700,420 1200,610 1200,680 660,470', tone: 'ink', textured: false },
  { key: 's6', points: '80,760 470,420 520,450 210,760', tone: 'ink', textured: false },
  { key: 's7', points: '900,0 1010,0 610,340', tone: 'paper', textured: false },
  { key: 's8', points: '0,560 500,400 0,640', tone: 'paperFaint', textured: false },
  { key: 's9', points: '860,760 600,420 640,400 980,760', tone: 'paperStrong', textured: false },
  { key: 's10', points: '1050,300 1200,240 1200,330', tone: 'paper', textured: false },
  { key: 's11', points: '260,0 360,0 540,340', tone: 'paperFaint', textured: false },
];
