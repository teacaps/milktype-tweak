import styled from 'styled-components';
import {BobaKnob} from '../../../assets/BobaKnob';

const EncoderKeyContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 52px;
  opacity: 1;
  height: 52px;
  &:hover {
    z-index: 1;
  }
`;

const EncoderKeyContent2 = styled(BobaKnob)<{
  $innerPadding: number;
  $size: number;
}>`
  --size: ${(p) => p.$size}px;
  min-width: var(--size);
  min-height: var(--size);

  transition: transform 0.5s ease-out;
  transform: rotate(0);
  box-sizing: border-box;
  &:hover {
    transform: rotate(450deg);
  }
`;

export const EncoderKey = (props: {
  size: number;
  style: React.CSSProperties;
  onClick: (evt: React.MouseEvent) => void;
}) => {
  return (
    <EncoderKeyContainer onClick={props.onClick} style={props.style}>
      <EncoderKeyContent2
        $size={props.size && +props.size}
        $innerPadding={(5 * props.size) / 52}
      />
    </EncoderKeyContainer>
  );
};
