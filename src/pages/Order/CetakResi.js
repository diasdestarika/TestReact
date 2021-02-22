import Page from 'components/Page';
import React from 'react';
import {
  Card,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import { MdLoyalty } from 'react-icons/md';
import * as myUrl from '../urlLink';
// import * as firebase from 'firebase/app';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

// const perf = firebase.performance();
const axios = require('axios').default;

class CetakResi extends React.Component {
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
      resultResi: [],
      pilihEcommerce: '',
      namaEcommerce: '',
      noResi: '',
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
    }, 500);
  };

  componentDidMount() {
    this.props.setTitle('Cetak Resi', 'black');
    this.getAllEcommerce();
  }

  cekResi() {
    var eID = this.state.pilihEcommerce;
    var noResiInput = this.state.noResi;
    const urlResi = myUrl.url_cekResi + noResiInput + '&outletID=' + eID;

    //console.log('HASIL URL', urlResi);

    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.defaults.headers.post['Access-Control-Allow-Methods'] =
      'GET,PUT,POST,DELETE,PATCH,OPTIONS';
    axios.defaults.headers.post['Content-Type'] =
      'application/x-www-form-urlencoded';
    axios
      .get(urlResi)
      .then(response => {
        // handle success
        //console.log(JSON.stringify(response.data));

        if (response.data.error === 'error_not_exists') {
          //console.log('gak masuk');
          this.showNotification('No Resi Tidak Di Temukan!', 'error');
        } else {
          // console.log(
          //   'UDAH JALAN GAN',
          //   response.data.result.airway_bills[0].airway_bill,
          // );
          window.open(response.data.result.airway_bills[0].airway_bill);
          this.showNotification('No Resi siap untuk di Unduh!', 'info');
        }
      })
      .catch(function (error) {
        // handle error
        //console.log(error);
      })
      .then(data => {});
  }

  enterCekResi = event => {
    if (event.key === 'Enter') {
      this.setState(
        {
          noResi: event.target.value,
        },
        () => this.cekResi(),
      );
    }
  };

  setEcommerce = event => {
    this.setState({
      pilihEcommerce: event.target.value,
    });
    //console.log(event.target.value);
    //console.log(nama.Out_Name);
  };

  getAllEcommerce() {
    var gudangID = window.localStorage.getItem('gID');
    const urlA = `${myUrl.url_pilihEcommerce}type=rogd&gudangID=${gudangID}`;
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
        //console.log(JSON.stringify(data));
        //console.log('data', data);
        var tempData = data.data;
        tempData.shift();
        this.setState({ resultEcommerce: tempData });
      });
  }

  render() {
    // const currentTodos = this.state.result.data;
    // const listEcommerce = this.state.resultEcommerce;
    // const renderEcommerce = listEcommerce && listEcommerce.map((todo, i) => {
    //     return <option value={todo.Out_Code}>{todo.Out_Name}</option>
    // });

    //totaldata
    const listEcommerce = this.state.resultEcommerce;
    const renderEcommerce =
      listEcommerce &&
      listEcommerce.map((todo, i) => {
        return <option value={todo.Out_Code}>{todo.Out_Name}</option>;
      });

    return (
      <Page className="CekResi">
        <Row>
          <Col>
            <Card>
              <NotificationSystem
                dismissible={false}
                ref={notificationSystem =>
                  (this.notificationSystem = notificationSystem)
                }
                style={NOTIFICATION_SYSTEM_STYLE}
              />
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
              <CardHeader>
                <FormGroup>
                  <Row>
                    <Col md="3" sm="6" xs="6" style={{ marginTop: '0.5%' }}>
                      <Label style={{ fontWeight: 'bold' }}>
                        Input Nomor Order Shopee:{' '}
                      </Label>
                    </Col>
                    <Col>
                      <Input
                        type="text"
                        autoComplete="off"
                        name="inputNomorOrder"
                        style={{ marginLeft: '1%', width: '100%' }}
                        placeholder="Masukkan No Resi"
                        onKeyPress={this.enterCekResi}
                      ></Input>
                    </Col>
                  </Row>
                </FormGroup>
              </CardHeader>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default CetakResi;
