import colors from 'consts/colors'
import { styled } from 'styled-components'

export const WelcomeScreenContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  padding: 48px 16px;
`

export const Hero = styled.div`
  text-align: center;
  max-width: 1500px;
  margin: 0 auto 64px;
`

export const Logo = styled.div`
  width: 96px;
  height: 96px;
  margin: 0 auto 24px;
  background-color: ${colors.mainColor};
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`

export const Title = styled.h1`
  font-size: 56px;
  font-weight: 700;
  color: ${colors.mainColorText};
`

export const Subtitle = styled.h2`
  font-size: 24px;
  color: #374151;
  margin-top: 8px;
  width: 50%;
  justify-content: center;
  margin: 8px auto 0;
`

export const Description = styled.p`
  font-size: 20px;
  color: #6b7280;
  max-width: 900px;
  margin: 16px auto 32px;
  display: flex;
  flex-direction: column;
`

export const Buttons = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
`

export const PrimaryButton = styled.button`
  padding: 16px 32px;
  background: ${colors.button};
  color: white;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  cursor: pointer;
  transition:
    transform 0.2s,
    background 0.2s;

  &:hover {
    background: ${colors.buttonHover};
    transform: scale(1.05);
  }
`


export const SecondaryButton = styled.button`
    padding: 16px 32px;
    background: white;
    color: ${colors.mainColor};
    border: 2px solid ${colors.mainColor};
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 18px;
    cursor: pointer;
    transition:
      transform 0.2s,
      background 0.2s;

    &:hover {
      background: #eff6ff;
      transform: scale(1.05);
    }
`

export const SectionTitle = styled.h3`
    text-align: center;
    font-size: 32px;
    margin-bottom: 40px;
    color: ${colors.mainColorText};
`

export const BenefitGrid = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
`

export const Card = styled.div`
    background: white;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
`

export const CardIcon = styled.div<{ color?: string }>`
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: ${({ color }) =>
    color ? `rgb(from ${color} r g b / 0.12)` : 'transparent'};
  color: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`

export const CardTitle = styled.h4`
    font-size: 20px;
    margin-bottom: 12px;
    color: ${colors.mainColorText};
`

export const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;

`

export const ListItem = styled.li`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 8px;
    color: ${colors.secondColorText};

    svg {
        color: #16a34a;
        margin-top: 2px;
    }
`
