import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import DemoModal from './DemoModal';
import getClosestAnchor from './getClosestAnchor';

class CatchDemoLinks extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      modalSrc: '',
    };

    this.onNodeClick = this.onNodeClick.bind(this);
    this.onCloseDemoModal = this.onCloseDemoModal.bind(this);
  }

  componentDidMount() {
    this.node.addEventListener('click', this.onNodeClick);
  }

  componentWillUnmount() {
    this.node.removeEventListener('click', this.onNodeClick);
  }

  onNodeClick(e) {
    if (
      e.button !== 0 ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.defaultPrevented
    ) {
      return;
    }

    const anchor = getClosestAnchor(e.target, this.node);

    if (!anchor || !anchor.href) {
      return;
    }

    if (anchor.href.includes('jsfiddle')) {
      e.preventDefault();

      this.onOpenDemoModal(anchor.href + 'embedded/result,js/dark/');
    }
  }

  onOpenDemoModal(href) {
    this.setState({
      isModalOpen: true,
      modalSrc: href,
    });
  }

  onCloseDemoModal() {
    this.setState({
      isModalOpen: false,
      modalSrc: '',
    });
  }

  render() {
    const { isModalOpen, modalSrc } = this.state;
    const child = React.Children.only(this.props.children);

    return (
      <Fragment>
        {React.cloneElement(child, {
          ref: node => {
            this.node = node;

            // Call the original ref, if any
            if (typeof child.ref === 'function') {
              child.ref(node);
            }
          },
        })}
        <DemoModal
          isOpen={isModalOpen}
          src={modalSrc}
          onRequestClose={this.onCloseDemoModal}
        />
      </Fragment>
    );
  }
}

export default CatchDemoLinks;
