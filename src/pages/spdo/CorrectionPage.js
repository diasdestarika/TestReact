import Page from 'components/Page';
import React from 'react';
import Stomp from 'stompjs';
import { MdLoyalty, MdEdit, MdAdd } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Col,
	Collapse,
	Row,
	Table,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Input,
	Label,
	Form,
	FormGroup,
	Spinner
} from 'reactstrap';

const BACKEND_HOST_URL = 'http://10.0.111.37';
const BACKEND_HOST_PORT = '4444';
const BACKEND_HOST_PREFIX_DO = 'CHCDO/DO';
const BACKEND_WEBSOCKET = 'ws://10.0.111.37:4444';
var stompClient = null;

var editBatch_qtyMax = 0;

const dummyProduct = {
	transfD_ProCod: '191919',
	transfD_ProDes: 'THIS IS A BUCKET',
	transfD_QtySP: 10,
	transfD_Qty: 10,
	transfD_Qty_Scan: 0
};

class CorrectionPage extends React.Component {
	//special method
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			modal: false,

			//Koreksi
			listKoreksiVisible: true,
			listKoreksi: [],
			koreksiDO: {},
			selectedIndex: 0,

			//Product
			listProductVisible: false,
			listProduct: [dummyProduct],
			listBatchDetail: [],

			//Edit Qty
			modal_editQty: false,
			editQtyIndex: 0,
			editQtyTendangValue: 0,
			editQtyNewValue: 0,

			//Edit Batch
			modal_editBatch: false,
			modal_editBatchAddConfirm: false,
			validasi: [],
			editBatch_collapseEditIsOpen: false,
			editBatch_collapseAddIsOpen: false,
			editBatch_index: 0,
			editBatch_procod: '',
			editBatch_prodes: '',
			editBatch_ED: '',
			editBatch_noOrder: '',
			editBatch_categoryProduct: '',
			editBatch_batchLama: '',
			editBatch_batchBaru: '',
			editBatch_qtyLama: 0,
			editBatch_qtyBaru: 0,
			editBatch_qtySPNew: '',
			editBatch_qtyDONew: 0,
			//Confirm Dialog Add Batch
			editBatch_addInputValue: '',
			editBatch_addConfirmButtonDisabled: true,

			//Confirm DO Pending
			modal_confirm: false
		};
	}

	//fungsi notification
	showNotification = currMessage => {
		setTimeout(() => {
			if (!this.notificationSystem) {
				return;
			}
			this.notificationSystem.addNotification({
				title: <MdLoyalty />,
				message: currMessage,
				level: 'info',
			});
		}, 100);
	};

	//fungsi untuk membuka suatu toggle di page tsb
	toggle = modalType => () => {
		if (!modalType) {
			return this.setState({
				modal: !this.state.modal,
			});
		}

		//pembuatan setState disemua function, dimana hanya memanggil nama nya saja ex modal_delete , maka di render hanya panggil delete saja
		this.setState({
			[`modal_${modalType}`]: !this.state[`modal_${modalType}`],
		});
	};

	inputOnChangeNumber(event) {
		const regEx = /[^0-9]/gi;
		const name = event.target.name;
		const value = event.target.value.length > 0 ? parseInt(event.target.value.replace(regEx, "")) : 0;

		this.setState({
			[`${name}Value`]: value
		})
	}

	componentDidMount() { 
		this.getListKoreksi();
		this.connectWebSocket(this);
	}

	connectWebSocket = async (context) => {
		var socket = new WebSocket(`${BACKEND_WEBSOCKET}/CHCDO/scanBarcodeMessage`);
		stompClient = Stomp.over(socket);
		stompClient.connect({},
			function (frame) { // Callback function
				stompClient.subscribe('/deliveryOrder/updatePending', (message) => context.getListProduct());
			},
			function (error) { // Error function
				setTimeout(() => context.connectWebSocket(context), 5000);
			});
	}

	getListKoreksi() {
		this.setState({
			isLoading: true
		});

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/GetDOPending`;
		// console.log(url);

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				else {
					// console.log('Response not OK');
					return [];
				}
			})
			.then(data => {
				console.log(JSON.stringify(data));
				this.setState({
					listKoreksi: data,

					isLoading: false
				});
			})
			.catch(error => {
				console.log('Fetching Koreksi list error:', error.message);
				setTimeout(() => this.getListKoreksi(), 5000);
			})
	}

	getListProduct(index) {
		if (this.state.listProductVisible === false) {
			return;
		}

		var selectedIndex = index ? index : this.state.selectedIndex;

		this.setState({
			isLoading: true,

			listProduct: []
		});

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/GetListProcodPending`;
		console.log(url);

		const koreksiDO = this.state.listKoreksi[selectedIndex];
		var payload = {
			noSP: koreksiDO['noSP'],
			group: koreksiDO['group'],
			outcode: koreksiDO['outcode'],
			noDO: koreksiDO['noDO'],
			SPID: koreksiDO['SPID']
		}

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(response => {
				if (response.ok) {
					return response.json();
				}
				else {
					console.log('Respose not OK');
					return [];
				}
			})
			.then(data => {
				console.log(JSON.stringify(data.data));
				var listBatchDetail = this.putListProductAsBatchDetail(data.data);
				this.setState({
					listProduct: data.data,
					listBatchDetail: listBatchDetail,
					validasi: data.validasi,

					isLoading: false
				});
			})
			.catch(error => {
				console.log('Fetching Product list error: ' + error.message);
				this.getListProduct(selectedIndex);
			})
	}

	putListProductAsBatchDetail(listProduct) {
		var listBatchDetail = [];
		listProduct.map(product => {
			var batchDetail = {
				Procod: product['transfD_ProCod'],
				BatchNumber: product['transfD_BatchNumber'],
				Qty: product['transfD_Qty'],
				Qty_Scan: product['transfD_Qty_Scan']
			}
			listBatchDetail.push(batchDetail);
		})
		return listBatchDetail;
	}

	rowTableClickListKoreksi(index) {
		if(this.state.isLoading) {
			return;
		}
		
		const koreksiDO = this.state.listKoreksi[index];

		this.setState({
			listKoreksiVisible: false,
			listProductVisible: true,

			koreksiDO: koreksiDO,
			selectedIndex: index
		}, () => this.getListProduct(index));
	}

	btnClickBack() {
		this.setState({
			listKoreksiVisible: true,
			listProductVisible: false,
			selectedIndex: 0
		})
	}

	btnClickConfirm() {
		this.setState({
			modal_confirm: true
		})
	}

	btnClickConfirmYes() {
		this.confirmKoreksi();
		this.setState({
			modal_confirm: false
		})
	}

	async confirmSPQty() {
		var data = [];

		this.state.listBatchDetail.map(batchDetail => {
			var qty = parseInt(batchDetail['Qty'] + "") - parseInt(batchDetail['Qty_Scan'] + "");
			var product = {
				procod: batchDetail['Procod'],
				qty: qty,
				gudang: '981',
				depo: '787',
				group: 2
			}
			data.push(product);
		})

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/UpdateScanBarcodePending`;
		console.log(`confirmSPQty: ${url}`);

		var koreksiDO = this.state.koreksiDO;
		var payload = {
			data: JSON.stringify(data),
			SPID: koreksiDO['SPID'],
			noSP: koreksiDO['noSP'],
			group: koreksiDO['group'],
			outcode: koreksiDO['outcode'],
			userID: koreksiDO['userID']
		}
		console.log(JSON.stringify(payload));

		fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(response => {
				if (response.ok) {
					this.confirmKoreksi();
				}
			})
			.catch(() => {
				// setTimeout(this.confirmSPQty(), 5000);
			});
	}

	async confirmKoreksi() {
		// var data = [];
		var noDO = this.state.koreksiDO['noDO'];

		// this.state.listBatchDetail.map(batchDetail => {
		// 	var qty = parseInt(batchDetail['Qty'] + "") - parseInt(batchDetail['Qty_Scan'] + "");
		// 	var product = {
		// 		procod: batchDetail['Procod'],
		// 		qty: qty,
		// 		gudang: '981',
		// 		depo: '787',
		// 		group: 2
		// 	}
		// 	data.push(product);
		// })

		var payload = {
			noDO: noDO
		}

		console.log('ConfirmKoreksi: data: ' + JSON.stringify(payload));
		console.log('ConfirmKoreksi: NoDO: ' + noDO);

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/ConfirmDOPending`;

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(() => {
				this.showNotification('Berhasil di-confirm');
			})
	}

	//Edit Qty
	//------------------------------------------------------------
	editQtyModalOpen(index) {
		const product = this.state.listProduct[index];
		this.setState({
			modal_editQty: true,
			editQtyIndex: index,
			editQtyTendangValue: product['transfD_Qty'],
			editQtyNewValue: product['transfD_Qty_Scan']
		});
	}

	editQtySave() {
		const index = this.state.editQtyIndex;
		var listProduct = this.state.listProduct;
		var listBatchDetail = this.state.listBatchDetail;

		listProduct[index]['transfD_Qty_Scan'] = this.state.editQtyNewValue;
		listBatchDetail[index]['Qty_Scan'] = this.state.editQtyNewValue;
		this.setState({
			listProduct: listProduct,
			listBatchDetail: listBatchDetail,
			modal_editQty: false
		});
	}

	inputOnChangeEditQtyNew(event) {
		const regEx = /[^0-9]/gi;
		const index = this.state.editQtyIndex;
		const product = this.state.listProduct[index];
		var value = event.target.value.length > 0 ? parseInt(event.target.value.replace(regEx, "")) : 0;
		value = value > product['transfD_Qty'] ? product['transfD_Qty'] : value;

		this.setState({
			editQtyNewValue: value
		})
	}
	//------------------------------------------------------------

	//Batch
	//------------------------------------------------------------
	openEditBatchModal(productIndex, procod, prodes, ED, noOrder, categoryProduct, batchLama, qtySP, qtyDO) {
		editBatch_qtyMax = 0;
		var leftoverQtyMax = 0;

		this.state.listProduct.map((product, index) => {
			if (productIndex != index && procod == product.transfD_ProCod) {
				leftoverQtyMax += product.transfD_Qty
			}
		});

		editBatch_qtyMax = this.state.validasi[procod] - leftoverQtyMax;
		console.log(editBatch_qtyMax);

		this.setState({
			editBatch_index: productIndex,
			editBatch_procod: procod,
			editBatch_prodes: prodes,
			editBatch_ED: ED,
			editBatch_noOrder: noOrder,
			editBatch_categoryProduct: categoryProduct,
			editBatch_batchLama: batchLama,
			editBatch_batchBaru: batchLama,
			editBatch_qtyLama: qtySP,
			editBatch_qtyBaru: qtySP,
			editBatch_qtySPNew: batchLama,
			editBatch_qtyDONew: qtyDO,

			modal_editBatch: true,
		});
	}

	closeEditBatchModal() {
		this.setState({
			editBatch_collapseEditIsOpen: false,
			editBatch_collapseAddIsOpen: false,
			modal_editBatch: false
		})
	}

	openEditBatchAddConfirmModal() {
		this.setState({
			modal_editBatchAddConfirm: true,
			editBatch_addInputValue: ''
		});
	}

	closeEditBatchAddConfirmModal() {
		this.setState({
			modal_editBatchAddConfirm: false,
			editBatch_addConfirmButtonDisabled: true,
			editBatch_addInputValue: ''
		});
	}

	editBatchAddToggle() {
		const editBatch_collapseAddIsOpen = this.state.editBatch_collapseAddIsOpen;
		this.setState({
			editBatch_batchBaru: this.state.editBatch_batchLama,
			editBatch_qtyBaru: 0,

			editBatch_collapseAddIsOpen: !editBatch_collapseAddIsOpen,
			editBatch_collapseEditIsOpen: false
		})
	}

	editBatchEditToggle() {
		const editBatch_collapseEditIsOpen = this.state.editBatch_collapseEditIsOpen;
		this.setState({
			editBatch_batchBaru: this.state.editBatch_batchLama,
			editBatch_qtyBaru: 0,

			editBatch_collapseEditIsOpen: !editBatch_collapseEditIsOpen,
			editBatch_collapseAddIsOpen: false
		})
	}

	handleInputBatchQtySP(event) {
		const regEx = /[^\w\s]/gi;
		const value = event.target.value.replace(regEx, "").toUpperCase();

		this.setState({
			editBatch_qtySPNew: value
		})
	}

	handleInputBatchQtyDO(event) {
		const regEx = /[^0-9]/gi;
		const value = event.target.value.replace(regEx, "");

		this.setState({
			editBatch_qtyDONew: value
		})
	}

	handleInputBatchNewOnChange(event) {
		const regEx = /[^\w\s]/gi;
		const value = event.target.value.replace(regEx, "").toUpperCase();

		this.setState({
			editBatch_batchBaru: value
		})
	}

	handleInputBatchQuantityOnChange(event) {
		const regEx = /[^0-9]/gi;
		const eventValue = event.target.value;
		var value = parseInt(eventValue.replace(regEx, ""));

		if (value > editBatch_qtyMax) {
			console.log('MAXED');
		}

		value = value > editBatch_qtyMax && this.state.editBatch_collapseEditIsOpen ? editBatch_qtyMax : value

		this.setState({
			editBatch_qtyBaru: value
		})
	}

	editBatchSaveButtonClick() {
		this.editBatchSave();
		this.setState({
			editBatch_collapseAddIsOpen: false,
			editBatch_collapseEditIsOpen: false,
			modal_editBatch: false,
		});
	}

	async editBatchSave() {

		this.setState({
			isLoading: true
		})

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/UpdateBatchPending`
		console.log(url);

		var koreksiDO = this.state.koreksiDO;
		var payload = {
			SPID: koreksiDO['SPID'],
			noSP: koreksiDO['noSP'],
			procod: this.state.editBatch_procod,
			batchBaru: this.state.editBatch_batchBaru,
			batchLama: this.state.editBatch_batchLama,
			outcode: koreksiDO['outcode'],
			outcodeGudang: koreksiDO['outcodeDari'],
			group: koreksiDO['group'],
			qtyBaru: this.state.editBatch_qtyBaru,
			qtyLama: this.state.editBatch_qtyLama,
			userID: koreksiDO['userID'],
		}

		fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(() => {
				this.showNotification('Batch berhasil di-edit');
				this.setState({
					isLoading: false
				});
			})
	}

	editBatchAddButtonClick() {
		this.openEditBatchAddConfirmModal();
	}

	async editBatchAdd() {

		this.setState({
			isLoading: true
		})

		var url = `${BACKEND_HOST_URL}:${BACKEND_HOST_PORT}/${BACKEND_HOST_PREFIX_DO}/TambahBatchProcodPending`
		console.log(url);

		var koreksiDO = this.state.koreksiDO;

		var payload = {
			noTransf: koreksiDO['noDO'],
			outcodeTransf: koreksiDO['outcodeDari'],
			group: koreksiDO['group'],
			outcodeSP: koreksiDO['outcode'],
			noSP: koreksiDO['noSP'],
			procod: this.state.editBatch_procod,
			batchNumber: this.state.editBatch_batchBaru,
			ED: this.state.editBatch_ED,
			Qty: this.state.editBatch_qtyBaru,
			Qty_Scan: 0,
			QtyStk: this.state.editBatch_qtyBaru,
			outcodeOrder: koreksiDO['outcode'],
			noOrder: this.state.editBatch_noOrder,
			categoryProduct: this.state.editBatch_categoryProduct,
			userID: koreksiDO['userID'],
			SPID: koreksiDO['SPID'],

			batchLama: this.state.editBatch_batchLama,
			qtyLama: this.state.editBatch_qtyLama,
			qtyTerbaru: parseInt(this.state.editBatch_qtyLama) - parseInt(this.state.editBatch_qtyBaru)
		}
		console.log(JSON.stringify(payload));

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(() => {
				this.showNotification('Batch berhasil ditambah');
				this.setState({
					isLoading: false
				});
			})
	}

	editBatchAddConfirmButtonClick() {
		this.editBatchAdd();
		this.setState({
			editBatch_collapseAddIsOpen: false,
			editBatch_collapseEditIsOpen: false,
			editBatch_addConfirmButtonDisabled: true,
			modal_editBatch: false,
			modal_editBatchAddConfirm: false
		});
	}

	editBatchAddCancelButtonClick() {
		this.closeEditBatchAddConfirmModal();
	}

	editBatchAddInputOnChange = (event) => {
		const value = event.target.value.toUpperCase();
		const addConfirmButtonDisabled = this.state.editBatch_batchBaru != value;

		console.log('ADDINPUT: ' + value + ' - ' + addConfirmButtonDisabled)

		this.setState({
			editBatch_addInputValue: value,
			editBatch_addConfirmButtonDisabled: addConfirmButtonDisabled,
		});
	}
	//------------------------------------------------------------

	render() {
		
		return (
			<Page
				title="DO Pending"
				breadcrumbs={[{ name: 'DO Pending', active: true }]}
				className="Program DO">

				<NotificationSystem
					dismissible={false}
					ref={notificationSystem =>
						(this.notificationSystem = notificationSystem)
					}
					style={NOTIFICATION_SYSTEM_STYLE} />

				{
					(this.state.listKoreksiVisible) &&
					<Card>
						<CardBody>
							<Label className='font-weight-bold'>List DO</Label>
							{
								(this.state.listKoreksi.length > 0) &&
								<Form>
									<h3 className='font-weight-bold'>Pilih salah satu</h3>
									<Table
										bordered
										responsive
										hover
										size='sm'>
										<thead >
											<tr align="center">
												<th>No DO</th>
												<th>Outlet</th>
												<th>Tanggal SP</th>
											</tr>
										</thead>
										<tbody>
											{this.state.listKoreksi.map((koreksiDO, index) => (
												<tr
													key={index}
													style={{ cursor: 'pointer' }}
													onClick={() => this.rowTableClickListKoreksi(index)}>
													<td align="center">{koreksiDO['noDO']}</td>
													<td align="center">{koreksiDO['outlet']}</td>
													<td align="center">{koreksiDO['tglSP']}</td>
												</tr>
											))}
										</tbody>
									</Table>
								</Form>
							}
							{
								(this.state.isLoading) &&
								<Row className='d-flex justify-content-center'>
									<Spinner
										style={{ width: '3rem', height: '3rem' }}
										color='primary' />
								</Row>
							}
						</CardBody>
					</Card>
				}
				
				{
					(this.state.listProductVisible) &&
					<Card>
						<CardHeader>
							<Row className='mx-2 mt-2 d-flex justify-content-between align-items-center'>
								<h5 className='font-weight-bold'>{this.state.koreksiDO['noDO']}</h5>
								<Label>{this.state.koreksiDO['tglSP']}</Label>
							</Row>
							<Row className='mx-2 mb-1'>
								<h2 className='font-weight-bold'>{this.state.koreksiDO['outlet']}</h2>
							</Row>
						</CardHeader>

						<CardBody>
							<Label className="font-weight-bold mb-3">LIST PRODUK SP</Label>
							{
								(this.state.listProduct.length > 0) &&
								<Form>
									<Table
										responsive
										bordered
										size='sm'>
										<thead>
											<tr align="center">
												<th>Procode</th>
												<th>Nama Produk</th>
												<th>Batch</th>
												<th>Qty SP</th>
												<th>Qty DO</th>
												<th></th>
											</tr>
										</thead>
										<tbody>
											{this.state.listProduct.map((product, index) => (
												<tr
													key={index}
													className={
														(
															(product['transfD_Qty_Scan'] == product['transfD_QtySP']) &&
															'table-success'
														)
														||
														(
															(product['transfD_Qty_Scan'] == 0) &&
															'table-danger'
														)
														||
														(
															'table-warning'
														)
													}>
													<td align="center">{product['transfD_ProCod']}</td>
													<td align="center">{product['transfD_ProDes']}</td>
													<td align="center">{product['transfD_BatchNumber']}</td>
													<td align="center">{product['transfD_QtySP']}</td>
													<td align="center">{product['transfD_Qty_Scan']}</td>
													<td align="center">
														<Button
															size="sm"
															color='warning'
															className='mr-2'
															onClick={() => this.editQtyModalOpen(index)}>
															<MdEdit color='warning' />
														</Button>
														<Button
															size="sm"
															color='info'
															className='ml-2'
															onClick={() =>
																this.openEditBatchModal(
																	index,
																	product['transfD_ProCod'],
																	product['transfD_ProDes'],
																	product['transfD_ED'],
																	product['transfD_OrderID'],
																	product['transfD_CtgProduct'],
																	product['transfD_BatchNumber'],
																	product['transfD_QtySP'],
																	product['transfD_Qty_Scan']
																)
															}>
															BATCH
														</Button>
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								</Form>
							}
							{
								(this.state.isLoading) &&
								<Row className='d-flex justify-content-center'>
									<Spinner
										style={{ width: '3rem', height: '3rem' }}
										color='primary' />
								</Row>
							}
						</CardBody>

						<CardFooter className='px-5 d-flex justify-content-between'>
							<Button color='danger' onClick={() => this.btnClickBack()}>BACK</Button>
							<Button color='success' onClick={() => this.btnClickConfirm()}>CONFIRM</Button>
						</CardFooter>
					</Card>
				}
				
				<Modal
					isOpen={this.state.modal_editQty}
					className="modal-dialog-centered">
					<ModalHeader toggle={this.toggle('editQty')}>Edit Quantity</ModalHeader>
					<ModalBody>
						<Row className='p-3 d-flex justify-content-between'>
							<Col>
								<Label>Qty Tendang</Label>
								<Input
									readOnly
									className='w-50 text-right'
									value={this.state.editQtyTendangValue} />
							</Col>
							<Col>
								<Label>New Qty</Label>
								<Input
									className='w-50 text-right'
									value={this.state.editQtyNewValue}
									maxLength={6}
									onChange={event => this.inputOnChangeEditQtyNew(event)} />
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button color='danger' onClick={this.toggle('editQty')}>Cancel</Button>
						<Button color='success' onClick={() => this.editQtySave()}>Save</Button>
					</ModalFooter>
				</Modal>

				<Modal
					//Modal batch
					isOpen={this.state.modal_editBatch}
					className="modal-dialog-scrollable modal-dialog-centered"
					size="lg"
					backdrop="static">
					<ModalHeader>Batch</ModalHeader>
					<ModalBody>
						<Row form className="mt-3">
							<Table>
								<thead>
									<tr align='center'>
										<th>PROCOD</th>
										<th>PRODES</th>
										<th>BATCH</th>
										<th>QTY</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr align='center'>
										<td>{this.state.editBatch_procod}</td>
										<td>{this.state.editBatch_prodes}</td>
										<td>{this.state.editBatch_batchLama}</td>
										<td>{this.state.editBatch_qtyLama}</td>
										<td>
											<Button size='sm' className='mr-2' onClick={() => this.editBatchAddToggle()}><MdAdd /> Tambah</Button>
											<Button color='warning' size='sm' className='ml-2' onClick={() => this.editBatchEditToggle()}><MdEdit /> Edit</Button>
										</td>
									</tr>
								</tbody>
							</Table>
						</Row>
					</ModalBody>
					<Collapse isOpen={this.state.editBatch_collapseAddIsOpen}>
						<ModalBody>
							<Form>
								<Row><h5 className='mb-4 w-100 text-center font-weight-bold'>Tambah Batch</h5></Row>
								<Row form className='d-flex justify-content-center'>
									<Label className='w-100 text-center'>Batch Number:</Label>
								</Row>
								<Row form className='d-flex justify-content-center'>
									<Input className='w-50 text-center' value={this.state.editBatch_batchBaru} onChange={event => this.handleInputBatchNewOnChange(event)} />
								</Row>

								<Row form className='d-flex justify-content-center'>
									<Label className='w-100 text-center'>Qty:</Label>
								</Row>
								<Row form className='d-flex justify-content-center'>
									<Input type='number' className='w-50 text-center' value={this.state.editBatch_qtyBaru} onChange={event => this.handleInputBatchQuantityOnChange(event)} />
								</Row>
							</Form>
						</ModalBody>
					</Collapse>
					<Collapse isOpen={this.state.editBatch_collapseEditIsOpen}>
						<ModalBody>
							<Form>
								<Row><h5 className='mb-4 w-100 text-center font-weight-bold'>Edit Batch</h5></Row>
								<Row form className='d-flex justify-content-center'>
									<Label>Batch Number:</Label>
								</Row>
								<Row form className='d-flex justify-content-center'>
									<Input className='w-50 text-center' value={this.state.editBatch_batchBaru} onChange={event => this.handleInputBatchNewOnChange(event)} />
								</Row>

								{/* <Row form className='mt-4 d-flex justify-content-center'>
									<Label>Qty:</Label>
								</Row>
								<Row form className='d-flex justify-content-center'>
									<Input type='number' className='w-50 text-center' value={this.state.editBatch_qtyBaru} onChange={event => this.handleInputBatchQuantityOnChange(event)} />
								</Row> */}
							</Form>
						</ModalBody>
					</Collapse>
					<ModalFooter className={'d-flex justify-content-end'}>
						<Button
							disabled={this.state.isLoading}
							color='danger'
							onClick={() => this.closeEditBatchModal()}>
							Cancel
                		</Button>
						{
							this.state.editBatch_collapseAddIsOpen &&
							<Button
								disabled={this.state.isLoading}
								color='success'
								onClick={() => this.editBatchAddButtonClick()}>
								Add
							</Button>
						}
						{
							this.state.editBatch_collapseEditIsOpen &&
							<Button
								disabled={this.state.isLoading}
								color='success'
								onClick={() => this.editBatchSaveButtonClick()}>
								Save
							</Button>
						}
					</ModalFooter>
				</Modal>

				<Modal
					// Modal konfirmasi Tambah Batch
					isOpen={this.state.modal_editBatchAddConfirm}
					className="modal-dialog-scrollable modal-dialog-centered"
					size='lg'
					backdrop="static">
					<ModalHeader>Konfirmasi Tambah Batch</ModalHeader>
					<ModalBody>
						<Row>
							<Col>
								Untuk konfirmasi, tolong masukkan nomor batch <span className='font-weight-bold'>{this.state.editBatch_batchBaru}</span> di bawah lalu tekan tombol Confirm
							</Col>
						</Row>
						<Row className='mt-3'>
							<Col>
								<Input placeholder='Masukkan nomor batch di sini' value={this.state.editBatch_addInputValue} onChange={(event) => this.editBatchAddInputOnChange(event)} />
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button color='success' disabled={this.state.isLoading || this.state.editBatch_addConfirmButtonDisabled} onClick={() => this.editBatchAddConfirmButtonClick()}>Confirm</Button>
						<Button color='danger' onClick={() => this.editBatchAddCancelButtonClick()}>Cancel</Button>
					</ModalFooter>
				</Modal>

				<Modal
					isOpen={this.state.modal_confirm}
					className="modal-dialog-centered">
					<ModalHeader toggle={this.toggle('confirm')}>Confirm</ModalHeader>
					<ModalBody>
						<p>Yakin ingin Confirm?</p>
					</ModalBody>
					<ModalFooter>
						<Button color='danger' onClick={this.toggle('confirm')}>Tidak</Button>
						<Button color='success' onClick={() => this.btnClickConfirmYes()}>Ya</Button>
					</ModalFooter>
				</Modal>

			</Page>
		);
	}
}
export default CorrectionPage;
