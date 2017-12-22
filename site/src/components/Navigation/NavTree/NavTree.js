import React from 'react';
import classNames from 'classnames';
import Link from 'gatsby-link';

import createLinksTree from './createLinksTree';

function NavTree({ headings, isOpen }) {
  const navTree = createLinksTree(headings);

  return (
    <div className={classNames('toc-wrapper', { open: isOpen })}>
      <div id="toc" className="toc-list-h1">
        {navTree.map(link => (
          <li key={link.to}>
            <a href={link.to} className={classNames('toc-link', 'toc-h1')}>
              {link.value}
            </a>
            {link.children &&
              link.children.length > 0 && (
                <ul className="toc-list-h2">
                  {link.children.map(childLink => (
                    <li key={childLink.to}>
                      <a
                        href={childLink.to}
                        className={classNames('toc-link', 'toc-h2')}
                      >
                        {childLink.value}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </div>
      <ul className="toc-footer">
        <li>
          <Link to="/docs/api">API reference</Link>
        </li>
      </ul>
    </div>
  );
}

export default NavTree;
