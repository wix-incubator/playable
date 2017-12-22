import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import Header from '../components/Header';

// import '../assets/stylesheets/print.scss';
import '../assets/stylesheets/screen.scss';
import '../assets/stylesheets/prism.scss';

function TemplateWrapper({ children, data }) {
  return (
    <Fragment>
      <Helmet
        title={data.site.siteMetadata.title}
        meta={[
          { name: 'description', content: 'Sample' },
          { name: 'keywords', content: 'sample, something' },
        ]}
      />
      <Header />
      {children()}
    </Fragment>
  );
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export const query = graphql`
  query LayoutQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default TemplateWrapper;
