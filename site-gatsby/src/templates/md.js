import React from 'react';

function Template({ data: { page }}) {
  return (
    <div>
      <h1>
        {page.frontmatter.title}
      </h1>
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </div>
  );
}

export const query = graphql`
  query MarkdownPage($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;

export default Template;
