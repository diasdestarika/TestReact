import Page from 'components/Page';
import React from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Label,
  Form,
  CardHeader,
  Input,
} from 'reactstrap';
import { MdLoyalty } from 'react-icons/md';
import * as myUrl from '../urlLink';
import LoadingSpinner from '../LoadingSpinner';
import * as firebase from 'firebase/app';
import ScrollButton from 'pages/ScrollButton';

const perf = firebase.performance();

class KelebihanSlongsong extends React.Component {
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
    // const trace = perf.trace('getLebih');
    // trace.start();
    var depoID = this.state.pilihDepo;
    const urlA =
      myUrl.url_kelebihanSlongsong + 'type=lebih' + '&gudangID=' + depoID;
    //console.log('url Kelebihan', urlA);

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
    this.props.setTitle('Perkiraan Kelebihan Slongsong', 'orange');
    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    var myVar = setInterval(() => {
      this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    }, 1800000);
    this.getAllDepo();
  }

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
    //console.log(gudangID);
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
        //console.log(data);
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
            <th scope="row" style={{ fontSize: '25px' }}>
              {todo.Nomor}
            </th>
            <td style={{ fontSize: '20px' }}>{todo.Order_KdProduk}</td>
            <td style={{ fontSize: '20px' }}>{todo.Pro_Name}</td>
            <td style={{ fontSize: '20px' }}>{todo.Pro_CtrlCode}</td>
            <td style={{ fontSize: '20px' }}>{todo.JmlSelongsong}</td>
            <td style={{ fontSize: '20px' }}>{todo.JmlMax_Qty}</td>
            <td style={{ fontSize: '20px' }}>{todo.Tot_Cap}</td>
            <td style={{ fontSize: '20px' }}>{todo.SPB1}</td>
            <td style={{ fontSize: '20px' }}>{todo.MaxPerDAy}</td>
            <td style={{ fontSize: '20px' }}>{todo.MaxPerSP}</td>
            <td style={{ fontSize: '20px' }}>{todo.QtySP_PerHK}</td>
            <td style={{ fontSize: '20px' }}>{todo.KebSelongsong}</td>
            <td style={{ fontSize: '20px' }}>{todo.Krg_Lbh}</td>
            <td style={{ fontSize: '20px' }}>{todo.Line}</td>
            <td style={{ fontSize: '20px' }}>{todo.Frame}</td>
            <td style={{ fontSize: '20px' }}>{todo.Motor}</td>
            <td style={{ fontSize: '20px' }}>{todo.IPAddress}</td>
          </tr>
        );
      });

    //totaldata

    return (
      <Page className="KelebihanSlongsong">
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
                      <th style={{ fontSize: '20px' }}>Procon</th>
                      <th style={{ fontSize: '20px' }}>Jml Slongsong</th>
                      <th style={{ fontSize: '20px' }}>Kapasitas</th>
                      <th style={{ fontSize: '20px' }}>Total Kapasitas</th>
                      <th style={{ fontSize: '20px' }}>Qty SP</th>
                      <th style={{ fontSize: '20px' }}>Qty Max/Day</th>
                      <th style={{ fontSize: '20px' }}>Qty Max/SP</th>
                      <th style={{ fontSize: '20px' }}>Qty SP/HK</th>
                      <th style={{ fontSize: '20px' }}>Keb Slongsong</th>
                      <th style={{ fontSize: '20px' }}>Kelebihan</th>
                      <th style={{ fontSize: '20px' }}>Line</th>
                      <th style={{ fontSize: '20px' }}>Frame</th>
                      <th style={{ fontSize: '20px' }}>Motor</th>
                      <th style={{ fontSize: '20px' }}>IP Address</th>
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
export default KelebihanSlongsong;
