import React from 'react'
import Page from 'components/Page';
import {
    Col,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Table,
    Form,
    Label,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Input,
    InputGroup,
    InputGroupAddon
} from 'reactstrap'
import axios from 'axios';
import {
    MdNoteAdd, MdModeEdit
} from 'react-icons/md';



//test git
class PageBaru extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userlist : [],
            datapagination : [],
            page:1,
            length: 5,
            maxPage:1,
            jumlahData:2,

            btnNextPageDisabled : false,
            btnPrevPageDisabled : true,

            modalAddIsOpen : false
        }
        
    }

    componentDidMount(){
        this.props.setTitle('')
        this.getUserList()
        
    }

    getUserList = () => {  
        //MAX array 999
        const url = 'https://randomuser.me/api/?results=' + this.state.jumlahData

        axios
        .get(url)
        .then((res)=>{
            if(res.data.results !== null){
                this.setState({
                    userlist:res.data.results,
                })
                
                console.log(this.state.userlist)
            }
            this.setState({
                maxPage: this.state.userlist.length / this.state.length
            });
        })

    }

    NextPage = () => {
        this.setState({
            page: this.state.page + 1,
            btnPrevPageDisabled:false
        })

        if (this.state.page === this.state.maxPage - 1){
            this.setState({
                btnNextPageDisabled:true,
            })
        }
        
        
    }

    PrevPage = () => {
            this.setState({
                page: this.state.page - 1,
                btnNextPageDisabled: false
            })
        
        if (this.state.page === 2) {
            this.setState({
                btnPrevPageDisabled:true
            })
        }
      

    }

    lengthHandler = (evt) => {
        this.setState({
            length : evt.target.value
        })

    }

    addModal = () => {
        this.setState({
            modalAddIsOpen : !this.state.modalAddIsOpen
        })
    }

    buttonAddModal = (type, event) => {
        if (type === "test"){
            this.setState({
                modalAddIsOpen : !this.state.modalAddIsOpen
            })
        }

        if (type === "cancel"){
            this.setState({
                modalAddIsOpen : !this.state.modalAddIsOpen
            })
        }

    }

    handleInputChange = (event) =>{
        this.setState({
            jumlahData : event.target.value
        })
    }

    render (){
        const {userlist, page, length} = this.state
        const last = page * length;
        const first = last - length;
        var currentdata = userlist.slice(first, last);

        return(
            <Page
                title = "Page Baru Dias"
                breadcrumbs={[{ name: 'Page Baru Dias', active: true }]}
                className="Page Baru Dias"
            >
                <Card >
                    <CardHeader>
                        <Row>
                            <Col><h3>User List</h3></Col>
                        </Row>
                       
                        
                    </CardHeader>
                    
                    <CardBody>
                        <Row>
                            <Col>
                            <InputGroup
                                 style = {{
                                    textAlign : "left",
                                    width : "300px"
                                }}
                            >
                                <InputGroupAddon addonType="prepend" className="text-capitalize">Ambil</InputGroupAddon>
                                <Input placeholder = "Max 999" value = {this.state.jumlahData} onChange = {(e) => this.handleInputChange(e)}></Input>
                                <InputGroupAddon addonType="prepend" className="text-capitalize">Data User</InputGroupAddon>
                            </InputGroup>
                            </Col>
                            <Col>
                                <UncontrolledDropdown  
                                    style = {{
                                        textAlign : "right",
                                        marginRight : "5%"
                                    }}
                                >
                                    <Label style={{ fontWeight: 'bold' }}>
                                        Tampilkan &nbsp;
                                    </Label>
                                    <DropdownToggle caret>{this.state.length}</DropdownToggle>
                                    
                                    <DropdownMenu>
                                        <DropdownItem value="5" onClick={evt => this.lengthHandler(evt)}>5</DropdownItem>
                                        <DropdownItem value="10" onClick={evt => this.lengthHandler(evt)}>10</DropdownItem>
                                        <DropdownItem  value="15" onClick={evt => this.lengthHandler(evt)}>15</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Col>

                        </Row>
                        <Table responsive>
                            <thead>
                                <tr className="text-capitalize align-middle text-center">
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Umur</th>
                                    <th>Jenis Kelamin</th>
                                    <th>Alamat</th>
                                    <th>No HP</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            {currentdata && currentdata.map((list) =>
                                <tr key = {list.id}>
                                    <td>{list.name.first} {list.name.last}</td>
                                    <td>{list.email}</td>
                                    <td className="text-center">{list.dob.age}</td>
                                    <td className="text-center">{list.gender}</td>
                                    <td>{list.location.street.name}</td>
                                    <td>{list.cell}</td>
                                    <td>
                                        <Button onClick={this.addModal}>
                                            <MdModeEdit size = "20"></MdModeEdit>
                                        </Button>
                                    </td>
                                </tr>
                            )}

                            </tbody>
                        </Table>
                    </CardBody>
                    <CardFooter>
                        <Form style = {{textAlign: "center"}} >
                            <Button onClick = {this.PrevPage} disabled = {this.state.btnPrevPageDisabled} >
                                {"<"}
                            </Button>
                            <Label > {this.state.page} / {this.state.maxPage}</Label>
                            <Button onClick = {this.NextPage.bind(this)} disabled = {this.state.btnNextPageDisabled}>
                                {">"}
                            </Button>
                        </Form>

                        <Row style = {{textAlign: "center"}}>
                            <Button onClick = {this.addModal}> <MdNoteAdd size = "20"></MdNoteAdd>Add</Button>
                        </Row>
                        
                    </CardFooter>

                <Modal isOpen = {this.state.modalAddIsOpen}>
                    <ModalHeader>Add New</ModalHeader>
                    <ModalBody>
                        <Label>Test Modal</Label>
                    </ModalBody>
                    <ModalFooter>
                        <Button color = "primary">Test</Button>
                        <Button color = "secondary" onClick = {e => this.buttonAddModal('cancel', e)} >Cancel</Button>
                    </ModalFooter>
                </Modal>
                </Card>

            </Page>
        );
    }
}

export default PageBaru;