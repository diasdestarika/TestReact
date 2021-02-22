import React from 'react';
import Page from 'components/Page';
import {
  Table,
  Input,
  Form,
  FormFeedback,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Button,
  Row,
  Col,
  Label,
} from 'reactstrap';
import { MdAutorenew } from 'react-icons/md';
import Axios from 'axios';
import { url_laporansp } from 'pages/urlLinkLaporanSP';

class SPHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // tipeLaporan: [
      //   {
      //     name: 'Ronaldo',
      //   },
      //   {
      //     name: 'Manual',
      //   },
      // ],
      result: [],
      // selectedTipeLaporan: '',
      // selectedJenisLaporan: '',
      // inputDate: '',
      // spNotPrintChecked: false,
      gudangID: window.localStorage.getItem('gID'),
      // flag: 'P',
      notFound: false,
      btnSearchWord: 'Search',
      btnSearchIsDisabled: false,
    };
  }

  componentDidMount() {
    this.props.setTitle('');
  }

  // handleChange = (event, type) => {
  //   if (type === 'tipe laporan') {
  //     if (event.target.value === '==PILIH TIPE LAPORAN==') {
  //       this.setState({
  //         selectedTipeLaporan: '',
  //       });
  //     } else {
  //       this.setState({
  //         selectedTipeLaporan: event.target.value,
  //       });
  //     }
  //   }
  //   if (type === 'jenis laporan') {
  //     if (event.target.value === '==PILIH JENIS LAPORAN==') {
  //       this.setState({
  //         selectedJenisLaporan: '',
  //       });
  //     } else {
  //       this.setState({
  //         selectedJenisLaporan: event.target.value,
  //       });
  //     }
  //   }
  //   if (type === 'sp not print') {
  //     this.setState(
  //       {
  //         spNotPrintChecked: !this.state.spNotPrintChecked,
  //       },
  //       () => this.setFlag(),
  //     );
  //   }
  //   if (type === 'date') {
  //     this.setState({
  //       inputDate: event.target.value,
  //     });
  //   }
  // };

  // setFlag = () => {
  //   if (this.state.spNotPrintChecked) {
  //     this.setState({
  //       flag: 'N',
  //     });
  //   } else if (!this.state.spNotPrintChecked) {
  //     this.setState({
  //       flag: 'P',
  //     });
  //   }
  // };

  // getLaporanSPManual = () => {
  //   this.setState({
  //     btnSearchWord: 'Mohon Tunggu',
  //     btnSearchIsDisabled: true,
  //   });
  //   const url_getReport =
  //     'http://10.0.111.4:3333/sp?' +
  //     this.state.selectedTipeLaporan.toLowerCase() +
  //     '&flag=' +
  //     this.state.flag +
  //     '&date=' +
  //     this.state.inputDate +
  //     '&gudangid=' +
  //     this.state.gudangID;
  //   if (this.state.selectedTipeLaporan === 'Manual') {
  //     Axios.get(url_getReport)
  //       .then(response => {
  //         console.log('response', response);
  //         if (response.data.data === null) {
  //           this.setState(
  //             {
  //               notFound: true,
  //             },
  //             () => this.toReport(),
  //           );
  //         } else {
  //           this.setState(
  //             {
  //               notFound: false,
  //               result: response.data.data,
  //             },
  //             () => this.toReport(),
  //           );
  //         }
  //       })
  //       .catch(error => {
  //         this.setState(
  //           {
  //             btnSearchWord: 'Search',
  //             btnSearchIsDisabled: false,
  //           },
  //           () => alert(error.message),
  //         );
  //       });
  //   }
  // };

  getLaporanSPRonaldo = () => {
    this.setState({
      btnSearchWord: 'Mohon Tunggu',
      btnSearchIsDisabled: true,
    });
    const url =
      url_laporansp + '/Download-Data?gID=' +
      this.state.gudangID;
    Axios.get(url).then(response => {
      console.log(url);
      console.log('response', response);
      this.setState(
        {
          result: response.data.data,
        },
        () => this.toReport(),
      );

      console.log(this.state.result);
    });
  };

  toReport = () => {
    // if (this.state.selectedTipeLaporan === 'Manual') {
    //   var data = {
    //     selectedTipeLaporan: this.state.selectedTipeLaporan,
    //     selectedJenisLaporan: this.state.selectedJenisLaporan,
    //     inputDate: this.state.inputDate,
    //     spNotPrintChecked: this.state.spNotPrintChecked,
    //     notFound: this.state.notFound,
    //     hasilSP: this.state.result,
    //   };
    //   this.props.passData('SPManual', data);
    //   this.props.history.push('/laporanspmanual');
    // } else {
    //   this.props.history.push('/laporansph-1');
    // }
    var data = {
      hasilSP: this.state.result,
    };
    this.props.passData('SPHarian', data);
    this.props.history.push('/laporansph-1');
  };

  render() {
    const {
      //   tipeLaporan,
      //   selectedTipeLaporan,
      //   spNotPrintChecked,
      btnSearchWord,
      btnSearchIsDisabled,
    } = this.state;
    return (
      <Page
        title="Laporan SP Home"
        breadcrumbs={[{ name: 'Laporan SP Home', active: true }]}
        className="Laporan SP Home"
      >
        {/* <Card>
          <CardBody>
            <Row style={{ marginTop: '1%' }}>
              <Col></Col>
              <Col>
                <h5>Pilih Tipe Laporan</h5>
              </Col>
              <Col>
                <select
                  className="custom-select"
                  onChange={e => this.handleChange(e, 'tipe laporan')}
                >
                  <option>==PILIH TIPE LAPORAN==</option>
                  {tipeLaporan &&
                    tipeLaporan.map(js => <option>{js.name}</option>)}
                </select>
              </Col>
              <Col></Col>
            </Row>
          </CardBody>
        </Card> */}

        {/* {selectedTipeLaporan === 'Manual' && (
          <Card>
            <CardHeader>
              <h5>Laporan Manual</h5>
            </CardHeader>
            <CardBody>
              <Row>
                <Col></Col>
                <Col xs={2} style={{ paddingRight: '0px', marginRight: '0%' }}>
                  <h5 style={{ marginTop: '3%' }}>Jenis Laporan</h5>
                </Col>
                <Col xs={3} style={{ paddingLeft: '0px', marginLeft: '0%' }}>
                  <select
                    className="custom-select"
                    onChange={e => this.handleChange(e, 'jenis laporan')}
                  >
                    <option>==PILIH JENIS LAPORAN==</option>
                    <option>SP Harian</option>
                  </select>
                </Col>
                <Col xs={1}></Col>
                <Col>
                  <Input
                    style={{ marginTop: '2%' }}
                    type="checkbox"
                    checked={spNotPrintChecked}
                    onChange={e => this.handleChange(e, 'sp not print')}
                  />
                  <h5 style={{ marginTop: '1%' }}>SP NOT PRINT</h5>
                </Col>
              </Row>

              <Row>
                <Col></Col>
                <Col xs={2} style={{ paddingRight: '0px', marginRight: '0%' }}>
                  <h5 style={{ marginTop: '3%' }}>Date</h5>
                </Col>
                <Col xs={3} style={{ paddingLeft: '0px', marginLeft: '0%' }}>
                  <Input
                    type="date"
                    onChange={e => this.handleChange(e, 'date')}
                  ></Input>
                </Col>
                <Col xs={1}></Col>
                <Col></Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Row>
                <Col></Col>
                <Col
                  xs={2}
                  style={{ paddingRight: '0px', marginRight: '0%' }}
                ></Col>
                <Col xs={2} style={{ paddingLeft: '0px', marginLeft: '0%' }}>
                  <Button
                    disabled={btnSearchIsDisabled}
                    onClick={() => this.getLaporanSPManual()}
                  >
                    {btnSearchIsDisabled && <MdAutorenew />}
                    {btnSearchWord}
                  </Button>
                </Col>
                <Col xs={1}></Col>
                <Col></Col>
              </Row>
            </CardFooter>
          </Card>
        )} */}

        {/* {selectedTipeLaporan === 'Ronaldo' && ( */}
        <Card>
          <CardHeader>
            <h5>LAPORAN SP H-1</h5>
          </CardHeader>
          <CardBody>
            <Row>
              <Col
                xs={3}
                style={{ paddingRight: '0px', marginRight: '0%' }}
              ></Col>
              <Col xs={4} style={{ paddingRight: '0px', marginRight: '0%' }}>
                <h5 style={{ marginTop: '3%' }}>JENIS LAPORAN</h5>
              </Col>
              <Col xs={4} style={{ paddingLeft: '0px', marginLeft: '0%' }}>
                <select
                  className="custom-select"
                  onChange={e => this.handleChange(e, 'jenis laporan')}
                >
                  <option>LAPORAN SP H-1</option>
                </select>
              </Col>
              <Col xs={1}></Col>
            </Row>
          </CardBody>
          <CardFooter>
            <Row>
              <Col></Col>
              <Col
                xs={2}
                style={{ paddingRight: '0px', marginRight: '0%' }}
              ></Col>
              <Col xs={2} style={{ paddingLeft: '0px', marginLeft: '0%' }}>
                <Button
                  disabled={btnSearchIsDisabled}
                  onClick={() => this.getLaporanSPRonaldo()}
                >
                  {btnSearchIsDisabled && <MdAutorenew />}
                  {btnSearchWord}
                </Button>
              </Col>
              <Col xs={1}></Col>
              <Col></Col>
            </Row>
          </CardFooter>
        </Card>
        {/* )} */}
      </Page >
    );
  }
}
export default SPHome;
