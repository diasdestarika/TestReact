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
import { MdModeEdit, MdNoteAdd } from "react-icons/md";
import Axios from 'axios';
import { base_url_all } from 'pages/urlLink';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import {
    MdLoyalty,
} from 'react-icons/md';

class View extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditQtyModalShown: false,
            isAddBatchModalShown: false,
            isEditOverallInfoModalShown: false,
            isEditButtonDisabled: true,
            isSaveEditModalShown: false,
            isCurrentlyEditingInProcess: false,
            isAddBatchButtonDisabled: true,

            currentSelectedItemScanQty: -1,
            currentSelectedItemBatch: '',
            currentSelectedItemName: '',
            currentSelectedItemQtyValidity: '',
            currentSelectedReceiveID: '',
            currentSelectedReceiveNumber: '',
            currentSelectedCategory: '',
            currentSelectedItemExpDate: '',
            currentSelectedReceiveQty: 0,
            currentSelectedBatchQty: 0,
            currentNoTransfer: '',
            currentProcode: '',
            currentSelectedItemProdCode: '',
            currentSelectedItemName: '',

            qtyScanValidationMessageVisibility: 'none',
            invalidDateFormatMessageVisibility: 'none',
            editingInProcessMessageVisibility: 'none',
            addingBatchInProcessMessageVisibility: 'none',
            uneligibleToAddBatchMessageVisibility: 'none',

            totalProductQty: 0,
            isAddBatchModalShown: false,

            newSelectedItemBatch: '',
            newSelectedItemScanQty: -1,

            isAlreadyPrinted: false,

            generatedNoReceive: '',

            productList: [],
            productListAfterFilter: [],
            inputtedProCode: '',

            currentHeader: '',
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



    showInvalidDateFormatMessage = () => {
        return (
            <p style={{
                fontSize: '12px',
                display: this.state.invalidDateFormatMessageVisibility,
            }}
            >
                Format Tanggal Salah !
            </p>
        );
    };



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


    updateQtyScanInputValue(evt) {
        this.setState({
            currentSelectedItemScanQty: evt.target.value,
        }, () => {
            if (this.state.currentSelectedItemScanQty < 0 || !this.state.currentSelectedItemBatch.trim() || isNaN(parseInt(this.state.currentSelectedItemScanQty))) {
                this.setState({ isEditButtonDisabled: true })
            } else {
                this.setState({ isEditButtonDisabled: false })
            }
        });
    }

    updateBatchNoInputValue(evt) {
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
            if (!this.state.newSelectedItemBatch.trim() || this.state.newSelectedItemScanQty <= 0 || isNaN(parseInt(this.state.newSelectedItemScanQty))) {
                this.setState({ isAddBatchButtonDisabled: true })
            } else {
                this.setState({ isAddBatchButtonDisabled: false })
            }
        });
    }



    updateExpDateInputValue = evt => {
        this.setState({
            currentSelectedItemExpDate: evt.target.value,
        });
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



    //Bruh this call is only for get the print status
    getHeader = noReceive => {
        var url = base_url_all + 'tnin?find=header&noRecv=' + noReceive;

        Axios.get(url).then(
            response => {
                var header = response.data.data;

                if (header.TranrcH_Flag === "P") {
                    this.setState({ isAlreadyPrinted: true })
                } else {
                    this.setState({ isAlreadyPrinted: false })
                }
            },
            error => {
                console.log(error);
            },
        );
    }



    //Populate table by service
    getDetail = noReceive => {
        var url = base_url_all + 'tnin?find=detail&noRecv=' + noReceive;

        Axios.get(url).then(
            response => {
                var productList = response.data.data;

                this.setState(
                    {
                        productList: productList,
                        productListAfterFilter: productList,
                    }, () => {

                        // If product list is not empty then count total item qty
                        if (this.state.productListAfterFilter != null) {
                            window.scrollTo(0, window.localStorage.getItem('scrollPos') || 0, 0);

                            var procodeArray = this.state.productListAfterFilter.map(
                                product => product.TranrcD_Procod,
                            );

                            var distinctProcodeArray = [...new Set(procodeArray)];

                            this.setState({
                                totalProductQty: distinctProcodeArray.length,
                            });
                        }
                    },
                );
            },
            error => {
                console.log(error);
            },
        );
    };



    //...just re-read the function name, my man.
    redirectToHomePage = () => {
        this.props.history.push('/ReturToGudang');
    };



    componentDidMount() {
        window.addEventListener('scroll', function () {
            //When scroll change, you save it on localStorage.
            window.localStorage.setItem('scrollPos', window.scrollY);
        }, false);

        try {

            this.setState({
                generatedNoReceive: this.props.location.state.noReceive,
                currentSelectedCategory: this.props.location.state.category,
                currentNoTransfer: this.props.location.state.noTransfer,
                currentHeader: this.props.location.state.overallHeader,
            },
                () => {
                    this.getDetail(this.state.generatedNoReceive);
                    this.props.setTitle('TRANSFER IN ' + window.localStorage.getItem('gName'), 'red');
                    this.getHeader(this.state.generatedNoReceive)
                },
            );
        } catch (err) {
            this.redirectToHomePage();
        }
    }



    //Show/Hide Toggle for edit qty modal
    editQtyModalVisibilityToggle = (currentSelectedBatch, currentScanQty) => {
        this.setState({
            isEditQtyModalShown: !this.state.isEditQtyModalShown,
            currentSelectedItemScanQty: currentScanQty,
            currentSelectedItemBatch: currentSelectedBatch,
        });
    };



    //Show/Hide Toggle for add batch modal
    addBatchModalVisibilityToggle = product => {
        try {
            this.setState({
                isAddBatchModalShown: !this.state.isAddBatchModalShown,
                currentSelectedItemBatch: product.TranrcD_BatchNumber,
                currentSelectedReceiveID: product.TranrcD_ID,
                currentSelectedItemScanQty: product.TranrcD_QuantityScan,
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



    //Show/Hide Toggle for edit overall modal
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



    //Show/Hide Toggle for save change modal
    SaveModalVisibilityToggle = () => {
        this.setState({
            isSaveEditModalShown: !this.state.isSaveEditModalShown,
        });
    };



    //Handle event for search bar
    updateInputValue(evt) {
        this.setState({
            inputtedProCode: evt.target.value,
        });
    }



    //Filter Product list by inputted keyword
    filterProductList = () => {
        this.setState({
            productListAfterFilter: this.state.productList.filter(product =>
                product.TranrcD_Procod.includes(this.state.inputtedProCode),
            ),
        });
    };



    saveChanges = () => {
        this.navigateToDetailsPage(this.state.generatedNoReceive);
    };



    navigateToDetailsPage = noReceive => {
        this.props.history.push('/ReturToGudangSavedDetails', {
            noReceive: noReceive,
            category: this.state.currentSelectedCategory
        });
    };



    editOverallInfo = () => {
        this.setState({
            qtyScanValidationMessageVisibility: 'none',
            invalidDateFormatMessageVisibility: 'none',
            editingInProcessMessageVisibility: 'block',
            isEditButtonDisabled: true
        });

        var url =
            base_url_all + 'tnin?NoTranrc=' +
            this.state.generatedNoReceive +
            '&TranrcDID=' +
            this.state.currentSelectedReceiveID;

        var qtyValidity = 'N';

        if (this.state.currentSelectedItemScanQty == this.state.currentSelectedBatchQty) {
            qtyValidity = 'Y';
        } else {
            qtyValidity = 'N';
        }

        Axios.put(url,
            {
                TranrcD_BatchNumber: this.state.currentSelectedItemBatch,
                TranrcD_QuantityScan: parseInt(this.state.currentSelectedItemScanQty),
                TranrcD_QtyBatch: parseInt(this.state.currentSelectedBatchQty),
                TranrcD_Procod: this.state.currentSelectedItemProdCode,
                StckD_Expdate: new Date(this.state.currentSelectedItemExpDate)
            }).then(
                response => {

                    this.closeAllModal()
                    this.getDetail(this.state.generatedNoReceive)
                    this.showNotification("Anda berhasil informasi produk terkait", "success")

                    this.setState({
                        editingInProcessMessageVisibility: 'none',
                        isEditButtonDisabled: false
                    })
                },
                error => {
                    this.setState({
                        editingInProcessMessageVisibility: 'none',
                        isEditButtonDisabled: false
                    })

                    if (error.response.data.error.msg == "Qty Tidak Valid") {
                        this.setState({
                            qtyScanValidationMessageVisibility: 'block',
                        });
                    } else {
                        this.setState({
                            editingInProcessMessageVisibility: 'none',
                            isEditButtonDisabled: false
                        }, () => {
                            this.showNotification("Qty Tidak Valid", 'error');
                        })
                    }
                },
            );

    };



    //Add new batch
    insertNewBatch = () => {

        var url = base_url_all +
            'tnin?insert=batch&NoTranrc=' +
            this.state.generatedNoReceive +
            '&TranrcDID=' +
            this.state.currentSelectedReceiveID;

        if (this.state.newSelectedItemScanQty > Math.abs(this.state.currentSelectedBatchQty - this.state.currentSelectedItemScanQty)) {
            this.setState({
                addingBatchInProcessMessageVisibility: 'none',
                uneligibleToAddBatchMessageVisibility: 'block'
            })
        } else {
            var qtyValidity = 'N';

            if (this.state.currentSelectedItemScanQty == this.state.currentSelectedReceiveQty) {
                qtyValidity = 'Y';
            } else {
                qtyValidity = 'N';
            }

            this.setState({
                addingBatchInProcessMessageVisibility: 'block',
                uneligibleToAddBatchMessageVisibility: 'none'
            })

            Axios.post(url, {
                TranrcD_BatchNumber: this.state.newSelectedItemBatch,
                TranrcD_QuantityScan: parseInt(this.state.newSelectedItemScanQty),
                TranrcD_QtyBatch: parseInt(this.state.newSelectedItemScanQty),
                StckD_Expdate: new Date(this.state.currentSelectedItemExpDate)
            }
            ).then(
                response => {
                    this.closeAllModal()
                    this.getDetail(this.state.generatedNoReceive)
                    this.showNotification("Anda berhasil memasukkan no. batch baru", "success")
                    this.setState({ addingBatchInProcessMessageVisibility: 'none' })

                },
                error => {

                    if (error.response.data.error.code == 400) {
                        this.setState({
                            uneligibleToAddBatchMessageVisibility: 'block'
                        }, () => { this.showNotification(error.response.data.error.msg, 'error') })
                    }

                    console.log(error);
                    this.setState({ addingBatchInProcessMessageVisibility: 'none' })
                },
            );
        }
    };



    //Handle Enter Key in search baar
    handleEnter = e => {
        if (e.charCode == 13) {
            this.filterProductList();
        }
    };



    getFilteredProductQty = () => {
        try {
            if (this.state.productListAfterFilter.length == this.state.productList.length) {
                return (
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                        <i>{'Produk Ditemukan : ' + this.state.totalProductQty} </i>
                    </p>
                );
            } else {
                return (
                    <p style={{ fontSize: '14px', marginTop: '8px' }}>
                        <i>
                            {'Produk Ditemukan : ' + this.state.productListAfterFilter.length}{' '}
                        </i>
                    </p>
                );
            }
        } catch (error) {

        }
    };



    populateTable = () => {
        return (
            this.state.productListAfterFilter.map(product => (
                <tr style={{ textAlign: 'center' }}>

                    {/* Product Code */}
                    <td style={{ width: '10%' }}>{product.TranrcD_Procod}</td>

                    {/* Product Name */}
                    <td style={{ textAlign: 'left', width: '25%' }}>
                        {product.TranrcD_Prodes}
                    </td>

                    {/* Scan Qty */}
                    <td style={{ width: '5%' }}>
                        {product.TranrcD_QuantityScan}
                    </td>

                    {/* Sellpack */}
                    <td style={{ width: '10%' }}>{product.TranrcD_SellPack}</td>

                    {/* Batch Qty */}
                    <td style={{ width: '5%' }}>{product.TranrcD_QtyBatch}</td>

                    {/* DropOff Qty */}
                    <td style={{ width: '5%' }}>
                        {product.TranrcD_QuantityRecv}
                    </td>

                    {/* Stock Qty */}
                    {/* <td style={{ width: '5%' }}>
                    {product.TranrcD_QuantityStk}
                    </td> */}

                    {/* Exp. Date */}
                    <td style={{ width: '15%' }}>
                        {new Date(product.StckD_Expdate).toDateString()}
                    </td>

                    {/* Batch Number */}
                    <td style={{ width: '10%' }}>
                        {product.TranrcD_BatchNumber}
                    </td>

                    {/* Add Batch */}
                    {this.state.isAlreadyPrinted ? null :
                        <td style={{ alignItems: "center", width: '10%' }} >
                            <h3 onClick={() => this.addBatchModalVisibilityToggle(product)} ><MdNoteAdd /></h3>
                        </td>
                    }

                    {/* Edit Data */}
                    {this.state.isAlreadyPrinted ? null : <td style={{ width: '10%' }}>
                        <h3 onClick={() => this.editOverallInfoModalVisibilityToggle(product)} style={{ fontSize: '24px' }}><MdModeEdit /></h3>
                    </td>}
                </tr>
            ))
        )
    }



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



    showTotalProductQTy = () => {
        return (
            <p style={{ fontSize: '14px', float: 'right' }}>
                <i>
                    <b>{'Produk Total : ' + this.state.totalProductQty}</b>
                </i>
            </p>
        )
    }



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
                        <Row>
                            <Col xs="4" className="d-flex justify-content-center">
                                <Input
                                    onKeyPress={e => this.handleEnter(e)}
                                    value={this.state.inputtedProCode}
                                    onChange={e => this.updateInputValue(e)}
                                    placeholder="Masukkan Kode Produk"
                                />
                            </Col>

                            <Button onClick={() => this.filterProductList()}>CARI</Button>
                        </Row>
                        {this.getFilteredProductQty()}

                        <p style={{ fontSize: '14px', float: 'left' }}>
                            <i>
                                <b>{'No Receive : ' + this.state.generatedNoReceive}</b>
                            </i>
                        </p>

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
                                                <h5>Qty Receive</h5>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <Input
                                                    onChange={e => this.updateNewQtyScanInputValue(e)}
                                                    type="number"
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


                        {/* Save Confirmation Modal (Initially hidden) */}
                        <Modal
                            backdrop="static"
                            isOpen={this.state.isSaveEditModalShown}
                            toggle={() => this.SaveModalVisibilityToggle()}
                        >
                            <ModalHeader>Save</ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col>
                                        <h6>Anda yakin akan simpan perubahan ini ?</h6>
                                    </Col>
                                </Row>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onClick={() => this.saveChanges()}>
                                    Simpan
                                </Button>
                                <Button color="secondary" onClick={() => this.closeAllModal()}>
                                    Cancel
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
                                    <Col xs="4">
                                        <Row>
                                            <Col>
                                                <h5>Prod. Code</h5>
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

                                    <Col xs="8">
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
                                                <h5>Qty Scan</h5>
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
                                                    onChange={e => this.updateBatchNoInputValue(e)}
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
                                <Button color="danger" disabled={this.state.isEditButtonDisabled} onClick={() => this.editOverallInfo()}>
                                    Simpan
                                </Button>
                                <Button color="secondary" onClick={() => this.closeAllModal()}>
                                    Batal
                                </Button>
                            </ModalFooter>
                        </Modal>

                        {/* Main Table */}
                        {this.showTotalProductQTy()}
                        <Table responsive hover striped>
                            <thead>
                                <tr style={{ textAlign: 'center' }}>
                                    <th style={{ width: '10%' }}>ProCode</th>
                                    <th style={{ width: '25%' }}>ProDes</th>
                                    <th style={{ width: '5%' }}>Qty Receive</th>
                                    <th style={{ width: '10%' }}>Sell Pack</th>
                                    <th style={{ width: '5%' }}>Qty Batch</th>
                                    <th style={{ width: '5%' }}>Qty DO</th>
                                    {/* <th style={{ width: '5%' }}>Stock</th> */}
                                    <th style={{ width: '15%' }}>Exp. Date</th>
                                    <th style={{ width: '10%' }}>Batch</th>
                                    {/* Fitur Add batch (Belum validasi) */}
                                    {this.state.isAlreadyPrinted ? null : <th style={{ width: '10%' }}>Add Batch</th>}
                                    {this.state.isAlreadyPrinted ? null : <th style={{ width: '10%' }}></th>}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.productListAfterFilter != null ? this.populateTable() : null}
                            </tbody>
                        </Table>

                        {/* Save Button */}
                        <Row style={{ float: 'right' }}>
                            <Col
                                style={{
                                    display: 'flex',
                                    justifyContent: 'right',
                                    float: 'right',
                                }}
                            >
                                <Button
                                    color="danger"
                                    style={{ float: 'right' }}
                                    onClick={() => this.SaveModalVisibilityToggle()}
                                >
                                    Simpan
                                </Button>
                            </Col>
                        </Row>

                        {/* Pagination Button */}
                        {/* <div>
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
