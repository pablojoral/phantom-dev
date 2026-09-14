import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '../../content/profile.ts';
import { cx } from '../../utils/cx.ts';
import type { FanPosition } from '../Mementos/useScreenshotFan.ts';
import { useGallery } from './useGallery.ts';
import styles from './Gallery.module.css';

export interface GalleryProps {
  readonly project: Project;
  /** The card that opened the gallery; focus returns here on close. */
  readonly opener: HTMLElement;
  readonly onClose: () => void;
}

const POSITION_CLASS: Readonly<Record<FanPosition, string | undefined>> = {
  1: styles.phone1,
  2: styles.phone2,
  3: styles.phone3,
};

// `--i` drives the extraction stagger in CSS; CSSProperties has no slot for custom properties.
const staggerStyle = (index: number): CSSProperties => ({ '--i': index }) as CSSProperties;

export const Gallery = ({ project, opener, onClose }: GalleryProps) => {
  const { headingId, shots, dialogRef, closeRef, onKeyDown, onBackdropClick } = useGallery({ project, opener, onClose });
  return createPortal(
    <div
      ref={dialogRef}
      className={styles.gallery}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      onKeyDown={onKeyDown}
      onClick={onBackdropClick}
    >
      <div className={styles.head}>
        <p className={styles.label}>
          <span>Memento · Target {project.target}</span>
        </p>
        <h2 id={headingId} className={styles.title}>
          <span>{project.name}</span>
        </h2>
      </div>
      <ul className={styles.row}>
        {shots.map((shot) => (
          <li key={shot.key} className={cx(styles.phone, POSITION_CLASS[shot.position])} style={staggerStyle(shot.position - 1)}>
            <div className={styles.frame}>
              <img
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                style={{ aspectRatio: shot.ratio }}
                decoding="async"
              />
            </div>
            <span className={styles.caption}>
              <span>0{shot.position}</span>
            </span>
          </li>
        ))}
      </ul>
      <button ref={closeRef} className={styles.close} type="button" aria-label="Close gallery" onClick={onClose}>
        <span aria-hidden="true">X</span>
      </button>
    </div>,
    document.body,
  );
};
