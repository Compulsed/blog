import styled from 'styled-components'

import { Spinner } from 'react-bootstrap';


export const CenterSpinner = styled(Spinner)`
    position: fixed;
    z-index: 999;
    overflow: show;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
`