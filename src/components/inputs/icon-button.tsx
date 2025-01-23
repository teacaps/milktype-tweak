import styled from 'styled-components';

export const IconButton = styled.button`
  appearance: none;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em;
  background: transparent;
  border: none;
  cursor: pointer;
  line-height: initial;
  font-size: initial;
  color: ${(props) =>
    props.disabled ? 'var(--bg_control)' : 'var(--color_accent)'};
  border-color: ${(props) =>
    props.disabled ? 'var(--bg_control)' : 'var(--color_accent)'};
  &:disabled {
    cursor: not-allowed;
    border-right: 1px solid var(--border_color_icon);
    cursor: not-allowed;
    background: var(--bg_menu);
  }
  &:hover {
    color: ${(props) =>
      props.disabled ? 'var(--bg_control)' : 'var(--color_inside-accent)'};
    background-color: ${(props) =>
      props.disabled ? 'var(--bg_menu)' : 'var(--color_accent)'};
  }

  svg {
    color: ${(props) =>
      props.disabled ? 'var(--bg_control)' : 'var(--color-white-100)'};
  }
  &:hover {
    svg {
      color: ${(props) =>
        props.disabled ? 'var(--bg_control)' : 'var(--color_inside-accent)'};
    }

    color: var(--color_label-highlighted);
    & .tooltip {
      transform: scale(1) translateX(0px);
      opacity: 1;
    }
  }
  .tooltip {
    transform: translateX(-5px) scale(0.6);
    opacity: 0;
  }
`;

export const IconButtonUnfilledContainer = styled(IconButton)`
  cursor: pointer;
  background: inherit;
  display: inline-flex;
`;

export const IconButtonContainer = styled(IconButton)`
  cursor: pointer;
  background: var(--bg_button);
  border-radius: 4px;
`;

export const IconToggleContainer = styled(IconButton)<{$selected: boolean}>`
  cursor: pointer;
  transition: all 0.4s ease;
  background: ${(props) =>
    props.$selected ? 'var(--color_accent)' : 'var(--bg_menu)'};
  svg {
    color: ${(props) =>
      props.$selected ? 'var(--color_inside-accent)' : 'var(--bg_icon)'};
  }
  &:hover {
    background: ${(props) =>
      props.$selected ? 'var(--color_accent)' : 'var(--bg_menu)'};
    svg {
      color: ${(props) =>
        props.$selected ? 'var(--color_inside-accent)' : 'var(--bg_icon)'};
    }
  }
`;
