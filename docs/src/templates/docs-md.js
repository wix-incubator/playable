import React from 'react';
import Link from 'gatsby-link';
import find from 'lodash/find';

import typography from '../utils/typography';
const { rhythm } = typography;

const docPagePaths = [
  "docs/",
  "docs/getting-started/",
  "docs/how-to-run/",
  "docs/some-react-code/",
  "docs/the-next-step/",
  "docs/conclusion/",
];

function DocsMenu({ pages }) {
  return (
    <ul
      style={{
        listStyle: 'none',
        marginLeft: 0,
        marginTop: rhythm(1 / 2),
      }}
    >
      {pages.map(page => (
        <li
          key={page.path}
          style={{
            marginBottom: rhythm(1 / 2),
          }}
        >
          <Link
            to={page.path}
            style={{
              textDecoration: 'none',
            }}
            activeStyle={{
              color: 'red'
            }}
          >
            {page.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}


function DocsTemplate({ data: { page, docFiles } }) {
  console.log(arguments);

  const pages = docPagePaths
    .map(pagePath => {
      const edge = find(docFiles.edges, edge => edge.node.relativePath.startsWith(pagePath));

      if (edge) {
        return {
          title: edge.node.page.frontmatter.title,
          path: pagePath
        }
      }
    })
    .filter(page => !!page);

  return (
    <div>
      <div
        style={{
          overflowY: 'auto',
          paddingRight: `calc(${rhythm(1 / 2)} - 1px)`,
          position: 'absolute',
          width: `calc(${rhythm(8)} - 1px)`,
          borderRight: '1px solid lightgrey',
        }}
      >
        <DocsMenu pages={pages}/>
      </div>
      <div
        style={{
          padding: `0 ${rhythm(1)}`,
          paddingLeft: `calc(${rhythm(8)} + ${rhythm(1)})`,
        }}
      >
        <h1>
          {page.frontmatter.title}
        </h1>
        <div dangerouslySetInnerHTML={{ __html: page.html }} />
      </div>
    </div>
  );
}

export const query = graphql`
  query DocsMarkdownPage($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
    docFiles: allFile(filter: { relativePath: { glob: "docs/**/*.md" }}) {
      edges {
        node {
          relativePath
          page: childMarkdownRemark {
            frontmatter {
              title
            }
          }
        }
      }
    }
  }
`;

export default DocsTemplate;
