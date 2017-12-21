import React from 'react';
import Link from 'gatsby-link';
import DocSearch from './DocSearch';

import logoImage from './logo.png';

function Header() {
  return (
    <div className="header">
      <div className="logo-wrapper">
        <Link to="/">
          <img src={logoImage} alt="logo" className="logo" />
        </Link>
      </div>
      <DocSearch />
    </div>
  );
}

export default Header;
