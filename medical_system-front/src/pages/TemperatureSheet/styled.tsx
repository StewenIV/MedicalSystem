import styled, { css, keyframes } from 'styled-components'
import colors from 'consts/colors'
import { AppButton } from 'components/Button'

const FONT_STACK = `
  'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont,
  'Segoe UI', system-ui, sans-serif
`

const GRADIENT_TITLE = 'linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #3b82f6 100%)'
const GRADIENT_ACCENT = 'linear-gradient(180deg, #2563eb 0%, #7c3aed 100%)'
const GRADIENT_SHIMMER =
  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)'

const shimmer = keyframes`
  0%   { background-position: -200% center }
  100% { background-position:  200% center }
`

const subtleFadeUp = keyframes`
  from { opacity: 0; transform: translateY(6px) }
  to   { opacity: 1; transform: translateY(0)   }
`

const gradientText = (gradient: string) => css`
  background: ${gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const Content = styled.div`
  padding: 1px;
  font-family: ${FONT_STACK};
  background: linear-gradient(135deg, #f0f4ff, #f8faff);
  border-radius: 16px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.05);
`

export const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: ${subtleFadeUp} 0.35s ease both;
`

export const StyledCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(191, 219, 254, 0.7);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.06),
    0 20px 40px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  transition:
    box-shadow 0.25s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow:
      0 2px 4px rgba(15, 23, 42, 0.06),
      0 8px 24px rgba(37, 99, 235, 0.08),
      0 24px 48px rgba(15, 23, 42, 0.07);
    transform: translateY(-1px);
  }
`

export const HeaderRow = styled.div`
   display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`

export const HeaderLeft = styled.div`
   display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  @media (max-width: 768px) {
    gap: 10px;
  }

  @media (max-width: 480px) {
    gap: 8px;

    svg {
      width: 26px;
      height: 26px;
      flex-shrink: 0;
    }
  }
`

export const Title = styled.h2`
  font-family: ${FONT_STACK};
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.04em;
  line-height: 1.15;
  min-width: 0;

  ${gradientText(`
    linear-gradient(
      135deg,
      #0f172a  0%,
      #1d4ed8 45%,
      #6d28d9 75%,
      #2563eb 100%
    )
  `)}

  filter: drop-shadow(0 1px 2px rgba(37, 99, 235, 0.18));

  transition:
    filter 0.25s ease,
    letter-spacing 0.25s ease;

  &:hover {
    filter: drop-shadow(0 2px 8px rgba(37, 99, 235, 0.28));
    letter-spacing: -0.035em;
  }

  @media (max-width: 1024px) {
    font-size: 24px;
  }

  @media (max-width: 768px) {
    font-size: 22px;
    line-height: 1.2;
  }

  @media (max-width: 480px) {
    font-size: 19px;
  }
`

export const CardContent = styled.div`
   padding: 24px;

  @media (max-width: 768px) {
    padding: 18px;
  }

  @media (max-width: 480px) {
    padding: 14px;
  }
`

export const InfoGrid = styled.div`
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: clamp(12px, 2vw, 24px);

@media (max-width: 1024px) {
  grid-template-columns: repeat(2, 1fr);
}

@media (max-width: 500px) {
  grid-template-columns: 1fr;
}
`

export const InfoItem = styled.div`
display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
  padding: 14px 16px;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border: 1px solid rgba(191, 219, 254, 0.35);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);

  @media (max-width: 768px) {
    padding: 12px 14px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`

export const InfoText = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
`

export const InfoLabel = styled.div`
  font-family: ${FONT_STACK};
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  line-height: 1.4;
  transition: color 0.2s ease;

  &::before {
    content: '';
    display: inline-block;
    width: 2px;
    height: 1px;
    background: linear-gradient(90deg, #bfdbfe, transparent);
    vertical-align: middle;
    margin-right: 6px;
    margin-bottom: 1px;
    opacity: 0.8;
    transition: width 0.2s ease;
  }

  ${InfoItem}:hover & {
    color: #64748b;
    &::before {
      width: 5px;
    }
  }

  @media (max-width: 768px) {
    &::before {
      display: none;
    }
  }
`

export const InfoValue = styled.div`
 font-family: ${FONT_STACK};
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
  line-height: 1.3;
  transition:
    color 0.2s ease,
    letter-spacing 0.2s ease;
  font-variant-numeric: tabular-nums;
  word-break: break-word;

  ${InfoItem}:hover & {
    color: #1e40af;
    letter-spacing: -0.02em;
  }

  &::before {
    content: '';
    display: inline-block;
    width: 2px;
    height: 1px;
    background: transparent;
    vertical-align: middle;
    margin-right: 6px;
    margin-bottom: 1px;
  }

  @media (max-width: 768px) {
    font-size: 16px;

    &::before {
      display: none;
    }
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`

export const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: stretch;

  > div {
    min-width: 0;
  }

  > div:first-child {
    display: flex;
  }

  > div:first-child > div {
    flex: 1;
  }

  > div:last-child {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;

    > div:first-child {
      display: block;
    }

    > div:first-child > div {
      flex: unset;
    }
  }
`

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.05);
  overflow: hidden;
  margin-top: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow:
      0 2px 4px rgba(15, 23, 42, 0.06),
      0 8px 20px rgba(37, 99, 235, 0.07);
  }
`

export const CardHeader = styled.div`
    padding: 18px 24px 16px;
  border-bottom: 1px solid rgba(238, 242, 247, 0.9);
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #f0f4ff 100%);
  border-radius: 12px 12px 0 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    bottom: 12px;
    width: 3px;
    background: ${GRADIENT_ACCENT};
    border-radius: 0 3px 3px 0;
    box-shadow: 2px 0 8px rgba(37, 99, 235, 0.25);
    transition:
      box-shadow 0.25s ease,
      width 0.2s ease;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${GRADIENT_SHIMMER};
    background-size: 200% 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover::before {
    width: 4px;
    box-shadow: 2px 0 14px rgba(37, 99, 235, 0.35);
  }

  &:hover::after {
    opacity: 1;
    animation: ${shimmer} 1.4s ease infinite;
  }

  @media (max-width: 768px) {
    padding: 16px 18px 14px;
  }

  @media (max-width: 480px) {
    padding: 14px 14px 12px;
  }
`

export const CardTitle = styled.h3`
  font-family: ${FONT_STACK};
  margin: 0;
  padding-left: 10px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.2;

  ${gradientText(GRADIENT_TITLE)}

  filter: drop-shadow(0 1px 1px rgba(15, 23, 42, 0.08));

  transition:
    filter 0.25s ease,
    letter-spacing 0.25s ease;

  ${CardHeader}:hover & {
    filter: drop-shadow(0 2px 6px rgba(37, 99, 235, 0.2));
    letter-spacing: -0.03em;
  }
`

export const CardSubtitle = styled.p`
  font-family: ${FONT_STACK};
  margin: 6px 0 0;
  padding-left: 10px;
  font-size: 13px;
  font-weight: 400;
  color: #94a3b8;
  letter-spacing: 0.015em;
  line-height: 1.55;
  transition: color 0.2s ease;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: linear-gradient(135deg, #93c5fd, #818cf8);
    vertical-align: middle;
    margin-right: 8px;
    margin-bottom: 2px;
    opacity: 0.7;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  ${CardHeader}:hover & {
    color: #64748b;

    &::before {
      opacity: 1;
      transform: scale(1.3);
    }
  }

   @media (max-width: 768px) {
    padding-left: 0;
    font-size: 12px;
    line-height: 1.45;
  }
`

export const CardBody = styled.div<{ $noPadding?: boolean }>`
  padding: ${(p) => (p.$noPadding ? '16px' : '24px')};
  display: flex;
  flex-direction: column;
  gap: 25px;
  flex: 1;
`

export const FieldLabel = styled.label`
  font-family: ${FONT_STACK};
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 6px;
  transition: color 0.2s ease;
`

export const FieldLabelIcon = styled.label`
  font-family: ${FONT_STACK};
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 12px;
  transition: color 0.2s ease;

  svg {
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #475569;
    svg {
      transform: scale(1.1);
    }
  }
`

export const BpGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

export const OpenSheetBtn = styled(AppButton)`
  width: 100%;
`

export const SaveBtn = styled(AppButton)`
  margin-top: 16px;
  width: 100%;
`
