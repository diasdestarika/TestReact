import logo200Image from 'assets/img/logo/logo_200.png';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Form, Input, Label, Row, Col, Progress, Card, CardBody } from 'reactstrap';
import zxcvbn from 'zxcvbn';
import * as myUrl from 'pages/urlLink';

import {
  MdLoyalty,
} from 'react-icons/md';

class ResetPasswordForm extends React.Component {


  state = {
    username: "",
    password: "",
    confirm: "",
    inputEmail: "",
    inputPhoneNumber: "",
    inputEmailNumber: "",
    passwordTest: "",
    suggestions: [],
    progress: 0,
    confirmText: "",
    otp: "",
  }

  onOtpChange = (value) => {
    this.setState({ otp: value });
  }


  // get isLogin() {
  //   return this.props.authState === STATE_LOGIN;
  // }

  // get isForgetPass() {
  //   return this.props.authState === STATE_FORGETPASS;
  // }

  changeAuthState = authState => event => {
    event.preventDefault();

    this.props.onChangeAuthState(authState);
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  renderButtonText() {
    const { buttonText } = this.props;

    if (!buttonText && this.isLogin) {
      return 'Login';
    }

    if (!buttonText && this.isForgetPass) {
      return 'Forgot Password';
    }
    return buttonText;
  }


  updateValue = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  canBeSubmitted() {
    const { progress } = this.state;
    return progress >= 25;
  }

  canBeSubmittedConfirm() {
    const { confirm, passwordTest } = this.state;
    return (confirm.length !== 0) && (passwordTest.length !== 0);
  }


  onPassChange = (e) => {

    const passwordTest = e.target.value;
    this.checkPassword(passwordTest);
    this.setState({ passwordTest })

  }

  handleConfirmPassword = (e) => {
    const confirm = e.target.value;
    this.setState({ confirm })
  };




  colorProgress() {
    const { progress } = this.state;
    switch (progress) {
      case 0: return "danger"
      case 25: return "danger"
      case 50: return "warning"
      case 75: return "success"
      case 100: return ""
      default: return "danger"
    }
  }

  strengthProgress() {
    const { progress } = this.state;
    switch (progress) {
      case 0: return ""
      case 25: return <b>Lemah</b>
      case 50: return <b>Cukup Baik</b>
      case 75: return <b>Baik!</b>
      case 100: return <b>Sangat Baik!</b>
      default: return ""
    }
  }

  checkPassword(passwordTest) {
    var strengthBar = this.state.progress;
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])");
    if (passwordTest.length === 0) {
      this.setState({
        progress: 0
      })
      return;
    }
    if (passwordTest.length < 6 && passwordTest.length > 0) {
      this.setState({
        progress: 0,
        suggestions: ["Panjang harus lebih dari 5 Karakter"]
      })
      return;
    }
    if (passwordTest.match(strongRegex)) {
      const evaluation = zxcvbn(passwordTest);
      strengthBar = evaluation.score * 25;
      this.setState({ progress: strengthBar, suggestions: [] })
    }
    else {
      this.setState({
        suggestions: ["Password harus mengandung angka, huruf kecil, huruf kapital, dan simbol"]
      });
      return;
    }
  }

  checkConfirmation = () => {
    var password = document.getElementById("passwordTest").value;
    var confirmPassword = document.getElementById("confirm").value;
    var messages = document.getElementById('messages');

    if (this.state.passwordTest.length === 0) {
      messages.innerHTML = "";
      return;
    }
    if (password === confirmPassword) {
      messages.style.color = 'green';
      messages.innerHTML = 'Kata sandi Cocok';
    } else {
      messages.style.color = 'red';
      messages.innerHTML = 'Kata sandi tidak cocok!';
    }
  }

  showNotification = (currMessage, levelType) => {
    setTimeout(() => {
      if (!this.notificationSystem) {
        return;
      }
      this.notificationSystem.addNotification({
        title: <MdLoyalty />,
        message:
          currMessage,
        level: levelType,
      });
    }, 300);
  }

  changePassword = async () => {

    const urlA = myUrl.url_changePassword;
    const code = this.state.passwordTest;
    var payload = {
      password: code,
      token: window.localStorage.getItem('token'),
    };

    if (window.localStorage.getItem('tokenLogin')) {
      var header = {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": window.localStorage.getItem('tokenLogin')
      }
    }else{
      var header = {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": window.localStorage.getItem('tokenResetPwd')
      }
    }

    const option = {
      method: "POST",
      json: true,
      headers: header,
      body: JSON.stringify(payload)
    }

    //console.log(option);
    let data = await fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response
        } else {
          this.showNotification("Koneksi ke server gagal!", 'error');
        }
      }).catch((err) => {
        //console.log(err);
        this.showNotification("Koneksi ke server gagal!", 'error');
      });

    if (data) {

      data = await data.json();
      var error = data.error;
      var metadata = data.metadata;

      if (error.status === false) {
        if (metadata.Status === "TRUE") {
          //GOTO RESET PWD
          this.showNotification(metadata.Message, 'info');
          this.props.history.push('/login');
        } else {
          this.showNotification(metadata.Message, 'error');
        }
      } else {
        this.showNotification(error.responseMessage, 'error');
      }
    }
  }
  autoIn = (event) => {
    event.target.select();
  }

  autoTab = (event) => {
    event.target.select()
    var currInput = event.target;
    var prevInput = event.target.previousElementSibling;
    var nextInput = event.target.nextElementSibling;
    //console.log(event.target.value)
    if (currInput.id === "input6" && currInput.value.length > 0) {
      return;
    }
    if (currInput.value.length !== 0) {
      currInput.blur();
      nextInput.focus();
    } else if (currInput.value.length === 0 && currInput.id !== "input1") {
      currInput.blur();
      prevInput.focus();
    }
  }

  render() {
    const {
      children,
      onLogoClick,
    } = this.props;

    const {
      suggestions,
    } = this.state;

    const colorProgress = this.colorProgress();
    const strengthProgress = this.strengthProgress();
    const isEnabled = this.canBeSubmitted();
    const isEnabledConfirm = this.canBeSubmittedConfirm();

    return (
      <Row
        style={{
          height: '100.1vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Col md={6} lg={4}>
          <Card body>
            <Form onSubmit={this.handleSubmit}>
              <div className="text-center pb-4">
                <img
                  src={logo200Image}
                  className="rounded"
                  style={{ width: 60, height: 60, cursor: 'pointer' }}
                  alt="logo"
                  onClick={onLogoClick}
                />
              </div>
              <p style={{ textAlign: "center" }}><b>Atur Ulang Kata Sandi</b></p>
              <br></br>
              <div>
                <Label>Kata Sandi</Label>
                <Input
                  type="password"
                  value={this.state.passwordTest.trim()}
                  placeholder="Kata Sandi.."
                  onChange={this.onPassChange}
                  id="passwordTest"
                  name="password"
                  onKeyUp={this.checkConfirmation}
                  autoComplete="off"
                />
                <br></br>
                <Progress max="100" value={this.state.progress} style={{ height: "10px" }} animated color={colorProgress} ></Progress>
                <Label hidden={!isEnabled}>Kekuatan Kata Sandi: {strengthProgress}</Label>
                <Row>
                  <Col>
                    {suggestions.map((s, index) =>
                      <Label style={{ color: "red", fontSize: "15px" }} key={index}>{s}</Label>
                    )}
                  </Col>
                </Row>
                <br></br>
              </div>

              <div>
                <Label>Konfirmasi Kata Sandi</Label>
                <Input
                  type="password"
                  placeholder="Kata Sandi.."
                  value={this.state.confirm.trim()}
                  onChange={this.handleConfirmPassword}
                  id="confirm"
                  name="confirm_password"
                  onKeyUp={this.checkConfirmation}
                />
                <Label id='messages'></Label>

              </div>

              <br></br>
              <div className="text-center pt-1">
                <Button disabled={!isEnabledConfirm} onClick={this.changePassword}>
                  Atur ulang kata sandi
          </Button>
              </div>

              {children}
            </Form>
          </Card>

        </Col>
      </Row>
    );
  }
}




ResetPasswordForm.propTypes = {
  // authState: PropTypes.oneOf([STATE_LOGIN, STATE_FORGETPASS]).isRequired,
  showLogo: PropTypes.bool,
  usernameLabel: PropTypes.string,
  usernameInputProps: PropTypes.object,
  passwordLabel: PropTypes.string,
  passwordInputProps: PropTypes.object,
  confirmPasswordLabel: PropTypes.string,
  confirmPasswordInputProps: PropTypes.object,
  phoneNumberInputProps: PropTypes.object,
  emailNumberInputProps: PropTypes.object,
  onLogoClick: PropTypes.func,
  onButtonClick: PropTypes.func
};

ResetPasswordForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'Username',
  usernameInputProps: {
    type: 'input',
    placeholder: 'your username',
    name: 'username'
  },
  passwordLabel: 'Password',
  passwordInputProps: {
    type: 'password',
    placeholder: 'your password',
    name: 'password'
  },
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'confirm your password',
    name: 'confirm'
  },
  onLogoClick: () => { },
  onButtonClick: () => { }
};

export default ResetPasswordForm;
