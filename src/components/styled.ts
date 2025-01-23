import styled from 'styled-components';

export const Message = styled.span`
  text-transform: lowercase;
  margin-top: 12px;
  display: inline-block;
  text-align: center;
`;

export const ErrorMessage = styled(Message)`
  color: #d15e5e;
`;

export const SuccessMessage = styled(Message)`
  color: #9ab46a;
`;
