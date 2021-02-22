import React from 'react';
import {
	Card,
	CardBody,
	CardHeader,
	Col,
	Form,
	Input,
	InputGroup,
	InputGroupAddon,
	Label,
	Row,
	Table,
	FormGroup,
} from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

class PrintSHI extends React.Component {

	render() {
		return (
			<Card className="m-1 p-4">
				<CardHeader>
					<h5 className='font-weight-bold d-flex justify-content-center'>SURAT HASIL INSPEKSI</h5>
				</CardHeader>
				<CardBody className='px-5'>
					<Row form>
						<Col xs={2} md={2}>
							<Label className='font-weight-bold'>No URUT</Label>
						</Col>
						<Col xs={1} md={1}>
							<Label className='font-weight-bold'>:</Label>
						</Col>
						<Col>
							<Label>Something</Label>
						</Col>
					</Row>

					<Row form>
						<Col xs={2} md={2}>
							<Label className='font-weight-bold'>No CONT</Label>
						</Col>
						<Col xs={1} md={1}>
							<Label className='font-weight-bold'>:</Label>
						</Col>
						<Col>
							<Label>Something</Label>
						</Col>
					</Row>

					<Row form>
						<Col xs={2} md={2}>
							<Label className='font-weight-bold'>BERAT REAL</Label>
						</Col>
						<Col xs={1} md={1}>
							<Label className='font-weight-bold'>:</Label>
						</Col>
						<Col>
							<Label>Something</Label>
						</Col>
					</Row>

					<Row form>
						<Col xs={2} md={2}>
							<Label className='font-weight-bold'>JUMLAH DO</Label>
						</Col>
						<Col xs={1} md={1}>
							<Label className='font-weight-bold'>:</Label>
						</Col>
						<Col>
							<Label>Something</Label>
						</Col>
					</Row>

					<Row>
						<Col className='d-flex justify-content-center'>
							<h1>Y5</h1>
						</Col>
					</Row>
				</CardBody>
        </Card>
		);
	}
}

export default PrintSHI;
