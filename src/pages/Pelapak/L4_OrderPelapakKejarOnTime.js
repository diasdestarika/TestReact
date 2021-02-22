import Page from 'components/Page';
import React from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
  CardHeader,
  Form,
  Label,
  Input,
} from 'reactstrap';
import { MdLoyalty } from 'react-icons/md';
import * as myUrl from '../urlLink';
import * as firebase from 'firebase/app';
import LoadingSpinner from '../LoadingSpinner';
import ScrollButton from 'pages/ScrollButton';

const perf = firebase.performance();

class ResiPageNotYet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      result2: [],
      currentPage: 1,
      currentPage2: 1,
      realCurrentPage: 1,
      realCurrentPage2: 1,
      todosPerPage: 4,
      todosPerPage2: 4,
      maxPage: 1,
      maxPage2: 1,
      flag: 0,
      flag2: 0,
      keyword: '',
      loading: false,
      pilihEcommerce: 'all',
      namaEcommerce: '',
    };
  }

  //set Current Page
  paginationButton(event, flag, maxPage = 0) {
    var currPage = Number(event.target.value);
    if (currPage + flag > 0 && currPage + flag <= maxPage) {
      this.setState(
        {
          currentPage: currPage + flag,
          realCurrentPage: currPage + flag,
        },
        () => {
          this.getListbyPaging1(
            this.state.currentPage,
            this.state.todosPerPage,
          );
        },
      );
    }
  }

  //set Current Page
  paginationButton2(event, flag2, maxPage2 = 0) {
    var currPage2 = Number(event.target.value);
    if (currPage2 + flag2 > 0 && currPage2 + flag2 <= maxPage2) {
      this.setState(
        {
          currentPage2: currPage2 + flag2,
          realCurrentPage2: currPage2 + flag2,
        },
        () => {
          this.getListbyPaging2(
            this.state.currentPage2,
            this.state.todosPerPage2,
          );
        },
      );
    }
  }

  pagination = (value, arrow, maxPage = 1) => {
    var currPage = Number(value);
    if (currPage + arrow > 0 && currPage + arrow <= maxPage) {
      this.setState(
        {
          currentPage: currPage + arrow,
          realCurrentPage: currPage + arrow,
        },
        () => {
          this.getListbyPaging1(
            this.state.currentPage,
            this.state.todosPerPage,
          );
        },
      );
      //console.log('already');
    }
  };

  pagination2 = (value2, arrow2, maxPage2 = 1) => {
    var currPage2 = Number(value2);
    if (currPage2 + arrow2 > 0 && currPage2 + arrow2 <= maxPage2) {
      this.setState(
        {
          currentPage2: currPage2 + arrow2,
          realCurrentPage2: currPage2 + arrow2,
        },
        () => {
          this.getListbyPaging2(
            this.state.currentPage2,
            this.state.todosPerPage2,
          );
        },
      );
      //console.log('notYet');
    }
  };

  enterPressedPage = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      if (this.state.currentPage > 0) {
        if (this.state.currentPage > this.state.maxPage) {
          this.setState(
            prevState => ({
              realCurrentPage: prevState.maxPage,
              currentPage: prevState.maxPage,
            }),
            () =>
              this.getListbyPaging1(
                this.state.currentPage,
                this.state.todosPerPage,
              ),
          );
        } else {
          this.setState(
            prevState => ({
              realCurrentPage: prevState.currentPage,
            }),
            () =>
              this.getListbyPaging1(
                this.state.currentPage,
                this.state.todosPerPage,
              ),
          );
        }
      }
    }
  };

  enterPressedPage2 = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      if (this.state.currentPage2 > 0) {
        if (this.state.currentPage2 > this.state.maxPage2) {
          this.setState(
            prevState => ({
              realCurrentPage2: prevState.maxPage2,
              currentPage2: prevState.maxPage2,
            }),
            () =>
              this.getListbyPaging2(
                this.state.currentPage2,
                this.state.todosPerPage2,
              ),
          );
        } else {
          this.setState(
            prevState => ({
              realCurrentPage2: prevState.currentPage,
            }),
            () =>
              this.getListbyPaging2(
                this.state.currentPage2,
                this.state.todosPerPage2,
              ),
          );
        }
      }
    }
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

  getListbyPaging1(currPage, currLimit) {
    // const trace = perf.trace('getMalamIni');
    // trace.start();
    var eID = this.state.pilihEcommerce;
    var gudangID = window.localStorage.getItem('gID');
    const urlA =
      myUrl.url_order +
      'type=notYetDeadlineAuth' +
      '&gudangID=' +
      gudangID +
      '&outletID=' +
      eID;

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
        // trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
        }
      })
      .then(data => {
        //console.log(data);
        //console.log('notYet');

        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.responseDescription.toLowerCase().includes('expired')) {
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/login',
            });
          }
        } else {
          this.setState({
            result: data,
            maxPage2:
              data.metadata.pages && data.metadata.pages !== '0'
                ? data.metadata.pages
                : 1,
            loading: false,
          });
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  componentDidMount() {
    this.props.setTitle(
      'Pesanan Yang Harus Kejar Ekspedisi Sebelum Terlambat (L4)',
      'orange',
    );
    this.getListbyPaging1(this.state.currentPage, this.state.todosPerPage);
    this.getAllEcommerce();
    var myVar = setInterval(() => {
      //console.log('BERHASIL AUTO REFRESH');
      this.getListbyPaging1(this.state.currentPage, this.state.todosPerPage);
    }, 1800000);
  }

  setEcommerce = event => {
    var nama = this.state.resultEcommerce.find(function (element) {
      return element.Out_Code === event.target.value;
    });
    this.setState(
      {
        pilihEcommerce: event.target.value,
        namaEcommerce: nama.Out_Name,
      },
      () => this.getListbyPaging1(),
    );
    //console.log(event.target.value);
    //console.log(nama.Out_Name);
  };

  getAllEcommerce() {
    var gudangID = window.localStorage.getItem('gID');
    const urlA =
      myUrl.url_pilihEcommerce + 'type=all' + '&gudangID=' + gudangID;
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
        }
      })
      .then(data => {
        //console.log('data', data);
        this.setState({ resultEcommerce: data.data });
      });
  }

  render() {
    const currentTodos = this.state.result.data;
    const listEcommerce = this.state.resultEcommerce;
    const renderEcommerce =
      listEcommerce &&
      listEcommerce.map((todo, i) => {
        return <option value={todo.Out_Code}>{todo.Out_Name}</option>;
      });
    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <th scope="row" style={{ fontSize: '25px', textAlign: 'right' }}>
              {todo.Nomor}
            </th>
            <td style={{ fontSize: '25px' }}>{todo.Order_NmOutlet}</td>
            <td style={{ fontSize: '25px' }}>{todo.OrderID_Ecommerce}</td>
            <td style={{ fontSize: '25px' }}>{todo.Order_TrackingNo}</td>
            <td style={{ fontSize: '25px' }}>{todo.ShippingName}</td>
            <td style={{ fontSize: '25px' }}>{todo.Order_DeadlineKirim}</td>
            <td style={{ fontSize: '25px' }}>
              {todo.Order_SelisihWaktuDeadlineKirim}
            </td>
            <td style={{ fontSize: '25px' }}>{todo.Order_TanggalCancel}</td>
          </tr>
        );
      });

    return (
      <Page
        // title="Pesanan Yang Sudah Ada No. Resi"
        // breadcrumbs={[{ name: 'Order', active: true }]}
        className="ResiPageNotYet"
      >
        <Row>
          <Col>
            <Card className="mb-3">
              <CardHeader>
                <Form inline>
                  <Label style={{ fontWeight: 'bold' }}>Filter Pelapak: </Label>
                  <Input
                    type="select"
                    autoComplete="off"
                    name="select"
                    color="info"
                    style={{
                      marginLeft: '1%',
                      width: '40%',
                      textAlign: 'center',
                    }}
                    onChange={this.setEcommerce}
                  >
                    <option value={0} disabled selected hidden id="pilih">
                      Silahkan Pilih Pelapak
                    </option>
                    {renderEcommerce}
                  </Input>
                </Form>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    {/* notYet */}
                    <Table responsive striped>
                      <thead>
                        <tr>
                          <th style={{ fontSize: '25px' }}>No.</th>
                          <th style={{ fontSize: '25px' }}>Outlet</th>
                          <th style={{ fontSize: '25px' }}>OrderID Shopee</th>
                          <th style={{ fontSize: '25px' }}>No Resi</th>
                          <th style={{ fontSize: '25px' }}>Kurir</th>
                          <th style={{ fontSize: '25px' }}>Telat</th>
                          <th style={{ fontSize: '25px' }}>S.wkt</th>
                          <th style={{ fontSize: '25px' }}>Cancel</th>
                        </tr>
                      </thead>
                      <tbody>
                        {renderTodos}
                        {!renderEcommerce ? (
                          <LoadingSpinner status={4} />
                        ) : (
                          !currentTodos && (
                            <tr>
                              <td
                                style={{ backgroundColor: 'white' }}
                                colSpan="17"
                                className="text-center"
                              >
                                TIDAK ADA DATA
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ScrollButton></ScrollButton>
      </Page>
    );
  }
}
export default ResiPageNotYet;
