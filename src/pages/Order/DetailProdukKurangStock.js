import Page from 'components/Page';
import React from 'react';
import { Card, CardBody, Col, Row, Table } from 'reactstrap';
import { MdLoyalty } from 'react-icons/md';
import * as myUrl from '../urlLink';
import * as firebase from 'firebase/app';
import LoadingSpinner from '../LoadingSpinner';
import ScrollButton from 'pages/ScrollButton';

const perf = firebase.performance();

class DetailProduk extends React.Component {
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
      dataAvailable: false,
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
    const trace = perf.trace('getMalamIni');
    trace.start();
    var gudangID = window.localStorage.getItem('gID');
    const urlA = `${myUrl.url_product2}type=allAuth&gudangID=${gudangID}`;
    // console.log("URL DETAIL", urlA);

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
        trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
        }
      })
      .then(data => {
        // console.log("DATA DETAIL", data);
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
          this.setState(
            {
              result: data,
              maxPage:
                data.metadata.pages && data.metadata.pages !== '0'
                  ? data.metadata.pages
                  : 1,
              loading: false,
            },
            () => this.setDataStatus(),
          );
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
      })
      .then(() => {
        this.setState({ loading: false });
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

  getListbyPaging2(currPage2, currLimit2) {
    const trace = perf.trace('getMalamIni');
    trace.start();
    const urlA = myUrl.url_order + 'type=alreadyDeadlineAll';

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
        trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
        }
      })
      .then(data => {
        //console.log(data);
        //console.log('already');

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
            result2: data,
            maxPage:
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
      'Laporan Detail Product Kurang Stock di Gudang',
      'black',
    );
    this.getListbyPaging1(this.state.currentPage, this.state.todosPerPage);
    // var myVar =
    setInterval(() => {
      //console.log('BERHASIL AUTO REFRESH');
      this.getListbyPaging1(this.state.currentPage, this.state.todosPerPage);
    }, 1800000);
  }

  render() {
    const currentTodos = this.state.result.data;
    //notYet
    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <th scope="row" style={{ fontSize: '25px' }}>
              {todo.Nomor}
            </th>
            <td style={{ fontSize: '25px' }}>{todo.Pro_Name}</td>
            <td style={{ fontSize: '25px' }}>{todo.SpcH_NoSP}</td>
            <td style={{ fontSize: '25px' }}>{todo.QtySP_Plp}</td>
            <td style={{ fontSize: '25px' }}>{todo.SPNQty_All}</td>
            <td style={{ fontSize: '25px' }}>{todo.StokAvailable}</td>
          </tr>
        );
      });

    return (
      <Page
        // title="Pesanan Yang Sudah Ada No. Resi"
        // breadcrumbs={[{ name: 'Order', active: true }]}
        className="DetailProduk"
      >
        <Row>
          <Col>
            <Card className="mb-3">
              <CardBody>
                <Row>
                  <Col>
                    {/* <Card className="mb-3">
                                            <CardHeader style={{ backgroundColor: '#047873', color: 'white', textAlign:'center' }}> <Label style={{ textAlign: 'center', fontSize: '20px' }}><b>Tim Ekspedisi Kejar Pick Up Sebelum Terlambat</b></Label></CardHeader>
                                            <CardBody> */}
                    {/* notYet */}
                    <Table responsive striped>
                      <thead>
                        <tr>
                          <th style={{ fontSize: '25px' }}>No.</th>
                          {/* <th style={{ fontSize: '25px' }}>OrderID Shopee</th>
                          <th style={{ fontSize: '25px' }}>Deadline</th> */}
                          <th style={{ fontSize: '25px' }}>Nama Produk</th>
                          <th style={{ fontSize: '25px' }}>No. SP</th>
                          <th style={{ fontSize: '25px' }}>Qty SP N Pelapak</th>
                          <th style={{ fontSize: '25px' }}>Qty SP N All</th>
                          <th style={{ fontSize: '25px' }}>Stock Available</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentTodos ? (
                          renderTodos || (
                            <LoadingSpinner status={4}></LoadingSpinner>
                          )
                        ) : this.state.dataAvailable ? (
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
                          <LoadingSpinner status={4} />
                        )}
                      </tbody>
                    </Table>
                    {/* </CardBody>
                                        </Card> */}
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
export default DetailProduk;
