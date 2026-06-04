import React from 'react'
import { Helmet } from 'react-helmet'
import styled, { keyframes } from 'styled-components'
import { FlaskConical, Clock } from 'lucide-react'

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.97); }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  gap: 24px;
  padding: 40px;
  text-align: center;
`

const IconRing = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2.5s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.35);
`

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 480px;
  margin: 0;
  line-height: 1.6;
`

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 100px;
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
`

const LaboratoryPage: React.FC = () => (
  <>
    <Helmet>
      <title>Лаборатория — В разработке</title>
    </Helmet>
    <Wrapper>
      <IconRing>
        <FlaskConical size={44} color="#fff" />
      </IconRing>
      <Title>Лаборатория</Title>
      <Subtitle>
        Функциональность лаборатории находится в разработке.
        Модуль будет доступен в ближайшее время.
      </Subtitle>
      <Badge>
        <Clock size={14} />
        Скоро будет доступно
      </Badge>
    </Wrapper>
  </>
)

export default LaboratoryPage
