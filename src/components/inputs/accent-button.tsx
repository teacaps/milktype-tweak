import styled from 'styled-components';

type AccentButtonProps = {
  disabled?: boolean;
  onClick?: (...a: any[]) => void;
};

const AccentButtonBase = styled.button<AccentButtonProps>`
  height: 36px;
  padding: 0 15px;
  min-width: 100px;
  outline: none;
  border: 0;
  font-size: 20px;
  border-radius: 16px;
  color: var(--color_accent);
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
`;
export const AccentButton = styled(AccentButtonBase)`
  background-color: ${(props) =>
    props.disabled ? 'var(--color-dark-100)' : 'var(--color-accent-100)'};
  color: ${(props) =>
    props.disabled ? 'var(--color-white-60)' : 'var(--color-white-100)'};
  &:hover {
    background-color: ${(props) =>
      props.disabled ? 'var(--color-dark-100)' : 'var(--color-accent-80)'};
  }
`;
export const AccentButtonLarge = styled(AccentButton)`
  font-size: 22px;
  line-height: 48px;
  height: 48px;
`;

export const PrimaryAccentButton = styled(AccentButtonBase)`
  color: ${(props) =>
    props.disabled ? 'var(--bg_control)' : 'var(--color_inside-accent)'};
  border-color: ${(props) =>
    props.disabled ? 'var(--bg_control)' : 'var(--color_accent)'};
  background-color: ${(props) =>
    props.disabled ? 'transparent' : 'var(--color_accent)'};
  &:hover {
    filter: brightness(0.7);
  }
`;
