import { useCallback, useState } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { projects } from '../../content/profile.ts';
import type { Project } from '../../content/profile.ts';

export interface OpenGallery {
  readonly project: Project;
  /** The card that opened the gallery; focus returns here on close. */
  readonly opener: HTMLElement;
}

export interface MementoCardView {
  readonly project: Project;
  /** Timeline names for the touch scroll fan: own (`--tl-self`) and the card below (`--tl-next-1/-2`). */
  readonly style: CSSProperties;
  /** No card below in the one-column layout, so the fan folds on its own timeline. */
  readonly lastInOneColumn: boolean;
  /** No card below in the two-column layout (last row). */
  readonly lastInTwoColumns: boolean;
}

export interface MementosController {
  readonly cards: ReadonlyArray<MementoCardView>;
  /** `timeline-scope` names for the card list, so a card's shots can follow a sibling's timeline. */
  readonly cardsStyle: CSSProperties;
  readonly gallery: OpenGallery | null;
  readonly closeGallery: () => void;
  readonly onCardClick: (event: MouseEvent<HTMLElement>) => void;
  readonly onCardKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

const PROJECT_BY_TARGET: ReadonlyMap<string, Project> = new Map(projects.map((project) => [project.target, project]));

const timelineName = (index: number): string => `--memento-${index}`;

/*
 * The card "below" is index + 1 in one column and index + 2 in two columns; both are provided and
 * CSS picks per breakpoint. Custom properties carry the names because CSSProperties has no slot for them.
 */
const toCardView = (project: Project, index: number, all: ReadonlyArray<Project>): MementoCardView => ({
  project,
  style: {
    '--tl-self': timelineName(index),
    ...(index + 1 < all.length ? { '--tl-next-1': timelineName(index + 1) } : {}),
    ...(index + 2 < all.length ? { '--tl-next-2': timelineName(index + 2) } : {}),
  } as CSSProperties,
  lastInOneColumn: index + 1 >= all.length,
  lastInTwoColumns: index + 2 >= all.length,
});

const CARD_VIEWS: ReadonlyArray<MementoCardView> = projects.map(toCardView);
// Custom property: CSSProperties has no slot for it.
const CARDS_STYLE = { '--tl-scope': projects.map((_, i) => timelineName(i)).join(', ') } as CSSProperties;

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

  return { cards: CARD_VIEWS, cardsStyle: CARDS_STYLE, gallery, closeGallery, onCardClick, onCardKeyDown };
};
