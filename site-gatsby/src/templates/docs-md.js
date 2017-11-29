import React from 'react';
import Slugger from 'github-slugger';

import typography from '../utils/typography';
const { rhythm } = typography;

function DocsMenu({ headings }) {
  const slugger = new Slugger();

  return (
    <ul
      style={{
        listStyle: 'none',
        marginLeft: 0,
        marginTop: rhythm(1 / 2),
      }}
    >
      {headings.map(heading => (
        <li
          key={heading.value}
          style={{
            marginBottom: rhythm(1 / 2),
          }}
        >
          <a
            href={`#${slugger.slug(heading.value)}`}
            style={{
              textDecoration: 'none',
            }}
          >
            {heading.value}
          </a>
        </li>
      ))}
    </ul>
  );
}


function DocsTemplate({ data: { page } }) {
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
        <DocsMenu headings={page.headings}/>
      </div>
      <div
        style={{
          padding: `0 ${rhythm(1)}`,
          paddingLeft: `calc(${rhythm(8)} + ${rhythm(1)})`,
        }}
      >
        {
          page.frontmatter &&
          page.frontmatter.title &&
          <h1>
            {page.frontmatter.title}
          </h1>
        }
        <div dangerouslySetInnerHTML={{ __html: page.html }} />
      </div>
    </div>
  );
}

export const query = graphql`
  query DocsMarkdownPage($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
      headings {
        value
      }
      html
      
    }
  }
`;

export default DocsTemplate;
