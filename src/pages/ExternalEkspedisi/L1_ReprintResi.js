import React from 'react'
import {Label,Input,Card,CardHeader,CardBody,Table,Button,
    Modal,ModalBody,ModalFooter,Row,Col} from 'reactstrap'
import {MdPrint,MdClose} from 'react-icons/md'
import Page from 'components/Page';
import {url_getData_EkspedisiIntegra,url_getPdf,url_getResi} from '../urlLinkIntegra'
import Axios from 'axios';
import LoadingSpinner from '../LoadingSpinner'
import InputGroup from 'reactstrap/lib/InputGroup';
import InputGroupAddon from 'reactstrap/lib/InputGroupAddon';
import InputGroupText from 'reactstrap/lib/InputGroupText';
import FormFeedback from 'reactstrap/lib/FormFeedback';


class ReprintResi extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            inputNoDO:'',
            orderId_Eccommerce_toPrint:'',
            validNoDO:false,
            invalidNoDo:false,
            modalLoadingSpinnerIsOpen:false,
            gudangID:window.localStorage.getItem('gID')
        }
    }

    componentDidMount(){
        this.props.setTitle(
            'Print Ulang Resi',
            'red'
        )
    }

    getPdfToPrint = () =>{
        var orderIDToPrint = this.state.gudangID + this.state.inputNoDO
        this.toggleLoadingSpinner()
        var url_getpdf_toprint = url_getPdf+`&no_do=${orderIDToPrint}&gudang_id=${this.state.gudangID}`
        Axios
        .get(url_getpdf_toprint,{responseType:'blob'})
        .then((response)=>{
            this.toggleLoadingSpinner()
            const urlblob = window.URL.createObjectURL(new Blob([response.data],{type:'application/pdf'}));
            const link = document.createElement('a');
            link.href = urlblob;
            link.setAttribute('download', `PRINT_${orderIDToPrint}_${this.state.gudangID}.pdf`);
            document.body.appendChild(link);
            link.click();
        })
        .catch((error)=>{
            if(error.response){
                if(error.response.status === 500){
                    alert(error.response.data.error.msg)
                }else{
                    alert('Terjadi Kesalahan Sistem')
                }
            }
            else{
                alert(error.message)
            }
            this.toggleLoadingSpinner()
        })
    }

    handleChange = (event) =>{
        if(event.target.value.length <= 0 || event.target.value.length !== 9){
            this.setState({
                inputNoDO:event.target.value,
                validNoDO:false,
                invalidNoDo:true
            })
        }else{
            this.setState({
                inputNoDO:event.target.value,
                validNoDO:true,
                invalidNoDo:false
            })
        }
    }

    handleEnterPressed = (e) =>{
        var enterPressed = e.keyCode || e.which;
        if (enterPressed === 13 && this.state.validNoDO === false) {
          e.preventDefault();
        } else if (enterPressed === 13 && this.state.validNoDO === true) {
          e.preventDefault();
          this.getPdfToPrint();
        }
    }

    toggleLoadingSpinner = () =>{
        this.setState({
            modalLoadingSpinnerIsOpen:!this.state.modalLoadingSpinnerIsOpen
        })
    }

    render(){
        const {inputNoDO,validNoDO,invalidNoDo,gudangID,modalLoadingSpinnerIsOpen} = this.state
        return(
            <Page className='Reprint Resi'>
                <Card>
                    <CardHeader>
                        <Row>
                            <Col xs={2} style={{paddingRight:'0px',marginBottom:'0px'}}>
                            <Label style={{fontSize:'1.5em',marginBottom:'0px'}}>Input No DO</Label>
                            </Col>
                            <Col xs={6} style={{paddingLeft:'0px',marginBottom:'0px'}}>
                            <InputGroup>
                                <InputGroupAddon addonType='prepend'>
                                    <InputGroupText>{gudangID}</InputGroupText>
                                </InputGroupAddon>
                                <Input 
                                value={inputNoDO}
                                valid={validNoDO}
                                invalid={invalidNoDo}
                                onChange={(e)=>this.handleChange(e)}
                                onKeyPress={(e)=>this.handleEnterPressed(e)}
                                ></Input>
                                {invalidNoDo === true 
                                && 
                                <FormFeedback>
                                    No DO merupakan numerik sepanjang 9 karakter tanpa 3 angka depan yang merupakan kode gudang
                                    </FormFeedback>
                                    }
                            </InputGroup>
                            </Col>
                            <Col>
                            </Col>
                        </Row>
                    </CardHeader>
                </Card>

                <Modal style={{paddingLeft:'10%',paddingRight:'10%'}} size='xs' isOpen={modalLoadingSpinnerIsOpen}>
                    <Row style={{justifyContent:'center',alignItems:'center'}}>
                    <LoadingSpinner status={1}/>
                    </Row>
                </Modal>
            </Page>
        )
    }

}export default ReprintResi