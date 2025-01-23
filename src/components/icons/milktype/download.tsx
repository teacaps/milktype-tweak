import {SVGProps} from 'react';

export const title = 'Download';
export const component = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 16 16" { ...props }>
    <path fill="currentColor"
          d="M8.5 1.3c.4 0 .7.3.7.7v6.4l2.2-2.2a.7.7 0 1 1 .9 1L9 10.4a.7.7 0 0 1-1 0L4.7 7a.7.7 0 1 1 1-1l2.1 2.3V2c0-.4.3-.7.7-.7Zm-6 8c.4 0 .7.3.7.7v2.7a.7.7 0 0 0 .6.6h9.4a.7.7 0 0 0 .6-.6V10a.7.7 0 0 1 1.4 0v2.7a2 2 0 0 1-2 2H3.8a2 2 0 0 1-2-2V10c0-.4.3-.7.7-.7Z"
    />
  </svg>
);
