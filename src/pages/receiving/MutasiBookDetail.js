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
  FormGroup,
} from 'reactstrap';
import * as myUrl from '../urlStock';
import { MdLoyalty } from 'react-icons/md';
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
      outcode: '112',
      dataAvailable: false,
      endDate: new Date().toJSON().slice(0, 10),
      startDate: '',
      procod: props.match.params.id,
      ProName: props.match.params.proname,
      batch: props.match.params.batch,
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
    batch = this.props.match.params.batch,
  ) {
    var url =
      myUrl.url_mutasiStockProcod +
      '?type=getMutasiBook' +
      '&gudangID=' +
      gudangID +
      // '&page=' +
      // currPage +
      // '&length=' +
      // currLimit +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate +
      '&procod=' +
      procod +
      '&batch=' +
      batch;
    this.isLoading = true;
    // console.log('LINK URL: ', url);

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
              loading: false,
              moreStatus: data.metadata.More,
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
    // console.log('MASUK', this.state.result);
    if (this.state.result !== null || this.state.result !== undefined) {
      // console.log('MASUK IF');
      this.setState({
        dataAvailable: true,
      });
    } else {
      // console.log('MASUK ELSE');
      this.setState({
        dataAvailable: false,
      });
    }
  }

  componentDidMount() {
    var gName = window.localStorage.getItem('gName');
    // var token = window.localStorage.getItem('tokenCookies');
    this.props.setTitle('RIWAYAT BOOK DETAIL ' + gName, 'red');
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
      if (validateWeek2 === true) {
        this.showNotification(
          'Maksimal hanya boleh 1 minggu dari hari ini!',
          'error',
        );
        // this.getListbyPaging();
        this.setState({ result: [] });
      }
      if (validateWeek2 === false && d1 < d2) {
        this.updateInputValue();
        this.triggerRender();
      }
    }
  }

  triggerRender() {
    var startDate = this.state.startDate;
    var endDate = this.state.endDate;
    var mutasiBottomDisplay = document.getElementById('mutasiBottom');
    if (startDate !== '' && endDate !== '') {
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
    const { result } = this.state;

    var currentTodos = result;

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
            {todo.mutasi_jenis === 'Book' && (
              <td style={{ textAlign: 'Right', color: 'green' }}>
                {formatter.format(todo.mutasi_qty)}
              </td>
            )}
            {todo.mutasi_jenis !== 'Book' && (
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
                    <Label style={{ fontWeight: 'bold' }}>
                      {' ' +
                        this.state.ProName +
                        ' ' +
                        '(' +
                        this.state.procod +
                        ')' +
                        ' ' +
                        '-' +
                        ' ' +
                        this.state.batch}
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
                    </Row>
                  </FormGroup>
                </CardBody>
              </CardHeader>
              <div id="mutasiBottom" style={{ display: 'none' }}>
                {/* <CardBody
                  // className="d-flex justify-content-between"
                  style={{ paddingBottom: 0 }}
                > */}
                {/* <Form inline className="cr-search-form">
                    <MdSearch
                      size="20"
                      className="cr-search-form__icon-search text-secondary"
                    />
                    <Input
                      autoComplete="off"
                      type="search"
                      minLength="0"
                      id="search"
                      value={this.state.searchInputtedName}
                      onChange={this.handleSearch}
                      onKeyPress={event => this.enterPressed(event, true)}
                      className="cr-search-form__input"
                      placeholder="Cari..."
                    />
                  </Form> */}
                {/* {
                    <Label
                      style={{
                        fontSize: '100%',
                        width: '50%',
                        textAlign: 'right',
                        marginTop: '0.7%',
                        textTransform: 'none',
                        float: 'right',
                      }}
                    >
                      {' '}
                      {'Halaman: ' +
                        this.state.currentPage +
                        '/' +
                        this.state.maxPage}
                    </Label>
                  }
                </CardBody> */}
                <CardBody
                  style={{
                    outlineColor: 'red',
                    color: 'black',
                    backgroundColor: '#ffffff',
                  }}
                >
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
