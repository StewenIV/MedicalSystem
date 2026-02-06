import { Helmet } from 'react-helmet'
import { HomePageContainer } from './styled'

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>HomePage</title>
      </Helmet>
      <HomePageContainer>
        <h1>HomePage</h1>
      </HomePageContainer>
    </>
  )
}

export default HomePage
