import Page from 'components/Page';
import React from 'react';
import { Card, CardBody, Col, Row, Table } from 'reactstrap';
import { MdLoyalty } from 'react-icons/md';
import * as myUrl from '../urlLink';
import * as firebase from 'firebase/app';
import LoadingSpinner from '../LoadingSpinner';
import ScrollButton from 'pages/ScrollButton';

const perf = firebase.performance();

class SummaryProduct extends React.Component {
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
    const urlA = `${myUrl.url_product}type=allAuth&gudangID=${gudangID}`;
    // console.log("URL SUMMARY", urlA);

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
        // console.log("DATA SUMMARY",data);
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

  componentDidMount() {
    this.props.setTitle(
      'Laporan Summary Product Kurang Stock di Gudang',
      'black',
    );
    this.getListbyPaging1(this.state.currentPage, this.state.todosPerPage);
    // var myVar = 
    setInterval(() => {
      //console.log('BERHASIL AUTO REFRESH');
      this.getListbyPaging1(this.state.currentPage, this.state.todosPerPage);
    }, 1800000);
    console.log('TOKEN', window.localStorage.getItem('tokenCookies'));
  }

  render() {
    const currentTodos = this.state.result.data;
    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <th scope="row" style={{ fontSize: '25px', textAlign: 'right' }}>
              {todo.Nomor}
            </th>
            {/* <td style={{ fontSize: '25px' }}>{todo.SpcD_Procod}</td> */}
            <td style={{ fontSize: '25px' }}>{todo.Pro_Name}</td>
            <td style={{ fontSize: '25px' }}>{todo.QtySP_Plp}</td>
            <td style={{ fontSize: '25px' }}>{todo.SPNQty_All}</td>
            <td style={{ fontSize: '25px' }}>{todo.StokFisik}</td>
            <td style={{ fontSize: '25px' }}>{todo.StokAvailable}</td>
          </tr>
        );
      });

    return (
      <Page className="SummaryProduct">
        <Row>
          <Col>
            <Card className="mb-3">
              <CardBody>
                <Row>
                  <Col>
                    <Table responsive striped>
                      <thead>
                        <tr>
                          <th style={{ fontSize: '25px' }}>No.</th>
                          <th style={{ fontSize: '25px' }}>Prodesc</th>
                          {/* <th style={{ fontSize: '25px' }}>Prodesc</th> */}
                          <th style={{ fontSize: '25px' }}>Qty SP N Pelapak</th>
                          <th style={{ fontSize: '25px' }}>Qty SP N All</th>
                          <th style={{ fontSize: '25px' }}>Stock Gudang</th>
                          <th style={{ fontSize: '25px' }}>Stock Available</th>
                          {/* <th style={{ fontSize: '25px' }}>
                            Stock Avail - Total SP
                          </th> */}
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
export default SummaryProduct;
