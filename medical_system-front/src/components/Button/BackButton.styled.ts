import styled from 'styled-components'
import colors from 'consts/colors'

export const StyledBackButton = styled.button`
  top: 16px;
  left: 16px;

  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 12px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);

  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(10px);

  color: ${colors.secondColorText};
  font-size: 14px;

  /* тени и глубина */
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    color: #444;
    background: rgba(255, 255, 255, 0.25);
    box-shadow:
      0 6px 16px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow:
      0 2px 6px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`
