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
`

export const StyledInput = styled.input<{
  $hasIcon?: boolean
  $hasError?: boolean
  $hasPasswordToggle?: boolean
  $isNumber?: boolean
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
  background-color: var(--input-bg);
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
    --input-bg: #f3f4f6;
    background-color: var(--input-bg);
    cursor: not-allowed;
    color: #9ca3af;
  }

  &:hover:not(:disabled) {
    border-color: #9ca3af;
  }

  padding-right: ${({ $isNumber, $hasPasswordToggle }) => {
    if ($isNumber) return '28px'
    if ($hasPasswordToggle) return '40px'
    return '12px'
  }};

  /* Скрываем нативные стрелочки полностью */
  &[type='number'] {
    -moz-appearance: textfield;
  }
  &[type='number']::-webkit-inner-spin-button,
  &[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
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

export const NumberControls = styled.div`
  position: absolute;
  right: 5px;
  top: 5px;
  bottom: 5px;
  width: 26px;
  padding: 2px;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
`

export const ControlButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  padding: 0;
  transition: all 0.15s ease;

  &:hover {
    background: #eaf1ff;
    color: ${colors.mainColor};
  }

  &:active {
    background: #dbeafe;
    transform: scale(0.95);
  }

  svg {
    stroke-width: 3;
    width: 12px;
    height: 12px;
  }
`

export const ErrorMessage = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: ${colors.colorError};
`
