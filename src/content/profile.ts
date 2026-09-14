/**
 * Everything personal lives here. Edit this file to make the page yours;
 * the components only render what they find below.
 */

export type PanelTone = 'paper' | 'red';
/** One phone screenshot with its real pixel size; the phone frames take this aspect ratio, so nothing is cropped. */
export interface Screenshot {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  /** Gallery alt text; falls back to "<project> screenshot <n>". */
  readonly alt?: string | undefined;
}
/** Three phone screenshots, fanned out behind the project card and extracted in the gallery. */
export type ScreenshotTriple = readonly [Screenshot, Screenshot, Screenshot];

/** Emphasis is visual only: signature skills are the big torn strips, core the red bars, support the small chips. */
export type SkillTier = 'signature' | 'core' | 'support';

export interface Skill {
  readonly name: string;
  readonly detail?: string;
  readonly tier: SkillTier;
}

export interface Project {
  readonly target: string;
  readonly name: string;
  readonly summary: string;
  readonly stack: ReadonlyArray<string>;
  readonly result: string;
  readonly tone: PanelTone;
  readonly screenshots: ScreenshotTriple;
}

export interface Experience {
  readonly contract: string;
  readonly years: string;
  readonly role: string;
  readonly company: string;
  readonly bullets: ReadonlyArray<string>;
}

export interface Social {
  readonly label: string;
  readonly href: string;
}

export interface Education {
  readonly school: string;
  readonly place: string;
}

export const name = 'Pablo Joral';
/** Square head-and-shoulders portrait; drop the file at `public/profile.jpg`. */
export const photo = { src: '/profile.jpg', alt: name } as const;
/** Optional papercut word pinned to the framed mugshot's corner (e.g. 'Hello'); an empty string shows no label. */
export const mugshotLabel = '';
export const tagline = 'Software Engineer · Mobile Engineering';
/** Papercut headline on the hero's torn sheet (the page's <h1>). */
export const heroHeadline = 'Ship your app';
/** Papercut headline on the contact scene's torn sheet, with the small label above it. */
export const contactHeadline = "Let's ship it";
export const contactKicker = 'Your next release starts here';
export const email = 'joralpablo@gmail.com';
export const lede =
  'Pablo — software engineer and React Native specialist. Seven years shipping mobile and full-stack products, from facility lighting control at Siemens to an interpretation app with thousands of active users. I steal the hearts of users with apps that feel native, ship fast, and never drop a frame.';

export const skills: ReadonlyArray<Skill> = [
  { name: 'React Native', tier: 'signature' },
  { name: 'TypeScript & React', tier: 'signature' },
  { name: 'CI/CD & store releases', tier: 'signature' },
  { name: 'State & data', detail: 'Zustand · TanStack Query', tier: 'core' },
  { name: 'Node.js', detail: 'Express · NestJS', tier: 'core' },
  { name: 'Expo', tier: 'core' },
  { name: 'OTA updates', tier: 'support' },
  { name: 'Native modules & deep linking', tier: 'support' },
  { name: 'Python', detail: 'Django · Flask', tier: 'support' },
  { name: 'AI workflows & MCP', tier: 'support' },
];

/** "Case file" notices for projects under NDA; point `screenshots` at real captures otherwise (see README). */
const CONFIDENTIAL_SCREENSHOTS: ScreenshotTriple = [
  { src: '/screenshots/confidential-1.svg', width: 390, height: 844 },
  { src: '/screenshots/confidential-2.svg', width: 390, height: 844 },
  { src: '/screenshots/confidential-3.svg', width: 390, height: 844 },
];

/** Toggled iQ, the product name of the Lighting Control app. */
const TOGGLED_IQ_SCREENSHOTS: ScreenshotTriple = [
  { src: '/screenshots/togglediq-1.jpg', width: 739, height: 1600, alt: 'Toggled iQ sign-in screen' },
  { src: '/screenshots/togglediq-2.jpg', width: 739, height: 1600, alt: 'Toggled iQ device groups' },
  { src: '/screenshots/togglediq-3.jpg', width: 739, height: 1600, alt: 'Toggled iQ users list' },
];

const TARJIMLY_SCREENSHOTS: ScreenshotTriple = [
  { src: '/screenshots/tarjimly-1.jpg', width: 661, height: 1323, alt: 'Tarjimly home screen with language request form' },
  { src: '/screenshots/tarjimly-2.jpg', width: 656, height: 1280, alt: 'Tarjimly chat with an interpreter' },
  { src: '/screenshots/tarjimly-3.jpg', width: 652, height: 1316, alt: 'Tarjimly trainings list' },
];

export const projects: ReadonlyArray<Project> = [
  {
    target: '01',
    name: 'Lighting Control',
    summary:
      'React Native app that runs automated lighting across entire facilities. Led the refactor to a feature-based architecture, then automated releases to Firebase, the App Store and Google Play.',
    stack: ['React Native', 'TypeScript', 'Zustand', 'TanStack Query', 'Fastlane'],
    result: 'Experimental voice assistant — AI transcription plus MCP tool calls — switches lighting zones hands-free.',
    tone: 'paper',
    screenshots: TOGGLED_IQ_SCREENSHOTS,
  },
  {
    target: '02',
    name: 'Tarjimly',
    summary:
      'Interpretation app connecting refugees with volunteer interpreters, fully released with thousands of active users. Led a complete redesign and refactor of the mobile app and built customizable in-app trainings.',
    stack: ['React Native', 'Node.js', 'Express', 'Python', 'Django', 'PostgreSQL'],
    result: 'Matching optimization took sessions from under 20 to over 1,000.',
    tone: 'red',
    screenshots: TARJIMLY_SCREENSHOTS,
  },
  {
    target: '03',
    name: 'Hotel Waste Ops',
    summary:
      'Architected and implemented a garbage-collection tracking system for a major hotel company, from field workflows to reporting.',
    stack: ['React Native', 'TypeScript', 'Node.js'],
    result: "Shipped as the operations backbone across the group's properties.",
    tone: 'red',
    screenshots: CONFIDENTIAL_SCREENSHOTS,
  },
  {
    target: '04',
    name: 'Table Service',
    summary: 'Redesigned and rebuilt a restaurant management and bookings app from the ground up.',
    stack: ['React Native', 'TypeScript'],
    result: 'Rebuilt end to end on a modern React Native stack.',
    tone: 'paper',
    screenshots: CONFIDENTIAL_SCREENSHOTS,
  },
];

export const experience: ReadonlyArray<Experience> = [
  {
    contract: '006',
    years: 'Jan 2026 – present',
    role: 'Software Engineer (React Native)',
    company: 'Siemens',
    bullets: [
      "Maintain and extend the lighting-control mobile app to enterprise-grade reliability standards after Siemens' acquisition of Altair.",
      'Ship new product features with product, design and backend teams.',
      'Built an experimental voice assistant using AI audio transcription and MCP for API calls, enabling hands-free control of lighting zones.',
    ],
  },
  {
    contract: '005',
    years: 'Mar 2025 – Jan 2026',
    role: 'Software Engineer (React Native)',
    company: 'Altair',
    bullets: [
      'Led a major refactor to a feature-based architecture aligned with updated product requirements.',
      'Automated the release pipeline to Firebase, the App Store and Google Play, cutting manual overhead and stabilizing delivery.',
    ],
  },
  {
    contract: '004',
    years: '2023 – Mar 2025',
    role: 'Software Engineer (React Native)',
    company: 'Plexus Tech',
    bullets: [
      'Led major React Native projects: a garbage-collection system for a major hotel company and a rebuilt restaurant management and bookings app.',
      'Advised and supported other teams on their React Native applications.',
    ],
  },
  {
    contract: '003',
    years: '2020 – 2023',
    role: 'Full-Stack Developer',
    company: 'Tarjimly',
    bullets: [
      'Led a complete redesign and refactor of the mobile app for a released interpretation product with thousands of active users.',
      'Optimized matching in Node.js and Python, growing sessions from under 20 to over 1,000; built customizable in-app trainings.',
    ],
  },
  {
    contract: '002',
    years: '2020',
    role: 'Full-Stack Developer',
    company: 'Ripio',
    bullets: [
      'Integrated a cryptocurrency wallet with a bank API for a debit-card product.',
      'Implemented functional and end-to-end testing in Django; contributed to the React web app.',
    ],
  },
  {
    contract: '001',
    years: '2019 – 2020',
    role: 'Full-Stack Developer',
    company: 'Sophilabs',
    bullets: [
      'Built an image-sharing solution for schools in React.',
      'Implemented Django middleware coordinating two ORM applications over SOAP.',
    ],
  },
];

export const education: ReadonlyArray<Education> = [
  { school: 'Universidad de la República', place: 'Montevideo, Uruguay' },
  { school: 'Cambridge University', place: 'First Certificate in English' },
];

export const socials: ReadonlyArray<Social> = [
  { label: 'GitHub', href: 'https://github.com/pablojoral' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pjoral/' },
];
