import { Container, Row, Col  } from 'react-bootstrap';
import styled from 'styled-components'

export const Footer = () => {
    return (
        <SpacedContainer>
            <Row>
                <Col></Col>
            </Row>
        </SpacedContainer>
    );
}

const SpacedContainer = styled(Container)`
    margin-top: 30px;
    margin-bottom: 30px;
`