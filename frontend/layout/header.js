import Link from 'next/link'

import { Container } from 'react-bootstrap';
import styled from 'styled-components'

export const Header = () => {
    return (
        <SpacedContainer>
            <Link href="/" as='/' passHref >
                <TitleLink>
                    <h1 className="title">
                        Dale Salter
                    </h1>
                </TitleLink>
            </Link>
            <h6>Serverless, Software Engineering, Leadership, DevOps</h6>
        </SpacedContainer>
    );
}

const TitleLink = styled.a`
  color: inherit;

  :hover {
      text-decoration: none;
      color: inherit;
  }
`

const SpacedContainer = styled(Container)`
    margin-top: 30px;
    margin-bottom: 30px;
`