import React from 'react';
import {IconButtonContainer} from './icon-button';
type Props = {
  onLoad: (files: File[]) => void;
  multiple?: boolean;
  inputRef?: React.MutableRefObject<HTMLInputElement | undefined>;
  children: React.ReactNode;
};

export function UploadButton(props: Props) {
  const input = props.inputRef || React.useRef<HTMLInputElement>();
  function onChange(e: any) {
    props.onLoad(e.target.files as File[]);
    (input.current as any).value = null;
  }
  return (
    <IconButtonContainer onClick={() => input.current && input.current.click()}>
      {props.children}
      <input
        ref={input as any}
        type="file"
        multiple={props.multiple}
        accept="application/json"
        style={{display: 'none'}}
        onChange={onChange}
      />
    </IconButtonContainer>
  );
}
