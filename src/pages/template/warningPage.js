import Page from 'components/Page';
import Typography from 'components/Typography';
import { Button } from 'reactstrap';
import React from 'react';
import warning from './warning.png';

import { Card, CardBody, Col, Row } from 'reactstrap';

class warningPage extends React.Component {
  tokenCookiesRemover = () => {
    window.localStorage.removeItem('tokenCookies');
    window.localStorage.removeItem('profile');
    document.cookie = 'tokenCookies=';
    // console.log('HIYAHIYAHIYA');
    return this.props.history.push('/login');
  };

  setProfileData() {
    var profileName = JSON.parse(window.localStorage.getItem('profile'));
    // console.log('PROFILE', profileName);

    if (profileName === null) {
      return;
    } else {
      this.setState(
        {
          nip: profileName.mem_nip,
          nama: profileName.mem_username,
        },
        // () => console.log('nama', this.state.nama),
      );
    }
  }

  componentDidMount() {
    this.setProfileData();

    var akses = window.localStorage.getItem('accessList');
    // console.log('AKSES', akses);
  }

  render() {
    return (
      <Page title="Akses Ditolak!" style={{ textAlign: 'center' }}>
        {/* {console.log(
          'tokenCookies',
          window.localStorage.getItem('tokenCookies'),
          'accessList',
          window.localStorage.getItem('accessList'),
        )} */}
        <Row>
          <Col>
            <Card>
              <CardBody>
                <br></br>
                <Typography type="h1">OOPS!</Typography>
                <br></br>
                <img src={warning} height="200px" width="200px" alt="warning" />
                <br></br>
                <br></br>
                <br></br>
                <Typography type="h5">
                  Maaf Anda tidak dapat mengakses halaman ini karena anda tidak
                  memiliki Hak Akses!
                </Typography>
                <br></br>
                <Button onClick={() => this.tokenCookiesRemover()}>
                  Kembali ke Halaman Login
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default warningPage;
