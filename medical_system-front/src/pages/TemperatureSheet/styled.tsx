import styled from 'styled-components'
import colors from 'consts/colors'
import { AppButton } from 'components/Button'


export const Content = styled.div`
  padding: 24px;
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
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
`

export const CardTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: ${colors.mainColorText};
`

export const CardSubtitle = styled.p`\
  margin: 4px 0 0;
  font-size: 13px;
  color: ${colors.colorTextForm};
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
