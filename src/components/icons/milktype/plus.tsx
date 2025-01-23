import {SVGProps} from 'react';

export const title = 'Plus';
export const component = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      d="M8 2.7c.4 0 .7.3.7.6v4h4a.7.7 0 1 1 0 1.4h-4v4a.7.7 0 1 1-1.4 0v-4h-4a.7.7 0 1 1 0-1.4h4v-4c0-.3.3-.6.7-.6Z"
    />
  </svg>
);
