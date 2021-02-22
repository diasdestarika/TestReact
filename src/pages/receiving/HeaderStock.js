import React from 'react';
import Page from 'components/Page';
import {
  Row,
  Col,
  Table,
  Card,
  CardBody,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
  Form,
  Label,
  Badge,
  ButtonGroup,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownMenu,
} from 'reactstrap';
import * as myUrl from '../urlStock';
import { MdLoyalty, MdSearch, MdAssignmentLate } from 'react-icons/md';
import LoadingSpinner from '../LoadingSpinner';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

class HeaderStock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      isLoading: false,
      inputtedName: '',
      search: '',
      currentPage: 1,
      todosPerPage: 5,
      realCurrentPage: 1,
      maxPage: 1,
      totalPages: 1,
      flag: 0,
      outcode: '0',
      dataAvailable: false,
      activeDDTerbesar: false,
      activeDDTerkecil: false,
      urutkanStock: 'Terkecil',
      sort: 'ASC',
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

  getListbyPaging(currPage, currLimit, sort) {
    var paginateProduct = 'paginateProduct';
    var outcode = window.localStorage.getItem('gID');
    var search = this.state.search;
    var url =
      myUrl.url_gudangcode +
      '?type=' +
      paginateProduct +
      '&outcode=' +
      outcode +
      '&page=' +
      currPage +
      '&length=' +
      currLimit +
      '&procod=' +
      search +
      '&sort=' +
      sort;
    this.isLoading = true;

    // console.log('LINK URL HEADER STOCK: ', url);

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
    this.getListbyPaging(
      this.state.currentPage,
      this.state.todosPerPage,
      this.state.sort,
    );
    var gName = window.localStorage.getItem('gName');
    this.props.setTitle('STOCK ' + gName, 'red');
  }

  handleSelect(event) {
    this.setState(
      {
        currentPage: 1,
        todosPerPage: event.target.value,
      },
      () =>
        this.getListbyPaging(
          this.state.currentPage,
          this.state.todosPerPage,
          this.state.sort,
        ),
    );
  }

  handleWrite(event, flag) {
    var currPage = Number(event.target.value);
    if (currPage + flag > 0 && currPage + flag <= this.state.maxPage) {
      this.setState(
        {
          currentPage: currPage + flag,
          realCurrentPage: currPage + flag,
        },
        () => {
          this.getListbyPaging(
            this.state.currentPage,
            this.state.todosPerPage,
            // this.state.keyword,
            this.state.sort,
          );
        },
      );
    }
  }

  handleFirst(event) {
    this.setState(
      {
        currentPage: 1,
      },
      () =>
        this.getListbyPaging(
          this.state.currentPage,
          this.state.todosPerPage,
          this.state.sort,
        ),
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
            () =>
              this.getListbyPaging(
                this.state.currentPage,
                this.state.todosPerPage,
                this.state.sort,
              ),
          );
        } else {
          this.setState(
            prevState => ({
              currentPage: prevState.currentPage,
            }),
            () =>
              this.getListbyPaging(
                this.state.currentPage,
                this.state.todosPerPage,
                this.state.sort,
              ),
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
        () =>
          this.getListbyPaging(
            this.state.currentPage,
            this.state.todosPerPage,
            this.state.sort,
          ),
      );
    }
  };

  handleSearch = event => {
    this.setState({
      search: event.target.value,
    });
  };

  handleOutcode = evt => {
    this.setState(
      {
        outcode: evt.target.value,
        search: '',
        currentPage: 1,
      },
      () =>
        this.getListbyPaging(
          this.state.currentPage,
          this.state.todosPerPage,
          this.state.sort,
        ),
    );
  };

  sortingStockHabisTerbesar() {
    var terbesar = document.getElementById('terbesar');
    this.setState(
      {
        activeDDTerbesar: true,
        activeDDTerkecil: false,
        urutkanStock: 'Terbesar',
        sort: 'DESC',
      },
      () =>
        this.getListbyPaging(
          this.state.currentPage,
          this.state.todosPerPage,
          this.state.sort,
        ),
    );
  }

  sortingStockHabisTerkecil() {
    var terkecil = document.getElementById('terkecil');
    this.setState(
      {
        activeDDTerbesar: false,
        activeDDTerkecil: true,
        urutkanStock: 'Terkecil',
        sort: 'ASC',
      },
      () =>
        this.getListbyPaging(
          this.state.currentPage,
          this.state.todosPerPage,
          this.state.sort,
        ),
    );
  }

  render() {
    const { result } = this.state;

    var currentTodos = result;

    var formatter = new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
    });

    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i, { id }) => {
        return (
          <tr key={i}>
            {todo.Procod !== '' && (
              <td style={{ width: '10%', textAlign: 'Center' }}>
                <Link
                  to={`/detailstock/${this.state.outcode}/${encodeURIComponent(
                    todo.Procod,
                  )}/${encodeURIComponent(todo.ProName)}`}
                >
                  {
                    <Label
                      style={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      {todo.Procod}
                    </Label>
                  }
                </Link>
              </td>
            )}

            {todo.Procod === '' && (
              <td style={{ width: '10%', textAlign: 'Center' }}>
                <Label>-</Label>
              </td>
            )}

            {todo.ProName !== '' && (
              <td style={{ width: '17%', textAlign: 'left' }}>
                {todo.ProName}
              </td>
            )}

            {todo.ProName === '' && (
              <td style={{ width: '17%', textAlign: 'left' }}>
                <Label>-</Label>
              </td>
            )}

            <td style={{ width: '7%', textAlign: 'Right' }}>
              {formatter.format(todo.QuantityFisik)}
            </td>
            {(todo.ProName === '' || todo.Procod === '') && (
              <td style={{ width: '10%', textAlign: 'Right' }}>
                <Label
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  {formatter.format(todo.QuantityBook)}
                </Label>
              </td>
            )}
            {/* {(todo.ProName !== '' || todo.Procod !== '') && (
              <td style={{ width: '10%', textAlign: 'Right' }}>
                <Link
                  to={`/mutasiBook/${encodeURIComponent(
                    todo.Procod,
                  )}/${encodeURIComponent(todo.ProName)}`}
                >
                  {
                    <Label
                      style={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      {formatter.format(todo.QuantityBook)}
                    </Label>
                  }
                </Link>
              </td>
            )} */}
            <td style={{ width: '10%', textAlign: 'Right' }}>
              {todo.QuantityBook}
            </td>
            <td style={{ width: '10%', textAlign: 'Right' }}>
              {formatter.format(todo.QuantityAvailable)}
            </td>

            {todo.ActiveYN === 'Y' && (
              <td style={{ width: '10%', textAlign: 'Center' }}>
                <Badge color="success">Aktif</Badge>
              </td>
            )}
            {todo.ActiveYN === 'N' && (
              <td style={{ width: '10%', textAlign: 'Center' }}>
                <Badge color="danger">Non-Aktif</Badge>
              </td>
            )}
            {todo.ActiveYN === '' && (
              <td style={{ width: '10%', textAlign: 'Center' }}>
                {/* <Badge color="danger">Non-Aktif</Badge> */}
                <Label>-</Label>
              </td>
            )}

            <td style={{ width: '10%', textAlign: 'left' }}>
              {(todo.LastUpdate = new Date(todo.LastUpdate).toDateString())}
            </td>

            {(todo.ProName === '' || todo.Procod === '') && (
              <td style={{ width: '10%', textAlign: 'center' }}>
                <MdAssignmentLate size={30} />
              </td>
            )}
            {(todo.ProName !== '' || todo.Procod !== '') && (
              <td style={{ width: '10%', textAlign: 'center' }}>
                <Link
                  id="5"
                  to={`/mutasiStock/${encodeURIComponent(
                    todo.Procod,
                  )}/${encodeURIComponent(todo.ProName)}`}
                >
                  <MdAssignmentLate size={30} />
                </Link>
              </td>
            )}
          </tr>
        );
      });

    return (
      <Page className="HeaderStock">
        <Row>
          <Col>
            <Card
              className="mb-3"
              style={{
                flex: 5,
                outlineColor: 'white',
                color: 'black',
                backgroundColor: '#ffffff',
              }}
            >
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
                </Form>
                <UncontrolledDropdown>
                  <Label style={{ fontWeight: 'bold' }}>
                    Urutkan Stock: &nbsp;
                  </Label>
                  <DropdownToggle caret>
                    {this.state.urutkanStock}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem
                      id="terbesar"
                      onClick={() => this.sortingStockHabisTerbesar()}
                      active={this.state.activeDDTerbesar}
                    >
                      Terbesar
                    </DropdownItem>
                    <DropdownItem
                      id="terkecil"
                      onClick={() => this.sortingStockHabisTerkecil()}
                      active={this.state.activeDDTerkecil}
                    >
                      Terkecil
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                {/* <Form inline>
                  <Label style={{ fontWeight: 'bold', width: '30%' }}>
                    Urutkan:{' '}
                  </Label>
                  <Input
                    type="select"
                    autoComplete="off"
                    name="select"
                    color="info"
                    style={{
                      marginLeft: '1%',
                      width: '69%',
                      textAlign: 'center',
                    }}
                    onChange={this.setDepo}
                  >
                    <option value={0} disabled selected hidden id="pilih">
                      Terbesar
                    </option>
                    <option value={1} disabled selected hidden id="pilih">
                      Terkecil
                    </option>
                  </Input>
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
                } */}
              </CardBody>
              <CardBody
                style={{
                  outlineColor: 'red',
                  color: 'black',
                  backgroundColor: '#ffffff',
                }}
              >
                <Table responsive striped id="proStock" hover>
                  <thead>
                    <tr style={{ width: '200%' }}>
                      <th style={{ width: '3%', textAlign: 'Center' }}>
                        Procod
                      </th>
                      <th style={{ width: '17%', textAlign: 'Left' }}>
                        Nama Produk
                      </th>
                      <th style={{ width: '10%', textAlign: 'Right' }}>
                        Stok Fisik
                      </th>
                      <th style={{ width: '10%', textAlign: 'Right' }}>
                        Stok Dipesan
                      </th>
                      <th style={{ width: '10%', textAlign: 'Right' }}>
                        Stok Tersedia
                      </th>
                      <th style={{ width: '10%', textAlign: 'Center' }}>
                        Status
                      </th>
                      <th style={{ width: '10%', textAlign: 'Left' }}>
                        Update Terakhir
                      </th>
                      <th style={{ width: '10%', textAlign: 'Center' }}>
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
              </CardBody>
              <CardBody>
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
                          value={this.state.currentPage}
                          onClick={e => this.handleFirst(e, -1)}
                        >
                          &lt; &lt;
                        </Button>

                        <Button
                          name="PrevButton"
                          value={this.state.currentPage}
                          onClick={e => this.handleWrite(e, -1)}
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

                        <Button
                          name="NextButton"
                          value={this.state.currentPage}
                          onClick={e => this.handleWrite(e, 1)}
                        >
                          &gt;
                        </Button>
                      </ButtonGroup>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}

export default HeaderStock;
