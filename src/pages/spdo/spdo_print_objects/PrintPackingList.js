import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import Barcode from 'react-barcode';
import QRCode from 'qrcode.react'
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    Input,
    Label,
    Row,
    Table,
    FormGroup,
} from 'reactstrap';

const fontStyle = {'font-family': 'Courier New'}
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class PrintPackingList extends React.Component {

    render() {
        const d = this.props.currentDate ? this.props.currentDate : new Date();
        const date = `${d.getDate() < 10 ? "0" + d.getDate() : d.getDate()}-${MONTHS[d.getMonth()]}-${d.getFullYear()}`;

        const minutes = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
        const seconds = d.getSeconds().toString().length == 1 ? '0' + d.getSeconds() : d.getSeconds();
        const time = `${d.getHours()}:${minutes}:${seconds}`;

        const THP_TglPL = this.props.THP_TglPL ? this.props.THP_TglPL : '1900-01-01';
        const tglPLDate = THP_TglPL.substr(8, 2);
        const tglPLMonth = MONTHS[parseInt(THP_TglPL.substr(5, 2)) - 1];
        const tglPLYear = THP_TglPL.substr(0, 4);
        const tglPL = `${tglPLDate}-${tglPLMonth}-${tglPLYear}`;

        return (
            <Card className="m-1 p-4" >
                <CardHeader>
                    <Row className='d-flex justify-content-between'>
                        <Label><span style={fontStyle}>{date}</span></Label>
                        <Label><span style={fontStyle}>Page : 1</span></Label>
                    </Row>
                    <Row className='d-flex justify-content-between'>
                        <Label><span style={fontStyle}>{time}</span></Label>
                        <Label className='font-weight-bold'><span style={fontStyle}>ASLI</span></Label>
                    </Row>
                    <Row className='d-flex justify-content-center'>
                        <h2 className='font-weight-bold'><span style={fontStyle}>Laporan Packing List</span></h2>
                    </Row>
                </CardHeader>

                <CardBody>
                    <div className='mt-4 mb-5 mr-4 d-flex justify-content-between align-items-center' >
                        <Barcode format='CODE39' height={50} displayValue={false} value={this.props.THP_NoPL} />
                        <QRCode size={100} value={this.props.THP_NoPL != null ? this.props.THP_NoPL : ''} />
                    </div>
                    <Form>
                        <Row form className='d-flex justify-content-around'>
                            <Col xs={5} md={5}>
                                <FormGroup row>
                                    <Label className="mt-1 font-weight-bold"><span style={fontStyle}>No. Packing List</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.THP_NoPL}</span></Label>
                                </FormGroup>
                            </Col>

                            <Col xs={5} md={5}>
                                <FormGroup row>
                                    <Label className="mt-1 font-weight-bold"><span style={fontStyle}>Penerima</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.Out_Name}</span></Label>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form className='d-flex justify-content-around'>
                            <Col xs={5} md={5}>
                                <FormGroup row>
                                    <Label className="mt-1 font-weight-bold"><span style={fontStyle}>Tgl Packing List</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{tglPL}</span></Label>
                                </FormGroup>
                            </Col>

                            <Col xs={5} md={5}>
                                <FormGroup row>
                                    <Label className="mt-1 font-weight-bold"><span style={fontStyle}>Tujuan</span></Label>
                                    <Label className='w-100 text-wrap'><span style={fontStyle}>{this.props.Out_Name}</span></Label>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row form className='d-flex justify-content-around'>
                            <Col xs={5} md={5}></Col>

                            <Col xs={5} md={5}>
                                <FormGroup row>
                                    <Label className="mt-1 font-weight-bold"><span style={fontStyle}>No POD</span></Label>
                                    <Label className='w-100 text-wrap d-flex justify-content-between'>
                                        <span style={fontStyle}>{this.props.THP_NoPOD}</span>
                                        <span style={fontStyle}>{this.props.Out_Code + "==>" + this.props.THP_DistName}</span>
                                    </Label>
                                </FormGroup>
                            </Col>
                        </Row>
                    </Form>

                    <Table bordered size="sm" className="mt-3">
                        <thead>
                            <tr>
                                <th className="text-center"><span style={fontStyle}>No. DO</span></th>
                                <th><span style={fontStyle}>Nama Produk</span></th>
                                <th className="text-center"><span style={fontStyle}>Batch</span></th>
                                <th className="text-center"><span style={fontStyle}>Qty S1s</span></th>
                                <th className="text-center"><span style={fontStyle}>Berat Resi</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr align="center">
                                <td><span style={fontStyle}>{this.props.noDO}</span></td>
                                <td><span style={fontStyle}></span></td>
                                <td><span style={fontStyle}></span></td>
                                <td><span style={fontStyle}></span></td>
                                <td><span style={fontStyle}>{parseFloat(this.props.totalBerat).toFixed(2)}</span></td>
                            </tr>
                            {this.props.transFD.map(transFD => 
                                <tr>
                                    <td><span style={fontStyle}></span></td>
                                    <td><span style={fontStyle}>{transFD.Pro_Name}</span></td>
                                    <td className="text-center"><span style={fontStyle}>{transFD.TransfD_BatchNumber}</span></td>
                                    <td className="text-center"><span style={fontStyle}>{transFD.TransfD_Qty_Scan}</span></td>
                                    <td><span style={fontStyle}></span></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    <Card className='mt-3'></Card>
                    <Row form className='mt-3 mb-2 d-flex justify-content-end'>
                        <Label><span style={fontStyle}><span className="mr-5 font-weight-bold">Total Berat Resi: </span>{parseFloat(this.props.totalBerat).toFixed(2)}</span></Label>
                    </Row>
                    <Card></Card>
                </CardBody>
            </Card>
        );
    }
}

export default PrintPackingList;