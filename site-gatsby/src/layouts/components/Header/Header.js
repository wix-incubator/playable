import React from 'react';
import Link from 'gatsby-link';

import logoImage from './logo.png';

function Header() {
  return (
    <div className="header">
      <div className="logo-wrapper">
        <Link to="/">
          <img src={logoImage} alt="logo" className="logo" />
        </Link>
      </div>
      <div className="search">
        <input
          type="text"
          className="search"
          id="input-search-custom"
          placeholder="Search"
        />
      </div>
    </div>
  );
}

export default Header;
