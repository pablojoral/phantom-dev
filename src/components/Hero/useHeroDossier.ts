import { useMemo } from 'react';
import { lede, tagline } from '../../content/profile.ts';

export interface DossierField {
  readonly key: string;
  readonly label: string;
  readonly value: string;
  /** Small tab hanging off the field's left edge, if any. */
  readonly tab: string | undefined;
}

export interface HeroDossierState {
  readonly fields: ReadonlyArray<DossierField>;
  readonly lede: string;
}

const TAGLINE_SEPARATOR = '·';
const TAB_TEXT = 'Calling card';

/** The tagline "Phantom Dev · Mobile Engineering" becomes the codename and specialty fields. */
const toFields = (text: string): ReadonlyArray<DossierField> => {
  const [codename = '', specialty = ''] = text.split(TAGLINE_SEPARATOR).map((part) => part.trim());
  const fields: ReadonlyArray<DossierField> = [
    { key: 'codename', label: 'codename', value: codename, tab: undefined },
    { key: 'specialty', label: 'specialty', value: specialty, tab: TAB_TEXT },
  ];
  return fields.filter((field) => field.value.length > 0);
};

export const useHeroDossier = (): HeroDossierState => {
  const fields = useMemo(() => toFields(tagline), []);
  return { fields, lede };
};
