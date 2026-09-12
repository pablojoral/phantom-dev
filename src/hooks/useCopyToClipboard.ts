import { useCallback, useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

const COPIED_RESET_MS = 1500;

type CopyStatus = 'idle' | 'copied' | 'failed';

interface CopyPresentation {
  readonly label: string;
  readonly announcement: string;
}

const PRESENTATION: Readonly<Record<CopyStatus, CopyPresentation>> = {
  idle: { label: 'Copy', announcement: '' },
  copied: { label: 'Copied', announcement: 'Copied' },
  failed: {
    label: 'Select & copy',
    announcement: 'Copy failed. The address is selected; copy it manually.',
  },
};

export interface UseCopyToClipboardOptions {
  readonly text: string;
  /** Element whose contents get selected when every copy strategy fails. */
  readonly selectionRef: RefObject<HTMLElement | null>;
}

export interface CopyToClipboard extends CopyPresentation {
  readonly copy: () => void;
}

const legacyCopy = (text: string): boolean => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.className = 'vh';
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
};

const selectContents = (element: HTMLElement | null) => {
  if (element === null) {
    return;
  }
  const range = document.createRange();
  range.selectNodeContents(element);
  const selection = window.getSelection();
  if (selection === null) {
    return;
  }
  selection.removeAllRanges();
  selection.addRange(range);
};

/**
 * Clipboard API first, `execCommand('copy')` second, and as a last resort the
 * address is selected so the user can copy it by hand. "Copied" reverts to
 * "Copy" after 1.5s; a repeat click restarts that timer.
 */
export const useCopyToClipboard = ({ text, selectionRef }: UseCopyToClipboardOptions): CopyToClipboard => {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timerRef = useRef(0);

  const clearTimer = useCallback(() => {
    window.clearTimeout(timerRef.current);
  }, []);

  const markCopied = useCallback(() => {
    clearTimer();
    setStatus('copied');
    timerRef.current = window.setTimeout(() => setStatus('idle'), COPIED_RESET_MS);
  }, [clearTimer]);

  const markFailed = useCallback(() => {
    clearTimer();
    selectContents(selectionRef.current);
    setStatus('failed');
  }, [clearTimer, selectionRef]);

  const copy = useCallback(() => {
    const clipboard: Clipboard | undefined = navigator.clipboard;
    if (clipboard !== undefined && typeof clipboard.writeText === 'function') {
      clipboard.writeText(text).then(markCopied, () => {
        if (legacyCopy(text)) {
          markCopied();
        } else {
          markFailed();
        }
      });
    } else if (legacyCopy(text)) {
      markCopied();
    } else {
      markFailed();
    }
  }, [text, markCopied, markFailed]);

  useEffect(() => clearTimer, [clearTimer]);

  return { ...PRESENTATION[status], copy };
};
