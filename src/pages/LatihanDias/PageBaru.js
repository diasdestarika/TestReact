import React from 'react'
import Page from 'components/Page';
import {
    Col,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    Table,
    Form,
    Label,
    DropdownMenu,
    DropdownItem,
    UncontrolledButtonDropdown
} from 'reactstrap'
import axios from 'axios';



class PageBaru extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userlist : [],
            datapagination : [],
            page:1,
            length: 5,
            maxPage:1,

            btnNextPageDisabled : false,
            btnPrevPageDisabled : true
        }
        
    }

    componentDidMount(){
        this.props.setTitle('')
        this.getUserList()
        
    }

    getUserList = () => {  
        //MAX array 999
        const url = 'https://randomuser.me/api/?results=100'

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

    // firstPage = () => {
    //     this.setState({
    //         page: 1
    //     })

    // }

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
                        <Col><h3>User List</h3></Col>
                        <Col>
                            <UncontrolledButtonDropdown
                                style={{
                                    color: "white",
                                    float: "right",
                                }}
                            >

                                <DropdownMenu>
                                    <DropdownItem>5</DropdownItem>
                                    <DropdownItem>5</DropdownItem>

                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </Col>
                    </CardHeader>
                    
                    <CardBody>
                        <Table responsive>
                            <thead>
                                <tr className="text-capitalize align-middle text-center">
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Umur</th>
                                    <th>Jenis Kelamin</th>
                                    <th>Alamat</th>
                                    <th>No HP</th>
                                </tr>
                            </thead>
                            <tbody>
                            {currentdata && currentdata.map((list) =>
                                <tr key = {list.id}>
                                    <td>{list.name.first} {list.name.last}</td>
                                    <td>{list.email}</td>
                                    <td>{list.dob.age}</td>
                                    <td>{list.gender}</td>
                                    <td>{list.location.street.name}</td>
                                    <td>{list.cell}</td>
                                </tr>
                            )}

                            </tbody>
                        </Table>
                    </CardBody>
                    <CardFooter>
                        <Form style = {{textAlign: "center"}} >
                            <Button onClick = {this.PrevPage.bind(this)} disabled = {this.state.btnPrevPageDisabled} >
                                {"<"}
                            </Button>
                            <Label > {this.state.page} / {this.state.maxPage}</Label>
                            <Button onClick = {this.NextPage.bind(this)} disabled = {this.state.btnNextPageDisabled}>
                                {">"}
                            </Button>
                        </Form>
                        
                    </CardFooter>
                </Card>

            </Page>
        );
    }
}

export default PageBaru;