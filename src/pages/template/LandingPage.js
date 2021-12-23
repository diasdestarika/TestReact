/* eslint-disable default-case */
import Page from 'components/Page';
import logo200Image from 'assets/img/logo/logo_200.png';
import React from 'react';
import { Card, CardBody, Col, Row, Table } from 'reactstrap';
import * as myUrl from '../urlLink';
import { Redirect } from 'react-router-dom';
import { MdLoyalty } from 'react-icons/md';
import LoadingSpinner from './LoadingSpinner';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenCookies: '',
      access: '',
      profile: '',
      redirect: false,
    };
  }

  showNotification = (currMessage, levelType) => {
    setTimeout(() => {
      if (!this.notificationSystem) {
        return;
      }
      this.notificationSystem.addNotification({
        title: <MdLoyalty />,
        message: currMessage,
        level: levelType,
      });
    }, 1000);
  };

  checktokenCookies() {
    var currlink = window.location.href;
    var decodedCookie = decodeURIComponent(document.cookie);
    console.log('1', decodedCookie.includes('token') === true);
    var splitCookie = decodedCookie.split(';');
    if (splitCookie[0] === 'urlLink=' || splitCookie[0] === '') {
      console.log('2');
      document.cookie =
        'urlLink=' +
        currlink +
        ';' +
        'tokenCookies=' +
        this.state.tokenCookies +
        ';';
      // window.location = 'https://staging-auth.pharmalink.id/login';
      window.location.pathname = '/login';
    } else {
      if (decodedCookie.includes('token') === true) {
        console.log('3');
        for (let i = 0; i < splitCookie.length; i++) {
          var text = splitCookie[i].split('=');

          switch (text[0]) {
            case 'tokenCookies':
              window.localStorage.setItem('tokenCookies', text[1]);
              this.showNotification('Selamat anda memiliki token', 'info');
              this.directFunction();
              break;
          }
        }
      } else {
        console.log('4');
        document.cookie =
        'urlLink=' +
        currlink +
        ';' +
        'tokenCookies=' +
        this.state.tokenCookies +
        ';';
        // window.location.href = 'https://staging-auth.pharmalink.id/login';
        window.location.pathname = '/login';

      }
    }
    console.log('5');
  }

  directFunction = () => {
    var tokenCookiesLocalStorage = window.localStorage.getItem('tokenCookies');
    if (
      tokenCookiesLocalStorage !== null ||
      tokenCookiesLocalStorage !== '' ||
      tokenCookiesLocalStorage !== undefined
    ) {
      this.setState({ tokenCookies: tokenCookiesLocalStorage }, () =>
        this.reqProfile(),
      );
    }
  };

  reqProfile() {
    const urlA = myUrl.url_profile;
    var redirectURL = 'https://staging-auth.pharmalink.id/login';
    // var redirectURL = 'http://localhost:8080/login';

    console.log('tokenCookies', this.state.tokenCookies);

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: this.state.tokenCookies,
      },
    };
    fetch(urlA, option)
      .then(response => {
        console.log('respon', response.status === 400);

        if (response.ok === true) {
          return response.json();
        }
        if (response.status === 400) {
          this.showNotification(
            'Koneksi ke server gagal, silakan hubungi operator/cek koneksi anda!',
            'error',
          );
          window.location.pathname = '/login';
          // var redirectURL = 'http://localhost:8080/login';
        }
      })
      .then(data => {
        console.log('data', data);
        console.log('erorr status', data.error.status);

        if (data === undefined || data.error.status === true) {
          this.showNotification(
            'Koneksi ke server gagal, silakan hubungi operator/cek koneksi anda!',
            'error',
          );
          window.localStorage.removeItem('tokenCookies');
          window.localStorage.removeItem('accessList');
          window.location.pathname = '/login';
        } else {
          this.showNotification(
            'Anda berhasil masuk, selamat bekerja!',
            'info',
          );
          this.setState(
            {
              result: data.data,
              redirect: true,
            },
            () => this.renderRedirect(),
          );
        }
        var accessList = {};
        var profileList = JSON.parse(window.localStorage.getItem('profile'));
        accessList = profileList.mem_access;
        window.localStorage.setItem('AccessList', JSON.stringify(accessList));
        console.log(JSON.parse(window.localStorage.getItem('AccessList')));
      })
      .catch(err => {
        this.showNotification(
          'Koneksi ke server gagal, silakan hubungi operator/cek koneksi anda!!',
          'error',
        );
        this.setState({
          loading: false,
        });
      });
  }

  renderRedirect = () => {
    window.localStorage.setItem('profile', JSON.stringify(this.state.result));
    if (this.state.redirect) {
      setTimeout(() => {
        this.props.history.push('/Dashboard');
      }, 3000);
    }
  };

  componentDidMount() {
    // this.checktokenCookies();
    window.location.pathname = "/login"
  }

  render() {
    var profile = window.localStorage.getItem('profile');
    console.log('profile', profile);

    return (
      <Page>
        {this.renderRedirect()}
        <Row
          style={{
            height: '80vh',
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 0,
          }}
        >
          <Col style={{ paddingBottom: 0 }}>
            <NotificationSystem
              dismissible={false}
              ref={notificationSystem =>
                (this.notificationSystem = notificationSystem)
              }
              style={NOTIFICATION_SYSTEM_STYLE}
            />
            <div style={{ paddingBottom: 0, textAlign: 'center' }}>
              <img
                src={logo200Image}
                className="rounded"
                style={{ width: 60, height: 60, marginTop: '15%' }}
                alt="logo"
              />
            </div>
            <CardBody
              style={{ textAlign: 'center', paddingBottom: 0, paddingTop: 0 }}
            >
              <Table responsive borderless>
                <tbody style={{ paddingBottom: 0 }}>
                  <LoadingSpinner status={4}></LoadingSpinner>
                </tbody>
              </Table>
            </CardBody>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default LandingPage;
