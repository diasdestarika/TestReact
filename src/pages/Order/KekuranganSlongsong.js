import Page from 'components/Page';
import React from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Label,
  CardHeader,
  Input,
  Form,
} from 'reactstrap';
import { MdLoyalty } from 'react-icons/md';
import * as myUrl from '../urlLink';
import * as firebase from 'firebase/app';
import LoadingSpinner from '../LoadingSpinner';
import ScrollButton from 'pages/ScrollButton';

const perf = firebase.performance();

class KekuranganSlongsong extends React.Component {
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
    // const trace = perf.trace('getKurang');
    // trace.start();
    var depoID = this.state.pilihDepo;
    const urlA =
      myUrl.url_kurangSlongsong + 'type=kurang' + '&gudangID=' + depoID;
    //console.log('URL', urlA, 'depoID', depoID);

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
        //console.log('DATA', data);
        //console.log('RESPONSE', data.responseMessage);

        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.responseDescription.toLowerCase().includes('expired')) {
            // alert('Token Kadaluarsa, silahkan masuk kembali');
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
    // alert('Silakan pilih Depo terlebih dahulu!');
    this.props.setTitle('Perkiraan Kekurangan Slongsong', 'red');
    this.getAllDepo();
    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    var myVar = setInterval(() => {
      this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    }, 1800000);
  }

  state = {
    pilihDepo: '',
    namaDepo: '',
  };

  setDepo = event => {
    var nama = this.state.resultDepo.find(function (element) {
      return element.Out_Code === event.target.value;
    });
    this.setState(
      {
        pilihDepo: event.target.value,
        namaDepo: nama.Out_Name,
      },
      () => this.getListbyPaging(),
    );
    //console.log(event.target.value);
    //console.log(nama.Out_Name);
  };

  getAllDepo() {
    var gudangID = window.localStorage.getItem('gID');
    const urlA = myUrl.url_allDepo + 'type=depo' + '&gudangID=' + gudangID;
    //console.log('gudang ID', gudangID);
    //console.log('URL DEPO', urlA);

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
        //console.log('DATA', data);
        this.setState({ resultDepo: data.data });
      });
  }

  render() {
    const currentTodos = this.state.result.data;
    const listDepo = this.state.resultDepo;
    const renderDepo =
      listDepo &&
      listDepo.map((todo, i) => {
        return <option value={todo.Out_Code}>{todo.Out_Name}</option>;
      });
    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i} style={{ width: '200%' }}>
            <th scope="row" style={{ fontSize: '20px' }}>
              {todo.Nomor}
            </th>
            <td style={{ fontSize: '20px' }}>{todo.Order_KdProduk}</td>
            <td style={{ fontSize: '20px' }}>{todo.Pro_Name}</td>
            <td style={{ fontSize: '20px' }}>{todo.JmlSelongsong}</td>
            <td style={{ fontSize: '20px' }}>{todo.JmlMax_Qty}</td>
            <td style={{ fontSize: '20px' }}>{todo.Tot_Cap}</td>
            <td style={{ fontSize: '20px' }}>{todo.SPB1}</td>
            <td style={{ fontSize: '20px' }}>{todo.MaxPerDAy}</td>
            <td style={{ fontSize: '20px' }}>{todo.MaxPerSP}</td>
            <td style={{ fontSize: '20px' }}>{todo.QtySP_PerHK}</td>
            <td style={{ fontSize: '20px' }}>{todo.KebSelongsong}</td>
            <td style={{ fontSize: '20px' }}>{todo.Krg_Lbh}</td>
          </tr>
        );
      });

    //totaldata

    return (
      <Page className="KekuranganSlongsong">
        <Row>
          <Col>
            <Card className="mb-3">
              <CardHeader>
                <Form inline>
                  <Label style={{ fontWeight: 'bold' }}>Depo: </Label>
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
                    onChange={this.setDepo}
                  >
                    <option value={0} disabled selected hidden id="pilih">
                      Silahkan Pilih Depo
                    </option>
                    {renderDepo}
                  </Input>
                </Form>
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                    <tr style={{ width: '200%' }}>
                      <th style={{ fontSize: '20px' }}>No.</th>
                      <th style={{ fontSize: '20px' }}>Kd Produk</th>
                      <th style={{ fontSize: '20px' }}>Nm Produk</th>
                      <th style={{ fontSize: '20px' }}>Jml Slongsong</th>
                      <th style={{ fontSize: '20px' }}>Kapasitas</th>
                      <th style={{ fontSize: '20px' }}>Total Kapasitas</th>
                      <th style={{ fontSize: '20px' }}>Qty SP</th>
                      <th style={{ fontSize: '20px' }}>Qty Max/Day</th>
                      <th style={{ fontSize: '20px' }}>Qty Max/SP</th>
                      <th style={{ fontSize: '20px' }}>Qty SP/HK</th>
                      <th style={{ fontSize: '20px' }}>Keb Slongsong</th>
                      <th style={{ fontSize: '20px' }}>Kekurangan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTodos}
                    {!renderDepo ? (
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
export default KekuranganSlongsong;
