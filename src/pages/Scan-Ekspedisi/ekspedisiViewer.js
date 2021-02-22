import Page from 'components/Page';
import React from 'react';
import {  Table, Label, Input , Form ,FormFeedback, Card, CardHeader,CardBody,CardFooter, 
    ButtonDropdown,DropdownMenu,DropdownToggle,DropdownItem, Button, Row, Col,Badge,Modal
} from 'reactstrap';
import Axios from 'axios';
import moment from 'moment';
import LoadingSpinner from '../LoadingSpinner'
import {base_url_all} from '../urlLinkPenjaluran'


class EkspedisiViewer extends React.Component {
    //special method
    constructor(props) 
    {
        super(props);
        this.state = {
            inputOrderId:'',
            startDate:'',
            endDate:'',

            btnDropdownIsOpen:false,
            btnDropdownIsDisabled:false,
            btnPageLengthIsDisabled:false,
            btnPageLengthIsOpen:false,
            btnShopIsOpen:false,
            typesearch:'TIPE PENCARIAN',

            validOrderId:false,
            invalidOrderIdLength:false,
            invalidStartDate:false,
            invalidEndDate:false,
            btnSearchDisabled:true,
            btnPrintIsHidden:true,
            btnPrintIsDisabled:false,
            modalLodingSpinnerIsOpen:false,
            currentShopSelectionHidden:true,
            btnSearchWait:'Cari',
            btnPrintWait:'Print Data',

            prodBarcode:[],
            noDataMessage:'none',
            shop:'shopee',
            pagination:'Jumlah Data',

            page:1,
            length:5,
            firstPage: 1,
            nextPage: 1,
            maxPage:1,
            defaultpagination:true,
            token:window.localStorage.getItem('tokenCookies'),
            gudangID:window.localStorage.getItem('gID'),
            userNIP:JSON.parse(window.localStorage.getItem('profile')).mem_nip,
            todayDate:moment().format('YYYY-MM-DD'),
            noDataMessage:'none'
        }
    }

    

    componentDidMount() {
        this.getScannedData()
        this.props.setTitle(
            'Data Hasil Scan',
            'red'
        )
    }

    getScannedData = () =>{
        var url_getDataScannedToday = base_url_all+this.state.shop.toLowerCase()+'?date='+this.state.todayDate+'&gudangID='+this.state.gudangID
        // var url_getDataScannedToday = 'http://10.0.111.50:8001/ekspedisi-scanner/shopee?date=2021-01-11&gudangID=A00'
        Axios
        .get(url_getDataScannedToday,{headers:{Authorization:this.state.token}})
        .then((response)=>{
            if(response.data.data){
                this.setState({
                    prodBarcode:response.data.data,
                    noDataMessage:'none'
                })
            }else{
                this.setState({
                    prodBarcode:[],
                    noDataMessage:'block'
                })
            }
        })
        .catch((error)=>{
            alert(error.message)
            window.location.reload()
        })
    }

 

    getScannedDatabyOrderId = () =>{
        this.toggleLoadingSpinner()
        const urlGetDatabyOrderId = (base_url_all+this.state.shop.toLowerCase()+"?orderID="+this.state.inputOrderId+'&gudangID='+this.state.gudangID)
        Axios
        .get(urlGetDatabyOrderId, {
            headers:{
                Authorization:this.state.token
            }
        })
        .then((res)=>{
            if(res.data !== null){
                if(res.data.data){
                    this.setState({
                        prodBarcode:[res.data.data],
                        noDataMessage:'none'
                    },()=>this.toggleLoadingSpinner())
                }else if(res.data.error.status === true){
                    this.setState({
                        prodBarcode:[],
                        noDataMessage:'block'
                    },()=>this.toggleLoadingSpinner())
                }
            }
        })
        .catch((error)=>{
            alert(error.message)
            window.location.reload()
        })
    }

    getScannedDatabyPeriod = () => {
        this.setState({
            btnSearchWait:'Mohon Tunggu',
            btnSearchDisabled:true
        },()=>this.toggleLoadingSpinner())
        const urlGetDatabyPeriod = 
        (base_url_all+'shopee?date='+this.state.startDate+'&gudangID='+this.state.gudangID)
        Axios
        .get(urlGetDatabyPeriod, {
            headers:{
                Authorization:this.state.token
            }
        })
        .then((res)=>{
            if(res.data !== null){
                if(res.data.data !== null){
                    this.setState({
                        prodBarcode:res.data.data,
                        noDataMessage:'none',
                        btnPrintIsHidden:false,
                        btnSearchWait:'Cari',
                        btnSearchDisabled:false
                    },()=>this.toggleLoadingSpinner())
                }else if(res.data.error.status === true || res.data.data === null){
                    this.setState({
                        prodBarcode:[],
                        noDataMessage:'block',
                        btnSearchWait:'Cari',
                        btnSearchDisabled:false
                    },()=>this.toggleLoadingSpinner())
                }
            }
        })
        .catch((error)=>{
            alert(error.message)
            window.location.reload()
        })
    }

    printSearchedItem = () =>{
        this.toggleLoadingSpinner()
        this.setState({
            btnPrintWait:'Mohon Tunggu',
            btnPrintIsDisabled:true
        },()=>{
            const urlGetData = (base_url_all+this.state.shop+'/excel?date='+this.state.startDate+'&gudangID='+this.state.gudangID)
            Axios
            .get(urlGetData,{
                headers:{
                    Authorization:this.state.token
                },
                responseType: 'blob'
            },)
            .then((res)=>{
                const urlblob = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = urlblob;
                link.setAttribute('download', `SCAN_EXPORT_${this.state.shop}_${this.state.gudangID}_${this.state.startDate}.xlsx`);
                document.body.appendChild(link);
                link.click();
                this.setState({
                    btnPrintIsDisabled:false,
                    btnPrintWait:'Print',
                    btnPrintIsHidden:true
                },()=>this.toggleLoadingSpinner())
            })
            .catch((error)=>{
                alert(error.message)
                window.location.reload()
            })
        })
    }

    toggleLoadingSpinner = () =>{
        this.setState({
            modalLodingSpinnerIsOpen:!this.state.modalLodingSpinnerIsOpen
        })
    }

    toggleDropdownButton = () =>{
        this.setState({
            btnDropdownIsOpen:!this.state.btnDropdownIsOpen
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

    handleSearchType = (type) =>{
        this.setState({
            typesearch:type
        })
    }

    handleSearch = () =>{
        if(this.state.typesearch === "OrderID"){
            this.getScannedDatabyOrderId()
        }else if(this.state.typesearch === "Tanggal"){
            this.getScannedDatabyPeriod()
        }
    }

    handleShop = (type) =>{
        this.setState({
            shop:type,
            currentShopSelectionHidden:!this.state.currentShopSelectionHidden,
            btnPrintIsHidden:true,
            inputOrderId:'',
            startDate:'',
            validStartDate:false,
            invalidStartDate:false,
            validOrderId:false,
            invalidOrderIdLength:false,
            btnSearchDisabled:true
        },()=>this.getScannedData())
    }

    handleChange = (type,event) =>{
        var regVal = /[^A-Za-z0-9]/g
        if(type === "inputOrderId"){
            if(event.target.value.length === 0){
                this.setState({
                    invalidOrderIdLength:true,
                    validOrderId:false,
                    btnSearchDisabled:true
                })
            }else{
                this.setState({
                    inputOrderId:event.target.value.trim(),
                    validOrderId:true,
                    invalidOrderIdLength:false,
                    btnSearchDisabled:false
                })
            }
        }else if(type === "startDate"){
            this.setState({
                startDate:event.target.value
            },()=>this.validateDate(type))
        }
    }

    validateDate = (type) => {
        var start = Date.parse(this.state.startDate)
        if(start !== ''){
            this.setState({
                validStartDate:true,
                invalidStartDate:false,
                btnSearchDisabled:false
            })
        }else{
            this.setState({
                validStartDate:false,
                invalidStartDate:true,
                btnSearchDisabled:true
            })
        }
       
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
                pagination:"10",
                length:10,
                defaultpagination:false,
            }
        }else if(type === "med"){
            newState = {
                page: 1,
                pagination:"25",
                length:25,
                defaultpagination:false,
            }
        }else if(type === "max"){
            newState = {
                page: 1,
                pagination:"50",
                length:50,
                defaultpagination:false,
            }
        }else if(type === "default"){
            newState = {
                page: 1,
                pagination:"Jumlah Data",
                length:5,
                defaultpagination:true,
            }
        }

       if(this.state.typesearch === "OrderID"){
        this.setState(newState, () => {
            this.getScannedDatabyOrderId()
        })
       }else if(this.state.typesearch === 'Tanggal'){
        this.setState(newState, () => {
            this.getScannedDatabyPeriod()
        })
       }else if(this.state.typesearch === 'TIPE PENCARIAN'){
        this.setState(newState, () => {
            this.getScannedData()
        })
       }
    }

    limitHandler = (evt) => {
        this.setState({
            length: evt.target.value,
            page: 1,
        })
    }

    render() { 
        let {prodBarcode,btnDropdownIsDisabled,btnDropdownIsOpen,btnShopIsOpen,validOrderId,invalidOrderIdLength,typesearch,shop,validStartDate,invalidStartDate} = this.state
        return (
            <Page
                // title       = "View Data Gudang"
                // breadcrumbs = {[{ name: 'View Data Gudang', active: true }]}
                // className   = "view-gudang"
            >
                <Card >
                    <CardHeader >
                    <ButtonDropdown isOpen={btnShopIsOpen} toggle={()=>this.toggleShopButton()} style={{float:'left', marginBottom:'1%'}}>
                            <DropdownToggle caret>
                                {shop}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem hidden={this.state.currentShopSelectionHidden} onClick={()=>this.handleShop("Shopee")}>Shopee</DropdownItem>
                                <DropdownItem hidden={!this.state.currentShopSelectionHidden} onClick={()=>this.handleShop("Tokopedia")}>Tokopedia</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
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
                    <Row >
                           <Col xs={1}>
                        <ButtonDropdown  isOpen={btnDropdownIsOpen} toggle={()=>this.toggleDropdownButton()} style={{float:'left'}}>
                            <DropdownToggle caret>
                                {typesearch}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem disabled={btnDropdownIsDisabled} onClick={(e)=>this.handleSearchType("OrderID")}>Order ID</DropdownItem>
                                <DropdownItem disabled={btnDropdownIsDisabled} onClick={(e)=>this.handleSearchType("Tanggal")}>Tanggal</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                        </Col>
                       <Col xs={9} className="justify-content-md-center">
                        {typesearch === "OrderID" && <Input
                        valid={validOrderId}
                        invalid={invalidOrderIdLength}
                        style={{
                            width:'100%',
                            marginLeft:'1%',
                            float:'right',
                        }}
                        value={this.state.inputOrderId}
                        onChange={(e)=>this.handleChange("inputOrderId",e)}
                        />}

                        {this.state.invalidOrderIdLength && <FormFeedback>
                            OrderId tidak boleh kosong
                            </FormFeedback>}


                        { typesearch === "Tanggal" && <Input
                        type='date'
                        valid={validStartDate}
                        invalid={invalidStartDate}
                        style={{
                            float:'left',
                        }}
                        value={this.state.startDate}
                        onChange={(e)=>this.handleChange("startDate",e)}
                        />}
                        </Col>

                       <Col  xs={2}>
                        <Button 
                        id = "btnSearch"
                        disabled = {this.state.btnSearchDisabled}
                        style={{
                            width:'50%',
                            float:'right'
                        }}
                        onClick={()=>this.handleSearch()}
                        >
                            {this.state.btnSearchWait}
                        </Button>
                        </Col>
                        </Row>
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
                                <th style={{width:'10%'}}>
                                    <Button
                                    style={{float:'right'}}
                                    hidden={this.state.btnPrintIsHidden}
                                    disabled={this.state.btnPrintIsDisabled}
                                    onClick={()=>this.printSearchedItem()}
                                    >
                                        {this.state.btnPrintWait}
                                    </Button>
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
                        <p style={{display:this.state.noDataMessage ,textAlign:'center'}}>Data Tidak Ditemukan</p>
                    </CardBody>
                    <CardFooter>
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
                </CardFooter>
                </Card>

                <Modal style={{paddingLeft:'10%',paddingRight:'10%'}} size='xs' isOpen={this.state.modalLodingSpinnerIsOpen}>
                    <Row style={{justifyContent:'center',alignItems:'center'}}>
                    <LoadingSpinner status={1}/>
                    </Row>
                </Modal>
            </Page>
        );
    }
}
export default EkspedisiViewer;
