import Page from 'components/Page';
import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Label,
  ButtonGroup,
  InputGroup,
  InputGroupAddon,
  CardGroup,
  Badge,
  Modal,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  CardHeader,
} from 'reactstrap';
import { IconWidget } from 'components/Widget';
import {
  MdLoyalty,
  MdHighlightOff,
  MdCheckCircle,
  MdSearch,
} from 'react-icons/md';
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
      Nomor: 1,
      loading: false,
      inputtedNoResi: '',
      orderID: '',
      nomorresi: '',
      orderDelivery: '',
      valid: '',
      keyword: '',
      bgColor: 'red',
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
  toggle = modalType => () => {
    //console.log(modalType);
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };
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

  //search
  enterPressedSearch = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.setState({ currentPage: 1, realCurrentPage: 1 }, () => {
        this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
      });
    }
  };

  //input
  enterPressedResi = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.setState({
        modal_confirmation: true,
      });
      //console.log(this.state.inputtedNoResi);
    }
  };

  updateSearchValue(evt) {
    this.setState({
      keyword: evt.target.value,
    });
  }

  SearchbyButton = param => () => {
    this.setState({ currentPage: 1 }, () => {
      this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    });
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
    const kword = this.state.keyword;
    //console.log('hahha' + kword);
    var gudangID = window.localStorage.getItem('gID');
    var urlA = '';
    if (kword == '') {
      urlA = myUrl.url_orderpelapak + gudangID;
    } else {
      urlA = myUrl.url_orderpelapak + gudangID + '&orderid=' + kword;
    }
    //console.log(gudangID + 'testgudangID');
    //console.log(urlA);

    fetch(urlA)
      .then(response => {
        // // trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
        }
      })
      .then(data => {
        //console.log(data);
        if (data.responseMessage === 0) {
          this.setState({
            responseHeader: 'Alert!!!',
            responseMessage: 'Data is empty!',
            modal_response: true,
            result: data,
            isLoading: false,
          });
        } else {
          this.setState({ result: data });
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  printLabel(order_id) {
    const url = myUrl.url_printorder + order_id;

    fetch(url).then(response => {
      //const filename = response.headers.get('Content-Disposition').split('filename=')[1]
      response.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = order_id + '.pdf';
        a.click();
        this.getListbyPaging();
        this.setState({
          bgColor: 'gray',
        });
      });
    });
  }

  resetInput() {
    this.setState({
      inputtedNoResi: '',
    });
  }

  // input
  inputResi(nomorresi) {
    //console.log(this.state.inputtedNoResi);
    //console.log('Order ID = ' + this.state.orderID);
    if (nomorresi == '') {
      this.setState({
        responseHeader: 'Warning!!!',
        responseMessage: "Nomor Resi can't be empty!",
        modal_response: true,
        modal_nested_add: false,
      });
    } else {
      //console.log('hahaha');

      var gudangID = window.localStorage.getItem('gID');
      var url =
        myUrl.url_orderpelapak + gudangID + '&orderid=' + this.state.orderID;

      fetch(url, {
        method: 'PUT',
        // mode : 'CORS',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            no_resi: nomorresi.toString(),
          },
          //console.log('Test: ' + nomorresi),
        ),
      })
        .then(response => {
          //console.log(response);
          if (response.ok) {
            this.state.modal_nested_add = false;
            this.state.modal_nested_parent = false;
            this.state.modal_confirmation = false;
            this.componentDidMount();
            this.state.responseHeader = 'Confirmation';
            this.state.responseMessage = 'Data save';
            this.state.modal_response = true;
            this.resetInput();
          } else {
            this.state.responseHeader = 'Confirmation';
            this.state.responseMessage = 'Data failed to edit';
            this.state.modal_response = true;
          }
        })
        .catch(() => {
          this.connectionOut("Can't reach the server", true);
        });
    }
  }

  kirimModal(orderdelivery, nomorresi) {
    this.setState({
      modal_kirim: true,
      orderDelivery: orderdelivery,
      nomorresi: nomorresi,
    });
  }

  kirimDeliveryDate(orderid) {
    var gudangID = window.localStorage.getItem('gID');
    var url = myUrl.url_orderpelapak + gudangID + '&kirim=' + orderid;

    fetch(url, {
      method: 'PUT',
      // mode : 'CORS',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
      .then(response => {
        //console.log(response);
        if (response.ok) {
          this.componentDidMount();
          this.state.responseHeader = 'Confirmation';
          this.state.responseMessage = 'Data send';
          this.state.modal_response = true;
          this.state.modal_kirim = false;
        } else {
          this.state.responseHeader = 'Confirmation';
          this.state.responseMessage = 'Data failed to send';
          this.state.modal_response = true;
          this.state.modal_kirim = false;
        }
      })
      .catch(() => {
        this.connectionOut("Can't reach the server", true);
      });
  }

  openModalInput(orderID) {
    this.setState({
      modal_nested_parent: true,
      orderID: orderID,
    });
  }

  connectionOut(message, render) {
    if (render) {
      this.setState({
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested_add: false,
        backdrop: true,
        modal_response: true,
        responseHeader: 'CONNECTION ERROR',
        responseMessage: message,
        modal_confirmation: false,
        modal_kirim: false,
      });
    } else {
      this.setState({
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested_add: false,
        backdrop: true,
        modal_response: true,
        responseHeader: 'CONNECTION ERROR',
        responseMessage: message,
        modal_confirmation: false,
        modal_kirim: false,
      });
    }
  }

  updateInputValue(evt) {
    //console.log(evt.target.name);
    //console.log(evt.target.value);
    this.setState({
      [evt.target.name]: evt.target.value,
    });
  }

  componentDidMount() {
    this.props.setTitle('Order Dr.Ship', 'blue');
    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    var myVar = setInterval(() => {
      //console.log('BERHASIL AUTO REFRESH');
      this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    }, 1800000);
  }

  render() {
    const Nomor = this.state.Nomor;
    const orderID = this.state.orderID;
    const currentTodos = this.state.result.data;

    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i} style={{ width: '200%' }}>
            <th scope="row" style={{ fontSize: '25px', textAlign: 'right' }}>
              {Nomor + i}
            </th>
            <td style={{ fontSize: '25px' }}>{todo.outlet}</td>
            <td style={{ fontSize: '25px' }}>{todo.order_id}</td>
            <td style={{ fontSize: '25px' }}>{todo.order_date}</td>
            <td
              style={{ fontSize: '25px' }}
              className="d-flex justify-content-between"
            >
              <button
                type="button"
                class="btn btn-secondary"
                onClick={() => this.printLabel(todo.order_id)}
              >
                Print Label
              </button>
              {todo.print_label_ke === 0 ? (
                <button
                  disabled={todo.no_resi.Valid === false}
                  type="button"
                  class="btn btn-print"
                >
                  Ekspedisi
                </button>
              ) : (
                <button
                  type="button"
                  class="btn btn-secondary"
                  onClick={() =>
                    this.kirimModal(todo.order_id, todo.no_resi.String)
                  }
                >
                  Ekspedisi
                </button>
              )}
              {/* <Button disabled={todo.no_resi.Valid === true || todo.print_label_ke === 0} onClick={()=>this.openModalInput(todo.order_id)}>Input Resi</Button>  */}
              {/* <Button disabled={todo.no_resi.Valid === false || todo.print_label_ke === 0} onClick={()=>this.kirimModal(todo.order_id, todo.no_resi.String)}>Ekspedisi</Button> */}
            </td>
          </tr>
        );
      });

    return (
      <Page className="OrderPelapak">
        <Modal
          isOpen={this.state.modal_kirim}
          toggle={this.toggle('kirim')}
          // itemID={this.state}
        >
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>
            Apakah anda yakin melakukan pengiriman dengan no. resi{' '}
            {this.state.nomorresi}?
          </ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onClick={() => this.kirimDeliveryDate(this.state.orderDelivery)}
            >
              <MdCheckCircle /> Yes
            </Button>{' '}
            <Button color="danger" onClick={this.toggle('kirim')}>
              <MdHighlightOff /> No
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.modal_nested_parent}
          toggle={this.toggle('nested_parent')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent')}>
            Add Nomor Resi
          </ModalHeader>
          <ModalBody>
            <Label>Nomor Resi</Label>
            <br />
            <Input
              onKeyPress={e => this.enterPressedResi(e, false)}
              type="nomorresi"
              value={this.state.inputtedNoResi}
              onChange={evt => this.updateInputValue(evt)}
              name="inputtedNoResi"
            />
          </ModalBody>
          <ModalFooter className="clearfix">
            <Modal
              isOpen={this.state.modal_confirmation}
              toggle={this.toggle('confirmation')}
            >
              <ModalHeader>Confirmation</ModalHeader>
              <ModalBody>Are you sure to save the data?</ModalBody>
              <ModalFooter>
                <Button
                  color="success"
                  onClick={() => this.inputResi(this.state.inputtedNoResi)}
                >
                  <MdCheckCircle /> Yes
                </Button>{' '}
                <Button color="danger" onClick={this.toggle('confirmation')}>
                  <MdHighlightOff /> No
                </Button>
              </ModalFooter>
            </Modal>{' '}
            <Button color="danger" onClick={() => this.resetInput()}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.modal_response}
          toggle={this.toggle('response')}
        >
          <ModalHeader>{this.state.responseHeader}</ModalHeader>
          <ModalBody>{this.state.responseMessage}</ModalBody>
          <ModalFooter>
            <Button
              color="success"
              onClick={() => {
                this.setState({
                  modal_response: false,
                  modal_nested: false,
                  modal_nested_edit: false,
                });
              }}
            >
              Ok
            </Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col>
            <Card className="mb-3">
              <CardHeader className="d-flex justify-content-between">
                <Input
                  name="keyword"
                  type="search"
                  className="cr-search-form__input"
                  placeholder="Search by OrderID"
                  onKeyPress={e => this.enterPressedSearch(e, false)}
                  style={{
                    marginRight: '0.5vw',
                  }}
                  onChange={evt => this.updateSearchValue(evt)}
                ></Input>
                <Button
                  size="md"
                  style={{
                    marginRight: '0.5vw',
                  }}
                  onClick={this.SearchbyButton()}
                >
                  <MdSearch />
                </Button>
              </CardHeader>
              <CardBody>
                <Table responsive striped>
                  <thead>
                    <tr style={{ width: '200%' }}>
                      <th style={{ fontSize: '25px' }}>No.</th>
                      <th style={{ fontSize: '25px' }}>Outlet</th>
                      <th style={{ fontSize: '25px' }}>OrderID</th>
                      <th style={{ fontSize: '25px' }}>OrderDate</th>
                      <th style={{ fontSize: '25px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {renderTodos}
                    {!currentTodos && <LoadingSpinner status={2} />}
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
