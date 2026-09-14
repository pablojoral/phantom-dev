import { useCallback, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { isConfidential, projects } from '../../content/profile.ts';
import type { Project } from '../../content/profile.ts';
import { useClassifiedNotice } from './useClassifiedNotice.ts';
import type { ClassifiedNotice } from './useClassifiedNotice.ts';
import { TOUCH_QUERY, useFanDismiss } from './useFanDismiss.ts';

export interface OpenGallery {
  readonly project: Project;
  /** The card that opened the gallery; focus returns here on close. */
  readonly opener: HTMLElement;
}

export interface MementoCardView {
  readonly project: Project;
  /** Placeholder screenshots: the card shows the classified notice instead of opening a gallery. */
  readonly confidential: boolean;
  /** Touch only: this card's fan is shown (at most one card at a time). */
  readonly fanOpen: boolean;
  /** The classified notice on this card, if it is showing one. */
  readonly notice: ClassifiedNotice | null;
  /** Visually hidden hint read with the card. */
  readonly hint: string;
}

export interface MementosController {
  readonly cards: ReadonlyArray<MementoCardView>;
  readonly gallery: OpenGallery | null;
  readonly closeGallery: () => void;
  /** Polite live-region text announcing that notice. */
  readonly announcement: string;
  readonly onCardClick: (event: MouseEvent<HTMLElement>) => void;
  readonly onCardKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

const PROJECT_BY_TARGET: ReadonlyMap<string, Project> = new Map(projects.map((project) => [project.target, project]));

const HINT_GALLERY = 'Tap to preview screenshots, tap again to open them';
const HINT_CONFIDENTIAL = 'Screenshots are confidential';

const isInsideLink = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest('a') !== null;

/**
 * Cards carry `data-target`; one stable handler pair serves every card. Mouse and keyboard open the
 * gallery directly (the fan is a hover effect there). On touch the first tap shows the card's fan and
 * a second tap on the same card opens the gallery. Confidential (placeholder) projects never open one:
 * the same activation shakes the card and shows the classified notice instead.
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

  const { notice, announcement, show: showNotice, hide: hideNotice } = useClassifiedNotice();
  const noticeTarget = notice !== null && !notice.leaving ? notice.target : null;

  /** Activating a different card closes the notice. */
  const dismissNoticeFor = useCallback(
    (card: HTMLElement) => {
      if (noticeTarget !== null && noticeTarget !== card.dataset['target']) hideNotice();
    },
    [noticeTarget, hideNotice],
  );

  const openFrom = useCallback(
    (card: HTMLElement) => {
      closeFan();
      const project = PROJECT_BY_TARGET.get(card.dataset['target'] ?? '');
      if (project === undefined) return;
      if (isConfidential(project)) {
        showNotice(project.target);
        return;
      }
      setGallery({ project, opener: card });
    },
    [closeFan, showNotice],
  );

  const closeGallery = useCallback(() => setGallery(null), []);

  const onCardClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (isInsideLink(event.target)) return;
      const card = event.currentTarget;
      dismissNoticeFor(card);
      if (window.matchMedia(TOUCH_QUERY).matches && openFanRef.current !== card.dataset['target']) {
        setFan(card);
        return;
      }
      openFrom(card);
    },
    [openFrom, setFan, dismissNoticeFor],
  );

  const onCardKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return;
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      dismissNoticeFor(event.currentTarget);
      openFrom(event.currentTarget);
    },
    [openFrom, dismissNoticeFor],
  );

  const cards = useMemo(
    () =>
      projects.map((project): MementoCardView => {
        const confidential = isConfidential(project);
        return {
          project,
          confidential,
          fanOpen: openFan === project.target,
          notice: notice?.target === project.target ? notice : null,
          hint: confidential ? HINT_CONFIDENTIAL : HINT_GALLERY,
        };
      }),
    [openFan, notice],
  );

  return { cards, gallery, closeGallery, announcement, onCardClick, onCardKeyDown };
};
