import React, { useState } from 'react'
import { Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react'
import {
  StyledInputWrapper,
  StyledInput,
  PasswordToggleButton,
  NumberControls,
  ControlButton,
  ErrorMessage
} from './styled'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: string
  fullWidth?: boolean
}

const Input: React.FC<InputProps> = ({
  icon,
  error,
  fullWidth = true,
  type,
  value,
  placeholder,
  step,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const isNumberField = type === 'number'
  const inputType = isPasswordField && showPassword ? 'text' : type

  // Показываем кнопку только если это поле пароля И в нём есть значение
  const shouldShowToggle = Boolean(
    isPasswordField && value && String(value).length > 0
  )

  const parseNumeric = (raw: unknown): number | null => {
    if (raw === undefined || raw === null || raw === '') {
      return null
    }

    const normalized = String(raw).replace(',', '.').trim()
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : null
  }

  const getPrecision = (raw: unknown): number => {
    if (raw === undefined || raw === null || raw === '') {
      return 0
    }

    const normalized = String(raw).replace(',', '.').trim()
    const [, fraction = ''] = normalized.split('.')
    return fraction.length
  }

  const addPrecisely = (baseValue: number, delta: number): number => {
    const precision = Math.max(getPrecision(baseValue), getPrecision(delta))
    const factor = 10 ** precision
    return (
      (Math.round(baseValue * factor) + Math.round(delta * factor)) / factor
    )
  }

  const getStepValue = (): number => {
    const parsedStep = step ? Number(String(step).replace(',', '.')) : 1
    return Number.isFinite(parsedStep) && parsedStep > 0 ? parsedStep : 1
  }

  const handleStep = (stepDelta: number) => {
    if (props.disabled) return

    const currentValue = parseNumeric(value)
    const placeholderValue = parseNumeric(placeholder)
    const baseValue = currentValue ?? placeholderValue ?? 0
    const newValue = addPrecisely(baseValue, stepDelta)

    onChange?.({
      target: { value: newValue.toString() }
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div>
      <StyledInputWrapper
        $hasIcon={!!icon}
        $fullWidth={fullWidth}
        $hasError={!!error}
      >
        {icon && <span className="icon">{icon}</span>}
        <StyledInput
          $hasIcon={!!icon}
          $hasError={!!error}
          $hasPasswordToggle={shouldShowToggle}
          $isNumber={isNumberField}
          type={inputType}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          {...props}
        />
        {isNumberField && !props.disabled && (
          <NumberControls>
            <ControlButton
              type="button"
              onClick={() => handleStep(getStepValue())}
              tabIndex={-1}
            >
              <ChevronUp size={18} />
            </ControlButton>
            <ControlButton
              type="button"
              onClick={() => handleStep(-getStepValue())}
              tabIndex={-1}
            >
              <ChevronDown size={18} />
            </ControlButton>
          </NumberControls>
        )}

        {shouldShowToggle && (
          <PasswordToggleButton
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </PasswordToggleButton>
        )}
      </StyledInputWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </div>
  )
}

export default Input
