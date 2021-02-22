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
import * as Moment from 'moment';

class SPHarian extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
      result: [],
      btnPrintTitle: 'Print',
    };
  }

  componentDidMount() {
    if (this.props.reqData[0] !== undefined) {
      this.setState({
        result: this.props.reqData[0].hasilSP,
      });
    }
    console.log(this.state.result);
  }

  toHome = () => {
    this.props.history.push('/laporansphome');
    this.props.passData('clear', 'hapus');
  };

  toPrint = async () => {
    // const url = 'http://localhost:1999/Report-SP/Download-Data';

    // fetch(url).then(response => {
    //   console.log(url);
    //   console.log('response', response);
    //   response.blob().then(blob => {
    //     let url = window.URL.createObjectURL(blob);
    //     let a = document.createElement('a');
    //     a.href = url;
    //     a.download = 'SP.pdf';
    //     a.click();
    //     this.setState({
    //       bgColor: 'gray',
    //     });
    //   });
    // });

    await this.setState({
      btnPrintTitle: 'Loading...',
    });

    // var url = 'http://localhost:1999/Report-SP/Download-Data';
    // window.open(url, '_blank');

    // const url = 'http://localhost:1999/Report-SP/Download-Data';

    // fetch(url).then(response => {
    //   console.log(url);
    //   console.log('response', response);
    //   response.blob().then(blob => {
    //     let url = window.URL.createObjectURL(blob);
    //     console.log(url);
    //     console.log(blob);
    //     let a = document.createElement('a');
    //     console.log(a);
    //     a.href = url;
    //     console.log(a.href);
    //     a.download = 'SP.pdf';
    //     a.click();
    //     this.setState({
    //       bgColor: 'gray',
    //     });
    //   });
    // });

    await this.setState({
      btnPrintTitle: 'Print',
    });
  };

  render() {
    const { result } = this.state;
    return (
      <Page
        title="Laporan SP H-1"
        breadcrumbs={[{ name: 'Laporan SP H-1', active: true }]}
        className="Laporan SP H-1"
      >
        <Card>
          <CardHeader>
            <strong>
              <h5>Laporan SP PRINT</h5>
            </strong>
          </CardHeader>
          <CardBody>
            <Table responsive={'sm'}>
              <thead style={{ backgroundColor: 'lightblue' }}>
                <tr>
                  <th>Outlet</th>
                  <th>Tanggal</th>
                  <th>Jml SP Not Print</th>
                  <th>Jml SP Print</th>
                  <th>Jml DO</th>
                  <th>Jml SP Cancel</th>
                </tr>
              </thead>
              <tbody>
                {result === null ? (
                  <tr>
                    <td colSpan="4"> TIDAK ADA DATA </td>
                  </tr>
                ) : (
                    result.map((reqData, index) => {
                      return (
                        <tr key={index}>
                          <td>{reqData.Outlet}</td>
                          <td>{reqData.Tanggal}</td>
                          <td>{reqData.JumlahSPBelumPrint}</td>
                          <td>{reqData.JumlahSPPrint}</td>
                          <td>{reqData.JumlahDO}</td>
                          <td>{reqData.JumlahSPCancel}</td>
                        </tr>
                      );
                    })
                  )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
        <Card>
          <CardFooter>
            <Button
              color="danger"
              style={{ float: 'right', marginRight: '1%' }}
              onClick={() => this.toHome()}
            >
              Close
            </Button>
            {/* <Button color="info" className="mr-3" onClick={this.toPrint}>
              {this.state.btnPrintTitle}
            </Button> */}
          </CardFooter>
        </Card>
      </Page>
    );
  }
}
export default SPHarian;
