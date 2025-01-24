import styled from 'styled-components';

const LoadingText = styled.div`
  font-size: 22px;
  color: var(--color-dark-100);
`;

enum LoadingLabel {
  Searching = 'searching for devices...',
  Loading = 'loading...',
}

type Props = {
  isSearching: boolean;
};

export default function (props: Props) {
  return (
    <LoadingText data-tid="loading-message">
      {props.isSearching ? LoadingLabel.Searching : LoadingLabel.Loading}
    </LoadingText>
  );
}
