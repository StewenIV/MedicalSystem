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

export const StyledInput = styled.input<{
  $hasIcon?: boolean
  $hasError?: boolean
  $hasPasswordToggle?: boolean
}>`
  width: 100%;
  padding: ${({ $hasIcon, $hasPasswordToggle }) => {
    if ($hasIcon && $hasPasswordToggle) return '10px 40px 10px 40px'
    if ($hasIcon) return '10px 12px 10px 40px'
    if ($hasPasswordToggle) return '10px 40px 10px 12px'
    return '10px 12px'
  }};
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

  &::-ms-reveal,
  &::-ms-clear {
    display: none;
  }

  /* Скрываем нативные контролы в Webkit браузерах (если появятся) */
  &::-webkit-contacts-auto-fill-button,
  &::-webkit-credentials-auto-fill-button {
    visibility: hidden;
    pointer-events: none;
    position: absolute;
    right: 0;
  }
`

export const PasswordToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${colors.mainColor};
  }

  &:focus {
    outline: none;
    color: ${colors.mainColor};
  }
`
