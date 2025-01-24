import React, {useMemo} from 'react';
import styled from 'styled-components';
import {Link, useLocation} from 'wouter';
import PANES from '../../utils/pane-config';
import {useAppSelector} from 'src/store/hooks';
import {getShowDesignTab} from 'src/store/settingsSlice';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {CategoryMenuTooltip} from '../inputs/tooltip';
import {CategoryIconContainer} from '../panes/grid';
import {ErrorLink, ErrorsPaneConfig} from '../panes/errors';
import {ExternalLinks} from './external-links';
import {TweakLogo} from '../icons/milktype';

const Container = styled.div`
  width: 100vw;
  height: 25px;
  padding: 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const {DEBUG_PROD, MODE, DEV} = import.meta.env;
const showDebugPane = MODE === 'development' || DEBUG_PROD === 'true' || DEV;

const GlobalContainer = styled(Container)`
  background: var(--color-white-100);
  column-gap: 20px;
`;

export const UnconnectedGlobalMenu = () => {
  const showDesignTab = useAppSelector(getShowDesignTab);

  const [location] = useLocation();

  const Panes = useMemo(() => {
    return PANES.filter((pane) => pane.key !== ErrorsPaneConfig.key).map(
      (pane) => {
        if (pane.key === 'design' && !showDesignTab) return null;
        if (pane.key === 'debug' && !showDebugPane) return null;
        return (
          <Link key={pane.key} to={pane.path}>
            <CategoryIconContainer $selected={pane.path === location}>
              <FontAwesomeIcon size={'xl'} icon={pane.icon} />
              <CategoryMenuTooltip>{pane.title}</CategoryMenuTooltip>
            </CategoryIconContainer>
          </Link>
        );
      },
    );
  }, [location, showDesignTab]);

  return (
    <React.Fragment>
      <GlobalContainer>
        <TweakLogo height={24} />
        {/*<ErrorLink />*/}
        {/*{Panes}*/}
        {/*<ExternalLinks />*/}
      </GlobalContainer>
    </React.Fragment>
  );
};
