import { useMemo } from 'react';
import { education } from '../../content/profile.ts';
import type { Education } from '../../content/profile.ts';

export interface EducationRow extends Education {
  readonly key: string;
}

const toRow = (item: Education): EducationRow => ({ ...item, key: item.school });

export const useEducation = (): ReadonlyArray<EducationRow> => useMemo(() => education.map(toRow), []);
