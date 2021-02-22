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
import { MdLoyalty, MdCheck } from 'react-icons/md';
import * as myUrl from '../urlLink';
import * as firebase from 'firebase/app';
import LoadingSpinner from '../LoadingSpinner';
import ScrollButton from 'pages/ScrollButton';

const perf = firebase.performance();

class OrderPage extends React.Component {
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
      pilihEcommerce: 'all',
      namaEcommerce: '',
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
    // const trace = perf.trace('getMalamIni');
    // trace.start();
    var eID = this.state.pilihEcommerce;
    var gudangID = window.localStorage.getItem('gID');
    const urlA =
      myUrl.url_order +
      'type=noAPIToday' +
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
      'Pesanan NON API Yang Harus Selesai dan Cetak Resi Malam ini (L6)',
      'red',
    );
    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    this.getAllEcommerce();
    var myVar = setInterval(() => {
      this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
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
      () => this.getListbyPaging(),
    );
    //console.log(event.target.value);
    //console.log(nama.Out_Name);
  };

  getAllEcommerce() {
    var gudangID = window.localStorage.getItem('gID');
    const urlA =
      myUrl.url_pilihEcommerce + 'type=noAPI' + '&gudangID=' + gudangID;
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
          <tr key={i} style={{ width: '200%' }}>
            <th scope="row" style={{ fontSize: '25px', textAlign: 'right' }}>
              {todo.Nomor}
            </th>
            <td style={{ fontSize: '25px' }}>{todo.Order_NmOutlet}</td>
            <td style={{ fontSize: '25px' }}>{todo.OrderID_Ecommerce}</td>
            <td style={{ fontSize: '25px' }}>{todo.Order_DeadlineKirim}</td>
            <td style={{ fontSize: '25px' }}>{todo.Order_NOSP}</td>
            <td style={{ fontSize: '25px' }}>{todo.Order_NODO}</td>
            <td style={{ fontSize: '25px' }}>{todo.Order_TanggalDO}</td>
            <td style={{ fontSize: '25px', textAlign: 'right' }}>
              {todo.Order_SelisihWaktuDeadlineKirim}
            </td>
            <td style={{ fontSize: '25px', textAlign: 'center' }}>
              {todo.Order_TipeSP}
            </td>
            <td style={{ fontSize: '25px' }}>{todo.Order_TrackingNo}</td>
            <td style={{ fontSize: '25px' }}>{todo.JenisToko}</td>
            {todo.Order_StatusDO === 'P' && (
              <td style={{ textAlign: 'center' }}>
                <MdCheck size={30}></MdCheck>
              </td>
            )}
          </tr>
        );
      });

    //totaldata

    return (
      <Page
        // title="Pesanan Yang Harus Selesai Malam Ini"
        // breadcrumbs={[{ name: 'Order', active: true }]}
        className="OrderPageMalamnAPI"
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
                <Table responsive striped>
                  <thead>
                    <tr style={{ width: '200%' }}>
                      <th style={{ fontSize: '25px' }}>No.</th>
                      <th style={{ fontSize: '25px' }}>Outlet</th>
                      <th style={{ fontSize: '25px' }}>OrderID</th>
                      <th style={{ fontSize: '25px' }}>Deadline</th>
                      <th style={{ fontSize: '25px' }}>No SP</th>
                      <th style={{ fontSize: '25px' }}>No DO</th>
                      <th style={{ fontSize: '25px' }}>Tgl. DO</th>
                      <th style={{ fontSize: '25px' }}>S.Wkt</th>
                      <th style={{ fontSize: '25px' }}>Tipe</th>
                      <th style={{ fontSize: '25px' }}>Resi</th>
                      <th style={{ fontSize: '25px' }}>Ecommerce</th>
                      <th style={{ fontSize: '25px' }}>Cetak DO</th>
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
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ScrollButton></ScrollButton>
      </Page>
    );
  }
}
export default OrderPage;
