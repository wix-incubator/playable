import React from 'react';
import classNames from 'classnames';
import Link from 'gatsby-link';

import createLinksTree from './createLinksTree';

function NavTree({ location, headings, isOpen }) {
  const navTree = createLinksTree(location, headings);

  return (
    <div className={classNames('toc-wrapper', { open: isOpen })}>
      <div id="toc" className="toc-list-h1">
        {navTree.map(link => (
          <li key={link.to}>
            <Link to={link.to} className={classNames('toc-link', 'toc-h1')}>
              {link.value}
            </Link>
            {link.children &&
              link.children.length > 0 && (
                <ul className="toc-list-h2">
                  {link.children.map(childLink => (
                    <li key={childLink.to}>
                      <Link
                        to={childLink.to}
                        className={classNames('toc-link', 'toc-h2')}
                      >
                        {childLink.value}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </div>
      <ul className="toc-footer">
        <li><Link to="docs/api">API reference</Link></li>
      </ul>
    </div>
  );
}

export default NavTree;
