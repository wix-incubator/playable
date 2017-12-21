import React from 'react';
import classNames from 'classnames';

import navButtonImage from './navbar.png';

function NavButton({ isOpen, onClick }) {
  return (
    <div
      id="nav-button"
      className={classNames({ open: isOpen })}
      onClick={onClick}
    >
      <span>
        NAV
        <img src={navButtonImage} alt="Navbar" />
      </span>
    </div>
  );
}

export default NavButton;
