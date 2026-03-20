import styled from 'styled-components'
import colors from 'consts/colors'

export const AppButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${colors.button};
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.15s,
    transform 0.15s,
    box-shadow 0.15s;

  &:hover:not(:disabled) {
    background: ${colors.buttonHover};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
