import React from 'react';
import Link from 'gatsby-link';

const IndexPage = ({ data }) => {
  const page = data.page;

  console.log(page);
  return (
    <div>
      {/*<h1>*/}
      {/*{page.frontmatter.title}*/}
      {/*</h1>*/}
      <Link to="/page-2/">Go to page 2</Link>
      <div dangerouslySetInnerHTML={{ __html: page.markdown.html }} />
    </div>
  );
};

export const query = graphql`
  query IndexQuery {
    page: file(relativePath: { eq: "index.md" }) {
      markdown: childMarkdownRemark {
        html
      }
    }
  }
`;

export default IndexPage;
