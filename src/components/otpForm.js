import logo200Image from 'assets/img/logo/logo_200.png';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';


class otpForm extends React.Component {

  state = {
    OTP: "",
  }

  get isOTP() {
    return this.props.authState === STATE_OTP;
  }

  changeAuthState = authState => event => {
    event.preventDefault();

    this.props.onChangeAuthState(authState);
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  renderButtonText() {
    const { buttonText } = this.props;

    if (!buttonText && this.isOTP) {
      return 'send OTP';
    }
    return buttonText;
  }

  updateValue = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {
    const {
      showLogo,
      otpLabel,
      otpInputProps,
      children,
      onLogoClick,
      onButtonClick
    } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        {showLogo && (
          <div className="text-center pb-4">
            <img
              src={logo200Image}
              className="rounded"
              style={{ width: 60, height: 60, cursor: 'pointer' }}
              alt="logo"
              onClick={onLogoClick}
            />
          </div>
        )}
        {this.isOTP && (
          <FormGroup>
            <Label for={otpLabel}>{otpLabel}</Label>
            <Input {...otpInputProps} value={this.state.OTP} onChange={this.updateValue} />
          </FormGroup>
        )}
        <hr />
        {this.isOTP && (
        <Button
          size="lg"
          className="bg-gradient-theme-left border-0"
          block
          onClick={onButtonClick(this.state.OTP)}>
          {this.renderButtonText()}
        </Button>
        )}

        <div className="text-center pt-1">
          <h6>or</h6>
          <h6>
              <a href="#login" onClick={this.changeAuthState(STATE_OTP)}>
                Send OTP
            </a>
          </h6>
        </div>

        {children}
      </Form>
    );
  }
}

export const STATE_OTP = 'OTP';

otpForm.propTypes = {
  authState: PropTypes.oneOf([STATE_OTP]).isRequired,
  showLogo: PropTypes.bool,
  otpLabel: PropTypes.string,
  otpInputProps: PropTypes.object,
  onLogoClick: PropTypes.func,
  onButtonClick: PropTypes.func
};

otpForm.defaultProps = {
  authState: 'OTP',
  showLogo: true,
  otpLabel: 'OTP',
  otpInputProps: {
    type: 'input',
    placeholder: 'insert OTP',
    name: 'OTP'
  },
  onLogoClick: () => { },
  onButtonClick: () => { }
};

export default otpForm;
