import Page from 'components/Page';
import React from 'react';
import {
    Table,
    Input,
    Form,
    Card,
    CardBody,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Button,
    Row,
    Col,
    FormGroup,
    Label,
    Dropdown,
    InputGroupAddon,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import 'react-tabs/style/react-tabs.css';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import { base_url_all } from '../urlLink';

import { MdLoyalty } from 'react-icons/md';

import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

class ReturToGudang extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            isReceiveQtyHeaderShown: 'inline',


            isSearchTypeDropdownOpen: false,
            currentSelectedSearchType: 'No. Receive',

            isShownQtyDropdownOpen: false,

            isSearchNumberLoadingShown: false,

            isChooseIntervalDateWarningShown: false,

            isDataAvailable: true,

            transferList: [],
            transferListAfterFilter: [],

            selectedCategory: 'Apotik',
            selectedCategoryCode: 1,
            btnSearchIsDisabled: false,
            inputtedInformation: '',

            currentPage: 1,
            currentShownQtyPerPage: 10,
            maxPage: 1,

            currentShownPrintStatus: "P",

            tableVisibility: 'table',

            currentOutCode: '',

            startDate: new Date(),
            limitDate: new Date(),

            isStartDateSelected: false,
            isLimitDateSelected: false,

            isLoading: false,

            flagPCount: 0,
            flagNCount: 0,
            flagTotalCount: 0,
        };
    }


    //This is a lifecyle-related function. Open the damn reactJS documentation to know more
    componentDidMount() {
        window.addEventListener('scroll', function () {
            //When scroll change, you save it on localStorage.
            window.localStorage.setItem('mainPageScrollPos', window.scrollY);
        }, false);

        var gName = window.localStorage.getItem('gName');
        this.props.setTitle('JUMLAH TN-IN ' + gName, 'red');
        var lastShownQty = window.localStorage.getItem('lastShownRowQty');
        var lastVisitedPageNumber = window.localStorage.getItem('lastVisitedPageNumber');

        if (lastShownQty == null) {
            this.setState({ currentShownQtyPerPage: 10 })
        } else {
            this.setState({ currentShownQtyPerPage: lastShownQty })
        }

        if (lastVisitedPageNumber == null) {
            this.setState({ currentPage: 1 })
        } else {
            this.setState({ currentPage: lastVisitedPageNumber })
        }

        this.setState({
            //Get Current Warehouse ID from localStorage before fetch all No.Receive
            currentOutCode: window.localStorage.getItem('gID'),
        });
    }

    componentWillUnmount = () => {
        window.addEventListener('scroll', null, false);
    }


    //Fetch all transfer list from service
    getNoReceiveList = () => {
        var url = base_url_all +
            'tnin?find=all&outcode=' +
            this.state.currentOutCode +
            '&group=' +
            this.state.selectedCategoryCode +
            '&flag=' +
            this.state.currentShownPrintStatus


        console.log(url);

        window.localStorage.setItem('lastVisitedPageNumber', this.state.currentPage);

        //Simultaneously hide table and show loading message
        this.setState({
            isLoading: true,
            tableVisibility: 'none',
            isDataAvailable: true
        });


        //Fetch the data from API
        Axios.post(url, {
            start_date: this.state.startDate + " 00:00:00",
            end_date: this.state.limitDate + " 00:00:00"
        }).then(
            response => {

                try {
                    var transferData = response.data.data
                    var transferList = transferData.Data;
                    //var maxPage = response.data.metadata.max_page;
                    var flagPCount = transferData.flag_p_count
                    var flagNCount = transferData.flag_n_count
                    var flagTotalCount = transferData.flag_total_count

                    this.setState({
                        //maxPage: maxPage,
                        flagPCount: flagPCount,
                        flagNCount: flagNCount,
                        flagTotalCount: flagTotalCount,
                        transferList: transferList,
                        transferListAfterFilter: transferList,

                        isDataAvailable: true,
                        isLoading: false,
                        tableVisibility: 'table',
                        isReceiveQtyHeaderShown: 'inline'

                        //Scroll to last saved scroll position after fetch
                    }, () => {
                        window.scrollTo(0, window.localStorage.getItem('mainPageScrollPos') || 0, 0);
                    });

                } catch (error) {
                    this.setState({
                        isDataAvailable: false,
                        isLoading: false,
                        tableVisibility: 'none'
                    });
                }
            },
            error => {
                this.setState({
                    isDataAvailable: false,
                    isLoading: false,
                }, () => {
                    this.showNotification('Terjadi kesalahan, silahkan coba kembali', 'error');
                });
            },
        );
    };



    //Show Notification
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
        }, 300);
    };


    searchNoTransferByKeyword = (inputtedNoTransfer) => {
        var url = base_url_all + "tnin?notransf=" + inputtedNoTransfer

        console.log(url);

        this.loadingSearchedNumberModalToggle()

        Axios.get(url).then(
            response => {
                var receiveDetail = response.data.data;
                var foundNoReceive = receiveDetail.TranrcH_NoTranrc

                console.log(foundNoReceive)

                this.loadingSearchedNumberModalToggle()

                if (foundNoReceive !== "") {
                    this.props.history.push({
                        pathname: '/ReturToGudangSavedDetails',
                        state: {
                            category: this.state.selectedCategory,
                            noReceive: foundNoReceive,
                        }
                    })
                } else {
                    this.showNotification("No. Transfer Tidak Ditemukan", 'error')
                }
            },
            error => {
                this.loadingSearchedNumberModalToggle()
                this.showNotification("Terjadi kesalahan, mohon coba kembali", 'error')
            }
        )


    }

    searchNoReceiveByKeyword = (inputtedNoReceive) => {
        var url = base_url_all + 'tnin?find=all&noRecv=' + inputtedNoReceive;

        console.log(url);

        this.loadingSearchedNumberModalToggle()

        Axios.get(url).then(
            response => {
                var receiveDetail = response.data.data;

                console.log(receiveDetail)

                this.loadingSearchedNumberModalToggle()

                if (response.data.error.status == false) {
                    this.props.history.push({
                        pathname: '/ReturToGudangSavedDetails',
                        state: {
                            category: this.state.selectedCategory,
                            noReceive: inputtedNoReceive,
                        }
                    })
                } else {
                    if (response.data.error.code == 404) {
                        this.showNotification("No. Receive Tidak Ditemukan", 'error')
                    } else {
                        this.showNotification("Terjadi kesalahan, mohon coba kembali", 'error')
                    }
                }
            },
            error => {
                this.loadingSearchedNumberModalToggle()

                if (error.response) {
                    if (error.response.status == 404) {
                        this.showNotification("No. Receive Tidak Ditemukan", 'error')
                    } else {
                        this.showNotification("Terjadi kesalahan, mohon coba kembali", 'error')
                    }
                } else {
                    this.showNotification("Terjadi kesalahan, mohon coba kembali", 'error')
                }

            }
        )


    }






    //Update state that attached with search bar
    updateInputValue(evt) {
        this.setState({
            inputtedInformation: evt.target.value,
        });
    }



    //Update start date (Currently disabled)
    updateCurrentStartDate = (e) => {
        this.setState({ startDate: e.target.value, isStartDateSelected: true }, () => {
            console.log("Start Date : " + this.state.startDate)
        })
    }



    //Update Limit date (Currently disabled)
    updateCurrentLimitDate = (e) => {
        this.setState({ limitDate: e.target.value, isLimitDateSelected: true }, () => {
            console.log("Limit Date : " + this.state.limitDate)
        })
    }



    //Filter the receive number list in the table with inputted terms (both category and keyword)
    filterNoReceive = () => {
        if (this.state.currentSelectedSearchType == 'No. Transfer') {
            // this.setState({

            //     //Filter by No. Transfer
            //     transferListAfterFilter: this.state.transferList.filter(
            //         transfer =>
            //             transfer.TranrcH_NoTransf.includes(this.state.inputtedInformation),
            //     )
            // });


            if (this.state.inputtedInformation == "") {
                this.showNotification("Masukkan no. yang anda cari", 'error')
            } else {
                this.searchNoTransferByKeyword(this.state.inputtedInformation)
            }

        } else if (this.state.currentSelectedSearchType == 'No. Receive') {
            // this.setState({

            //     //Filter by No. Receive
            //     transferListAfterFilter: this.state.transferList.filter(
            //         transfer =>
            //             transfer.TranrcH_NoTranrc.includes(this.state.inputtedInformation),
            //     )
            // });


            if (this.state.inputtedInformation == "") {
                this.showNotification("Masukkan no. yang anda cari", 'error')
            } else {
                this.searchNoReceiveByKeyword(this.state.inputtedInformation)
            }
        }
    };



    //Increase page number by 1 (If user not in last page)
    navigateToNextPage = () => {
        if (this.state.currentPage < this.state.maxPage) {

            this.setState({ currentPage: parseInt(this.state.currentPage) + 1 }, () => {
                this.getNoReceiveList()
            });

        } else {
            this.showNotification("Ini halaman terakhir", 'error');
        }
    }



    //Increase page number equal to maxPage (If user not in last page)
    navigateToLastPage = () => {
        if (this.state.currentPage < this.state.maxPage) {
            this.setState({ currentPage: this.state.maxPage }, () => {
                this.getNoReceiveList()
            });
        } else {
            this.showNotification("Ini halaman terakhir", 'error');
        }
    }


    //Decrease page number by 1 (If user not in first page)
    navigateToPrevPage = () => {
        if (this.state.currentPage > 1) {
            this.setState({ currentPage: this.state.currentPage - 1 }, () => {
                this.getNoReceiveList()
            });
        } else {
            this.showNotification("Ini halaman pertama", 'error')
        }
    }


    //Decrease page number to 1 (If user not in first page)
    navigateToFirstPage = () => {
        if (this.state.currentPage > 1) {
            this.setState({ currentPage: 1 }, () => {
                this.getNoReceiveList()
            });
        } else {
            this.showNotification("Ini halaman pertama", 'error')
        }
    }



    //Change state for the category dropdown
    toggleSearchTypeDropdown = () => {
        this.setState({
            isSearchTypeDropdownOpen: !this.state.isSearchTypeDropdownOpen,
        });
    };



    //Change state for shown qty dropdown
    toggleShownQtyDropdown = () => {
        this.setState({
            isShownQtyDropdownOpen: !this.state.isShownQtyDropdownOpen,
        });
    };



    //Set currentSelectedSearchType state to chosen category
    setCurrentChosenSearchType = chosenType => {
        this.setState({
            inputtedInformation: '', //Set Search Bar to empty each time user change search category
            transferListAfterFilter: this.state.transferList, //Reset transfer filtered list each time user change search category
        }, () => {
            this.setState({
                currentSelectedSearchType: chosenType, //Set Current chosen category to chosen radio button
            });
        });
    };



    //Set currentShownQty state to chosen shown qty
    setCurrentShownQty = chosenShownQty => {

        //Store last selected row qty
        window.localStorage.setItem('lastShownRowQty', chosenShownQty);

        this.setState({
            inputtedInformation: '', //Set Search Bar to empty each time user change search category
            transferListAfterFilter: this.state.transferList, //Reset transfer filtered list each time user change search category
        }, () => {
            this.setState({
                currentPage: 1,
                currentShownQtyPerPage: chosenShownQty, //Set Current chosen category to chosen radio button
            }, () => {
                this.getNoReceiveList();
            });
        });
    };


    setCurrentShownPrintStatus = chosenPrintStatus => {
        this.setState({
            currentShownPrintStatus: chosenPrintStatus, //Set Current chosen category to chosen radio button
        })
    }



    //Set shown category
    setCurrentChosenCategory = chosenCategory => {
        this.setState({
            selectedCategory: chosenCategory,
            inputtedInformation: '', //Set Search Bar to empty each time user change search category
            transferListAfterFilter: this.state.transferList, //Reset transfer filtered list each time user change search category 
        }, () => {
            if (this.state.selectedCategory == "Floor") {
                this.setState({
                    currentPage: 1,
                    selectedCategoryCode: 2
                });
            }

            if (this.state.selectedCategory == "Apotik") {
                this.setState({
                    currentPage: 1,
                    selectedCategoryCode: 1
                });
            }
        });
    }



    //Handle enter key in search bar
    handleEnterKey = e => {
        // If enter key is pressed during search then filter the transfer list
        if (e.charCode == 13) {
            this.filterNoReceive();
        }
    };



    populateTable = () => {
        return this.state.transferListAfterFilter.map(transferDetail => (
            <tr style={{ textAlign: 'center' }}>
                <th scope="row">
                    <Link
                        to={{
                            pathname: '/JumlahTnInDetail',
                            state: {
                                category: this.state.selectedCategory,
                                noReceive: transferDetail.Header.TranrcH_NoTranrc,
                            },
                        }}
                    >
                        {transferDetail.Header.TranrcH_NoTranrc}
                    </Link>
                </th>
                <td>{new Date(transferDetail.Header.TranrcH_TglTranrc).toDateString()}</td>
                <td>{transferDetail.Header.TranrcH_OutCodeTransf}</td>
                <td>{transferDetail.Header.TranrcH_Pengirim}</td>
                <td>{transferDetail.Header.TranrcH_NoTransf}</td>
                {transferDetail.Header.TranrcH_ActiveYN === 'Y' ? <td>NO</td> : <td>YES</td>}
                {transferDetail.Header.TranrcH_Flag === 'P' ? <td>YES</td> : <td>NO</td>}
            </tr>
        ));

    };



    //The Function name says it all, man...
    showErrorMessage = () => {
        return (
            <div className="d-flex justify-content-center mt-3">
                <h5>Data saat ini kosong / tidak dapat diakses</h5>
            </div>
        );
    };


    loadingSearchedNumberModalToggle = () => {
        this.setState({
            isSearchNumberLoadingShown: !this.state.isSearchNumberLoadingShown
        })
    }


    dateIntervalWarningModalToggle = () => {
        this.setState({
            isChooseIntervalDateWarningShown: !this.state.isChooseIntervalDateWarningShown
        })
    }


    //The Function name says it all, man...
    showLoadingMessage = () => {
        return (
            <div className="d-flex justify-content-center mt-3">
                <h5>Loading ....</h5>
            </div>
        );
    };



    render() {
        return (
            <Page>
                <Card>
                    <NotificationSystem
                        dismissible={false}
                        ref={notificationSystem =>
                            (this.notificationSystem = notificationSystem)
                        }
                        style={NOTIFICATION_SYSTEM_STYLE}
                    />
                    <CardBody>

                        {/* Category Selection Radio Buttons */}
                        <Row className="d-flex align-items-center">
                            <Col xs="3" className="d-flex justify-content-left">
                                <h5>Kategori : </h5>
                                <FormGroup check style={{ marginLeft: '16px' }}>
                                    <Label check>
                                        <Input
                                            type="radio"
                                            value="Floor"
                                            name="floorRadioButton"
                                            checked={this.state.selectedCategory === 'Floor'}
                                            onChange={e => this.setCurrentChosenCategory(e.target.value)}
                                        />{' '}
                                        Floor
                                    </Label>
                                    <Label check style={{ marginLeft: '50px' }}>
                                        <Input
                                            type="radio"
                                            value="Apotik"
                                            name="apotikRadioButton"
                                            checked={this.state.selectedCategory === 'Apotik'}
                                            onChange={e => this.setCurrentChosenCategory(e.target.value)}
                                        />{' '}
                                    Apotik
                                </Label>
                                </FormGroup>
                            </Col>

                            {/* Filter by print status */}
                            <div className="d-flex justify-content-right">
                                <InputGroupAddon addonType="prepend">
                                    Status Print :
                                    </InputGroupAddon>
                                <select
                                    value={this.state.currentShownPrintStatus}
                                    onChange={e => this.setCurrentShownPrintStatus(e.target.value)}
                                    style={{ height: '38px' }}
                                >
                                    <option value="P">YES</option>
                                    <option value="N">NO</option>
                                </select>
                            </div>


                        </Row>

                        {/* Filter by Receive date */}
                        <div className="d-flex w-100" style={{ marginTop: '24px' }}>
                            <InputGroupAddon addonType="prepend">
                                Periode :
                                </InputGroupAddon>
                            <Input
                                defaultValue={this.state.startDate}
                                onChange={e => this.updateCurrentStartDate(e)}
                                type="date"
                                style={{ width: '20%' }}
                            ></Input>
                            <Label style={{ marginTop: 8 }}>&nbsp;-&nbsp;</Label>
                            <Input
                                defaultValue={this.state.limitDate}
                                onChange={e => this.updateCurrentLimitDate(e)}
                                type="date"
                                style={{ width: '20%' }}
                            ></Input>
                        
                        </div>

                        {/* Search Bar */}
                        
                        <div style={{ marginTop: '24px'}} className="d-flex">

                            <Button className = "btn-danger" style={{ width: '15%'}} onClick={() => {
                                this.state.isStartDateSelected && this.state.isLimitDateSelected ? 
                                    this.getNoReceiveList() : 
                                    this.dateIntervalWarningModalToggle()
                            }}>
                                OK
                            </Button>
                            
                        </div>




                        {/* Loading Modal */}
                        <Modal
                            backdrop='static'
                            isOpen={this.state.isSearchNumberLoadingShown}
                            toggle={() => this.loadingSearchedNumberModalToggle()}
                        >
                            <ModalBody>
                                <Row className="justify-content-center align-content-center">
                                    <h4 className="mt-2">Mohon Tunggu Sebentar...</h4>
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    className="w-100"
                                    color="danger"
                                    onClick={() => this.loadingSearchedNumberModalToggle()}
                                >
                                    Batal
                                </Button>
                            </ModalFooter>
                        </Modal>


                        {/* Belum pilih tanggal */}
                        <Modal
                            backdrop='static'
                            isOpen={this.state.isChooseIntervalDateWarningShown}
                            toggle={() => this.dateIntervalWarningModalToggle()}
                        >
                            <ModalBody>
                                <Row className="justify-content-center align-content-center">
                                    <h6 className="mt-2"><b>Pilih periode print Rcv. TN-IN Terlebih dahulu !</b></h6>
                                </Row>
                            </ModalBody>

                            <ModalFooter>
                                <Button
                                    className="w-100"
                                    color="danger"
                                    onClick={() => this.dateIntervalWarningModalToggle()}
                                >
                                    OK
                                </Button>
                            </ModalFooter>
                        </Modal>

                            <div className = "d-flex">
                                
                                <div style={{ display: this.state.isReceiveQtyHeaderShown }} >
                                    <h6 style={{ marginTop: '24px' }}>
                                        Sudah Print Rcv. (TN-IN) :   {this.state.flagPCount}
                                    </h6>

                                    <h6 style={{ marginTop: '4px' }}>
                                        <b>Total No.Receive :    {this.state.flagTotalCount}</b>
                                    </h6>
                                </div>

                                <div xs="2" style={{ display: this.state.isReceiveQtyHeaderShown, marginLeft: '32px'}} >
                                    <h6 style={{ marginTop: '24px' }}>
                                        Belum Print Rcv. (TN-IN) :   {this.state.flagNCount}
                                    </h6>
                                </div>

                                <div className="d-flex ml-auto justify-content-end align-items-center" style = {{ marginTop: '24px' }}>
                                    <Dropdown
                                        isOpen={this.state.isSearchTypeDropdownOpen}
                                        toggle={() => this.toggleSearchTypeDropdown()}
                                    >
                                        <DropdownToggle caret>
                                            {this.state.currentSelectedSearchType}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem
                                                onClick={() =>
                                                    this.setCurrentChosenSearchType('No. Transfer')
                                                }
                                            >
                                                No. Transfer
                                                </DropdownItem>
                                            <DropdownItem
                                                onClick={() =>
                                                    this.setCurrentChosenSearchType('No. Receive')
                                                }
                                            >
                                                No. Receive
                                                </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <Input
                                        onKeyPress={this.handleEnterKey}
                                        value={this.state.inputtedInformation}
                                        onChange={e => this.updateInputValue(e)}
                                        style={{ marginLeft: '24px',width: '35%' }}
                                        placeholder={'Cari ' + this.state.currentSelectedSearchType}
                                    />
                                    <Button
                                        onClick={() => this.filterNoReceive()}
                                    >
                                        CARI
                                    </Button>
                                </div>
                                
                            
                            </div>
                            


                        <Table responsive hover striped style={{ display: this.state.tableVisibility }} style = {{marginTop: '16px'}}>
                            <thead>
                                <tr style={{ textAlign: 'center' }}>
                                    <th style={{ width: '15%' }}>No. Receive</th>
                                    <th style={{ width: '15%' }}>Tanggal Receive</th>
                                    <th style={{ width: '15%' }}>Comco Pengirim</th>
                                    <th style={{ width: '20%' }}>Outlet Pengirim</th>
                                    <th style={{ width: '15%' }}>No. Transfer</th>
                                    <th style={{ width: '10%' }}>Delete</th>
                                    <th style={{ width: '10%' }}>Print</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* Populate the table under conditions */}
                                {this.state.transferListAfterFilter != null ? this.populateTable() : console.log("ss")}
                            </tbody>
                        </Table>

                        {/* Show error message if something happened with the fetching process */}
                        {this.state.isDataAvailable ? null : this.showErrorMessage()}

                        {/* Show Loading message (No shit, sherlock) */}
                        {this.state.isLoading ? this.showLoadingMessage() : null}

                        {/* Pagination Button, don't ask me what or why there's that */}
                        {/* <div className="d-flex justify-content-between mt-3">
                            <div className="d-flex justify-content-left">
                                <InputGroupAddon addonType="prepend">
                                    Tampilkan
                                </InputGroupAddon>
                                <select
                                    value={this.state.currentShownQtyPerPage}
                                    onChange={e => this.setCurrentShownQty(e.target.value)}
                                    style={{ height: '38px' }}
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                                <InputGroupAddon addonType="prepend">
                                    Baris Per-Halaman
                                </InputGroupAddon>
                            </div>
                            <Form
                                inline
                                className="cr-search-form"
                                onSubmit={e => e.preventDefault()}
                                style={{
                                    textAlign: "center",
                                    justifyContent: "center"
                                }}>

                                <Button onClick={() => { this.navigateToFirstPage() }}>
                                    {"<<"}
                                </Button>

                                <Button onClick={() => this.navigateToPrevPage()}>
                                    {"<"}
                                </Button>

                                <Button disabled className="ml-2 mr-2">
                                    {this.state.currentPage} / {this.state.maxPage}
                                </Button>

                                <Button onClick={() => this.navigateToNextPage()}>
                                    {">"}
                                </Button>

                                <Button onClick={() => this.navigateToLastPage()}>
                                    {">>"}
                                </Button>
                            </Form>
                        </div> */}

                    </CardBody>
                </Card>
            </Page>
        );
    }
}
export default ReturToGudang;
