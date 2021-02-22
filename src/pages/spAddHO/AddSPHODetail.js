import Page from 'components/Page';
import React, { Component } from 'react';
import * as myUrl from '../urlLinkMasterG';

import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, InputGroup, FormGroup, FormFeedback,
    InputGroupAddon, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown, Spinner, ButtonGroup, Collapse
} from 'reactstrap';
import {
    MdHighlightOff,
    MdCheckCircle,
    MdSearch,
    MdEdit,
    MdDetails,
    MdArrowBack,
    MdPrint,
    MdSave,
    MdClose,
    MdAdd,
} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import SPAddHO from './SPAddHO';
import Select from 'react-select';
import LoadingSpinner from '../LoadingSpinner';
import Axios from 'axios'
import { base_url_all } from '../urlLinkMasterG'
import * as myUrl2 from '../urlLink';
import { date } from 'faker';
import ClipLoader from "react-spinners/ClipLoader";



const options = [
    { value: '981', label: 'UN' },
    { value: 'A73', label: 'YK' },
];

//state validasi error input
const initialState = {
    procodeAddError: '',
    nameAddError: '',
    batchNumberAddError: '',
    qtyAddError: '',
    qtyDOAddError: '',
    ronaldoAddError: '',
    kategoriAddError: '',
    discAddError: '',
};

class AddSPHODetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            todos: [],
            isLoading: false,
            inputSpNo: '',
            inputSpOutlet: '',
            inputSpType: '',
            inputSpUser: '',
            inputSpTgl: '',
            inputSpVia: '',
            inputSpDilayani: '',
            gIDLogin: window.localStorage.getItem("gID"),
            addSPHODetailButtonIsOpen: false,
            addSPHODetailClose: false,
            saveSPAddHoModalIsIopen: false,
            saveSPAddHoModalIsClose: false,
            responseModalIsOpen: false,
            buttonDisabler: true,
            groupID: window.localStorage.getItem('groupID'),
            currentPage: 1,
            todosPerPage: 5,
            totalData: 0,
            flag: 0,
            currentData: 0,
            lastData: 5,
            selectedOption: null,
            listGroup: [],
            listPurchasingArea: [],
            inputtedGroup: "",
            inputtedPurchasingArea: '',
            displayStatus: "none",
            value: 0,
            currentPoint: {},
            resultProductName: [],
            pro_name: "",
            matchingEd: "",
            matchingQty: "",
            listekspedisi: [],
            listBatch: [],
            AddDetailProcode: [],
            AddDetailName: [],
            AddDetailBatchNumber: [],
            AddDetailQuantity: [],
            AddDetailKategori: [],
            AddDetailED: [],
            inputtedGudangID: window.localStorage.getItem("gID"),
            openBatch: false,
            openProcode: true,
            openBtnDetail: true,
            btnSaveProcode: true,
            SPID: "",
            // NOSP: "",
            DEPO: "",
            itemSave: [],
            items: {},
            btnProcode: false,
            btnAddDetail: false,
            fieldAdd: false,
            inputBookQty: '',
            fieldqtyresult: true,
            fieldqtybook:true,
            qtyresult: "",
            tempBatch: '',
            tempED : '',
            tempQty: 0,
            konfirmasiBatch: false,
            btnSimpanUpdate: true,
            btnAddProcode : true,
        };
    }
    state = {
        addConfirmationMarMoveModal: false
    }


    componentDidMount() {
        // this.getAllKodeEkspedisi()
    }
    connectionOut(message, render) {
        if (render) {
            this.setState({
                modal_backdrop: false,
                modal_nested_parent: false,
                modal_nested_parent_edit: false,
                modal_nested: false,
                modal_nested_edit: false,
                backdrop: true,
                modal_delete: false,
                modal_response: true,
                searchType: "Show_All",
                responseHeader: "CONNECTION ERROR",
                responseMessage: message
            }, () => this.pagecount())
        } else {
            this.setState({
                modal_backdrop: false,
                modal_nested_parent: false,
                modal_nested_parent_edit: false,
                modal_nested: false,
                modal_nested_edit: false,
                backdrop: true,
                modal_delete: false,
                modal_response: true,
                responseHeader: "CONNECTION ERROR",
                responseMessage: message
            });
        }
    }

    enterPressedProcode = event => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            event.preventDefault();
            this.getProductName()
            // this.getBatchNumber()
        }
    };

    enterpressedQty = event => {
        var code = event.keyCode || event.which;
        if (code === 13 || event.key === "Enter") {
            event.preventDefault();
            this.updatePointTabel({ ...this.state.currentPoint })

            // this.setState({
            //     btnSaveProcode: true,
            //     openBatch: true,
            //     openProcode: false,
            // }, () =>  this.updatePointTabel({ ...this.state.currentPoint }))
        }
    };

    getAllKodeEkspedisi() {
        const kword = this.state.keyword;
        const currLimit = this.state.todosPerPage;
        const url = myUrl.url_getAllKodeExpedisi;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                if (data == 0) {
                    this.setState({
                        responseHeader: "Alert!!!",
                        responseMessage: "Data is empty!",
                        modal_response: true,
                        listekspedisi: data.data,
                        isLoading: false
                    });
                }
                else {
                    this.setState({ listekspedisi: data.data });
                }
            }, () => this.connectionOut("Can't reach the server", false));
    }

    getBatchNumber = () => {
        // const url = myUrl2.url_spaddho + '?Insert=getbatch&gudangID=' + this.state.inputtedGudangID
        const url = myUrl2.url_getBatch + '?type=viewBatchAvailable&outcode=' + this.state.inputtedGudangID + '&procod=' + this.state.inputtedSpcdProcode
        console.log("urlbatch", url);
     
        const option = {
            method: 'GET',
            json: true,
            headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              Authorization: window.localStorage.getItem('tokenCookies'),
            },
          };
             // var body = {
        //     procodes: [
        //         this.state.inputtedSpcdProcode
        //     ]
        // }

        Axios
            .get(url, option)
            .then(data => {
                // console.log("data batch", data.data.data);
                console.log("options batch", option);
                if (data.data.data === null) {
                    this.setState({
                        openBatch: false,
                        listBatch: data.data.data,
                        responseModalIsOpen: !this.state.responseModalIsOpen,
                        responseHeader: "Batch tidak ditemukan",
                    }, () => console.log("list batch", this.state.listBatch))
                } else {
                    this.setState({
                        listBatch: data.data.data
                    }, () => console.log("list batch", this.state.listBatch))
                }

            })

    }

    deleteArr() {
        var newArr = this.state.result
        if (!newArr[0].Spcd_Batch) {

            newArr.splice(newArr.length - 2, 1)
            this.setState({
                result: newArr
            })
        } else {

        }

    }

    SaveDataSPAddHoAll() {
        var urlSaveDataSpAddHoAll = (myUrl2.url_spaddho + '?Insert=SaveDataSpAddHoAll');
        console.log("urlSaveDataSpAddHoAll", urlSaveDataSpAddHoAll);
        // var urlSaveHeaderDetail = ('http://192.168.0.18:4411/spaddho/data?Insert=SaveDataSpAddHoAll');
        var payload = {
            SpCordHeader: {
                Spch_Group: parseInt(this.state.groupID),// 
                Spch_OutCodeOutlet: this.state.activeGudangTujuan,// "981", // gudang tujuan
                Spch_OutCodeSup: "",// kosongin
                Spch_OutCodeDepo: this.state.gIDLogin,//login //gudang asal
                Spch_Wilayah: 0,
                Spch_GudangId: this.state.gIDLogin,//login // gudang asal 
                Spch_Ronaldo: "M",
                Spch_CategoryProduct: 6,
                Spch_Via: "Century" //this.state.inputSpVia
            },
            SpCordDetail: [
                {
                    // Spcd_SpId : this.state.SPID,
                    Spcd_Procod: this.state.items.Spcd_Procod,
                    Spcd_Proname: this.state.items.pro_name,
                    Spcd_QuantityProcess: parseInt(this.state.items.Spcd_QuantityProcess),
                    Spcd_Quantity: parseInt(this.state.items.Spcd_QuantityProcess),
                }
            ]
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }

        console.log("payload SaveDataSpAddHoAll", payload)
        fetch(urlSaveDataSpAddHoAll, option)

            .then(response => {
                console.log("response SaveDataSpAddHoAll", response)
                if (response.ok) {
                    return response.json()
                } else {
                    // this.toggleResponseModal()
                    this.toggleAddConfirmationTopModal()
                }
            }).then(data => {
                console.log("data SaveDataSpAddHoAll", data);
                this.setState({
                    SPID: data.data.spid,
                    NOSP: data.data.nosp,
                    btnSaveProcode: true,
                    DEPO: data.data.depo,
                    isLoading: false
                })

                if (data.spid !== "") {
                    this.setState({
                        openBatch: true,
                        fieldAdd: true,
                        btnSaveProcode: true,
                        openProcode: false,
                    })
                }
                else (
                    this.setState({
                        openBatch: false,
                        openProcode: false,
                        fieldAdd: false,
                        btnSaveProcode: true,
                    }))

                if (data.status === false) {
                    this.setState({
                        isLoading: false,
                        responseHeader: "GAGAL MENYIMPAN DATA",
                        // responseModalIsOpen: !this.state.responseModalIsOpen,

                    })
                } else {
                    this.setState({
                        isLoading: false,
                        responseHeader: "Berhasil",
                        // responseModalIsOpen: !this.state.responseModalIsOpen,
                    })
                    // this.toggleResponseModal()
                    this.toggleAddConfirmationTopModal()

                }
            }).catch((error) => {
                this.setState({
                    isLoading: false,
                    responseHeader: "GAGAL MENYIMPAN DATA",
                    // responseModalIsOpen: !this.state.responseModalIsOpen,
                })
                // this.toggleResponseModal()
            });
        this.setState({
            isLoading: false,
            responseHeader: "GAGAL MENYIMPAN DATA"
        })
    }

    SaveBatch = (itemSave = this.state.itemSave) => {
        var urlSaveBatch = (myUrl2.url_spaddho + '?book');
        // var urlSaveBatch = ('http://192.168.0.18:4411/spaddho/data?book');
        console.log("urlSaveBatch", urlSaveBatch)
        var payload = {
            cancel: {
                Spcd_NoSP: this.state.NOSP,
                Spcd_Procod: this.state.tempProcod,
                Spcd_Quantity: parseInt(this.state.tempQty),
                // Spcd_Procod: itemSave.Spcd_Procod,
                // Spcd_Quantity: parseInt(itemSave.Spcd_Quantity),
                // Spcd_Batch: itemSave.Spcd_Batch,
                Spcd_Batch: this.state.tempBatch,
                Spcd_Expdate : this.state.tempED,
                Spcd_SpId: this.state.SPID,
                Spcd_OutCodeDepo: this.state.DEPO,

            },
            procodlama: {
                Spcd_NoSP: this.state.NOSP,
                Spcd_Procod: this.state.tempProcod,
                Spcd_Quantity: parseInt(this.state.tempQty),
                // Spcd_Procod: itemSave.Spcd_Procod,
                // Spcd_Quantity: parseInt(itemSave.Spcd_Quantity),
                // Spcd_Batch: itemSave.Spcd_Batch,
                Spcd_Batch: this.state.tempBatch,
                Spcd_Expdate : this.state.tempED,
                Spcd_SpId: this.state.SPID,
                Spcd_OutCodeDepo: this.state.DEPO,

            },
            book: {
                Spcd_NoSP: this.state.NOSP,
                Spcd_Procod: this.state.tempProcod,
                Spcd_Quantity: parseInt(this.state.tempQty),
                // Spcd_Procod: itemSave.Spcd_Procod,
                // Spcd_Quantity: parseInt(itemSave.Spcd_Quantity),
                // Spcd_Batch: itemSave.Spcd_Batch,
                Spcd_Batch: this.state.tempBatch,
                Spcd_Expdate : this.state.tempED,
                Spcd_SpId: this.state.SPID,
                Spcd_OutCodeDepo: this.state.DEPO,
            },
            procodBaru: {
                Spcd_NoSP: this.state.NOSP,
                Spcd_Procod: this.state.tempProcod,
                Spcd_Quantity: parseInt(this.state.tempQty),
                // Spcd_Procod: itemSave.Spcd_Procod,
                // Spcd_Quantity: parseInt(itemSave.Spcd_Quantity),
                // Spcd_Batch: itemSave.Spcd_Batch,
                Spcd_Batch: this.state.tempBatch,
                Spcd_Expdate : this.state.tempED,
                Spcd_SpId: this.state.SPID,
                Spcd_OutCodeDepo: this.state.DEPO,

            }
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }

        console.log("payload book", option)
        fetch(urlSaveBatch, option)

            .then(response => {
                console.log("response book", response)
                if (response.ok) {
                    return response.json()
                } else {
                    this.toggleAddConfirmationTopModal()
                }
            }).then(data => {
                if (data.error.status === false) {
                    this.setState({
                        //kerjain batch : manggil modal, munculin/hide button simpen cuy nya klo batch exist dan lain lain

                        // responseModalIsOpen: !this.state.responseModalIsOpen,
                        // responseHeader: "BERHASIL",
                        konfirmasiBatch: true,
                        btnSimpanUpdate: false,
                        isLoading: false,
                        addSPHODetailButtonIsOpen: false,
                        addSPHODetailClose: false,
                        openBatch: true,
                        btnSaveProcode: true,
                        openProcode: false,
                    })
                } else if (data.error.code === 498) {
                    this.setState({
                        isLoading: false,
                        responseModalIsOpen: !this.state.responseModalIsOpen,
                        responseHeader: "Batch Sudah Ada",
                    })
                    // console.log("batch exist");
                } else {
                    this.setState({
                        //kerjain batch : manggil modal, munculin/hide button simpen cuy nya klo batch exist dan lain lain
                        konfirmasiBatch: false,
                        btnSimpanUpdate: true,
                        isLoading: false,
                        addSPHODetailButtonIsOpen: false,
                        addSPHODetailClose: false,
                        openBatch: true,
                        btnSaveProcode: true,
                        openProcode: false,
                    })
                    this.toggleAddConfirmationTopModal()

                    // console.log("data book", data)

                }

            })
    }


    SaveDetail = (itemSave = this.state.itemSave) => {
        var urlSaveDetail = (myUrl2.url_spaddho + '?Insert=SaveDataSpAddHoDetail');
        // var urlSaveDetail = ('http://192.168.0.18:4411/spaddho/data?Insert=SaveDataSpAddHoDetail');
        console.log("url SaveDetail ", urlSaveDetail)
        var payload = {
            Spcd_SpId: this.state.SPID,
            Spcd_Procod: this.state.items.Spcd_Procod,
            Spcd_QuantityProcess: parseInt(this.state.items.Spcd_QuantityProcess),
            Spcd_Quantity: parseInt(this.state.items.Spcd_QuantityProcess),
            Spcd_Proname: this.state.items.pro_name,

        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }

        console.log("payload SaveDataSpAddHoDetail ", payload)
        fetch(urlSaveDetail, option)

            .then(response => {
                console.log("response SaveDataSpAddHoDetail", response)
                if (response.ok) {

                    return response.json()
                } else {
                    // this.toggleAddConfirmationTopModal()
                }
            }).then(data => {
                console.log("data SaveDataSpAddHoDetail", data)
                this.setState({
                    //validasi procode sama
                    isLoading: false
                })
                if (data.error.code === 499) {
                    this.setState({
                        isLoading: false,
                        responseModalIsOpen: !this.state.responseModalIsOpen,
                        responseHeader: "PRODUCT EXIST",
                        openBatch: false,
                        fieldAdd: false,
                        openProcode: true,
                    }, () => this.toggleResponseAddDetail())
                }
                // if (data.status === false) {
                //     this.setState({
                //         responseHeader: "GAGAL MENYIMPAN DATA"
                //     })
                // } else {
                //     this.setState({
                //         isLoading: false,
                //         responseHeader: "Berhasil"
                //     })
                //     this.toggleAddConfirmationTopModal()
                // }
            }).catch((error) => {
                this.setState({
                    isLoading: false,
                    responseModalIsOpen: !this.state.responseModalIsOpen,
                    responseHeader: "GAGAL MENYIMPAN DATA"
                })
            });
        this.setState({
            isLoading: false,
            responseHeader: "GAGAL MENYIMPAN DATA"
        })
    }

    SimpanDO() {

        // var urlSaveDO = ('http://10.0.112.40:4411/spaddho/data?sendDO');
        var urlSaveDO = (myUrl2.url_spaddho + '?sendDO');
        console.log("urlSaveDO",urlSaveDO);
        var payload = {
            Spcd_SpId: this.state.SPID
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }

        console.log("payload DO", payload)
        fetch(urlSaveDO, option)
            .then(response => {
                console.log("response DO", response)
                if (response.ok) {
                    return response.json()
                } else {
                    this.tutupsemuasave()
                }
            }).then(data => {
                this.setState({
                    isLoading: false

                })
                if (data.status === false) {
                    this.setState({
                        isLoading: false,
                        responseHeader: "GAGAL MENYIMPAN DATA"
                    })
                } else {
                    this.setState({
                        isLoading: false,
                        responseHeader: "Berhasil"
                    })
                    // this.toggleAddConfirmationTopModal()
                    this.tutupsemuasave()
                }
            }).catch((error) => {
                this.setState({
                    isLoading: false,
                    responseHeader: "GAGAL MENYIMPAN DATA"
                })
            });
        this.setState({
            isLoading: false,
            responseHeader: "GAGAL MENYIMPAN DATA"
        })
    }

    getProductName = () => {
        this.setState({
            isLoading : true,
        })
        const urlA = 'https://staging-api.cfu.pharmalink.id/master-produk/produk?procode=' + this.state.inputtedSpcdProcode;
        // console.log("procodeeee", urlA)

        const option = {
            method: 'GET',
            json: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json;charset=UTF-8',
                // Authorization: 'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDE4MDIxNDAsImlzcyI6IlBIQVJPUyBBdXRoZW50aWNhdGlvbiIsInVpZCI6MSwidW5tIjoic2EifQ.nruPNAPBJZzwcmkThRLYdQENN1jKilRgaYZHpK611Z0',
                Authorization: window.localStorage.getItem('tokenCookies'),
            },
        };

        fetch(urlA, option)
            .then(response => {
                // // trace.stop();
                // console.log("respon statsss", response);
                if (response.ok) {
                    this.setState({
                        isLoading : false,
                    })
                    return response.json();
                   
                } else {
                    // this.showNotification("Koneksi ke server gagal!", 'error');
                    this.setState({
                        isLoading : false,
                    })
                }
            })
            .then(data => {
                // console.log("productttt", data.data[0].pro_name);
                if (data.data === null) {
                    this.setState({
                        isLoading:false,
                        responseHeader: "Procode tidak ditemukan",
                        responseModalIsOpen: !this.state.responseModalIsOpen,
                    })
                } else {
                    this.setState({
                        isLoading:false,
                        resultProductName: data,
                        pro_name: data.data[0].pro_name
                    }, () => this.getBatchNumber());
                    let evt = {
                        target: {
                            name: "inputtedNameProduct",
                            value: data.data[0].pro_name
                        }
                    }
                    this.UpdateInputTable(evt, "pro_name", "current")
                }

            }).catch((error) => {
                if (error.response.status === 401) {
                    alert('Token Expired, Mohon Login Ulang')
                    window.localStorage.removeItem('tokenLogin')
                    window.localStorage.removeItem('accessList')
                    window.localStorage.removeItem('profile')
                    this.props.history.push('/login')
                } else {
                    alert(error.message + ', Mohon Merefresh Browser')
                }
            });
    }

    checkBatch = (Spcd_Procod,pro_name) => {
        const urlCheckBatch = myUrl2.url_spaddho + '?type=Qty' + '&spid=' + this.state.SPID + '&procod=' + Spcd_Procod;
        // console.log("urlCheckBatch", urlCheckBatch)

        const option = {
            method: 'GET',
            json: true,
            headers: {
                "Access-Control-Allow-Origin": "*",
                'Content-Type': 'application/json;charset=UTF-8',
                // Authorization: 'Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MDE4MDIxNDAsImlzcyI6IlBIQVJPUyBBdXRoZW50aWNhdGlvbiIsInVpZCI6MSwidW5tIjoic2EifQ.nruPNAPBJZzwcmkThRLYdQENN1jKilRgaYZHpK611Z0',
                Authorization: window.localStorage.getItem('tokenCookies'),
            },
        };

        fetch(urlCheckBatch, option)
            .then(response => {
                if (response.ok) {
                    // console.log("response checkbatch", response);
                    return response.json();
                } else {
                    // this.showNotification("Koneksi ke server gagal!", 'error');
                }
            })
            .then(data => {
                // console.log("data checkbatch", data);
                if (data.data.Spcd_QtyResult != 0) {
                    this.setState({
                        qtyresult: data.data.Spcd_QtyResult,
                        isLoading: false
                    },()=>this.toggleAddBatch(Spcd_Procod,pro_name))

                } else {
                    this.setState({
                    }, () => alert("PROCODE SUDAH TERPENUHI, TIDAK DAPAT MENAMBAH QTY"))
                }

            });
    }


    UpdateInputTable(event, field, name) {
        // console.log("field ", event.target.name);
        let Point = {};

        if (name === "current") {
            Point = { ...this.state.currentPoint };
        }

        Point[field] = event.target.value;
        if (field === "Spcd_Procod") {
            this.setState({
                validProcod: true,
                [`${name}Point`]: Point,
                [event.target.name]: event.target.value,
                tempProcod: event.target.value
            })
        } else {
            this.setState({
                [`${name}Point`]: Point,
                [event.target.name]: event.target.value
            }, () => this.getMatchingED(field));
        }

        // handle change
        if (field === "Spcd_Procod") {
            if (event.target.value.length != 0 && event.target.value.length >= 6 && event.target.value!="") {
                if (this.state.groupID == "1") {
                    if (event.target.value.substring(0, 2) == "01") {
                        this.setState({ validProcod: true }, () => this.validateFieldInput())
                    } else {
                        this.setState({ 
                            validProcod: false, 
                            responseHeader :"GROUP DAN PROCODE TIDAK SESUAI !",
                            responseModalIsOpen: !this.state.responseModalIsOpen,
                         }, () => this.validateFieldInput())
                    }

                } else if (this.state.groupID == "2") {
                    if (event.target.value.substring(0, 2) != "01") {
                        this.setState({ validProcod: true }, () => this.validateFieldInput())
                    } else {
                        this.setState({ 
                            validProcod: false,
                            responseHeader :"GROUP DAN PROCODE TIDAK SESUAI !",
                            responseModalIsOpen: !this.state.responseModalIsOpen,
                         }, () => this.validateFieldInput())
                    }
                }

            } else {
                this.setState({ btnSaveProcode: true })
            }
            this.setState({
                Spcd_Procod: event.target.value
            })
        }
        else if (field === "pro_name") {
            if (event.target.value == "" || event.target.value == null) {
                this.setState({
                    validProname: false
                }, () => this.validateFieldInput())
            } else {
                this.setState({
                    AddDetailName: event.target.value,
                    validProname: true
                }, () => this.validateFieldInput())
            }
        }
        else if (field === "Spcd_Batch") {
            if (event.target.value != '' || event.target.value == null) {
                this.setState({
                    AddDetailBatchNumber: event.target.value,
                    validBatch: true,
                    fieldqtybook:false,
                    inputBookQty: '',
                    tempBatch: event.target.value
                }, () => this.validateFieldInput())
            } else {
                this.setState({
                    validBatch: false,
                    fieldqtybook:true,
                }, () => this.validateFieldInput())
            }

        }
        else if (field === "Spcd_expdate") {
            this.setState({
                AddDetailED: event.target.value,
                tempED : event.target.value,
                validED: true
            }, () => this.validateFieldInput())
        }
        else if (field === "Spcd_QuantityProcess") {
            if (event.target.value.length !== 0 && parseInt(event.target.value) != 0) {
                this.setState({ validQtyProses: true })
            } else {
                this.setState({ validQtyProses: false })
            }
            // console.log("evtqtyproses", event.target.value);
            this.setState({
                userInputQtyProcess: event.target.value,
            }, () => this.validateFieldInput())

        } else if (field === "Spcd_Quantity") {
            // console.log("qty result ", this.state.qtyresult)
            if (this.state.qtyresult != 0) {
                console.log("a1");
                if (this.state.qtyresult < this.state.matchingQty ) {
                    console.log("a2");
                    if (event.target.value > this.state.qtyresult) {
                        console.log("a3");
                        Point[field] = this.state.qtyresult
                        this.setState({
                            validQty: true,
                            // buttonDisabler: false,
                            [`${name}Point`]: Point,
                            tempQty: Point[field]
                        }, () => this.validateFieldInput())
                    } else if (event.target.value < this.state.qtyresult) {
                        console.log("a4");
                        Point[field] =  this.state.qtyresult
                        this.setState({
                            validQty: true,
                            // buttonDisabler: false,
                            [`${name}Point`]: Point,
                            tempQty: Point[field]
                        }, () => this.validateFieldInput())
                    }else if (event.target.value.length === 0){
                        console.log("a5");
                        this.setState({
                            validQty:false,
                        }, () => this.validateFieldInput())
                    }else{
                        console.log("a6");
                        this.setState({
                            validQty:true,
                        }, () => this.validateFieldInput())
                    }

                } else if (this.state.qtyresult > this.state.matchingQty ) {
                    console.log("a7");
                    if (event.target.value > this.state.matchingQty ) {
                        console.log("a8");
                        Point[field] = this.state.matchingQty
                        this.setState({
                            validQty: true,
                            // buttonDisabler: false,
                            [`${name}Point`]: Point,
                            tempQty: Point[field]
                        }, () => this.validateFieldInput())
                    } else if (event.target.value < this.state.matchingQty) {
                        console.log("a9");
                        Point[field] = this.state.matchingQty
                        this.setState({
                            validQty: true,
                            // buttonDisabler: false,
                            [`${name}Point`]: Point,
                            tempQty: Point[field]
                        }, () => this.validateFieldInput())
                    }else if (event.target.value.length === 0){
                        console.log("a10");
                        this.setState({
                            validQty:false,
                        }, () => this.validateFieldInput())
                    }else{
                        console.log("a11");
                        this.setState({
                            validQty:true,
                        }, () => this.validateFieldInput())
                    }
                }

            } else if (this.state.matchingQty != "") {
                console.log("a12");
                if (this.state.userInputQtyProcess >= this.state.matchingQty) {
                    console.log("a13");
                    // console.log("matching qty ", typeof (this.state.matchingQty));
                    if (event.target.value >= this.state.matchingQty) {
                        console.log("a14");
                        Point[field] = this.state.matchingQty
                        this.setState({
                            validQty: true,
                            // buttonDisabler: false,
                            [`${name}Point`]: Point,
                            tempQty: Point[field]
                        }, () => this.validateFieldInput())
                        
                    } else if (event.target.value <= this.state.matchingQty) {
                        console.log("a15");
                        Point[field] = this.state.matchingQty
                        this.setState({
                            validQty: true,
                            // buttonDisabler: false,
                            [`${name}Point`]: Point,
                            tempQty: Point[field]
                        }, () => this.validateFieldInput())
                    }else if (event.target.value.length === 0){
                        console.log("a16");
                        this.setState({
                            validQty:false,
                        }, () => this.validateFieldInput())
                    }else{
                        console.log("a17");
                        this.setState({
                            validQty:false,
                        }, () => this.validateFieldInput())
                    }
                } else if (this.state.userInputQtyProcess <= this.state.matchingQty) {
                    console.log("a18");
                    if (event.target.value >= this.state.userInputQtyProcess ) {
                        console.log("a18a");
                        Point[field] = this.state.userInputQtyProcess
                        this.setState({
                            [`${name}Point`]: Point,
                            validQty: true,
                            // buttonDisabler: false,
                            tempQty: Point[field]
                        }, () => this.validateFieldInput())
                    } else if (event.target.value <= this.state.userInputQtyProcess ) {
                        console.log("a19");
                        Point[field] = this.state.userInputQtyProcess
                        this.setState({
                            validQty: true,
                            // buttonDisabler: false,
                            [`${name}Point`]: Point,
                            tempQty: Point[field]
                        }, () => this.validateFieldInput())
                    }else if (event.target.value.length === 0){
                        console.log("a20");
                        this.setState({
                            validQty:false,
                        }, () => this.validateFieldInput())
                    }else{
                        console.log("a21");
                        this.setState({
                            validQty:true,
                        }, () => this.validateFieldInput())
                    }
                }
                else {
                    if (event.target.value <= this.state.matchingQty ) {
                        console.log("a22");
                        Point[field] = this.state.matchingQty
                        this.setState({
                            [`${name}Point`]: Point,
                            validQty: true,
                            // buttonDisabler: false,
                            tempQty: Point[field]
                        }, () => this.validateFieldInput())
                    } else if (event.target.value >= this.state.matchingQty ) {
                        console.log("a23");
                        Point[field] = this.state.matchingQty
                        this.setState({
                            [`${name}Point`]: Point,
                            validQty: true,
                            // buttonDisabler: false,
                            tempQty: Point[field]
                        }, () => this.validateFieldInput())
                    }else if (event.target.value.length === 0){
                        console.log("a24");
                        this.setState({
                            validQty:false,
                        }, () => this.validateFieldInput())
                    }else{
                        console.log("a25");
                        Point[field] = this.state.matchingQty
                        this.setState({
                            [`${name}Point`]: Point,
                            validQty: true,
                            // buttonDisabler: false,
                            tempQty: Point[field]
                        }, () => this.validateFieldInput())
                    }
                   
                }
            }
            // else if (this.state.matchingQty ==""){
            //     this.setState({
            //         validQty: false,
            //     }, () => this.validateFieldInput())
            // }
             else if (event.target.value.length === 0){
                console.log("a26");
                this.setState({
                    validQty: false,
                }, () => this.validateFieldInput())
            }
        }
    }

    getMatchingED = (field, type) => {
        // console.log("this.state.inputtedBatchNumber", this.state.inputtedBatchNumber)

        if (this.state.inputtedBatchNumber && field == "Spcd_Batch") {
            var filtered = this.state.listBatch.filter(item => item.stck_batchnumber === this.state.inputtedBatchNumber)
            this.setState({
                matchingEd: filtered[0].stck_expdate,
                matchingQty: filtered[0].stck_qtyavailable,
                inputBookQty: this.state.matchingQty
            }, () => this.updateED())
        }

    }

    updateED = () => {
        let evt = {
            target: {
                name: "inputtedED",
                value: this.state.matchingEd
            }
        }
        this.UpdateInputTable(evt, "Spcd_expdate", "current")
    }

    //untuk save update poin
    updatePointTabel = (todo) => (event) => {
        // console.log("todo1", todo);
        this.setState({
            items: todo,
            btnSaveProcode: true,
            openBatch: true,
            fieldAdd: true,
            openProcode: false,

        }, () => this.SaveDataSPAddHoAll()
        );

    }

    updatePointTabelBatch = (todo, event) => {
        // console.log("1231231231", todo);
        this.setState(prevState => ({
            result: [...prevState.result, todo],
            itemSave: todo,
            openBatch: true,
            // isLoading: true,
        })
        );
        this.resetModal();
        this.konfirmasiBatchToggleClose()
        // this.checkBatch()
        // this.SaveDataSPAddHoAll()
    }
    updatePointTabelDetail = (todo) => (event) => {
        // console.log("todo detail", todo);
        this.setState({
            items: todo,
            btnSaveProcode: true,
            openBatch: true,
            openProcode: false,
            openBtnDetail: false,
        }, () => this.SaveDetail()

        );
    }

    resetModal() {
        this.setState({
            inputtedGroup: '',
            inputtedNameProduct: '',
            inputtedBatchNumber: '',
            inputtedQuantity: '',
            inputtedNameProduct: '',
            Spcd_Procod: '',
            pro_name: '',
            matchingEd: '',
            matchingQty: '',
            inputBookQty: '',
            userInputQtyProcess: '',
            btnSaveProcode: true,
        })
    }

    //handle untuk save all
    handleChange = (type, event) => {
        console.log("gudang tujuan", event.target.value);
        if (type === "gudangtujuan") {
            // if (event.target.value != '' || event.target.value == null) {
            //     this.setState({
            //         AddDetailBatchNumber: event.target.value,
            //         validBatch: true,
            //         fieldqtybook:false,
            //         inputBookQty: '',
            //         tempBatch: event.target.value
            //     }, () => this.validateFieldInput())
            // } else {
            //     this.setState({
            //         validBatch: false,
            //         fieldqtybook:true,
            //     }, () => this.validateFieldInput())
            // }
            if (event.target.value != '' || event.target.value == null){
                this.setState({
                    validGudang : true,
                    activeGudangTujuan: event.target.value
                }, () => this.validateFieldInput())
            } else {
                this.setState({
                    validGudang: false,
                }, () => this.validateFieldInput())
            }
            
        }
        if (type === "SpNo") {
            this.setState({
                inputSpNo: event.target.value
            })
        }
        else if (type === "SpOutlet") {
            this.setState({
                inputSpOutlet: event.target.value
            })
        }

        // ngecek Type nya
        else if (type === "SpType" && event.target.value === "ADD-HO") {
            this.setState({
                inputSpType: "H"
                // inputSpType: event.target.value
            })

        }
        else if (type === "SpType" && event.target.value === "ADD") {
            this.setState({
                inputSpType: "S"
                // inputSpType: event.target.value
            })

        }
        else if (type === "SpType" && event.target.value === "ADDR") {
            this.setState({
                inputSpType: "R"
                // inputSpType: event.target.value
            })

        }
        else if (type === "SpType" && event.target.value === "ADD/ADDR") {
            this.setState({
                inputSpType: "T"
                // inputSpType: event.target.value
            })

        }
        else if (type === "SpUser") {
            this.setState({
                inputSpUser: event.target.value
            })
        }
        else if (type === "SpTgl") {
            this.setState({
                inputSpTgl: event.target.value
            })
        }
        else if (type === "SpVia") {
            this.setState({
                inputSpVia: event.target.value
            })
        }
        else if (type === "SpDilayani") {
            this.setState({
                inputSpDilayani: event.target.value
            })
        }
    }

    //validasi btn save add detail
    validateFieldInput = () => {
        if (this.state.validGudang){
            this.setState({
                btnAddProcode: false
            })
        }else{
            this.setState({
                btnAddProcode: true
            })
        }


        console.log("bq",this.state.validBatch && this.state.validQty);
        if (this.state.validBatch && this.state.validQty) {
            console.log("bq false");
            this.setState({
                buttonDisabler: false
            })
        } else {
            console.log("bq true");
            this.setState({
                buttonDisabler: true
            })
        }

        if (this.state.validProcod && this.state.validProname && this.state.validQtyProses && this.state.listBatch !== null) {
            console.log("bq1",this.state.validProcod , this.state.validProname , this.state.validQtyProses);
            console.log("bq1 false");
            this.setState({
                btnSaveProcode: false
            })
        } else {
            console.log("bq1 true");
            this.setState({
                btnSaveProcode: true
            })
        }
    }
    tutupsemuasave() {
        this.props.history.push('/SPAddHO')
    }

    // konfirmasi add 
    toggleResponseModal = () => {
        this.setState({
            responseModalIsOpen: !this.state.responseModalIsOpen,
        })
    }

    // tutup modal2 pas add
    dismissToggleSave = () => {
        this.setState({
            responseModalIsOpen: !this.state.responseModalIsOpen,
            saveSPAddHoModalIsIopen: false,
            saveSPAddHoModalIsClose: true,
        }, () => this.resetModal())
    }

    //modal untuk konfirmasi save kebuka
    toggleSaveAll = () => {
        this.setState({
            saveSPAddHoModalIsIopen: this.state.saveSPAddHoModalIsIopen,
            isEnabled: true,
            saveSPAddHoModalIsIopen: true,

            saveSPAddHoModalIsClose: this.state.saveSPAddHoModalIsClose
        })
    }

    // tutup modal konfirmasi save
    toggleCancelSaveAll = () => {
        this.setState({
            saveSPAddHoModalIsIopen: !this.state.saveSPAddHoModalIsIopen,
            saveSPAddHoModalIsClose: !this.state.saveSPAddHoModalIsClose
        })
    }

    // kalau modal kebuka
    toggleAddDetail = () => {
        this.setState({
            btnProcode: true,
            btnAddDetail: false,
            openProcode2: false,
            SPID: this.state.SPID,
            openProcode: true,
            inputBookQty: '',
            openBatch: false,
            fieldAdd: false,
            buttonDisabler: true,
            matchingQty: '',
            matchingEd: '',
            validProcod: false,
            validProname: false,
            validQtyProses: false,
            addSPHODetailButtonIsOpen: this.state.addSPHODetailButtonIsOpen,
            isEnabled: true,
            addSPHODetailButtonIsOpen: true,
            addSPHODetailClose: this.state.addSPHODetailClose,
            addConfirmationSPHODetailButtonIsOpen: this.state.addConfirmationSPHODetailButtonIsOpen
        })
    }
    toggleAddDetail2 = () => {
        this.setState({
            currentPoint:"",
            Spcd_Quantity:"",
            fieldqtybook:true,
            openProcode: false,
            btnAddDetail: true,
            openBatch: false,
            fieldAdd: false,
            openBtnDetail: true,
            buttonDisabler: true,
            validProcod: false,
            validProname: false,
            validQtyProses: false,
            validBatch:false,
            validQty:false,
            inputBookQty: '',
            matchingQty: '',
            matchingEd: '',
            qtyresult: 0,
            addSPHODetailButtonIsOpen: this.state.addSPHODetailButtonIsOpen,
            isEnabled: true,
            addSPHODetailButtonIsOpen: true,
            addSPHODetailClose: this.state.addSPHODetailClose,
            addConfirmationSPHODetailButtonIsOpen: this.state.addConfirmationSPHODetailButtonIsOpen
        })
    }

    // add batch dengan procod sama
    toggleAddBatch = (procodeAddBatch, pronameAddBatch) => {
        this.setState({
            openProcode: false,
            btnAddDetail: false,
            openBatch: true,
            fieldAdd: true,
            fieldqtybook:true,
            openBtnDetail: true,
            buttonDisabler: true,
            validProcod: false,
            validProname: false,
            validQtyProses: false,
            validBatch:false,
            validQty:false,
            matchingQty: '',
            matchingEd: '',
            inputBookQty: '',
            addSPHODetailButtonIsOpen: this.state.addSPHODetailButtonIsOpen,
            isEnabled: true,
            addSPHODetailButtonIsOpen: true,
            addSPHODetailClose: this.state.addSPHODetailClose,
            addConfirmationSPHODetailButtonIsOpen: this.state.addConfirmationSPHODetailButtonIsOpen,
            fieldqtyresult: false,

            Spcd_Procod: procodeAddBatch,
            inputtedSpcdProcode: procodeAddBatch,
            pro_name: pronameAddBatch,
        }, () => {
            // console.log("procodeeee", procodeAddBatch, pronameAddBatch)
            this.getProductName()
            // this.getBatchNumber()
            // this.checkBatch()
        })
    }

    // tutup modal
    toggleResponseAddDetail = () => {
        this.setState({
            addSPHODetailButtonIsOpen: !this.state.addSPHODetailButtonIsOpen,
            addSPHODetailClose: !this.state.addSPHODetailClose,
            openBatch: false,
            validProcod: false,
            validProname: false,
            validQtyProses: false,
        }, () => this.resetModal())
    }

    toggleAddConfirmationTopModal = () => {
        this.setState({
            fieldAdd: true,
            openBatch: true,
        })
    }
    toggleSimpanBatch = () => {
        this.setState({
            addSPHODetailButtonIsOpen: this.state.addSPHODetailButtonIsOpen,
            addSPHODetailClose: this.state.addSPHODetailClose,
            addConfirmationSPHODetailButtonIsOpen: !this.state.addConfirmationSPHODetailButtonIsOpen
        })
    }

    showNotification = currMessage => {
        setTimeout(() => {
            if (!this.notificationSystem) {
                return;
            }
            this.notificationSystem.addNotification({
                title: <MdDetails />,
                message: currMessage,
                level: 'info',
            });
        }, 100);
    };

    openModal = (item) => {
        this.setState({
            activeProcod: item.spcd_procod
        })
    }

    konfirmasiBatchToggle = () => {
        this.setState({
            isLoading: true,
            btnSimpanUpdate: true,
            // konfirmasiBatch: true
        }, () => this.SaveBatch())
    }
    konfirmasiBatchToggleClose = () => {
        this.setState({
            konfirmasiBatch: false
        })
    }

    render() {
        const currentTodos = this.state.result;
        const { listPurchasingArea } = this.state
        const lpa = this.state.listPurchasingArea
        const { listekspedisi } = this.state;
        const { listBatch } = this.state;

        const renderTodos = currentTodos && currentTodos.map((todo,index) => {
            return <tr align="center">


                <td className="py-3" >{todo.Spcd_Procod}</td>
                <td> {todo.pro_name}</td>
                <td> {todo.Spcd_Batch}</td>
                <td> {todo.Spcd_expdate}</td>
                <td> {todo.Spcd_QuantityProcess}</td>
                <td> {todo.Spcd_Quantity}</td>
                <td>
                    <Button id={index} color="primary" size="sm" onClick={() => this.checkBatch(todo.Spcd_Procod, todo.pro_name)}><MdAdd /></Button>
                </td>
            </tr>
        });

        return (
            <Page
                title="Create SP">
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardHeader className="d-flex justify-content-between">
                                <ButtonGroup>
                                    <Button color="primary" size="sm" a href="/SPAddHO"><MdArrowBack />BACK </Button>
                                </ButtonGroup>

                            </CardHeader>
                            <CardHeader>
                                <Form style={{
                                    width: "50%",
                                    float: "left",
                                }}>
                                    <FormGroup>
                                        <th>
                                            <td>
                                                <Label>Gudang Tujuan</Label>
                                            </td>
                                        </th>
                                        {/* <td style={{ width: '60%' }}>
                                            <Input disabled value="981 - UN"></Input>
                                        
                                        </td> */}
                                         <td style={{ width: '63%', paddingLeft:"4%", }}>
                                            <select  
                                                    style={{
                                                        width: "100%",
                                                        height: "1.5vw"
                                                    }}
                                             onChange={evt => this.handleChange('gudangtujuan', evt)}
                                            >
                                                <option value="" disabled selected>PILIH GUDANG</option>
                                                {options.map(opt =>
                                                    <option value={opt.value}>{opt.label}</option>
                                                )}
                                            </select>
                                        </td>

                                    </FormGroup>

                                    <FormGroup>
                                        <th>
                                            <td>
                                                <Label>TYPE</Label>
                                            </td>
                                        </th>
                                        <td style={{ width: "60%" }} >
                                            <Input disabled
                                                type="search"
                                                placeholder=""
                                                name="Sp_Type"
                                                onInput={(e) => this.handleChange("SpType", e)}
                                                value="ADD-HO"
                                            /> </td>
                                    </FormGroup>

                                    <FormGroup>
                                        <th>
                                            <td>
                                                <Label>USER</Label>
                                            </td>
                                        </th>
                                        <td style={{ width: "60%" }} >
                                            <Input disabled
                                                type="search"
                                                placeholder=""
                                                name="Sp_User"
                                                onInput={(e) => this.handleChange("SpUser", e)}
                                                value="CRTSPGD"
                                            /> </td> <br />

                                    </FormGroup>
                                </Form>

                                <Form
                                    style={{
                                        width: "50%",
                                        float: "right",
                                    }}>

                                    <FormGroup inline>
                                        <th>
                                            <td>
                                                <Label>VIA</Label>
                                            </td>
                                        </th>

                                        <td style={{ width: "60%" }} >
                                            <Input disabled
                                                type="search"
                                                placeholder=""
                                                name="Sp_Via"
                                                onInput={(e) => this.handleChange("SpVia", e)}
                                                value="Century"
                                            /> </td>

                                    </FormGroup>
                                    <FormGroup inline>
                                        <th>
                                            <td>
                                                <Label>Gudang Asal</Label>
                                            </td>
                                        </th>

                                        <td style={{ width: "60%" }}>
                                            <Input disabled value={window.localStorage.getItem('gName')}></Input>
                                        </td>

                                    </FormGroup>

                                </Form>
                            </CardHeader>

                            <CardHeader>
                                <ButtonGroup>
                                    {/* {this.state.btnProcode == false ? */}
                                    {this.state.result && this.state.result.length === 0 ?

                                        <Button size="sm"
                                        disabled = {this.state.btnAddProcode}
                                            onClick={this.toggleAddDetail.bind(this)
                                            }>Add Procode</Button>
                                        :
                                        <Button
                                            size="sm"
                                            onClick={this.toggleAddDetail2.bind(this)
                                            }>Add Detail</Button>
                                    }
                                    <Modal size="xl"
                                        isOpen={this.state.addSPHODetailButtonIsOpen}>
                                        <ModalHeader
                                        // toggle={this.toggleResponseAddDetail.bind(this)}
                                        >
                                            Add Detail
                                        </ModalHeader>
                                        <ModalBody>

                                            <Row>
                                                <Col sm={2} >
                                                    <label>ProCode</label>
                                                </Col>

                                                <Col sm={4}>
                                                    <Input disabled={this.state.fieldAdd}
                                                        onKeyPress={e => this.enterPressedProcode(e, false)}
                                                        placeholder="ProCode"
                                                        // onInput={(e) => this.handleAddDetailChange("SpdProCode", e)}
                                                        onChange={evt => this.UpdateInputTable(evt, "Spcd_Procod", "current")}
                                                        name="inputtedSpcdProcode"
                                                        value={this.state.Spcd_Procod}
                                                    >
                                                    </Input>
                                                </Col>
                                                <Col sm={2} >
                                                    <label>Qty Kebutuhan</label>
                                                </Col>
                                                <Col sm={4} >
                                                    <Input disabled={this.state.fieldAdd}
                                                        type="number"
                                                        onKeyDown={e => this.enterpressedQty(e)}
                                                        placeholder="Qty Kebutuhan"
                                                        // onInput={(e) => this.handleAddDetailChange("Spcd_QuantityProcess", e)}
                                                        onChange={evt => this.UpdateInputTable(evt, "Spcd_QuantityProcess", "current")}
                                                        name="inputtedSpcdQuantityProcess"
                                                    >
                                                    </Input>
                                                </Col>
                                            </Row>

                                            <Row className="mt-3">
                                                <Col sm={2}>
                                                    <label>ProName</label>
                                                </Col>
                                                <Col sm={4}>
                                                    <Input disabled
                                                        placeholder="ProName"
                                                        name="Spd_Name"
                                                        // onInput={(e) => this.handleAddDetailChange("SpdProName", e)}
                                                        onKeyPress={evt => this.UpdateInputTable(evt, "pro_name", "current")}
                                                        name="inputtedNameProduct"
                                                        value={this.state.pro_name}>
                                                    </Input>
                                                </Col>

                                                <Col sm={2} >
                                                    <Collapse isOpen={this.state.openBatch}>
                                                        <label>Qty Kurang</label>
                                                    </Collapse>
                                                </Col>
                                                <Col sm={4}>
                                                    <Collapse isOpen={this.state.openBatch}>
                                                        <Input
                                                            disabled
                                                            // type="number"
                                                            placeholder="Qty Kurang"
                                                            value={this.state.qtyresult}
                                                            // onInput={(e) => this.handleAddDetailChange("SpdQuantity", e)}
                                                            // onChange={evt => this.UpdateInputTable(evt, "", "current")}
                                                            name="inputtedQuantityMax">
                                                        </Input>
                                                    </Collapse>
                                                </Col>
                                            </Row>


                                            <Collapse isOpen={this.state.openBatch}>
                                                <Row className="mt-3">
                                                    <Col sm={2}>
                                                        <label>Batch Number</label>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <select
                                                            className='custom-select'
                                                            placeholder="BatchNumber"
                                                            // onInput={(e) => this.handleAddDetailChange("SpdBatchNumber", e)}
                                                            onChange={evt => this.UpdateInputTable(evt, "Spcd_Batch", "current")}
                                                            name="inputtedBatchNumber"
                                                        >
                                                            <option value="" disabled selected>PILIH BATCH</option>
                                                            {listBatch && listBatch.map((lb) =>
                                                                <option value={lb.stck_batchnumber}>{lb.stck_batchnumber}</option>
                                                            )}
                                                        </select>
                                                    </Col>
                                                    <Col sm={2}>
                                                        <label>Qty Max Batch</label>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Input
                                                            disabled
                                                            // type="number"
                                                            placeholder="Qty Max Batch"
                                                            value={this.state.matchingQty}
                                                            // onInput={(e) => this.handleAddDetailChange("SpdQuantity", e)}
                                                            onChange={evt => this.UpdateInputTable(evt, "", "current")}
                                                            name="inputtedQuantityMax">
                                                        </Input>
                                                    </Col>
                                                </Row>

                                                <Row className="mt-3">
                                                    <Col sm={2}>
                                                        <label>ED</label>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Input disabled
                                                            placeholder="Exp Date"
                                                            // onInput={(e) => this.handleAddDetailChange("SpdExpDate", e)}
                                                            onChange={evt => this.UpdateInputTable(evt, "Spcd_expdate", "current")}
                                                            value={this.state.matchingEd}
                                                            name="inputtedED"
                                                        >
                                                        </Input>
                                                    </Col>
                                                    <Col sm={2}>
                                                        <label>Qty Booking</label>
                                                    </Col>
                                                    <Col sm={4}>
                                                        <Input disabled={this.state.fieldqtybook}
                                                            type="number"
                                                            placeholder="Qty Booking"
                                                            value={this.state.currentPoint && this.state.currentPoint.Spcd_Quantity}
                                                            // onInput={(e) => this.handleAddDetailChange("SpdQuantity", e)}
                                                            onChange={(evt) => this.UpdateInputTable(evt, "Spcd_Quantity", "current")}
                                                            name="inputBookQty">
                                                        </Input>
                                                    </Col>
                                                </Row>
                                            </Collapse>
                                        </ModalBody>

                                        <ModalFooter
                                            style={{
                                                display: "inline-block",
                                                textAlign: "center"
                                            }}
                                        >

                                            <ButtonGroup>

                                                {/* <Collapse isOpen={this.state.openProcode}> */}
                                                {this.state.btnAddDetail == false ?
                                                    <Collapse isOpen={this.state.openProcode}>
                                                        <Button disabled={this.state.btnSaveProcode}
                                                            color="primary"
                                                            // disabled={this.state.isEnabled}
                                                            onClick={this.updatePointTabel({ ...this.state.currentPoint })}
                                                        >
                                                            <MdSave
                                                                style={{ marginRicght: "5" }}>
                                                            </MdSave>Add Batch
                                                        </Button>
                                                    </Collapse> :
                                                    <Collapse isOpen={this.state.openBtnDetail}>
                                                        <Button disabled={this.state.btnSaveProcode}
                                                            color="primary"
                                                            // disabled={this.state.isEnabled}
                                                            onClick={this.updatePointTabelDetail({ ...this.state.currentPoint })}
                                                        >
                                                            <MdSave
                                                                style={{ marginRight: "5" }}>
                                                            </MdSave>Add Batch
                                                          </Button>
                                                    </Collapse>

                                                }
                                                <Collapse isOpen={this.state.openBatch}>
                                                    <Button disabled={this.state.buttonDisabler}
                                                        color="primary"
                                                        onClick={this.konfirmasiBatchToggle.bind(this)}
                                                    // onClick={(evt) => this.updatePointTabelBatch({ ...this.state.currentPoint }, evt)}
                                                    >
                                                        <MdSave
                                                            style={{ marginRight: "5" }}>
                                                        </MdSave>Simpan batch
                    </Button>
                                                </Collapse>

                                                <Collapse isOpen={!this.state.openBatch}>
                                                    <Button
                                                        color="danger"
                                                        onClick={this.toggleResponseAddDetail.bind(this)}
                                                    >
                                                        <MdClose
                                                            style={{ marginRight: "5" }}
                                                        />Batal
                    </Button>
                                                </Collapse>
                                            </ButtonGroup>

                                        </ModalFooter>

                                        {/* Konfirmasi add new sp ho */}
                                    </Modal>
                                    <Modal
                                        isOpen={this.state.addConfirmationSPHODetailButtonIsOpen}>
                                        <ModalHeader
                                            toggle={this.toggleAddConfirmationTopModal.bind(this)}>
                                            Konfirmasi Add New SP HO
                         </ModalHeader>

                                        <ModalBody>
                                            Apakah Anda yakin ingin menambah data ini?
                        </ModalBody>

                                        <ModalFooter
                                            style={{
                                                display: "inline-block",
                                                textAlign: "center"
                                            }}
                                        >

                                            <Button
                                                color="primary"
                                                name="simpan"
                                                onClick={this.updatePointTabel({ ...this.state.currentPoint })}
                                            >
                                                <MdSave
                                                    style={{ marginRight: "5" }}>

                                                </MdSave>Simpan
                    </Button>
                                            <Button
                                                color="danger"
                                                onClick={this.toggleAddConfirmationTopModal.bind(this)}
                                            >
                                                <MdClose
                                                    style={{ marginRight: "5" }}
                                                />Batal
                    </Button>
                                        </ModalFooter>
                                    </Modal>
                                    <Modal
                                        isOpen={this.state.responseModalIsOpen}>

                                        <ModalHeader
                                            toggle={this.toggleResponseModal.bind(this)}
                                        >
                                            {this.state.responseHeader}
                                        </ModalHeader>
                                        <ModalFooter>
                                            <Button
                                                color="primary"
                                                onClick={this.dismissToggleSave.bind(this)}
                                            >
                                                OK
                                     </Button>
                                        </ModalFooter>
                                    </Modal>

                                    <Modal
                                        isOpen={this.state.konfirmasiBatch}>
                                        <ModalHeader
                                        // toggle={this.konfirmasiBatchToggleClose.bind(this)}
                                        >
                                            Konfirmasi Add Batch
                                        </ModalHeader>

                                        <ModalBody>
                                            Berhasil Menambahkan Data
                                        </ModalBody>

                                        <ModalFooter
                                            style={{
                                                display: "inline-block",
                                                textAlign: "center"
                                            }}
                                        >
                                            <Button
                                                color="primary"
                                                name="simpan"
                                                onClick={(evt) => this.updatePointTabelBatch({ ...this.state.currentPoint }, evt)}
                                            >
                                                <MdSave
                                                    disabled={this.state.btnSimpanUpdate}
                                                    style={{ marginRight: "5" }}>
                                                </MdSave>Ok
                                            </Button>

                                        </ModalFooter>
                                    </Modal>

                                </ButtonGroup>
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <NotificationSystem
                                        dismissible={false}
                                        ref={notificationSystem =>
                                            (this.notificationSystem = notificationSystem)
                                        }
                                        style={NOTIFICATION_SYSTEM_STYLE} />

                                    <thead>
                                        <tr align="center">
                                            <th align="center">Procode</th>
                                            <th align="center">Nama Product</th>
                                            <th align="center">Batch Number</th>
                                            <th align="center">Exp Date</th>
                                            <th align="center">Qty Kebutuhan</th>
                                            <th align="center">Qty Booking</th>
                                            <th align="center">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <Modal
                                            isOpen={this.state.isLoading}
                                            style={{
                                                position: "relative",
                                                marginTop: "20%",
                                                width: "15%",
                                                opacity: "100%"
                                            }}
                                        >

                                            <ModalBody>
                                                <Form
                                                    style={{
                                                        textAlign: "center",
                                                        display: "block",
                                                    }}
                                                >    <ClipLoader
                                                    style={{ align: 'center' }}
                                                    size={90}
                                                    color={"#123abc"}></ClipLoader>
                                                </Form>
                                            </ModalBody>
                                        </Modal>

                                        {renderTodos}

                                    </tbody>
                                </Table>
                                {/* <LoadingSpinner status={5} isOpen={this.state.isLoading} /> */}
                                <hr />

                                <InputGroup>

                                    {/* button save dan cancel */}
                                    <Button style={{ marginLeft: '65%' }} onClick={this.toggleSaveAll.bind(this)}>
                                        Save DO

                                     </Button>
                                    <Modal size="lg" isOpen={this.state.saveSPAddHoModalIsIopen}>
                                        <ModalHeader toggle={this.toggleCancelSaveAll.bind(this)}>
                                            Konfirmasi Save
                                        </ModalHeader>

                                        <ModalBody>
                                            Apakah Anda yakin ingin menambah data ini?
                                        </ModalBody>

                                        <ModalFooter
                                            style={{
                                                display: "inline-block",
                                                textAlign: "center"
                                            }}
                                        >
                                            <Button
                                                color="primary"
                                                onClick={

                                                    () => this.SimpanDO()
                                                }
                                            >
                                                <MdSave
                                                    style={{ marginRight: "5" }}>
                                                </MdSave>Simpan DO

                                        </Button>

                                            <Button
                                                color="danger"
                                                onClick={this.toggleCancelSaveAll.bind(this)}
                                            >
                                                <MdClose
                                                    style={{ marginRight: "5" }}
                                                />Batal
                                        </Button>
                                        </ModalFooter>
                                    </Modal>

                                    <Button style={{ marginLeft: '1%' }} a href="/SPAddHO">
                                        Cancel
                                     </Button>
                                </InputGroup>
                                <br />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }
}
export default AddSPHODetail 
// testttt loging

