import Page from 'components/Page';
import React from 'react';

import {
    Table,
    Input,
    Card,
    CardBody,
    Button,
    Row,
    Col,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';

import 'react-tabs/style/react-tabs.css';

import Axios from 'axios';
import { base_url_all } from '../urlLink';

import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import {
    MdLoyalty,
} from 'react-icons/md';

class View extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: '',

            transferList: {
                noTransfer: '',
                comcoPengirim: '',
                tanggalTransfer: '',
                outletPengirim: '',
            },

            inputtedNoTransfer: '',
            isLoading: false,
            currentlyGeneratingRecevieVisibility: 'none',
            isTransferNumberEligibilityModalVisibility: false,

            btnSearchTypeIsOpen: false,
            searchType: 'Pilih : ',
            searchDefault: true,
            searchByDept: false,
            btnSearchIsDisabled: false,

            mainTableVisibility: 'none',

            btnPaginationIsOpen: false,
            paginationAmount: 'Jumlah Data',
            defaultPagination: true,
            medPagination: false,
            maxPagination: false,

            page: 1,
            length: 10,
            maxPage: 1,

            isGenerateButtonEnabled: true,

            isDataAvailable: true,
            responseCode: '',

            isConfirmationModalVisible: false,

            overallHeader: '',

            isTransferNumberEligible: false,
        };
    }

    showNotification = (currMessage, levelType) => {
        setTimeout(() => {
            if (!this.notificationSystem) {
                return;
            }
            this.notificationSystem.addNotification({
                title: <MdLoyalty />,
                message:
                    currMessage,
                level: levelType,
            });
        }, 300);
    }

    //Fetch all transfer list from service
    getTransferList = noTransfer => {
        this.setState({
            transferList: {
                noTransfer: '',
                comcoPengirim: '',
                tanggalTransfer: '',
                outletPengirim: '',
            },
        });

        var url = base_url_all + 'tnin?notransf=' + noTransfer + "&outcode=" + window.localStorage.getItem('gID');
        console.log(url)

        this.setState({
            isLoading: true,
        });

        Axios.get(url).then(
            response => {

                var allTransferList = response.data.data.Header;
                this.setState({
                    isLoading: false,
                    isDataAvailable: true,
                    overallHeader: allTransferList,
                    responseCode: 200,
                    transferList: {
                        noTransfer: allTransferList.transfH_NoTransf,
                        comcoPengirim: allTransferList.transfH_OutCodeTransf,
                        outletPengirim: allTransferList.OutletPengirim,
                        tanggalTransfer: new Date(allTransferList.transfH_TglTransf.substr(0, allTransferList.transfH_TglTransf.indexOf('T'))).toDateString(),
                    },
                });

                this.showMainTable();

            }, (error) => {

                try {
                    if (error.response.data.error.msg == "DO Sudah Dilayani") {
                        this.setState({ isLoading: false }, () => {
                            this.transferNumberEligibilityModalToggle();
                        });
                    } else {
                        this.setState({
                            isLoading: false,
                            isDataAvailable: false,
                        });
                    }
                } catch (error) {
                    this.showNotification("Terjadi Kesalahan, silahkan coba kembali.", 'error')
                }

            },
        );
    };

    redirectToHomePage = () => {
        this.props.history.push('/ReturToGudang');
    };

    //Open the damn reactJS documentation to know more
    componentDidMount() {
        //Set the selectedCAtegory state to the passed value from previous page

        try {
            this.setState({
                selectedCategory: this.props.location.state.category,
            });
            this.props.setTitle('TRANSFER TO ' + window.localStorage.getItem('gName'), 'red');
        } catch (err) {
            this.redirectToHomePage();
        }
    }

    //Toggle table visibility
    showMainTable = () => {
        this.setState({
            mainTableVisibility: 'table',
        });
    };

    //Update state that attached with search bar
    updateInputValue(evt) {
        this.setState({
            inputtedNoTransfer: evt.target.value,
        });
    }

    // If enter key is pressed during search then filter the transfer list
    handleEnter = e => {
        if (e.charCode == 13) {
            this.getTransferList(this.state.inputtedNoTransfer);
        }
    };

    // Show loading message
    showLoadingMessage = () => {
        return (
            <div>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                    <i>Loading...</i>
                </p>
            </div>
        );
    };

    //...read the function name, my man
    showErrorMessage = () => {
        return (
            <div className="d-flex justify-content-center mt-3">
                <h5>Data / Service Not Available</h5>
            </div>
        );
    };

    confirmationModalVisibilityToggle = () => {
        this.setState({
            isConfirmationModalVisible: !this.state.isConfirmationModalVisible,
        });
    };

    //Execute service to insert new receive number
    insertNewReceiveNumber() {

        var url = base_url_all + "tnin?insert=retur&NoTransf=" + this.state.transferList.noTransfer + "&OutCode=" + window.localStorage.getItem('gID');
        console.log(url)

        this.setState({
            isGenerateButtonEnabled: false,
            currentlyGeneratingRecevieVisibility: 'block',
        });

        Axios.post(url).then(
            response => {

                var generatedNoReceive = response.data.data.Header.TranrcH_NoTranrc;
                var detail = response.data.data.Detail;
                this.navigateToTransferPage(generatedNoReceive, detail);

                this.setState({
                    isGenerateButtonEnabled: false,
                    currentlyGeneratingRecevieVisibility: 'none',
                });
            },
            error => {
                console.log(error);
                this.setState({
                    isGenerateButtonEnabled: true,
                });
            },
        );
    }

    navigateToTransferPage = (generatedNoReceive, detail) => {

        this.props.history.push('/ReturToGudangProductList', {
            noReceive: generatedNoReceive,
            detail: detail,
            category: this.state.selectedCategory,
            noTransfer: this.state.transferList.noTransfer,
            overallHeader: this.state.overallHeader,
        });
    };

    showGeneratingReceiveMessage = () => {
        return (
            <p
                style={{
                    fontSize: '12px',
                    display: this.state.currentlyGeneratingRecevieVisibility,
                }}
            >
                Membentuk No. Receive...
            </p>
        );
    };

    transferNumberEligibilityModalToggle = () => {
        this.setState({
            isTransferNumberEligibilityModalVisibility: !this.state
                .isTransferNumberEligibilityModalVisibility,
        });
    };

    render() {
        return (
            <Page>
                {/* Keperluan Autentifikasi */}
                {/* {this.renderRedirect()} */}
                <Card>
                    <NotificationSystem
                        dismissible={false}
                        ref={notificationSystem =>
                            (this.notificationSystem = notificationSystem)
                        }
                        style={NOTIFICATION_SYSTEM_STYLE}
                    />
                    <CardBody>
                        {/* Search Bar */}
                        <Row style={{ marginTop: '12px' }}>
                            <Col xs="4" className="d-flex justify-content-center">
                                <Input
                                    placeholder="Masukkan No. Transfer"
                                    value={this.state.inputtedNoTransfer}
                                    onChange={e => this.updateInputValue(e)}
                                    onKeyPress={this.handleEnter}
                                />
                            </Col>

                            <Button
                                disabled={this.state.btnSearchIsDisabled}
                                onClick={() =>
                                    this.getTransferList(this.state.inputtedNoTransfer)
                                }
                            >
                                CARI
              </Button>
                        </Row>

                        {/* Transfer Number eligibility Confirmation Modal (Initially hidden) */}
                        <Modal
                            isOpen={this.state.isTransferNumberEligibilityModalVisibility}
                            toggle={() => this.transferNumberEligibilityModalToggle()}
                        >
                            <ModalHeader>Peringatan</ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col>
                                        <h6>No. Transfer sudah diproses !</h6>
                                    </Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    onClick={() => this.transferNumberEligibilityModalToggle()}
                                >
                                    OK
                </Button>
                            </ModalFooter>
                        </Modal>

                        {/* Insert no.receive Confirmation Modal (Initially hidden) */}
                        <Modal
                            isOpen={this.state.isConfirmationModalVisible}
                            toggle={() => this.confirmationModalVisibilityToggle()}
                        >
                            <ModalHeader>Lanjut Transfer</ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col>
                                        <h6>Anda yakin akan melanjutkan transfer ?</h6>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: '8px' }}>
                                    <Col>{this.showGeneratingReceiveMessage()}</Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    disabled={!this.state.isGenerateButtonEnabled}
                                    onClick={() => this.insertNewReceiveNumber()}
                                >
                                    Lanjut
                </Button>
                                <Button
                                    color="secondary"
                                    onClick={() => this.confirmationModalVisibilityToggle()}
                                >
                                    Batal
                </Button>
                            </ModalFooter>
                        </Modal>

                        {/* Show loading message */}
                        {this.state.isLoading ? this.showLoadingMessage() : null}

                        {/* Main Table (Initially hidden. Press the search button to show) */}
                        <Table responsive hover striped style={{ marginTop: '16px' }}>
                            <thead>
                                <tr style={{ textAlign: 'center' }}>
                                    <th style={{ width: '15%' }}>No. Transfer</th>
                                    <th style={{ width: '15%' }}>Tanggal Transfer</th>
                                    <th style={{ width: '15%' }}>Comco Pengirim</th>
                                    <th style={{ width: '55%' }}>Outlet Pengirim</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ textAlign: 'center' }}>
                                    <th>
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.confirmationModalVisibilityToggle()}
                                        >
                                            {this.state.transferList.noTransfer}
                                        </a>
                                    </th>
                                    <td>{this.state.transferList.tanggalTransfer}</td>
                                    <td>{this.state.transferList.comcoPengirim}</td>
                                    <td>{this.state.transferList.outletPengirim}</td>
                                </tr>
                            </tbody>
                        </Table>

                        {/* SHow Error message in case something happened when fetching data */}
                        {this.state.responseCode == 502 || !this.state.isDataAvailable
                            ? this.showErrorMessage()
                            : null}
                    </CardBody>
                </Card>
            </Page>
        );
    }
}
export default View;
