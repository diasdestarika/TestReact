import Page from 'components/Page';
import React from 'react';
import {  Table, Label, Input , Form ,FormFeedback, Button, Card, CardHeader, CardBody, CardFooter, Row , Col,
    ButtonDropdown,DropdownMenu,DropdownToggle,DropdownItem,Modal,ModalHeader,ModalBody,ModalFooter,Badge
} from 'reactstrap';
import Axios from 'axios';
import moment from 'moment';
import LoadingSpinner from '../LoadingSpinner'
import {base_url_all} from '../urlLinkPenjaluran'

class EkspedisiScanner extends React.Component {
    //special method
    constructor(props) 
    {
        super(props);
        this.state = {
            prodBarcode:[],
            listKurir:[
                {name:'Anteraja'},
                {name:'AnterAja Next Day'},
                {name:'AnterAja Reguler'},
                {name:'Gojek Instant Courier'},
                {name:'Gojek Same Day'},
                {name:'GoSend Same Day'},
                {name:'GrabExpress Instant'},
                {name:'GrabExpress Instant'},
                {name:'ID Express'},
                {name:'J&T Economy'},
                {name:'J&T Express'},
                {name:'J&T Jemari'},
                {name:'J&T Reguler'},
                {name:'JNE OKE'},
                {name:'JNE Reguler'},
                {name:'JNE Reguler (Cashless)'},
                {name:'JNE YES (Cashless)'},
                {name:'Ninja Xpress'},
                {name:'Ninja Xpress Reguler'},
                {name:'Shopee Express Standard'},
                {name:'SiCepat BEST'},
                {name:'SiCepat Halu'},
                {name:'SiCepat REG'},
                {name:'SiCepat Regular Package'}
            ],
            focused:'focused',
            shop:'shopee',
            selectedKurir:'',
            currentShopSelectionHidden:true,
            pagination:'Jumlah Data Ditampilkan',
            page:1,
            length:10,
            maxPage:1,
            validBarcode:false,
            invalidBarcodeNotRegistered:false,
            invalidBarcodeDuplicate:false,
            btnShopIsOpen:false,
            btnPageLengthIsOpen:false,
            modalPrintLogbookKurirIsOpen:false,
            modalLodingSpinnerIsOpen:false,
            btnPrintLogbookKurirIsDisabled:true,
            token:window.localStorage.getItem('tokenCookies'),
            gudangID:window.localStorage.getItem('gID'),
            userNIP:JSON.parse(window.localStorage.getItem('profile')).mem_nip,
            todayDate:moment().format('YYYY-MM-DD')
        };
       this.handleScan = this.handleScan.bind(this)
    }

    

    componentDidMount() {
       this.nameInput.focus()
       this.props.setTitle(
        'Scan Barang Untuk Dikirim',
        'red'
    )
    }

    
    addScannedData = (data) =>{
        this.toggleLoadingSpinner()
        const urlPostData = base_url_all+this.state.shop
        // const urlPostData = 'http://10.0.111.50:8001/ekspedisi-scanner/'+this.state.shop
        var body = {
            'order_number': data,
            'gudang_id':this.state.gudangID,
            'user_id':this.state.userNIP
        }

        var header = {
            headers:
            {
                "Authorization":this.state.token
            }
        }

        Axios
        .post(urlPostData,body,header)
        .then((res)=>{
            if(res.data.data){
                this.setState({
                    invalidBarcodeDuplicate:false,
                    invalidBarcodeNotRegistered:false,
                    validBarcode:true,
                    prodBarcode:[res.data.data]
                },()=>this.toggleLoadingSpinner())
            }
        })
        .catch((error)=>{
            console.log({error})
            if(error.response !== undefined){
                if(error.response.data.error.msg === '1062 - Duplicate entry'){
                    this.toggleLoadingSpinner()
                    this.setState({
                      invalidBarcodeDuplicate:true,
                      invalidBarcodeNotRegistered:false
                  })
                }else if(error.response.data.error.msg === '404 - Data Not Found'){
                    this.toggleLoadingSpinner()
                    this.setState({
                        invalidBarcodeDuplicate:false,
                        invalidBarcodeNotRegistered:true
                    })
                }else if(error.response.data.error.msg === "1021 - Order ID not valid"){
                    this.toggleLoadingSpinner()
                    alert('Order ID Tidak Valid, Cek Kembali Toko Terpilih !')
                }
            }
            else{
                alert(error.message + ', Terjadi Kesalahan Sistem')
                this.toggleLoadingSpinner()
                window.location.reload()
            }
        })

    }

    printTodayScannedItem = () =>{
        this.toggleLoadingSpinner()
        const urlPrintExcelToday = base_url_all+this.state.shop.toLowerCase()+'/excel?date='+this.state.todayDate+'&gudangID='+this.state.gudangID
        // const urlPrintExcelToday = encodeURI('http://10.0.111.50:8001/ekspedisi-scanner/'+this.state.shop.toLowerCase()+'/excel?date='+this.state.todayDate+'&gudangID='+this.state.gudangID)
        Axios
        .get(urlPrintExcelToday,{
            headers:{
                Authorization:this.state.token
            },
            responseType: 'blob'
        })
        .then((res)=>{
            this.toggleLoadingSpinner()
            const urlblob = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = urlblob;
            link.setAttribute('download', `SCAN_${this.state.shop}_${this.state.gudangID}_${this.state.todayDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
        })
        .catch((error)=>{
            alert(error.message)
            this.toggleLoadingSpinner()
            window.location.reload()
        })
    }

    printLogbookByKurir = () =>{
        this.toggleLoadingSpinner()
        const urlPrintLogbook = base_url_all +this.state.shop.toLowerCase()+'/excel?gudangID='+this.state.gudangID+'&ekspedisi='+encodeURIComponent(this.state.selectedKurir)
        // const urlPrintLogbook = 'http://10.0.111.50:8001/ekspedisi-scanner/'+this.state.shop.toLowerCase()+'/excel?gudangID='+this.state.gudangID+'&ekspedisi='+encodeURIComponent(this.state.selectedKurir)
        Axios
        .get(urlPrintLogbook,{
            headers:{
                Authorization:this.state.token,
                'content-type': 'application/x-www-form-urlencoded'
            },
            responseType: 'blob',
        })
        .then((res)=>{
            this.toggleLoadingSpinner()
            const urlblob = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = urlblob;
            link.setAttribute('download', `LOGBOOK_${this.state.shop}_${this.state.gudangID}_${this.state.selectedKurir}_${this.state.todayDate}.xlsx`);
            document.body.appendChild(link);
            link.click();
        })
        .catch((error)=>{
            alert(error.message)
            this.toggleLoadingSpinner()
            window.location.reload()
        })
        this.toggleModalPrintLogbook()
    }

    handleScan = (event) =>{
        var inputBarcode = document.getElementById("inputBarcode")
        var code = event.keyCode || event.which
        if(code === 13){
            event.preventDefault()
            var barcode = event.target.value.trim()
            this.addScannedData(barcode)
            inputBarcode.reset();
        }
    }

    handleShop = (type) =>{
        this.setState({
            shop:type.toLowerCase(),
            currentShopSelectionHidden:!this.state.currentShopSelectionHidden
        })
    }

    handleSelectKurir = (event) =>{
        if(event.target.value === '==PILIH KURIR=='){
            this.setState({
                selectedKurir:'',
                btnPrintLogbookKurirIsDisabled:true,
            })
        }else{
            this.setState({
                selectedKurir:event.target.value,
                btnPrintLogbookKurirIsDisabled:false,
            })
        }
    }

    toggleModalPrintLogbook = () =>{
        this.setState({
            modalPrintLogbookKurirIsOpen:!this.state.modalPrintLogbookKurirIsOpen,
            btnPrintLogbookKurirIsDisabled:true
        })
    }

    toggleLoadingSpinner = () =>{
        this.setState({
            modalLodingSpinnerIsOpen:!this.state.modalLodingSpinnerIsOpen
        })
    }

    toggleShopButton = () =>{
        this.setState({
            btnShopIsOpen:!this.state.btnShopIsOpen
        })
    }

    togglePageButton = () => {
        this.setState({
            btnPageLengthIsOpen:!this.state.btnPageLengthIsOpen
        })
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
        if (this.state.page !== 1){
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

    paginationHandler = (type) => {
        let newState = {}
        if(type === "min"){
            newState = {
                page: 1,
                pagination:"10 Data Ditampilkan",
                length:10,
                defaultpagination:false,
            }
        }else if(type === "med"){
            newState = {
                page: 1,
                pagination:"25 Data Ditampilkan",
                length:25,
                defaultpagination:false,
            }
        }else if(type === "max"){
            newState = {
                page: 1,
                pagination:"50 Data Ditampilkan",
                length:50,
                defaultpagination:false,
            }
        }else if(type === "default"){
            newState = {
                page: 1,
                pagination:"Jumlah Data Ditampilkan",
                length:5,
                defaultpagination:true,
            }
        }

        this.setState(newState, () => {
            this.getScannedData()
        })
    }

   

    render() { 
        const {prodBarcode,listKurir,btnShopIsOpen,shop} = this.state
        return (
            <Page
                // title       = "Scan Barang Gudang"
                // breadcrumbs = {[{ name: 'Scan Barang Gudang', active: true }]}
                // className   = "scan"
            >
                <Card>
                <CardHeader >
                    <Row>
                        <Col xs={2} style={{paddingRight:'0px',marginBottom:'0%'}}>
                        <Label style={{fontWeight:'bold',fontSize:'1.8em'}}>Toko Terpilih : </Label>
                        </Col>
                        <Col style={{paddingLeft:'0px',marginBottom:'0%'}}>
                        <ButtonDropdown isOpen={btnShopIsOpen} toggle={()=>this.toggleShopButton()} style={{float:'left', marginBottom:'1%'}}>
                            <DropdownToggle caret>
                                {shop}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem hidden={this.state.currentShopSelectionHidden} onClick={(e)=>this.handleShop("Shopee")}>Shopee</DropdownItem>
                                <DropdownItem hidden={!this.state.currentShopSelectionHidden} onClick={(e)=>this.handleShop("Tokopedia")}>Tokopedia</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                        </Col>
                    </Row>

                    
                        {/* <ButtonDropdown isOpen={btnPageLengthIsOpen} toggle={()=>this.togglePageButton()} style={{float:'right', marginBottom:'1%'}}>
                            <DropdownToggle caret>
                                {pagination}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem   onClick={(e)=>this.paginationHandler("min")}>10</DropdownItem>
                                <DropdownItem   onClick={(e)=>this.paginationHandler("med")}>25</DropdownItem>
                                <DropdownItem   onClick={(e)=>this.paginationHandler("max")}>50</DropdownItem>
                                <DropdownItem   hidden={this.state.defaultpagination} onClick={(e)=>this.paginationHandler("default")}>default</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown> */}
                    </CardHeader>
                <CardBody>
                <div className={this.state.focused ? "focused":""}
                style={{marginTop:'1%'}}
                >
                <Form
                id="inputBarcode"
                style={{
                    width:'100%'
                }}
                >
                    <Row>
                        <Col xs={2}>
                        <Label
                        style={{
                            fontSize:'20px',
                            width: '100%',
                            marginRight:'1%',
                            float:'left'
                        }}
                        >Scan Barcode : 
                        </Label>
                        </Col>
                        <Col xs={7}>
                        <Input
                        ref={(input)=>{this.nameInput = input;}}
                        onKeyPress={(e)=>this.handleScan(e)}
                        valid={this.state.validBarcode}
                        invalid={this.state.invalidBarcodeNotRegistered || this.state.invalidBarcodeDuplicate}
                        autoFocus = {true}
                        style={{
                            width:'100%',
                            marginLeft:'1%',
                            marginBottom:'1%',
                        }}
                        />
                        {
                            this.state.invalidBarcodeNotRegistered === true && <FormFeedback>
                                Nomor Order Tidak Ditemukan
                            </FormFeedback>
                        }

                        {
                            this.state.invalidBarcodeDuplicate === true && <FormFeedback>
                                Nomor Order Merupakan Duplikat
                            </FormFeedback>
                        }
                        </Col>
                        <Col xs={3}>

                        <Button
                        style={{float:'right'}}
                        onClick={()=>this.toggleModalPrintLogbook()}
                        >
                            Print Logbook
                        </Button>

                        <Button
                        onClick={()=>this.printTodayScannedItem()}
                        style={{marginRight:'1%',float:'right'}}
                        >
                            Print Hari Ini
                        </Button>
                       
                        </Col>
                    </Row>
                
                </Form>
                </div>
                <br />
                <div>
                    <Table>
                        <thead>
                            <th>
                                No Barcode
                            </th>
                            <th>
                                Tanggal Scan
                            </th>
                            <th>
                                Kurir
                            </th>
                            <th>
                                Status
                            </th>
                        </thead>
                        <tbody>
                            {prodBarcode && prodBarcode.map((prod)=>
                            <tr>
                                <th>
                                    {prod.order_number}
                                </th>
                                <td>
                                    {prod.time_scanned}
                                </td>
                                <td>
                                    {prod.ekspedisi}
                                </td>
                                <td>
                                    {!prod.printyn && <h5><Badge color='success'>Not Printed</Badge></h5>}
                                    {prod.printyn && <h5><Badge color='danger'>Printed</Badge></h5>}
                                </td>
                            </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
                </CardBody>
                {/* <CardFooter>
                <div>
                <Form
                    inline
                    className="cr-search-form"
                    onSubmit={e => e.preventDefault()}
                    style={{
                      textAlign: "center",
                      justifyContent: "center",
                      display: this.state.pagination,
                    }}>

                    <Button
                    color={"dark"}
                    onClick={this.firstPage.bind(this)}
                    >
                      { "<<" }
                    </Button>

                    <Button
                    color={"dark"}
                    onClick={this.previousPage.bind(this)}
                    >
                      { "<" }
                    </Button>

                    <Button
                    disabled
                    color={"dark"}
                    >
                      {this.state.page}
                    </Button>

                    <Button
                    color={"dark"}
                    onClick={this.nextPage.bind(this)}
                    >
                      { ">" }
                    </Button>

                    <Button
                    color={"dark"}
                    onClick={this.lastPage.bind(this)}
                    >
                      { ">>" }
                    </Button>
                  </Form>
                </div>
                </CardFooter> */}
                </Card>

                <Modal isOpen={this.state.modalPrintLogbookKurirIsOpen}>
                    <ModalHeader toggle={()=>this.toggleModalPrintLogbook()}>Print Logbook Kurir</ModalHeader>
                    <ModalBody>
                        <Label>
                            Pilih Kurir
                        </Label>
                        <Input
                        type='select'
                        onChange={(e)=>this.handleSelectKurir(e)}
                        style={{marginBottom:'2%'}}
                        >
                            <option>==PILIH KURIR==</option>
                            {listKurir && listKurir.map((kurir)=>
                            <option>{kurir.name}</option>
                            )}
                        </Input>
                    </ModalBody>
                    <ModalFooter style={{justifyContent:'center'}}>
                        <Button 
                        color='success' 
                        disabled={this.state.btnPrintLogbookKurirIsDisabled}
                        onClick={()=>this.printLogbookByKurir()}
                        >
                            Print
                        </Button>
                        <Button color='danger' onClick={()=>this.toggleModalPrintLogbook()}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal style={{paddingLeft:'10%',paddingRight:'10%'}} size='xs' isOpen={this.state.modalLodingSpinnerIsOpen}>
                    <Row style={{justifyContent:'center',alignItems:'center'}}>
                    <LoadingSpinner status={1}/>
                    </Row>
                </Modal>
            </Page>
        );
    }
}
export default EkspedisiScanner;
