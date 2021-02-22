import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

const propTypes = {
  onClick: PropTypes.func,
  toggle: PropTypes.func,
  isOpen: PropTypes.bool,
  message: PropTypes.string,
  code: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};


class ModalMessage extends React.Component {
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

    var code = <b><br/>{"Code : " + this.props.code}</b>;


    return (
            <Modal

                isOpen={this.props.isOpen}
                toggle={() => this.onToggle()}>
                
                <ModalBody style={{ textAlign: 'center'}}>
                  {this.props.code !== undefined ? code : null}
                    <br/>{this.props.message}<br/>
                </ModalBody>
                
                <ModalFooter>
                    <Button onClick={e => this.onClick(e)}>ok</Button>
                </ModalFooter>

            </Modal>
    );
  }
}

ModalMessage.propTypes = propTypes;

export default ModalMessage;