import { styled } from 'styled-components'
import colors from 'consts/colors'

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  padding: 16px;
`

export const LogoBlock = styled.div`
  text-align: center;
  margin-bottom: 32px;
`

export const LogoIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${colors.button};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto 16px;
  box-shadow: 0 4px 12px rgba(21, 93, 252, 0.3);
`

export const Card = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  padding: 32px 32px 20px 32px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;

  span {
    color: ${colors.colorError};
  }

  @media (max-width: 640px) {
    padding: 24px;
  }
`

export const MainTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`

export const SubTitle = styled.p`
  font-size: 13px;
  color: ${colors.secondColorText};
  margin: 4px 0 0;
`

export const TitleForm = styled.h2`
  text-align: start;
  font-size: 22px;
  font-weight: 700;
  color: ${colors.mainColorText};
  margin: 15px 0 8px 0;
`

export const SubTitleForm = styled.p`
  text-align: start;
  margin: 0 0 24px;
  font-size: 14px;
  line-height: 1.5;
  color: ${colors.secondColorText};

  strong {
    color: ${colors.mainColor};
  }
`

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 12px 20px 20px;
  margin-bottom: 16px;

  label {
    font-size: 14px;
    font-weight: 500;
    color: ${colors.colorTextForm};
  }
`

export const Button = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: ${colors.button};
  color: white;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;

  &:hover:not(:disabled) {
    background: ${colors.buttonHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(21, 93, 252, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export const BackButtonCopy = styled(Button)`
  background: #ffffff;
  border: 1px solid #d1d5db;
  color: ${colors.colorTextForm};
  margin-top: 8px;
  gap: 6px;

  &:hover:not(:disabled) {
    background: #f0f1f4;
    color: ${colors.colorTextForm};
  }
`

export const SecurityNoteWrapper = styled.div`
  margin-top: 12px;
  max-width: 510px;
  width: 100%;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;

  display: flex;
  justify-content: center;

  svg {
    color: ${colors.mainColor};
    flex-shrink: 0;
    margin-top: 2px;
  }
`

export const SecurityNoteText = styled.p`
  font-size: 12px;
  color: #4b5563;
  text-align: center;
  line-height: 1.6;

  max-width: 400px;
  margin: 0;

  span {
    margin-right: 4px;
  }
`

export const SuccessMessage = styled.div`
  text-align: center;
  .icon-wrapper {
    margin: 0px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: #dcfce7;
    border-radius: 50%;

    svg {
      color: #16a34a;
    }
  }

  ${TitleForm} {
    text-align: center;
    margin-bottom: 12px;
  }

  ${SubTitleForm} {
    text-align: center;
    margin-bottom: 24px;
  }
`

export const ErrorBox = styled.div`
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  display: flex;
  align-items: start;
  gap: 12px;
  margin-bottom: 20px;

  svg {
    color: ${colors.colorError};
    flex-shrink: 0;
    margin-top: 2px;
  }

  div {
    flex: 1;
    font-size: 14px;
    line-height: 1.5;

    strong {
      display: block;
      margin-bottom: 4px;
      color: #991b1b;
    }

    > div {
      color: #dc2626;
    }
  }
`

export const FieldError = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${colors.colorError};
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    flex-shrink: 0;
  }
`

export const FieldSuccess = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: #16a34a;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    flex-shrink: 0;
  }
`

export const PasswordRequirements = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

interface RequirementItemProps {
  $valid: boolean
}

export const RequirementItem = styled.div<RequirementItemProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${(props) => (props.$valid ? '#16a34a' : colors.secondColorText)};

  svg {
    flex-shrink: 0;
    color: #16a34a;
  }

  .circle {
    width: 14px;
    height: 14px;
    border: 2px solid #d1d5db;
    border-radius: 50%;
    flex-shrink: 0;
  }
`

export const InfoBox = styled.div`
  margin: 20px;
  padding: 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  display: flex;
  align-items: flex-start; /* Иконка всегда вверху слева */
  gap: 12px;


  svg {
    color: #3b82f6;
    flex-shrink: 0;
    margin-top: 3px; 
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
    font-size: 14px;
    line-height: 1.5;

    strong {
      display: block;
      margin-bottom: 4px;
      color: #1e40af;
    }

    p {
      margin: 0;
      color: #1e3a8a;

      strong {
        display: inline;
        color: #2563eb;
        font-family: 'Courier New', monospace;
        font-size: 15px;
      }
    }

    ul {
      margin: 8px 0 0;
      padding: 0 0 0 18px; 
      list-style-type: disc; 
      color: #1e3a8a;
      display: flex;
      align-items: flex-start;
      flex-direction: column;

      li {
        margin: 4px 0;
        padding-left: 4px;
        
        &::marker {
          color: #3b82f6; 
        }
      }
    }
  }
`

export const SecurityNotice = styled.div`
  margin-top: 20px;
  padding: 12px 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  text-align: center;

  p {
    margin: 0;
    font-size: 13px;
    color: ${colors.secondColorText};
    line-height: 1.5;

    strong {
      color: ${colors.mainColorText};
    }
  }

  button {
    background: none;
    border: none;
    color: ${colors.mainColor};
    cursor: pointer;
    font-weight: 500;
    text-decoration: underline;
    padding: 0;
    font-size: 13px;

    &:hover:not(:disabled) {
      color: ${colors.buttonHover};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`

export const OtpContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin: 16px 0;

  @media (max-width: 640px) {
    gap: 8px;
  }
`

export const OtpInput = styled.input`
  width: 52px;
  height: 65px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  color: ${colors.mainColorText};
  background: white;
  border: 2px solid #d1d5db;
  border-radius: 20px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${colors.mainColor};
    box-shadow: 0 0 0 3px rgba(21, 93, 252, 0.1);
    transform: scale(1.05);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: #d1d5db;
  }

  /* Скрыть стрелки для number input */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  @media (max-width: 640px) {
    width: 42px;
    height: 48px;
    font-size: 20px;
  }
`
