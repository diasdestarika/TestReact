import React from 'react'
import {
    Label, Input, Card, CardHeader, CardBody, CardFooter, Table, Button,
    Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'
import { MdPrint, MdClose } from 'react-icons/md'
import Page from 'components/Page';
import { url_getData_EkspedisiIntegra, url_getPdf, url_getResi } from '../urlLinkIntegra'
import Axios from 'axios';

class ExpedisiCHC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            gudangId: window.localStorage.getItem('gID'),
            orderId_Eccommerce_toPrint: 'INV/20201208/XX/XII/694478112',
            noResi: '',
            modalPrintResiIsOpen: false,
            DoNumber: [
                'I002012000002',
                'I002012000054',
                'I002012000055'
            ],
            doCount: 0,
            selectedOrderId: ""
        }
    }

    componentDidMount() {
        this.getCHCExpeditionData()
        this.props.setTitle(
            'Pesanan Untuk Di Proses (Century E-Commerce)',
            'red'
        )
    }

    getCHCExpeditionData = () => {
        var url_getData = "https://staging-api.chc.pharmalink.id/century-e-member/order?dummy"
        // var url_getData = "https://staging-api.chc.pharmalink.id/ekspedisi-chc/ekspedisi?monitoring&gudangID=" + this.state.gudangId
        Axios
            .get(url_getData)
            .then((response) => {
                console.log(response)
                this.setState({
                    result: response.data.data
                })
            })
            .catch((error) => {
                alert(error.message)
            })
    }

    getPdfToPrint = () => {
        var url_getpdf_toprint = "https://staging-api.chc.pharmalink.id/ekspedisi-chc/ekspedisi?resi=JNT&orderID=" + this.state.selectedOrderId
        console.log('url pdf', url_getpdf_toprint)
        Axios
            .get(url_getpdf_toprint, { responseType: 'arraybuffer' })
            .then((response) => {
                console.log('response pdf', response.data)

                const urlBlob = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                const link = document.createElement('a');
                link.href = urlBlob;
                link.setAttribute('download', this.state.selectedOrderId + '.pdf');
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => {
                console.log({ error })
            })
    }


    getNomorResi = (orderId) => {
        // this.setState({
        //     doCount:this.state.doCount + 1
        // })
        // var url_getResi_toprint = url_getResi+this.state.orderId_Eccommerce_toPrint+'&donum='+this.state.DoNumber[this.state.doCount]
        var url_getResi_toprint = 'https://staging-api.chc.pharmalink.id/ekspedisi-chc/ekspedisi?book=trial&orderID=' + orderId
        console.log('url resi', url_getResi_toprint)
        Axios
            .post(url_getResi_toprint)
            .then((response) => {
                console.log('response get no resi', response)
                if (response.data.data) {
                    this.setState({
                        noResi: response.data.data.awb_no,
                        selectedOrderId: orderId
                    }, () => this.openPrintResiModal('open'))
                }
            })
            .catch((error) => {
                console.log({ error })
            })
    }

    openPrintResiModal = (type) => {
        if (type === 'open') {
            this.setState({
                modalPrintResiIsOpen: true,
            })
        } else if (type === 'close') {
            this.setState({
                modalPrintResiIsOpen: false,
                orderId_Eccommerce_toPrint: ''
            })
        }
    }

    returnSuitableButton = (buttonStatus, orderId) => {
        if (!buttonStatus) {
            return (
                <Button
                    color='success'
                    onClick={() => this.getNomorResi(orderId)}
                >
                    Request Pickup
                </Button>
            )
        } else if (buttonStatus) {
            return (
                <Button disabled color='danger'>
                    No Pickup
                </Button>
            )
        }
    }

    render() {
        const { result, orderId_Eccommerce_toPrint, noResi, modalPrintResiIsOpen } = this.state
        return (
            <Page className='Ekspedisi-Integra'>
                <Card>
                    <CardBody>
                        <Table responsive striped style={{ width: "100%" }}>
                            <thead>
                                <tr>
                                    <th style={{ width: "12.5%" }}>
                                        Tanggal Order
                                    </th>
                                    <th style={{ width: "12.5%" }}>
                                        Outlet
                                    </th>
                                    <th style={{ width: "12.5%" }}>
                                        OrderID
                                    </th>
                                    <th style={{ width: "12.5%" }}>
                                        Deadline
                                    </th >
                                    <th style={{ width: "12.5%" }}>
                                        NoSP
                                    </th>
                                    <th style={{ width: "10%" }}>
                                        NoDO
                                    </th>
                                    <th style={{ width: "12.5%" }}>
                                        S. WKT
                                    </th>
                                    <th style={{ width: "12.5%" }}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {result && result.map((item) =>
                                    <tr>
                                        <td style={{ width: "12.5%" }}>{item.Order_TanggalOrder.substr(0, item.Order_TanggalOrder.indexOf('T'))}</td>
                                        <td style={{ width: "12.5%" }}>{item.Order_NmOutlet}</td>
                                        <td style={{ width: "12.5%" }}>{item.OrderIDEcommerce}</td>
                                        <td style={{ width: "12.5%" }}>{item.Order_Deadline === '' ? '-' : item.Order_Deadline.substr(0, item.Order_Deadline.indexOf('T'))}</td>
                                        <td style={{ width: "12.5%" }}>{item.Order_NOSP === '' ? '-' : item.Order_NOSP}</td>
                                        <td style={{ width: "12.5%" }}>{item.Order_NODO === '' ? '-' : item.Order_NODO}</td>
                                        <td style={{ width: "12.5%" }}>{item.Order_Duration}</td>
                                        <td style={{ width: "12.5%" }}>
                                            {this.returnSuitableButton(item.enable_button, item.OrderIDEcommerce)}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>

                <Modal isOpen={modalPrintResiIsOpen}>
                    <ModalBody>
                        <Label>OrderID: </Label>
                        <Input
                            disabled
                            value={orderId_Eccommerce_toPrint}
                            style={{ fontWeight: 'bold' }}>
                        </Input>
                        <Label>No Resi: </Label>
                        <Input
                            disabled
                            value={noResi}
                            style={{ fontWeight: 'bold' }}>
                        </Input>
                    </ModalBody>
                    <ModalFooter style={{ justifyContent: 'center' }}>
                        <Button
                            onClick={() => this.getPdfToPrint()}
                            color='success'>
                            <MdPrint />
                             Print Resi
                        </Button>
                        <Button color='danger'
                            onClick={() => window.location.reload(false)}
                        >
                            <MdClose />
                             Exit
                        </Button>
                    </ModalFooter>
                </Modal>
            </Page>
        )
    }

}
export default ExpedisiCHC;