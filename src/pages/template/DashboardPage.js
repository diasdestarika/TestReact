import Page from 'components/Page';
// import logo200Image from 'assets/img/logo/logo_200.png';
import React from 'react';
import {
  Col,
  Row,
  Label,
  CardBody,
  Table,
  Card,
  CardHeader,
  Form,
} from 'reactstrap';
import * as myUrl from '../urlLink';
import LoadingSpinner from '../LoadingSpinner';
import { MdLoyalty } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

class DashboardPage extends React.Component {
  state = {
    nama: '',
    result: [],
    totalOutstanding: 0,
    dataAvailable: false,
  };

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
    }, 300);
  };

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

  getListbyPaging() {
    var gID = window.localStorage.getItem('gID');
    // const urlA = myUrl.url_getDashboard + 981;
    const urlA = myUrl.url_getDashboard + gID;

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
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
        }
      })
      .then(data => {
        // console.log('DATA DASHBOARD', data.data);

        if (data.error.status === true) {
          this.showNotification(data.error.msg, 'error');
          this.setState({ setDataErrorStatus: true });
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            this.props.history.push({
              pathname: '/login',
            });
          }
          if (data.error.code === 101) {
            this.setDataStatus();
          }
        } else {
          this.setState(
            {
              setDataErrorStatus: true,
              result: data.data.outstanding_breakdown,
              totalOutstanding: data.data.total_outstanding,
              loading: false,
            },
            () => this.setDataStatus(),
          );
        }
      })
      .catch(err => {
        console.log('ERROR TYPE:', err);
        this.showNotification('Koneksi ke server gagal!', 'error');
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  setProfileData() {
    var profileName = JSON.parse(window.localStorage.getItem('profile'));

    if (profileName === null) {
      return profileName;
    } else {
      this.setState({
        nip: profileName.mem_nip,
        nama: profileName.mem_username,
      });
    }
  }

  refreshPage() {
    var location = window.location.href;
    if (window.location.search.length < 1) {
      window.top.location = window.top.location + '?reload';
    }
  }

  componentDidMount() {
    this.setProfileData();
    this.setState({ isHeight: window.innerHeight * 0.65 });
    this.props.setTitle('Dashboard Logistic', 'black');
    this.getListbyPaging();
  }

  render() {
    var formatter = new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
    });
    var currentTodos = this.state.result;
    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <th scope="row" style={{ textAlign: 'left' }}>
              {todo.kode}
            </th>
            <td style={{ textAlign: 'left' }}>{todo.pelapak}</td>
            <td style={{ textAlign: 'left' }}>{todo.ecommerce}</td>
            <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.jumlah_outstanding)}
            </td>
          </tr>
        );
      });

    return (
      <Page>
        <NotificationSystem
          dismissible={false}
          ref={notificationSystem =>
            (this.notificationSystem = notificationSystem)
          }
          style={NOTIFICATION_SYSTEM_STYLE}
        />
        <Row>
          <Col style={{ textAlign: 'center', marginTop: '1%' }}>
            <Card className="mb-3" id="pesananPelapak">
              <CardHeader>
                <Form inline>
                  <Label style={{ fontWeight: 'bold' }}>
                    Total Outstanding Pelapak:
                  </Label>
                  <Label style={{ fontWeight: 'bold', color: 'red' }}>
                    &nbsp;{formatter.format(this.state.totalOutstanding)}
                  </Label>
                  <Label style={{ fontWeight: 'bold' }}>&nbsp;Pesanan</Label>
                </Form>
              </CardHeader>
              <CardBody>
                <Table
                  responsive
                  striped
                  style={{
                    display: 'block',
                    overflow: 'auto',
                    height: this.state.isHeight,
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', width: '10%' }}>Kode</th>
                      <th style={{ textAlign: 'left', width: '50%' }}>
                        Pelapak
                      </th>
                      <th style={{ textAlign: 'left', width: '50%' }}>
                        Ecommerce
                      </th>
                      <th style={{ textAlign: 'right', width: '40%' }}>
                        Jumlah Outstanding
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {this.state.setDataErrorStatus && !currentTodos ? (
                      <tr>
                        <td
                          style={{ backgroundColor: 'white' }}
                          colSpan="17"
                          className="text-center"
                        >
                          TIDAK ADA DATA
                        </td>
                      </tr>
                    ) : this.state.dataAvailable ? (
                      currentTodos.length === 0 ? (
                        <tr>
                          <td
                            style={{ backgroundColor: 'white' }}
                            colSpan="17"
                            className="text-center"
                          >
                            TIDAK ADA DATA
                          </td>
                        </tr>
                      ) : (
                        renderTodos
                      )
                    ) : (
                      <LoadingSpinner status={4} />
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default DashboardPage;
