import Page from 'components/Page';
import React from 'react';
import {
    Button, Input, Container, Card, CardBody, CardHeader, Col, Row, Form, Table,
    UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, CardFooter,
    Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import {
    MdSave, MdCancel, MdSearch, MdClose, MdPrint, MdEdit
} from 'react-icons/md';
import 'react-tabs/style/react-tabs.css';
import axios from 'axios'
import { Digital } from 'react-activity';
import { url_refund } from '../urlLink'
import Axios from 'axios'
const types = [
    { value: '1', label: 'NO DO' },
    { value: '2', label: 'NO PL' },
    { value: '3', label: 'NO TRANNO' },
    { value: '4', label: 'ORDER ID' },
];
class Refund extends React.Component {
    constructor(props) {

        super(props)
        this.state = {
            displayTabs: "block",

            // resultListProductHeader: [
            //     {
            //         "Fak_NoFaktur": "FD561440",
            //         "Fak_TglFaktur": "2020-06-28 00:00:00",
            //         "Fak_FakturPajak": "010.006-20.31217619",
            //         "Fak_Penjual": "PT. CENTURY FRANCHISINDO UTAMA",
            //         "Fak_Alamat_Penjual": "JL. LIMO NO 40, GROGOL SELATAN KEBAYORAN LAMA JAKARTA SELATAN DKI JAKARTA RAYA",
            //         "Fak_NPWP_Penjual": "01.640.177.0-013.000",
            //         "Fak_Pembeli": "ANTARMITRA SEMBADA, PT",
            //         "Fak_Alamat_Pembeli": "JL.POS PENGUMBEN RAYA NO.8 RT.005 RW.005 SUKABUMI SELATAN KEBON JERUK JAKARTA BARAT DKI JAKARTA RAYA\r\n",
            //         "Fak_NPWP_Pembeli": "01.345.766.8-062.000",
            //         "Fak_NoDO": "J0193R054207",
            //         "Fak_NoRecv": "941000068552",
            //         "Fak_Total": 3423573,
            //         "Fak_TotDiscOutletValue": 181866,
            //         "Fak_TotDiscExtraValue": 239653,
            //         "Fak_NetValue": 3002055,
            //         "Fak_PPN": 300206,
            //         "Fak_GrandTotal": 3302261,
            //         "Fak_DueDate": "2020-08-27 00:00:00",
            //         "Fak_TypePayment": "Transfer",
            //         "Fak_BankPayment": "BCA",
            //         "Fak_CabBankPayment": "Bca Cab. Permata Hijau",
            //         "Fak_NoRekPayment": "178.302.7775",
            //         "Fak_StatusPrint": "PRINTED",
            //         "Fak_FlagPrint": "ASLI",
            //     }
            // ],
            // resultListProduct: [
            //     {
            //         "Fak_ProCode": "0104115",
            //         "Fak_BatchNo": "ID5617",
            //         "Fak_Product": "CATAFLAM 50MG TAB 50`S",
            //         "Fak_Qty": 2,
            //         "Fak_QtyBonus": 0,
            //         "Fak_HargaSatuan": 282318,
            //         "Fak_Subtotal": 564636,
            //         "Fak_DiskonOutlet": 0,
            //         "Fak_DiskonExtra": 7,
            //         "Fak_DiskonOutletValue": 0,
            //         "Fak_DiskonExtraValue": 39525,
            //         "Fak_Total": 525111
            //     },
            //     {
            //         "Fak_ProCode": "0107320",
            //         "Fak_BatchNo": "D0A510C",
            //         "Fak_Product": "DROVAX 500MG CAP 30`S",
            //         "Fak_Qty": 2,
            //         "Fak_QtyBonus": 0,
            //         "Fak_HargaSatuan": 88000,
            //         "Fak_Subtotal": 176000,
            //         "Fak_DiskonOutlet": 12,
            //         "Fak_DiskonExtra": 7,
            //         "Fak_DiskonOutletValue": 21120,
            //         "Fak_DiskonExtraValue": 12320,
            //         "Fak_Total": 142560
            //     }
            // ],

            displayGroup: "none",
            noDataMessage: "none",
            selectedTabs: 1,
            tampilkanSemuaDataDisplay: "none",
            searchKeyword: '',
            page: 1,
            length: 10,
            maxPage: 1,

            inputID: window.localStorage.getItem('id'),
            inputNamaPartner: window.localStorage.getItem('name'),
            inputPenanggungJawab: window.localStorage.getItem('PJ'),
            inputNOHP: window.localStorage.getItem('HP'),
            inputAlamat: window.localStorage.getItem('Alamat'),
            inputEmail: window.localStorage.getItem('Email'),

            openModalAddProduct: false,
            openModalAddProductInList: false,

            resultoutletproduct: [],
            arrProduct: [],
            pushedArrSave: [],

            responseHeader: '',
            buttonDisabler: true,
            selectedType: '',
            disableFieldSearch: true,
            disableBtnSearch: true,
        };
    }
    // ===========================================================================================================================

    // ======================================================= componentDidMount ======================================================= 
    componentDidMount() {
    };
    // ===========================================================================================================================

    paginationHandler = () => {
        this.searchByType();
    }

    firstPage = () => {
        this.setState({
            page: 1,
        }, () => {
            this.paginationHandler();
        });
    }

    nextPage = () => {
        if (this.state.page < this.state.maxPage) {
            this.setState({
                page: this.state.page + 1,
            }, () => {
                this.paginationHandler();
            });
        }
    }

    previousPage = () => {
        if (this.state.page !== 1) {
            this.setState({
                page: this.state.page - 1,
            }, () => {
                this.paginationHandler();
            });
        }
    }

    lastPage = () => {
        this.setState({
            page: this.state.maxPage,
        }, () => {
            this.paginationHandler();
        });
    }
    // ======================================================= toggleResponseAddProduct ======================================================= 
    toggleResponseAddProduct = () => {
        this.setState({
            pushedArrSave: [],
            addProductButtonIsOpen: !this.state.addProductButtonIsOpen,
        })
    }
    // ===========================================================================================================================
    // ======================================================= toggleOpenEditHeaderModal ======================================================= 
    toggleOpenAddProduct = () => {
        this.setState({
            pushedArrSave: [],
            openModalAddProduct: !this.state.openModalAddProduct
        })
    }
    // ===========================================================================================================================
    // ======================================================= toggleResponseModal ======================================================= 
    toggleResponseModal = () => {
        this.setState({
            responseModalIsOpen: !this.state.responseModalIsOpen,
        })
    }
    // ===========================================================================================================================
    toggleCloseSaveModal = () => {
        this.setState({
            responseModalIsOpen: !this.state.responseModalIsOpen,
            openModalAddProduct: !this.state.openModalAddProduct
        }, () => this.searchByType())
    }
    // ======================================================= limitHandler ======================================================= 
    limitHandler = (evt) => {
        this.setState({
            length: evt.target.value,
            page: 1,
        },
            () => {
                this.searchByType();
            }
        )
    }
    // ===========================================================================================================================

    // ======================================================= showAdd ======================================================= 
    showAdd = () => {
        this.setState({
            value: 1
        });
    }
    // ===========================================================================================================================

    // ======================================================= showDet ======================================================= 
    showDet = (pesanan) => {
        window.localStorage.setItem("id", pesanan.alodokter_order_id)
        window.localStorage.setItem("nama", pesanan.customer.name)
        window.localStorage.setItem("telp", pesanan.customer.phone)
        window.localStorage.setItem("alamat", pesanan.customer.address)
        this.setState({
            activeOrderID: pesanan.alodokter_order_id,
            value: 2
        })
    }
    // ===========================================================================================================================

    // ======================================================= enterpPressed ======================================================= 
    enterPressed = (event, search) => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            event.preventDefault();
            this.setState({ currentPage: 1 }
                , () => {
                    this.searchByType();
                });
        }
    }
    // ===========================================================================================================================


    // ======================================================= searchTypeHandle ======================================================= 
    searchByType = () => {
        if (this.state.searchKeyword === "" || this.state.searchKeyword === null) {
            this.setState({
                page: 1,
                noDataMessage: "none"
            })
            var urlSearchKeyword = '?type=All' + "&selectedType=" + this.state.selectedType
            console.log("urls 1", urlSearchKeyword);
            Axios.get(urlSearchKeyword)
                .then((res) => {
                    if (res.data.error.status === true) {
                        this.setState({
                            noDataMessage: "block"
                        }, () => this.setState({
                            resultListProduct: res.data.data
                        }))
                    }
                    else {
                        this.setState({
                            noDataMessage: "none",
                        }, () => this.setState({
                            resultListProduct: res.data.data
                        }))
                    }

                    // this.setState({
                    //     maxPage: res.data.metadata.max_page
                    // })

                });
        }
        else {
            var urlSearchKeyword = url_refund + '?GET=TranNum' + "&input=" +this.state.searchKeyword
            console.log("urls 2", urlSearchKeyword);
            // if (this.state.searchType === "All") {
                Axios.get(urlSearchKeyword)
                    .then((res) => {
                        if (res.data.error.status === true) {
                            this.setState({
                                noDataMessage: "block"
                            }, () => this.setState({
                                resultListProduct: res.data.data
                            },()=>console.log("", this.state.resultListProduct.sales)))
                        }
                        else {
                            this.setState({
                                noDataMessage: "none",
                            }, () => this.setState({
                                resultListProduct: res.data.data
                            },()=>console.log("",this.state.resultListProduct&& this.state.resultListProduct[0].sales.sale_detail[0].sale_qty)))
                        }

                        // this.setState({
                        //     maxPage: res.data.metadata.max_page
                        // })

                    });
            // }
        }
    };

    // ===========================================================================================================================

    // ======================================================= updateSearchValue ======================================================= 
    updateSearchValue(evt) {
        this.setState({
            searchKeyword: (evt.target.value).trim()
        });

        if (evt.target.value.length === '' && evt.target.value.length === null && evt.target.value.length.length === 0) {
            this.setState({
                validkeyword: false
            }, () => this.validateFieldInput());
        } else {
            this.setState({
                validkeyword: true
            }, () => this.validateFieldInput())
        }
    }
    // ===========================================================================================================================

    // ======================================================= Company ======================================================= 
    dropdownSelected(type, event) {
        if (type === "tipe") {
            this.setState({
                selectedType: event.target.value,
                validTypes: true,
            }, () => this.validateFieldInput())
        }
    }
    // ===========================================================================================================================


    // ======================================================= UpdateInputTable ======================================================= 
    UpdateInputTable(evt, field, field2, name) {
        let Point = {};
        if (name === "current") {
            Point = { ...this.state.currentPoint };
        }

        Point[field] = evt.target.value.substr(0, 1);
        Point[field2] = evt.target.value.substr(2, evt.target.value.length);
        this.setState({
            [`${name}Point`]: Point,
            ids: evt.target.value.substr(0, 1),
            names: evt.target.value.substr(2, evt.target.value.length)
        }, () => this.validateField(field, field2));
    }
    // ===========================================================================================================================

    // ======================================================= updatePointTabel ======================================================= 
    updatePointTabel = (todo) => (event) => {
        this.setState(prevState => ({
            result: [...prevState.result, todo],
            addConfirmationDetailButtonIsOpen: false,
            addDetailButtonIsOpen: false,
            disabledButtonHeaderDetail: false,
            disableButtonDetail: true
        }));
        this.resetModal();
    }
    // ===========================================================================================================================


    // ======================================================= postSaveProduct ======================================================= 
    postSaveProduct() {
        var urlSaveProduct = ( 'esPartner?type=saveproduct');
        this.setState({
            isLoading: true
        })
        var listChecked = this.state.resultListProduct.filter((item) => this.state.arrProduct.includes(item.more_details[0][0].pro_code))

        for (var item of listChecked) {
            this.state.pushedArrSave.push({
                Procode: item.more_details[0][0].pro_code,
            }
            )
        }

        var payload = {
            data:
                this.state.pushedArrSave

        }
        console.log("save nih", this.state.pushedArrSave)
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }
        console.log("mantabcuk", { data: this.state.pushedArrSave });
        console.log("payload", option)
        fetch(urlSaveProduct, option)

            .then(response => {
                // console.log("response", response)
                if (response.ok) {
                    this.resetModal()
                    return response.json()
                } else {
                    this.toggleResponseModal()
                }
            }).then(data => {
                this.setState({
                    isLoading: false
                })
                if (data.status === false) {
                    this.setState({
                        responseHeader: "GAGAL MENYIMPAN DATA"
                    })
                } else {
                    this.setState({
                        isLoading: false,
                        responseHeader: "Berhasil",
                        pushedArrSave: [],
                    })
                    this.toggleResponseModal()
                }
            }).catch((error) => {
                this.setState({
                    isLoading: false,
                    responseHeader: "GAGAL MENYIMPAN DATA"
                })
                this.toggleResponseModal()
            });
        this.setState({
            responseHeader: "GAGAL MENYIMPAN DATA"
        }, () => this.resetModal())



    }
    // ===========================================================================================================================
    handleInputChangeList(event) {
        const target = event.target;
        const value = target.value
        const name = target.name
        const type = "checked"
        var tempArr = this.state.arrProduct
        if (target.checked === true && tempArr.filter(item => !item.includes(value))) {
            tempArr.push(value)
            this.setState({
                arrProduct: tempArr,
            }
            // , console.log("logloglog", this.state.arrProduct)
            , () => this.handleChange(type, target.checked)
            )
        }
        if (target.checked === false) {
            tempArr = tempArr.filter(item => !item.includes(value))
            this.setState({
                arrProduct: tempArr,
                type: "unchecked"
            }
            // , console.log("logloglog", this.state.arrProduct)
                , () => this.handleChange(type, target.checked)
                )

        }
    }
    handleAllChecked = (event) => {
        console.log("eventall", event.target.checked);
        var datas = this.state.resultListProduct
        var tempArr = this.state.arrProduct
        const type = "checked"
        const target = event.target;
        if (event.target.checked === true) {
            tempArr = datas.map((product) => { return product.more_details[0][0].pro_code })
            this.setState({
                arrProduct: tempArr,
                isGoing: true
            }
            // , console.log("logloglog", this.state.arrProduct)
            , () => this.handleChange(type, target.checked)
            )
        }
        if (event.target.checked === false) {
            this.setState({
                arrProduct: [],
                type: "unchecked",
                isGoing: false
            }
            // , console.log("logloglog", this.state.arrProduct)
            , () => this.handleChange(type, target.checked)
            )
        }

        this.setState({ datas: datas })
    }
    // ======================================================= handleChange ======================================================= 
    handleChange = (type, event, procode = "default") => {
        if (type === "checked") {
            if (this.state.arrProduct <= []) {
                this.setState({
                    buttonDisabler: true,
                    validChecked: false
                })
            } else {
                this.setState({
                    validChecked: true
                }, () => this.validateFieldInput())
            }

        } else if (type === "unchecked") {
            if (this.state.arrProduct <= []) {
                this.setState({
                    buttonDisabler: true,
                    validChecked: false
                })
            } else {
                this.setState({
                    validChecked: true
                }, () => this.validateFieldInput())
            }

        }
    }
    // ===========================================================================================================================

    // ======================================================= validateFieldInput ======================================================= 
    validateFieldInput = () => {
        // console.log("validTypes ", this.state.validTypes);
        if (this.state.validTypes) {
            this.setState({
                disableFieldSearch: false
            })
        } else {
            this.setState({
                disableFieldSearch: true
            })
        }

        if (this.state.validkeyword) {
            this.setState({ disableBtnSearch: false })
        } else { this.setState({ disableBtnSearch: true }) }

        if (this.state.validChecked
        ) {
            this.setState({
                buttonDisabler: false
            })
        }

        else {
            this.setState({
                buttonDisabler: true
            })
        }
    }
    // ===========================================================================================================================

    resetModal() {
        this.setState({
        })
    }

    render() {
        const { resultListProduct } = this.state;
        return (
            <Page
                title="REFUND">

                {
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <CardHeader className="d-flex justify-content-between">
                                    <Row style={{ width: '100%' }} >
                                        <Col xs={2} style={{ marginBottom: '0px' }}>
                                            <select className="custom-select"
                                                onChange={evt => this.dropdownSelected("tipe", evt)}
                                                style={{
                                                    width: "100%",
                                                    marginRight: "5%",
                                                }}>

                                                <option value="" disabled selected>PILIH TYPE</option>
                                                {types.map(opt =>
                                                    <option value={opt.value}>{opt.label}</option>
                                                )}

                                            </select>
                                        </Col>

                                        <Col xs={7} style={{ paddingRight: '0px', marginBottom: '0px', marginLeft: '1%' }}>
                                            <Input
                                                disabled={this.state.disableFieldSearch}
                                                onKeyPress={(e) => this.enterPressed(e, false)}
                                                type="search"
                                                placeholder="Cari..."
                                                style={{
                                                    width: "100%",
                                                    // display: this.state.tampilkanSemuaDataDisplay,
                                                    marginButton: 15,
                                                    margniTop: 15
                                                }}
                                                onChange={evt => this.updateSearchValue(evt)}

                                            />
                                        </Col>

                                        <Col xs={1} style={{ paddingLeft: '0px', marginLeft: '1%', marginBottom: '0px' }}>
                                            <Button
                                                disabled={this.state.disableBtnSearch}
                                                style={{ float: 'left' }}
                                                id={"searchBtn"}
                                                onClick={() => {
                                                    this.setState({
                                                        page: 1
                                                    },
                                                        () => this.searchByType());
                                                }}
                                                color={"primary"}
                                            >
                                                <MdSearch
                                                />Cari
                                            </Button>
                                        </Col>

                                        <Col style={{ paddingRight: '0px', marginBottom: '0px' }}>
                                            <UncontrolledButtonDropdown
                                                inline
                                                style={{
                                                    color: "white",
                                                    float: "right",
                                                }}
                                            >
                                                <Button>Tampilkan</Button>
                                                <DropdownToggle
                                                    caret
                                                >{this.state.length}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem
                                                        value="10"
                                                        onClick={evt => this.limitHandler(evt)}
                                                    >10
                                            </DropdownItem>
                                                    <DropdownItem
                                                        value="25"
                                                        onClick={evt => this.limitHandler(evt)}
                                                    >25
                                            </DropdownItem>
                                                    <DropdownItem
                                                        value="50"
                                                        onClick={evt => this.limitHandler(evt)}
                                                    >50
                                            </DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledButtonDropdown>
                                        </Col>
                                    </Row>

                                </CardHeader>

                                <CardBody>
                                    <Form>
                                        <Table
                                            responsive
                                            style={{
                                                marginTop: "1%"
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '5%' }}>
                                                        <input type="checkbox" onClick={(e) => this.handleAllChecked(e)} />
                                                    </th>

                                                    <th style={{ width: '20%' }}>
                                                        Procode
                                  </th>
                                                    <th style={{ width: '20%' }}>
                                                        Proname
                                  </th>
                                                    <th style={{ width: '20%' }}>
                                                        QTY
                                  </th>
                                                    <th style={{ width: '20%' }}>
                                                        Satuan
                                  </th>
                                                    <th style={{ width: '20%' }}>
                                                        ACTION
                                  </th>

                                                </tr>
                                            </thead>

                                            <tbody>
                                            {/* this.state.resultListProduct[0].more_details[0][0].pro_code */}
                                                {resultListProduct && resultListProduct.map((item, index) =>
                                                    <tr>
                                                        <td style={{ width: '5%' }}>
                                                            <input
                                                                name={item.more_details[0][0].pro_code}
                                                                type="checkbox"
                                                                checked={this.state.arrProduct.includes(item.more_details[0][0].pro_code)}
                                                                value={item.more_details[0][0].pro_code}
                                                                onChange={(e) => this.handleInputChangeList(e)}></input>
                                                        </td>
                                                        <td style={{ width: '20%' }}>
                                                            {item.more_details[0][0].pro_code}
                                                        </td>
                                                        <td style={{ width: '20%' }}>
                                                            {item.more_details[0][0].pro_name}
                                                        </td>
                                                        <td style={{ width: '20%' }}>
                                                            {item.sales.sale_detail[0].sale_qty}
                                                        </td>
                                                        <td style={{ width: '20%' }}>
                                                            {item.Fak_Qty}
                                                        </td>

                                                        <td style={{ width: '20%' }}>
                                                        <Button
                                                                size="sm"
                                                                style={{ marginRight: '1%' }}
                                                                // onClick={() => this.toDetail(item)}
                                                                onClick={() => alert("Coming Soon")}
                                                                >
                                                                <MdEdit></MdEdit>
                                                            </Button>
                                                     
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Form>
                                </CardBody>
                                {/*======================================================= modal respon header =========================================== */}
                                <Modal
                                    isOpen={this.state.responseModalIsOpen}>

                                    <ModalHeader
                                        toggle={this.toggleResponseModal.bind(this)}
                                    >
                                        {this.state.responseHeader}
                                    </ModalHeader>

                                    {/* <ModalBody>
                                    {this.state.responseHeader}
                                </ModalBody> */}

                                    <ModalFooter>
                                        <Button
                                            color="primary"
                                            onClick={this.toggleCloseSaveModal.bind(this)}

                                        // onClick={this.getListProduct.bind(this)}
                                        >
                                            OK
                  </Button>
                                    </ModalFooter>
                                </Modal>
                                {/*======================================================= modal respon header =========================================== */}

                                {/*======================================================= modal add product =========================================== */}
                                <Modal isOpen={this.state.openModalAddProduct}>
                                    <ModalHeader
                                        toggle={this.toggleOpenAddProduct.bind(this)}>
                                        Konfirmasi Add Product
                </ModalHeader>

                                    <ModalBody>
                                        Apakah Anda yakin ingin menyimpan data ini?
                </ModalBody>
                                    <ModalFooter style={{
                                        display: "inline-block",
                                        textAlign: "right"
                                    }}>
                                        <Button
                                            color="primary"
                                            name="simpan"
                                            onClick={() => this.postSaveProduct()}>
                                            <MdSave style={{ marginRight: "5" }}></MdSave>
                                            Ya
                  </Button>

                                        <Button
                                            color="danger"
                                            onClick={this.toggleOpenAddProduct.bind(this)}>
                                            <MdCancel style={{ marginRight: "5" }}></MdCancel>
                                            Tidak
                  </Button>

                                    </ModalFooter>
                                </Modal>
                                {/*======================================================= modal add product =========================================== */}
                                {/*======================================================= modal loading =========================================== */}
                                <Modal
                                    isOpen={this.state.isLoading}
                                    style={{
                                        position: "relative",
                                        marginTop: "20%",
                                        width: "10%"
                                    }}
                                >

                                    <ModalBody>
                                        <Form
                                            style={{
                                                textAlign: "center",
                                                display: "block",
                                            }}
                                        >
                                            <Digital color="#000000" size={32} speed={1} animating={1} />
                                        </Form>
                                    </ModalBody>

                                </Modal>
                                {/*======================================================= modal loading =========================================== */}

                                <CardFooter>
                                    <Col>
                                        <Form
                                            inline
                                            className="cr-search-form"
                                            onSubmit={e => e.preventDefault()}
                                            style={{
                                                textAlign: "center",
                                                justifyContent: "center",
                                                display: this.state.pagination,
                                            }}>

                                            <Button
                                                color={"dark"}
                                                onClick={this.firstPage.bind(this)}
                                            >
                                                {"<<"}
                                            </Button>

                                            <Button
                                                color={"dark"}
                                                onClick={this.previousPage.bind(this)}
                                            >
                                                {"<"}
                                            </Button>

                                            <Button
                                                disabled
                                                color={"dark"}
                                            >
                                                {this.state.page} / {this.state.maxPage}
                                            </Button>

                                            <Button
                                                color={"dark"}
                                                onClick={this.nextPage.bind(this)}
                                            >
                                                {">"}
                                            </Button>

                                            <Button
                                                color={"dark"}
                                                onClick={this.lastPage.bind(this)}
                                            >
                                                {">>"}
                                            </Button>
                                        </Form>
                                    </Col>
                                    <Col>
                                        <Form
                                            inline
                                            className="cr-search-form"
                                            style={{
                                                textAlign: "center",
                                                justifyContent: "center",
                                                // display: this.state.pagination,
                                            }}>

                                            <Button disabled={this.state.buttonDisabler} color="primary"
                                                // onClick={() => this.toggleOpenAddProduct()}
                                                onClick={() => alert("Coming Soon")}
                                            >
                                                <MdSave
                                                    style={{ marginRight: "8" }}>
                                                </MdSave>Save
                            </Button>
                                            {/* <Button
                                                color="danger"
                                                onClick={this.toggleResponseAddProduct.bind(this)}>
                                                <MdClose
                                                    style={{ marginRight: "8" }}
                                                />Cancel
                             </Button> */}
                                        </Form>
                                    </Col>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                }
            </Page>
        )
    }
}

export default Refund;