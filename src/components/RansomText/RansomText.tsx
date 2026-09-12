import { Fragment } from 'react';
import { cx } from '../../utils/cx.ts';
import { useRansomText } from './useRansomText.ts';
import type { RansomLeadTone, RansomTone } from './useRansomText.ts';
import type { RansomCut, RansomFont, RansomStyle } from './ransomVariation.ts';
import styles from './RansomText.module.css';

export type { RansomFont, RansomStyle } from './ransomVariation.ts';

export interface RansomTextProps {
  /** `[X]` = ransom letter, `{X}` = hot ransom letter, rest is plain text. */
  readonly text: string;
  /** When set, letters receive `--i` starting here (hero stagger animation). */
  readonly startIndex?: number;
  /** One face for every letter, or `mix` for a different magazine per scrap. */
  readonly style?: RansomStyle;
  /** Tone of the first non-hot letter; the rest alternate from it. */
  readonly leadTone?: RansomLeadTone;
  /** Shared dealing seed; see `RansomTextOptions.salt`. */
  readonly salt?: string;
}

const FONT_CLASS: Readonly<Record<RansomFont, string | undefined>> = {
  anton: styles.fontAnton,
  bangers: styles.fontBangers,
  passion: styles.fontPassion,
  mono: styles.fontMono,
  serif: styles.fontSerif,
  bowlby: styles.fontBowlby,
  abril: styles.fontAbril,
  stencil: styles.fontStencil,
  bebas: styles.fontBebas,
};

const TONE_CLASS: Readonly<Record<RansomTone, string | undefined>> = {
  ink: styles.toneInk,
  paper: styles.tonePaper,
  redOnPaper: styles.toneRedOnPaper,
};

const CUT_CLASS: Readonly<Record<RansomCut, string | undefined>> = {
  1: styles.cut1,
  2: styles.cut2,
  3: styles.cut3,
  4: styles.cut4,
  5: styles.cut5,
  6: styles.cut6,
  7: styles.cut7,
  8: styles.cut8,
};

export const RansomText = ({ text, startIndex, style, leadTone, salt }: RansomTextProps) => {
  const pieces = useRansomText({ text, startIndex, style, leadTone, salt });
  return (
    <>
      {pieces.map((piece) =>
        piece.kind === 'text' ? (
          <Fragment key={piece.key}>{piece.value}</Fragment>
        ) : (
          // `rWrap` / `r` are global hook classes: Hero animates `rWrap`.
          <span key={piece.key} className={cx('rWrap', styles.scrap)} style={piece.style}>
            <span
              className={cx(
                'r',
                styles.letter,
                FONT_CLASS[piece.font],
                TONE_CLASS[piece.tone],
                CUT_CLASS[piece.cut],
              )}
            >
              {piece.char}
            </span>
          </span>
        ),
      )}
    </>
  );
};
