import Page from 'components/Page';
import React from 'react';
import {
    Card, CardBody, Col, Row, Table, CardHeader, Form, Label, Button, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, InputGroup, Input, InputGroupAddon
} from 'reactstrap';
import { MdLoyalty, MdAutorenew, MdCheckCircle, MdHighlightOff } from 'react-icons/md';
import * as myUrl from '../urlLink';
import * as firebase from 'firebase/app';
import LoadingSpinner from '../LoadingSpinner';
import Switch from "react-switch";
import { object } from 'prop-types';

const perf = firebase.performance();

class AutoA extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            result2: [],
            currentPage: 1,
            currentPage2: 1,
            realCurrentPage: 1,
            realCurrentPage2: 1,
            todosPerPage: 4,
            todosPerPage2: 4,
            maxPage: 1,
            maxPage2: 1,
            flag: 0,
            flag2: 0,
            keyword: '',
            loading: false,
            checked: false,
            loading: false,
            disabled: false
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        this.setState({ checked });
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

    getListbyPaging(currPage, currLimit) {
        // const trace = perf.trace('getAutoA');
        // trace.start();
        var gudangID = window.localStorage.getItem('gID');
        const urlA = myUrl.url_autoA + "type=all" + "&gudangID=" + gudangID;

        const option = {
            method: "GET",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenCookies')
            },
        }

        fetch(urlA, option)
            .then(response => {

                // trace.stop();
                if (response.ok) {
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                    this.setState(
                        {
                            loading: false
                        });
                }
            }).then(data => {
                //console.log("DATA DARI BACKEND!", data);

                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if (data.responseDescription.toLowerCase().includes("expired")) {
                        window.localStorage.removeItem('tokenCookies');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                        })
                    }
                } else {
                    this.setState({ result: data, maxPage2: data.metadata.pages && data.metadata.pages !== "0" ? data.metadata.pages : 1, loading: false });
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }
            ).then(() => { this.setState({ loading: false }) });
    }

    componentDidMount() {
        this.props.setTitle("Auto Archieve", 'black');
        //console.log("INI LAGI");

        this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
        var myVar = setInterval(() => {
            //console.log("BERHASIL AUTO REFRESH")
            this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
        }, 1800000);
    }

    setActiveYN = (first_param, second_param) => () => {
        // const trace = perf.trace('updateStatus');
        // trace.start();
        var url = myUrl.url_activeYN;
        //console.log("url", url);

        this.fetchData();
        var payload = {
            LogID: first_param,
            ForceZeroStockYN: second_param,
        };

        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                // "Authorization": window.localStorage.getItem('tokenLogin')
            },
            body: JSON.stringify(payload)
        }
        //console.log("Payload", payload);
        //console.log("option", option);


        fetch(url, option)
            .then(response => {
                //console.log("respone", response);

                // trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_active: false,
                        modal_deactive: false,
                        loading: false
                    });
                    return response.json()
                }
                else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                //console.log("data", data);

                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if (data.responseDescription.toLowerCase().includes("expired")) {
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                        })
                    }

                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            });
    }


    //modal nonAktif
    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
    };

    toggle = modalType => (checked) => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    fetchData = () => {
        this.setState({ loading: true });
    };

    state = {
        modal_active: false,
        modal_deactive: false,
        active_deptcode_deactive: {},
        active_deptcode_active: {},
        modal_active_toggle: "",
        modal_deactive_toggle: "",
    };

    toggleDeactiveData = () => {
        this.setState({
            modal_deactive_toggle: "deactive_toggle",
            modal_deactive: true,
        });
    }

    toggleActiveData = () => {
        this.setState({
            modal_active_toggle: "active_toggle",
            modal_active: true,
        });
    }

    render() {
        const { loading } = this.state;
        const currentTodos = this.state.result.data;
        const tanggal = currentTodos && currentTodos[0].ProcessDate;
        const currentMetaData = this.state.result.metadata;
        const statusYN = currentMetaData && currentMetaData.forceZeroStockYN;
        const LogID = currentMetaData && currentMetaData.logId;
        // //console.log("CT YN", currentTodos);
        // //console.log("TYPE", currentMetaData);


        const renderTodos = currentTodos && currentTodos.map((todo, i) => {
            return <tr key={i}>
                <th scope="row" style={{ fontSize: '25px' }}>{todo.Nomor}</th>
                <td style={{ fontSize: '25px' }}>{todo.Procod}</td>
                <td style={{ fontSize: '25px' }}>{todo.Pro_Name}</td>
            </tr>
        });

        if (statusYN === "N") {
            //console.log("N");
            return (
                <Page
                    className="DetailProduk"
                >
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <CardHeader>
                                    <Label style={{ color: 'black', float: 'left', fontWeight: 'bold', fontSize: '20px', marginTop: '1%' }}>Daftar Produk yang diarsipkan tanggal: </Label>
                                    <Label style={{ color: 'red', marginLeft: '1%', fontWeight: 'bold', fontSize: '20px', marginTop: '1%' }}>{new Date(tanggal).toDateString()} </Label>
                                    <Button style={{ float: 'right', marginTop: '1%', marginLeft: '1%' }} color="danger" size="sm" onClick={() => this.toggleDeactiveData()}><MdHighlightOff /></Button>
                                    <Label style={{ color: 'black', float: 'right', fontWeight: 'bold', fontSize: '20px', marginTop: '1%' }}>Nol-kan Stock </Label>

                                    {/* TEST PEMBODOHAN */}
                                    <Switch onChange={this.handleChange} checked={this.state.checked} />
                                    {/* END OF PEMBODOHAN */}

                                    {/* Modal untuk Aktif no Aktif  */}
                                    <Modal
                                        isOpen={this.state.modal_deactive}
                                        toggle={this.toggle('deactive')}>
                                        <ModalHeader toggle={this.toggle('deactive')}>
                                            Konfirmasi Penonaktifan
                                    </ModalHeader>
                                        <ModalBody>
                                            Apakah Anda yakin ingin menonaktifkan data ini?
                                    </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" onClick={this.setActiveYN(LogID, 'Y')} disabled={loading}>
                                                {!loading && <span>Ya</span>}
                                                {loading && (
                                                    <MdAutorenew />
                                                )}
                                                {loading && <span>Sedang diproses</span>}
                                            </Button>{' '}
                                            {!loading && <Button color="secondary" onClick={this.toggle('deactive')}>
                                                Tidak
                                        </Button>}
                                        </ModalFooter>
                                    </Modal>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Table responsive
                                                striped>
                                                <thead>
                                                    <tr>
                                                        <th style={{ fontSize: '25px' }}>No.</th>
                                                        <th style={{ fontSize: '25px' }}>Procode</th>
                                                        <th style={{ fontSize: '25px' }}>Nama Produk</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {renderTodos}
                                                    {!currentTodos && <LoadingSpinner status={2} />}
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Page>
            );

        }
        else {
            //console.log("Y");
            return (
                <Page
                    className="DetailProduk"
                >
                    <Row>
                        <Col>
                            <Card className="mb-3">
                                <CardHeader>
                                    <Label style={{ color: 'black', float: 'left', fontWeight: 'bold', fontSize: '20px', marginTop: '1%' }}>Daftar Produk yang diarsipkan tanggal: </Label>
                                    <Label style={{ color: 'red', marginLeft: '1%', fontWeight: 'bold', fontSize: '20px', marginTop: '1%' }}>{new Date(tanggal).toDateString()} </Label>
                                    <Button style={{ float: 'right', marginTop: '1%', marginLeft: '1%' }} color="success" size="sm" onClick={() => this.toggleActiveData()}><MdCheckCircle /></Button>
                                    <Label style={{ color: 'black', float: 'right', fontWeight: 'bold', fontSize: '20px', marginTop: '1%' }}>Nol-kan Stock </Label>

                                    {/* Modal untuk Aktif no Aktif  */}
                                    <Modal
                                        onExit={() => this.handleClose}
                                        isOpen={this.state.modal_active}
                                        toggle={this.toggle('active')}>
                                        <ModalHeader toggle={this.toggle('active')}>
                                            Konfirmasi Pengaktifan
                                    </ModalHeader>
                                        <ModalBody>
                                            Apakah Anda yakin ingin mengaktifkan data ini?
                                    </ModalBody>
                                        <ModalFooter>
                                            <Button color="primary" onClick={this.setActiveYN(LogID, 'N')} disabled={loading}>
                                                {!loading && <span>Ya</span>}
                                                {loading && (
                                                    <MdAutorenew />
                                                )}
                                                {loading && <span>Sedang diproses</span>}
                                            </Button>{' '}
                                            {!loading && <Button color="secondary" onClick={this.toggle('active')}>
                                                Tidak
                                        </Button>}
                                        </ModalFooter>
                                    </Modal>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col>
                                            <Table responsive
                                                striped>
                                                <thead>
                                                    <tr>
                                                        <th style={{ fontSize: '25px' }}>No.</th>
                                                        <th style={{ fontSize: '25px' }}>Procode</th>
                                                        <th style={{ fontSize: '25px' }}>Nama Produk</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {renderTodos}
                                                    {!currentTodos && <LoadingSpinner status={2} />}
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Page>

            );
        }


    }
}
export default AutoA;