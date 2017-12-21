import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import Header from '../components/Header';

// import '../assets/stylesheets/print.scss';
import '../assets/stylesheets/screen.scss';
import '../assets/stylesheets/prism.scss';

function TemplateWrapper({ children }) {
  return (
    <div>
      <Helmet
        title="Gatsby Default Starter"
        meta={[
          { name: 'description', content: 'Sample' },
          { name: 'keywords', content: 'sample, something' },
        ]}
      />
      <Header />
      {children()}
    </div>
  );
}

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
