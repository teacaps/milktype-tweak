import {SVGProps} from 'react';

export const title = 'Load';
export const component = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="none" viewBox="0 0 16 16" {...props}>
    <path fill="currentColor"
          d="m8.5 1.3.5.2L12.3 5a.7.7 0 1 1-1 .9l-2-2.3V10a.7.7 0 1 1-1.4 0V3.6L5.6 5.8a.7.7 0 1 1-1-1L8 1.6l.5-.2Zm-6 8c.4 0 .7.3.7.7v2.7a.7.7 0 0 0 .6.6h9.4a.7.7 0 0 0 .6-.6V10a.7.7 0 0 1 1.4 0v2.7a2 2 0 0 1-2 2H3.8a2 2 0 0 1-2-2V10c0-.4.3-.7.7-.7Z"
           />
  </svg>
);
