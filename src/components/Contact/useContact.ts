import { useRef } from 'react';
import type { RefObject } from 'react';
import { email, socials } from '../../content/profile.ts';
import type { Social } from '../../content/profile.ts';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard.ts';
import type { CopyToClipboard } from '../../hooks/useCopyToClipboard.ts';

export const EMAIL_TEXT_ID = 'email-text';
export const COPY_STATUS_ID = 'copy-status';

export interface ContactController extends CopyToClipboard {
  readonly email: string;
  readonly mailto: string;
  readonly socials: ReadonlyArray<Social>;
  readonly emailRef: RefObject<HTMLSpanElement | null>;
}

export const useContact = (): ContactController => {
  const emailRef = useRef<HTMLSpanElement>(null);
  const clipboard = useCopyToClipboard({ text: email, selectionRef: emailRef });
  return { ...clipboard, email, mailto: `mailto:${email}`, socials, emailRef };
};
