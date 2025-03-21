import styled from 'styled-components';

export const Button = styled.div`
  display: flex;
  transition: transform 0.2s ease-out;
  user-select: none;
  color: #717070;
  width: 45px;
  height: 45px;
  padding: 2px;
  margin: 2px;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  white-space: pre-wrap;
  &:hover {
    transform: translate3d(0, -2px, 0);
  }
`;

export default Button;
