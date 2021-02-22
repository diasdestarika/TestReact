import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalFooter, ModalHeader, Spinner } from 'reactstrap';

const propTypes = {
  onClick: PropTypes.func,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  body: PropTypes.element,
  header: PropTypes.string,
  isLoading: PropTypes.bool
};


class ModalConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (this.props.disabled) {
      e.preventDefault();
      return;
    }

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  onToggle(){
    this.props.toggle();
  }

  render() {
  const isLoading = this.props.isLoading;
    return (
            <Modal

            isOpen={this.props.isOpen}
            toggle={() => this.onToggle()}>

            <ModalHeader>{this.props.header}</ModalHeader>
            
            {this.props.body}

            <ModalFooter className="d-flex">


              { isLoading ?
                <Spinner
                  className="mr-auto p-2"
                  size="lg"
                  type="grow"
                  color="primary"
                />
                : null
              }


                <Button color="primary" onClick={e => this.onClick(e)} disabled={isLoading}>
                    Ya
                </Button>
                {' '}
                <Button color="secondary" onClick={() => this.onToggle()}>
                    Tidak
                </Button>

            </ModalFooter>

            </Modal>
    );
  }
}

ModalConfirmation.propTypes = propTypes;

export default ModalConfirmation;