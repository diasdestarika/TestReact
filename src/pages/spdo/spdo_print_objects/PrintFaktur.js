import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Label,
    Row,
    Table,
} from 'reactstrap';

const fontStyle = { 'font-family': 'Courier New' }
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

class PrintFaktur extends React.Component {

    numberWithCommas = (num) => {
        const regex = /\B(?=(\d{3})+(?!\d))/g;
        return (num + "").replace(regex, ",");
    }

    render() {

        var currentDate = new Date();
        var createdDateDate = currentDate.getDate() + '';
        createdDateDate = createdDateDate.length === 1 ? '0' + createdDateDate : createdDateDate;
        var createdDateMonth = MONTHS[currentDate.getMonth()];
        var createdDateYear = currentDate.getFullYear();
        var createdDate = `${createdDateDate} ${createdDateMonth} ${createdDateYear}`;

        var dueDateProps;
        var dueDateDate;
        var dueDateMonth;
        var dueDateYear;
        var dueDate;

        dueDateProps = this.props.DueDate ? new Date(this.props.DueDate) : new Date();
        dueDateDate = dueDateProps.getDate() + '';
        dueDateDate = dueDateProps.length === 1 ? '0' + dueDateDate : dueDateDate;
        dueDateMonth = MONTHS[dueDateProps.getMonth()];
        dueDateYear = dueDateProps.getFullYear();
        dueDate = `${dueDateDate}-${dueDateMonth}-${dueDateYear}`;

        return (
            <Card className='m-1 p-4'>
                <CardHeader>
                    <Row className='d-flex justify-content-end'>
                        <Label className='font-weight-bold'><span style={fontStyle}>ASLI</span></Label>
                    </Row>
                    <Row className='d-flex justify-content-center'>
                        <h5 className='font-weight-bold'><span style={fontStyle}>Faktur Penjualan</span></h5>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Form>
                        <Card body outline color='secondary'>
                            <div>
                                <Label xs={4} md={4}><span style={fontStyle}>Kode dan Nomor Seri Faktur Pajak</span></Label>
                                <Label xs={1} md={1} className='text-right'><span style={fontStyle}>:</span></Label>
                                <Label xs={6} md={6} className='font-weight-bold'><span style={fontStyle}>{this.props.FakturPajak}</span></Label>
                            </div>
                        </Card>

                        <Card body outline color='secondary' className='mt-2'>
                            <CardHeader><h6 className='font-weight-bold'><span style={fontStyle}>PENGUSAHA KENA PAJAK</span></h6></CardHeader>
                            <CardBody>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}><span style={fontStyle}>Nama</span></Label>
                                        <Label xs={1} md={1} className='text-right'><span style={fontStyle}>:</span></Label>
                                        <Label xs={6} md={6} className='text-uppercase'><span style={fontStyle}>{this.props.namaPajak}</span></Label>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}><span style={fontStyle}>Alamat</span></Label>
                                        <Label xs={1} md={1} className='text-right'><span style={fontStyle}>:</span></Label>
                                        <Label xs={6} md={6} className='text-uppercase'><span style={fontStyle}>{this.props.alamatPajak}</span></Label>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}><span style={fontStyle}>N.P.W.P.</span></Label>
                                        <Label xs={1} md={1} className='text-right'><span style={fontStyle}>:</span></Label>
                                        <Label xs={6} md={6} className='text-uppercase'><span style={fontStyle}>{this.props.npwpPajak}</span></Label>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>


                        <Card body outline color='secondary' className='mt-2'>
                            <CardHeader><h6 className='font-weight-bold'><span style={fontStyle}>PEMBELIAN BARANG KENA PAJAK / PENERIMA JASA PAJAK</span></h6></CardHeader>
                            <CardBody>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}><span style={fontStyle}>Nama</span></Label>
                                        <Label xs={1} md={1} className='text-right'><span style={fontStyle}>:</span></Label>
                                        <Label xs={6} md={6} className='text-uppercase'><span style={fontStyle}>{this.props.namaOutlet}</span></Label>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}><span style={fontStyle}>Alamat</span></Label>
                                        <Label xs={1} md={1} className='text-right'><span style={fontStyle}>:</span></Label>
                                        <Label xs={6} md={6} className='text-uppercase'><span style={fontStyle}>{this.props.outaddressTujuan}</span></Label>
                                    </Col>
                                </Row>
                                <Row form>
                                    <Col>
                                        <Label xs={4} md={4}><span style={fontStyle}>N.P.W.P.</span></Label>
                                        <Label xs={1} md={1} className='text-right'><span style={fontStyle}>:</span></Label>
                                        <Label xs={6} md={6} className='text-uppercase'><span style={fontStyle}>{this.props.npwpTujuan}</span></Label>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                        <Table bordered className='mt-3'>
                            <thead>
                                <tr align='center'>
                                    <th><span style={fontStyle}>No</span></th>
                                    <th><span style={fontStyle}>Nama Barang</span></th>
                                    <th><span style={fontStyle}>(Kd. Brg)</span></th>
                                    <th><span style={fontStyle}>Batch</span></th>
                                    <th><span style={fontStyle}>Satuan</span></th>
                                    <th><span style={fontStyle}>Qty</span></th>
                                    <th><span style={fontStyle}>Disc</span></th>
                                    <th><span style={fontStyle}>Hrg / Sat</span></th>
                                    <th><span style={fontStyle}>Jumlah</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.transFD &&
                                    this.props.transFD.map((transfd, index) =>
                                        <tr>
                                            <td className='text-right'><span style={fontStyle}>{index + 1}</span></td>
                                            <td><span style={fontStyle}>{transfd.Pro_Name}</span></td>
                                            <td className='text-center'><span style={fontStyle}>{transfd.TransfD_ProCod}</span></td>
                                            <td className='text-center'><span style={fontStyle}>{transfd.TransfD_BatchNumber}</span></td>
                                            <td className='text-center'><span style={fontStyle}>{transfd.pack_name}</span></td>
                                            <td className='text-right'><span style={fontStyle}>{transfd.TransfD_Qty_Scan}</span></td>
                                            <td className='text-right'><span style={fontStyle}>{transfd.TransfD_Discount}%</span></td>
                                            <td className='text-right'><span style={fontStyle}>{this.numberWithCommas(transfd.TransfD_SalePrice)}</span></td>
                                            <td className='text-right'><span style={fontStyle}>{this.numberWithCommas(transfd.Total)}</span></td>
                                        </tr>
                                    )
                                }
                                <tr>
                                    <td></td>
                                    <td colSpan={2} className='text-center'><span style={fontStyle}>{this.props.NoFaktur}</span></td>
                                    <td colSpan={4}><span style={fontStyle}>Tgl Jatuh Tempo : <span className='ml-5'>{dueDate}</span></span></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colSpan={4}></td>
                                    <td colSpan={3}>
                                        <Row>
                                            <Col><span style={fontStyle}>Sub Total</span></Col>
                                        </Row>
                                        <Row form>
                                            <Col><span style={fontStyle}>Diskon</span></Col>
                                        </Row>
                                        <Row form>
                                            <Col><span style={fontStyle}>Extra Diskon</span></Col>
                                        </Row>
                                    </td>
                                    <td>
                                        <Row>
                                            <Col className='text-right'><span style={fontStyle}>{this.numberWithCommas(this.props.subTotal)}</span></Col>
                                        </Row>
                                        <Row form>
                                            <Col className='text-right'><span style={fontStyle}>{this.numberWithCommas(this.props.totalDiskon)}</span></Col>
                                        </Row>
                                        <Row form>
                                            <Col className='text-right'><span style={fontStyle}>{this.numberWithCommas(this.props.extraDiskon)}</span></Col>
                                        </Row>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colSpan={4}></td>
                                    <td colSpan={3}>
                                        <Row form>
                                            <Col><span style={fontStyle}>Dasar Pengenaan Pajak</span></Col>
                                        </Row>
                                        <Row form>
                                            <Col><span style={fontStyle}>PPN 10%</span></Col>
                                        </Row>
                                    </td>
                                    <td>
                                        <Row form>
                                            <Col className='text-right'><span style={fontStyle}>{this.numberWithCommas(this.props.DPP)}</span></Col>
                                        </Row>
                                        <Row form>
                                            <Col className='text-right'><span style={fontStyle}>{this.numberWithCommas(this.props.totalPPN)}</span></Col>
                                        </Row>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td colSpan={4}></td>
                                    <td colSpan={3}><span style={fontStyle}>TOTAL</span></td>
                                    <td className='text-right'><span style={fontStyle}>{this.numberWithCommas(this.props.totalHarga)}</span></td>
                                </tr>
                            </tbody>
                        </Table>

                        <Row>
                            <Col className='text-right'><span style={fontStyle}>Jakarta, <span className='ml-5'>{createdDate}</span></span></Col>
                        </Row>

                        <Row>
                            <Col xs={2} md={2}><span style={fontStyle}>No. DO</span></Col>
                            <Col xs={1} md={1} className='text-right'><span style={fontStyle}>:</span></Col>
                            <Col><span style={fontStyle}>{this.props.noDO}</span></Col>
                        </Row>

                        <Row>
                            <Col />
                        </Row>

                        <Row>
                            <Col xs={2} md={2}><span style={fontStyle}>* Payment Type</span></Col>
                            <Col xs={1} md={1} className='text-right'><span style={fontStyle}>:</span></Col>
                            <Col><span style={fontStyle}>{this.props.paymentMethod}</span></Col>
                        </Row>

                        <Row form>
                            <Col className='text-right'><span style={fontStyle}>{this.props.apj}</span></Col>
                        </Row>
                        <Row form>
                            <Col className='text-right'><span style={fontStyle}>Apoteker Penanggungjawab</span></Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        )
    }
}

export default PrintFaktur;