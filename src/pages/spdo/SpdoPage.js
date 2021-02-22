import Page from 'components/Page';
import React from 'react';
import * as urlLink from 'pages/urlLink';
import QRCode from 'qrcode.react';
import ReactToPrint from 'react-to-print';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	CardDeck,
	CardTitle,
	CardText,
	Col,
	Collapse,
	Form,
	FormGroup,
	Input,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
	Spinner,
	Table,
	UncontrolledCollapse,
} from 'reactstrap';
import {
	MdAdd,
	MdArrowBack,
	MdArrowUpward,
	MdBorderHorizontal,
	MdClose,
	MdDone,
	MdEdit,
	MdHome,
	MdLocalHospital,
	MdLoyalty,
	MdPrint,
	MdSearch,
	MdStoreMallDirectory,
	MdThumbDown,
} from 'react-icons/md';

import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

import PrintDO from 'pages/spdo/spdo_print_objects/PrintDO';
import PrintPackingList from 'pages/spdo/spdo_print_objects/PrintPackingList';
import PrintSP from 'pages/spdo/spdo_print_objects/PrintSP';
import PrintLabelPlastic from 'pages/spdo/spdo_print_objects/PrintLabelPlastic';
import PrintFaktur from 'pages/spdo/spdo_print_objects/PrintFaktur';
import PrintSHI from 'pages/spdo/spdo_print_objects/PrintSHI';
import { bool } from 'prop-types';

var stompClient = null;

const spdoTypes = ['FLOOR', 'APOTIK'];

var tableListSPOnPage = false;
var detailSPOnPage = false;

var listProcodToSend = [];
var listProcod = [];
var listBarcode = [];
var editBatch_qtyMax = 0;

var resultDetailDOHasLeftover = false;
var resultDetailDOHasRedLeftover = false;

class SpdoPage extends React.Component {
	//special method
	constructor(props) {
		super(props);
		this.state = {
			gID: "",

			spdoType: 0, // 0 untuk FLOOR, 1 untuk Apotik
			listSP: [],
			listDetailDO: [],
			// listDetailDO: [
			// 	{
			// 		transfD_RunningID: 741,
			// 		transfD_OutCodeTransf: "A63",
			// 		transfD_NoTransf: "A63000160",
			// 		transfD_Group: 2,
			// 		transfD_OutCodeSP: "A64",
			// 		transfD_NoSP: "000095",
			// 		transfD_ProCod: "0200850",
			// 		transfD_BatchNumber: "D0E760E",
			// 		transfD_ED: "2022-05-25 00:00:00.0",
			// 		transfD_Qty: 50,
			// 		transfD_Qty_Scan: 40,
			// 		transfD_QtySP: 50,
			// 		transfD_QtyStk: 50,
			// 		transfD_OutCodeOrder: "EUZ",
			// 		transfD_NoOrder: "B002010000071",
			// 		transFD_CategoryProduct: 1,
			// 		transFD_EditYN: "Y",
			// 		transfD_WritingYN: "Y",
			// 		transfD_ActiveYN: "Y",
			// 		transfD_UserID: "200443U",
			// 		transfD_LastUpdate: "2020-10-23 08:16:18",
			// 		transfD_DataAktifYN: "Y",
			// 		transfD_SPID: "2020A63A6421R000095",
			// 		transfD_SalePrice: 0.00,
			// 		transfD_Discount: 0.00
			// 	}
			// ],
			listBatchDetail: [],
			allQtyIsMultiple: [],

			isLoading: false,
			currentDate: new Date(),

			disabledInputScan: true,

			spdoTypeVisible: true, // default: true
			tableListSPVisible: false, // default: false
			detailSPVisible: false, // default: false

			//Search outlet
			modal_outletSearch: false,
			searchOutletList: [],
			searchOutletByCategories: [],
			// searchOutletByCategoryInputValue: 'DANIEL',
			searchOutletByCategoryInputValue: '',

			outcodeDari: '',
			outcode: '',
			noSP: '',
			group: '',
			userID: '',
			outlet: '',
			lapakYN: '',
			paymentMethod: '',

			//Detail SP
			SPID: '',
			noDO: '',
			tglDO: '',

			//Edit Product
			modal_editProduct: false,
			editProd_index: 0,
			editProd_procod: '',
			editProd_prodes: '',
			editProd_batch: '',
			editProd_qtyBatch: 0,
			editProd_qtyScan: 0,
			editProd_qtySP: 0,
			editProd_medunit: 0,
			editProd_qtyInputValue: 0,

			//Login APJ
			modal_loginAPJ: false,
			inputAPJUsernameValue: '',
			inputAPJPasswordValue: '',

			//Edit Batch
			modal_editBatch: false,
			modal_editBatchAddConfirm: false,
			validasi: [],
			batchList: [],
			editBatch_collapseAddIsOpen: false,
			editBatch_collapseEditIsOpen: false,
			editBatch_index: 0,
			editBatch_noDO: '',
			editBatch_outcodeTransf: '',
			editBatch_procod: '',
			editBatch_prodes: '',
			editBatch_ED: '',
			editBatch_noOrder: '',
			editBatch_categoryProduct: '',
			editBatch_batchBaru: '0',
			editBatch_batchLama: '0',
			editBatch_qtyLama: 0,
			editBatch_qtyBaru: 0,
			editBatch_qtySPNew: 0,
			editBatch_qtyDONew: 0,
			editBatch_salePrice: 0,
			editBatch_discount: 0,
			editBatch_medunit: 1,
			editBatch_isMedunitMultiplication: true,
			//Confirm Dialog Add Batch
			editBatch_addInputValue: '',
			editBatch_addConfirmButtonDisabled: true,

			//Scan
			modal_scanQRCode: false,
			scanDisplayInputValue: '',
			scanInputValue: '',
			scanInputDisabled: true,
			qrLink: 'default',

			//Confirm Detail SP
			modal_confirmDetailSP: false,

			//Print Preview
			printPreviewVisible: false,
			transFH: {},
			transFD: [],
			outnameDari: '',
			outaddressDari: '',
			telpDari: '',
			izinDari: '',
			apj: '',
			sika: '',
			npwpDari: '',
			outnameTujuan: '',
			namaOutlet: '',
			outaddressTujuan: '',
			sia: '',
			outsipaapa: '',
			apa: '',
			totalQTY: '',

			OrdLcl_TglPO: '',
		};
		this.searchOutletByCategoryInputInnerRef = React.createRef();
		this.scanDisplayInputRef = React.createRef();
		this.editProd_qtyInputRef = React.createRef();
	}

	//fungsi notification
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
		}, 100);
	};

	setProfileUserIDState = () => {
		let profile = window.localStorage.getItem('profile');
		let gID = window.localStorage.getItem('gID');

		this.setState({
			userID: profile ? JSON.parse(profile).mem_nip : '',
			gID: gID
		});
	};

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

	componentDidMount() {
		var gudangName = window.localStorage.getItem('gName');
		this.props.setTitle('SP DO ' + gudangName, 'red');
		this.setProfileUserIDState();
		console.log("Token:", window.localStorage.getItem('tokenCookies'))

		this.connectWebSocket(this);
		this.getSearchOutletByCategories();

		// Get Print
		// this.getPrintDO()
		// this.getBatchList("0202550", "A63")
		// console.log("Token Cookies:", window.localStorage.getItem("tokenCookies"))
	}

	handleOnChange = event => {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[name + 'Value']: value,
		});
	};

	handleOnChangeInputNoSpecial = event => {
		const name = event.target.name;
		const value = event.target.value;

		this.setState({
			[name + 'Value']: value.replace(/[^\w\s]/gi, '').toUpperCase(),
		});
	};

	//Web Socket
	//---------------------------------------------------------
	connectWebSocket = async context => {
		var sock = new SockJS(urlLink.url_spdoWebSocket);
		stompClient = Stomp.over(sock);
		// stompClient.debug = function () {};
		stompClient.connect(
			{},
			function (frame) {
				// Callback function
				stompClient.subscribe('/deliveryOrder/update', message =>
					context.updateDetailSPOnMessage(message),
				);
				stompClient.subscribe('/deliveryOrder/spUpdate', message =>
					context.updateSPListOnMessage(message),
				);
				stompClient.subscribe('/deliveryOrder/container');
			},
			function (error) {
				// Error function
				setTimeout(() => context.connectWebSocket(context), 5000);
			},
		);
	};

	// Dipanggil ketika ada scan dari apps Android
	updateDetailSPOnMessage = async message => {
		if (message.body) {
			var msg = message.body;
			var splitMsg = msg.split('@');

			var outcode = splitMsg[0];
			var noSP = splitMsg[1];
			var group = splitMsg[2];
			// var userID = splitMsg[3];

			if (
				outcode + '' === this.state.outcode + '' &&
				noSP + '' === this.state.noSP + '' &&
				group + '' === this.state.group + ''
			) {
				this.getDetailSPRefresh(
					this.state.outcodeDari,
					this.state.outcode,
					this.state.noSP,
					this.state.group,
					this.state.userID,
					this.state.lapakYN,
					this.state.paymentMethod,
				);
			}
		}
	};

	// Dipanggil ketika ada colek SP
	updateSPListOnMessage = async message => {
		if (message.body) {
			var outcode = this.state.outcode;
			var userID = this.state.userID;
			this.getSPList(outcode, userID);
		}
	};
	//---------------------------------------------------------

	getProductListToSend = async listProduct => {
		listProcodToSend = [];
		listProduct.map(product => {
			listProcodToSend.push(product.transfD_ProCod);
		});
		this.getProductList();
	};

	getProductList = async () => {
		var url = urlLink.url_getProductList;

		var payload = {
			procodes: listProcodToSend,
		};

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					this.showNotification('Get Data Failed', 'error');
				}
			})
			.then(data => {
				this.putProductList(data.data);
			})
			.catch(error => {
				setTimeout(() => this.getProductList(), 5000);
			});
	};

	putProductList = async products => {
		listProcod = [];
		listBarcode = [];

		try {
			products.map(product => {
				listProcod.push(product['bar_prodcode'].trim());
				listBarcode.push(product['bar_barcode'].trim());
			});
		} catch (error) {
			listProcod = [];
			listBarcode = [];
		}
	};

	buttonHomeClick() {
		tableListSPOnPage = false;
		detailSPOnPage = false;
		this.setState({
			spdoTypeVisible: true,
			tableListSPVisible: false,
			detailSPVisible: false,
			scanInputDisabled: true,
			scanDisplayInputValue: '',
			scanInputValue: '',
			printPreviewVisible: false,

			searchOutletList: [],
		});
	}

	//Fungsi di layar pilih SPDO type
	//---------------------------------------------------------
	buttonSpdoTypeClick(event) {
		this.setState({
			spdoType: event.target.value,
			spdoTypeVisible: false,
		});
	}
	//---------------------------------------------------------

	//Fungsi di layar search Outlet
	//---------------------------------------------------------
	async getSearchOutletByCategories() {
		this.setState({
			isLoading: true,
		});
		var url = urlLink.url_spdoTampilOption;

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					this.showNotification('Get data failed', 'error');
				}
			})
			.then(data => {
				this.setState({
					searchOutletByCategories: data.data,
					searchOutletByCategoryDropdownValue: data.data[0]['CategorySearch'],

					isLoading: false,
				});
			})
			.catch(error => {
				setTimeout(() => this.getSearchOutletByCategories(), 5000);
			});
	}

	handleOpenSearchOutletOnClick() {
		const isOpen = this.state.modal_outletSearch;
		this.setState(
			{
				modal_outletSearch: true,
				// searchOutletByCategoryInputValue: 'DANIEL',
				searchOutletByCategoryInputValue: '',
			},
			() => this.searchOutletByCategoryInputInnerRef.current.focus(),
		);
	}

	searchOutletByCategory = async () => {
		if (this.state.searchOutletByCategoryInputValue !== null) {
			this.setState({ isLoading: true });
			var url = `${urlLink.url_spdoTampilHeader}/${this.state.spdoType}`;
			var payload = {
				category: this.state.searchOutletByCategoryDropdownValue,
				search: this.state.searchOutletByCategoryInputValue,
			};

			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
				},
				json: true,
				body: JSON.stringify(payload),
			})
				.then(response => response.json())
				.then(data => {
					this.setState({
						searchOutletList: data,

						isLoading: false,
					});
				})
				.catch(error => {
					this.showNotification(`Error: ${error.message}`, 'error');
					this.setState({
						isLoading: false,
					});
				});
		}
	};

	searchOutletByCategoryInputOnEnter = event => {
		var code = event.keyCode || event.which;
		if (code === 13) {
			this.searchOutletByCategory();
			this.setState({
				currentPage: 0,
			});
		}
	};

	searchSP(outcode, userID) {
		tableListSPOnPage = true;
		this.setState(
			{
				outcode: outcode,
				userID: userID,
			},
			() => this.getSPList(outcode, userID),
		);
	}

	async getSPList(outcode, userID) {
		if (tableListSPOnPage) {
			detailSPOnPage = false;

			this.setState({
				isLoading: true,
			});

			const url = `${urlLink.url_spdoTampilSP}/${this.state.spdoType}/page?page=0&size=10`;
			const payload = {
				outcode: outcode,
				userid: userID,
				outcodeGudang: this.state.gID,
			};

			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
				},
				json: true,
				body: JSON.stringify(payload),
			})
				.then(response => response.json())
				.then(data => {
					this.setState({
						listSP: data.content,

						tableListSPVisible: true,
						detailSPVisible: false,
						scanInputDisabled: true,
						scanDisplayInputValue: '',
						scanInputValue: '',
						printPreviewVisible: false,

						modal_scanQRCode: false,
						modal_outletSearch: false,

						isLoading: false,
					});
				})
				.catch(error => {
					let tempOutcode = this.state.outcode;
					let tempUserID = this.state.userID;
					setTimeout(() => this.getSPList(tempOutcode, tempUserID), 5000);
				});
		}
	}
	//---------------------------------------------------------

	//Fungsi di layar table SP
	//---------------------------------------------------------
	clickRowSPList(
		SPID,
		outcodeDari,
		outcode,
		noSP,
		group,
		userID,
		outlet,
		lapakYN,
		paymentMethod,
	) {
		this.setState({
			SPID: SPID,
			outcodeDari: outcodeDari,
			outcode: outcode,
			noSP: noSP,
			group: group,
			userID: userID,
			outlet: outlet,
			lapakYN: lapakYN,
			paymentMethod: paymentMethod,
		});
		// this.getProductListToSend(outcode, noSP, group, userID);
		this.getDetailSPFirst(
			SPID,
			outcodeDari,
			outcode,
			noSP,
			group,
			userID,
			lapakYN,
			paymentMethod,
		);
	}

	async getDetailSPFirst(
		SPID,
		outcodeDari,
		outcode,
		noSP,
		group,
		userID,
		lapakYN,
		paymentMethod,
	) {
		tableListSPOnPage = false;

		this.setState({
			isLoading: true,
		});

		var url = urlLink.url_spdoTampilDetailSP;

		var payload = {
			SPID: SPID,
			noSP: noSP,
			group: group,
			outcodeDari: outcodeDari,
			outcode: outcode,
			userID: userID,
			lapakYN: lapakYN,
			paymentMethod: paymentMethod,
		};

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(response => response.json())
			.then(data => {
				var listBatchDetail = this.putDetailSPAsBatchDetail(data.data);
				this.validateAllQtyIsMultiple(data.data, lapakYN);
				this.getProductListToSend(data.data);
				this.setState(
					{
						listDetailDO: data.data,
						listBatchDetail: listBatchDetail,
						validasi: data.validasi,

						tableListSPVisible: false,
						detailSPVisible: true,
						scanInputDisabled: true,
						scanDisplayInputValue: '',
						scanInputValue: '',
						printPreviewVisible: false,

						noDO: '',
						tglDO: '',

						isLoading: false,
					},
					() => this.detailSPLeftoverCheck(),
				);
				detailSPOnPage = true;
			})
			.catch(error => {
				this.showNotification(
					'Terjadi error dengan pesan: ' + error.message,
					'error',
				);
				this.setState({
					tableListSPVisible: true,
					detailSPVisible: false,
					scanInputDisabled: true,
					scanDisplayInputValue: '',
					scanInputValue: '',
					printPreviewVisible: false,

					isLoading: false,
				});

				tableListSPOnPage = true;
				detailSPOnPage = false;

				// var tempSPID = this.state.SPID
				// var tempOutcodeDari = this.state.outcodeDari
				// var tempOutcode = this.state.outcode
				// var tempNoSP = this.state.noSP
				// var tempGroup = this.state.group
				// var tempUserID = this.state.userID
				// var tempOutlet = this.state.outlet
				// var tempLapakYN = this.state.lapakYN
				// var tempPaymentMethod = this.state.paymentMethod
				// setTimeout(() => this.getDetailSPFirst(tempSPID, tempOutcodeDari, tempOutcode, tempNoSP, tempGroup, tempUserID, tempOutlet, tempLapakYN, tempPaymentMethod), 5000);
			});
	}

	async getDetailSPRefresh(
		outcodeDari,
		outcode,
		noSP,
		group,
		userID,
		lapakYN,
		paymentMethod,
	) {
		if (detailSPOnPage) {
			tableListSPOnPage = false;

			this.setState({
				isLoading: true,
			});

			var url = urlLink.url_spdoTampilDetailSPRefresh;

			var payload = {
				SPID: this.state.SPID,
				noSP: noSP,
				group: group,
				outcode: outcode,
				outcodeDari: outcodeDari,
				userID: userID,
				lapakYN: lapakYN,
				paymentMethod: paymentMethod,
			};

			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8',
				},
				json: true,
				body: JSON.stringify(payload),
			})
				.then(response => response.json())
				.then(data => {
					var listBatchDetail = this.putDetailSPAsBatchDetail(data.data);
					this.validateAllQtyIsMultiple(data.data, lapakYN);
					this.getProductListToSend(data.data);
					this.setState(
						{
							listDetailDO: data.data,
							listBatchDetail: listBatchDetail,

							tableListSPVisible: false,
							detailSPVisible: true,
							scanInputDisabled: true,
							scanDisplayInputValue: '',
							scanInputValue: '',
							printPreviewVisible: false,

							isLoading: false,
						},
						() => this.detailSPLeftoverCheck(),
					);
				})
				.catch(error => {
					this.showNotification(
						'Terjadi error dengan pesan: ' + error.message,
						'error',
					);
					this.setState({
						tableListSPVisible: true,
						detailSPVisible: false,
						scanInputDisabled: true,
						scanDisplayInputValue: '',
						scanInputValue: '',
						printPreviewVisible: false,

						isLoading: false,
					});

					tableListSPOnPage = true;
					detailSPOnPage = false;

					// var tempOutcode = this.state.outcode
					// var tempNoSP = this.state.noSP
					// var tempGroup = this.state.group
					// var tempUserID = this.state.userID
					// var tempOutlet = this.state.outlet
					// var tempLapakYN = this.state.lapakYN
					// var tempPaymentMethod = this.state.paymentMethod
					// setTimeout(() => this.getDetailSPFirst(tempOutcode, tempNoSP, tempGroup, tempUserID, tempOutlet, tempLapakYN, tempPaymentMethod), 5000);
				});
		}
	}

	putDetailSPAsBatchDetail(resultDetail) {
		var listBatchDetail = [];

		resultDetail.map(detail => {
			var batchDetail = {
				runningID: detail['transfD_RunningID'], // TESTINGG
				procod: detail['transfD_ProCod'],
				batchNumber: detail['transfD_BatchNumber'],
				qty: detail['transfD_Qty'],
				qty_Scan: detail['transfD_Qty_Scan'],
				price: detail['transfD_SalePrice'], // TESTINGG
				discount: detail['transfD_Discount'], // TESTINGG
			};
			listBatchDetail.push(batchDetail);
		});
		return listBatchDetail;
	}
	//---------------------------------------------------------

	//Fungsi di layar detail SP
	//---------------------------------------------------------
	async detailSPLeftoverCheck() {
		this.state.listDetailDO.map(detailDO => {
			resultDetailDOHasLeftover = false;
			resultDetailDOHasRedLeftover = false;
			var qtySP = detailDO.transfD_QtySP + '';
			qtySP = qtySP.includes('(')
				? qtySP.replace(' ', '').substr(0, qtySP.indexOf('('))
				: qtySP;
			qtySP = parseInt(qtySP);

			if (
				detailDO.transfD_Qty_Scan === 0 ||
				detailDO.transfD_Qty_Scan === null
			) {
				resultDetailDOHasLeftover = true;
				resultDetailDOHasRedLeftover = true;
			} else if (detailDO.transfD_Qty_Scan < qtySP) {
				resultDetailDOHasLeftover = true;
			}
		});
	}

	buttonBackDetailSPClick() {
		tableListSPOnPage = true;
		detailSPOnPage = false;
		this.setState({
			tableListSPVisible: true,
			detailSPVisible: false,
			scanInputDisabled: true,
			scanDisplayInputValue: '',
			scanInputValue: '',
		});
	}

	buttonMoveUpOnClick = index => {
		let listDetailDO = this.state.listDetailDO;
		let listBatchDetail = this.state.listBatchDetail;

		let currentDO = listDetailDO[index];
		let currentBatchDetail = listBatchDetail[index];

		listDetailDO.splice(index, 1);
		listBatchDetail.splice(index, 1);

		listDetailDO.unshift(currentDO);
		listBatchDetail.unshift(currentBatchDetail);

		this.setState({
			listDetailDO: listDetailDO,
			listBatchDetail: listBatchDetail,
		});
	};

	buttonConfirmDetailSPClick() {
// 		let hasDummy = false

// 		this.state.listDetailDO.map(detailDO => {
// 			if (detailDO.transfD_BatchNumber.toUpperCase() === "DUMMY") {
// 				alert("Batch produk tidak boleh ada yang DUMMY")
// 				hasDummy = true
// 			}
// 		})

// 		if (hasDummy) {
// 			return
// 		}

		this.setState({
			modal_confirmDetailSP: true,
		});
	}

	confirmDetailSP() {
		this.showNotification('DO sudah dikirim untuk di-confirm', 'info');
		this.confirmSPQty();
		this.setState({
			modal_confirmDetailSP: false,

			detailSPVisible: false,
			scanInputDisabled: true,
			scanDisplayInputValue: '',
			scanInputValue: '',
		});
	}

	async confirmSPQty() {
		detailSPOnPage = false;

		var url = urlLink.url_spdoUpdateScanBarcode;

		var payload = {
			data: JSON.stringify(this.state.listBatchDetail),
			SPID: this.state.SPID,
			noSP: this.state.noSP,
			group: this.state.group,
			outcode: this.state.outcode,
			userID: this.state.userID,
		};

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
					this.confirmCreateDO();
				} else {
					// setTimeout(this.confirmSPQty(), 5000);
					detailSPOnPage = true;
				}
			})
			.catch(() => {
				// setTimeout(this.confirmSPQty(), 5000);
				detailSPOnPage = true;
			});
	}

	async confirmCreateDO() {
		const isLapak = this.state.lapakYN === 'Y' ? 1 : 0;

		var url = `${urlLink.url_spdoBuatDO}/${isLapak}`;

		var payload = {
			SPID: this.state.SPID,
			noSP: this.state.noSP,
			group: this.state.group,
			outcode: this.state.outcode,
			userID: this.state.userID,
		};
		console.log("confirmCreateDO Payload:", payload)

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
					this.showNotification('DO berhasil di-confirm', 'info');
					this.onConfirmCreateDOSuccess();
				} else {
					// setTimeout(() => this.confirmCreateDO(), 5000);
					this.showNotification('Create DO gagal', 'error');
				}
			})
			.catch(error => {
				// setTimeout(() => this.confirmCreateDO(), 5000);
				this.showNotification(
					'Create DO gagal dengan error: ' + error.message,
					'error',
				);
			});
	}

	async onConfirmCreateDOSuccess() {
		this.setState({
			searchOutletByCategoryDropdownValue: this.state.searchOutletByCategories
				? this.state.searchOutletByCategories[0]['CategorySearch']
				: '',
			searchOutletByCategoryInputValue: '',
			searchOutletList: [],
		});

		if (this.state.lapakYN === 'Y') {
			this.getSPList(this.state.outcode, this.state.userID);
		} else {
			let isAllEmpty = true;
			for (let i = 0; i < this.state.listDetailDO.length; i++) {
				if (this.state.listDetailDO[i].transfD_Qty_Scan > 0) {
					isAllEmpty = false;
					break;
				}
			}
			if (!isAllEmpty) {
				this.getPrintDO();
			}
		}
	}

	btnPrintDOOnClick = () => {
		let urlPrint =
			'https://api.cfu.pharmalink.id/print-pl/generate?noDO=' + this.state.noDO;
		// console.log("urlPrint:", urlPrint)
		window.open(urlPrint);
	};

	async getPrintDO() {
		detailSPOnPage = false;
		this.setState({
			isLoading: true,
			printPreviewVisible: false,
		});

		var url = urlLink.url_spdoPrintDO;

		var payload = {
			SPID: this.state.SPID,
			noSP: this.state.noSP,
			userid: this.state.userID,
			group: this.state.group,
			outcodeDari: this.state.outcodeDari,
			outcodeTujuan: this.state.outcode,
			paymentMethod: this.state.paymentMethod,
		};
		// var payload = {
		// 	SPID: "2020A65A6621M000001",
		// 	noSP: "000001",
		// 	userid: "200364U",
		// 	group: 2,
		// 	outcodeDari: "A65",
		// 	outcodeTujuan: "A66",
		// 	paymentMethod: "AMS"
		// };
		// console.log("Print Payload:", payload)

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(response => response.json())
			.then(data => {
				this.setState({
					currentDate: new Date(),

					noDO: data['transFH'],
					tglDO: data['tglTransf'],
					transFH: data['transFH'],
					transFD: data['transFD'],
					totalBerat: data['totalBerat'],

					outnameDari: data['outnameDari'],
					outaddressDari: data['outaddressDari'],
					telpDari: data['telpDari'],
					ijinDari: data['ijinDari'],
					apj: data['apj'],
					sika: data['sika'],
					npwpDari: data['npwpDari'],

					outnameTujuan: data['outnameTujuan'],
					namaOutlet: data['namaOutlet'],
					outaddressTujuan: data['outaddressTujuan'],
					telpTujuan: data['telpTujuan'],
					ijinTujuan: data['ijinTujuan'],
					apjTujuan: data['apjTujuan'],
					sikaTujuan: data['sikaTujuan'],
					npwpTujuan: data['npwpTujuan'],

					totalQTY: data['totalQTY'],

					pembuat: data['pembuat'],

					THP_NoPL: data['THP_NoPL'],
					THP_TglPL: data['THP_TglPL'],
					THP_NoPOD: data['THP_NoPOD'],
					Out_Code: data['Out_Code'],
					Out_Name: data['Out_Name'],
					THP_DistName: data['THP_DistName'],

					OrdLcl_NoPO: data['OrdLcl_NoPO'],
					OrdLcl_TglPO: data['OrdLcl_TglPO'],
					Kepada: data['Kepada'],
					sup_address: data['sup_address'],
					consup: data['consup'],
					finsup_top: data['finsup_top'],
					NamaGudang: data['NamaGudang'],
					OutAddress: data['OutAddress'],

					ApoOut_Apoteker: data['ApoOut_Apoteker'],
					ApoOut_SIA: data['ApoOut_SIA'],

					KodeOutAMS: data['KodeOutAMS'],
					NamaOut: data['NamaOut'],
					NamaCabsAMS: data['NamaCabsAMS'],
					AlamatCabAMS: data['AlamatCabAMS'],
					NOPL: data['NOPL'],

					FakturPajak: data['FakturPajak'],
					namaPajak: data['namaPajak'],
					alamatPajak: data['alamatPajak'],
					npwpPajak: data['npwpPajak'],
					NoFaktur: data['NoFaktur'],
					DueDate: data['DueDate'],
					subTotal: data['subTotal'],
					totalDiskon: data['totalDiskon'],
					extraDiskon: data['extraDiskon'],
					DPP: data['DPP'],
					totalPPN: data['totalPPN'],
					totalHarga: data['totalHarga'],

					detailSPVisible: false,
					scanInputDisabled: true,
					scanDisplayInputValue: '',
					scanInputValue: '',
					printPreviewVisible: true,

					modal_confirmDetailSP: false,
					isLoading: false,
				});
			})
			.catch(error => {
				this.setState({
					currentDate: new Date(),

					noDO: '',
					tglDO: '1900-01-01',
					transFH: '',
					transFD: [],
					totalBerat: 0,

					outnameDari: '',
					outaddressDari: '',
					telpDari: '',
					ijinDari: '',
					apj: '',
					sika: '',
					npwpDari: '',

					outnameTujuan: '',
					namaOutlet: '',
					outaddressTujuan: '',
					telpTujuan: '',
					ijinTujuan: '',
					apjTujuan: '',
					sikaTujuan: '',
					npwpTujuan: '',

					totalQTY: 0,

					pembuat: '',

					THP_NoPL: '',
					THP_TglPL: '1900-01-01',
					THP_NoPOD: '',
					Out_Code: '',
					Out_Name: '',
					THP_DistName: '',

					OrdLcl_NoPO: '',
					OrdLcl_TglPO: '1900-01-01',
					Kepada: '',
					sup_address: '',
					consup: '',
					finsup_top: '',
					NamaGudang: '',
					OutAddress: '',

					ApoOut_Apoteker: '',
					ApoOut_SIA: '',

					KodeOutAMS: '',
					NamaOut: '',
					NamaCabsAMS: '',
					AlamatCabAMS: '',
					NOPL: '',

					FakturPajak: '',
					namaPajak: '',
					alamatPajak: '',
					npwpPajak: '',
					NoFaktur: '',
					DueDate: '1900-01-01',
					subTotal: 0,
					totalDiskon: 0,
					extraDiskon: 0,
					DPP: '',
					totalPPN: 0,
					totalHarga: 0,

					detailSPVisible: false,
					scanInputDisabled: true,
					scanDisplayInputValue: '',
					scanInputValue: '',
					printPreviewVisible: false,

					modal_confirmDetailSP: false,
					isLoading: false,
				});

				this.showNotification(
					'Terjadi ERROR dengan pesan berikut: ' + error.message,
					'error',
				);
			});
		// .then(() => {
		// 	this.setState({
		// 		detailSPVisible: false,
		// 		scanInputDisabled: true,
		// 		scanDisplayInputValue: '',
		// 		scanInputValue: '',
		// 		printPreviewVisible: true,

		// 		modal_confirmDetailSP: false,
		// 		isLoading: false
		// 	});
		// })
		// .catch(() => {
		// 	this.setState({
		// 		detailSPVisible: false,
		// 		scanInputDisabled: true,
		// 		scanDisplayInputValue: '',
		// 		scanInputValue: '',
		// 		printPreviewVisible: true,

		// 		modal_confirmDetailSP: false,
		// 		isLoading: false
		// 	}, () => this.showNotification("Terjadi error ketika ambil data print dgn error:"));
		// })
	}

	//Edit QTY
	//---------------------------------------------------------
	openEditProductModal(index, procod, prodes, batch, qtyBatch, qtyScan, qtySP) {
		this.setState(
			{
				editProd_index: index,
				editProd_procod: procod,
				editProd_prodes: prodes,
				editProd_batch: batch,
				editProd_qtyBatch: parseInt(qtyBatch),
				editProd_qtyScan: parseInt(qtyScan),
				editProd_qtySP: qtySP,

				editProd_qtyInputValue: parseInt(qtyScan),

				modal_editProduct: true,
			},
			() => this.editProd_qtyInputRef.current.focus(),
		);
	}

	handleEditProductQtyInputOnChange(event) {
		const regEx = /[^0-9]/gi;
		const maxValue = 10; //this.state.editProd_qtyBatch;
		const eventValue = event.target.value;
		var value = parseInt(eventValue.replace(regEx, ''));

		value = value > maxValue ? maxValue : value;

		this.setState({
			editProd_qtyInputValue: value,
		});
	}

	// Save edit product di Frontend
	saveEditProduct(isManualEdit) {
		const index = this.state.editProd_index;
		const value = this.state.editProd_qtyInputValue;
		var listDetailDO = this.state.listDetailDO;
		var listBatchDetail = this.state.listBatchDetail;

		var detailDO = listDetailDO[index];
		detailDO['transfD_Qty_Scan'] = value;
		listDetailDO[index] = detailDO;
		var lapakYN = this.state.lapakYN;
		this.validateAllQtyIsMultiple(listDetailDO, lapakYN);

		var batchDetail = listBatchDetail[index];
		batchDetail['qty_Scan'] = value;
		listBatchDetail[index] = batchDetail;

		this.setState(
			{
				listDetailDO: listDetailDO,
				listBatchDetail: listBatchDetail,

				modal_editProduct: false,
			},
			() => {
				this.detailSPLeftoverCheck();
				if (value === 1 && this.state.group === 2 && !isManualEdit) {
					this.checkFirstScan();
				}
			},
		);
	}
	//---------------------------------------------------------

	handleScanOnClick() {
		const scanInputDisabled = this.state.scanInputDisabled;
		const modal_scanQRCode = this.state.modal_scanQRCode;

		const noSP = this.state.noSP;
		const group = this.state.group;
		const outcode = this.state.outcode;
		const spid = this.state.SPID;

		this.setState(
			{
				scanInputDisabled: !scanInputDisabled,
				scanInputValue: '',
				modal_scanQRCode: !modal_scanQRCode,
				qrLink: `https://barcodescanner/scan?noSP=${noSP}&group=${group}&outcode=${outcode}@SPID=${spid}`,
			},
			() => this.scanDisplayInputRef.current.focus(),
		);
	}

	handleScanInputEnter = event => {
		var code = event.keyCode || event.which;
		if (code === 13) {
			event.preventDefault();
			this.setState(
				{
					scanInputValue: event.target.value,
					scanDisplayInputValue: '',
				},
				() => this.scanInputValidate(),
			);
		}
	};

	scanInputValidate() {
		if (listBarcode.length === 0 || listProcod.length === 0) {
			return;
		}

		const scanInputValue = this.state.scanInputValue;
		if (listBarcode.includes(scanInputValue)) {
			// Munculkan layar konfirmasi "Apakah kode yang di-scan merupakan Barcode (Y/N)"
			// Y => scanInputBarcodeValidate()
			// N => findSatuanProduct()
			this.scanInputBarcodeValidate();
		} else {
			this.findSatuanProduct(scanInputValue);
		}
	}

	scanInputBarcodeValidate() {
		const scanInputValue = this.state.scanInputValue;
		const leftInputValue = scanInputValue.substr(0, 2);
		const leftInputValid = leftInputValue === '00' || leftInputValue === '99';

		// Foxpro
		if (
			scanInputValue.length === 6 ||
			(scanInputValue.length === 8 && leftInputValid)
		) {
			this.findSatuanProduct(scanInputValue);
		}
		// Apakah input adalah procod di list SP
		else if (
			scanInputValue.length === 7 ||
			(scanInputValue.length === 9 && leftInputValid)
		) {
			this.findSatuanProduct(scanInputValue);
		}
		// Apakah input ada dalam list SP
		else {
			// Cari input == Barcode
			// Jk tdk ketemu, cari ulang di list prodBarcode
			// 		Jk ketemu, munculkan pesan "Procod tdk terdpt pada SP"
			// 		Jk tdk ketemu, munculkan pesan "Kode inputan tdk ada dalam
			//   Barcode, ulangi Scan!"

			const index = listBarcode.indexOf(scanInputValue);
			if (index >= 0) {
				let result = this.findSatuanProduct(listProcod[index]);
				if (!result.boolResult) {
					alert(result.errMsg);
				}
			} else {
				alert('Kode inputan tdk ada dalam Master Barcode, ulangi Scan!');
			}
		}
	}

	findSatuanProduct(value) {
		var result = {
			boolResult: false,
			errMsg: '',
		};

		var editProd_index = 0;
		var editProd_qtyInputValue = 0;

		var editProd_procod = '';
		var editProd_batch = '';

		var qtyScan = 0;
		var qtySP = 0;

		result.boolResult = this.state.listDetailDO.some((detailDO, index) => {
			editProd_index = index;
			editProd_qtyInputValue = detailDO.transfD_Qty_Scan;

			editProd_procod = detailDO.transfD_ProCod;
			editProd_batch = detailDO.transfD_BatchNumber;

			qtyScan = detailDO.transfD_Qty_Scan;
			qtySP = parseInt(
				(detailDO.transfD_QtySP + '').includes('(')
					? (detailDO.transfD_QtySP + '')
						.replace(' ', '')
						.substr(0, (detailDO.transfD_QtySP + '').indexOf('('))
					: detailDO.transfD_QtySP + '',
			);

			if (detailDO.transfD_ProCod !== value) {
				result.errMsg = 'Procod tdk terdpt pada SP';
			} else if (qtyScan >= qtySP) {
				result.errMsg = 'Qty Scan sudah melebihi qty SP';
			}

			return detailDO.transfD_ProCod === value && qtyScan < qtySP;
		});

		if (!result.boolResult) {
			return result;
		}

		this.setState(
			{
				editProd_index: editProd_index,
				editProd_qtyInputValue: editProd_qtyInputValue,

				editProd_procod: editProd_procod,
				editProd_batch: editProd_batch,
			},
			() => {
				this.addSatuanProduct();
			},
		);

		return result;
	}

	addSatuanProduct() {
		this.setState(
			{
				editProd_qtyInputValue:
					parseInt(this.state.editProd_qtyInputValue + '') + 1,
			},
			() => this.saveEditProduct(false),
		);
	}

	checkFirstScan = () => {
		const url = urlLink.url_spdoUpdateScan;
		const payload = {
			noSP: this.state.noSP,
			group: this.state.group,
			outcode: this.state.outcode,
			procod: this.state.editProd_procod,
			batch: this.state.editProd_batch,
			userID: this.state.userID,
			runningID: this.state.listBatchDetail[this.state.editProd_index][
				'runningID'
			],
		};
		const option = {
			method: 'PUT',
			json: true,
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
			},
			body: JSON.stringify(payload),
		};
		// console.log("First:", url)
		// console.log("First:", payload)
		// console.log("First:", option)

		fetch(url, option).catch(err => {
			this.showNotification(
				'Terjadi error gagal untuk cek boleh edit atau tidak dengan error: ' +
				err.message,
				'error',
			);
		});
	};

	// Login APJ
	//---------------------------------------------------------
	openLoginAPJModal = () => {
		this.getAPJNIP(this.state.outcodeDari);
		this.setState({
			modal_loginAPJ: true,
		});
	};

	closeLoginAPJModal = () => {
		this.setState({
			modal_loginAPJ: false,
		});
	};

	btnLoginAPJOnClick = () => {
		this.loginAPJ();
	};

	getAPJNIP = async outcode => {
		let url = 'http://10.0.111.27:8080/do/DO/GetAPJ/A63'; // + outcode

		fetch(url)
			.then(response => {
				if (response.ok) {
					return response.json();
				} else {
					this.setState({
						inputAPJUsernameValue: '',
					});
				}
			})
			.then(data => {
				this.setState({
					inputAPJUsernameValue: data.data['nip'],
				});
			})
			.catch(error => {
				this.setState({
					inputAPJUsernameValue: '',
				});
			});
	};

	loginAPJ = async () => {
		// let payload = {
		// 	username: this.state.inputAPJUsernameValue,
		// 	password: this.state.inputAPJPasswordValue
		// }
		let payload = {
			username: 'vilbert',
			password: '123456',
		};

		const option = {
			method: 'POST',
			json: true,
			headers: {
				'Content-Type': 'application/json;charset=UTF-8',
				Authorization: '',
			},
			body: JSON.stringify(payload),
		};

		let data = await fetch(urlLink.url_login, option)
			.then(response => {
				if (response.ok) {
					console.log('loginAPJ ResponseOK:', response);
					return response;
				} else {
					console.log('loginAPJ ResponseElse:', response);
					this.showNotification('Koneksi ke server gagal', 'error');
					return true;
				}
			})
			.catch(err => {
				console.log('loginAPJ ResponseErr:', err);
				this.showNotification('Koneksi ke server gagal!', 'error');
				return true;
			});

		if (data === true) {
			console.log('loginAPJ ResponseData:', data);
			return true;
		}
	};

	// Edit Batch
	//---------------------------------------------------------
	openEditBatchModal(
		productIndex,
		noDO,
		outcodeTransf,
		procod,
		prodes,
		batchLama,
		qtySP,
		ED,
		noOrder,
		categoryProduct,
		medunit,
		salePrice,
		discount,
	) {
		editBatch_qtyMax = 0;
		var leftoverQtyMax = 0;

		this.state.listDetailDO.map((detailDO, index) => {
			if (productIndex !== index && procod === detailDO.transfD_ProCod) {
				leftoverQtyMax += detailDO.transfD_Qty;
			}
		});

		editBatch_qtyMax = this.state.validasi[procod] - leftoverQtyMax;
		editBatch_qtyMax =
			editBatch_qtyMax !== 0 ? editBatch_qtyMax - 1 : editBatch_qtyMax;

		let qtyLamaConverted = qtySP + '';
		qtyLamaConverted = qtyLamaConverted.includes('(')
			? qtyLamaConverted
				.substr(0, qtyLamaConverted.indexOf('('))
				.replace(' ', '')
			: qtyLamaConverted;

		this.getBatchList(procod, this.state.outcodeDari);

		this.setState({
			editBatch_index: productIndex,
			editBatch_noDO: noDO,
			editBatch_outcodeTransf: outcodeTransf,
			editBatch_procod: procod,
			editBatch_prodes: prodes,
			editBatch_batchLama: batchLama,
			editBatch_batchBaru: batchLama,
			editBatch_qtyLama: qtyLamaConverted,
			editBatch_qtyBaru: 0,
			editBatch_salePrice: salePrice,
			editBatch_discount: discount,
			editBatch_ED: ED,
			editBatch_noOrder: noOrder,
			editBatch_categoryProduct: categoryProduct,
			editBatch_medunit: medunit,
			editBatch_isMedunitMultiplication: true,

			modal_editBatch: true,
		});
	}

	closeEditBatchModal() {
		this.setState({
			editBatch_collapseAddIsOpen: false,
			editBatch_collapseEditIsOpen: false,
			modal_editBatch: false,
		});
	}

	getBatchList = (procod, outcodeGudang) => {
		// let url = `${urlLink.url_spdoGetBatchList}&procod=${procod}&outcode=${outcodeGudang}`
		let url = `https://api.cfu.pharmalink.id/gudang-cabang/stock/detail?type=viewBatch&procod=${procod}&outcode=${outcodeGudang}`;
		// let url = `${urlLink.url_spdoGetBatchList}&procod=0202550&outcode=A63`
		console.log(url);
		let req = {
			method: 'GET',
			headers: {
				Authorization: window.localStorage.getItem('tokenCookies'),
				'Content-Type': 'application/json',
			},
		};
		console.log(req);

		fetch(url, req)
			.then(response => {
				console.log('response', response);
				return response.json();
			})
			.then(data => {
				console.log('data', data);
				console.log('data.data', data.data);

				if (data.data) {
					this.setState({
						batchList: data.data,
						editBatch_batchBaru: data.data[0]['stck_batchnumber'],
						editBatch_ED: data.data[0]['stck_expdate']
					});
				}
				else {
					this.setState({
						batchList: [],
						editBatch_batchBaru: "",
						editBatch_ED: ""
					});
				}
			})
			.catch(error => {
				// this.showNotification('Terjadi error dengan pesan: ' + error.message, 'error');
				if (this.state.modal_editBatch) {
					setTimeout(() => { this.getBatchList(procod, outcodeGudang) }, 1000)
				}
			});
	};

	openEditBatchAddConfirmModal() {
		this.setState({
			modal_editBatchAddConfirm: true,
			editBatch_addInputValue: '',
		});
	}

	closeEditBatchAddConfirmModal() {
		this.setState({
			modal_editBatchAddConfirm: false,
			editBatch_addConfirmButtonDisabled: true,
			editBatch_addInputValue: '',
		});
	}

	editBatchAddToggle() {
		const editBatch_collapseAddIsOpen = this.state.editBatch_collapseAddIsOpen;
		this.setState({
			editBatch_batchBaru: this.state.editBatch_batchLama,
			editBatch_qtyBaru: 0,

			editBatch_collapseAddIsOpen: !editBatch_collapseAddIsOpen,
			editBatch_collapseEditIsOpen: false,
		});
	}

	editBatchEditToggle() {
		const editBatch_collapseEditIsOpen = this.state.editBatch_collapseEditIsOpen;
		this.setState({
			editBatch_batchBaru: this.state.editBatch_batchLama,
			editBatch_qtyBaru: 0,

			editBatch_collapseEditIsOpen: !editBatch_collapseEditIsOpen,
			editBatch_collapseAddIsOpen: false,
		});
	}

	handleInputBatchQtySP(event) {
		const regEx = /[^0-9]/gi;
		const value = event.target.value.replace(regEx, '');

		this.setState({
			editBatch_qtySPNew: value,
		});
	}

	handleInputBatchQtyDO(event) {
		const regEx = /[^0-9]/gi;
		const value = event.target.value.replace(regEx, '');

		this.setState({
			editBatch_qtyDONew: value,
		});
	}

	handleInputBatchNewOnChange(event) {
		const regEx = /[^\w\s]/gi;
		const value = event.target.value.replace(regEx, '').toUpperCase();

		this.setState({
			editBatch_batchBaru: value,
		});
	}

	handleInputEditBatchNewOnChange(event) {
		const batch = this.state.batchList[event.target.value];
		const value = batch["stck_batchnumber"]
		const batchED = batch["stck_expdate"] ? batch["stck_expdate"].substr(0, 10) : ""

		console.log(value, batchED, this.state.editBatch_batchLama)

		this.setState({
			editBatch_batchBaru: value,
			editBatch_ED: batchED,
		}, () => console.log("state", this.state.editBatch_batchBaru, this.state.editBatch_ED));
	}

	handleInputBatchQuantityOnChange(event) {
		const regEx = /[^0-9]/gi;
		const eventValue = event.target.value;
		var value = parseInt(eventValue.replace(regEx, ''));
		var medunit = this.state.editBatch_medunit;
		var isMedunitMultiplication = true;

		value = value > editBatch_qtyMax ? editBatch_qtyMax : value;
		isMedunitMultiplication =
			value % medunit === 0 && this.state.lapakYN === 'N';

		this.setState({
			editBatch_qtyBaru: value,
			editBatch_isMedunitMultiplication: isMedunitMultiplication,
		});
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
			isLoading: true,
		});

		let url = urlLink.url_spdoUpdateBatch;

		let payload = {
			SPID: this.state.SPID,
			noSP: this.state.noSP,
			procod: this.state.editBatch_procod,
			batchBaru: this.state.editBatch_batchBaru,
			batchLama: this.state.editBatch_batchLama,
			outcode: this.state.outcode,
			outcodeGudang: this.state.outcodeDari,
			group: this.state.group,
			ED: this.state.editBatch_ED,
			qtyBaru: this.state.editBatch_qtyBaru,
			qtyLama: this.state.editBatch_qtyLama,
			userID: this.state.userID,
		};
		
		fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(() => {
				this.showNotification('Batch berhasil di-edit', 'info');
				this.setState({
					isLoading: false,
				});
			})
			.catch(error => {
				this.showNotification(
					'Gagal di-edit dengan error: ' + error.message,
					'error',
				);
				this.setState({
					isLoading: false,
				});
			});
	}

	editBatchValidateQtyIsBigger = (batchLama, batchBaru, qtyLama, qtyBaru) => {
		if (batchBaru !== batchLama) {
			return 0;
		}

		if (qtyBaru > qtyLama) {
			return 1;
		}

		if (qtyBaru < qtyLama) {
			return -1;
		}

		return 500;
	};

	editBatchAddButtonClick() {
		this.openEditBatchAddConfirmModal();
	}

	async editBatchAdd() {
		this.setState({
			isLoading: true,
		});

		var url = urlLink.url_spdoTambahBatchProcod;

		var payload = {
			noTransf: this.state.editBatch_noDO,
			outcodeTransf: this.state.editBatch_outcodeTransf,
			group: this.state.group,
			outcodeSP: this.state.outcode,
			noSP: this.state.noSP,
			procod: this.state.editBatch_procod,
			batchNumber: this.state.editBatch_batchBaru,
			ED: this.state.editBatch_ED,
			Qty: this.state.editBatch_qtyBaru,
			Qty_Scan: 0,
			QtyStk: this.state.editBatch_qtyBaru,
			outcodeOrder: this.state.outcode,
			noOrder: this.state.editBatch_noOrder,
			categoryProduct: this.state.editBatch_categoryProduct,
			userID: this.state.userID,
			SPID: this.state.SPID,
			price: this.state.editBatch_salePrice,
			discount: this.state.editBatch_discount,

			batchLama: this.state.editBatch_batchLama,
			qtyLama: this.state.editBatch_qtyLama,
			qtyTerbaru:
				parseInt(this.state.editBatch_qtyLama) -
				parseInt(this.state.editBatch_qtyBaru),
		};

		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			json: true,
			body: JSON.stringify(payload),
		})
			.then(() => {
				this.showNotification('Batch berhasil ditambah', 'info');
				this.setState({
					isLoading: false,
				});
			})
			.catch(error => {
				this.showNotification(
					'Batch gagal ditambah dengan error: ' + error.message,
					'error',
				);
				this.setState({
					isLoading: false,
				});
			});
	}

	editBatchAddConfirmButtonClick() {
		this.editBatchAdd();
		this.setState({
			editBatch_collapseAddIsOpen: false,
			editBatch_collapseEditIsOpen: false,
			editBatch_addConfirmButtonDisabled: true,
			modal_editBatch: false,
			modal_editBatchAddConfirm: false,
		});
	}

	editBatchAddCancelButtonClick() {
		this.closeEditBatchAddConfirmModal();
	}

	editBatchAddInputOnChange = event => {
		const value = event.target.value.toUpperCase();
		const addConfirmButtonDisabled = !(
			this.state.editBatch_batchBaru.toUpperCase() + '' ===
			value + ''
		);

		this.setState({
			editBatch_addInputValue: value + '',
			editBatch_addConfirmButtonDisabled: addConfirmButtonDisabled,
		});
	};
	//---------------------------------------------------------

	validateAllQtyIsMultiple(resultDetail, lapakYN) {
		if (lapakYN === 'N') {
			let allQtyIsMultiple = [];

			resultDetail.map(detail => {
				var qtyIsMultiple =
					detail['transfD_Qty_Scan'] % detail['transfD_MedUnit'] === 0;
				allQtyIsMultiple.push(qtyIsMultiple);
			});

			this.setState({
				allQtyIsMultiple: allQtyIsMultiple,
			});
		}
	}

	render() {
		return (
			<Page>
				<Card className="mb-3">
					<NotificationSystem
						dismissible={false}
						ref={notificationSystem =>
							(this.notificationSystem = notificationSystem)
						}
						style={NOTIFICATION_SYSTEM_STYLE}
					/>
					<CardHeader className="d-flex justify-content-between align-items-center">
						<Button
							disabled={this.state.isLoading || this.state.spdoTypeVisible}
							onClick={() => this.handleOpenSearchOutletOnClick()}
						>
							<MdSearch /> Search
            			</Button>

						{/* <Button onClick={() => this.openLoginAPJModal()}>Test APJ</Button> */}
						{/* <Button onClick={() => window.open("https://api.cfu.pharmalink.id/print-pl/generate?noDO=A63000010")}>Test Print</Button> */}

						<h4 className="font-weight-bold">
							SP DO{' '}
							{!this.state.spdoTypeVisible && spdoTypes[this.state.spdoType]}
						</h4>

						<Button
							disabled={this.state.isLoading}
							onClick={() => this.buttonHomeClick()}
						>
							<MdHome /> MAIN MENU
            			</Button>
					</CardHeader>

					<CardBody>
						{
							//Tampilan Pilih SP DO
							this.state.spdoTypeVisible && (
								<div className="d-flex justify-content-center">
									<CardDeck className="w-50">
										<Card body outline color="primary" className="text-center">
											<CardTitle>
												<MdLocalHospital
													style={{ width: '3rem', height: '3rem' }}
												/>
											</CardTitle>
											<CardText>SP DO APOTIK</CardText>
											<Button
												value="1"
												onClick={event => this.buttonSpdoTypeClick(event)}
											>
												PILIH
                      						</Button>
										</Card>
										<Card body outline color="primary" className="text-center">
											<CardTitle>
												<MdStoreMallDirectory
													style={{ width: '3rem', height: '3rem' }}
												/>
											</CardTitle>
											<CardText>SP DO FLOOR</CardText>
											<Button
												value="0"
												onClick={event => this.buttonSpdoTypeClick(event)}
											>
												PILIH
                      						</Button>
										</Card>
									</CardDeck>
								</div>
							)
						}
						{
							//Hint Search
							!this.state.spdoTypeVisible &&
							!this.state.tableListSPVisible &&
							!this.state.detailSPVisible &&
							!this.state.printPreviewVisible && (
								<div className="d-flex justify-content-center">
									<h2>Silahkan lakukan Search terlebih dahulu</h2>
								</div>
							)
						}
						{
							//Tampilan List SP
							this.state.tableListSPVisible && (
								<Form>
									<Table
										// Tabel list SP
										responsive
										hover
										className="mt-3"
									>
										<thead>
											<tr align="center">
												<th className="th-sm">NO SP</th>
												<th className="th-sm">TUJUAN </th>
												<th className="th-sm">TANGGAL</th>
												{/* <th className="th-sm">PIC</th> */}
												<th className="th-sm">FLAG</th>
												<th className="th-sm">FLAG HO</th>
											</tr>
										</thead>
										<tbody>
											{!this.state.isLoading &&
												this.state.listSP.map((spdo, index) => (
													<tr
														key={index}
														style={{ cursor: 'pointer' }}
														tag="button"
														onClick={() =>
															this.clickRowSPList(
																spdo.SPID,
																spdo.outcodeDari,
																spdo.transfH_OutCodeDest,
																spdo.transfH_NoSP,
																spdo.transfH_Group,
																this.state.userID,
																spdo.outlet,
																spdo.lapakYN,
																spdo.transfH_PaymentMethod,
															)
														}
													>
														<td align="center">{spdo.transfH_NoSP}</td>
														<td align="center">{spdo.outlet}</td>
														<td align="center">{spdo.tglSP}</td>
														{/* <td align="center">{spdo.pic}</td> */}
														<td align="center">{spdo.transfH_Flag}</td>
														<td align="center">{spdo.transfH_FlagTrf}</td>
													</tr>
												))}
										</tbody>
									</Table>
									{!this.state.isLoading && this.state.listSP.length === 0 && (
										<Row className="d-flex justify-content-center">
											<Label>Tidak ada data</Label>
										</Row>
									)}
									{this.state.isLoading && (
										<Row className="d-flex justify-content-center">
											<Spinner
												style={{ width: '3rem', height: '3rem' }}
												color="primary"
											/>
										</Row>
									)}
								</Form>
							)
						}
						{
							//Tampilan Detail SP
							this.state.detailSPVisible && (
								<Form>
									<Card outline color="primary">
										{this.state.SPID.substr(12, 1) !== 'R' && (
											<Row
												form
												className="d-flex justify-content-center mt-4 mb-3"
											>
												<Col md={6} xs={6}>
													<InputGroup>
														<InputGroupAddon addonType="prepend">
															<Button
																color="info"
																onClick={() => this.handleScanOnClick()}
															>
																<MdBorderHorizontal /> SCAN QR
                              								</Button>
														</InputGroupAddon>
														<Input
															innerRef={this.scanDisplayInputRef}
															disabled={this.state.isLoading}
															placeholder="Click di sini jika ingin scan"
															name="scanDisplayInput"
															value={this.state.scanDisplayInputValue}
															onKeyPress={event =>
																this.handleScanInputEnter(event)
															}
															onChange={event =>
																this.handleOnChangeInputNoSpecial(event)
															}
														/>
														<InputGroupAddon addonType="append">
															<InputGroupText>
																{this.state.scanInputValue}
															</InputGroupText>
														</InputGroupAddon>
													</InputGroup>
												</Col>
											</Row>
										)}
										{this.state.SPID.substr(12, 1) !== 'R' && (
											<Row form className="d-flex justify-content-center">
												<Label className="font-weight-bold text-danger">
													*Jika ada produk dengan nomor batch yang sama,
                        						</Label>
											</Row>
										)}
										{this.state.SPID.substr(12, 1) !== 'R' && (
											<Row form className="d-flex justify-content-center">
												<Label className="font-weight-bold text-danger">
													Produk urutan paling atas akan di-scan terlebih dahulu
													jika belum penuh
                        						</Label>
											</Row>
										)}
										{this.state.SPID.substr(12, 1) !== 'R' && (
											<Row form className="d-flex justify-content-center">
												<Label className="font-weight-bold text-danger">
													Tekan tombol <MdArrowUpward /> untuk memindahkan
                          							produk ke urutan paling atas
                        						</Label>
											</Row>
										)}
										<Row
											form
											className="mt-4 mb-1 d-flex justify-content-center"
										>
											<Col xs={3} md={3}>
												<Label className="font-weight-bold">NO DO</Label>
												<Input value={this.state.noDO} readOnly />
											</Col>

											<Col xs={3} md={3}>
												<Label className="font-weight-bold">NO SP</Label>
												<Input value={this.state.noSP} readOnly />
											</Col>

											<Col xs={3} md={3}>
												<Label className="font-weight-bold">PRINT</Label>
												<Input value={this.state.Flag} readOnly />
											</Col>
										</Row>
										<Row
											form
											className="mt-1 mb-3 d-flex justify-content-center"
										>
											<Col xs={3} md={3}>
												<Label className="font-weight-bold">TGL DO</Label>
												<Input value={this.state.tglDO} readOnly />
											</Col>

											<Col xs={3} md={3}>
												<Label className="font-weight-bold">OUTLET</Label>
												<Input value={this.state.outlet} readOnly />
											</Col>

											<Col xs={3} md={3}>
												<Label className="font-weight-bold">KOTA</Label>
												<Input value={this.state.out_name} readOnly />
											</Col>
										</Row>
										<Row className="d-flex justify-content-center mt-4 mb-3">
											<Button
												className="mx-3"
												disabled={this.state.isLoading}
												color="success"
												onClick={() => this.buttonConfirmDetailSPClick()}>
												<MdDone /> CONFIRM
                      						</Button>
										</Row>
										{
											// this.state.allQtyIsMultiple.includes(false) &&
											// <Row><Label className='mb-3 w-100 text-center text-danger font-weight-bold'>Qty Scan harus kelipatan MEDUNIT</Label></Row>
										}
									</Card>

									<Table //Tabel detail SP
										className="mt-3 table-sm"
										responsive
										id="selectedColumn"
									>
										<thead>
											<tr align="center">
												{this.state.SPID.substr(12, 1) !== 'R' && <th />}
												<th class="th-sm">PROCOD</th>
												<th class="th-sm">PRODES </th>
												<th class="th-sm">BATCH</th>
												<th class="th-sm">QTY BATCH</th>
												<th class="th-sm">QTY SCAN</th>
												<th class="th-sm">SELLPACK</th>
												<th class="th-sm">QTY SP</th>
												{this.state.SPID.substr(12, 1) !== 'R' && (
													<th class="th-sm">EDIT</th>
												)}
												{this.state.SPID.substr(12, 1) !== 'R' && (
													<th class="th-sm">Action</th>
												)}
											</tr>
										</thead>

										<tbody>
											{this.state.listDetailDO.map((detailDO, index) => (
												<tr
													key={index}
													hover
													className={
														(detailDO.transfD_Qty_Scan ===
															parseInt(
																(detailDO.transfD_QtySP + '').includes('(')
																	? (detailDO.transfD_QtySP + '')
																		.replace(' ', '')
																		.substr(
																			0,
																			(detailDO.transfD_QtySP + '').indexOf(
																				'(',
																			),
																		)
																	: detailDO.transfD_QtySP + '',
															) &&
															'table-success') ||
														(detailDO.transfD_Qty_Scan === 0 &&
															'table-danger') ||
														'table-warning'
													}
												>
													{this.state.SPID.substr(12, 1) !== 'R' && (
														<td>
															{index > 0 && (
																<Button
																	size="sm"
																	disabled={this.state.isLoading}
																	onClick={() =>
																		this.buttonMoveUpOnClick(index)
																	}
																>
																	<MdArrowUpward />
																</Button>
															)}
														</td>
													)}
													<td>
														<Label
															className="d-flex justify-content-center font-weight-bold"
															style={{ color: this.state.colorDetailProcode }}
														>
															{detailDO.transfD_ProCod}
														</Label>
													</td>
													<td align="center">{detailDO.transfD_ProDes}</td>
													<td align="center">{detailDO.transfD_BatchNumber}</td>
													<td align="center">{detailDO.transfD_Qty}</td>
													<td align="center">{detailDO.transfD_Qty_Scan}</td>
													<td align="center">{detailDO.transfD_SellPack}</td>
													<td align="center">{detailDO.transfD_QtySP}</td>
													{this.state.SPID.substr(12, 1) !== 'R' && (
														<td align="center">{detailDO.transfD_Edit}</td>
													)}
													{this.state.SPID.substr(12, 1) !== 'R' && (
														<td align="center">
															{(detailDO.transfD_WritingYN === 'Y' && (
																<Button
																	className=" mx-2"
																	disabled={this.state.isLoading}
																	size="sm"
																	color="warning"
																	onClick={() =>
																		this.openEditProductModal(
																			index,
																			detailDO.transfD_ProCod,
																			detailDO.transfD_ProDes,
																			detailDO.transfD_BatchNumber,
																			detailDO.transfD_Qty,
																			detailDO.transfD_Qty_Scan,
																			detailDO.transfD_QtySP,
																		)
																	}
																>
																	<MdEdit />
																</Button>
															)) || (
																	<Button
																		className="mx-2"
																		disabled
																		color="danger"
																		size="sm"
																	>
																		<MdClose color="#000000" />
																	</Button>
																)}

															<Button
																disabled={this.state.isLoading}
																color="info"
																size="sm"
																onClick={() =>
																	this.openEditBatchModal(
																		index,
																		detailDO.noDO,
																		detailDO.outcodeTransf,
																		detailDO.transfD_ProCod,
																		detailDO.transfD_ProDes,
																		detailDO.transfD_BatchNumber,
																		detailDO.transfD_QtySP,
																		detailDO.transfD_ED,
																		detailDO.transfD_NoOrder,
																		detailDO.transfD_CategoryProduct,
																		detailDO.transfD_MedUnit,
																		detailDO.transfD_SalePrice,
																		detailDO.transfD_Discount,
																	)
																}>
																BATCH
                              								</Button>
														</td>
													)}
												</tr>
											))}
										</tbody>
									</Table>
								</Form>
							)
						}
						{
							// Print Preview
							this.state.printPreviewVisible && (
								<Form>
									<Row className="d-flex justify-content-center">
										<h2>Data sudah dikirim untuk proses print</h2>
									</Row>
									<Row className="d-flex justify-content-center">
										<Button onClick={() => this.btnPrintDOOnClick()}>
											<MdPrint /> PRINT
                    					</Button>
									</Row>
									{false && (
										<div>
											<Row className="d-flex justify-content-center">
												<ReactToPrint
													trigger={() => (
														<Button>
															<MdPrint /> PRINT
														</Button>
													)}
													content={() => this.printPreviewRef}
													onBeforeGetContent={() =>
														this.setState({ isLoading: true })
													}
													onAfterPrint={() =>
														this.setState({ isLoading: false })
													}
												/>
											</Row>
											<PrintPreview
												className="m-5"
												ref={el => (this.printPreviewRef = el)}
												currentDate={this.state.currentDate}
												noDO={this.state.noDO}
												tglDO={this.state.tglDO}
												transFH={this.state.transFH}
												transFD={this.state.transFD}
												// transFD={dummyProducts}
												totalBerat={this.state.totalBerat}
												outnameDari={this.state.outnameDari}
												outaddressDari={this.state.outaddressDari}
												telpDari={this.state.telpDari}
												ijinDari={this.state.ijinDari}
												apj={this.state.apj}
												sika={this.state.sika}
												npwpDari={this.state.npwpDari}
												outnameTujuan={this.state.outnameTujuan}
												namaOutlet={this.state.namaOutlet}
												outaddressTujuan={this.state.outaddressTujuan}
												telpTujuan={this.state.telpTujuan}
												ijinTujuan={this.state.ijinTujuan}
												apjTujuan={this.state.apjTujuan}
												sikaTujuan={this.state.sikaTujuan}
												npwpTujuan={this.state.npwpTujuan}
												totalQTY={this.state.totalQTY}
												pembuat={this.state.pembuat}
												THP_NoPL={this.state.THP_NoPL}
												THP_TglPL={this.state.THP_TglPL}
												THP_NoPOD={this.state.THP_NoPOD}
												Out_Code={this.state.Out_Code}
												Out_Name={this.state.Out_Name}
												THP_DistName={this.state.THP_DistName}
												OrdLcl_NoPO={this.state.OrdLcl_NoPO}
												OrdLcl_TglPO={this.state.OrdLcl_TglPO}
												Kepada={this.state.Kepada}
												sup_address={this.state.sup_address}
												consup={this.state.consup}
												finsup_top={this.state.finsup_top}
												NamaGudang={this.state.NamaGudang}
												OutAddress={this.state.OutAddress}
												ApoOut_Apoteker={this.state.ApoOut_Apoteker}
												ApoOut_SIA={this.state.ApoOut_SIA}
												KodeOutAMS={this.state.KodeOutAMS}
												NamaOut={this.state.NamaOut}
												NamaCabsAMS={this.state.NamaCabsAMS}
												AlamatCabAMS={this.state.AlamatCabAMS}
												NOPL={this.state.NOPL}
												FakturPajak={this.state.FakturPajak}
												namaPajak={this.state.namaPajak}
												alamatPajak={this.state.alamatPajak}
												npwpPajak={this.state.npwpPajak}
												NoFaktur={this.state.NoFaktur}
												DueDate={this.state.DueDate}
												subTotal={this.state.subTotal}
												totalDiskon={this.state.totalDiskon}
												extraDiskon={this.state.extraDiskon}
												DPP={this.state.DPP}
												totalPPN={this.state.totalPPN}
												totalHarga={this.state.totalHarga}
												paymentMethod={this.state.paymentMethod}
											/>
										</div>
									)}
								</Form>
							)
						}
					</CardBody>
				</Card>

				<Modal
					// Modal search outlet
					centered
					isOpen={this.state.modal_outletSearch}
					toggle={this.toggle('outletSearch')}
					className="modal-dialog-scrollable"
					size="lg"
					backdrop="static">
					<ModalHeader>Search Outlet</ModalHeader>
					<ModalBody>
						<Row form>
							<Label md={3}>Search berdasarkan </Label>
							<Col md={3}>
								<Input
									type="select"
									disabled={this.state.isLoading}
									name="searchOutletByCategoryDropdown"
									value={this.state.searchOutletByCategoryDropdownValue}
									onChange={event => this.handleOnChange(event)}>
									{this.state.searchOutletByCategories.map(
										(category, index) => (
											<option
												key={index}
												name={category.CategoryName}
												value={category.CategorySearch}>
												{category.CategoryName}
											</option>
										),
									)}
								</Input>
							</Col>
						</Row>
						<Row form className="mt-4">
							<InputGroup>
								<Input
									type="search"
									autocomplete="off"
									disabled={this.state.isLoading}
									innerRef={this.searchOutletByCategoryInputInnerRef}
									name="searchOutletByCategoryInput"
									value={this.state.searchOutletByCategoryInputValue}
									placeholder="Ketik keyword yang ingin dicari"
									onKeyPress={event =>
										this.searchOutletByCategoryInputOnEnter(event)
									}
									onChange={event => this.handleOnChangeInputNoSpecial(event)}/>
								<InputGroupAddon addonType="append">
									<Button
										disabled={this.state.isLoading}
										onClick={() => this.searchOutletByCategory()}>
										<MdSearch />
									</Button>
								</InputGroupAddon>
							</InputGroup>
						</Row>

						<p
							className={
								(this.state.searchOutletList.length > 0 ? '' : 'd-none') +
								' text-center font-weight-bold mt-3'
							}>
							Pilih Salah Satu !
            			</p>

						<Table
							hover
							className={this.state.searchOutletList.length > 0 ? '' : 'd-none'}>
							<thead>
								<tr align="center">
									<th>CODE</th>
									{/* <th>PIC</th> */}
									<th>OUTLET</th>
								</tr>
							</thead>
							<tbody>
								{this.state.searchOutletList.map((outlist, index) => (
									<tr
										key={index}
										className={this.state.isLoading ? ' d-none ' : ''}
										style={{ cursor: 'pointer' }}
										tag="button"
										name={outlist.outlet}
										value={outlist.OutcodeDest}
										onClick={() => {
											if (!this.state.isLoading)
												this.searchSP(outlist.code, this.state.userID);
										}}>
										<td align="center">{outlist.code}</td>
										{/* <td align="center">{outlist.pic}</td> */}
										<td align="center">{outlist.outlet}</td>
									</tr>
								))}
							</tbody>
						</Table>
						<Row className="d-flex justify-content-center mt-3">
							<Spinner
								style={{ width: '3rem', height: '3rem' }}
								color="primary"
								className={this.state.isLoading ? ' ' : ' d-none '} />
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button
							disabled={this.state.isLoading}
							color="danger"
							onClick={this.toggle('outletSearch')}>
							Cancel
            			</Button>
					</ModalFooter>
				</Modal>

				<Modal
					// Modal QR Code Scan
					centered
					isOpen={this.state.modal_scanQRCode}
					toggle={this.toggle('scanQRCode')}
					backdrop="static">
					<ModalHeader>Scan</ModalHeader>
					<ModalBody>
						<Row>
							<Col>
								<Label>Scan QR Code di bawah dengan Smartphone Anda</Label>
							</Col>
						</Row>
						<Row>
							<Col>
								<a
									href={this.state.qrLink}
									target="_blank"
									className="w-100 d-flex justify-content-center">
									<QRCode size={200} value={this.state.qrLink} />
								</a>
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<Row>
							<Col>
								<Button
									color="danger"
									className="ml-auto"
									onClick={this.toggle('scanQRCode')}>
									Close
                				</Button>
							</Col>
						</Row>
					</ModalFooter>
				</Modal>

				<Modal
					//Modal edit product
					isOpen={this.state.modal_editProduct}
					// isOpen={true}
					className="modal-dialog-scrollable modal-dialog-centered"
					size="lg"
					backdrop="static">
					<ModalHeader>
						<span className="font-weight-bold">Edit Product</span>
					</ModalHeader>
					<ModalBody>
						<Form>
							<FormGroup row>
								<Label md={2}>Product</Label>
								<Col>
									<InputGroup>
										<InputGroupAddon addonType="prepend">
											<InputGroupText>
												{this.state.editProd_procod}
											</InputGroupText>
										</InputGroupAddon>
										<Input readOnly value={this.state.editProd_prodes} />
									</InputGroup>
								</Col>
							</FormGroup>
							<FormGroup row>
								<Label md={2}>QTY SP</Label>
								<Col md={3}>
									<Input readOnly value={this.state.editProd_qtySP} />
								</Col>
								<Label className="ml-auto" md={2}>
									QTY SCAN
                				</Label>
								<Col md={2}>
									<Input
										type="number"
										innerRef={this.editProd_qtyInputRef}
										value={this.state.editProd_qtyInputValue}
										onChange={event =>
											this.handleEditProductQtyInputOnChange(event)
										}
									/>
								</Col>
							</FormGroup>
						</Form>
					</ModalBody>
					<ModalFooter className="d-flex justify-content-">
						<Button
							disabled={this.state.isLoading}
							color="success"
							className="mr-4"
							onClick={() => this.saveEditProduct(true)}>
							<MdDone /> OK
            			</Button>
						<Button
							disabled={this.state.isLoading}
							color="danger"
							onClick={this.toggle('editProduct')}>
							<MdClose /> Cancel
            			</Button>
					</ModalFooter>
				</Modal>

				<Modal
					// Modal login APJ
					isOpen={this.state.modal_loginAPJ}
					className="modal-dialog-centered"
					size="md"
					backdrop="static">
					<ModalHeader toggle={() => this.closeLoginAPJModal()}>
						Login APJ
          			</ModalHeader>
					<ModalBody>
						<Form>
							<FormGroup row>
								<Col>
									<Input
										readOnly
										placeholder="Username"
										value={this.state.inputAPJUsernameValue} />
								</Col>
							</FormGroup>
							<FormGroup row>
								<Col>
									<Input
										type="password"
										name="inputAPJPassword"
										placeholder="Password"
										value={this.state.inputAPJPasswordValue}
										onChange={event => this.handleOnChange(event)}/>
								</Col>
							</FormGroup>
						</Form>
					</ModalBody>
					<ModalFooter className="d-flex justify-content-end">
						<Button
							disabled={this.state.isLoading}
							onClick={() => this.btnLoginAPJOnClick()}>
							Login
            			</Button>
					</ModalFooter>
				</Modal>

				<Modal
					//Modal edit batch
					isOpen={this.state.modal_editBatch}
					className="modal-dialog-scrollable modal-dialog-centered"
					size="lg"
					backdrop="static">
					<ModalHeader>Batch</ModalHeader>
					<ModalBody>
						<Row form className="mt-3">
							<Table>
								<thead>
									<tr align="center">
										<th>PROCOD</th>
										<th>PRODES</th>
										<th>BATCH</th>
										<th>QTY</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									<tr align="center">
										<td>{this.state.editBatch_procod}</td>
										<td>{this.state.editBatch_prodes}</td>
										<td>{this.state.editBatch_batchLama}</td>
										<td>{this.state.editBatch_qtyLama}</td>
										<td>
											<Button
												size="sm"
												className="mr-2"
												onClick={() => this.editBatchAddToggle()}
											>
												<MdAdd /> Tambah
                      						</Button>
											<Button
												color="warning"
												size="sm"
												className="ml-2"
												onClick={() => this.editBatchEditToggle()}
											>
												<MdEdit /> Edit
                      						</Button>
										</td>
									</tr>
								</tbody>
							</Table>
						</Row>
					</ModalBody>
					<Collapse isOpen={this.state.editBatch_collapseAddIsOpen}>
						<ModalBody>
							<Form>
								<Row>
									<h5 className="mb-4 w-100 text-center font-weight-bold">
										Tambah Batch
                  					</h5>
								</Row>
								<Row form className="d-flex justify-content-center">
									<Label>Batch Number:</Label>
								</Row>
								<Row form className="d-flex justify-content-center">
									<Input
										className="w-50 text-center"
										value={this.state.editBatch_batchBaru}
										onChange={event => this.handleInputBatchNewOnChange(event)}
									/>
								</Row>

								<Row form className="mt-4 d-flex justify-content-center">
									<Label>Qty:</Label>
								</Row>
								<Row form className="d-flex justify-content-center">
									<Input
										type="number"
										className="w-50 text-center"
										value={this.state.editBatch_qtyBaru}
										onChange={event =>
											this.handleInputBatchQuantityOnChange(event)
										}
									/>
								</Row>
							</Form>
						</ModalBody>
					</Collapse>
					<Collapse isOpen={this.state.editBatch_collapseEditIsOpen}>
						<ModalBody>
							<Form>
								<Row>
									<h5 className="mb-4 w-100 text-center font-weight-bold">
										Edit Batch
                  					</h5>
								</Row>
								<Row form className="d-flex justify-content-center">
									<Label>Batch Number:</Label>
								</Row>
								<Row form className="d-flex justify-content-center">
									<Input
										type="select"
										disabled={this.state.isLoading || this.state.editBatch_batchBaru.length === 0}
										className="w-50 text-center"
										// value={this.state.editBatch_batchBaru}
										onChange={event => this.handleInputEditBatchNewOnChange(event)}>
										{
											this.state.batchList.length === 0 &&
											<option key={9999} value={0}>No Data</option>
										}
										{
											this.state.batchList.map((batch, index) => (
												<option key={index} value={index}>
													{batch['stck_batchnumber']}
												</option>
											))
										}
									</Input>
								</Row>
							</Form>
						</ModalBody>
					</Collapse>
					<ModalFooter className={'d-flex justify-content-end'}>
						{this.state.editBatch_collapseAddIsOpen && (
							<Button
								disabled={
									this.state.isLoading ||
									this.state.editBatch_qtyBaru === 0 ||
									!this.state.editBatch_isMedunitMultiplication
								}
								color="success"
								onClick={() => this.editBatchAddButtonClick()}
							>
								Add
							</Button>
						)}
						{this.state.editBatch_collapseEditIsOpen && (
							<Button
								disabled={
									this.state.isLoading /*|| this.state.editBatch_qtyBaru === 0*/ ||
									!this.state.editBatch_isMedunitMultiplication ||
									this.state.editBatch_batchBaru.length === 0 ||
									this.state.batchList.length === 0 ||
									this.state.editBatch_batchBaru === this.state.editBatch_batchLama
								}
								color="success"
								onClick={() => {
									this.setState(
										{
											isLoading: true,
										},
										() => this.editBatchSaveButtonClick(),
									);
								}}
							>
								Save
							</Button>
						)}
						<Button
							disabled={this.state.isLoading}
							color="danger"
							onClick={this.toggle('editBatch')}>
							Cancel
            			</Button>
					</ModalFooter>
				</Modal>

				<Modal
					// Modal konfirmasi Tambah Batch
					isOpen={this.state.modal_editBatchAddConfirm}
					className="modal-dialog-scrollable modal-dialog-centered"
					size="lg"
					backdrop="static"
				>
					<ModalHeader>Konfirmasi Tambah Batch</ModalHeader>
					<ModalBody>
						<Row>
							<Col>
								Untuk konfirmasi, tolong masukkan nomor batch{' '}
								<span className="font-weight-bold">
									{this.state.editBatch_batchBaru}
								</span>{' '}
                di bawah lalu tekan tombol Confirm
              </Col>
						</Row>
						<Row className="mt-3">
							<Col>
								<Input
									placeholder="Masukkan nomor batch di sini"
									value={this.state.editBatch_addInputValue}
									onChange={event => this.editBatchAddInputOnChange(event)}
								/>
							</Col>
						</Row>
					</ModalBody>
					<ModalFooter>
						<Button
							color="success"
							disabled={
								this.state.isLoading ||
								this.state.editBatch_addConfirmButtonDisabled
							}
							onClick={() =>
								this.setState(
									{
										isLoading: true,
									},
									() => this.editBatchAddConfirmButtonClick(),
								)
							}
						>
							Confirm
            			</Button>
						<Button
							color="danger"
							onClick={() => this.editBatchAddCancelButtonClick()}
						>
							Cancel
            			</Button>
					</ModalFooter>
				</Modal>

				<Modal
					//Modal confirmation detail SP confirm
					isOpen={this.state.modal_confirmDetailSP}
					className="modal-dialog-scrollable modal-dialog-centered"
					size="lg"
					backdrop="static">
					<ModalHeader>
						<span className="font-weight-bold">Confirm</span>
					</ModalHeader>
					<ModalBody>
						{((resultDetailDOHasLeftover || resultDetailDOHasRedLeftover) &&
							this.state.lapakYN === 'Y' && (
								<p>
									DO ini DO K8 hanya bisa di print 1 kali barang yang tidak
									terlayani tidak bisa dibuat SPLIT DO dan Otomatis Tercancel
								</p>
							)) ||
							(resultDetailDOHasLeftover && (
								<p>Ada QTY DO yang tidak sesuai dengan QTY SP</p>
							))}
						<p>Anda yakin mau print DO?</p>
						{resultDetailDOHasLeftover && (
							<Table //Tabel detail SP
								className="mt-3 table-sm"
								responsive
								id="selectedColumn">
								<thead>
									<tr align="center">
										<th class="th-sm">PROCOD</th>
										<th class="th-sm">PRODES </th>
										<th class="th-sm">BATCH</th>
										<th class="th-sm">QTY SCAN</th>
										<th class="th-sm">QTY SP</th>
									</tr>
								</thead>

								<tbody>
									{this.state.listDetailDO.map(
										(detailDO, index) =>
											detailDO.transfD_Qty_Scan <
											parseInt(
												(detailDO.transfD_QtySP + '').includes('(')
													? (detailDO.transfD_QtySP + '')
														.replace(' ', '')
														.substr(
															0,
															(detailDO.transfD_QtySP + '').indexOf('('),
														)
													: detailDO.transfD_QtySP + '',
											) && (
												<tr
													hover
													key={index}
													className={
														detailDO.transfD_Qty_Scan === 0
															? 'table-danger'
															: 'table-warning'
													}
													tag="button"
												>
													<td align="center">
														<Label
															className="font-weight-bold"
															style={{ color: this.state.colorDetailProcode }}
														>
															{detailDO.transfD_ProCod}
														</Label>
													</td>
													<td align="center">{detailDO.transfD_ProDes}</td>
													<td align="center">{detailDO.transfD_BatchNumber}</td>
													<td align="center">{detailDO.transfD_Qty_Scan}</td>
													<td align="center">{detailDO.transfD_QtySP}</td>
												</tr>
											),
									)}
								</tbody>
							</Table>
						)}
					</ModalBody>
					<ModalFooter>
						<Button color="success" onClick={() => this.confirmDetailSP()}>
							<MdDone /> Ya
            			</Button>
						<Button
							color="danger"
							disabled={this.state.isLoading}
							onClick={this.toggle('confirmDetailSP')}>
							<MdClose /> Tidak
            			</Button>
					</ModalFooter>
				</Modal>
			</Page>
		);
	}
}

class PrintPreview extends React.Component {
	render() {
		const currentDate = this.props.currentDate;
		const lastDocHeight =
			this.props.paymentMethod.toLowerCase() === 'cimb' ? '1600px' : '100%';

		const noDO = this.props.noDO;
		const tglDO = this.props.tglDO;
		const transFH = this.props.transFH;
		const transFD = this.props.transFD;
		const totalBerat = this.props.totalBerat;

		const outnameDari = this.props.outnameDari;
		const outaddressDari = this.props.outaddressDari;
		const telpDari = this.props.telpDari;
		const ijinDari = this.props.ijinDari;
		const apj = this.props.apj;
		const sika = this.props.sika;
		const npwpDari = this.props.npwpDari;

		const outnameTujuan = this.props.outnameTujuan;
		const namaOutlet = this.props.namaOutlet;
		const outaddressTujuan = this.props.outaddressTujuan;
		const telpTujuan = this.props.telpTujuan;
		const ijinTujuan = this.props.ijinTujuan;
		const apjTujuan = this.props.apjTujuan;
		const sikaTujuan = this.props.sikaTujuan;
		const npwpTujuan = this.props.npwpTujuan;

		const totalQTY = this.props.totalQTY;

		const pembuat = this.props.pembuat;

		const THP_NoPL = this.props.THP_NoPL;
		const THP_TglPL = this.props.THP_TglPL;
		const THP_NoPOD = this.props.THP_NoPOD;
		const Out_Code = this.props.Out_Code;
		const Out_Name = this.props.Out_Name;
		const THP_DistName = this.props.THP_DistName;

		const OrdLcl_NoPO = this.props.OrdLcl_NoPO;
		const OrdLcl_TglPO = this.props.OrdLcl_TglPO;
		const Kepada = this.props.Kepada;
		const sup_address = this.props.sup_address;
		const consup = this.props.consup;
		const finsup_top = this.props.finsup_top;
		const NamaGudang = this.props.NamaGudang;
		const OutAddress = this.props.OutAddress;

		const ApoOut_Apoteker = this.props.ApoOut_Apoteker;
		const ApoOut_SIA = this.props.ApoOut_SIA;

		const KodeOutAMS = this.props.KodeOutAMS;
		const NamaOut = this.props.NamaOut;
		const NamaCabsAMS = this.props.NamaCabsAMS;
		const AlamatCabAMS = this.props.AlamatCabAMS;
		const NOPL = this.props.NOPL;

		const FakturPajak = this.props.FakturPajak;
		const namaPajak = this.props.namaPajak;
		const alamatPajak = this.props.alamatPajak;
		const npwpPajak = this.props.npwpPajak;
		const NoFaktur = this.props.NoFaktur;
		const DueDate = this.props.DueDate;
		const subTotal = this.props.subTotal;
		const totalDiskon = this.props.totalDiskon;
		const extraDiskon = this.props.extraDiskon;
		const DPP = this.props.DPP;
		const totalPPN = this.props.totalPPN;
		const totalHarga = this.props.totalHarga;
		const paymentMethod = this.props.paymentMethod;

		return (
			<div className="m-4">
				<div style={{ height: '1600px' }}>
					<PrintPackingList
						currentDate={currentDate}
						noDO={noDO}
						transFD={transFD}
						totalBerat={totalBerat}
						THP_NoPL={THP_NoPL}
						THP_TglPL={THP_TglPL}
						THP_NoPOD={THP_NoPOD}
						Out_Code={Out_Code}
						Out_Name={Out_Name}
						THP_DistName={THP_DistName}
					/>
				</div>

				<div
					style={
						transFD.length > 6 ? { height: '3200px' } : { height: '1600px' }
					}
				>
					<PrintDO
						noDO={noDO}
						tglDO={tglDO}
						transFH={transFH}
						transFD={transFD}
						totalBerat={totalBerat}
						outnameDari={outnameDari}
						outaddressDari={outaddressDari}
						telpDari={telpDari}
						ijinDari={ijinDari}
						apj={apj}
						sika={sika}
						npwpDari={npwpDari}
						namaOutlet={namaOutlet}
						outaddressTujuan={outaddressTujuan}
						telpTujuan={telpTujuan}
						ijinTujuan={ijinTujuan}
						apjTujuan={apjTujuan}
						sikaTujuan={sikaTujuan}
						npwpTujuan={npwpTujuan}
						totalQTY={totalQTY}
						pembuat={pembuat}
					/>
				</div>

				<div style={{ height: '1600px' }}>
					<PrintSP
						OrdLcl_NoPO={OrdLcl_NoPO}
						OrdLcl_TglPO={OrdLcl_TglPO}
						Kepada={Kepada}
						sup_address={sup_address}
						consup={consup}
						finsup_top={finsup_top}
						NamaGudang={NamaGudang}
						pri
						OutAddress={OutAddress}
						transFD={transFD}
						ApoOut_Apoteker={ApoOut_Apoteker}
						ApoOut_SIA={ApoOut_SIA}
					/>
				</div>

				<div style={{ height: lastDocHeight }}>
					<PrintLabelPlastic
						KodeOutAMS={KodeOutAMS}
						NamaOut={NamaOut}
						NamaCabsAMS={NamaCabsAMS}
						AlamatCabAMS={AlamatCabAMS}
						NOPL={NOPL}
					/>
				</div>

				{paymentMethod.toLowerCase() === 'cimb' && (
					<div>
						<PrintFaktur
							FakturPajak={FakturPajak}
							namaPajak={namaPajak}
							alamatPajak={alamatPajak}
							npwpPajak={npwpPajak}
							namaOutlet={namaOutlet}
							outaddressTujuan={outaddressTujuan}
							npwpTujuan={npwpTujuan}
							transFD={transFD}
							NoFaktur={NoFaktur}
							DueDate={DueDate}
							subTotal={subTotal}
							totalDiskon={totalDiskon}
							extraDiskon={extraDiskon}
							DPP={DPP}
							totalPPN={totalPPN}
							totalHarga={totalHarga}
							noDO={noDO}
							paymentMethod={paymentMethod}
							apj={apj}
						/>
					</div>
				)}
			</div>
		);
	}
}

export default SpdoPage;
