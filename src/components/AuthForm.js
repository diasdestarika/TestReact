import logo200Image from 'assets/img/logo/logo_200.png';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Form, FormGroup, Input, Label, CardBody, Row, Col } from 'reactstrap';
import * as firebase from "firebase/app";
import "firebase/performance";
import "firebase/auth";
import * as myUrl from 'pages/urlLink';
import { MdAutorenew } from 'react-icons/md';
// global grecaptcha

import Timer from 'components/Timer';




class AuthForm extends React.Component {

  state = {
    username: "",
    password: "",
    confirm: "",
    inputEmailNumber: "",
    OTP: false,
    sendCodeId: "",
    emailOrPhone: true,
    showNewOTP: false,
    timerMinute: 1,
    timerSecond: 0,
    resetTimer: true,
    loading: false,
    otpValue: "",
    isEnabledOTP: false,
    enterButton: false,
  }


  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isCheck() {
    return this.props.authState === STATE_CHECK;
  }

  get isForgetPass() {
    return this.props.authState === STATE_FORGETPASS;
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

    if (!buttonText && this.isLogin) {
      return 'Masuk';
    }

    if (!buttonText && this.isForgetPass) {
      return 'Lupa Kata Sandi';
    }
    return buttonText;
  }

  nextStep = async () => {
    const filter = /^(?:(([+])?\d{10,13})|(^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$))$/;
    const { inputEmailNumber, username, password } = this.state;
    const { buttonText } = this.props;

    var result = inputEmailNumber.match(filter);
    this.setState({ enterButton: true })
    this.fetchData();

    //console.log("AAA")
    if (!buttonText && this.isLogin) {
      //console.log("TERSERAH KATA NICO" + this.state.username + "   " + this.state.password);

      if (true) {
        console.log(await this.props.onButtonClick(username, password))
        setTimeout(() => {
          this.setState({ loading: false, enterButton: false })
        }, 500);
      }
    }

    if (!buttonText && this.isForgetPass) {
      //console.log(this.fetchData())
      //console.log(this.state.loading)
      //menetukan email atau phone
      if (result !== null) {
        if (result[1] !== undefined) {
          //console.log(this.state.loading);
          this.setState({
            emailOrPhone: false,
            enterButton: false,
            // loading: false
          })

          //inputan nomor handphone
          var phonenum = this.state.inputEmailNumber;
          if (result[2] === undefined) {
            //console.log(this.state.loading);

            //angka dimulai 0
            this.changeForgottenPassword(phonenum, "");
            this.setState({
              emailOrPhone: false,
              enterButton: false,
              // loading:false
            })
          } else {
            //console.log(this.state.loading);
            //angka dimulai +62
            phonenum = phonenum.replace('+62', '0');
            this.changeForgottenPassword(phonenum, "");
            this.setState({
              emailOrPhone: false,
              enterButton: false,
              loading: false
            })
          }
        }
        else if (result[3] !== undefined) {
          //console.log(this.state.loading);
          //inputan email
          this.setState({
            emailOrPhone: true,
            enterButton: false,
            loading: false
          })
          //console.log("EMAIL GO");
          this.changeForgottenPassword("", this.state.inputEmailNumber);
        }
      }
    }
    //console.log(this.state.loading);
    //console.log("NEXT STEP DONE");
  }

  fetchData = () => {
    //console.log("GUY DISABLE LOADING")
    this.setState({ loading: true });
  };

  async changeForgottenPassword(phonenum = "", email = "") {

    const urlA = myUrl.url_changeForgottenPassword;

    var payload = {
      mobile_no: phonenum,
      email: email,

    };

    const option = {
      method: "POST",
      json: true,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": ""
      },
      body: JSON.stringify(payload)
    }
    //console.log(option);
    let data = await fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          //console.log("CHECK FORGET");
          return response
        } else {
          this.props.showNotification("Koneksi ke server gagal!", 'error');
        }
      }).catch((err) => {
        //console.log(err);
        this.props.showNotification("Koneksi ke server gagal!", 'error');
      });
    if (data) {

      var token = data.headers.get('Authorization')
      data = await data.json();
      var error = data.error;
      var metadata = data.metadata;

      //console.log(error);
      //console.log(metadata);


      if (error.status === false) {
        if (metadata.status === true) {
          window.localStorage.setItem('tokenOTP', token);
          if (phonenum !== "") {
            window.localStorage.setItem('tokenResetPwd', token);
            phonenum = phonenum.replace('+62', '0');
            this.sendVerificationCode(phonenum);
          } else {
            //EMAIL
            window.localStorage.setItem('tokenOTP', token);
            this.props.showNotification(metadata.message, 'info');

            this.setState({ OTP: true }, () =>
              this.setState({
                showNewOTP: false,
                timerMinute: 1,
                timerSecond: 0,
                timeUpMessage: "Waktu Habis! Tolong request ulang OTP",
                resetTimer: true
              }, () => this.setState({ resetTimer: false })));
          }
        } else {
          this.props.showNotification(metadata.message, 'error');
        }
      } else {
        this.props.showNotification(error.msg, 'error');
      }
    }
  }


  sendVerificationCode = (INPUTTED_PHONENUMBER) => {
    if (!INPUTTED_PHONENUMBER.includes("+"))
      INPUTTED_PHONENUMBER = INPUTTED_PHONENUMBER.replace('0', '+62');
    const phoneNumber = INPUTTED_PHONENUMBER;
    const appverifier = window.recaptchaVerifier;
    firebase.auth().languageCode = 'id';
    firebase.auth().signInWithPhoneNumber(phoneNumber, appverifier)
      .then((confirmationResult) => {
        //console.log(confirmationResult);
        //console.log("KEEP LOOP");

        this.setState({ OTP: true }, () =>
          this.setState({
            sendCodeId: confirmationResult.verificationId,
            showNewOTP: false,
            timerMinute: 1,
            timerSecond: 0,
            timeUpMessage: "Waktu Habis! Tolong request ulang OTP",
            resetTimer: true
          }, () => this.setState({ resetTimer: false })));

        window.confirmationResult = confirmationResult;
        this.props.showNotification("OTP telah dikirimkan ke " + INPUTTED_PHONENUMBER, 'info');
      }).catch((error) => {
        this.setState({ loading: false });
        this.props.showNotification("Fail to send OTP", 'error');
        console.error(error);
        // window.recaptchaVerifier.render().then(function (widgetId) {
        //   grecaptcha.reset(widgetId);
        // }
        // )

      });
  }



  signInWithPhone = () => {
    var code = "";
    for (var i = 0; i < 6; i++) {
      code = code.concat(document.getElementById("input" + (i + 1)).value);
    }
    code = code.toUpperCase();
    const credential = firebase.auth.PhoneAuthProvider.credential(this.state.sendCodeId, code);
    firebase.auth().languageCode = 'id';
    firebase.auth().signInWithCredential(credential)
      .then(() => {
        //gotoRESET
        this.props.gotoChangePwd();
      })
      .catch(error => {
        this.setState({ loading: false });
        this.props.showNotification("Verifikasi gagal", 'info');
        console.error(error);
      })
  }

  //verifyOTP
  signInWithEmail = async () => {
    const urlA = myUrl.url_verifyOTP;
    var code = "";

    for (var i = 0; i < 6; i++) {
      code = code.concat(document.getElementById("input" + (i + 1)).value);
    }
    code = code.toUpperCase();

    var payload = {
      otp: code,
    };

    //console.log(payload);
    const option = {
      method: "POST",
      json: true,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": window.localStorage.getItem('tokenOTP')
      },
      body: JSON.stringify(payload)
    }



    //console.log(option);
    let data = await fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response
        } else {
          this.props.showNotification("Koneksi ke server gagal!", 'error');
        }
      }).catch((err) => {
        //console.log(err);
        this.props.showNotification("Koneksi ke server gagal!", 'error');
      });

    if (data) {
      //console.log(data);
      var token = data.headers.get('Authorization');
      data = await data.json();
      //console.log(data)
      var error = data.error;
      var metadata = data.metadata;

      if (error.status === false) {
        if (metadata.status === true) {
          window.localStorage.setItem('tokenResetPwd', token);
          //GOTO RESET PWD
          this.props.showNotification(metadata.message, 'info');

          this.props.gotoChangePwd();
        } else {
          this.props.showNotification(metadata.message, 'error');
          if (metadata.message.toLowerCase().includes("expired")) {
            window.localStorage.removeItem('tokenOTP');
            this.props.history.push({
              pathname: '/login',
            })
          }
        }
      } else {
        this.props.showNotification(error.msg, 'error');
      }
    }
  }

  requestNewOTP = async () => {

    document.getElementById("input1").value = null;
    document.getElementById("input3").value = null;
    document.getElementById("input2").value = null;
    document.getElementById("input4").value = null;
    document.getElementById("input5").value = null;
    document.getElementById("input6").value = null;


    var currInput = document.getElementById("input6");
    var nextInput = document.getElementById("input1");

    nextInput.disabled = false;
    currInput.disabled = true;
    currInput.blur();
    nextInput.focus();

    const filter = /^(?:(([+])?\d{10,13})|(^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$))$/;
    const { inputEmailNumber } = this.state;

    var result = inputEmailNumber.match(filter);

    //REQUEST NEW PHONE OTP
    if (result[1] !== undefined) {
      this.setState({
        emailOrPhone: false
      })
      //inputan nomor handphone
      var phonenum = this.state.inputEmailNumber;
      if (result[2] === undefined) {
        //angka dimulai 0
        this.sendVerificationCode(phonenum);
      } else {
        //angka dimulai +62
        phonenum = phonenum.replace('+62', '0');
        this.sendVerificationCode(phonenum);
      }
      return
    }



    //REQUEST NEW EMAIL OTP
    const urlA = myUrl.url_verifyOTP;
    var payload = {
      otp: ""
    };

    const option = {
      method: "POST",
      json: true,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Authorization": "window.localStorage.getItem('tokenOTP')"
      },
      body: JSON.stringify(payload)
    }

    //console.log(option);
    let data = await fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response
        } else {
          this.props.showNotification("Koneksi ke server gagal!", 'error');
        }
      }).catch((err) => {
        //console.log(err);
        this.props.showNotification("Koneksi ke server gagal!", 'error');
      });

    if (data) {
      var token = data.headers.get('Authorization');

      data = await data.json();

      var error = data.error;
      var metadata = data.metadata;

      if (error.status === false) {
        if (metadata.status === true) {
          window.localStorage.setItem('tokenOTP', token);
          //GOTO RESET PWD
          this.props.showNotification("Nomor OTP baru telah dikirim", 'info');
          this.setState({
            showNewOTP: false,
            timerMinute: 1,
            timerSecond: 0,
            timeUpMessage: "Waktu Habis! Tolong request ulang OTP",
            resetTimer: true
          }, () => this.setState({ resetTimer: false }));
        } else {
          this.props.showNotification(metadata.message, 'error');
        }
      } else {
        this.props.showNotification(error.msg, 'error');
      }
    } else {
      this.props.showNotification("Tidak ada respon dari server!", 'error');
    }
  }

  canBeSubmitted() {
    const filter = /^(?:(([\+])?\d{10,13})|(^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$))$/;
    const { inputEmailNumber } = this.state;
    var result = inputEmailNumber.match(filter);
    return inputEmailNumber.length !== 0 && result ? true : false;
  }

  canBeSubmittedLogin() {
    const { username, password } = this.state;
    return (username.length !== 0) && (password.length !== 0);
  }

  updateValue = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  OTPValueChange = (event) => {
    this.setState({
      otpValue: event.target.value
    })
  }

  showNewOTP = () => {
    //console.log("DONE TIMER");
    this.setState({
      showNewOTP: true
    })
  }

  componentDidMount() {
    if (this.isForgetPass) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
        'size': 'invisible',
        'callback': (response) => {
          //console.log("HEDEK")
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
        'expired-callback': () => {
          //console.log("HAHAHA")
          // Response expired. Ask user to solve reCAPTCHA again.
          // ...

        }
      })
      window.recaptchaVerifier.render()
    }
  }

  autoDel = (event) => {
    if (event.keyCode === 8) {
      if (event.target.value.length === 0) {
        event.target.previousElementSibling.disabled = false;
        event.target.disabled = true;

        //         event.target.blur();
        //         event.target.previousElementSibling.focus();
      } else {
        return;
      }
    } else {
      return;
    }
  }

  myFunction() {
    var x = document.getElementById("myInput");
    if (x.type === "password") {
      document.getElementById("checkbox").checked = true;
      x.type = "text";
    } else {
      document.getElementById("checkbox").checked = false;
      x.type = "password";
    }
  }

  autoTab = (event) => {
    if (event.keyCode !== 8) {
      event.target.focus();
      var currInput = event.target;
      var prevInput = event.target.previousElementSibling;
      var nextInput = event.target.nextElementSibling;
      if (document.getElementById("input1").value.length !== 0 && document.getElementById("input2").value.length !== 0
        && document.getElementById("input3").value.length !== 0 && document.getElementById("input4").value.length !== 0
        && document.getElementById("input5").value.length !== 0 && document.getElementById("input6").value.length !== 0) {
        this.setState({ isEnabledOTP: true })
      } else {
        this.setState({ isEnabledOTP: false })
      }

      if (currInput.id === "input6" && currInput.value.length > 0) {
        return;
      }
      if (currInput.value.length !== 0 && currInput.value.length === 1) {
        nextInput.disabled = false;
        currInput.disabled = true;
        currInput.blur();
        nextInput.focus();
        nextInput.select();
      } else if (currInput.value.length === 0 && currInput.id !== "input1") {
        prevInput.disabled = false;
        currInput.disabled = true;
        currInput.blur();
        prevInput.focus();
        prevInput.select();
      }
      //console.log(this.state.isEnabledOTP)
    } else {
      return
    }
  }

  render() {
    const {
      showLogo,
      usernameLabel,
      usernameInputProps,
      passwordLabel,
      passwordInputProps,
      emailNumberInputProps,
      emailNumberLabel,
      children,
      onLogoClick,
    } = this.props;

    const { OTP, loading } = this.state;

    const isEnabled = this.canBeSubmitted();
    // const isEnabledOTP = this.canBeSubmittedOTP();
    const isEnabledLogin = this.canBeSubmittedLogin();
    return (
      <Form onSubmit={this.handleSubmit}>

        {showLogo && (
          <div className="text-center pb-4">
            <img
              src={logo200Image}
              className="rounded"
              style={{ width: 60, height: 60 }}
              alt="logo"
              onClick={onLogoClick}
            />
          </div>
        )}


        {this.isLogin && (
          <FormGroup>
            <Label for={usernameLabel}>{usernameLabel}</Label>
            <Input {...usernameInputProps} value={this.state.username} onChange={this.updateValue} autoComplete="off" />
          </FormGroup>
        )}
        {this.isLogin && (
          <FormGroup>
            <Label for={passwordLabel}>{passwordLabel}</Label>
            <Input {...passwordInputProps} id="myInput" value={this.state.password} onChange={this.updateValue} />
          </FormGroup>
        )}
        {this.isLogin && (

          <Col>
            <Col>
              <Input type="checkbox" id="checkbox" onClick={this.myFunction}></Input>
              <Label>Show Password (F1)</Label>
            </Col>
          </Col>
        )}
        {this.isForgetPass && (
          <FormGroup>
            <Label for={emailNumberLabel}>{emailNumberLabel}</Label>
            <Input {...emailNumberInputProps} value={this.state.inputEmailNumber} disabled={this.state.OTP} onChange={this.updateValue} autoComplete="off" />
            <div id="recaptcha-container" ></div>
          </FormGroup>
        )}
        <br />
        {
          this.isForgetPass && OTP && (
            <FormGroup>
              <Timer
                minutes={this.state.timerMinute}
                seconds={this.state.timerSecond}
                timerOff={this.showNewOTP}
                timeUpMessage={""}
                resetTimer={this.state.resetTimer}
              />
              <CardBody hidden={this.state.showNewOTP}>
                <Col>
                  <Row>
                    <Input id="input1"
                      disabled={false}
                      onKeyDown={this.autoDel}
                      onKeyUp={this.autoTab}
                      onWheel={this.blur}
                      maxLength={1} autoComplete="off"
                      style={{ width: "15%", height: "100%", textAlign: "center", fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", marginRight: "auto", marginLeft: "auto" }}></Input>
                    <Input id="input2"
                      disabled={true}
                      onKeyDown={this.autoDel}
                      onKeyUp={this.autoTab}
                      type="tel"
                      maxLength={1} autoComplete="off"
                      style={{ width: "15%", height: "100%", textAlign: "center", fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", marginRight: "auto", marginLeft: "auto" }}></Input>
                    <Input id="input3"
                      disabled={true}
                      onKeyDown={this.autoDel}
                      onKeyUp={this.autoTab}
                      maxLength={1} autoComplete="off"
                      style={{ width: "15%", height: "100%", textAlign: "center", fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", marginRight: "auto", marginLeft: "auto" }}></Input>
                    <Input id="input4"
                      disabled={true}
                      onKeyDown={this.autoDel}
                      onKeyUp={this.autoTab}
                      maxLength={1} autoComplete="off"
                      style={{ width: "15%", height: "100%", textAlign: "center", fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", marginRight: "auto", marginLeft: "auto" }}></Input>
                    <Input id="input5"
                      disabled={true}
                      onKeyDown={this.autoDel}
                      onKeyUp={this.autoTab}
                      maxLength={1} autoComplete="off"
                      style={{ width: "15%", height: "100%", textAlign: "center", fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", marginRight: "auto", marginLeft: "auto" }}></Input>
                    <Input id="input6"
                      disabled={true}
                      onKeyDown={this.autoDel}
                      onKeyUp={this.autoTab}
                      maxLength={1} autoComplete="off"
                      style={{ width: "15%", height: "100%", textAlign: "center", fontSize: "20px", fontWeight: "bold", textTransform: "uppercase", marginRight: "auto", marginLeft: "auto" }}></Input>
                  </Row>
                </Col>
              </CardBody>
              <div className="text-center pt-1">
                <Button onClick={this.state.emailOrPhone ? this.signInWithEmail : this.signInWithPhone}
                  hidden={this.state.showNewOTP}
                  disabled={!this.state.isEnabledOTP}
                >Verifikasi</Button>
                <Button onClick={this.requestNewOTP}
                  hidden={!this.state.showNewOTP}
                >Minta Kode Baru</Button>
              </div>
            </FormGroup>
          )
        }

        <hr />

        {this.isLogin && (
          <Button disabled={!isEnabledLogin || loading}
            size="lg"
            className="bg-gradient-theme-left border-0"
            block
            onClick={this.nextStep}>
            {!loading && this.renderButtonText()}
            {loading && (
              <MdAutorenew />
            )}
            {loading && "Sedang diproses"}
          </Button>
        )}
        {this.isForgetPass && !OTP && (
          <Button disabled={!isEnabled || loading}
            size="lg"
            className="bg-gradient-theme-left border-0"
            block
            onClick={this.nextStep}>
            {!loading && this.renderButtonText()}
            {loading && (
              <MdAutorenew />
            )}
            {loading && "Sedang diproses"}
          </Button>
        )}

        {!OTP && <div className="text-center pt-1">
          <h6>atau</h6>
          <h6>
            {this.isForgetPass ? (
              <a href="#login" onClick={this.changeAuthState(STATE_LOGIN)}>
                Masuk
              </a>
            ) : (
                <a href="#forgetpass" onClick={this.changeAuthState(STATE_FORGETPASS)}>
                  Lupa Kata Sandi
              </a>
              )}
          </h6>
        </div>}
        {children}

        <script>
          {document.onkeydown = (e) => {
            e = e || window.event;
            switch (e.key) {
              // enter untuk simpan
              case "Enter":

                if ((isEnabledLogin === true || isEnabled === true) && this.state.enterButton === false) { this.nextStep() }
                // e.preventDefault();
                //console.log("BISA ENTER CUMI!")
                break;

              case "F1":
                this.myFunction();
                //console.log(this.myFunction);
                // alert("F1")
                e.preventDefault();
                break;
            }
            //menghilangkan fungsi default tombol
            // e.preventDefault();
          }}
        </script>
      </Form>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_CHECK = 'CHECK';
export const STATE_FORGETPASS = 'FORGETPASS';
export const FLAG_EMAIL = 'EMAIL';
export const FLAG_NUMBER = 'NUMBER';

AuthForm.propTypes = {
  authState: PropTypes.oneOf([STATE_LOGIN, STATE_FORGETPASS]).isRequired,
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
  onButtonClick: PropTypes.func,

};

AuthForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'Username',
  usernameInputProps: {
    type: 'input',
    placeholder: 'Username...',
    name: 'username'
  },
  passwordLabel: 'Password',
  passwordInputProps: {
    type: 'password',
    placeholder: 'Password...',
    name: 'password'
  },
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordInputProps: {
    type: 'password',
    placeholder: 'confirm your password',
    name: 'confirm'
  },
  emailNumberLabel: 'E-Mail/Phone Number',
  emailNumberInputProps: {
    type: 'text',
    placeholder: 'Email/phone number...',
    name: 'inputEmailNumber'
  },
  onLogoClick: () => { },
  onButtonClick: () => { }
};

export default AuthForm;
