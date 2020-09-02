import React from 'react';
import { request, gql } from 'graphql-request'

const EXTERNAL_DATA_URL = 'https://dalejsalter.com/post';

const GET_POSTS = gql`
    query {
      posts {
        postId
        createdAt
      }
    }
`;

const lastModifiedDate = ({ posts }) => {
    return new Date(posts
        .sort((a, b) => a.createdAt < b.createdAt)[0]
        .createdAt
    ).toISOString();
}

const createSitemap = ({ posts }) => `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://dalejsalter.com/</loc>
            <changefreq>weekly</changefreq>
            <lastmod>${lastModifiedDate({ posts })}</lastmod>
            <priority>1.00</priority>
        </url>

        ${posts.map(post => {
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