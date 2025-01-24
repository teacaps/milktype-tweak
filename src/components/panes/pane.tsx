import styled from 'styled-components';
import {IconContainer, Row} from './grid';
import {IconButtonTooltip} from '../inputs/tooltip';
import React, {createContext} from 'react';

export type PaneProps = {
  menus: Array<{Icon: (props: any) => JSX.Element | null; Title: string}>;
  selected: number;
  setRow: (row: number) => void;
};

export const Pane = styled.div`
  background: var(--gradient);
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--gradient);
`;

export const CenterPane = styled(Pane)`
  overflow: auto;
  display: block;
`;

export const ConfigureBasePane = styled(Pane)`
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  background: transparent;
  pointer-events: none;
  z-index: 3;
`;

const PaneSelectorContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-top: 32px;
`;

export const PaneContext = createContext<PaneProps>({
  menus: [],
  selected: 0,
  setRow: () => {},
});

export const PaneSelector = () => {
  const {menus, selected, setRow} = React.useContext(PaneContext);
  return (
    <PaneSelectorContainer>
      {(menus || []).map(({Icon, Title}, idx: number) => (
        <Row
          key={idx}
          onClick={(_) => setRow(idx)}
          $selected={selected === idx}
        >
          <IconContainer>
            <Icon />
            <IconButtonTooltip>{Title}</IconButtonTooltip>
          </IconContainer>
        </Row>
      ))}
    </PaneSelectorContainer>
  );
};
