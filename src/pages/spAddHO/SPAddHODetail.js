import Page from 'components/Page';
import React from 'react';
import * as myUrl from '../urlLinkMasterG';
import {
    Button, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label, InputGroup, FormFeedback,
    InputGroupAddon, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown, Spinner, ButtonGroup
} from 'reactstrap';
import { MdHighlightOff, MdSearch, MdArrowBack, MdPrint, MdEdit, MdDelete, MdSave, MdClose, MdDetails, MdDone } from 'react-icons/md';
import Select from 'react-select';
import LoadingSpinner from '../LoadingSpinner';
import ClipLoader from "react-spinners/ClipLoader";
import Axios from 'axios'
import * as myUrl2 from '../urlLink';
import * as Moment from 'moment'

class SPAddHODetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            todosGetDetail: [],
            isLoading: true,
            keyword: "",
            currentPage: 1,
            todosPerPage: 5,
            totalData: 0,
            flag: 0,
            currentData: 0,
            lastData: 0,
            displayStatus: "none",
            selectedDropdown: "Show All",
            searchType: "",
            value: 1,
            listVia: [],
            listDilayaniOleh: [],
            currentVia: '',
            currentDilayaniOleh: '',
            listReason: [],
            activeGroup: window.localStorage.getItem("groupID"),
            activeGudangID: window.localStorage.getItem("gID"),
            gudangAsal: window.localStorage.getItem("gName"),
            editDetailModalIsOpen: false,
            removeDetailModalIsOpen: false,
            responseModalIsOpen: false,
            spids : this.props.spids
        };
    }

    //run at the start of the page
    componentDidMount() {
        // this.getTotalReasonPage();
        this.getDetailDataSPAddHO();
        // this.getReason();
        // var gudangName = window.localStorage.getItem('gName');
        // this.props.setTitle('DETAIL SP DO '+ gudangName, 'red');
    }

    //empty all input box
    resetInput() {
        this.setState({
            inputtedName: ''
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


    // modal edit button
    // TO DO : kosongin semua active bla2
    toggleEditDetailModal = () => {
        this.setState({
            editDetailModalIsOpen: !this.state.editDetailModalIsOpen,
            editConfirmationModalIsOpen: this.state.editConfirmationModalIsOpen,
            // responseEditModalIsOpen: this.state.responseEditModalIsOpen,
            // validinputtoppoint: false,
            // isEnabled: true,

            // activeProcod : "",
        })
    }
    // modal remove button close
    toggleRemoveDetailModal = () => {
        this.setState({
            removeDetailModalIsOpen: !this.state.removeDetailModalIsOpen,
            removeConfirmationModalIsOpen: this.state.removeConfirmationModalIsOpen

        })
    }

    toggleEditConfirmationModal = () => {
        this.setState({
            editConfirmationModalIsOpen: !this.state.editConfirmationModalIsOpen

        })
    }
    toggleRemoveConfirmationModal = () => {
        this.setState({
            removeConfirmationModalIsOpen: !this.state.removeConfirmationModalIsOpen

        })
    }

    // modal response
    toggleResponseModal = () => {
        this.setState({
            responseModalIsOpen: !this.state.responseModalIsOpen,
        })
    }
    // close modal response
    closeModalResponse() {
        this.setState({
            responseModalIsOpen: false,
            removeDetailModalIsOpen : false,
            removeConfirmationModalIsOpen:false,
        }, () => this.getDetailDataSPAddHO())
        
    }

    toggleCloseEditConfirmationModal = () => {
        this.setState({
            editConfirmationModalIsOpen: !this.state.editConfirmationModalIsOpen,
            editDetailModalIsOpen: !this.state.editDetailModalIsOpen
        })
    }
    toggleCloseRemoveConfirmationModal = () => {
        this.setState({
            removeConfirmationModalIsOpen: !this.state.removeConfirmationModalIsOpen,
            removeDetailModalIsOpen: !this.state.removeDetailModalIsOpen,
        })
    }

    openEditDetailModalWithItemID(outcode, nosp, procod, batch, qty, noorder, kategori, ronaldo) {
        this.setState({
            editDetailModalIsOpen: true,
            activeOutcode: outcode,
            activeNoSP: nosp,
            activeProcod: procod,
            activeBatch: batch,
            activeQty: qty,
            activeNoOrder: noorder,
            activceCategory: kategori,
            activeRonaldo: ronaldo,
            validinputtopid: true,
            validinputtopname: true
        })
    }

    openRemoveDetailModalWithItemID(todo) {
        console.log("aaaaaaa", todo);
        this.setState({
            removeDetailModalIsOpen: true,
            outcodeRemove: todo.Spcd_OutCodeOutlet,
            nospRemove: todo.Spcd_NoSP,
            procodeRemove: todo.Spcd_Procod,
            pronameRemove: todo.Spcd_Proname,
            batchRemove: todo.Spcd_Batch ? todo.Spcd_Batch[0].orderlcl_batchnumber : "",
            qtyBatchRemove: todo.Spcd_Batch ? todo.Spcd_Batch[0].orderlcl_expdate : "",
            EDRemove: todo.Spcd_Batch ? todo.Spcd_Batch[0].orderlcl_expdate : "",
            qtyRemove: todo.Spcd_Quantity,
            groupRemove: todo.Spcd_Group,
            codeDepoRemove: todo.Spcd_OutCodeDepo,
            gudandIDRemove: todo.Spcd_GudangId,
            categoryProductRemove: todo.Spcd_CategoryProduct,
            ronaldoRemove: todo.Spcd_Ronaldo,
            yearRemove: todo.Spcd_Year,
            spidRemove: todo.Spcd_SpId,


        }, () => this.setState({
            // prevPoint: point
        }))
    }

    //function connection out
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
            })
        }
    }

    //set Page Limit
    handleSelect(event) {
        this.setState({
            [event.target.name]: parseInt(event.target.value), currentPage: 1
        }, () => {
            this.componentDidMount();
        });
    }

    //set Current Page
    handleWrite(event, flag, forl) {
        if (forl == "first") {
            this.state.currentData = 1;
        } else if (forl == "last") {
            this.state.currentData = this.state.lastData;
        } else {
            this.state.currentData = Number(event.target.value) + flag;
            if (this.state.currentData < 1) {
                this.state.currentData = 1;
            }
            else if (this.state.currentData > this.state.lastData) {
                this.state.currentData = this.state.lastData;
            }
        }
        this.setState({
            currentPage: this.state.currentData
        }, () => {
            if (flag !== 0) {
                this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
            }
        });
    }

    enterPressed = (event, search) => {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            event.preventDefault();
            this.setState({ currentPage: 1 }
                , () => {
                    this.getTotalReasonPage();
                });
        }
    }

    getTotalReasonPage() {
        const urlA = myUrl.url_getTotalReasonPage;
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({
                type: this.state.searchType,
                keyword: this.state.keyword,
                limit: this.state.todosPerPage.toString()
            })
        };
        fetch(urlA, option)
            .then(response => response.json())
            .then(data => {
                if (data == 0) {
                    this.setState({
                        responseHeader: "Alert!!!",
                        responseMessage: "Data is empty!",
                        result: [],
                        modal_response: true,
                        isLoading: false
                    });
                }
                else {
                    this.setState({ lastData: data }, () => this.getListbyPaging(this.state.currentPage, this.state.todosPerPage));
                }
            }, () => this.connectionOut("Can't reach the server", false));
    }

    getListbyPaging(currPage, currLimit) {
        const urlA = myUrl.url_getListReason;
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify({
                type: this.state.searchType,
                keyword: this.state.keyword,
                offset: ((currPage - 1) * currLimit).toString(),
                limit: currLimit.toString()
            })
        }
        fetch(urlA, option)
            .then(response => response.json())
            .then(data => {
                this.setState({ result: data, isLoading: false })
            }, () => this.connectionOut("Can't reach the server", false));
    }

    getReason = async () => {
        Axios.post('https://api.docnet.id/CHCMasterG/getReasonList', {
            offset: "0",
            keyword: "",
            limit: "10"
        }).then(response => {
            if (response.data.data === null) {
                this.setState({
                    noDataMessage: "block"
                })
            }
            else {
                this.setState({
                    noDataMessage: "none",
                    listReason: response.data.data
                })
            }
        })
            .catch(error => {
                setTimeout(() => this.getReason(), 5000);
                this.showNotification('Error: ' + error.message);
                return;
            })
    }

    // untuk menampilkan data detail dari list SPAddHO.js
    getDetailDataSPAddHO = () => {
        // var url = myUrl2.url_spaddho + '?type=detail&nosp=' + this.props.SpchNoSP + '&outcode=' + this.props.outcode + '&group=' + this.props.group + '&category=' + this.props.category + '&ronaldo=' + this.props.ronaldo + '&depo=' + this.props.depo
        var url = myUrl2.url_spaddho + '?type=detail&spid=' + this.props.spids 
        console.log("getDetailSPAddHO " + url)

        this.setState({
            valid: true,
            isLoading: true,
        })

        Axios.get(url)
            .then((res) => {
                console.log("resssssssssssss", res);
                if (res.data.error.status === true) {

                    this.setState({
                        isLoading: false,
                        noDataMessage: "block",
                        result: []
                    })

                } else {
                    if (res.data.data !== null) {
                        if (res.data.data.Spcd_Batch == null) {
                            this.setState({
                                isLoading: false,
                                noDataMessage: "block",
                                todosGetDetail: res.data.data,
                            })
                        } else {
                            this.setState({
                                todosGetDetail: res.data.data,
                                valid: false,
                                isLoading: false,

                                // Spcd_Group: this.state.group,
                                Spcd_Group1: res.data.data[0].Spcd_Group,
                                Spcd_OutCodeOutlet: res.data.data[0].Spcd_OutCodeOutlet,
                                Spcd_OutCodeSup: res.data.data[0].Spcd_OutCodeSup,
                                Spcd_OutCodeDepo: res.data.data[0].Spcd_OutCodeDepo,
                                Spcd_Wilayah: res.data.data[0].Spcd_Wilayah,
                                Spcd_NoSP: res.data.data[0].Spcd_NoSP,
                                Spcd_Procod: res.data.data[0].Spcd_Procod,
                                Spcd_Quantity: res.data.data[0].Spcd_Quantity,
                                Spcd_QuantityProcess: res.data.data[0].Spcd_QuantityProcess,
                                Spcd_NoOrder: res.data.data[0].Spcd_NoOrder,
                                Spcd_TglOrder: res.data.data[0].Spcd_TglOrder,
                                Spcd_Flag: res.data.data[0].Spcd_Flag,
                                Spcd_TglCancel: res.data.data[0].Spcd_TglCancel,
                                Spcd_GudangId: res.data.data[0].Spcd_GudangId,
                                Spcd_ActiveYN: res.data.data[0].Spcd_ActiveYN,
                                Spcd_UserId: res.data.data[0].Spcd_UserId,
                                Spcd_LastUpdate: res.data.data[0].Spcd_LastUpdate,
                                Spcd_DataAktifYN: res.data.data[0].Spcd_DataAktifYN,
                                Spcd_CategoryProduct: res.data.data[0].Spcd_CategoryProduct,
                                Spcd_Ronaldo: res.data.data[0].Spcd_Ronaldo,
                                Spcd_Year: res.data.data[0].Spcd_Year,
                                Spcd_SpId: res.data.data[0].Spcd_SpId,
                                Spcd_Via: res.data.data[0].Spcd_Via,

                                orderlcl_batchnumber: res.data.data[0].Spcd_Batch[0].orderlcl_batchnumber,
                                orderlcl_qtyorder: res.data.data[0].Spcd_Batch[0].orderlcl_qtyorder,
                                orderlcl_expdate: res.data.data[0].Spcd_Batch[0].orderlcl_expdate,
                                flag: res.data.data[0].Spcd_Batch[0].flag,

                                pro_name: res.data.data[0].pro_name,
                                pro_name2: res.data.data[0].pro_name2,
                                buypack_name: res.data.data[0].buypack_name,
                                medpack_name: res.data.data[0].medpack_name,
                                sellpack_name: res.data.data[0].sellpack_name,

                            })
                        }

                    } else {
                        this.setState({
                            todosGetDetail: res.data.data,
                            isLoading: false,
                            noDataMessage: "block",
                            result: []
                        })
                    }
                    
                }

            })
            .catch((error) => {
                alert('GAGAL MEMUAT DATA')
                this.setState({
                    isLoading: false,
                    // responseHeader: "GAGAL MEMUAT DATA",
                    // responseModalIsOpen: !this.state.responseModalIsOpen,
                })
                // this.toggleResponseModal()
            });
    }

    print(Spcd_SpId) {
        this.setState({isLoading:true})
        // const url = myUrl2.url_spaddho + '?type=print&nosp=' + this.props.SpchNoSP + '&outcode=' + this.props.outcode + '&group=' + this.props.group + '&category=' + this.props.category + '&ronaldo=' + this.props.ronaldo + '&depo=' + this.props.depo;
        const url = myUrl2.url_spaddho + '?type=print&spid=' + this.props.spids 
        console.log("url print : " + url)

        fetch(url)
            .then(response => {
                //const filename = response.headers.get('Content-Disposition').split('filename=')[1]
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob)
                    let a = document.createElement('a')
                    a.href = url
                    a.download = Spcd_SpId + ".pdf"
                    a.click();
                    this.setState({
                        isLoading:false,
                        bgColor: 'gray'
                    })
                })
            })
            .catch((error) => {
                alert(error.message)
                this.setState({
                    isLoading: false,
                })
            })
    }

    //untuk edit qty detail
    editQtyDetail = () => {
        var payload = [
            // activeOutcode: outcode,
            // activeNoSP: nosp,
            // activeProcod: procod,
            // activeBatch: batch,
            // activeQty: qty,
            {
                Spcd_Group: this.state.activeGroup,
                Spcd_OutCodeOutlet: this.props.depo,
                // Spcd_OutCodeSup: this.state.Spcd_OutCodeSup, 
                Spcd_OutCodeDepo: this.props.depo,
                // Spcd_Wilayah: this.state.Spcd_Wilayah, 
                Spcd_NoSP: this.state.activeNoSP,
                Spcd_Procod: this.state.activeProcod,
                Spcd_Quantity: parseInt(this.state.Spcd_Quantity), //
                Spcd_QuantityProcess: this.state.Spcd_QuantityProcess, // 
                Spcd_NoOrder: this.state.activeNoOrder,
                // Spcd_Flag: this.state.Spcd_Flag, //
                Spcd_GudangId: this.state.activeGudangID,
                Spcd_CategoryProduct: this.state.activceCategory,
                Spcd_Ronaldo: this.state.activeRonaldo,
                // Spcd_Year: this.state.Spcd_Year, //
                // Spcd_SpId: this.state.Spcd_SpId, //
                // Spcd_Via: this.state.Spcd_Via, //
                Spcd_Batch: [
                    {
                        orderlcl_batchnumber: this.state.activeBatch,
                        orderlcl_qtyorder: this.state.orderlcl_qtyorder,
                        // orderlcl_expdate: this.state.orderlcl_expdate,
                        // flag: this.state.flag

                    }
                ]
            }
        ]
        // console.log("payloadedit", payload)
        Axios.put(myUrl2.url_spaddho + '?Edit=SaveEditDataSpAddHoAll'
            , payload)
            .then((response) => {
                // console.log("response edit", response);
                if (response.status === 200) {
                    this.setState({
                        responseHeader: "BERHASIL MENYUNTING DATA",
                        responseMessage: "BERHASIL MENYUNTING DATA",
                        responseModalIsOpen: !this.state.responseModalIsOpen
                    })
                }
                else {
                    this.setState({
                        responseHeader: "GAGAL MENYUNTING DATA",
                        responseMessage: "GAGAL MENYUNTING DATA",
                    })
                }

                this.setState({
                    responseMessage: response.data.responseMessage,
                });

                this.toggleCloseEditConfirmationModal();
                this.getDetailDataSPAddHO();
            });
    }

    // untuk removeDetail
    // removeDetail = () => {
    //     var payload = {
    //         Spcd_Group: this.state.groupRemove,
    //         Spcd_OutCodeOutlet: this.state.outcodeRemove,
    //         Spcd_OutCodeDepo: this.state.codeDepoRemove,
    //         Spcd_NoSP: this.state.nospRemove,
    //         Spcd_Procod: this.state.procodeRemove,
    //         Spcd_GudangId: this.state.gudandIDRemove,
    //         Spcd_CategoryProduct: this.state.categoryProductRemove,
    //         Spcd_Ronaldo: this.state.ronaldoRemove,
    //         Spcd_Year: this.state.yearRemove
    //     }

    //     Axios.delete(myUrl2.url_spaddho + '?Delete=DeleteProcode', payload)
    //         .then((res) => {
    //             // console.log("removepayload",payload);
    //             this.toggleCloseRemoveConfirmationModal();
    //             this.getDetailDataSPAddHO();
    //         });
    // }

    removeBatchNew = (itemSave = this.state.itemSave) => {
        this.setState({isLoading:true})
        var urlRemoveBatch = (myUrl2.url_spaddho + '?edit');
        console.log("urlRemoveBatch", urlRemoveBatch)
        var payload = {
            cancel: {
                Spcd_NoSP: this.state.nospRemove,
                Spcd_Procod: this.state.procodeRemove,
                Spcd_Quantity: parseInt(this.state.qtyRemove),
                Spcd_Batch: this.state.batchRemove,
                Spcd_Expdate: this.state.EDRemove,
                Spcd_SpId: this.state.spidRemove,
                Spcd_OutCodeDepo: this.state.codeDepoRemove,
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

        console.log("payload remove", option)
        fetch(urlRemoveBatch, option)

            .then(response => {
                console.log("response book", response)
                if (response.ok) {
                    console.log("1");
                    return response.json()
                } else {
                    console.log("2");
                    this.toggleAddConfirmationTopModal()
                }
            }).then(data => {
                if (data.error.status === false) {
                    console.log("3");
                    this.setState({
                        responseModalIsOpen: !this.state.responseModalIsOpen,
                        responseHeader: "BERHASIL",
                        isLoading: false,
                    })
                } else {
                    console.log("4");
                    this.setState({
                        responseModalIsOpen: !this.state.responseModalIsOpen,
                        responseHeader: "GAGAL",
                        isLoading: false,
                    })
                }
            })
            .catch((error) => {
                console.log("5");
                alert(error.message)
                this.setState({
                    isLoading: false,
                })
            })
    }

    

    handleChange = (type, event) => {
        if (type === "editQtyDetail") {
            // console.log("evt" + event.Spcd_Quantity)
            this.setState({
                Spcd_Quantity: event.target.value
            }, () => this.validateField(type, this.state.Spcd_Quantity));
        }
    };

    validateField(type, value) {

    }


    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested_parent_edit: false,
        modal_nested: false,
        modal_nested_edit: false,
        backdrop: true,
        modal_delete: false,
        modal_response: false,
        responseHeader: "",
        responseMessage: "",

        editConfirmationModalIsOpen: false,
        removeConfirmationModalIsOpen: false,
    };

    toggle = modalType => () => {
        // console.log(modalType);
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    //search dropdown
    updateSelectionValue(evt) {
        if (evt.target.value === "No SP") {
            this.setState({
                selectedDropdown: evt.target.value,
                searchType: "nosp",
                displayStatus: 'inline-flex'
            })
        }
        else if (evt.target.value === "Gudang Tujuan") {
            this.setState({
                selectedDropdown: evt.target.value,
                searchType: "untukoutlet",
                displayStatus: 'inline-flex'
            })
        }
        else if (evt.target.value === "Show All") {
            this.setState({
                selectedDropdown: evt.target.value,
                searchType: "all",
                keyword: "",
                displayStatus: 'none',
            }, () => {
                this.componentDidMount();
            });
        }
    }

    enterPressed = (event, search) => {
        var code = event.keyCode || event.which;
        if (code === 13) { //13 is the enter keycode
            event.preventDefault();
            this.setState({ currentPage: 1 }
                , () => {
                    this.getTotalReasonPage();
                });
        }
    }

    updateSearchValue(evt) {
        this.setState({
            keyword: evt.target.value
        });
    }

    SearchbyButton = param => () => {
        this.setState({ currentPage: 1 }, () => { this.getTotalReasonPage(); });
    }

    backButton() {
        this.setState({
            value: 0
        })
    }

    // showPage = () => {
    //     this.setState({
    //         value: 1
    //     })
    // }


    updateOptionSelected(type, evt) {
        if (type == "via") {
            this.setState({
                currentVia: evt
            })
        }
        else if (type == "dilayanioleh") {
            this.setState({
                currentDilayaniOleh: evt
            })
        }
        else if (type === "reason") {
            // console.log("reason")
            this.setState({
                inputtedReason: evt.target.value
            })
        }
    }

    render() {
        const spID = this.state.Spcd_SpId;
        // todos = data dari result getdetail() 
        // array sebaiknya gunakan nama yang beda untuk masing2 API
        const { listReason } = this.state
        const lr = this.state.listReason
        const currentTodos = this.state.todosGetDetail;
        // renderTodos dipanggil di <tbody>
        //  hasil response dimapping sesuai dengan kebutuhan penempatan data 
        const renderTodos = currentTodos && currentTodos.map((todo) => {

            var spcd_flag = todo.Spcd_Flag

            // console.log("to do spcd flag : " + todo.Spcd_Flag)
            if (spcd_flag === 'N') {
                spcd_flag = 'Belum di-scan'
            }
            else if (spcd_flag === 'R') {
                spcd_flag = 'Sudah Receive'
            }
            else if (spcd_flag === 'D') {
                spcd_flag = 'Sudah DO, Belum Receive'
            }
            else {
                spcd_flag = 'Cancel'
            }

            if (todo.Spcd_Batch !== null) {
                var spcd_batch = todo.Spcd_Batch[0].orderlcl_batchnumber
            } else {
                spcd_batch = "no batch"
            }
            // console.log("spcd_flag" + spcd_flag)
            return <tr align="left">

                <td> {todo.Spcd_Procod}</td>
                <td> {spcd_batch}</td>
                <td> {todo.Spcd_Proname}</td>
                <td> {todo.Spcd_Quantity}</td>
                <td> {todo.sellpack_name}</td>
                {/* <td> {todo.Spcd_Batch[0].orderlcl_qtyorder}</td> */}
                <td> {todo.Spcd_Batch ? todo.Spcd_Batch[0].orderlcl_qtyorder : "-"}</td>
                <td> {spcd_flag}</td>
                <td> {todo.Spcd_NoOrder}</td>
                <td> {Moment(todo.Spcd_TglOrder).format("YYYY-MM-DD")}</td>
                <td> {todo.medpack_name}</td>
                <td>
                    {/* <Button
                        // onClick memunculkan modal edit
                        onClick={() => this.openEditDetailModalWithItemID(todo.Spcd_OutCodeOutlet, todo.Spcd_NoSP, todo.Spcd_Procod, todo.Spcd_Batch[0].orderlcl_batchnumber, todo.Spcd_Quantity, todo.Spcd_NoOrder, todo.Spcd_CategoryProduct, todo.Spcd_Ronaldo)}
                        color="success"
                        size="md"
                        style={{
                            display: "inline-flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: ".5vw",
                        }}><MdEdit />
                    </Button> */}

                    <Button
                        // onClick memunculkan modal delete
                        onClick={() => this.openRemoveDetailModalWithItemID(todo)}
                        color="danger"
                        size="md"
                        style={{
                            marginLeft: ".5vw",
                            display: "inline-flex",
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}><MdDelete />
                    </Button>
                </td>
            </tr>

        });

        return (
            <Page>
                <Modal
                    // modal edit
                    isOpen={this.state.editDetailModalIsOpen}>
                    <ModalHeader
                        toggle={this.toggleEditDetailModal.bind(this)}
                    >Edit Detail
                </ModalHeader>

                    <ModalBody>
                        <Label>No. SP</Label>
                        <Row>
                            <Col xs={3} md={3}>
                                <Input disabled value={this.props.outCodeOutlet} />
                            </Col>
                            <Col xs={7} md={7}>
                                <Input disabled value={this.state.activeNoSP} />
                            </Col>
                        </Row>

                        <br />

                        <Label>Procod</Label>

                        <Input
                            disabled
                            type="text"
                            value={this.state.activeProcod}
                        />

                        <br />

                        <Label>Batch Number</Label>

                        <Input
                            disabled
                            type="text"
                            value={this.state.activeBatch}
                        />

                        <br />

                        <Label>Qty</Label>
                        <Input
                            type="number"
                            valid={this.state.validinputtoppoint}
                            invalid={!this.state.validinputtoppoint}
                            value={this.state.Spcd_Quantity}
                            onInput={(e) => this.handleChange("editQtyDetail", e)} />
                        {this.state.validinputtoppoint === false &&
                            <FormFeedback>
                                Qty little or too much or empty or not edited
                                </FormFeedback>
                        }

                    </ModalBody>

                    <ModalFooter
                        style={{
                            display: "inline-block",
                            textAlign: "center"
                        }}
                    >
                        <Button
                            color="primary"
                            disabled={this.state.isEnabled}
                            onClick={() => this.toggleEditConfirmationModal()}>
                            <MdSave
                                style={{ marginRight: "5" }}>
                            </MdSave>Simpan
                        </Button>

                        <Button
                            color="danger"
                            onClick={this.toggleEditDetailModal}>
                            <MdClose
                                style={{ marginRight: "5" }} />Batal
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* Confirm Edit */}
                <Modal
                    isOpen={this.state.editConfirmationModalIsOpen}>

                    <ModalHeader
                        toggle={this.toggleEditConfirmationModal.bind(this)}
                    >Konfirmasi
                </ModalHeader>

                    <ModalBody>
                        Apakah Anda yakin ingin menyunting data ini?
                </ModalBody>

                    <ModalFooter
                        style={{
                            display: "inline-block",
                            textAlign: "center"
                        }}
                    >
                        <Button
                            color="primary"
                            onClick={() => this.editQtyDetail()}
                        ><MdDone
                                style={{
                                    marginRight: "5"
                                }}
                            />Ya
                    </Button>

                        <Button
                            color="secondary"
                            onClick={this.toggleEditConfirmationModal.bind(this)}
                        ><MdClose
                                style={{
                                    marginRight: "5"
                                }}
                            />Tidak
                    </Button>
                    </ModalFooter>
                </Modal>


                <Modal
                    //modal remove
                    isOpen={this.state.removeDetailModalIsOpen}>
                    <ModalHeader
                        toggle={this.toggleRemoveDetailModal.bind(this)}
                    >Remove Detail
                </ModalHeader>

                    <ModalBody>
                        <Label>No. SP</Label>
                        <Row>
                            {/* <Col xs={3} md={3}> */}
                            {/* <Input disabled value={this.props.outCodeOutlet} /> */}
                            {/* </Col> */}
                            <Col xs={7} md={7}>
                                <Input disabled value={this.state.nospRemove} />
                            </Col>
                        </Row>

                        <br />

                        <Label>Procod</Label>

                        <Input
                            disabled
                            type="text"
                            value={this.state.procodeRemove}
                        />

                        <br />

                        <Label>Proname</Label>

                        <Input
                            disabled
                            type="text"
                            value={this.state.pronameRemove}

                        />

                        <br />

                        <Label>Batch Number</Label>

                        <Input
                            disabled
                            type="text"
                            value={this.state.batchRemove}
                        />

                        <br />
                        {/* <Label>QTY</Label>
                        <Input
                            disabled
                            type="text"
                            value={this.state.qtyRemove}
                        />
                        <br />
                        <Label>QTY DO</Label>
                        <Input
                            disabled
                            type="text"
                            value={this.state._}
                        />
                        <br /> */}

                        {/* <Label>Alasan Cancel</Label>
                        <select
                            name="reason"
                            style={{
                                width: "100%",
                                height: "3.5vw"
                            }}
                            onChange={evt => this.updateOptionSelected('reason', evt)}
                        >
                            <option value="" disabled selected>PILIH ALASAN</option>
                            {listReason.map(lr =>
                                <option value={lr.Rsn_Code}>{lr.Rsn_Name}</option>
                            )}
                        </select> */}

                    </ModalBody>

                    <ModalFooter
                        style={{
                            display: "inline-block",
                            textAlign: "center"
                        }}
                    >
                        <Button
                            color="primary"
                            disabled={this.state.isEnabled}
                            onClick={() => this.toggleRemoveConfirmationModal()}>
                            <MdSave
                                style={{ marginRight: "5" }}>
                            </MdSave>Simpan remove
                        </Button>

                        <Button
                            color="danger"
                            onClick={this.toggleRemoveDetailModal}>
                            <MdClose
                                style={{ marginRight: "5" }} />Batal
                        </Button>
                    </ModalFooter>
                </Modal>

                {/* todo123 */}
                <Modal
                    isOpen={this.state.removeConfirmationModalIsOpen}>

                    <ModalHeader
                        toggle={this.toggleRemoveConfirmationModal.bind(this)}
                    >Konfirmasi
                </ModalHeader>

                    <ModalBody>
                        Apakah Anda yakin ingin menghapus data ini?
                </ModalBody>

                    <ModalFooter
                        style={{
                            display: "inline-block",
                            textAlign: "center"
                        }}
                    >
                        <Button
                            color="primary"
                            onClick={() => this.removeBatchNew()}
                        ><MdDone
                                style={{
                                    marginRight: "5"
                                }}
                            />Ya remove batch
                    </Button>

                        <Button
                            color="secondary"
                            onClick={this.toggleRemoveConfirmationModal.bind(this)}
                        ><MdClose
                                style={{
                                    marginRight: "5"
                                }}
                            />Tidak
                    </Button>
                    </ModalFooter>
                </Modal>

                {/* {value===1 && */}
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardHeader className="d-flex justify-content-between">
                                <Button color="primary" size="sm" onClick={this.props.showPage}><MdArrowBack />Back</Button>
                                <Button disabled={!this.state.todosGetDetail} color="info" size="sm" onClick={() => this.print(this.state.todosGetDetail[0].Spcd_SpId)}><MdPrint /> Print</Button>
                            </CardHeader>
                            <CardHeader className="d-flex justify-content-between">
                                {/* <UncontrolledButtonDropdown
                                    style={{
                                        marginRight: "1.5vw"
                                    }}
                                >
                                    <DropdownToggle caret name="filtermenu" color="primary">
                                        {this.state.selectedDropdown}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem value="Show All" onClick={evt => this.updateSelectionValue(evt)}>Show All</DropdownItem>
                                        <DropdownItem value="No SP" onClick={evt => this.updateSelectionValue(evt)}>No SP</DropdownItem>
                                        <DropdownItem value="Gudang Tujuan" onClick={evt => this.updateSelectionValue(evt)}>Gudang Tujuan</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledButtonDropdown> */}
                                <Input
                                    type="search"
                                    className="cr-search-form__input"
                                    placeholder="Search"
                                    onKeyPress={(e) => this.enterPressed(e, false)}
                                    style={{
                                        marginRight: "0.5vw",
                                        display: this.state.displayStatus
                                    }}
                                    onChange={evt => this.updateSearchValue(evt)}>
                                </Input>
                                <Button
                                    size="md"
                                    style={{
                                        marginRight: "0.5vw",
                                        display: this.state.displayStatus
                                    }}
                                    onClick={this.SearchbyButton()}>
                                    <MdSearch />
                                </Button>
                                <ButtonGroup>
                                    <Button size="sm" a href="/AddSPHODetail">Add</Button>
                                    {/* <Button color="info" size="sm" onClick={() => this.deleteSP(this.props.SPID)}><MdDelete /> DELETE SP</Button> */}
                                </ButtonGroup>

                                <Modal
                                    //{this.setState({})}
                                    isOpen={this.state.modal_nested_parent_edit}
                                    toggle={this.toggle('nested_parent_edit')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent_edit')}>
                                        Edit Alasan Retur
                                        </ModalHeader>
                                    <ModalBody>
                                        <Label>Alasan Retur Name</Label>
                                        <Input type="namareason" value={this.state.editName}
                                            onChange={evt => this.updateEditValue(evt)} autoComplete="off" name="namareason" />
                                    </ModalBody>
                                    <ModalFooter>
                                        {/* <Button color="info" onClick={this.saveEditReasonKosong(this.state.editName)}>
                                                Save
                                            </Button> */}
                                        <Modal
                                            isOpen={this.state.modal_nested_edit}
                                            toggle={this.toggle('nested_edit')}
                                        >
                                            <ModalHeader>Confirmation</ModalHeader>
                                            <ModalBody>Are you sure to save the data?</ModalBody>
                                            <ModalFooter>
                                                {/* <Button color="success" onClick={this.editMasterReason(this.state.editName, this.state.editCode)}>
                                                        <MdCheckCircle/> Yes
                                                    </Button>{' '} */}
                                                <Button
                                                    color="danger"
                                                    onClick={this.toggle('nested_edit')}>
                                                    <MdHighlightOff /> No
                                                    </Button>
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="danger" onClick={this.toggle('nested_parent_edit')}>
                                            Cancel
                                            </Button>
                                    </ModalFooter>
                                </Modal>
                                <Modal
                                    isOpen={this.state.modal_response}
                                    toggle={this.toggle('response')}
                                >
                                    <ModalHeader>
                                        {this.state.responseHeader}
                                    </ModalHeader>
                                    <ModalBody>
                                        {this.state.responseMessage}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="success" onClick={() => { this.setState({ modal_response: false, modal_nested: false, modal_nested_edit: false }) }}>Ok</Button>
                                    </ModalFooter>
                                </Modal>



                                <Modal
                                    isOpen={this.state.modal_delete}
                                    toggle={this.toggle('delete')}>
                                    <ModalHeader>Confirmation</ModalHeader>
                                    <ModalBody>Are you sure to delete the data?</ModalBody>
                                    <ModalFooter>
                                        {/* <Button color="success" onClick={this.setReasonNotActive(this.state.activeItemId)}>
                                                Yes
                                            </Button>{' '} */}
                                        <Button
                                            color="danger"
                                            onClick={this.toggle('delete')}>
                                            No
                                            </Button>
                                    </ModalFooter>
                                </Modal>
                                {/*</ButtonGroup>*/}

                                {/* modal response */}
                                <Modal isOpen={this.state.responseModalIsOpen}>
                                    <ModalHeader
                                        toggle={this.toggleResponseModal.bind(this)}
                                    >
                                        {this.state.responseHeader}
                                    </ModalHeader>
                                    <ModalFooter>
                                        <Button
                                            color="primary"
                                            onClick={this.closeModalResponse.bind(this)}
                                        >
                                            OK
                                     </Button>
                                    </ModalFooter>
                                </Modal>
                            </CardHeader>


                            <CardBody>
                                <Form style={{ marginTop: 0, marginBottom: 0 }}>
                                    <Row style={{ marginTop: 0, marginBottom: 0 }} >
                                        <Label style={{ marginBottom: 0, paddingBottom: 0, paddingTop: 0 }} md={1} xs={1}>No. SP</Label>
                                        <Col style={{ marginBottom: 0 }}>
                                            <Row style={{ marginBottom: 0 }}>
                                                <Col xs={10} md={10} style={{ marginBottom: 0 }}>
                                                    <Input disabled value={this.props.SpchNoSP} />
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Label style={{ marginBottom: 0, paddingBottom: 0, paddingTop: 0 }} md={1} xs={1}>Type</Label>
                                        <Col>
                                            <Row>
                                                <Col xs={6} md={6}>
                                                    <Input disabled value={this.props.ronaldo} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>


                                    <Row style={{ marginTop: 0 }} >
                                        <Label md={1} xs={1}>Gudang Tujuan</Label>
                                        <Col>
                                            <Row>
                                                <Col xs={3} md={3}>
                                                    <Input disabled value={this.props.outCodeOutlet} />
                                                </Col>
                                                {/* <Col xs={7} md={7}>
                                                    <Input disabled value="Kadu" />
                                                </Col> */}
                                            </Row>
                                        </Col>

                                        <Label md={1} xs={1}>Status Print</Label>
                                        <Col>
                                            <Row>
                                                <Col xs={6} md={6}>
                                                    <Input disabled value={this.props.flag === 'P' ? 'Printed' : 'UnPrinted'} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: 0 }} >
                                        <Label md={1} xs={1}>Tgl SP</Label>
                                        <Col>
                                            <Row>
                                                <Col xs={10} md={10}>
                                                    <Input disabled type="date" value={Moment(this.props.tglSP).format("YYYY-MM-DD")} />
                                                </Col>

                                            </Row>
                                        </Col>

                                        <Label md={1} xs={1}>Status Active</Label>
                                        <Col>
                                            <Row>
                                                <Col xs={6} md={6}>
                                                    <Input disabled value={this.props.activeyn === 'Y' ? 'Active' : 'InActive'} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: "0" }} >
                                        <Label md={1} xs={1}>Via</Label>
                                        <Col>
                                            <Row>
                                                <Col xs={3} md={3}>
                                                    <Input disabled value={this.props.via} />
                                                </Col>
                                                <Col xs={7} md={7}>
                                                    <Input disabled value={this.props.via} />
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Label md={1} xs={1}>User</Label>
                                        <Col>
                                            <Row>
                                                <Col xs={6} md={6}>
                                                    <Input disabled value={this.props.userId} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    <Row form>
                                        <Label md={1} xs={1}>Gudang asal</Label>
                                        <Col>
                                            <Row>
                                                <Col xs={3} md={3}>
                                                    <Input disabled value={this.props.outcode} />
                                                </Col>
                                                <Col xs={7} md={7}>
                                                    <Input disabled value={this.state.gudangAsal} />
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Form>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>Procod</th>
                                            <th>Batch Number</th>
                                            <th>Nama Product</th>
                                            <th>QTY</th>
                                            <th>Sellpack</th>
                                            <th>QTY DO</th>
                                            <th>Status</th>
                                            <th>Order</th>
                                            <th>Tgl Order</th>
                                            <th>Pack</th>
                                            <th>Action</th>
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
                                                >
                                                    <ClipLoader
                                                        style={{ align: 'center' }}
                                                        size={90}
                                                        color={"#123abc"}></ClipLoader>
                                                </Form>
                                            </ModalBody>
                                        </Modal>

                                        {/* {this.state.valid === false && */}
                                        {renderTodos}
                                        {/* } */}
                                    </tbody>
                                </Table>
                                {this.state.isLoading && <span style={{ marginLeft: '43%', marginRight: '43%' }}>TIDAK ADA DATA</span>}
                                <hr />

                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">Data / Page</InputGroupAddon>
                                    <select
                                        name="todosPerPage"
                                        style={{
                                            height: 'auto'
                                        }}
                                        value={this.state.todosPerPage}
                                        onChange={(e) => this.handleSelect(e)}>
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                    </select>
                                </InputGroup>

                                <br />

                                <Form
                                    inline
                                    className="cr-search-form"
                                    onSubmit={e => e.preventDefault()}
                                    style={{
                                        justifyContent: "center"
                                    }}
                                >
                                    <Button
                                        value={this.state.currentPage}
                                        onClick={(e) => this.handleWrite(e, -1, "first")}>First</Button>
                                    <Button
                                        value={this.state.currentPage}
                                        onClick={(e) => this.handleWrite(e, -1)}>Prev</Button>
                                    <form >
                                        <input
                                            type="text"
                                            placeholder="Page"
                                            value={this.state.currentPage}
                                            onKeyPress={(e) => this.enterPressed(e, false)}
                                            onChange={(e) => this.handleWrite(e, 0)}
                                            style={{
                                                width: '25px',
                                                height: '38px',
                                                textAlign: 'center'
                                            }}
                                        />
                                    </form>
                                    <Button
                                        value={this.state.currentPage}
                                        onClick={(e) => this.handleWrite(e, 1)}>Next</Button>

                                    <Button
                                        value={this.state.currentPage}
                                        onClick={(e) => this.handleWrite(e, 1, "last")}>Last</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* {value===0 &&
                    <Page>
                        <SPAddHO  func = {()=>this.showPage()}/>
                    </Page>
                } */}
            </Page>


        );
    }


}
export default SPAddHODetail;
