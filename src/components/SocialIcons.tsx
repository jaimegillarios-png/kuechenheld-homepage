import type { JSX } from "react";

const paths: Record<string, JSX.Element> = {
  Facebook: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  ),
  Instagram: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Pinterest: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 0 0-3.65 19.31c-.09-.75-.17-1.9.04-2.72.19-.74 1.21-4.71 1.21-4.71s-.31-.62-.31-1.53c0-1.44.83-2.51 1.87-2.51.88 0 1.31.66 1.31 1.46 0 .89-.57 2.22-.86 3.45-.24 1.04.52 1.89 1.55 1.89 1.86 0 3.29-1.96 3.29-4.79 0-2.5-1.8-4.25-4.37-4.25-2.97 0-4.72 2.23-4.72 4.53 0 .9.35 1.86.78 2.38.09.1.1.19.07.3-.08.32-.25.99-.28 1.13-.05.19-.16.23-.36.14-1.35-.63-2.19-2.6-2.19-4.18 0-3.41 2.48-6.54 7.14-6.54 3.75 0 6.66 2.67 6.66 6.24 0 3.73-2.35 6.73-5.61 6.73-1.1 0-2.13-.57-2.48-1.25l-.68 2.58c-.24.94-.9 2.12-1.34 2.84A10 10 0 1 0 12 2Z" />
    </svg>
  ),
  LinkedIn: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9.5h4v11.5H3V9.5Zm6.5 0h3.83v1.57h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.77 2.5 4.77 5.75V21h-4v-5.2c0-1.24-.02-2.84-1.77-2.84-1.78 0-2.05 1.35-2.05 2.75V21h-4V9.5Z" />
    </svg>
  ),
};

export function SocialIcon({ name }: { name: string }) {
  return paths[name] ?? null;
}
