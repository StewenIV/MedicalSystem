import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { StyledInputWrapper, StyledInput, PasswordToggleButton } from './styled'

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
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField && showPassword ? 'text' : type

  // Показываем кнопку только если это поле пароля И в нём есть значение
  const shouldShowToggle = Boolean(isPasswordField && value && String(value).length > 0)

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
          type={inputType}
          value={value}
          {...props} 
        />
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
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default Input
