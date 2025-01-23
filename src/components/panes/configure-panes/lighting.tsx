import React, {useState} from 'react';
import styled from 'styled-components';
import {OverflowCell, SubmenuOverflowCell, SubmenuRow} from '../grid';
import {CenterPane, PaneSelector} from '../pane';
import {title} from '../../icons/lightbulb';
import {GeneralPane} from './submenus/lighting/general';
import {
  LayoutConfigValues,
  Pane as LayoutPane,
} from './submenus/lighting/layout';
import {
  AdvancedLightingValues,
  AdvancedPane,
} from './submenus/lighting/advanced';
import {getLightingDefinition, isVIADefinitionV2} from '@the-via/reader';
import {useAppSelector} from 'src/store/hooks';
import {getSelectedDefinition} from 'src/store/definitionsSlice';
import {LightbulbIcon} from '../../icons/milktype/index';

export const Category = {
  General: {label: 'General', Menu: GeneralPane},
  Layout: {label: 'Layout', Menu: LayoutPane},
  Advanced: {label: 'Advanced', Menu: AdvancedPane},
};

const LightingPane = styled(CenterPane)`
  height: 100%;
  background: var(--color_dark_grey);
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 0 12px;
`;

const MenuContainer = styled.div`
  padding: 15px 20px 20px 10px;
`;

export const Pane = () => {
  const selectedDefinition = useAppSelector(getSelectedDefinition);

  const [selectedCategory, setSelectedCategory] = useState(Category.General);

  const getMenus = () => {
    if (!isVIADefinitionV2(selectedDefinition)) {
      throw new Error(
        'This lighting component is only compatible with v2 definitions',
      );
    }

    const hasLayouts = LayoutConfigValues.some(
      (value) =>
        getLightingDefinition(
          selectedDefinition.lighting,
        ).supportedLightingValues.indexOf(value) !== -1,
    );
    const hasAdvanced = AdvancedLightingValues.some(
      (value) =>
        getLightingDefinition(
          selectedDefinition.lighting,
        ).supportedLightingValues.indexOf(value) !== -1,
    );

    return [
      Category.General,
      ...(hasLayouts ? [Category.Layout] : []),
      ...(hasAdvanced ? [Category.Advanced] : []),
    ].filter(({Menu}) => !!Menu);
  };

  return (
    <>
      <SubmenuOverflowCell>
        <PaneSelector />
        <MenuContainer>
          {getMenus().map((menu) => (
            <SubmenuRow
              $selected={selectedCategory === menu}
              onClick={() => setSelectedCategory(menu)}
              key={menu.label}
            >
              {menu.label}
            </SubmenuRow>
          ))}
        </MenuContainer>
      </SubmenuOverflowCell>
      <OverflowCell>
        <LightingPane>
          <Container>
            <selectedCategory.Menu />
          </Container>
        </LightingPane>
      </OverflowCell>
    </>
  );
};

export const Icon = LightbulbIcon;
export const Title = title;
