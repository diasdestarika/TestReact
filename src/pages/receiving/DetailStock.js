/* eslint-disable no-redeclare */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-vars */
import Page from 'components/Page';
// import SearchInput from 'components/SearchInput';
import React from 'react';
// import ReactDOM from 'react-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Label,
  InputGroup,
  InputGroupAddon,
  Form,
  FormGroup,
  // Spinner,
  ButtonGroup,
} from 'reactstrap';
import {
  MdSearch,
  MdLoyalty,
  MdAssignmentLate,
  MdEdit,
  MdAutorenew,
} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from '../urlStock';
// import * as firebase from 'firebase/app';
import LoadingSpinner from '../LoadingSpinner';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { date } from 'faker';

var accessList = {};

class DetailStock extends React.Component {
  //special method
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      data: [],
      isLoading: false,
      loading: false,
      inputtedName: '',
      inputtedName2: '',
      searchInputtedName: '',
      currentPage: 1,
      todosPerPage: 5,
      realCurrentPage: 1,
      maxPage: 1,
      flag: 0,
      keyword: '',
      totalPage: 1,
      hidePagination: 'flex-row',
      outcode: props.match.params.outcode,
      procod: props.match.params.id,
      ProName: props.match.params.proname,
      nobatch: '',
      search: '',
      expiredDate: '',
      today: new Date().toJSON().slice(0, 10),
      disabledDropdown: true,
      disabledInput: true,
      dataAvailable: false,
      editBatchDeff: [
        {
          batchLama: '',
          qtyLama: 0,
          batchBaru: '',
          qtyBaru: 0,
        },
      ],
    };

    if (window.localStorage.getItem('accessList')) {
      accessList = JSON.parse(window.localStorage.getItem('accessList'));
    }
  }
  //fungsi notification
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
    }, 100);
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

  // handleSelect(event) {
  //     this.setState({
  //         currentPage: 1,
  //         todosPerPage: event.target.value
  //     }, () => this.getListbyPaging())
  // }

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

  fetchData = () => {
    this.setState({ loading: true });
  };

  //Memberikan semua list data pada page tersebut dimana diBack end mempunyai data Current limit maupun Current Page
  getListbyPaging(
    currPage = this.state.currentPage,
    currLimit = this.state.todosPerPage,
    kword,
    viewProduct = 'viewProduct',
    paginateBatch = 'paginateBatch',
    outcode = window.localStorage.getItem('gID'),
    procod = this.props.match.params.id,
    search = this.state.search,
  ) {
    var url =
      myUrl.url_batch +
      '?type=' +
      paginateBatch +
      '&outcode=' +
      outcode +
      '&procod=' +
      procod +
      '&nobatch=' +
      search +
      '&page=' +
      currPage +
      '&length=' +
      currLimit;
    this.isLoading = true;

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
        // console.log('DATA GUDANG', data);
        // console.log('DATA BATCH', data.data);
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
            },
            () => this.setDataStatus(),
          );
        }
      })
      .catch(err => {
        this.showNotification({ err }, 'error');
        this.setState({
          loading: false,
        });
      });
  }

  updateStock = first_param => {
    var url = myUrl.url_updateBatch;
    var updateStock = first_param;
    var gID = window.localStorage.getItem('gID');

    this.fetchData();

    if (this.state.expiredDate === '') {
      var payload = {
        batchbaru: updateStock.batchBaru,
        batchlama: updateStock.batchLama,
        qtybaru: updateStock.qtyBaru,
        updateby: this.state.nip_user,
        expireddate: new Date(),
        gudangid: gID,
        procod: this.state.procod,
      };
    } else {
      var payload = {
        batchbaru: updateStock.batchBaru,
        batchlama: updateStock.batchLama,
        qtybaru: updateStock.qtyBaru,
        updateby: this.state.nip_user,
        expireddate: new Date(this.state.expiredDate),
        gudangid: gID,
        procod: this.state.procod,
      };
    }
    // console.log('PAYLOAD', payload);

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };
    fetch(url, option)
      .then(response => {
        if (response.ok) {
          this.componentDidMount();
          this.setState({
            modal_update: false,
            modal_nested: false,
            loading: false,
            editBatchDeff: {
              batchLama: '',
              qtyLama: 0,
              batchBaru: '',
              qtyBaru: 0,
            },
          });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loading: false, enterButton: false });
        }
      })
      .then(data => {
        // console.log('ISI DATA', data);
        if (data.error.status === true) {
          this.showNotification('Data gagal diubah', 'error');
          if (data.error.code === 401) {
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          // this.showNotification('Data berhasil diubah', 'info');
          this.showNotification(data.metadata.Message, 'info');
          this.setState({ loading: false, enterButton: false });
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({ loading: false, enterButton: false });
      });
  };

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

  setProfileData() {
    var profileObj = JSON.parse(window.localStorage.getItem('profile'));

    this.setState({
      nip_user: profileObj['mem_nip'],
      nama_user: profileObj['mem_username'],
    });
  }

  getAccess() {
    var access = accessList['19'];
    access &&
      access.map(todo => {
        return (
          <tr>
            {todo === 42 &&
              this.setState(
                { menuID: 42 },
                // () =>
                // console.log('MENU ID: ', this.state.menuID),
              )}
          </tr>
        );
      });
  }

  componentDidMount() {
    this.setProfileData();
    var gName = window.localStorage.getItem('gName');
    // console.log('GUDANG NAME: ', accessList);
    this.props.setTitle('DETAIL STOCK ' + gName, 'red');
    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    this.getAccess();
  }

  handleWrite(event, flag) {
    if (
      this.state.currentPage + flag < 1 ||
      this.state.currentPage + flag > this.state.totalPage - 1
    ) {
      return;
    }
    this.setState(
      {
        currentPage: Number(event.target.value) + flag,
      },
      () => {
        if (flag !== 0) {
          this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
        }
      },
    );
  }

  //fungsi yang mengarah kan ke arah first page
  handleFirst(event) {
    this.setState({
      currentPage: 1,
    });
    this.getListbyPaging(1, this.state.todosPerPage);
  }

  //fungsi yang mengarah ke arah last page
  handleLast(event) {
    this.setState({
      currentPage: this.state.maxPage,
    });
    this.getListbyPaging(this.state.totalPage - 1, this.state.todosPerPage);
  }

  handleClose = () => {
    this.setState({
      disabledInput: true,
      disabledDropdown: true,
      loading: false,
    });
  };
  //state awal pada saat membuka suatu page tsb nanti dicari langsung di render()
  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    modal_delete: false,
    modal_update: false,
    backdrop: true,
    inputtedName2: '',
  };

  //fungsi untuk membuka suatu toggle di page tsb
  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    //pembuatan setState disemua function, dimana hanya memanggil nama nya saja ex modal_delete , maka di render hanya panggil delete saja
    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  toggleUpdateData = (modalType, todo) => {
    this.setState(
      {
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        editBatch: todo,
        editBatchDeff: {
          qtyLama: todo.stck_qtystock,
          batchLama: todo.stck_batchnumber,
          qtyBaru: 0,
          batchBaru: '',
        },
        // checked: todo.outletb2b_epaymentyn === 'Y' ? true : false,
      },
      // () =>
      //   console.log(
      //     'NILAI TODO',
      //     this.state.editBatch,
      //     'NILAI DEFF',
      //     this.state.editBatchDeff,
      //   ),
    );
  };

  updateTanggalValue = field => evt => {
    this.setState(
      {
        [`${field}`]: evt.target.value,
      },
      () => this.validateTgl(field),
    );
    evt.preventDefault();
  };

  validateTgl(field) {
    var d1 = Date.parse(this.state.today);
    var d2 = Date.parse(this.state.expiredDate);

    if (isNaN(d2)) {
      return;
    }
    if (d1 > d2) {
      this.showNotification(
        'Tanggal Expired tidak boleh kurang dari hari ini!',
        'error',
      );
    } else {
      this.updateTanggalValue();
    }
  }

  updateInputValue(value, field, Dimen) {
    let editBatchDeff = this.state[Dimen];
    editBatchDeff[field] = value;
    this.setState(
      { editBatchDeff },
      // () =>
      // console.log('ISI INPUT', this.state.editBatchDeff),
    );
  }

  enterPressed = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.setState(
        {
          currPage: 1,
          currentPage: 1,
          realCurrentPage: 1,
        },
        () =>
          this.getListbyPaging(
            this.state.currentPage,
            this.state.todosPerPage,
            this.state.search,
          ),
      );
    }
  };

  enterPressedSearch = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.setState({ currentPage: 1, realCurrentPage: 1 }, () => {
        this.getListbyPaging(
          this.state.currentPage,
          this.state.todosPerPage,
          this.state.keyword,
        );
      });
    }
  };

  //ketika melakukan search, state input-an yang masuk harus uppercase dan tidak boleh special character
  setSearchInputState = evt => {
    this.setState({
      search: evt.target.value,
    });
  };

  updateSearchValue(evt) {
    this.setState({
      keyword: evt.target.value,
    });
  }

  setBatch = event => {
    var inputDisabled = document.getElementById('batchBaru');
    this.setState(
      {
        pilihBatch: event.target.value,
        editBatchDeff2: this.state.editBatch,
      },
      () =>
        this.setState(
          {
            editBatchDeff: {
              batchBaru: this.state.pilihBatch,
              // batchBaru: this.state.editBatchDeff.batchBaru,
              batchLama: this.state.editBatchDeff.batchLama,
              qtyLama: this.state.editBatchDeff.qtyLama,
              qtyBaru: this.state.editBatchDeff.qtyBaru,
            },
          },
          () => (inputDisabled.value = ''),
        ),
    );
  };

  canBeUpdate() {
    const { editBatchDeff, editBatch } = this.state;
    var namaLama = editBatch && editBatch.stck_batchnumber;
    var nilaiLama = parseInt(editBatch && editBatch.stck_qtystock);
    var namaBaru = editBatchDeff.batchBaru;
    var nilaiBaru = parseInt(editBatchDeff.qtyBaru);
    var tanggalExpired = this.state.expiredDate;
    var d1 = Date.parse(this.state.today);
    var d2 = Date.parse(this.state.expiredDate);

    // console.log('HIYYYY', namaLama, 'YAAA', isNaN(nilaiBaru));

    // if (isNaN(d2)) {
    //   return;
    // }
    return (
      namaLama !== namaBaru &&
      namaBaru !== '' &&
      nilaiBaru !== '' &&
      nilaiLama !== nilaiBaru &&
      !isNaN(nilaiBaru)
      //  ||
      //   tanggalExpired !== '' ||
      //   d1 <= d2
      // );
    );
  }

  handleClick(evt) {
    var dropdownChecked = document.getElementById('checkboxDropdown');
    var inputChecked = document.getElementById('checkboxInput');
    var dropdownDisabled = document.getElementById('batchBaruDropdown');
    var inputDisabled = document.getElementById('batchBaru');
    var tanggalExpired = document.getElementById('tanggalExpired');
    var deff = document.getElementById('deff');

    // console.log(
    //   'Value input input',
    //   inputDisabled.value,
    //   inputDisabled.value === '',
    // );
    // console.log('Value input dropdown', dropdownDisabled.value);

    if (dropdownChecked.checked) {
      // console.log('MASUK SINI 1');
      this.setState(
        {
          disabledDropdown: false,
          disabledInput: true,
        },
        () => (
          (inputDisabled.value = ''),
          (inputDisabled.style.display = 'none'),
          (dropdownDisabled.style.display = 'block'),
          (tanggalExpired.style.display = 'none')
        ),
      );
    }

    if (inputChecked.checked) {
      // console.log('MASUK SINI 3');
      this.setState(
        {
          disabledInput: false,
          disabledDropdown: true,
          pilihBatch: '',
        },
        () => (
          (inputDisabled.value = ''),
          (dropdownDisabled.value = ''),
          (dropdownDisabled.style.display = 'none'),
          (inputDisabled.style.display = 'block'),
          (tanggalExpired.style.display = 'block')
        ),
        // () => console.log('PILIH BATCH AFTER KLIK', this.state.pilihBatch),
      );
    }
  }

  //render biasa nya di-isi untuk desain HTML
  render() {
    const { result, isLoading, loading } = this.state;
    const isEnabledUpdate = this.canBeUpdate();
    var currentTodos = result;

    var formatter = new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
    });

    const renderBatch =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <option value={todo.stck_batchnumber}>{todo.stck_batchnumber}</option>
        );
      });

    const optionsDate = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr>
            <td style={{ width: '3%', textAlign: 'Right' }}>{i + 1}</td>
            <td style={{ width: '10%', textAlign: 'Left' }}>
              {todo.stck_batchnumber}
            </td>
            <td style={{ width: '10%', textAlign: 'Left' }}>
              {(todo.stck_expdate = new Date(todo.stck_expdate).toDateString())}
            </td>
            <td style={{ width: '7%', textAlign: 'Right' }}>
              {formatter.format(todo.stck_qtystock)}
            </td>
            <td style={{ width: '10%', textAlign: 'Right' }}>
              {/* <Link
                to={`/mutasiBookDetail/${encodeURIComponent(
                  this.props.match.params.id,
                )}/${encodeURIComponent(
                  this.props.match.params.proname,
                )}/${encodeURIComponent(todo.stck_batchnumber)}`}
              >
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                  >
                    {formatter.format(todo.stck_qtybook)}
                  </Label>
                }
              </Link> */}
              {todo.stck_qtybook}
            </td>
            <td style={{ width: '10%', textAlign: 'Right' }}>
              {formatter.format(todo.stck_qtyavailable)}
            </td>
            {this.state.menuID === 42 && (
              <td style={{ width: '10%', textAlign: 'center' }}>
                {/* <Button> */}
                <MdEdit
                  size={25}
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.toggleUpdateData('update', { ...todo })}
                />
                {/* </Button> */}
              </td>
            )}
            <td style={{ width: '10%', textAlign: 'center' }}>
              <Link
                to={`/mutasiStockDetail/${encodeURIComponent(
                  this.props.match.params.id,
                )}/${encodeURIComponent(
                  this.props.match.params.proname,
                )}/${encodeURIComponent(todo.stck_batchnumber)}`}
              >
                <MdAssignmentLate size={30} />
              </Link>
            </td>
          </tr>
        );
      });

    return (
      <Page>
        <Card className="mb-3">
          <NotificationSystem
            dismissible={false}
            ref={notificationSystem =>
              (this.notificationSystem = notificationSystem)
            }
            style={NOTIFICATION_SYSTEM_STYLE}
          />
          <CardHeader>
            <Row>
              <Col
                style={{ marginBottom: 0, paddingBottom: 0, margin: 'auto' }}
              >
                <Label
                  style={{ color: 'black', fontWeight: 'bold', margin: 'auto' }}
                >
                  {`${this.state.ProName} (${this.state.procod})`}
                </Label>
                {
                  // console.log("TYPE DATANYA APA? ", typeof(this.state.ProName))
                }
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
          {/* ======================================INPUT SEARCH============================== */}
          <CardBody
            className="d-flex justify-content-between"
            style={{ paddingBottom: 0 }}
          >
            <Form inline className="cr-search-form">
              <MdSearch
                size="20"
                className="cr-search-form__icon-search text-secondary"
              />
              <Input
                minLength="0"
                disabled={isLoading}
                value={this.state.search}
                onChange={evt => this.setSearchInputState(evt)}
                onKeyPress={event => this.enterPressed(event, true)}
                className="cr-search-form__input"
                placeholder="Cari.."
              />
              {!isLoading && <i className="fa fa-refresh fa-spin"></i>}
              {/* ======================================CLICK SEARCH============================== */}
              {/* <Card className="d-flex">
                <Button
                  onSubmit={e => e.preventDefault()}
                  value={this.state.searchInputtedName}
                  onClick={evt => this.searchInputValue(evt)}
                >
                  <MdSearch></MdSearch>
                </Button>
              </Card> */}
            </Form>
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
            } */}
          </CardBody>
          <CardBody>
            <Table
              responsive
              id="selectedColumn"
              // className="table table-striped table-bordered table-sm"
              // cellSpacing="0"
              width="100%"
              striped
            >
              {/* ====================================== TABLE DATA DIMANA LIST DATA YANG MUNCUL (TELAH DI DAPAT DR DATABASE)============================= */}
              <thead>
                <tr className="text-center">
                  <th style={{ width: '3%', textAlign: 'Right' }}>No.</th>
                  <th style={{ width: '7%', textAlign: 'Left' }}>Batch</th>
                  <th style={{ width: '10%', textAlign: 'Left' }}>
                    Kadaluarsa
                  </th>
                  <th style={{ width: '7%', textAlign: 'Right' }}>
                    Stok Fisik
                  </th>
                  <th style={{ width: '10%', textAlign: 'Right' }}>
                    Stok Dipesan
                  </th>
                  <th style={{ width: '10%', textAlign: 'Right' }}>
                    Stok Tersedia
                  </th>
                  {this.state.menuID === 42 && (
                    <th style={{ width: '10%', textAlign: 'center' }}>
                      Edit Batch
                    </th>
                  )}
                  <th style={{ width: '10%', textAlign: 'center' }}>
                    Cek Mutasi
                  </th>
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
            <Row className="d-flex justify-content-between">
              {/* ====================================== PEMBERIAN LIMIT DATA PER HALAMAN===================================== */}
              <Col md="6" sm="12" xs="12">
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
                    {/* <InputGroup style={{ width: "243px" }} className="ml-auto"> */}
                    {/* <div className="input-group-prepend"> */}
                    {/* ====================================== FIRST PAGE ======================================== */}
                    <Button
                      value={1}
                      onClick={e =>
                        this.paginationButton(e, 0, this.state.maxPage)
                      }
                    >
                      &lt;&lt;
                    </Button>
                    {/* ====================================== BACK ========================================= */}
                    <Button
                      value={this.state.currentPage}
                      onClick={e =>
                        this.paginationButton(e, -1, this.state.maxPage)
                      }
                    >
                      &lt;
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
                    {/* ====================================== NEXT  ============================== */}
                    {/* <div className="input-group-append"> */}
                    <Button
                      value={this.state.currentPage}
                      onClick={e =>
                        this.paginationButton(e, 1, this.state.maxPage)
                      }
                    >
                      &gt;
                    </Button>
                    {/* ====================================== LAST PAGE  ============================== */}
                    {/* <Button
                      value={this.state.maxPage}
                      onClick={e =>
                        this.paginationButton(e, 0, this.state.maxPage)
                      }
                    >
                      &gt;&gt;
                    </Button> */}
                  </ButtonGroup>
                </Card>
              </Col>
            </Row>

            {/* MODAL UPDATE */}
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_update}
              toggle={this.toggle('update')}
              className={this.props.className}
            >
              <ModalHeader toggle={this.toggle('update')}>
                Edit Batch
              </ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label>Batch</Label>
                  <Input
                    type="text"
                    autoComplete="off"
                    id="batchLama"
                    value={
                      this.state.editBatch &&
                      this.state.editBatch.stck_batchnumber
                    }
                    disabled
                  />
                </FormGroup>
                <FormGroup>
                  <Form inline>
                    <Label style={{ width: '23%' }}>Qty Saat ini</Label>
                    <Input
                      style={{ width: '30%' }}
                      type="text"
                      autoComplete="off"
                      id="qtyLama"
                      value={
                        this.state.editBatch &&
                        this.state.editBatch.stck_qtystock
                      }
                      disabled
                    />

                    <Label style={{ width: '17%' }}>Qty baru</Label>
                    <Input
                      style={{ width: '30%' }}
                      type="number"
                      autoComplete="off"
                      id="batch"
                      value={parseInt(
                        this.state.editBatchDeff &&
                          this.state.editBatchDeff.qtyBaru,
                      )}
                      onChange={e =>
                        this.updateInputValue(
                          parseInt(e.target.value),
                          'qtyBaru',
                          'editBatchDeff',
                        )
                      }
                      name="qtyBaru"
                      placeholder="Isi Quantity"
                    />
                  </Form>
                </FormGroup>
                <hr
                  style={{
                    borderWidth: '2px',
                    color: 'black',
                    backgroundColor: 'black',
                  }}
                ></hr>
                <FormGroup>
                  <Label>
                    Pindah sejumlah{' '}
                    <Label style={{ color: 'red' }}>
                      {parseInt(
                        this.state.editBatch &&
                          this.state.editBatch.stck_qtystock,
                      ) -
                        parseInt(
                          this.state.editBatchDeff &&
                            this.state.editBatchDeff.qtyBaru,
                        )}
                    </Label>{' '}
                    ke-Batch
                  </Label>
                  <Form>
                    <Col>
                      <Row>
                        <Col>
                          <Input
                            type="radio"
                            id="checkboxDropdown"
                            name="batchRadio"
                            style={{}}
                            onClick={evt => this.handleClick(evt)}
                          ></Input>
                          <Label style={{ textAlign: 'left' }}>
                            Pilih Batch{' '}
                          </Label>
                          <Input
                            placeholder={'Silahkan Pilih Batch Lama'}
                            type="select"
                            id="batchBaruDropdown"
                            autoComplete="off"
                            name="select"
                            color="info"
                            style={{
                              textAlign: 'center',
                              display: 'none',
                            }}
                            onChange={this.setBatch}
                            disabled={this.state.disabledDropdown}
                          >
                            <option
                              value={0}
                              disabled
                              selected
                              hidden
                              id="pilih"
                            >
                              Silahkan Pilih Batch Lama
                            </option>
                            {renderBatch}
                          </Input>
                        </Col>
                      </Row>
                    </Col>

                    <Col>
                      <Row>
                        <Col>
                          <Input
                            type="radio"
                            name="batchRadio"
                            id="checkboxInput"
                            style={{}}
                            onClick={evt => this.handleClick(evt)}
                          ></Input>
                          <Label style={{ textAlign: 'left' }}>
                            Input Batch
                          </Label>
                          <Input
                            type="text"
                            autoComplete="off"
                            id="batchBaru"
                            value={
                              this.state.editBatchDeff &&
                              this.state.editBatchDeff.batchBaru
                            }
                            onChange={e =>
                              this.updateInputValue(
                                e.target.value,
                                'batchBaru',
                                'editBatchDeff',
                              )
                            }
                            name="batchBaru"
                            placeholder="Isi Batch baru"
                            style={{ display: 'none' }}
                            disabled={this.state.disabledInput}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Form>
                </FormGroup>
                <Row id="tanggalExpired" style={{ display: 'none' }}>
                  <Col>
                    <Col>
                      <Label>Tanggal Expired</Label>
                      <Input
                        // style={{ display: 'none' }}
                        type="date"
                        onChange={this.updateTanggalValue('expiredDate')}
                      ></Input>
                    </Col>
                  </Col>
                </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  disabled={!isEnabledUpdate}
                  color="primary"
                  onClick={this.toggle('nested')}
                >
                  Simpan
                </Button>
                <Modal
                  onExit={this.handleClose}
                  isOpen={this.state.modal_nested}
                  toggle={this.toggle('nested')}
                >
                  <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                  <ModalBody>
                    <Row>
                      <Col sm={6}>
                        <Form inline>
                          <Label style={{ width: '50%', textAlign: 'left' }}>
                            Batch lama:{' '}
                          </Label>
                          <Input
                            disabled
                            style={{
                              width: '49%',
                              marginLeft: '1%',
                              textAlign: 'left',
                            }}
                            value={
                              this.state.editBatch &&
                              this.state.editBatch.stck_batchnumber
                            }
                          ></Input>
                        </Form>
                      </Col>

                      <Col sm={6}>
                        <Form inline>
                          <Label style={{ width: '50%', textAlign: 'left' }}>
                            Batch baru:{' '}
                          </Label>
                          <Input
                            disabled
                            style={{
                              width: '49%',
                              marginLeft: '1%',
                              textAlign: 'left',
                            }}
                            value={
                              this.state.editBatchDeff &&
                              this.state.editBatchDeff.batchBaru
                            }
                          ></Input>
                        </Form>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm={6}>
                        <Form inline>
                          <Label style={{ width: '50%', textAlign: 'left' }}>
                            Qty lama:{' '}
                          </Label>
                          <Input
                            disabled
                            style={{
                              width: '49%',
                              marginLeft: '1%',
                              textAlign: 'left',
                            }}
                            value={
                              this.state.editBatch &&
                              this.state.editBatch.stck_qtystock
                            }
                          ></Input>
                        </Form>
                      </Col>

                      <Col sm={6}>
                        <Form inline>
                          <Label style={{ width: '50%', textAlign: 'left' }}>
                            Qty baru:{' '}
                          </Label>
                          <Input
                            disabled
                            style={{
                              width: '49%',
                              marginLeft: '1%',
                              textAlign: 'left',
                            }}
                            value={
                              this.state.editBatchDeff &&
                              this.state.editBatchDeff.qtyBaru
                            }
                          ></Input>
                        </Form>
                      </Col>
                    </Row>
                    <hr
                      style={{
                        borderWidth: '2px',
                        color: 'black',
                        backgroundColor: 'black',
                      }}
                    ></hr>
                    <Row>
                      <Col>
                        <Label>
                          Tanggal Expired:{' '}
                          <Label style={{ fontWeight: 'bold' }}>
                            {this.state.expiredDate === ''
                              ? '-'
                              : new Date(
                                  this.state.expiredDate,
                                ).toLocaleDateString('in-ID', optionsDate)}
                          </Label>
                        </Label>
                        <br></br>
                        <Label>
                          Total Qty yang dipindahkan:{' '}
                          <Label style={{ fontWeight: 'bold' }}>
                            {parseInt(
                              this.state.editBatch &&
                                this.state.editBatch.stck_qtystock,
                            ) -
                              parseInt(
                                this.state.editBatchDeff &&
                                  this.state.editBatchDeff.qtyBaru,
                              )}
                          </Label>
                        </Label>
                      </Col>
                    </Row>
                  </ModalBody>
                  <ModalBody>
                    Apakah Anda yakin ingin menyimpan data ini?
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onClick={() => this.updateStock(this.state.editBatchDeff)}
                      disabled={loading}
                    >
                      {!loading && <span>Ya</span>}
                      {loading && <MdAutorenew />}
                      {loading && <span>Sedang diproses</span>}
                    </Button>{' '}
                    {!loading && (
                      <Button color="secondary" onClick={this.toggle('nested')}>
                        Tidak
                      </Button>
                    )}
                  </ModalFooter>
                </Modal>{' '}
                <Button color="secondary" onClick={this.toggle('update')}>
                  Batal
                </Button>
              </ModalFooter>
            </Modal>
            {/* MODAL UPDATE */}
          </CardBody>
        </Card>
      </Page>
    );
  }
}
export default DetailStock;
