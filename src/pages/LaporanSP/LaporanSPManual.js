import React from 'react'
import Page from 'components/Page';
import {  Table, Input, Form ,FormFeedback, Card, CardHeader,CardBody,CardFooter,
    ButtonDropdown,DropdownMenu,DropdownToggle,DropdownItem, Button, Row, Col,Label
} from 'reactstrap';
import * as Moment from 'moment'

class SPManual extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          date:'',
          spNotPrint:false,
          notFound:false,
          result:[],
        }
    }

    componentDidMount(){
      if(this.props.reqData[0]!== undefined){
        this.setState({
            date:this.props.reqData[0].inputDate,
            spNotPrint:this.props.reqData[0].spNotPrintChecked,
            notFound:this.props.reqData[0].notFound,
            result:this.props.reqData[0].hasilSP
        })
      }
    }


 j



    render(){
        const {date,spNotPrint,notFound,result} = this.state
        return(
            <Page
            title       = "Laporan SP Manual"
            breadcrumbs = {[{ name: 'Laporan SP Manual', active: true }]}
            className   = "Laporan SP Manual"
            >
                {notFound && <Card outline color="danger" className='text-center'>
                <strong><h3 style={{color:'red',fontWeight: 'bold'}}>WARNING: Belum Ada SP yang Dikerjakan Manual Tanggal {date}</h3></strong>
                <br/>
                <h3 style={{color:'red',fontWeight: 'bold'}}>TIDAK DITEMUKAN</h3>
                </Card>}

                {!notFound && <Card>
                <CardBody>
                <Row>
                <Col>
                <h5 style={{fontWeight: 'bold'}}>Laporan SP Print</h5>
                </Col>
                <Col>
                <h5 style={{float:'right'}}>Tanggal: {date}</h5>
                </Col>
                </Row>
                <Table responsive striped>
                    <thead>
                        <tr>
                        <th style={{width:'70%'}}>Outlet</th>
                        <th>Jml SP Print</th>
                        <th>Jml DO</th>
                        <th>Jml SP Cancel</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </Table>
                </CardBody>
                </Card>}

                {spNotPrint && <Card>
                <CardBody>
                <h5 style={{fontWeight: 'bold'}}>Laporan SP Manual yang Belum Dikerjakan</h5>
                <Table>
                    <thead>
                        <tr>
                            <th style={{width:'70%'}}>
                            Tanggal
                            </th>
                            <th>
                            Outlet
                            </th>
                            <th>
                            Jml SP
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {result && result.map((sp)=>
                        <tr>
                            <td>{Moment(sp.Spch_TglSP).format('YYYY-MM-DD')}</td>
                            <td>{sp.Spch_OutCodeDepo}</td>
                            <td>{result.length}</td>
                        </tr>
                        )}
                    </tbody>
                </Table>
                </CardBody>
                </Card>}

                <Card>
                <CardFooter>
                <Button color='danger' style={{float:'right',marginRight:'1%'}} onClick={()=>this.toHome()}>
                    Close
                </Button>
                <Button color='success' style={{float:'right',marginRight:'1%'}}>
                        Print
                    </Button>
                </CardFooter>
                </Card>
            </Page>
        )
    }
}
export default SPManual