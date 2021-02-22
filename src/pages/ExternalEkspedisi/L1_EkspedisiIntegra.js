import React from 'react'
import {Label,Input,Card,CardBody,Table,Button,
    Modal,ModalBody,ModalFooter,Row} from 'reactstrap'
import {MdPrint,MdClose} from 'react-icons/md'
import Page from 'components/Page';
import {url_getData_EkspedisiIntegra,url_getPdf,url_getResi} from '../urlLinkIntegra'
import Axios from 'axios';
import LoadingSpinner from '../LoadingSpinner'

class EkspedisiIntegra extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            result:[],
            gudangId:window.localStorage.getItem('gID'),
            orderId_Eccommerce_toPrint:'',
            previewOrderID:'',
            noResi:'',
            modalPrintResiIsOpen:false,
            isLoading:true,
            modalLoadingSpinnerIsOpen:false,
        }
    }

    componentDidMount(){
        this.getEkspedisiIntegraData()
        this.props.setTitle(
            'Pesanan Untuk Di Proses',
            'red'
        )
    }

    getEkspedisiIntegraData = () =>{
        // var url_getData = 'http://10.0.111.16:8888//eksternal-ekspedisi/getorderekspedition'
        var url_getData = url_getData_EkspedisiIntegra+this.state.gudangId
        Axios
        .get(url_getData)
        .then((response)=>{
            this.setState({
                result:response.data.data,
                isLoading:false
            })
        })
        .catch((error)=>{
            alert(error.message)
            window.location.reload()
        })
    }

    getPdfToPrint = () =>{
        this.toggleLoadingSpinner()
        var url_getpdf_toprint = url_getPdf+`&no_do=${this.state.orderId_Eccommerce_toPrint}&gudang_id=${this.state.gudangId}`
        Axios
        .get(url_getpdf_toprint,{responseType:'blob'})
        .then((response)=>{
            this.toggleLoadingSpinner()
            const urlblob = window.URL.createObjectURL(new Blob([response.data],{type:'application/pdf'}));
            const link = document.createElement('a');
            link.href = urlblob;
            link.setAttribute('download', `PRINT_${this.state.orderId_Eccommerce_toPrint}_${this.state.gudangId}.pdf`);
            document.body.appendChild(link);
            link.click();
            this.openPrintResiModal('close')
        })
        .catch((error)=>{
            if(error.response.status === 500){
                alert(error.response.data.error.msg)
            }else{
                alert('Terjadi Kesalahan Sistem')
            }
            this.toggleLoadingSpinner()
        })
    }

    getNomorResi = (noDo) =>{
        this.toggleLoadingSpinner()
        var url_getResi_toprint = url_getResi+`no_do=${noDo}&gudang_id=${this.state.gudangId}`
        // var url_getResi_toprint = 'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/bookorderjnttrial?invoice_num=INV/20201208/XX/XII/694478112&donum=123126'
        Axios
        .post(url_getResi_toprint)
        .then((response)=>{
            if(response.data.data){
                this.toggleLoadingSpinner()
                this.setState({
                    noResi:response.data.data.awb_no,
                    orderId_Eccommerce_toPrint:response.data.data.orderid,
                },()=>this.openPrintResiModal('open'))
            }
        })
        .catch((error)=>{
            if(error.response){
                if(error.response.status === 500){
                    alert(error.response.data.error.msg)
                }
            }
            else{
                alert('Terjadi Kesalahan Sistem')
            }
            this.toggleLoadingSpinner()
        })
    }

    openPrintResiModal = (type) =>{
      if(type==='open'){
          this.setState({
            modalPrintResiIsOpen:true,
          })
      }else if(type ==='close'){
          this.setState({
              modalPrintResiIsOpen:false,
              orderId_Eccommerce_toPrint:'',
              noResi:''
          },()=>window.location.reload())
      }
    }

    returnSuitableButton = (doStatus) =>{
        if(doStatus !== ''){
            return(
                <Button 
                color='success'
                onClick={()=>this.getNomorResi(doStatus)}
                >
                    Request Pickup
                </Button>
            )
        }else if(doStatus === ''){
            return(
                <Button disabled color='danger'>
                    No Pickup
                </Button>
            )
        }
    }

    toggleLoadingSpinner = () =>{
        this.setState({
            modalLoadingSpinnerIsOpen:!this.state.modalLoadingSpinnerIsOpen
        })
    }

    render(){
        const {result,orderId_Eccommerce_toPrint,noResi,modalPrintResiIsOpen,isLoading} = this.state
        return(
            <Page className='Ekspedisi-Integra'>
                <Card>
                    <CardBody>
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th style={{width:'4%'}}>
                                        No
                                    </th>
                                    <th  style={{width:'12%'}}>
                                        Outlet
                                    </th>
                                    <th  style={{width:'10%'}}>
                                        OrderID
                                    </th>
                                    <th  style={{width:'14%'}}>
                                        Deadline
                                    </th>
                                    <th  style={{width:'12%'}}>
                                        NoSP
                                    </th>
                                    <th  style={{width:'12%'}}>
                                        NoDO
                                    </th>
                                    <th  style={{width:'12%'}}>
                                        S. WKT
                                    </th>
                                    <th  style={{width:'12%'}}>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {result && result.map((item,index)=>
                                <tr>
                                    <td style={{width:'4%'}}>{index+1}</td>
                                    <td style={{width:'12%'}}>{item.Order_NmOutlet}</td>
                                    <td  style={{width:'10%'}}>{item.OrderIDEcommerce}</td>
                                    <td  style={{width:'14%'}}>{item.StrTanggalOrder === '' ? '-' : item.StrTanggalOrder}</td>
                                    <td  style={{width:'12%'}}>{item.Order_NOSP === ''? '-' : item.Order_NOSP}</td>
                                    <td  style={{width:'12%'}}>{item.Order_NODO === '' ? '-' : item.Order_NODO}</td>
                                    <td  style={{width:'12%'}}>{item.SisaWaktu} Jam</td>
                                    <td  style={{width:'12%'}}>
                                        {this.returnSuitableButton(item.Order_NODO)}
                                    </td>
                                </tr>
                                )}
                              
                            </tbody>
                        </Table>
                        {isLoading &&  
                            <Row style={{justifyContent:'center',alignItems:'center'}}>
                            <LoadingSpinner status={5}/>
                            </Row>}
                    </CardBody>
                </Card>
                
                <Modal isOpen={modalPrintResiIsOpen}>
                    <ModalBody>
                        <Label>No DO: </Label>
                        <Input 
                        disabled 
                        value={orderId_Eccommerce_toPrint.slice(3)} 
                        style={{fontWeight:'bold'}}>
                        </Input>
                        <Label>No Resi: </Label>
                        <Input 
                        disabled 
                        value={noResi} 
                        style={{fontWeight:'bold'}}>
                        </Input>
                    </ModalBody>
                    <ModalFooter style={{justifyContent:'center'}}>
                        <Button
                        onClick={()=>this.getPdfToPrint()} 
                        color='success'>
                            <MdPrint/>
                             Print Resi
                        </Button>
                        <Button color='danger'
                        onClick={()=>this.openPrintResiModal('close')}
                        >
                            <MdClose/>
                             Exit
                        </Button>
                    </ModalFooter>
                </Modal>

                <Modal style={{paddingLeft:'10%',paddingRight:'10%'}} size='xs' isOpen={this.state.modalLoadingSpinnerIsOpen}>
                    <Row style={{justifyContent:'center',alignItems:'center'}}>
                    <LoadingSpinner status={1}/>
                    </Row>
                </Modal>
            </Page>
        )
    }

}
export default EkspedisiIntegra;