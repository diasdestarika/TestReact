import Page from 'components/Page';
import logo200Image from 'assets/img/logo/logo_200.png';
import AuthForm, { STATE_CHECK } from 'components/AuthForm';
import React from 'react';
import { Button, Card, CardBody, Col, Row, Label, Input } from 'reactstrap';
import { MdExitToApp } from 'react-icons/md';
import * as myUrl from '../urlLink';
// import * as firebase from 'firebase/app';
import { getThemeColors } from 'utils/colors';
import LoadingSpinner from '../LoadingSpinner';
import { Redirect } from 'react-router-dom';

const colors = getThemeColors();
var accessList = {};

// const perf = firebase.performance();

class CheckGudang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAvailable: false,
    };
    if (window.localStorage.getItem('accessList')) {
      accessList = JSON.parse(window.localStorage.getItem('accessList'));
    }
  }
  getListbyPaging() {
    const urlA = myUrl.url_allGudang;

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };

    fetch(urlA, option)
      .then(response => {
        // // trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          // this.showNotification("Koneksi ke server gagal!", 'error');
        }
      })
      .then(data => {
        // console.log("data gudang",data);
        this.setState({ result: data.data }, () => this.setDataStatus());
      });
  }

  setDataStatus() {
    if (this.state.result !== null || this.state.result !== undefined) {
      this.setState({
        dataAvailable: true,
      });
    } else {
      this.setState({
        dataAvailable: false,
      });
    }
  }

  componentDidMount() {
    this.setDataProfile();
    this.getAccess();
    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
  }

  state = {
    isOpenNotificationPopover: false,
    isNotificationConfirmed: false,
    isOpenUserCardPopover: false,
    redirect: false,
    pilihGudang: '',
    namaGudang: '',
  };

  signOut = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('accessList');
    this.setState({
      redirect: true,
    });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
  };

  Masuk = () => {
    window.localStorage.setItem('gID', this.state.pilihGudang);
    window.localStorage.setItem('gName', this.state.namaGudang);
    if (this.state.pilihGudang !== '' || this.state.pilihGudang !== null) {
      if (
        this.state.menuID === 8 &&
        this.state.nama !== 'sa' &&
        this.state.nama !== 'receiving' &&
        this.state.nama !== 'gudang'
      ) {
        this.props.history.push('/Ekspedisi-Scanner');
      } else if (this.state.menuID === 6 && 
      this.state.nama !== 'sa' &&
      this.state.nama !== 'receiving' &&
      this.state.nama !== 'gudang'
      ){
        this.props.history.push('/Ekspedisi-Viewer')
      }else {
        this.props.history.push('/Dashboard');
      }
    } else {
      this.props.history.push('/login');
    }
  };

  setGroup = event => {
    var nama = this.state.result.find(function (element) {
      return element.Out_Code === event.target.value;
    });
    this.setState({
      pilihGudang: event.target.value,
      namaGudang: nama.Out_Name,
    });
  };

  setDataProfile() {
    var profileName = JSON.parse(window.localStorage.getItem('profile'));
    if (profileName === null) {
      return;
    } else {
      this.setState({
        nip: profileName.mem_nip,
        nama: profileName.mem_username,
      });
    }
  }

  getAccess() {
    var access = accessList[4];
    access &&
      access.map(todo => {
        return (
          <tr>
            {todo === 6 && this.setState({ menuID: 6 })}
            {todo === 7 && this.setState({ menuID: 7 })}
            {todo === 8 && this.setState({ menuID: 8 })}
          </tr>
        );
      });
  }

  render() {
    var listGudang = this.state.result;
    const renderGudang =
      listGudang &&
      listGudang.map((todo, i) => {
        return <option value={todo.Out_Code}>{todo.Out_Name}</option>;
      });

    var spinner =
      listGudang !== null ? (
        renderGudang !== null && (
          <Input
            type="select"
            autoComplete="off"
            name="select"
            color="primary"
            style={{ marginRight: '1px' }}
            onChange={this.setGroup}
          >
            <option value={0} disabled selected hidden id="pilih">
              Pilih Gudang
            </option>
            .dela
            {renderGudang}
          </Input>
        )
      ) : (
        <tr>
          <td
            style={{ backgroundColor: 'white' }}
            colSpan="17"
            className="text-center"
          >
            Tidak ada respon dari server!
          </td>
        </tr>
      );
    //totaldata

    return (
      <Page>
        {this.renderRedirect()}
        <Row
          style={{
            height: '80vh',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Col sm={4} md={4} lg={4}>
            <Card>
              <div className="text-center pb-4">
                <img
                  src={logo200Image}
                  className="rounded"
                  style={{ width: 60, height: 60, marginTop: '5%' }}
                  alt="logo"
                />
              </div>
              <CardBody style={{ textAlign: 'center' }}>
                <Label style={{ textAlign: 'center' }}>
                  Silahkan Pilih Gudang:
                </Label>
                {listGudang ? (
                  (
                    <Input
                      type="select"
                      autoComplete="off"
                      name="select"
                      color="primary"
                      style={{ marginRight: '1px' }}
                      onChange={this.setGroup}
                    >
                      <option value={0} disabled selected hidden id="pilih">
                        Pilih Gudang
                      </option>
                      {renderGudang}
                    </Input>
                  ) || <LoadingSpinner status={5} />
                ) : this.state.dataAvailable ? (
                  <Row style={{ textAlign: 'center' }}>
                    <Col style={{ textAlign: 'center' }}>
                      <br></br>TIDAK ADA DATA GUDANG
                    </Col>
                  </Row>
                ) : (
                  <LoadingSpinner status={5} />
                )}
                <div
                  className="text-center pt-1"
                  style={{ textAlign: 'center' }}
                >
                  <Col style={{ textAlign: 'center' }}>
                    <br></br>
                    <Button
                      disabled={this.state.pilihGudang === undefined}
                      style={{ width: '150px' }}
                      onClick={this.Masuk}
                    >
                      Masuk
                    </Button>
                    <br></br>
                    <Label>Atau</Label>
                    <br></br>
                    <Button
                      outline
                      onClick={this.signOut}
                      style={{ width: '150px' }}
                    >
                      <MdExitToApp size={25} /> Keluar
                    </Button>
                  </Col>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default CheckGudang;
