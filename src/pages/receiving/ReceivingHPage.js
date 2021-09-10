/* eslint-disable eqeqeq */
/* eslint-disable default-case */
import Page from 'components/Page';
import * as firebase from 'firebase/app';
import ReactToPrint from 'react-to-print';
import React from 'react';
import { MdLoyalty, MdPrint, MdSearch } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Label,
  Row,
  Table,
} from 'reactstrap';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import LoadingSpinner from '../LoadingSpinner';
import * as myUrl from '../urlLinkReceiving';

const perf = firebase.performance();

class ReceivingHPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      inputtedName: '',
      currentPage: 1,
      realCurrentPage: 1,
      todosPerPage: 5,
      maxPage: 1,
      flag: 0,
      keyword: '',
      loading: false,
      checked: false,
      enterButton: false,
      searchGroup: 1,
      gudangID: window.localStorage.getItem('gID'),
      dataAvailable: false,
    };
  }

  redirect = () =>
    this.props.history.push({
      pathname: '/login',
    });

  changePageState = (pageState, data = {}) => () => {
    if (pageState === 'HEADER') {
      if (this.props.group === 2) {
        this.props.history.push({
          pathname: '/receivingFloor',
        });
      } else if (this.props.group === 1) {
        this.props.history.push({
          pathname: '/receivingApotek',
        });
      }
    } else if (pageState === 'DETAIL') {
      if (data.rcvh_flag === 'P') {
        this.props.history.push({
          pathname: '/receivingDetail',
          state: {
            group: this.props.group,
            data: data,
            ok: true,
          },
        });
      } else {
        this.props.history.push({
          pathname: '/receivingNew',
          state: {
            group: this.props.group,
            data: data,
            ok: true,
          },
        });
      }
    } else if (pageState === 'NEW') {
      this.props.history.push({
        pathname: '/receivingNew',
        state: {
          group: this.props.group,
          ok: true,
        },
      });
    } else if (pageState === 'PRINT') {
      if (data.rcvh_flag === 'P') {
        this.props.history.push({
          pathname: '/receivingPrint',
          state: {
            group: this.props.group,
            data: data,
            ok: true,
          },
        });
      } else {
        this.showNotification(
          'Tidak bisa di Print karena belum terkonfirmasi',
          'error',
        );
      }
    }
    console.log('DATA RCVH', data.rcvh_flag);
  };

  //set Current Limit
  handleSelect(event) {
    this.setState(
      {
        [event.target.name]: event.target.value,
        currentPage: 1,
        realCurrentPage: 1,
      },
      () => {
        this.getListbyPaging(1, this.state.todosPerPage, this.state.keyword);
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
          this.getListbyPaging(
            this.state.currentPage,
            this.state.todosPerPage,
            this.state.keyword,
          );
        },
      );
    }
  }

  pagination = (value, arrow, maxPage = 0) => {
    var currPage = Number(value);
    if (currPage + arrow > 0 ) { //&& currPage + arrow <= maxPage) {
      this.setState(
        {
          currentPage: currPage + arrow,
          realCurrentPage: currPage + arrow,
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
                this.state.keyword,
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
                this.state.keyword,
              ),
          );
        }
      }
    }
  };

  enterPressedSearch = event => {
    var code = event.keyCode || event.which;

    // if (this.state.searchGroup === 2) {
    //   this.setState({ searchGroup: 2 });
    // }
    if (code === 13) {
      // event.preventDefault();
      this.setState({ currentPage: 1, realCurrentPage: 1 }, () => {
        this.getListbyPaging(
          this.state.currentPage,
          this.state.todosPerPage,
          this.state.keyword,
          this.state.searchGroup,
        );
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

  getListbyPaging(currPage, currLimit, keyword, searchGroup) {
    var Token = window.localStorage.getItem('tokenCookies');
    // console.log('TOKENNYA: ', Token);
    const { group } = this.props;
    const trace = perf.trace('get');
    trace.start();

    //tipe 1 no.Receive
    //tipe 2 no.PO
    // console.log('SEARCH GROUP: ', searchGroup);
    if (searchGroup === undefined) {
      // console.log('SEARCH GROUP IF ', searchGroup);
      var urlA =
        myUrl.url_getDaftarReceiving +
        this.state.gudangID +
        '?' +
        'page=' +
        currPage +
        '&length=' +
        currLimit +
        '&group=' +
        group;
    } else if (searchGroup !== undefined) {
      // console.log('SEARCH GROUP ELSEIF ', searchGroup, typeof searchGroup);
      if (searchGroup === 1 || searchGroup === '1') {
        // console.log('MASUK RECEIVE');
        urlA =
          myUrl.url_getDaftarReceiving +
          this.state.gudangID +
          '?' +
          'page=' +
          currPage +
          '&length=' +
          currLimit +
          '&search=' +
          keyword +
          '&type=' +
          '1' +
          '&group=' +
          group;
      }
      if (searchGroup === 2 || searchGroup === '2') {
        // console.log('MASUK PO');
        urlA =
          myUrl.url_getDaftarReceiving +
          this.state.gudangID +
          '?' +
          'page=' +
          currPage +
          '&length=' +
          currLimit +
          '&search=' +
          keyword +
          '&type=' +
          '2' +
          '&group=' +
          group;
      }
      console.log('URL HEADER 2', urlA);
    }

    const option = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: Token,
      },
    };
    // console.log('OPTIONNYA: ', option);
    fetch(urlA, option)
      .then(response => {
        // console.log('RESPONSE HEADER', response);
        trace.stop();
        if (response.ok) {
          // console.log('MASUK SINI 1 IF');
          return response.json();
        } else {
          // console.log('MASUK SINI 2 ELSE');
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        var allData = data;
        // var data1 = allData.data;
        // var header = data1.header;
        // var detail = data1.detail;
        var metadata = allData.metadata;
        var error = allData.error;

        // console.log('DATA HEADER', allData);

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
          if (data.metadata.Status === 'TRUE') {
            // this.showNotification(data.metadata.Message, 'info');
            this.setState(
              {
                result: data,
                maxPage:
                  metadata.maxPage === '0'
                    ? (metadata.maxPage = '1')
                    : metadata.maxPage,
                loading: false,
              },
              () => this.setDataStatus(),
            );
          } else {
            this.showNotification(data.metadata.Message, 'error');
            if (data.metadata.Message.toLowerCase().includes('expired')) {
              window.localStorage.removeItem('tokenCookies');
              window.localStorage.removeItem('accessList');
              this.props.history.push({
                pathname: '/login',
              });
            }
          }
        }
      })
      .catch(err => {
        // if (err.message.includes('Status')) {
        if (err.toString()) {
          this.showNotification('Data Tidak Ditemukan', 'error');
        } else {
          this.showNotification(err.message, 'error');
        }
        console.log('ERRORNYA ADALAH: ', err.message);
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
    const { group } = this.props;
    var gudangName = window.localStorage.getItem('gName');
    var labelGroup = group == 2 ? 'FLOOR' : 'APOTEK';
    this.props.setTitle('RECEIVING ' + labelGroup + ' ' + gudangName, 'red');

    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
  }

  setData = (data = null) => {
    if (data === null || data === -1 || data === '') {
      return '-';
    } else {
      if (typeof data === 'number' && !Number.isInteger(data)) {
        return data.toFixed(2);
      } else {
        return data;
      }
    }
  };

  //modal Tambah
  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    backdrop: true,
  };

  //modal Edit
  state = {
    modal_edit: false,
    modal_backdrop: false,
    modal_nested_parent_edit: false,
    modal_nested_edit: false,
    editDimen: {},
  };

  //modal update YN
  state = {
    modal_active: false,
    modal_deactive: false,
    active_deptcode_deactive: {},
    active_deptcode_active: {},
    modal_active_toggle: '',
    modal_deactive_toggle: '',
  };

  toggleDeactiveData = todo => {
    this.setState({
      modal_deactive_toggle: 'deactive_toggle',
      modal_deactive: true,
      active_deptcode_deactive: todo,
    });
  };

  toggleActiveData = todo => {
    this.setState({
      modal_active_toggle: 'active_toggle',
      modal_active: true,
      active_deptcode_active: todo,
    });
  };

  toggleEditData = (modalType, todo) => {
    if (!modalType) {
      const modal_edit = Object.assign({}, this.state.modal_edit);
      return this.setState({
        modal_edit: !modal_edit,
      });
    }

    if (modalType === 'nested_parent_edit') {
      this.setState(
        {
          [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
          editDimen: todo,
          checked: todo.aktifyn === 'Y' ? true : false,
        },
        () => {},
      );
    } else {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        editDimen: todo,
      });
    }
  };

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  fetchData = () => {
    this.setState({ loading: true });
  };

  testFunc = modalType => {
    if (this.state.modal_nested_parent && this.state.modal_nested) {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        modal_nested: false,
      });
    } else {
      if (!modalType) {
        return this.setState({
          modal: !this.state.modal,
        });
      }

      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      });
    }
  };

  gotoDetail = e => {
    e.target.style = {
      ...e.target.style,
      'text-decoration': 'none',
      'text-shadow': '1px 1px 1px #555',
    };
  };

  setDate(efDate) {
    var tglEfektifYear = efDate.substring(0, 4);
    var tglEfektifMonth = efDate.substring(5, 7);
    var tglEfektifDate = efDate.substring(8, 10);
    var tglEfektif =
      tglEfektifYear + '-' + tglEfektifMonth + '-' + tglEfektifDate;
    return tglEfektif;
  }

  setGroup = event => {
    this.setState({
      searchGroup: event.target.value,
    });
  };

  //Generate Receive Number as PDF and Download it
  generateReceivePDF = currentNoReceive => {
    var urlA = myUrl.base_url_all + 'tnin?printNoRecv=' + currentNoReceive;
    const option = {
      method: 'GET',
      headers: {
        responseType: 'arraybuffer',
        'Content-Type': 'application/json;charset=UTF-8',
      },
    };
    // console.log('OPTIONNYA: ', option);
    fetch(urlA, option)
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
        const urlBlob = window.URL.createObjectURL(new Blob([data.data]));
        const link = document.createElement('a');
        link.href = urlBlob;
        link.setAttribute('download', currentNoReceive + '.pdf');
        document.body.appendChild(link);
        link.click();
      })
      .catch(err => {
        this.showNotification(
          'Download PDF Gagal. Silahkan Coba Kembali',
          'error',
        );
      });
  };

  render() {
    const { result } = this.state;
    var currentTodos = result.data;

    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.rcvh_suppliername === '' && todo.rcvh_flag === 'C' && (
              <td>
                <Label
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                >
                  {todo.rcvh_norecv}
                </Label>
              </td>
            )}

            {todo.rcvh_suppliername === '' && todo.rcvh_flag !== 'C' && (
              <td>
                <Label
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                >
                  {todo.rcvh_norecv}
                </Label>
              </td>
            )}

            {todo.rcvh_suppliername !== '' && todo.rcvh_flag === 'C' && (
              <td>
                <Label
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                >
                  {todo.rcvh_norecv}
                </Label>
              </td>
            )}

            {todo.rcvh_suppliername !== '' && todo.rcvh_flag !== 'C' && (
              <td>
                <Label
                  style={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    color: '#047873',
                    textDecoration: 'underline',
                  }}
                  onClick={this.changePageState('DETAIL', { ...todo })}
                >
                  {todo.rcvh_norecv}
                </Label>
              </td>
            )}
            <td>{todo.rcvh_suppliername}</td>
            <td style={{ width: '100px' }}>{this.setData(todo.rcvh_nopo)}</td>
            <td style={{ width: '150px' }}>
              {this.setData(todo.rcvh_nofaktur)}
            </td>
            <td style={{ width: '150px' }}>
              {/* {this.setData(this.setDate(todo.rcvh_tgldo))} */}
              {new Date(todo.rcvh_tglrecv).toDateString()}
            </td>
            {todo.rcvh_flag === 'N' && (
              <td style={{ width: '100px' }}>
                <Badge color="danger">Belum Terkonfirmasi</Badge>
              </td>
            )}
            {todo.rcvh_flag === 'P' && (
              <td style={{ width: '100px' }}>
                <Badge color="success">Sudah Terkonfirmasi</Badge>
              </td>
            )}
            {todo.rcvh_flag === 'C' && (
              <td style={{ width: '100px' }}>
                <Badge color="warning">Receive dibatalkan</Badge>
              </td>
            )}
            {todo.rcvh_flag === '' && (
              <td style={{ width: '100px' }}>
                <Badge color="dark">Data tidak Valid</Badge>
              </td>
            )}
            {todo.rcvh_suppliername === '' && (
              <td>
                <Button disabled={true} style={{ marginLeft: '16px' }}>
                  <MdPrint />
                </Button>
              </td>
            )}
            {todo.rcvh_suppliername !== '' && (
              <td>
                <Button onClick={this.changePageState('PRINT', { ...todo })}>
                  <MdPrint />
                </Button>
              </td>
            )}
          </tr>
        );
      });

    return (
      <Page className="ReceivingHPage">
        <Row>
          <Col>
            <Card className="mb-3">
              <NotificationSystem
                dismissible={false}
                ref={notificationSystem =>
                  (this.notificationSystem = notificationSystem)
                }
                style={NOTIFICATION_SYSTEM_STYLE}
              />
              <CardHeader className="d-flex justify-content-between">
                <Form inline>
                  <Input
                    type="select"
                    autoComplete="off"
                    name="select"
                    color="primary"
                    style={{
                      backgroundColor: '#1DB8B2',
                      marginRight: '1px',
                      color: 'white',
                    }}
                    onChange={this.setGroup}
                  >
                    <option value={1}>{'No. Receive'}</option>
                    <option value={2}>{'No. PO'}</option>
                  </Input>

                  <Form
                    inline
                    className="cr-search-form"
                    onSubmit={e => e.preventDefault()}
                  >
                    <MdSearch
                      size="20"
                      className="cr-search-form__icon-search text-secondary"
                    />
                    <Input
                      type="search"
                      className="cr-search-form__input"
                      placeholder="Search..."
                      id="search"
                      autoComplete="off"
                      onChange={evt => this.updateSearchValue(evt)}
                      onKeyPress={event => this.enterPressedSearch(event)}
                    />
                  </Form>
                </Form>
                <Button id="tambah" onClick={this.changePageState('NEW')}>
                  New Receive
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive striped hover>
                  <thead>
                    {
                      <tr>
                        <td
                          colSpan="6"
                          className="text-right"
                          style={{ border: 'none' }}
                        >
                          <Label style={{ width: '50%', textAlign: 'right' }}>
                            {' '}
                            {'Halaman : ' +
                              this.state.realCurrentPage +
                              ' / ' +
                              this.state.maxPage}
                          </Label>
                        </td>
                      </tr>
                    }
                    {
                      <tr>
                        <th style={{ width: '16.6%' }}>No. Recv</th>
                        <th style={{ width: '16.6%' }}>Supplier</th>
                        <th style={{ width: '16.6%' }}>No. PO </th>
                        <th style={{ width: '16.6%' }}>No. Faktur</th>
                        <th style={{ width: '16.6%' }}>Tgl Recv</th>
                        <th style={{ width: '16.6%' }}>Status</th>
                        <th style={{ width: '16.6%' }}>Print</th>
                      </tr>
                    }
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
              </CardBody>
              <CardBody>
                <Row>
                  <Col md="9" sm="12" xs="12">
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        Tampilkan
                      </InputGroupAddon>
                      <select
                        name="todosPerPage"
                        style={{ height: '38px' }}
                        value={this.state.value}
                        onChange={e => this.handleSelect(e)}
                      >
                        <option value="5">5</option>
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
                          value={1}
                          onClick={e =>
                            this.paginationButton(e, 0, this.state.maxPage)
                          }
                        >
                          &#10092;&#10092;
                        </Button>
                        <Button
                          name="PrevButton"
                          value={this.state.currentPage}
                          onClick={e =>
                            this.paginationButton(e, -1, this.state.maxPage)
                          }
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
                          onClick={e =>
                            this.paginationButton(e, 1, this.state.maxPage)
                          }
                        >
                          &#10093;
                        </Button>
                        <Button
                          name="LastButton"
                          value={this.state.maxPage}
                          onClick={e =>
                            this.paginationButton(e, 0, this.state.maxPage)
                          }
                        >
                          &#10093;&#10093;
                        </Button>
                      </ButtonGroup>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
            <script>
              {
                (document.onkeydown = e => {
                  e = e || window.event;
                  if (e.ctrlKey) {
                    switch (e.key) {
                      //ctrl + kanan untuk last
                      case 'ArrowRight':
                        this.pagination(
                          this.state.maxPage,
                          0,
                          this.state.maxPage,
                        );
                        e.preventDefault();
                        break;

                      //ctrl + kiri untuk first
                      case 'ArrowLeft':
                        this.pagination(1, 0, this.state.maxPage);
                        e.preventDefault();
                        break;
                    }
                  }
                  switch (e.key) {
                    //f3
                    case 'F3':
                      // alert("untuk search");
                      document.getElementById('search').focus();
                      e.preventDefault();
                      break;

                    //kanan untuk next
                    case 'ArrowRight':
                      if (e.ctrlKey === false) {
                        this.pagination(
                          this.state.currentPage,
                          1,
                          this.state.maxPage,
                        );
                      }
                      e.preventDefault();
                      break;

                    //kiri untuk prev
                    case 'ArrowLeft':
                      if (e.ctrlKey === false) {
                        this.pagination(
                          this.state.currentPage,
                          -1,
                          this.state.maxPage,
                        );
                      }
                      e.preventDefault();
                      break;
                  }
                  //menghilangkan fungsi default tombol
                  // e.preventDefault();
                })
              }
            </script>
          </Col>
        </Row>
      </Page>
    );
  }

  updateSearchValue(evt) {
    this.setState({
      keyword: evt.target.value,
    });
  }
}

export default ReceivingHPage;
