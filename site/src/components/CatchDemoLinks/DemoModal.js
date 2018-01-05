import React, { Component } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import styles from './DemoModal.module.scss';

class DemoModal extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func.isRequired,
  };

  render() {
    const { isOpen, src, onRequestClose } = this.props;

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        ariaHideApp={false}
        closeTimeoutMS={300}
        overlayClassName={{
          base: styles.overlay,
          afterOpen: styles.overlayAfterOpen,
          beforeClose: styles.overlayBeforeClose,
        }}
        className={styles.content}
      >
        <iframe
          width="100%"
          height="100%"
          src={src}
          allowFullScreen={true}
          frameBorder="0"
        />
      </Modal>
    );
  }
}

export default DemoModal;
