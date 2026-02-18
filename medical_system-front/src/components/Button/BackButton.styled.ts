import styled from 'styled-components'
import colors from 'consts/colors'

export const StyledBackButton = styled.button`
  top: 16px;
  left: 16px;
  background: none;
  border: none;
  color: ${colors.secondColorText};
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;

  &:hover:not(:disabled) {
    color: #444444;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
