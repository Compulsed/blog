import { Container } from 'react-bootstrap';
import styled from 'styled-components'

export const Header = () => {
    return (
        <SpacedContainer>
            <h1 className="title">
                Dale Salter
            </h1>
            <h6>Serverless, Software Engineering, Leadership, DevOps</h6>
        </SpacedContainer>
    );
}

const SpacedContainer = styled(Container)`
    margin-top: 30px;
    margin-bottom: 30px;
`