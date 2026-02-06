import styled from 'styled-components'
import colors from 'consts/colors'

export const StyledInputWrapper = styled.div<{
  $hasIcon: boolean
  $fullWidth: boolean
  $hasError: boolean
}>`
  position: relative;
  display: flex;
  align-items: center;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  .icon {
    position: absolute;
    left: 12px;
    color: #9ca3af;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .error-message {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: ${colors.colorError};
  }
`

export const StyledInput = styled.input<{ $hasIcon?: boolean; $hasError?: boolean }>`
  width: 100%;
  padding: ${({ $hasIcon }) =>
    $hasIcon ? '10px 12px 10px 40px' : '10px 12px'};
  border: 1px solid
    ${({ $hasError }) => ($hasError ? colors.colorError : '#d1d5db')};
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? colors.colorError : colors.button};
    box-shadow: 0 0 0 2px
      ${({ $hasError }) =>
        $hasError ? 'rgba(239, 68, 68, 0.2)' : 'rgba(37, 99, 235, 0.2)'};
  }

  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    color: #9ca3af;
  }

  &:hover:not(:disabled) {
    border-color: #9ca3af;
  }
`
