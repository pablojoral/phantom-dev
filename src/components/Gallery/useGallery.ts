import { useCallback, useEffect, useRef } from 'react';
import type { KeyboardEvent, MouseEvent, RefObject } from 'react';
import type { Project } from '../../content/profile.ts';
import { useScreenshotFan } from '../Mementos/useScreenshotFan.ts';
import type { FanShot } from '../Mementos/useScreenshotFan.ts';

const BODY_LOCK_CLASS = 'gallery-open';
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface GalleryOptions {
  readonly project: Project;
  readonly opener: HTMLElement;
  readonly onClose: () => void;
}

export interface GalleryController {
  readonly headingId: string;
  readonly shots: ReadonlyArray<FanShot>;
  readonly dialogRef: RefObject<HTMLDivElement | null>;
  readonly closeRef: RefObject<HTMLButtonElement | null>;
  readonly onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  readonly onBackdropClick: (event: MouseEvent<HTMLDivElement>) => void;
}

/**
 * Modal plumbing for the gallery: body scroll lock, focus into the close button,
 * a minimal Tab trap, Escape / backdrop to close, focus back to the opener on unmount.
 */
export const useGallery = ({ project, opener, onClose }: GalleryOptions): GalleryController => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const shots = useScreenshotFan(project.screenshots, project.name);

  useEffect(() => {
    document.body.classList.add(BODY_LOCK_CLASS);
    closeRef.current?.focus();
    return () => {
      document.body.classList.remove(BODY_LOCK_CLASS);
      opener.focus();
    };
  }, [opener]);

  useEffect(() => {
    const onDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onDocumentKeyDown);
    return () => document.removeEventListener('keydown', onDocumentKeyDown);
  }, [onClose]);

  const onKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || dialogRef.current === null) return;
    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (first === undefined || last === undefined) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  const onBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  return { headingId: `gallery-${project.target}-h`, shots, dialogRef, closeRef, onKeyDown, onBackdropClick };
};
