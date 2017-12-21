import React, { Fragment } from 'react';
import Navigation from '../components/Navigation/Navigation';

function Template({ data: { page } }) {
  return (
    <Fragment>
      <Navigation headings={page.headings}/>
      <div className="page-wrapper">
        <div className="dark-box" />
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
        <div className="dark-box" />
      </div>
    </Fragment>
  );
}

export const query = graphql`
  query MarkdownPage($slug: String!) {
    page: markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
      }
      headings {
        depth
        value
      }
      html
    }
  }
`;

export default Template;
