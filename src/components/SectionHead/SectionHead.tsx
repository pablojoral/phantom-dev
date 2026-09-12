import { Tab } from '../Tab/Tab.tsx';
import { RansomText } from '../RansomText/RansomText.tsx';
import type { RansomStyle } from '../RansomText/RansomText.tsx';
import { useSectionHead } from './useSectionHead.ts';

export interface SectionHeadProps {
  /** Section id; the heading gets `${id}-h` for `aria-labelledby`. */
  readonly id: string;
  /** Ransom-syntax title, e.g. `C[O]NFID[A]NT[S]`. */
  readonly title: string;
  readonly sub: string;
  readonly note?: string;
  /** Ransom face for the title letters; defaults to a mix of magazines. */
  readonly style?: RansomStyle;
}

export const SectionHead = ({ id, title, sub, note, style = 'mix' }: SectionHeadProps) => {
  const label = useSectionHead(title);
  return (
    <div className="sec-head">
      <Tab kind="heading" id={`${id}-h`} label={label}>
        <RansomText text={title} style={style} leadTone="paper" />
      </Tab>
      <p className="sub">{sub}</p>
      {note !== undefined && <p className="note">{note}</p>}
    </div>
  );
};
