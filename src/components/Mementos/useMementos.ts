import { useCallback, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { projects } from '../../content/profile.ts';
import type { Project } from '../../content/profile.ts';

export interface OpenGallery {
  readonly project: Project;
  /** The card that opened the gallery; focus returns here on close. */
  readonly opener: HTMLElement;
}

export interface MementosController {
  readonly gallery: OpenGallery | null;
  readonly closeGallery: () => void;
  readonly onCardClick: (event: MouseEvent<HTMLElement>) => void;
  readonly onCardKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

const PROJECT_BY_TARGET: ReadonlyMap<string, Project> = new Map(projects.map((project) => [project.target, project]));

const isInsideLink = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest('a') !== null;

/** Cards carry `data-target`; one stable handler pair serves every card. */
export const useMementos = (): MementosController => {
  const [gallery, setGallery] = useState<OpenGallery | null>(null);

  const openFrom = useCallback((card: HTMLElement) => {
    const project = PROJECT_BY_TARGET.get(card.dataset['target'] ?? '');
    if (project !== undefined) {
      setGallery({ project, opener: card });
    }
  }, []);

  const closeGallery = useCallback(() => setGallery(null), []);

  const onCardClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (isInsideLink(event.target)) return;
      openFrom(event.currentTarget);
    },
    [openFrom],
  );

  const onCardKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openFrom(event.currentTarget);
    },
    [openFrom],
  );

  return { gallery, closeGallery, onCardClick, onCardKeyDown };
};
