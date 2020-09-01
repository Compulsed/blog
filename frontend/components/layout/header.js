import Link from 'next/link'

import { Container, Row, Col  } from 'react-bootstrap';
import styled from 'styled-components'

export const Header = () => {
    return (
        <SpacedContainer>
            <Row>
                <Col style={{flex: '0 0 50px', padding: 0 }} >
                    <Link href="/" as='/' passHref >
                        <a>
                            <img style={{ width: '100%' }} src="https://blog-production-image-bucket.s3.amazonaws.com/logo-4.png" />
                        </a>
                    </Link>
                </Col>
                <Col>
                    <Link href="/" as='/' passHref >
                        <TitleLink>
                            <Title>
                                Dale Salter
                            </Title>
                        </TitleLink>
                    </Link>
                    <h6 className="mb-2 text-muted">Serverless, Software Engineering, Leadership, DevOps</h6>          
                </Col>
            </Row>
        </SpacedContainer>
    );
}

const Title = styled.h1`
    font-family: Inter;
    font-weight: 900;
    margin-bottom: 0;
    letter-spacing: -.02em;
`;


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