import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { StyledBackButton } from './BackButton.styled'

export interface BackButtonProps {
  onClick: () => void
  disabled?: boolean
  children?: React.ReactNode
}

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  disabled = false,
  children = 'Назад',
  ...props
}) => {
  return (
    <StyledBackButton onClick={onClick} disabled={disabled} {...props }>
      <ArrowLeft size={16} />
      {children}
    </StyledBackButton>
  )
}

export default BackButton
