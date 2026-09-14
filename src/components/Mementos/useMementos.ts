import { useCallback, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { projects } from '../../content/profile.ts';
import type { Project } from '../../content/profile.ts';
import { TOUCH_QUERY, useFanDismiss } from './useFanDismiss.ts';

export interface OpenGallery {
  readonly project: Project;
  /** The card that opened the gallery; focus returns here on close. */
  readonly opener: HTMLElement;
}

export interface MementosController {
  readonly projects: ReadonlyArray<Project>;
  /** `target` of the card whose fan is shown on touch, or null. At most one at a time. */
  readonly openFan: string | null;
  readonly gallery: OpenGallery | null;
  readonly closeGallery: () => void;
  readonly onCardClick: (event: MouseEvent<HTMLElement>) => void;
  readonly onCardKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

const PROJECT_BY_TARGET: ReadonlyMap<string, Project> = new Map(projects.map((project) => [project.target, project]));

const isInsideLink = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest('a') !== null;

/**
 * Cards carry `data-target`; one stable handler pair serves every card. Mouse and keyboard open the
 * gallery directly (the fan is a hover effect there). On touch the first tap shows the card's fan and
 * a second tap on the same card opens the gallery.
 */
export const useMementos = (): MementosController => {
  const [gallery, setGallery] = useState<OpenGallery | null>(null);
  const [openFan, setOpenFan] = useState<string | null>(null);
  // Mirrors `openFan` for event handlers, so a dismissal and the next tap never read a stale value.
  const openFanRef = useRef<string | null>(null);
  const fanCardRef = useRef<HTMLElement | null>(null);

  const setFan = useCallback((card: HTMLElement | null) => {
    const target = card?.dataset['target'] ?? null;
    openFanRef.current = target;
    fanCardRef.current = card;
    setOpenFan(target);
  }, []);

  const closeFan = useCallback(() => setFan(null), [setFan]);
  useFanDismiss(openFan, fanCardRef, closeFan);

  const openFrom = useCallback(
    (card: HTMLElement) => {
      closeFan();
      const project = PROJECT_BY_TARGET.get(card.dataset['target'] ?? '');
      if (project !== undefined) {
        setGallery({ project, opener: card });
      }
    },
    [closeFan],
  );

  const closeGallery = useCallback(() => setGallery(null), []);

  const onCardClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (isInsideLink(event.target)) return;
      const card = event.currentTarget;
      if (window.matchMedia(TOUCH_QUERY).matches && openFanRef.current !== card.dataset['target']) {
        setFan(card);
        return;
      }
      openFrom(card);
    },
    [openFrom, setFan],
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

  return { projects, openFan, gallery, closeGallery, onCardClick, onCardKeyDown };
};
