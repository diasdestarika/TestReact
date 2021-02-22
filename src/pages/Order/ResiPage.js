import Page from 'components/Page';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Label,
  ButtonGroup,
  CardHeader,
} from 'reactstrap';
import { MdLoyalty } from 'react-icons/md';
import * as myUrl from '../urlLink';
import * as firebase from 'firebase/app';
import ScrollButton from 'pages/ScrollButton';

const perf = firebase.performance();

class ResiPage extends React.Component {
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
    // const urlA = myUrl.url_order + "type=notYetDeadline" + "&offset=" + currPage + "&limit=" + currLimit;
    const urlA = myUrl.url_order + 'type=notYetDeadlineAll';

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenLogin'),
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
            window.localStorage.removeItem('tokenLogin');
            window.localStorage.removeItem('orderMalamIni');
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

  getListbyPaging2(currPage2, currLimit2) {
    // const trace = perf.trace('getMalamIni');
    // trace.start();
    // const urlA = myUrl.url_order + "type=alreadyDeadline" + "&offset=" + currPage2 + "&limit=" + currLimit2;
    const urlA = myUrl.url_order + 'type=alreadyDeadlineAll';

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenLogin'),
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
        //console.log('already');

        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.responseDescription.toLowerCase().includes('expired')) {
            window.localStorage.removeItem('tokenLogin');
            window.localStorage.removeItem('orderMalamIni');
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
    this.props.setTitle('Pesanan Yang Harus Kejar Ekspedisi');
    this.getListbyPaging1(this.state.currentPage, this.state.todosPerPage);
    this.getListbyPaging2(this.state.currentPage2, this.state.todosPerPage2);
    // var myVar = setInterval(() => {
    //     if (this.state.currentPage >= this.state.maxPage && this.state.currentPage2 >= this.state.maxPage2) {
    //         this.pagination(1, 0, this.state.maxPage);
    //         this.pagination2(1, 0, this.state.maxPage2);

    //     }
    //     // else if (this.state.currentPage2 >= this.state.maxPage2) {
    //     //     this.pagination2(1, 0, this.state.maxPage2);
    //     // }
    //     else {
    //         this.pagination(this.state.currentPage, 1, this.state.maxPage);
    //         this.pagination2(this.state.currentPage2, 1, this.state.maxPage2);
    //     }
    // }, 20000);

    var myVar = setInterval(() => {
      //console.log('BERHASIL AUTO REFRESH');
      this.getListbyPaging1(this.state.currentPage, this.state.todosPerPage);
      this.getListbyPaging2(this.state.currentPage2, this.state.todosPerPage2);
    }, 1800000);
  }

  render() {
    const currentTodos = this.state.result.data;
    const currentTodos2 = this.state.result2.data;
    //notYet
    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <th scope="row">{todo.Order_NmOutlet}</th>
            <td>{todo.OrderID_Ecommerce}</td>
            <td>{todo.Order_TrackingNo}</td>
            <td>{todo.ShippingName}</td>
            <td>{todo.Order_DeadlineKirim}</td>
            <td>{todo.Order_TanggalCancel}</td>
          </tr>
        );
      });
    //already
    const renderTodos2 =
      currentTodos2 &&
      currentTodos2.map((todo, i) => {
        return (
          <tr key={i}>
            <th scope="row">{todo.Order_NmOutlet}</th>
            <td>{todo.OrderID_Ecommerce}</td>
            <td>{todo.Order_TrackingNo}</td>
            <td>{todo.ShippingName}</td>
            <td>{todo.Order_DeadlineKirim}</td>
            <td>{todo.Order_TanggalCancel}</td>
          </tr>
        );
      });

    return (
      <Page
        // title="Pesanan Yang Sudah Ada No. Resi"
        // breadcrumbs={[{ name: 'Order', active: true }]}
        className="ResiPage"
      >
        <Row>
          <Col>
            <Card className="mb-3">
              <CardBody>
                <Row>
                  <Col md={6} sm={6} xs={12}>
                    <Card className="mb-3">
                      <CardHeader
                        style={{ backgroundColor: '#047873', color: 'white' }}
                      >
                        {' '}
                        <Label
                          style={{ textAlign: 'center', fontSize: '20px' }}
                        >
                          <b>Tim Ekspedisi Kejar Pick Up Sebelum Terlambat</b>
                        </Label>
                      </CardHeader>
                      <CardBody>
                        {/* notYet */}
                        <Table responsive striped>
                          <thead>
                            <tr>
                              <th>Outlet</th>
                              <th>No Order Shopee</th>
                              <th>No Resi</th>
                              <th>Kurir</th>
                              <th>Deadline</th>
                              <th>Cancel</th>
                            </tr>
                          </thead>
                          <tbody>
                            {renderTodos}
                            {!currentTodos && (
                              <tr>
                                <td
                                  style={{ backgroundColor: 'white' }}
                                  colSpan="6"
                                  className="text-center"
                                >
                                  TIDAK ADA DATA
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </CardBody>
                      {/* <CardBody>
                                                <Row>
                                                    <Col md="6" sm="12" xs="12">
                                                        <Label style={{ textAlign: 'right' }}> {'Halaman : ' + this.state.realCurrentPage2 + ' / ' + this.state.maxPage2}</Label>
                                                    </Col>
                                                    <Col md="6" sm="12" xs="12">
                                                        <Card className="mb-3s">
                                                            <ButtonGroup >
                                                                <Button
                                                                    name="FirstButton"
                                                                    value={1}
                                                                    onClick={(e) => this.paginationButton2(e, 0, this.state.maxPage2)}>
                                                                    &#10092;&#10092;
                                       </Button>
                                                                <Button
                                                                    name="PrevButton"
                                                                    value={this.state.currentPage2}
                                                                    onClick={(e) => this.paginationButton2(e, -1, this.state.maxPage2)}>
                                                                    &#10092;
                                       </Button>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Page"
                                                                    outline='none'
                                                                    value={this.state.currentPage2}
                                                                    onChange={(e) => this.setState({ currentPage2: e.target.value })}
                                                                    onKeyPress={(e) => this.enterPressedPage2(e)}
                                                                    style={{ height: '38px', width: '75px', textAlign: 'center' }}
                                                                />
                                                                <Button
                                                                    name="NextButton"
                                                                    value={this.state.currentPage2}
                                                                    onClick={(e) => this.paginationButton2(e, 1, this.state.maxPage2)}>
                                                                    &#10093;
                                       </Button>
                                                                <Button
                                                                    name="LastButton"
                                                                    value={this.state.maxPage2}
                                                                    onClick={(e) => this.paginationButton2(e, 0, this.state.maxPage2)}>
                                                                    &#10093;&#10093;
                                       </Button>
                                                            </ButtonGroup>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </CardBody> */}
                    </Card>
                  </Col>
                  <Col md={6} sm={6} xs={12}>
                    <Card className="mb-3">
                      <CardHeader
                        style={{ backgroundColor: '#047873', color: 'white' }}
                      >
                        {' '}
                        <Label
                          style={{ textAlign: 'center', fontSize: '20px' }}
                        >
                          <b>Tim Ekspedisi Kejar Pick Up agar Tidak Cancel</b>
                        </Label>
                      </CardHeader>
                      <CardBody>
                        {/* already */}
                        <Table responsive striped>
                          <thead>
                            <tr>
                              <th>Outlet</th>
                              <th>No Order Shopee</th>
                              <th>No Resi</th>
                              <th>Kurir</th>
                              <th>Deadline</th>
                              <th>Cancel</th>
                            </tr>
                          </thead>
                          <tbody>
                            {renderTodos2}
                            {!currentTodos2 && (
                              <tr>
                                <td
                                  style={{ backgroundColor: 'white' }}
                                  colSpan="6"
                                  className="text-center"
                                >
                                  TIDAK ADA DATA
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </CardBody>
                      {/* <CardBody>
                                                <Row>
                                                    <Col md="6" sm="12" xs="12">
                                                        <Label style={{ textAlign: 'right' }}> {'Halaman : ' + this.state.realCurrentPage + ' / ' + this.state.maxPage}</Label>
                                                    </Col>
                                                    <Col md="6" sm="12" xs="12">
                                                        <Card className="mb-3s">
                                                            <ButtonGroup >
                                                                <Button
                                                                    name="FirstButton"
                                                                    value={1}
                                                                    onClick={(e) => this.paginationButton(e, 0, this.state.maxPage)}>
                                                                    &#10092;&#10092;
                                       </Button>
                                                                <Button
                                                                    name="PrevButton"
                                                                    value={this.state.currentPage}
                                                                    onClick={(e) => this.paginationButton(e, -1, this.state.maxPage)}>
                                                                    &#10092;
                                       </Button>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Page"
                                                                    outline='none'
                                                                    value={this.state.currentPage}
                                                                    onChange={(e) => this.setState({ currentPage: e.target.value })}
                                                                    onKeyPress={(e) => this.enterPressedPage(e)}
                                                                    style={{ height: '38px', width: '75px', textAlign: 'center' }}
                                                                />
                                                                <Button
                                                                    name="NextButton"
                                                                    value={this.state.currentPage}
                                                                    onClick={(e) => this.paginationButton(e, 1, this.state.maxPage)}>
                                                                    &#10093;
                                       </Button>
                                                                <Button
                                                                    name="LastButton"
                                                                    value={this.state.maxPage}
                                                                    onClick={(e) => this.paginationButton(e, 0, this.state.maxPage)}>
                                                                    &#10093;&#10093;
                                       </Button>
                                                            </ButtonGroup>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </CardBody> */}
                    </Card>
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
export default ResiPage;
