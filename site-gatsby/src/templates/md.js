import React, { Component, Fragment } from 'react';
import Navigation from './components/Navigation/Navigation';
import NavButton from './components/NavButton/NavButton';

class Template extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isNavigationOpen: false,
    };
  }

  render() {
    const { data: { page } } = this.props;
    const { isNavigationOpen } = this.state;

    return (
      <Fragment>
        <NavButton
          isOpen={isNavigationOpen}
          onClick={() => {
            this.setState(({ isNavigationOpen }) => ({
              isNavigationOpen: !isNavigationOpen,
            }));
          }}
        />
        <Navigation headings={page.headings} isOpen={isNavigationOpen} />
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
