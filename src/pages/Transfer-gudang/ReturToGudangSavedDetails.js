import Page from 'components/Page';
import React from 'react';
import {
    Table,
    Input,
    Form,
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
import { MdModeEdit, MdNoteAdd, MdLoyalty } from "react-icons/md";

import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';

import ReactHTMLTableToExcel from 'react-html-table-to-excel';


class View extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditQtyModalShown: false,
            isEditOverallInfoModalShown: false,
            isEditButtonDisabled: false,

            currentNoReceive: '',
            currentNoTransfer: '',
            currentOutletPengirim: '',
            currentOutletPenerima: '',
            tanggalReceive: '',
            tanggalPrint: '',
            isDelete: '',
            isPrint: '',
            newSelectedItemBatch: '',

            currentSelectedCategory: "",

            currentSelectedItemScanQty: -1,
            newSelectedItemScanQty: -1,
            totalProductQty: 0,

            currentSelectedItemBatch: '',
            currentSelectedBatchQty: 0,
            currentSelectedItemExpDate: '',
            currentSelectedItemProdCode: '',
            currentSelectedReceiveID: '',
            currentSelectedReceiveQty: '',
            currentSelectedItemQtyValidity: '',
            currentSelectedItemName: '',

            isDataAvailable: true,
            isConfirmationModalVisible: false,
            isPrintButtonAvailable: true,
            isPrintSuccessModalVisible: false,
            isConfirmPrintButtonAvailable: false,
            isAddBatchButtonDisabled: true,
            isDownloadPDFButtonDisabled: false,

            invalidDateFormatMessageVisibility: 'none',
            uneligibleToPrintMessageVisibility: 'none',
            editingInProcessMessageVisibility: 'none',
            addingBatchInProcessMessageVisibility: 'none',
            uneligibleToAddBatchMessageVisibility: 'none',
            qtyScanValidationMessageVisibility: 'none',
            generatingPDFInProcessMessageVisibility: 'none',
            printingReceiveInProcessMessageVisibility: 'none',


            productList: [],
        };
    }


    //You know what this function does lmao
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



    //Generate Receive Number as PDF and Download it
    generateReceivePDF = (currentNoReceive) => {
        var url = base_url_all + "tnin?printNoRecv=" + currentNoReceive

        this.setState({
            isDownloadPDFButtonDisabled: true,
            generatingPDFInProcessMessageVisibility: 'block'
        })

        Axios.get(url, { responseType: 'arraybuffer' }).then(response => {

            this.setState({
                isDownloadPDFButtonDisabled: false,
                generatingPDFInProcessMessageVisibility: 'none'
            })

            const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = urlBlob;
            link.setAttribute('download', currentNoReceive + '.pdf');
            document.body.appendChild(link);
            link.click();

        }, error => {
            this.setState({
                isDownloadPDFButtonDisabled: false,
                generatingPDFInProcessMessageVisibility: 'none'
            })
            this.showNotification('Download PDF Gagal. Silahkan Coba Kembali', 'error')
        })
    }



    //Get the header data (Bruh isn't it oblivious)
    getHeaderData = currentNoReceive => {
        var url = base_url_all + 'tnin?find=header&noRecv=' + currentNoReceive;

        Axios.get(url).then(
            response => {
                var headerData = response.data.data;

                this.setState(
                    {
                        currentNoTransfer: headerData.TranrcH_NoTransf,
                        currentOutletPengirim: headerData.TranrcH_Pengirim,
                        currentOutletPenerima: headerData.TranrcH_Penerima,
                        tanggalReceive: headerData.TranrcH_TglTranrc.substr(
                            0,
                            headerData.TranrcH_TglTranrc.indexOf('T'),
                        ),
                        tanggalPrint: headerData.TranrcH_lastUpdate.substr(
                            0,
                            headerData.TranrcH_lastUpdate.indexOf('T'),
                        ),
                        isDelete: headerData.TranrcH_ActiveYN,
                        isPrint: headerData.TranrcH_Flag,
                    }, () => {
                        if (headerData.TranrcH_Flag === 'P') {
                            this.setState({
                                isPrintButtonAvailable: false,
                            });
                        }
                    },
                );
            },
            error => {
                this.showNotification("Koneksi Gagal", 'error');
            },
        );
    };



    //Populate data in table
    getProductList = currentNoReceive => {
        var url = base_url_all + 'tnin?find=detail&noRecv=' + currentNoReceive;

        Axios.get(url).then(
            response => {
                var productListData = response.data.data;
                console.log(url);

                this.setState({
                    productList: productListData,
                    isDataAvailable: true
                }, () => {
                    window.scrollTo(0, window.localStorage.getItem('scrollPos') || 0, 0);

                    var procodeArray = this.state.productList.map(
                        product => product.TranrcD_Procod,
                    );

                    var distinctProcodeArray = [...new Set(procodeArray)];
                    this.setState({ totalProductQty: distinctProcodeArray.length })

                });
            },
            error => {
                this.setState({
                    isDataAvailable: false,
                });
                this.showNotification("Koneksi Gagal", 'error');
            },
        );
    };



    //This is a lifecyle-related function. Open the damn reactJS documentation to know more
    componentDidMount() {
        window.addEventListener('scroll', function () {
            //When scroll change, you save it on localStorage.
            window.localStorage.setItem('scrollPos', window.scrollY);
        }, false);

        try {
            this.setState({ currentNoReceive: this.props.location.state.noReceive, currentSelectedCategory: this.props.location.state.category },
                () => {
                    this.getHeaderData(this.state.currentNoReceive);
                    this.getProductList(this.state.currentNoReceive);
                    this.props.setTitle('TRANSFER TO ' + window.localStorage.getItem('gName'), 'red');
                });
        } catch (err) {
            this.redirectToHomePage();
        }
    }




    //...just re-read the function name, my man.
    redirectToHomePage = () => {
        this.props.history.push('/ReturToGudang');
    };


    //
    updateBatchNumberInputValue(evt) {
        this.setState({
            currentSelectedItemBatch: evt.target.value,
        }, () => {
            if (!this.state.currentSelectedItemBatch.trim() || this.state.currentSelectedItemScanQty < 0 || isNaN(parseInt(this.state.currentSelectedItemScanQty))) {
                this.setState({ isEditButtonDisabled: true })
            } else {
                this.setState({ isEditButtonDisabled: false })
            }
        });
    }


    //Show button that trigger the receive number PDF Download
    showDownloadPdfUrl = () => {
        return (
            <Button
                disabled={this.state.isDownloadPDFButtonDisabled}
                onClick={() => this.generateReceivePDF(this.state.currentNoReceive)}
                style={{ float: 'right', marginLeft: '16px' }}>Download PDF</Button>
        )
    }



    //The function name says it all
    showUneligibletoAddBatcMessage = () => {
        return (
            <p
                style={{
                    fontSize: '12px',
                    display: this.state.uneligibleToAddBatchMessageVisibility,
                }}
            >
                Scan Qty baru melebihi kapasitas !
            </p>
        );
    }



    //The function name says it all
    showGeneratingPDFInProcessMessage = () => {
        return (
            <p
                style={{
                    fontSize: '12px',
                    display: this.state.generatingPDFInProcessMessageVisibility,
                    marginRight: "16px",
                    marginTop: "8px",
                    float: 'right'
                }}
            >
                Mohon Tunggu Sebentar...
            </p>
        );
    }



    //The function name says it all
    updateExpDateInputValue(evt) {
        this.setState({
            currentSelectedItemExpDate: evt.target.value,
        });
    }



    //Edit Qty, Batch number, and Exp.Date
    editOverallInfo = () => {
        this.setState({
            qtyScanValidationMessageVisibility: 'none',
            invalidDateFormatMessageVisibility: 'none',
            isEditButtonDisabled: true,
            editingInProcessMessageVisibility: 'block'
        });

        var url =
            base_url_all + 'tnin?NoTranrc=' +
            this.state.currentNoReceive +
            '&TranrcDID=' +
            this.state.currentSelectedReceiveID;

        var qtyValidity = 'N';

        if (this.state.currentSelectedItemScanQty == this.state.currentSelectedBatchQty) {
            qtyValidity = 'Y';
        } else {
            qtyValidity = 'N';
        }

        Axios.put(url, {
            TranrcD_BatchNumber: this.state.currentSelectedItemBatch,
            TranrcD_QuantityScan: parseInt(this.state.currentSelectedItemScanQty),
            TranrcD_QtyBatch: parseInt(this.state.currentSelectedBatchQty),
            TranrcD_Procod: this.state.currentSelectedItemProdCode,
            StckD_Expdate: new Date(this.state.currentSelectedItemExpDate)
        }).then(
            response => {
                console.log(response);
                this.closeAllModal()
                this.getProductList(this.state.currentNoReceive);
                this.showNotification("Anda berhasil informasi produk terkait", "success")
            },
            error => {
                if (error.response.data.error.msg == "400 - Qty Tidak Valid") {
                    this.showNotification("Qty Tidak Valid", 'error');
                    this.setState({
                        qtyScanValidationMessageVisibility: 'block',
                        isEditButtonDisabled: false,
                        editingInProcessMessageVisibility: 'none'
                    })
                } else {
                    this.showNotification("Terjadi Kesalahan. Silahkan Coba Kembali", 'error');
                    this.setState({
                        isEditButtonDisabled: false,
                        editingInProcessMessageVisibility: 'none'
                    })
                }

            },
        );
    };



    //Toggle edit modal per table row
    editOverallInfoModalVisibilityToggle = product => {
        try {
            this.setState({
                isEditOverallInfoModalShown: !this.state.isEditOverallInfoModalShown,
                currentSelectedItemBatch: product.TranrcD_BatchNumber,
                currentSelectedReceiveID: product.TranrcD_ID,
                currentSelectedItemScanQty: product.TranrcD_QuantityScan,
                newSelectedItemScanQty: product.TranrcD_QuantityScan,
                currentSelectedReceiveQty: product.TranrcD_QuantityRecv,
                currentSelectedBatchQty: product.TranrcD_QtyBatch,
                currentSelectedItemExpDate: product.StckD_Expdate,
                currentSelectedItemQtyValidity: product.TranrcD_QtyValidYN,
                currentSelectedItemProdCode: product.TranrcD_Procod,
                currentSelectedItemName: product.TranrcD_Prodes,
            });
        } catch (error) {
            this.setState({
                isEditOverallInfoModalShown: !this.state.isEditOverallInfoModalShown,
            });
        }
    };



    //Show edit in process message
    showEditingInProcessMessage = () => {
        return (
            <p style={{
                fontSize: '14px',
                display: this.state.editingInProcessMessageVisibility,
                marginRight: '16px',
                marginTop: "8px"
            }}>
                Mohon tunggu sebentar ...
            </p>
        );
    }


    showAddingBatchInProcessMessage = () => {
        return (
            <p style={{
                fontSize: '14px',
                display: this.state.addingBatchInProcessMessageVisibility,
                marginRight: '16px',
                marginTop: "8px"
            }}>
                Mohon tunggu sebentar ...
            </p>
        );
    }



    //Show Button that serve as trigger to download receive number as excel
    showDownloadExcelUrl = () => {
        return (
            <ReactHTMLTableToExcel
                id="test-table-xls-button"
                table="detailTable"
                filename={this.state.currentNoReceive}
                sheet={this.state.currentNoReceive}
                buttonText="Download as Excel"
                className="btn btn-secondary mr-2" />
        )
    }



    populateTable = () => {
        if (this.state.productList === null) {
            return (
                <div className="d-flex justify-content-center mt-3">
                    <h5>Detail Not Available</h5>
                </div>
            );
        } else {
            return (
                <Table id="detailTable" responsive hover striped>
                    <thead>
                        <tr style={{ textAlign: 'center' }}>
                            <th style={{ width: '10%' }}>ProCode</th>
                            <th style={{ width: '15%' }}>ProDes</th>
                            <th style={{ width: '5%' }}>Qty Receive</th>
                            <th style={{ width: '10%' }}>Sell Pack</th>
                            <th style={{ width: '5%' }}>Qty Batch</th>
                            <th style={{ width: '10%' }}>Qty DO</th>
                            {/* <th style={{ width: '5%' }}>Stock</th> */}
                            <th style={{ width: '15%' }}>Exp. Date</th>
                            <th style={{ width: '10%' }}>Batch</th>
                            <th style={{ width: '5%' }}>Valid</th>
                            {this.state.isPrintButtonAvailable ? <th colSpan="2" style={{ width: '10%' }}>Action</th> : null}

                        </tr>
                    </thead>
                    <tbody>
                        {this.populateTableRow()}
                    </tbody>
                </Table>
            );
        }
    };


    populateTableRow = () => {
        return (
            this.state.productList.map(product => (
                <tr style={{
                    textAlign: 'center'
                }}>
                    <td style={{ width: '10%' }}>{product.TranrcD_Procod}</td>
                    <td style={{ width: '15%', textAlign: 'left' }}>
                        {product.TranrcD_Prodes}
                    </td>
                    <td style={{ width: '5%' }}>{product.TranrcD_QuantityScan}</td>
                    <td style={{ width: '10%' }}>{product.TranrcD_SellPack}</td>
                    <td style={{ width: '5%' }}>{product.TranrcD_QtyBatch}</td>
                    <td style={{ width: '10%' }}>{product.TranrcD_QuantityRecv}</td>
                    {/* <td style={{ width: '5%' }}>{product.TranrcD_QuantityStk}</td> */}
                    <td style={{ width: '15%', color: product.TranrcD_BatchNumber == "NOBATCH" ? "red" : "" }}>
                        {new Date(product.StckD_Expdate).toDateString()}
                    </td>
                    <td style={{ width: '10%', color: product.TranrcD_BatchNumber == "NOBATCH" ? "red" : "" }}>{product.TranrcD_BatchNumber}</td>

                    {
                        product.TranrcD_QtyValidYN === "Y" ? <td style={{ width: '5%', color: "green" }}>YES</td> : <td style={{ width: '5%', color: "red" }}>NO</td>
                    }


                    {
                        this.state.isPrintButtonAvailable ?
                            <td style={{ width: '5%' }}>
                                <h3 onClick={() => this.addBatchModalVisibilityToggle(product)} ><MdNoteAdd /></h3>
                            </td>
                            : null
                    }
                    {this.state.isPrintButtonAvailable ?
                        <td style={{ width: '5%' }}>
                            <h3 style={{ fontSize: '24px' }} onClick={() =>
                                this.editOverallInfoModalVisibilityToggle(product)
                            }
                            ><MdModeEdit /></h3>
                        </td> : null}

                </tr>
            ))
        )
    }



    showErrorMessage = () => {
        return (
            <h5>Data / Service Not Available</h5>

        );
    };



    //Show/Hide Toggle for add batch modal
    addBatchModalVisibilityToggle = product => {
        try {
            this.setState({
                isAddBatchModalShown: !this.state.isAddBatchModalShown,
                currentSelectedItemBatch: product.TranrcD_BatchNumber,
                currentSelectedReceiveID: product.TranrcD_ID,
                currentSelectedItemScanQty: product.TranrcD_QuantityScan,
                newSelectedItemScanQty: product.TranrcD_QuantityScan,
                currentSelectedReceiveQty: product.TranrcD_QuantityRecv,
                currentSelectedBatchQty: product.TranrcD_QtyBatch,
                currentSelectedItemExpDate: product.StckD_Expdate,
                currentSelectedItemQtyValidity: product.TranrcD_QtyValidYN,
                isAddBatchButtonDisabled: true
            });
        } catch (error) {
            this.setState({
                isAddBatchModalShown: !this.state.isAddBatchModalShown,
                isAddBatchButtonDisabled: true
            });
        }
    };



    updateQtyScanInputValue(evt) {
        this.setState({
            currentSelectedItemScanQty: evt.target.value,
        }, () => {

            console.log("QTY : " + this.state.currentSelectedItemScanQty)

            if (this.state.currentSelectedItemScanQty < 0 || !this.state.currentSelectedItemBatch.trim() || isNaN(parseInt(this.state.currentSelectedItemScanQty))) {
                this.setState({ isEditButtonDisabled: true })
            } else {
                this.setState({ isEditButtonDisabled: false })
            }
        });
    }

    updateNewQtyScanInputValue(evt) {
        this.setState({
            newSelectedItemScanQty: evt.target.value,
        }, () => {
            if (this.state.newSelectedItemScanQty < 0 || !this.state.newSelectedItemBatch.trim() || isNaN(parseInt(this.state.newSelectedItemScanQty))) {
                this.setState({ isAddBatchButtonDisabled: true })
            } else {
                this.setState({ isAddBatchButtonDisabled: false })
            }
        });
    }



    updateNewBatchInputValue(evt) {
        this.setState({
            newSelectedItemBatch: evt.target.value,
        }, () => {
            if (!this.state.newSelectedItemBatch.trim() || this.state.newSelectedItemScanQty < 0 || isNaN(parseInt(this.state.newSelectedItemScanQty))) {
                this.setState({ isAddBatchButtonDisabled: true })
            } else {
                this.setState({ isAddBatchButtonDisabled: false })
            }
        });
    }



    printReceive = () => {
        var result = this.state.productList.map(
            product => product.TranrcD_QtyValidYN,
        );

        if (result.includes('N')) {
            this.setState({
                uneligibleToPrintMessageVisibility: 'block',
            });
        } else {
            this.setState({
                printingReceiveInProcessMessageVisibility: 'block',
                uneligibleToPrintMessageVisibility: 'none',
                isConfirmPrintButtonAvailable: false,
            });
            var url = base_url_all +
                'tnin?PrintReceive=' +
                this.state.currentNoReceive;

            Axios.get(url).then(response => {

                this.setState({ isConfirmPrintButtonAvailable: true });
                this.printSUccessfullModalVisibilityToggle();
            });
        }
    };




    navigateToPrintPage = () => {
        this.props.history.push('/ReturToGudangPrintPreview');
    };



    insertNewBatch = () => {
        var url = base_url_all +
            'tnin?insert=batch&NoTranrc=' +
            this.state.currentNoReceive +
            '&TranrcDID=' +
            this.state.currentSelectedReceiveID;


        if (this.state.newSelectedItemScanQty > Math.abs(this.state.currentSelectedBatchQty - this.state.currentSelectedItemScanQty)) {
            this.setState({
                addingBatchInProcessMessageVisibility: 'none',
                uneligibleToAddBatchMessageVisibility: 'block'
            })
        } else {
            this.setState({
                addingBatchInProcessMessageVisibility: 'block',
                uneligibleToAddBatchMessageVisibility: 'none'
            })

            Axios.post(url, {
                TranrcD_BatchNumber: this.state.newSelectedItemBatch,
                TranrcD_QuantityScan: parseInt(this.state.newSelectedItemScanQty),
                TranrcD_QtyBatch: parseInt(this.state.newSelectedItemScanQty),
                StckD_Expdate: new Date(this.state.currentSelectedItemExpDate)
            }).then(
                response => {
                    this.setState({ addingBatchInProcessMessageVisibility: 'none' })
                    this.closeAllModal()
                    this.getProductList(this.state.currentNoReceive)
                    this.showNotification("Anda berhasil memasukkan no. batch baru", "success")
                },
                error => {
                    if (error.response.data.error.code == 400) {
                        this.setState({ addingBatchInProcessMessageVisibility: 'none' }, () => {
                            this.showNotification(error.response.data.error.msg, 'error');
                        })

                    }
                    this.setState({ addingBatchInProcessMessageVisibility: 'none' })
                    this.showNotification("Terjadi Kesalahan, silahkan coba lagi", 'error');
                },
            );
        }


    };


    //...read the function name.
    closeAllModal = () => {
        this.setState({
            isEditQtyModalShown: false,
            isEditOverallInfoModalShown: false,
            isAddBatchModalShown: false,
            isSaveEditModalShown: false,
            isCurrentlyEditingInProcess: false,
            isAddBatchButtonDisabled: true,
            isEditButtonDisabled: true,
            qtyScanValidationMessageVisibility: 'none',
            invalidDateFormatMessageVisibility: 'none',
            editingInProcessMessageVisibility: 'none',
            addingBatchInProcessMessageVisibility: 'none',
            uneligibleToAddBatchMessageVisibility: 'none'
        });
    };



    showQtyScanValidationMessage = () => {
        return (
            <p
                style={{
                    fontSize: '12px',
                    display: this.state.qtyScanValidationMessageVisibility,
                }}
            >
                Scan Qty melebihi Kapasitas !
            </p>
        );
    };


    showInvalidDateFormatMessage = () => {
        return (
            <p
                style={{
                    fontSize: '12px',
                    display: this.state.invalidDateFormatMessageVisibility,
                }}
            >
                Format Tanggal Salah !
            </p>
        );
    };


    confirmationModalVisibilityToggle = () => {
        this.setState({
            isConfirmationModalVisible: !this.state.isConfirmationModalVisible,
        });
    };


    //Show if data sent successfully
    printSUccessfullModalVisibilityToggle = () => {
        this.setState({
            isPrintSuccessModalVisible: !this.state.isPrintSuccessModalVisible,
        });
    };


    //Show if user not eligible to print
    showUneligibleToPrintMessage = () => {
        return (
            <p
                style={{
                    fontSize: '12px',
                    display: this.state.uneligibleToPrintMessageVisibility,
                    color: 'red',
                    marginRight: "16px",
                    marginTop: "8px"
                }}
            >
                Quantity Receive belum terpenuhi
            </p>
        );
    };


    showPrintingInProcessMessage = () => {
        return (
            <p
                style={{
                    fontSize: '12px',
                    display: this.state.printingReceiveInProcessMessageVisibility,
                    marginTop: "16px"
                }}
            >
                Mohon Tunggu sebentar...
            </p>
        );
    }



    showReceiveHeader = () => {
        return (
            <Row>
                <Col xs="2">
                    <h6 style={{ fontWeight: 'bold' }}>No. Receive </h6>
                    <h6 style={{ fontWeight: 'bold', marginTop: '16px' }}>
                        No. Transfer{' '}
                    </h6>
                    <h6 style={{ fontWeight: 'bold', marginTop: '16px' }}>
                        Pengirim{' '}
                    </h6>
                </Col>
                <Col xs="2">
                    <h6>{this.state.currentNoReceive}</h6>
                    <h6 style={{ marginTop: '16px' }}>
                        {this.state.currentNoTransfer}{' '}
                    </h6>
                    <h6 style={{ marginTop: '16px' }}>
                        {this.state.currentOutletPengirim}
                    </h6>
                </Col>
                <Col xs="2">
                    <h6 style={{ fontWeight: 'bold' }}>Tgl. Receive </h6>
                    <h6 style={{ fontWeight: 'bold', marginTop: '16px' }}>
                        Tgl. Print Rcv.(TnIn){' '}
                    </h6>
                    <h6 style={{ fontWeight: 'bold', marginTop: '16px' }}>
                        Penerima{' '}
                    </h6>

                </Col>
                <Col xs="2">
                    <h6>{new Date(this.state.tanggalReceive).toDateString()}</h6>
                    <h6 style={{ marginTop: '16px' }}>
                        {new Date(this.state.tanggalPrint).toDateString()}
                    </h6>
                    <h6 style={{ marginTop: '16px' }}>
                        {this.state.currentOutletPenerima}
                    </h6>
                </Col>
                <Col xs="2">
                    <h6 style={{ fontWeight: 'bold' }}>Delete </h6>
                    <h6 style={{ fontWeight: 'bold', marginTop: '16px' }}>
                        Print{' '}
                    </h6>
                    <h6 style={{ fontWeight: 'bold', marginTop: '16px' }}>
                        Kategori{' '}
                    </h6>
                </Col>
                <Col xs="2">
                    {this.state.isDelete === 'Y' ? <h6>NO</h6> : <h6>YES</h6>}
                    {this.state.isPrint === 'P' ? (
                        <h6 style={{ marginTop: '16px' }}>YES</h6>
                    ) : (
                            <h6 style={{ marginTop: '16px' }}>NO</h6>
                        )}
                    <h6 style={{ marginTop: '16px' }}>
                        {this.state.currentSelectedCategory.toUpperCase()}
                    </h6>
                </Col>
            </Row>
        )
    }



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
                        {/* The detail of the current transfer */}
                        {this.showReceiveHeader()}

                        {/* Print no.receive Confirmation Modal (Initially hidden) */}
                        <Modal
                            isOpen={this.state.isConfirmationModalVisible}
                            toggle={() => this.confirmationModalVisibilityToggle()}
                        >
                            <ModalHeader>Print Receive</ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col>
                                        <h6>Anda yakin akan print receive ?</h6>
                                        {this.showPrintingInProcessMessage()}
                                    </Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                {this.showUneligibleToPrintMessage()}
                                <Button
                                    disabled={this.state.isConfirmPrintButtonAvailable}
                                    color="danger"
                                    onClick={() => this.printReceive()}
                                >
                                    OK
                                </Button>
                                <Button color="secondary" onClick={() => this.closeAllModal()}>
                                    Batal
                                </Button>
                            </ModalFooter>
                        </Modal>

                        {/* Success Print no.receive Confirmation Modal (Initially hidden) */}
                        <Modal
                            isOpen={this.state.isPrintSuccessModalVisible}
                            toggle={() => this.printSUccessfullModalVisibilityToggle()}
                        >
                            <ModalHeader>Print Receive</ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col>
                                        <h6>Print Receive Berhasil !</h6>
                                    </Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    onClick={() => window.location.reload(false)}
                                >
                                    OK
                                </Button>
                            </ModalFooter>
                        </Modal>

                        {/* Add batch Modal (Initially hidden) */}
                        <Modal
                            backdrop="static"
                            isOpen={this.state.isAddBatchModalShown}
                            toggle={() => this.addBatchModalVisibilityToggle()}
                        >
                            <ModalHeader>Add Batch</ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <h5>Qty Scan</h5>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Input
                                                    type="number"
                                                    onChange={e => this.updateNewQtyScanInputValue(e)}

                                                />
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col>
                                        <Row>
                                            <Col>
                                                <h5>New Batch Number</h5>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Input
                                                    onChange={e => this.updateNewBatchInputValue(e)}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: '24px' }}>
                                    <Col>
                                        <h5>Exp. Date</h5>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Input
                                            type="date"
                                            onChange={e => this.updateExpDateInputValue(e)}
                                            defaultValue={this.state.currentSelectedItemExpDate.substr(
                                                0,
                                                this.state.currentSelectedItemExpDate.indexOf('T'),
                                            )}
                                        />
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: '8px' }}>
                                    <Col>{this.showUneligibletoAddBatcMessage()}</Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                {this.showAddingBatchInProcessMessage()}
                                <Button disabled={this.state.isAddBatchButtonDisabled} color="danger" onClick={() => this.insertNewBatch()}>
                                    Simpan
                                </Button>{' '}
                                <Button color="secondary" onClick={() => this.closeAllModal()}>
                                    Batal
                                </Button>
                            </ModalFooter>
                        </Modal>

                        {/* Edit Overall Detail Modal (Initially hidden) */}
                        <Modal
                            backdrop="static"
                            isOpen={this.state.isEditOverallInfoModalShown}
                            toggle={() => this.editOverallInfoModalVisibilityToggle()}
                        >
                            <ModalHeader>Edit Detailed Info</ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <h5>Product Code</h5>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Input
                                                    disabled
                                                    defaultValue={this.state.currentSelectedItemProdCode}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col>
                                        <Row>
                                            <Col>
                                                <h5>Product Desc.</h5>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Input
                                                    disabled
                                                    defaultValue={this.state.currentSelectedItemName}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: '24px' }}>
                                    <Col>
                                        <Row>
                                            <Col>
                                                <h5>Qty Receive</h5>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Input
                                                    type="number"
                                                    onChange={e => this.updateQtyScanInputValue(e)}

                                                />
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col>
                                        <Row>
                                            <Col>
                                                <h5>Batch</h5>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Input
                                                    onChange={e => this.updateBatchNumberInputValue(e)}
                                                    defaultValue={this.state.currentSelectedItemBatch}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: '8px' }}>
                                    <Col>{this.showQtyScanValidationMessage()}</Col>
                                </Row>

                                <Row style={{ marginTop: '24px' }}>
                                    <Col>
                                        <h5>Exp. Date</h5>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Input
                                            type="date"
                                            onChange={e => this.updateExpDateInputValue(e)}
                                            defaultValue={this.state.currentSelectedItemExpDate.substr(
                                                0,
                                                this.state.currentSelectedItemExpDate.indexOf('T'),
                                            )}
                                        />
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: '8px' }}>
                                    <Col>{this.showInvalidDateFormatMessage()}</Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                {this.showEditingInProcessMessage()}
                                <Button disabled={this.state.isEditButtonDisabled} color="danger" onClick={() => this.editOverallInfo()}>
                                    Simpan
                                </Button>
                                <Button color="secondary" onClick={() => this.closeAllModal()}>
                                    Batal
                                </Button>
                            </ModalFooter>
                        </Modal>



                        <h6 style={{ float: 'left', marginTop: '16px' }}>
                            <b><i>{'Produk Total : ' + this.state.totalProductQty} </i></b>
                        </h6>

                        {this.showGeneratingPDFInProcessMessage()}
                        {this.state.isPrintButtonAvailable ? null : this.showDownloadPdfUrl()}
                        {/* Generate Excel */}
                        {/* {this.state.isPrintButtonAvailable ? null : this.showDownloadExcelUrl()} */}
                        <Button
                            disabled={!this.state.isPrintButtonAvailable}
                            color="danger"
                            style={{ float: 'right' }}
                            onClick={() => this.confirmationModalVisibilityToggle()}
                        >
                            Print
                                </Button>
                        {/* <p style={{ fontSize: '14px', float: 'right' }}>
                            <b><i>{'Tanggal Print : ' + new Date(this.state.tanggalPrint).toDateString()} </i></b>
                        </p> */}


                        {/* Main Table */}
                        {this.populateTable()}

                        {/* Error Message */}
                        <div className="d-flex justify-content-center mt-3">
                            {this.state.isDataAvailable ? null : this.showErrorMessage()}
                        </div>


                        {/* Navigate to Home Button */}
                        <Row>
                            <Col
                                style={{
                                    display: 'flex',
                                    justifyContent: 'left',
                                    marginTop: '16px',
                                }}
                            >
                                <Button onClick={() => (window.location.href = '/ReturToGudang')}>
                                    Home
                                </Button>
                            </Col>
                        </Row>

                        {/* Pagination buttons
                        <div>
                            <Form
                                inline
                                className="cr-search-form"
                                onSubmit={e => e.preventDefault()}
                                style={{
                                    textAlign: "center",
                                    justifyContent: "center",
                                    marginTop: "50px",
                                    display: this.state.pagination,
                                }}>

                                <Button>
                                    {"<<"}
                                </Button>

                                <Button>
                                    {"<"}
                                </Button>

                                <Button
                                    disabled
                                >
                                    {this.state.page} / {this.state.maxPage}
                                </Button>

                                <Button>
                                    {">"}
                                </Button>

                                <Button>
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
export default View;
