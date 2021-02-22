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
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

class PrintDO extends React.Component {

    render() {
        var tglDO;

        const tglDOProps = this.props.tglDO ? this.props.tglDO : '1990-01-01';

        const tglDODate = tglDOProps.substr(8, 2);
        const tglDOMonth = MONTHS[parseInt(tglDOProps.substr(5, 2)) - 1];
        const tglDOYear = tglDOProps.substr(0, 4);

        tglDO = `${tglDODate}-${tglDOMonth}-${tglDOYear}`;

        return (
            <Card className='m-1 p-1'>
                <CardHeader>
                    <Row className='d-flex justify-content-between'>
                        <Label><span style={fontStyle}></span></Label>
                        <Label><span style={fontStyle}>Page : 1</span></Label>
                    </Row>
                    <Row className='d-flex justify-content-center'>
                        <h2 className='font-weight-bold'><span style={fontStyle}>DELIVERY ORDER</span></h2>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Form>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>Dari</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>[PBF] {this.props.outnameDari}</span></Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>Tujuan</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.namaOutlet}</span></Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>Alamat</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.outaddressDari}</span></Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>Alamat</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.outaddressTujuan}</span></Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>Telepon</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.telpDari}</span></Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>Telepon</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.telpTujuan}</span></Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>Ijin PBF</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.ijinDari}</span></Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>Ijin PBF</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.ijinTujuan}</span></Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>APJ</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.apj}</span></Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>APJ</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.apjTujuan}</span></Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>SIKA</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.sika}</span></Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>SIKA</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.sikaTujuan}</span></Label>
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row form className='d-flex justify-content-around'>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>NPWP</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.npwpDari}</span></Label>
                                </FormGroup>
                            </Col>
                            <Col md={5} xs={5}>
                                <FormGroup row>
                                    <Label className='font-weight-bold'><span style={fontStyle}>NPWP</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.npwpTujuan}</span></Label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>
                    {
                        this.props.transFD.length > 6 &&
                        <div style={{ "height":"1100px" }}></div>
                    }
                    <Row>
                        <Col md={2} xs={2}>
                            <Label className='ml-3 font-weight-bold'><span style={fontStyle}>No DO</span></Label>
                        </Col>
                        <Col md={1} xs={1}>
                            <Label className='font-weight-bold'><span style={fontStyle}>:</span></Label>
                        </Col>
                        <Col>
                            <Label><span style={fontStyle}>{this.props.noDO}</span></Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={2} xs={2}>
                            <Label className='ml-3 font-weight-bold'><span style={fontStyle}>Tanggal</span></Label>
                        </Col>
                        <Col md={1} xs={1}>
                            <Label className='font-weight-bold'><span style={fontStyle}>:</span></Label>
                        </Col>
                        <Col>
                            <Label><span style={fontStyle}>{tglDO}</span></Label>
                        </Col>
                    </Row>
                    <Table bordered size="sm">
                        <thead>
                            <tr>
                                <th className="text-center"><span style={fontStyle}>PROCOD</span></th>
                                <th><span style={fontStyle}>NAMA BARANG</span></th>
                                <th className="text-center"><span style={fontStyle}>BATCH NUMBER</span></th>
                                <th className="text-center"><span style={fontStyle}>EXPIRED DATE</span></th>
                                <th className="text-center"><span style={fontStyle}>QUANTITY</span></th>
                                <th className="text-center"><span style={fontStyle}>SATUAN</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.transFD.map(transFD =>
                                <tr>
                                    <td className="text-center"><span style={fontStyle}>{transFD.TransfD_ProCod}</span></td>
                                    <td><span style={fontStyle}>{transFD.Pro_Name}</span></td>
                                    <td className="text-center"><span style={fontStyle}>{transFD.TransfD_BatchNumber}</span></td>
                                    <td className="text-center"><span style={fontStyle}>
                                        {
                                            transFD.TransfD_ED.substr(5, 2) + '/' + // Month
                                            transFD.TransfD_ED.substr(8, 2) + '/' + // Date
                                            transFD.TransfD_ED.substr(0, 4) // Year
                                        }
                                    </span></td>
                                    <td className="text-center"><span style={fontStyle}>{transFD.TransfD_Qty_Scan}</span></td>
                                    <td className="text-center"><span style={fontStyle}>{transFD.pack_name}</span></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Row className='mt-4'>
                        <Col>
                            <Label className='ml-3'><span style={fontStyle}><span className='mr-3 font-weight-bold'>BERAT TOTAL: </span>{parseInt(this.props.totalBerat)} gr</span></Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} xs={3}>
                            <Label className='ml-3 font-weight-bold'><span style={fontStyle}>Jumlah Total Quantity DO</span></Label>
                        </Col>
                        <Col md={1} xs={1}>
                            <Label className='font-weight-bold'><span style={fontStyle}>:</span></Label>
                        </Col>
                        <Col>
                            <Label><span style={fontStyle}>{this.props.totalQTY}</span></Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} xs={3}>
                            <Label className='ml-3 font-weight-bold'><span style={fontStyle}>Jumlah Total Procod DO</span></Label>
                        </Col>
                        <Col md={1} xs={1}>
                            <Label className='font-weight-bold'><span style={fontStyle}>:</span></Label>
                        </Col>
                        <Col>
                            <Label><span style={fontStyle}>{this.props.transFD.length}</span></Label>
                        </Col>
                    </Row>
                    <Row className='d-flex justify-content-around'>
                        <Col>
                            <Label className='w-100 text-center font-weight-bold'><span style={fontStyle}>DIBUAT,</span></Label>
                            <div className='my-2' />
                            <Label className='mt-5 w-100 text-center'><span style={fontStyle}>{this.props.pembuat}</span></Label>
                        </Col>
                        <Col>
                            <Label className='w-100 text-center font-weight-bold'><span style={fontStyle}>MENGETAHUI,</span></Label>
                            <div className='my-2' />
                            <Label className='mt-5 w-100 text-center'><span style={fontStyle}>{this.props.apj}</span></Label>
                            <Label className='w-100 text-center font-weight-bold'><span style={fontStyle}></span></Label>
                        </Col>
                        <Col>
                            <Label className='w-100 text-center font-weight-bold'><span style={fontStyle}>DITERIMA,</span></Label>
                            <div className='my-2' />
                            <Label className='mt-5 w-100 text-center'><span style={fontStyle}></span></Label>
                            <Label className='w-100 text-center font-weight-bold'><span style={fontStyle}></span></Label>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        )
    }
}

export default PrintDO;