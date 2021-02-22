import Page from 'components/Page';
import React from 'react';
import * as myUrl from '../urlLinkMasterG';
import {
    Button, Card, CardBody, CardHeader, Col, Row, Table, Input, Label, InputGroup,
    InputGroupAddon, Form, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledButtonDropdown,
    Spinner, ButtonGroup, Modal, ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import { MdSearch, MdDetails, MdDelete, MdVisibility, MdSave, MdClose } from 'react-icons/md';
import SPAddHODetail from './SPAddHODetail';
import Axios from 'axios'
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
// import url_spaddho  from '../urlLink'
import * as myUrl2 from '../urlLink';
import LoadingSpinner from '../LoadingSpinner';
import ClipLoader from "react-spinners/ClipLoader";
import * as Moment from 'moment'
const options = [
    { value: '1', label: 'Apotik' },
    { value: '2', label: 'Floor' },
];
class SPAddHOPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

            result: [],
            todos: [],
            isLoading: false,
            valid: false,
            noDataMessage: 'none',

            searchInput: '',
            searchType: 'Kategori',
            searchTypeSub: 'Sub Kategori',
            disabled: true,
            disabledsub: true,
            tampilkanSemuaDataDisplay: "none",
            searchKeyword: '',

            maxPage: 1,
            page: 1,
            length: 5,
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
            inputtedPurchasingArea: window.localStorage.getItem("gID"),
            displayStatus: "none",
            value: 0,
            lastspid: "",
            toggledeletesp: false,
            modaldeletesp: false,

            responseModalIsOpen: false,
        };
    }

    //run at the start of the page
    componentDidMount() {
    }

    Masuk = () => {
        window.localStorage.setItem('groupID', this.state.inputtedGroup);
        this.props.history.push('/AddSPHODetail');
    };
    //empty all input box
    resetInput() {
        this.setState({
            inputtedName: ''
        })
    }

    toggleResponseModal = () => {
        this.setState({
            responseModalIsOpen: !this.state.responseModalIsOpen,
        })
    }
    closeModalResponse() {
        this.setState({
            responseModalIsOpen: false,
            modaldeletesp:false,
            // removeDetailModalIsOpen : false,f
        }, () => this.getDataSPAddHO())

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

    showNotification = currMessage => {
        setTimeout(() => {
            if (!this.notificationSfystem) {
                return;
            }
            this.notificationSystem.addNotification({
                title: <MdDetails />,
                message: currMessage,
                level: 'info',
            });
        }, 100);
    };

    //set Page Limit
    handleSelect(event) {
        this.setState({
            todosPerPage: parseInt(event.target.value),
        }, () => {
            this.getDataSPAddHO();
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
        if (code === 13) {
            //13 is the enter keycode
            event.preventDefault();
            this.setState({ currentPage: 1 }, () => {
                this.searchByType();
            });
        }
    }
    toggledeletesp = (spid) => {
        this.setState({
            modaldeletesp: !this.state.modaldeletespm,
            activeSPID: spid
        }, console.log("spidddddd", spid))
    }

    getTotalReasonPage() {
        const urlA = myUrl.url_getTotalReasonPage;
        const option = {
            method: 'POST',
            json: true,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                type: this.state.searchType,
                keyword: this.state.keyword,
                limit: this.state.todosPerPage.toString(),
            }),
        };
        fetch(urlA, option)
            .then(response => response.json())
            .then(
                data => {
                    if (data == 0) {
                        this.setState({
                            responseHeader: 'Alert!!!',
                            responseMessage: 'Data is empty!',
                            result: [],
                            modal_response: true,
                            isLoading: false,
                        });
                    } else {
                        this.setState({ lastData: data }, () => this.getListbyPaging(this.state.currentPage, this.state.todosPerPage));
                    }
                }, () => this.connectionOut("Can't reach the server", false));
    }

    paginationHandler = () => {
        // if ((this.state.keyword).trim() !== ""){
        //   this.searchByType();
        // }
        // else {
        this.getDataSPAddHO();
        // }
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

    //Fungsi Search
    updateSearchValue(evt) {
        this.setState({
            searchKeyword: evt.target.value.trim(),
        });
    }
    // ketika user milih kategori
    searchTypeHandle(evt) {
        if (evt.target.value === "Kategori") {
            this.setState({
                searchKeyword: "",
                page: 1,
                disabled: true,
                tampilkanSemuaDataDisplay: "none",
            })
            // ,() => this.getDataSPAddHO());
        }
        else {
            this.setState({
                searchType: evt.target.value
            });
            this.setState({
                disabled: false,
                tampilkanSemuaDataDisplay: "inline-flex",


            })
        }
    }

    // ketika user milih sub kategori
    searchTypeSubHandle(evt) {
        if (this.state.searchType === 'Kategori') {
            this.setState(
                {
                    searchKeyword: '',
                    page: 1,
                    disabled: true,
                    tampilkanSemuaDataDisplay: 'none',
                },
                () => this.getDataSPAddHO(),
            );
        } else {
            if (this.state.searchTypeSub !== 'Sub Kategori')
                this.setState({
                    searchTypeSub: evt.target.value,
                });
            this.setState({
                disabled: false,
                tampilkanSemuaDataDisplay: 'inline-flex',
            });
        }
    }


    // ketika user milih sub kategori
    searchTypeSubHandle(evt) {
        if (this.state.searchType === "Kategori") {
            this.setState({
                searchKeyword: "",
                page: 1,
                disabled: true,
                tampilkanSemuaDataDisplay: "none",
            },
                () => this.getDataSPAddHO());

        }
        else {
            if (this.state.searchTypeSub !== "Sub Kategori")
                console.log("")
            this.setState({
                searchTypeSub: evt.target.value
            });
            this.setState({
                disabled: false,
                tampilkanSemuaDataDisplay: "inline-flex",
            })
        }
    }

    // manggil api berdasarkan keyword
    searchByType = () => {
        if (this.state.searchKeyword === "" || this.state.searchKeyword === null) {
            // TO DO : button cari disabled, bukan manggil API
            this.setState({
                page: 1,
                noDataMessage: "none"
            }
            )
            //  () => this.getDataSPAddHO());
        }
        else {
            var urlSearchKeywordAll = myUrl2.url_spaddho + '?type=All' + "&group=" + this.state.inputtedGroup + "&gudangID=" + this.state.inputtedPurchasingArea + "&subType=" + this.state.searchTypeSub + "&keyword=" + this.state.searchKeyword
            if (this.state.searchType === "All") {
                Axios.get(urlSearchKeywordAll)
                    .then((res) => {
                        if (res.data.error.status === true) {
                            this.setState({
                                noDataMessage: "block"
                            }, () => this.setState({
                                result: res.data.data
                            }))
                        }
                        else {
                            this.setState({
                                noDataMessage: "none",
                            }, () => this.setState({
                                result: res.data.data
                            }))
                        }

                        // this.setState({
                        //     maxPage: res.data.metadata.max_page
                        // })

                    });
            }
            // kalau user mlih type diluar all 
            else {
                var urlSearchKeyword = myUrl2.url_spaddho + '?type=NotAll' + "&group=" + this.state.inputtedGroup + "&gudangID=" + this.state.inputtedPurchasingArea + "&categorySearch=" + this.state.searchType + "&subType=" + this.state.searchTypeSub + "&keyword=" + this.state.searchKeyword
                Axios.get(urlSearchKeyword)
                    .then((res) => {
                        if (res.data.error.status === true) {
                            this.setState({
                                noDataMessage: "block"
                            }, () => this.setState({
                                result: res.data.data
                            }))
                        }
                        else {
                            this.setState({
                                noDataMessage: "none",
                            }, () => this.setState({
                                result: res.data.data
                            }))
                        }

                        // this.setState({
                        //     maxPage: res.data.metadata.max_page
                        // })

                    });
            }

        }
    };

    getListbyPaging(currPage, currLimit) {
        const urlA = myUrl2.url_spaddho + '?type=header&outcode=' + ' this.state.inputtedPurchasingArea' + '&group=' + this.state.inputtedGroup + "&page=" + this.state.currentPage + "&length=" + this.state.todosPerPage;
        const option = {
            method: "GET",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        }
        // console.log("urlA", urlA)
        fetch(urlA, option)
            .then(response => response.json())
            .then(data => {
                this.setState({ result: data.data, isLoading: false })
            });
    }

    getDataSPAddHO = () => {
        this.setState({
            isLoading: true,
        })
        var url = (myUrl2.url_spaddho + '?type=header&outcode=' + this.state.inputtedPurchasingArea + '&group=' + this.state.inputtedGroup + "&page=" + this.state.page + "&length=" + this.state.todosPerPage + "&id=" + this.state.lastspid)        //this.state.inputtedPurchasingArea
        console.log("HAHA getDataSPAddHO " + url)
        Axios.get(url)
            .then(response => {
                console.log("HAHA RESPONSE", response);
                if (response.data.data === null) {
                    this.setState({
                        valid: true,
                        isLoading: false,

                    }, () => this.setState({
                        result: response.data.data,
                        valid: false,
                        isLoading: false,
                        noDataMessage: "block"
                    }), () => console.log("",))
                }
                else if (response.data.data !== null) {
                    this.setState({
                        noDataMessage: "none",
                        result: response.data.data,
                        valid: false,
                        isLoading: false,
                    })
                }
                this.setState({
                    maxPage: response.data.metadata.max_page,
                    lastspid: response.data.metadata.lastspid,
                })
            })
            .catch(error => {
                // setTimeout(() => this.getPurchasingArea(), 5000);
                this.setState({
                    isLoading: false,
                })
                this.showNotification('Error: ' + error.message);
                return;
            })
    }

    InputValue(evt) {
        this.setState({
            inputtedName: evt.target.value,
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
        responseHeader: '',
        responseMessage: '',
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

    updateOptionSelected(type, evt) {
        this.setState({
            searchType: "Kategori",
            searchTypeSub: "Sub Kategori",
            searchKeyword: ""
        })
        if (type === "group") {
            this.setState({
                inputtedGroup: evt.target.value,
            }, () => this.getDataSPAddHO()
            )
        }
    }

    openDetail = (nosp, outcode, group, category, ronaldo, orderNum, outCodeSup, flag, activeyn, userId, outcodeOutlet, tglSP, via, depo, spids) => {
        this.setState({
            Spch_NoSP: nosp,
            Spch_GudangId: outcode,
            Spch_Group: group,
            Spch_CategoryProduct: category,
            Spch_Ronaldo: ronaldo,
            Spch_OrderNum: orderNum,
            Spch_OutCodeSup: outCodeSup,
            Spch_Flag: flag,
            Spch_ActiveYN: activeyn,
            Spch_UserId: userId,
            Spch_OutCodeOutlet: outcodeOutlet,
            Spch_TglSP: tglSP,
            Spch_Via: via,
            Spch_OutCodeDepo: depo,
            Spch_SpId : spids,
            value: 1,
        })
    }

    closeDetail = () => {
        this.setState({ value: 0 }
            // console.log(this.state.value)
        )
    }
    deleteSP = () => {
        this.setState({isLoading:true})
        var urlRemoveBatch = (myUrl2.url_spaddho + '?cancel');

        var payload = {
            cancel: {
                Spcd_SpId: this.state.activeSPID
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

        console.log("payload deleteSP", option)
        fetch(urlRemoveBatch, option)

            .then(response => {
                console.log("response deleteSP", response)
                if (response.ok) {
                    console.log("1");
                    return response.json()
                } else {
                    console.log("2");
                    this.setState({isLoading:false})
                    // this.toggleAddConfirmationTopModal()
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
                    // responseModalIsOpen: !this.state.responseModalIsOpen,
                    //     responseHeader: "GAGAL",
                })
            })
    }


    showPage = () => {
        this.setState({
            result: [],
            value: 0
        })
    }


    render() {
        const currentTodos = this.state.result;
        const { listPurchasingArea } = this.state
        const lpa = this.state.listPurchasingArea

        const renderTodos = currentTodos && currentTodos.map((todo) => {
            return <tr align="center">
                <td> {todo.SpCordHeader.Spch_NoSP}</td>
                <td> {todo.SpCordHeader.Spch_OutCodeOutlet}</td>
                <td> {Moment(todo.SpCordHeader.Spch_TglSP).format("YYYY-MM-DD")}</td>
                <td> {todo.SpCordHeader.Spch_Via}</td>
                <td> {todo.SpCordHeader.Spch_GudangId}</td>
                <td> {todo.SpCordHeader.Spch_Flag === 'P' ? 'Printed' : 'UnPrinted'}</td>
                <td> {todo.SpCordHeader.Spch_ActiveYN === 'Y' ? 'Active' : 'InActive'}</td>
                <td> {todo.SpCordHeader.Spch_UserId}</td>
                {/* {todo.SpCordHeader.Spch_ActiveYN === 'Y' &&
                    <td>
                        <Button color="info" size="sm">Confirm</Button>
                    </td>
                } */}
                {/* {todo.SpCordHeader.Spch_ActiveYN === 'N' &&
                    <td>
                        <Button color="danger" size="sm" disabled>Confirm</Button>
                    </td>
                } */}
                <td>
                    <Button color="info" size="sm" onClick={() => this.openDetail(todo.SpCordHeader.Spch_NoSP,
                        todo.SpCordHeader.Spch_GudangId, todo.SpCordHeader.Spch_Group,
                        todo.SpCordHeader.Spch_CategoryProduct, todo.SpCordHeader.Spch_Ronaldo,
                        todo.SpCordHeader.Spch_OrderNum,
                        todo.SpCordHeader.Spch_OutCodeSup, todo.SpCordHeader.Spch_Flag,
                        todo.SpCordHeader.Spch_ActiveYN, todo.SpCordHeader.Spch_UserId,
                        todo.SpCordHeader.Spch_OutCodeOutlet, todo.SpCordHeader.Spch_TglSP, todo.SpCordHeader.Spch_Via,
                        todo.SpCordHeader.Spch_OutCodeDepo,todo.SpCordHeader.Spch_SpId)}><MdVisibility /></Button>
                    <Button size="sm" color="danger" onClick={() => this.toggledeletesp(todo.SpCordHeader.Spch_SpId)}><MdDelete /></Button>

                    {/* <Button size="sm" color="danger" onClick={() => this.deleteSP(todo.SpCordHeader.Spch_SpId)}><MdDelete /></Button> */}
                </td>
                <td>

                </td>

            </tr>
        });

        return (
            <Page
                title="SP Add HO"
                breadcrumbs={[{ name: 'spaddho', active: true }]}
                className="SP Add HO Page"
            >
                {this.state.value === 0 &&
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <CardHeader className="d-flex justify-content-between">
                                    <Table responsive>
                                        <tr>
                                            <th style={{ width: "30%" }} >
                                                <Label>Group</Label>
                                            </th>
                                            <td style={{ width: "70%", textAlign: 'center' }}>
                                                <select
                                                    style={{
                                                        width: "100%",
                                                        height: "3.0vw"
                                                    }}
                                                    onChange={(e) => this.updateOptionSelected("group", e)}

                                                >
                                                    <option value="" disabled selected>PILIH GROUP</option>
                                                    {options.map(opt =>
                                                        <option value={opt.value}>{opt.label}</option>
                                                    )}
                                                </select>
                                            </td>
                                        </tr>

                                        <tr>
                                            <th style={{ width: '30%' }}>
                                                <Label>Gudang Asal</Label>
                                            </th>

                                            <td style={{ width: '70%' }}>
                                                <Label>{window.localStorage.getItem('gName')}</Label>
                                            </td>

                                        </tr>


                                        {this.state.inputtedGroup !== "" && this.state.inputtedPurchasingArea !== "" &&

                                            <tr>
                                                <th style={{ width: "30%" }} >
                                                    <UncontrolledButtonDropdown
                                                        style={{
                                                            marginRight: "1.5vw",
                                                            marginBottom: 15,
                                                            marginTop: 15,
                                                        }}
                                                    >
                                                        <DropdownToggle
                                                            caret
                                                        >
                                                            {this.state.searchType}
                                                        </DropdownToggle>
                                                        <DropdownMenu>
                                                            <DropdownItem
                                                                value="All"
                                                                onClick={evt => this.searchTypeHandle(evt)}>
                                                                All
                                                </DropdownItem>
                                                            <DropdownItem
                                                                value="BelumPrint"
                                                                onClick={evt => this.searchTypeHandle(evt)}>
                                                                Belum Print
                                                </DropdownItem>
                                                            <DropdownItem
                                                                value="BelumAktif"
                                                                onClick={evt => this.searchTypeHandle(evt)}>
                                                                Belum Aktif
                                                </DropdownItem>
                                                            <DropdownItem
                                                                value="Cancel"
                                                                onClick={evt => this.searchTypeHandle(evt)}>
                                                                Cancel
                                                </DropdownItem>
                                                        </DropdownMenu>

                                                    </UncontrolledButtonDropdown>

                                                    <UncontrolledButtonDropdown
                                                        style={{
                                                            marginRight: "1.5vw"
                                                        }}
                                                    >
                                                        <DropdownToggle disabled={this.state.disabled}
                                                            caret
                                                        >
                                                            {this.state.searchTypeSub}
                                                        </DropdownToggle>
                                                        <DropdownMenu >
                                                            <DropdownItem
                                                                value="NoSP"
                                                                onClick={evt => this.searchTypeSubHandle(evt)}>
                                                                Nomor SP
                                                </DropdownItem>
                                                            <DropdownItem
                                                                value="KodeOutlet"
                                                                onClick={evt => this.searchTypeSubHandle(evt)}>
                                                                Kode Outlet
                                                </DropdownItem>
                                                            <DropdownItem
                                                                value="NamaOutlet"
                                                                onClick={evt => this.searchTypeSubHandle(evt)}>
                                                                Nama Outlet
                                                </DropdownItem>
                                                        </DropdownMenu>
                                                    </UncontrolledButtonDropdown>
                                                </th>


                                                {this.state.searchType !== "Kategori" && this.state.searchTypeSub != "Sub Kategori" &&
                                                    <td style={{ width: "70%" }}>
                                                        <Input
                                                            onKeyPress={(e) => this.enterPressed(e, false)}
                                                            type="search"
                                                            placeholder="Cari..."
                                                            style={{
                                                                width: "84%",
                                                                display: this.state.tampilkanSemuaDataDisplay,
                                                                marginButton: 15,
                                                                margniTop: 15
                                                            }}
                                                            disabled={this.state.disabled}
                                                            onChange={evt => this.updateSearchValue(evt)}
                                                        />

                                                        <Button
                                                            id={"searchBtn"}
                                                            style={{
                                                                alignItems: "center",
                                                                display: this.state.tampilkanSemuaDataDisplay,

                                                                marginLeft: "0.5vw",
                                                                marginRight: "0.5vw",
                                                                marginTop: 15,
                                                                marginBottom: 15
                                                            }}
                                                            onClick={() => {
                                                                this.setState({
                                                                    page: 1
                                                                },
                                                                    () => this.searchByType());
                                                            }}
                                                            color={"primary"}
                                                        >
                                                            <MdSearch
                                                                style={{
                                                                    // marginRight: this.state.isLoading ? "5" : "200"
                                                                    marginRight: this.state.isLoading && "5" || "55"
                                                                }}
                                                            />Cari
                                                            </Button>
                                                    </td>
                                                }

                                                {this.state.inputtedGroup !== "" && this.state.inputtedPurchasingArea !== "" &&
                                                    <td>
                                                        <Button style={{
                                                            marginBottom: 15,
                                                            marginTop: 15,
                                                        }} onClick={this.Masuk}
                                                        >Add</Button>
                                                    </td>
                                                }


                                            </tr>
                                        }

                                    </Table>

                                    <Modal
                                        isOpen={this.state.modaldeletesp}>
                                        <ModalHeader
                                            toggle={this.toggledeletesp.bind(this)}>
                                            KONFIMARSI DELETE SP
                         </ModalHeader>

                                        <ModalBody>
                                            APAKAAH ANDA YAKIN MENGHAPUS DATA INI?
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
                                                onClick={() => this.deleteSP()}
                                            >
                                                <MdSave
                                                    style={{ marginRight: "5" }}>

                                                </MdSave>Simpan
                    </Button>
                                            <Button
                                                color="danger"
                                                onClick={this.toggledeletesp.bind(this)}
                                            >
                                                <MdClose
                                                    style={{ marginRight: "5" }}
                                                />Batal
                    </Button>
                                        </ModalFooter>
                                    </Modal>

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
                                    <Table responsive>
                                        <NotificationSystem
                                            dismissible={false}
                                            ref={notificationSystem =>
                                                (this.notificationSystem = notificationSystem)
                                            }
                                            style={NOTIFICATION_SYSTEM_STYLE} />

                                        <thead>
                                            <tr align="center">
                                                <th align="center">No.SP</th>
                                                <th align="center">Gudang Tujuan</th>
                                                <th align="center">Tgl SP</th>
                                                <th align="center">Via</th>
                                                <th align="center">Gudang Asal</th>
                                                <th align="center">Status Print</th>
                                                <th align="center">Status Active</th>
                                                <th align="center">User</th>
                                                <th align="center">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>


                                            {this.state.valid === false &&
                                                renderTodos
                                            }
                                        </tbody>

                                    </Table>
                                    {/* <LoadingSpinner status={5} isOpen={this.state.isLoading} />  */}
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
                                    <p
                                        className={"text-center"}
                                        style={{
                                            display: this.state.noDataMessage
                                        }} >
                                        Tidak ada hasil
                                        </p>
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
                                            textAlign: "center",
                                            justifyContent: "center",
                                            display: this.state.pagination,
                                        }}>

                                        {/* <Button
                                            color={"dark"}
                                            onClick={this.firstPage.bind(this)}
                                        >
                                            {"<<"}
                                        </Button> */}

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

                                        {/* <Button
                                            color={"dark"}
                                            onClick={this.lastPage.bind(this)}
                                        >
                                            {">>"}
                                        </Button> */}
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                }
                {this.state.value === 1 && <Page>
                    <SPAddHODetail showPage={this.showPage}
                        SpchNoSP={this.state.Spch_NoSP}
                        outcode={this.state.Spch_GudangId}
                        group={this.state.Spch_Group}
                        category={this.state.Spch_CategoryProduct}
                        ronaldo={this.state.Spch_Ronaldo}
                        orderNum={this.state.Spch_OrderNum}
                        outCodeSup={this.state.Spch_OutCodeSup}
                        flag={this.state.Spch_Flag}
                        activeyn={this.state.Spch_ActiveYN}
                        userId={this.state.Spch_UserId}
                        outCodeOutlet={this.state.Spch_OutCodeOutlet}
                        tglSP={this.state.Spch_TglSP}
                        via={this.state.Spch_Via}
                        depo={this.state.Spch_OutCodeDepo}
                        spids={this.state.Spch_SpId}
                        // SPID={this.state.SPID}

                    />

                </Page>}
            </Page>
        );
    }
}
export default SPAddHOPage;
