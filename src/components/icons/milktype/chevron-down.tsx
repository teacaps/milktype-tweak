import {SVGProps} from 'react';

export const title = 'ChevronDown';
export const component = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      d="M3.5 5.5a1 1 0 0 1 1 0L8 9.1l3.5-3.6a.7.7 0 1 1 1 1l-4 4a1 1 0 0 1-1 0l-4-4a.7.7 0 0 1 0-1Z"
    />
  </svg>
);
