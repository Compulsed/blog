import moment from 'moment';
import styled from 'styled-components'
import Link from 'next/link'

import { Row, Col  } from 'react-bootstrap';

export const PostCard = ({ post, highlightHover = false }) => {
    return (
      <Link href="/post/[id]" as={`/post/${post.postId}`} passHref>
        <ArticleLink>
          <ArticleCard highlightHover={highlightHover}>
            <Row>
              <Col sm={10}>
                <h3>{post.title}</h3>
                <h5 className="mb-2 text-muted">{post.shortDescription}</h5>
                <p>{ post.longDescription }</p>
                <p className="small">Posted { moment(post.createdAt).fromNow(true) } ago</p>   
              </Col>
              <Col sm={2}>
                <ArticleImage src={post.imageUrl} /> 
              </Col>
            </Row>
          </ArticleCard>
        </ArticleLink>
      </Link>
    );
} 


const ArticleImage = styled.img`
  width: 100%;
`

const ArticleLink = styled.a`
  text-decoration: none;
  color: inherit;
  outline: 0;
  cursor: auto;

  :hover {
    text-decoration: none;
    color: inherit;
    outline: 0;
    cursor: auto;
  }
`

const ArticleCard = styled.div`
  border: ${props => props.highlightHover 
    ? '1px solid transparent'
    : '1px solid #d0d0d0'
  };

  padding 20px;
  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.01);

  :hover {
    border: 1px solid #d0d0d0;
    cursor: pointer;
  }
`