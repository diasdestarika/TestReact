import React from 'react';
import Page from 'components/Page';
import {
  Row,
  Col,
  Table,
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Label,
  Form,
  FormGroup,
} from 'reactstrap';
import * as myUrl from '../urlStock';
import { MdLoyalty, MdSearch } from 'react-icons/md';
import LoadingSpinner from '../LoadingSpinner';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

class HeaderStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      isLoading: false,
      inputtedName: '',
      search: '',
      currentPage: 1,
      todosPerPage: 10,
      realCurrentPage: 1,
      maxPage: 1,
      totalPages: 1,
      flag: 0,
      results: [],
      resultMetadata: [],
      outcode: '112',
      dataAvailable: false,
      endDate: new Date().toJSON().slice(0, 10),
      startDate: '',
      procod: props.match.params.id,
      ProName: props.match.params.proname,
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

  getListbyPaging(
    currPage = this.state.currentPage,
    currLimit = this.state.todosPerPage,
    kword,
    startDate = this.state.startDate,
    endDate = this.state.endDate,
    gudangID = window.localStorage.getItem('gID'),
    search = this.state.search,
    procod = this.props.match.params.id,
  ) {
    var url =
      myUrl.url_mutasiStockProcod +
      '?type=getMutasi' +
      '&gudangID=' +
      gudangID +
      '&page=' +
      currPage +
      '&length=' +
      currLimit +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate +
      '&procod=' +
      procod;

    this.isLoading = true;
    // console.log('GET LIST TERPANGGIL');
    // console.log('LINK URL: ', url);
    // console.log('TERPANGGIL KARNA TERKLIK');

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };

    fetch(url, option)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        // console.log('DATA MUTASI', data);
        // console.log('DATA MUTASI 2', url);

        if (data.error.status === true) {
          this.showNotification(data.error.msg, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            this.props.history.push({
              pathname: '/login',
            });
          }
        } else {
          this.setState(
            {
              result: data.data,
              maxPage: data.metadata.TotalPages ? data.metadata.TotalPages : 1,
              moreStatus: data.metadata.More,
              loading: false,
              resultMetadata: data.metadata.Data,
            },
            () => this.setDataStatus(),
          );
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({
          loading: false,
        });
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
    var gName = window.localStorage.getItem('gName');
    this.props.setTitle('MUTASI STOCK ' + gName, 'red');
  }

  paginationButton(event, flag, maxPage = 0) {
    var currPage = Number(event.target.value);
    if (currPage + flag > 0 && currPage + flag <= maxPage) {
      this.setState(
        {
          currentPage: currPage + flag,
          realCurrentPage: currPage + flag,
        },
        () => {
          this.getListbyPaging(
            this.state.currentPage,
            this.state.todosPerPage,
            this.state.keyword,
          );
        },
      );
    }
  }

  handleSelect(event) {
    this.setState(
      {
        currentPage: 1,
        todosPerPage: event.target.value,
      },
      () => this.getListbyPaging(),
    );
  }

  handleWrite(event, flag) {
    var currPage = Number(event.target.value);
    if (
      currPage + flag > 0 &&
      // currPage + flag &&
      this.state.moreStatus !== 'FALSE'
    ) {
      this.setState(
        {
          currentPage: currPage + flag,
          realCurrentPage: currPage + flag,
        },
        () => {
          this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
        },
        // console.log(
        //   'CURRENT PAGE',
        //   this.state.currentPage,
        //   'TODOSPERPAGE',
        //   this.state.todosPerPage,
        // ),
      );
    }
  }

  handleWriteBack(event, flag) {
    var currPage = Number(event.target.value);
    // console.log(
    //   'TERPANGGIL 2',
    //   currPage + flag > 0 && currPage + flag <= this.state.maxPage,
    // );
    if (currPage + flag > 0 && currPage + flag) {
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

  handleFirst(event) {
    this.setState(
      {
        currentPage: 1,
      },
      () => this.getListbyPaging(),
    );
  }

  handleLast(event) {
    this.setState(
      {
        currentPage: this.state.maxPage,
      },
      () => this.getListbyPaging(),
    );
  }

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
            () => this.getListbyPaging(),
          );
        } else {
          this.setState(
            prevState => ({
              currentPage: prevState.currentPage,
            }),
            () => this.getListbyPaging(),
          );
        }
      }
    }
  };

  enterPressed = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.setState(
        {
          currentPage: 1,
          realCurrentPage: 1,
        },
        () => this.getListbyPaging(this.state.currentPage),
      );
    }
  };

  handleSearch = event => {
    this.setState({
      search: event.target.value,
    });
  };

  updateInputValue = field => evt => {
    // console.log('EVT', evt.target.value);
    this.setState(
      {
        [`${field}`]: evt.target.value,
      },
      () => this.validateTgl(field),
    );
    evt.preventDefault();
  };

  validateTgl(field) {
    var d1 = Date.parse(this.state.startDate);
    var d2 = Date.parse(this.state.endDate);
    var currentDate = new Date(this.state.startDate).getDate();
    var endDate = new Date(this.state.endDate).getDate();
    var validateWeek2 = currentDate - endDate < -6;
    // console.log('SEMINGGU', validateWeek2, 'DUA MINGGU', currentDate < endDate);

    if (isNaN(d2)) {
      return;
    } else {
      if (d1 > d2) {
        this.showNotification(
          'Tanggal Akhir tidak boleh kurang dari tanggal awal!',
          'error',
        );
        // this.getListbyPaging();
        this.setState({ result: [] });
      }
      // if (validateWeek2 === true) {
      //   this.showNotification(
      //     'Maksimal hanya boleh 1 minggu dari hari ini!',
      //     'error',
      //   );
      //   // this.getListbyPaging();
      //   this.setState({ result: [] });
      // }
      if (validateWeek2 === false && d1 < d2) {
        this.updateInputValue();
      }
    }
  }

  getData() {
    this.triggerRender();
  }

  triggerRender() {
    var startDate = this.state.startDate;
    var endDate = this.state.endDate;
    var mutasiBottomDisplay = document.getElementById('mutasiBottom');
    if (startDate !== '' && endDate !== '') {
      // console.log("TERPANGGIL3");
      this.getListbyPaging();
      mutasiBottomDisplay.style.display = 'block';
    } else {
      this.showNotification(
        'Isi Tanggal Awal dan Akhir untuk memunculkan Data!',
      );
      return;
    }
  }

  render() {
    const { result, resultMetadata } = this.state;

    var currentTodos = result;
    var currentTodosMetadata = resultMetadata;

    var formatter = new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
    });

    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td style={{ textAlign: 'Left' }}>{todo.mutasi_batch}</td>
            <td style={{ textAlign: 'Left' }}>
              {new Date(todo.mutasi_ed).toDateString()}
            </td>
            {todo.mutasi_jenis === 'Plus' && (
              <td style={{ textAlign: 'Right', color: 'green' }}>
                {formatter.format(todo.mutasi_qty)}
              </td>
            )}
            {todo.mutasi_jenis !== 'Plus' && (
              <td style={{ textAlign: 'Right', color: 'red' }}>
                ({formatter.format(todo.mutasi_qty)})
              </td>
            )}
            <td style={{ textAlign: 'Left' }}>{todo.mutasi_noref}</td>
            <td style={{ textAlign: 'Left' }}>{todo.mutasi_type}</td>
            <td style={{ textAlign: 'Left' }}>
              {new Date(todo.mutasi_lastupdate).toDateString()}
            </td>
            <td style={{ textAlign: 'Left' }}>
              {new Date(todo.mutasi_lastupdate).toLocaleTimeString('id-ID')}
            </td>
          </tr>
        );
      });

    return (
      <Page className="HeaderStock">
        <Row>
          <Col>
            <NotificationSystem
              dismissible={false}
              ref={notificationSystem =>
                (this.notificationSystem = notificationSystem)
              }
              style={NOTIFICATION_SYSTEM_STYLE}
            />
            <Card
              className="mb-3"
              style={{
                flex: 5,
                outlineColor: 'white',
                color: 'black',
                backgroundColor: '#ffffff',
              }}
            >
              <CardHeader>
                <Row>
                  <Col
                    style={{
                      marginBottom: 0,
                      paddingBottom: 0,
                      margin: 'auto',
                    }}
                  >
                    <Label
                      style={{
                        color: 'black',
                        fontWeight: 'bold',
                        margin: 'auto',
                      }}
                    >
                      {`${this.state.ProName} (${this.state.procod})`}
                    </Label>
                  </Col>
                  <Col style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <Button
                      style={{ float: 'right' }}
                      onClick={() => window.history.back()}
                    >
                      Kembali
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardHeader style={{ paddingBottom: 0, paddingTop: 0 }}>
                <CardBody style={{ paddingBottom: 0 }}>
                  <FormGroup>
                    <Row>
                      <Label
                        style={{
                          fontWeight: 'bold',
                          marginTop: 8,
                        }}
                      >
                        Periode: &nbsp;
                      </Label>
                      <Input
                        type="date"
                        style={{ width: '20%' }}
                        value={this.state.startDate}
                        onChange={this.updateInputValue('startDate')}
                      ></Input>
                      <Label style={{ marginTop: 8 }}>&nbsp;-&nbsp;</Label>
                      <Input
                        type="date"
                        style={{ width: '20%' }}
                        value={this.state.endDate}
                        onChange={this.updateInputValue('endDate')}
                      ></Input>
                      <Button onClick={() => this.getData()}>
                        <MdSearch></MdSearch>
                      </Button>
                    </Row>
                  </FormGroup>
                </CardBody>
              </CardHeader>
              <div id="mutasiBottom" style={{ display: 'none' }}>
                <CardBody
                  style={{
                    outlineColor: 'red',
                    color: 'black',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <FormGroup>
                    <Form>
                      <Row>
                        <Col>
                          <Label
                            style={{ marginBottom: 0, fontWeight: 'bold' }}
                          >
                            Total StockTake:
                          </Label>
                          <Input
                            disabled
                            value={
                              currentTodosMetadata &&
                              currentTodosMetadata.StockTake
                            }
                          ></Input>
                          <Label
                            style={{ marginBottom: 0, fontWeight: 'bold' }}
                          >
                            Total Receiving:
                          </Label>
                          <Input
                            disabled
                            value={
                              currentTodosMetadata &&
                              currentTodosMetadata.Receiving
                            }
                          ></Input>
                        </Col>
                        <Col>
                          <Label
                            style={{ marginBottom: 0, fontWeight: 'bold' }}
                          >
                            Total TnIN:
                          </Label>
                          <Input
                            disabled
                            value={
                              currentTodosMetadata && currentTodosMetadata.TnIN
                            }
                          ></Input>
                          <Label
                            style={{ marginBottom: 0, fontWeight: 'bold' }}
                          >
                            Total DO:
                          </Label>
                          <Input
                            disabled
                            value={
                              currentTodosMetadata && currentTodosMetadata.DO
                            }
                          ></Input>
                          {/* <Label style={{ marginBottom: 0 }}>
                            Total Lainnya:
                          </Label>
                          <Input
                            disabled
                            value={
                              currentTodosMetadata &&
                              currentTodosMetadata.Others
                            }
                          ></Input> */}
                        </Col>
                      </Row>
                    </Form>

                    {/* <Form>
                      <Row>
                        <Col>
                          <Label>Total DO</Label>
                          <br></br>
                          <Label>Total Receiving</Label>
                          <br></br>
                          <Label>Total StockTake</Label>
                        </Col>
                        <Col>
                          <br></br>
                          <Label>
                            :{' '}
                            {currentTodosMetadata &&
                              currentTodosMetadata.Receiving}
                          </Label>
                          <br></br>
                          <Label>
                            :{' '}
                            {currentTodosMetadata &&
                              currentTodosMetadata.StockTake}
                          </Label>
                          <Label>
                            :{' '}
                            {currentTodosMetadata && currentTodosMetadata.TnIN}
                          </Label>
                        </Col>
                        <Col>
                          <Label>Total TnIN</Label>
                          <br></br>
                          <Label>Total Lainnya</Label>
                        </Col>
                        <Col>
                          <Label>
                            :&nbsp;
                            {currentTodosMetadata && currentTodosMetadata.DO}
                          </Label>
                          <br></br>
                          <Label>
                            :{' '}
                            {currentTodosMetadata &&
                              currentTodosMetadata.Others}
                          </Label>
                        </Col>
                      </Row>
                    </Form> */}
                  </FormGroup>
                  <Table responsive striped id="proStock">
                    <thead>
                      <tr style={{ width: '200%' }}>
                        <th style={{ textAlign: 'Left' }}>Batch</th>
                        <th style={{ textAlign: 'Left' }}>ED</th>
                        <th style={{ textAlign: 'Right' }}>Qty</th>
                        <th style={{ textAlign: 'Left' }}>No. Referensi</th>
                        <th style={{ textAlign: 'Left' }}>Type</th>
                        <th style={{ textAlign: 'Left' }}>Tgl Mutasi</th>
                        <th style={{ textAlign: 'Left' }}>Jam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!currentTodos ? (
                        (
                          <tr>
                            <td
                              style={{ backgroundColor: 'white' }}
                              colSpan="17"
                              className="text-center"
                            >
                              TIDAK ADA DATA
                            </td>
                          </tr>
                        ) || <LoadingSpinner status={4}></LoadingSpinner>
                      ) : this.state.dataAvailable ? (
                        renderTodos
                      ) : (
                        <LoadingSpinner status={4} />
                      )}
                    </tbody>
                  </Table>
                </CardBody>
                {/* <CardBody>
                  <Row>
                    <Col md="9" sm="12" xs="12">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          Tampilkan
                        </InputGroupAddon>
                        <select
                          style={{ height: '38px' }}
                          value={this.state.value}
                          onChange={e => this.handleSelect(e)}
                        >
                          <option value="10">10</option>
                          <option value="20">20</option>
                        </select>
                        <InputGroupAddon addonType="prepend">
                          Baris Per-Halaman
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                    <Col md="3" sm="12" xs="12">
                      <Card className="mb-3s">
                        <ButtonGroup>
                          <Button
                            name="FirstButton"
                            value={this.state.currentPage}
                            onClick={e => this.handleFirst(e, -1)}
                            // style={{ width: '20%' }}
                          >
                            &#10092;&#10092;
                          </Button>

                          <Button
                            name="PrevButton"
                            value={this.state.currentPage}
                            onClick={e => this.handleWriteBack(e, -1)}
                            // style={{ width: '30%' }}
                          >
                            &#10092;
                          </Button>

                          <input
                            type="text"
                            placeholder="Page"
                            outline="none"
                            value={this.state.currentPage}
                            onChange={e =>
                              this.setState({ currentPage: e.target.value })
                            }
                            onKeyPress={e => this.enterPressedPage(e)}
                            style={{
                              height: '38px',
                              width: '75px',
                              textAlign: 'center',
                            }}
                          />

                          <Button
                            name="NextButton"
                            value={this.state.currentPage}
                            onClick={e => this.handleWrite(e, 1)}
                            // style={{ width: '30%' }}
                          >
                            &#10093;
                          </Button>
                        </ButtonGroup>
                      </Card>
                    </Col>
                  </Row>
                </CardBody> */}
              </div>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}

export default HeaderStock;
