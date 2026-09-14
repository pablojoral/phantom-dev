import { useCallback, useMemo, useState } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { isConfidential, projects } from '../../content/profile.ts';
import type { Project, ScreenshotTriple, ShowcaseProject } from '../../content/profile.ts';
import { useClassifiedNotice } from './useClassifiedNotice.ts';
import type { ClassifiedNotice } from './useClassifiedNotice.ts';
import { TOUCH_QUERY, useFanDismiss } from './useFanDismiss.ts';
import { useFanState } from './useFanState.ts';

export interface OpenGallery {
  readonly project: ShowcaseProject;
  /** The card that opened the gallery; focus returns here on close. */
  readonly opener: HTMLElement;
}

export interface MementoCardView {
  readonly project: Project;
  /** Under NDA: no fan, no gallery; one activation shows the classified notice. */
  readonly confidential: boolean;
  /** The fan's screenshots; null for confidential projects, which render no fan. */
  readonly screenshots: ScreenshotTriple | null;
  /** Touch only: this card's fan is shown (at most one card at a time). */
  readonly fanOpen: boolean;
  /** Touch only: this card's fan is folding back; the card stays raised until it finishes. */
  readonly fanClosing: boolean;
  /** Mouse only: the pointer just left this card; it stays raised while the hover fan folds. */
  readonly hoverClosing: boolean;
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
  readonly onCardPointerEnter: (event: PointerEvent<HTMLElement>) => void;
  readonly onCardPointerLeave: (event: PointerEvent<HTMLElement>) => void;
}

const PROJECT_BY_TARGET: ReadonlyMap<string, Project> = new Map(projects.map((project) => [project.target, project]));

const HINT_GALLERY = 'Tap to preview screenshots, tap again to open them';
const HINT_CONFIDENTIAL = 'Screenshots are confidential';

const isInsideLink = (target: EventTarget | null): boolean =>
  target instanceof Element && target.closest('a') !== null;

/**
 * Cards carry `data-target`; one stable handler pair serves every card. Mouse and keyboard open the
 * gallery directly (the fan is a hover effect there). On touch the first tap shows the card's fan and
 * a second tap on the same card opens the gallery. Confidential projects have no fan and never open a
 * gallery: a single activation (click, tap, Enter/Space) shakes the card and shows the classified notice.
 */
export const useMementos = (): MementosController => {
  const [gallery, setGallery] = useState<OpenGallery | null>(null);
  const fan = useFanState();
  const { openFan, closingFan, hoverClosing, openFanRef, fanCardRef, openCardFan, closeFan } = fan;
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
      const target = card.dataset['target'];
      const project = PROJECT_BY_TARGET.get(target ?? '');
      const hasFan = project !== undefined && !isConfidential(project);
      if (hasFan && window.matchMedia(TOUCH_QUERY).matches && openFanRef.current !== target) {
        openCardFan(card);
        return;
      }
      openFrom(card);
    },
    [openFrom, openCardFan, openFanRef, dismissNoticeFor],
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

  /** Only cards with a fan keep the hover-out raised state. */
  const { onCardPointerLeave: onFanPointerLeave } = fan;
  const onCardPointerLeave = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const project = PROJECT_BY_TARGET.get(event.currentTarget.dataset['target'] ?? '');
      if (project !== undefined && !isConfidential(project)) onFanPointerLeave(event);
    },
    [onFanPointerLeave],
  );

  const cards = useMemo(
    () =>
      projects.map((project): MementoCardView => {
        const confidential = isConfidential(project);
        return {
          project,
          confidential,
          screenshots: isConfidential(project) ? null : project.screenshots,
          fanOpen: !confidential && openFan === project.target,
          fanClosing: !confidential && closingFan === project.target,
          hoverClosing: !confidential && hoverClosing === project.target,
          notice: notice?.target === project.target ? notice : null,
          hint: confidential ? HINT_CONFIDENTIAL : HINT_GALLERY,
        };
      }),
    [openFan, closingFan, hoverClosing, notice],
  );

  return {
    cards,
    gallery,
    closeGallery,
    announcement,
    onCardClick,
    onCardKeyDown,
    onCardPointerEnter: fan.onCardPointerEnter,
    onCardPointerLeave: onCardPointerLeave,
  };
};
