import React from 'react'
import { StyledInputWrapper, StyledInput } from './styled'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  error?: string
  fullWidth?: boolean
}

const Input: React.FC<InputProps> = ({
  icon,
  error,
  fullWidth = true,
  ...props
}) => {
  return (
    <div>
      <StyledInputWrapper
        $hasIcon={!!icon}
        $fullWidth={fullWidth}
        $hasError={!!error}
      >
        {icon && <span className="icon">{icon}</span>}
        <StyledInput $hasIcon={!!icon} $hasError={!!error} {...props} />
      </StyledInputWrapper>
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default Input
