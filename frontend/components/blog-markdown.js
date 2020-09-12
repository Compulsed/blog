import ReactMarkdown from 'react-markdown/with-html';
import styled from 'styled-components'

export const BlogMarkdown = ({ source }) => {
  return <StyledReactMarkdown escapeHtml={false} source={source} />
}

export const StyledReactMarkdown = styled(ReactMarkdown)`
  padding 20px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.01);

  h1 {
    font-size: 28px;
    margin-top: 40px;
    margin-bottom: 10px;
  }

  h2 {
    font-size: 20px;
    margin-top: 40px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 16px;
    margin-top: 40px;
    margin-bottom: 10px;
  }

  h4 {
    font-size: 14px;
    margin-top: 40px;
    margin-bottom: 10px;
  }

  h5 {
    font-size: 12px;
    margin-top: 40px;
    margin-bottom: 10px;
  }

  a {
    text-decoration: underline;
    color: #000;
  }

  ul {
    margin-top: -25px;
    margin-bottom: 40px;
  }
  
  p {
    margin-bottom: 25px;
  }

  img {
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 80%;
    padding: 20px;
  }
`