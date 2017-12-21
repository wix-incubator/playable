import React, { Component, Fragment } from 'react';

import NavButton from './NavButton';
import NavTree from './NavTree';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  render() {
    const { headings } = this.props;
    const { isOpen } = this.state;

    return (
      <Fragment>
        <NavButton
          isOpen={isOpen}
          onClick={() => {
            this.setState(({ isOpen }) => ({
              isOpen: !isOpen,
            }));
          }}
        />
        <NavTree headings={headings} isOpen={isOpen}/>
      </Fragment>
    );
  }
}

export default Navigation;
