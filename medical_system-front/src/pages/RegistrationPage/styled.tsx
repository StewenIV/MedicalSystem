import styled from 'styled-components'
import colors from 'consts/colors'
import Input from 'components/Input'

export const RegistrationPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  padding: 48px 16px;
`

export const Card = styled.div`
  background: white;
  padding: 32px;
  border-radius: 12px;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`

export const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;

  div {
    width: 64px;
    height: 64px;
    background: ${colors.mainColor};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
    color: #fff;
  }

  h1 {
    font-size: 30px;
    font-weight: bold;
    color: #111827;
    margin: 0;
  }
  p {
    color: ${colors.secondColorText};
    margin-top: 8px;
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  span {
    color: ${colors.colorError};
  }
`

export const Grid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.columns}, 1fr);
  gap: 16px;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-size: 16px;
    margin-bottom: 6px;
    color: ${colors.colorTextForm};
  }
`

export const RegistrationInput = styled(Input)`
  background-color: #f9fafb;
`

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  color: #555;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;

  svg {
    margin-bottom: 2px;
  }

  &:hover {
    color: #444444;
  }
`

export const SubmitButton = styled.button`
  padding: 12px;
  background: ${colors.button};
  color: #fff;
  border: none;
  margin-top: 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background: ${colors.buttonHover};
  }

  &:focus {
    outline: none;
    box-shadow:
      0 0 0 2px #ffffff,
      0 0 0 4px #3b82f6; /* Эффект кольца (ring-offset + ring) */
  }
`
export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 16px 0;
  color: #9ca3af;
  font-size: 14px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #d1d5db;
  }

  &:not(:empty)::before {
    margin-right: 10px;
  }
  &:not(:empty)::after {
    margin-left: 10px;
  }
`

export const OAuthButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  cursor: pointer;

  svg {
    margin-bottom: 3px;
  }

  &:hover {
    background-color: #f9fafb;
  }
`

export const Terms = styled.p`
  margin-top: 16px;
  font-size: 12px;
  text-align: center;
  color: #6b7280;
`
