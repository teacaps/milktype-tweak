import {SVGProps} from 'react';

export const title = 'Lightbulb';
export const component = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      d="M5.5 2a4.7 4.7 0 0 1 8 3.3c0 1-.4 2.1-1.2 2.8-.5.5-.7.9-.8 1.4a.7.7 0 1 1-1.3-.3 3.8 3.8 0 0 1 1.2-2c.5-.5.8-1.2.8-1.9a3.3 3.3 0 0 0-6.7 0c0 .6 0 1.2.8 1.9a4 4 0 0 1 1.2 2 .7.7 0 1 1-1.3.3C6 9 5.8 8.5 5.4 8c-1-1-1.2-2-1.2-2.8a5 5 0 0 1 1.3-3.3Zm.7 10c0-.4.3-.7.6-.7h4a.7.7 0 0 1 0 1.4h-4a.7.7 0 0 1-.6-.7Zm.6 2.7c0-.4.3-.7.7-.7h2.7a.7.7 0 0 1 0 1.3H7.5a.7.7 0 0 1-.7-.6Z"
    />
  </svg>
);
