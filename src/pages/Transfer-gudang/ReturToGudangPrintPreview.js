import Page from 'components/Page';
import React from 'react'
import {
    Table, Input, Form, FormFeedback, Card, CardHeader, CardBody,
    ButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem, Button, Row, Col,
    Pagination, PaginationItem, PaginationLink, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import 'react-tabs/style/react-tabs.css';



class View extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditQtyModalShown: false,
            isEditOverallInfoModalShown: false,
            currentSelectedItemScanQty: 0,
            currentSelectedItemBatch: 0,

            productList: [
                {
                    isEdited: false,
                    procode: "0104611",
                    prodes: "PROLIC 300MG CAP 100's	",
                    qtyScan: 10,
                    sellPack: "Capsul",
                    qtyBatch: 20,
                    qtyDO: 10,
                    stock: 60,
                    expDate: "01 FEB 2999",
                    batch: "X0104611",
                    isDetailEditable: false
                },
                {
                    isEdited: true,
                    procode: "0104611",
                    prodes: "PROLIC 300MG CAP 100's	",
                    qtyScan: 20,
                    sellPack: "Capsul",
                    qtyBatch: 80,
                    qtyDO: 80,
                    stock: 80,
                    expDate: "01 DEC 2999",
                    batch: "X0104611",
                    isDetailEditable: true
                },
                {
                    isEdited: false,
                    procode: "0104611",
                    prodes: "PROLIC 300MG CAP 100's	",
                    qtyScan: 2,
                    sellPack: "Capsul",
                    qtyBatch: 40,
                    qtyDO: 10,
                    stock: 86,
                    expDate: "01 NOV 2999",
                    batch: "X0104611",
                    isDetailEditable: false
                }
            ]
        }
    }

    editQtyModalVisibilityToggle = (currentScanQty) => {
        this.setState({
            isEditQtyModalShown: !this.state.isEditQtyModalShown,
            currentSelectedItemScanQty: currentScanQty
        })
    }

    editOverallInfoModalVisibilityToggle = (currentScanQty, currentBatch) => {
        this.setState({
            isEditOverallInfoModalShown: !this.state.isEditOverallInfoModalShown,
            currentSelectedItemScanQty: currentScanQty,
            currentSelectedItemBatch: currentBatch
        })
    }

    render() {
        return (
            <Page
            >

                {/* Keperluan Autentifikasi */}
                {/* {this.renderRedirect()} */}
                <Card>

                    <CardBody>

                        {/* Navigate to Home Button */}
                        <Row>
                            <Col style={{ display: "flex", justifyContent: "left", marginTop: "16px" }}>
                                <Button onClick={() => window.location.href = "/ReturToGudang"}>
                                    Home
                                </Button>
                            </Col>
                        </Row>


                        {/* The Print preview. 
                            You need Internet connection in order to display the PDF preview.
                            (Well no shit, sherlock) */}
                        <Row>
                            <Col style={{ marginTop: "16px" }}>
                                <object data="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" type="application/pdf" width="100%" height="600px">
                                    <p>Alternative text - include a link <a href="myfile.pdf">to the PDF!</a></p>
                                </object>
                            </Col>
                        </Row>

                    </CardBody>
                </Card>
            </Page>
        )
    }

}
export default View;