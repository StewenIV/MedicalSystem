import styled from 'styled-components'
import colors from 'consts/colors'
import { AppButton } from 'components/Button'


export const Content = styled.div`
  padding: 1px;
`

export const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-top: 16px;
  max-width: 800px;
`

export const CardHeader = styled.div`
  padding: 18px 20px 16px;
  border-bottom: 1px solid #eef2f7;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  border-radius: 12px 12px 0 0;
  position: relative;

  /* Акцентная полоска слева */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 14px;
    bottom: 14px;
    width: 3px;
    background: linear-gradient(180deg, #155dfc 0%, #6b9eff 100%);
    border-radius: 0 2px 2px 0;
  }
`

export const CardTitle = styled.h3`
  margin: 0;
  padding-left: 4px;
  font-size: 22px;
  font-weight: 700;
  color: ${colors.mainColorText};
  letter-spacing: -0.03em;
  line-height: 1.25;

  /* Лёгкий градиент на тексте */
  background: linear-gradient(135deg, #141a27 0%, #2d4a8a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

export const CardSubtitle = styled.p`
  margin: 5px 0 0;
  padding-left: 4px;
  font-size: 14px;
  color: #8898aa;
  letter-spacing: 0.02em;
  font-weight: 400;
  line-height: 1.5;

  /* Маленький разделитель перед подзаголовком */
  &::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 1px;
    background: #c7d8ff;
    vertical-align: middle;
    margin-right: 6px;
    margin-bottom: 2px;
  }
`

export const CardBody = styled.div<{ $noPadding?: boolean }>`
  padding: ${(p) => (p.$noPadding ? '16px' : '24px')};
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const FieldLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${colors.colorTextForm};
  margin-bottom: 6px;
`

export const FieldLabelIcon = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${colors.colorTextForm};
  margin-bottom: 6px;
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
  width: 100%;
`
