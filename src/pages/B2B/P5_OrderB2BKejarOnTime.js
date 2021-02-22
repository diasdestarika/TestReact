import Page from 'components/Page';
import React from 'react';
import { Card, CardBody, Col, Row, Table } from 'reactstrap';
import { MdLoyalty } from 'react-icons/md';
import * as myUrl from '../urlLink';
import * as firebase from 'firebase/app';
import LoadingSpinner from '../LoadingSpinner';
import ScrollButton from 'pages/ScrollButton';

const perf = firebase.performance();

class OrderB2B extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      currentPage: 1,
      realCurrentPage: 1,
      todosPerPage: 7,
      maxPage: 1,
      flag: 0,
      loading: false,
      dataAvailable: false,
    };
  }

  //set Current Limit
  handleSelect(event) {
    this.setState(
      {
        [event.target.name]: event.target.value,
        currentPage: 1,
        realCurrentPage: 1,
      },
      () => {
        this.getListbyPaging(1, this.state.todosPerPage);
      },
    );
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
          this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
        },
      );
    }
  }

  pagination = (value, arrow, maxPage = 0) => {
    var currPage = Number(value);
    if (currPage + arrow > 0 && currPage + arrow <= maxPage) {
      this.setState(
        {
          currentPage: currPage + arrow,
          realCurrentPage: currPage + arrow,
        },
        () => {
          this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
        },
      );
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
              this.getListbyPaging(
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
              this.getListbyPaging(
                this.state.currentPage,
                this.state.todosPerPage,
              ),
          );
        }
      }
    }
  };

  enterPressedSearch = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.setState({ currentPage: 1, realCurrentPage: 1 }, () => {
        this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
      });
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

  getListbyPaging(currPage, currLimit) {
    const trace = perf.trace('getKejarOnTime');
    trace.start();
    var gudangID = window.localStorage.getItem('gID');
    //console.log(this.state.gudangID);

    const urlA = `${myUrl.url_b2b}type=onTime&gudangID=${gudangID}`;

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    ////console.log('url',urlA);
    ////console.log('token', window.localStorage.getItem('tokenCookies'))
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

  componentDidMount() {
    this.props.setTitle(
      'Pesanan B2B Yang Harus Kejar Ekspedisi Sebelum Terlambat (P5)',
      'red',
    );
    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    var myVar = setInterval(() => {
      //console.log('BERHASIL AUTO REFRESH');
      this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    }, 1800000);
  }

  render() {
    const currentTodos = this.state.result.data;
    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i} style={{ width: '200%' }}>
            <th scope="row" style={{ fontSize: '25px', textAlign: 'right' }}>
              {todo.Nomor}
            </th>
            <td style={{ fontSize: '25px' }}>{todo.Order_NmOutlet}</td>
            <td style={{ fontSize: '25px' }}>{todo.Order_ID}</td>
            <td style={{ fontSize: '25px' }}>{todo.Deadline}</td>
            <td style={{ fontSize: '25px' }}>{todo.Order_NOSP}</td>
            <td style={{ fontSize: '25px' }}>{todo.Order_NODO}</td>
            <td style={{ fontSize: '25px', textAlign: 'right' }}>
              {todo.Order_SelisihWaktuDeadline}
            </td>
            <td style={{ fontSize: '25px', textAlign: 'center' }}>
              {todo.Tipe}
            </td>
            <td style={{ fontSize: '25px' }}>{todo.Order_NOPL}</td>
          </tr>
        );
      });

    //totaldata

    return (
      <Page
        // title="Pesanan Yang Kejar On Time"
        // breadcrumbs={[{ name: 'Order', active: true }]}
        className="OrderB2B"
      >
        <Row>
          <Col>
            <Card className="mb-3">
              <CardBody>
                <Table responsive striped>
                  <thead>
                    <tr style={{ width: '200%' }}>
                      <th style={{ fontSize: '25px' }}>No.</th>
                      <th style={{ fontSize: '25px' }}>Outlet</th>
                      <th style={{ fontSize: '25px' }}>OrderID</th>
                      <th style={{ fontSize: '25px' }}>Deadline</th>
                      <th style={{ fontSize: '25px' }}>No SP</th>
                      <th style={{ fontSize: '25px' }}>No DO</th>
                      <th style={{ fontSize: '25px' }}>S.Wkt</th>
                      <th style={{ fontSize: '25px' }}>Tipe</th>
                      <th style={{ fontSize: '25px' }}>No PL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTodos}
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
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ScrollButton></ScrollButton>
      </Page>
    );
  }
}
export default OrderB2B;
