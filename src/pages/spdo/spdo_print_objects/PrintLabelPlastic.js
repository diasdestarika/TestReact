import React from 'react';
import Barcode from 'react-barcode';
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

const fontStyle = { 'font-family': 'Courier New' }

class PrintLabelPlastic extends React.Component {

	render() {
		return (
			<Card className="m-1 p-4">
				<CardHeader>
					<Row>
						<Col>
							<Label className='mr-3 font-weight-bold'><span style={fontStyle}><span className='mr-3'>KODE APOTEK AMS</span>:</span></Label>
							<Label><span style={fontStyle}>{this.props.KodeOutAMS}</span></Label>
						</Col>
					</Row>
				</CardHeader>
				<CardBody>
					<Row className='mb-2 d-flex justify-content-center'>
						<Barcode format='CODE39' height={50} displayValue={false} value={this.props.KodeOutAMS} />
					</Row>
					<Row className='mb-4 d-flex justify-content-center'>
						<Label className='font-weight-bold'><span style={fontStyle}>{this.props.NamaOut}</span></Label>
					</Row>
					<Row>
						<Col>
							<Label className="w-25 font-weight-bold"><span style={fontStyle}>CABANG AMS</span></Label>
							<Label><span style={fontStyle}><span className='mr-3 font-weight-bold'> : </span>{this.props.NamaCabsAMS}</span></Label>
						</Col>
					</Row>

					<Row>
						<Col>
							<Label className="w-25 font-weight-bold"><span style={fontStyle}>ALAMAT AMS</span></Label>
							<Label><span style={fontStyle}><span className='mr-3 font-weight-bold'> : </span>{this.props.AlamatCabAMS}</span></Label>
						</Col>
					</Row>
				</CardBody>

				<CardBody>
					<Row>
						<Col>
							<Label className="w-25 font-weight-bold"><span style={fontStyle}>NOMOR PL</span></Label>
							<Label><span style={fontStyle}><span className='mr-3 font-weight-bold'> : </span>{this.props.NOPL}</span></Label>
						</Col>
					</Row>
					{
						false &&
						<Row>
							<Col>
								<Label className="w-25 font-weight-bold"><span style={fontStyle}>CONTAINER</span></Label>
								<Label><span style={fontStyle}><span className='mr-3 font-weight-bold'> : </span>1/10</span></Label>
							</Col>
						</Row>
					}
				</CardBody>
			</Card>
		);
	}
}

export default PrintLabelPlastic;
