import React from 'react';
import Barcode from 'react-barcode'
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Form,
	Label,
	Row,
	Table,
	FormGroup,
} from 'reactstrap';

const fontStyle = { 'font-family': 'Courier New' }
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

class PrintSP extends React.Component {

	
	render() {
		var tglPO;

		try {
			const tglPOProps = this.props.OrdLcl_TglPO;

			const tglPODate = tglPOProps.substr(8, 2);
			const tglPOMonth = MONTHS[parseInt(tglPOProps.substr(5, 2)) - 1];
			const tglPOYear = tglPOProps.substr(0, 4);

			tglPO = `${tglPODate}-${tglPOMonth}-${tglPOYear}`
		} catch (error) {
			tglPO = '1900-01-01';
		}

		return (
			<Card className="m-1 p-4">
				<CardHeader>
					<Row>
						<h5 className='w-25'>
							<span style={fontStyle}>- A S L I -</span>
                		</h5>

						<h5 className='font-weight-bold'>
							<span style={fontStyle}>SURAT PESANAN (SP)</span>
                		</h5>
					</Row>

					<Row className='d-flex justify-content-around align-items-center' >
						<FormGroup row>
							<h3 className='mr-5 font-weight-bold'><span style={fontStyle}>NO:</span></h3>
							<h3 className='font-weight-bold'><span style={fontStyle}>{this.props.OrdLcl_NoPO}</span></h3>
						</FormGroup>
						<FormGroup row>
							<Label className='mr-4 font-weight-bold'><span style={fontStyle}>TGL :</span></Label>
							<Label><span style={fontStyle}>{tglPO}</span></Label>
						</FormGroup>
						<Barcode format='CODE39' height={50} displayValue={false} value={this.props.OrdLcl_NoPO} />
					</Row>
				</CardHeader>

				<CardBody>
					<Row form>
						<Col></Col>
						<Col className='d-flex justify-content-between align-items-center'>
							<Label className='ml-4 font-weight-bold'><span style={fontStyle}>Pengiriman Barang Ke:</span></Label>
							{/* <h1 className='font-weight-bold'>ordlcl_tipe</h1> */}
						</Col>
					</Row>
					<Row form className='d-flex justify-content-between' style={{'height':'225x'}}>
						<Col>
							<Card body outline color='secondary' className='p-3 h-100'>
								<Row form>
									<Col xs={5} md={5}>
										<Label className='w-25 font-weight-bold'><span style={fontStyle}>UP</span></Label>
										<Label><span style={fontStyle}><span className='w-25 mr-3 font-weight-bold'>: </span>Kontak</span></Label>
									</Col>
								</Row>

								<Row form>
									<Col>
										<Label className="font-weight-bold"><span style={fontStyle}>KEPADA YTH :</span></Label>
									</Col>
								</Row>

								<Row form>
									<Col>
										<Label className='text-wrap'><span style={fontStyle}>{this.props.Kepada}</span></Label>
									</Col>
								</Row>

								<Row form>
									<Col>
										<Label className='text-wrap'><span style={fontStyle}>{this.props.sup_address}</span></Label>
									</Col>
								</Row>

								<Row form className='d-flex justify-content-between'>
									<Col xs={5} md={5}>
										<Label className="w-25 font-weight-bold"><span style={fontStyle}>TELP</span></Label>
										<Label><span style={fontStyle}><span className='w-25 mr-3 font-weight-bold'>: </span>{this.props.consup}</span></Label>
										<Label><span style={fontStyle}></span></Label>
									</Col>
									<Col xs={4} md={4}>
										<Label className="w-25 font-weight-bold"><span style={fontStyle}>TOP</span></Label>
										<Label><span style={fontStyle}><span className='w-25 mr-3 font-weight-bold'>: </span>{this.props.finsup_top}</span></Label>
									</Col>
								</Row>

								<Row form>
									<Col xs={5} md={5}>
										<Label className="w-25 font-weight-bold"><span style={fontStyle}>FAX</span></Label>
										<Label><span style={fontStyle}><span className='w-25 mr-3 font-weight-bold'>: </span></span></Label>
									</Col>
								</Row>
							</Card>
						</Col>
						<Col>
							<Card body outline color='secondary' className='p-3 h-100'>
								<Label className='text-wrap'><span style={fontStyle}>{this.props.NamaGudang}</span></Label>
								<Label className='text-wrap h-100'><span style={fontStyle}>{this.props.OutAddress}</span></Label>
							</Card>
						</Col>
					</Row>
					<div className='my-5'></div>
					<Table bordered size="sm" className="mt-3">
						<thead>
							<tr>
								<th className="text-center"><span style={fontStyle}>NO</span></th>
								<th><span style={fontStyle}>KETERANGAN PRODUK</span></th>
								<th className="text-center"><span style={fontStyle}>KUANTITI</span></th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{this.props.transFD.map((transFD, index) =>
								<tr>
									<td className="text-center"><span style={fontStyle}>{index + 1}</span></td>
									<td><span style={fontStyle}>{transFD.Pro_Name}</span></td>
									<td className="text-center"><span style={fontStyle}>{parseFloat(transFD.TransfD_Qty_Scan).toFixed(2)}</span></td>
									<td className="text-center"><span style={fontStyle}>{transFD.pack_name}</span></td>
								</tr>
							)}
						</tbody>
					</Table>

					<Card className='my-3'></Card>

					<Row className='d-flex justify-content-around mt-5'>
						<Col>
							<Label className='w-100 text-center font-weight-bold'><span style={fontStyle}>Mengetahui</span></Label>
							<div className='my-5' />
							<Label className='mt-5 w-100 text-center'>(<span style={{'textDecorationLine':'underline'}}> ......................................................................................................... </span>)</Label>
						</Col>

						<Col>
							<Label className='w-100 text-center font-weight-bold'><span style={fontStyle}>Pembuat Order</span></Label>
							<div className='my-5' />
							<Label className='mt-5 w-100 text-center'>(<span style={{ 'textDecorationLine': 'underline' }}><span style={fontStyle}> {this.props.ApoOut_Apoteker} </span></span>)</Label>
							<Label className='w-100 text-center'><span style={fontStyle}>Apoteker</span></Label>
							<Label className='w-100 text-center'><span style={fontStyle}><span className='font-weight-bold'>No SIA: </span>{this.props.ApoOut_SIA}</span></Label>
						</Col>
					</Row>
				</CardBody>
			</Card>
		);
	}
}

export default PrintSP;

