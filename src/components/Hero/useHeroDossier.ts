import { useMemo } from 'react';
import { lede, tagline } from '../../content/profile.ts';

export interface DossierField {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

export interface HeroDossierState {
  readonly fields: ReadonlyArray<DossierField>;
  readonly lede: string;
}

const TAGLINE_SEPARATOR = '·';

/** The tagline "Software Engineer · Mobile Engineering" becomes the role and specialty fields. */
const toFields = (text: string): ReadonlyArray<DossierField> => {
  const [role = '', specialty = ''] = text.split(TAGLINE_SEPARATOR).map((part) => part.trim());
  const fields: ReadonlyArray<DossierField> = [
    { key: 'role', label: 'role', value: role },
    { key: 'specialty', label: 'specialty', value: specialty },
  ];
  return fields.filter((field) => field.value.length > 0);
};

export const useHeroDossier = (): HeroDossierState => {
  const fields = useMemo(() => toFields(tagline), []);
  return { fields, lede };
};
