import {SVGProps} from 'react';

export const title = 'Display';
export const component = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      d="M3.3 2.7a.7.7 0 0 0-.6.6v1.4a.7.7 0 0 1-1.4 0V3.3a2 2 0 0 1 2-2h1.4a.7.7 0 1 1 0 1.4H3.3Zm7.4-.7c0-.4.3-.7.6-.7h1.4a2 2 0 0 1 2 2v1.4a.7.7 0 1 1-1.4 0V3.3a.7.7 0 0 0-.6-.6h-1.4a.7.7 0 0 1-.6-.7ZM2 10.7c.4 0 .7.3.7.6v1.4a.7.7 0 0 0 .6.6h1.4a.7.7 0 0 1 0 1.4H3.3a2 2 0 0 1-2-2v-1.4c0-.3.3-.6.7-.6Zm12 0c.4 0 .7.3.7.6v1.4a2 2 0 0 1-2 2h-1.4a.7.7 0 1 1 0-1.4h1.4a.7.7 0 0 0 .6-.6v-1.4c0-.3.3-.6.7-.6ZM4 6c0-.7.6-1.3 1.3-1.3h5.4c.7 0 1.3.6 1.3 1.3v4c0 .7-.6 1.3-1.3 1.3H5.3c-.7 0-1.3-.6-1.3-1.3V6Zm6.7 0H5.3v4h5.4V6Z"
    />
  </svg>
);
