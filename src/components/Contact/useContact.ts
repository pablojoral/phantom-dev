import { useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { email, socials } from '../../content/profile.ts';
import type { Social } from '../../content/profile.ts';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard.ts';
import type { CopyToClipboard } from '../../hooks/useCopyToClipboard.ts';

export const EMAIL_TEXT_ID = 'email-text';
export const COPY_STATUS_ID = 'copy-status';

export interface ProfileField {
  readonly key: string;
  /** Lowercase field label, e.g. `github`. */
  readonly label: string;
  readonly href: string;
  /** Host (without `www.`) plus path, e.g. `github.com/pablojoral`. */
  readonly display: string;
}

export interface ContactController extends CopyToClipboard {
  readonly email: string;
  readonly mailto: string;
  readonly profiles: ReadonlyArray<ProfileField>;
  readonly emailRef: RefObject<HTMLSpanElement | null>;
}

export const displayUrl = (href: string): string => {
  try {
    const url = new URL(href);
    return `${url.hostname.replace(/^www\./, '')}${url.pathname.replace(/\/$/, '')}`;
  } catch {
    return href;
  }
};

const toProfileField = (social: Social): ProfileField => ({
  key: social.href,
  label: social.label.toLowerCase(),
  href: social.href,
  display: displayUrl(social.href),
});

export const useContact = (): ContactController => {
  const emailRef = useRef<HTMLSpanElement>(null);
  const clipboard = useCopyToClipboard({ text: email, selectionRef: emailRef });
  const profiles = useMemo(() => socials.map(toProfileField), []);
  return { ...clipboard, email, mailto: `mailto:${email}`, profiles, emailRef };
};
