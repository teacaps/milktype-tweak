import getIconColor from '../icons/get-icon-color';
import styled from 'styled-components';

export const Grid = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: min-content minmax(0, 1fr);
  > div {
    pointer-events: all;
  }
`;

export const Cell = styled.div``;

export const MenuCell = styled(Cell)``;

export const OverflowCell = styled(Cell)`
  overflow: auto;
  scrollbar-gutter: stable;
`;

export const SpanOverflowCell = styled(Cell)`
  overflow: auto;
  grid-column: span 2;
`;

export const SubmenuCell = styled(Cell)`
  padding: 0 2em;
`;

export const SubmenuOverflowCell = styled(SubmenuCell)`
  min-width: 80px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

export const SinglePaneFlexCell = styled(Cell)`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const ConfigureFlexCell = styled(SinglePaneFlexCell)`
  pointer-events: none;
  height: 500px;
`;

export const CategoryIconContainer = styled.span<{$selected?: boolean}>`
  position: relative;
  color: var(--color_inside-accent);
  height: 35px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$selected ? 'var(--color_accent)' : 'transparent'};
  border-radius: 10px;
  width: 40px;
  &:hover {
    color: ${(props) =>
      props.$selected ? 'var(--color_inside-accent)' : 'var(--color_accent)'};
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

export const IconContainer = styled.span`
  display: inline-block;
  text-align: center;
  width: 35px;
  position: relative;
  &:hover > span > div {
    background-color: red;
  }
`;

export const ControlRow = styled.div`
  position: relative;
  width: 100%;
  max-width: 960px;
  font-size: 20px;
  justify-content: space-between;
  display: flex;
  line-height: 50px;
  min-height: 50px;
  box-sizing: border-box;
  padding-left: 5px;
  padding-right: 5px;
  text-transform: lowercase;
`;

export const IndentedControlRow = styled(ControlRow)`
  padding-left: 17px;
`;

export const Label = styled.label`
  color: var(--color_label);
  font-weight: 400;
`;

export const SubLabel = styled(Label)`
  font-size: 18px;
  font-style: italic;
  font-weight: 400;
`;

export const Detail = styled.span`
  color: var(--color_accent);
  display: flex;
  align-items: center;
`;

export const Row = styled.div<{$selected: boolean}>`
  cursor: pointer;
  white-space: nowrap;
  margin-bottom: 15px;
  font-size: 20px;
  line-height: 20px;
  text-transform: lowercase;
  color: ${(props) => getIconColor(props.$selected).style.color};

  svg {
    height: 1.5rem;
    vertical-align: middle;
  }

  &:hover {
    color: var(--color-accent-80);
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

export const SubmenuRow = styled(Row)`
  padding: 4px 8px;
  font-weight: 400;
  min-width: min-content;
  border-color: transparent;
  margin-bottom: 11px;
  color: ${(props) =>
    props.$selected ? 'var(--color-accent-100)' : 'var(--color-dark-100)'};
`;
