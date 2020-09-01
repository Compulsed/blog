import React from 'react';
import { request, gql } from 'graphql-request'

const EXTERNAL_DATA_URL = 'https://dalejsalter.com/posts';

const GET_POSTS = gql`
    query {
      posts {
        postId
      }
    }
`;

const createSitemap = ({ posts }) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${posts
          .map(post => {
            return `
                    <url>
                        <loc>${`${EXTERNAL_DATA_URL}/${post.postId}`}</loc>
                    </url>
                `;
          })
          .join('')}
    </urlset>
`;
  
class Sitemap extends React.Component {
  static async getInitialProps({ res }) {
    const postData = await request(
        process.env.GRAPHQL_URL,
        GET_POSTS
    );

    const siteMap = {
        posts: (postData && postData.posts || [])
    };
    
    res.setHeader('Content-Type', 'text/xml');
    res.write(createSitemap(siteMap));
    res.end();
  }
}

export default Sitemap;