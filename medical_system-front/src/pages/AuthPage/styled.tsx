import styled from 'styled-components'

import colors from 'consts/colors'

export const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
`
export const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 32px;
  width: 100%;
  max-width: 400px;
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

export const Logo = styled.div`
  text-align: center;
  margin-bottom: 32px;

  div {
    width: 64px;
    height: 64px;
    margin: 0 auto 12px;
    background: ${colors.button};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  h1 {
    margin: 0;
    font-size: 26px;
    font-weight: bold;
  }
  p {
    margin-top: 6px;
    color: #666;
  }
`

export const Tabs = styled.div`
  display: flex;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
`

export const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ active }) => (active ? '#fff' : 'transparent')};
  color: ${({ active }) => (active ? colors.button : '#555')};
  font-weight: ${({ active }) => (active ? 600 : 400)};

  &:hover {
    background: ${({ active }) => (active ? '#fff' : '#e2e8f0')};
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 500;
    color: ${colors.colorTextForm};
  }
`

export const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;

  label {
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    color: ${colors.colorTextForm};
  }

  a {
    color: ${colors.button};
    text-decoration: none;
  }

  &:hover a {
    color: ${colors.buttonHover};
  }
`

export const SubmitButton = styled.button`
  padding: 12px;
  background: ${colors.button};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: ${colors.buttonHover};
  }
`
export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 8px 0;
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
export const RegisterBlock = styled.div`
  text-align: center;

  p {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 8px;
  }

  button {
    background: none;
    border: none;
    color: ${colors.button};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
  }

  svg {
    margin-left: 4px;
    vertical-align: middle;
  }

  &:hover button {
    color: ${colors.buttonHover};
  }
`
