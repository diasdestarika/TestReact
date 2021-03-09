import React from 'react'
import Page from 'components/Page';
import {
    Row,
    Card,
    CardHeader,
    CardBody,
    Table
} from 'reactstrap'
import axios from 'axios';


class PageBaru extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userlist : []
        }
    }

    componentDidMount(){
        this.props.setTitle('')
        this.getUserList()  
    }

    getUserList = () => {
        const url = 'https://randomuser.me/api/?results=10'

        axios
        .get(url)
        .then((res)=>{
            if(res.data.results !== null){
                this.setState({
                    userlist:res.data.results
                })
                console.log(this.state.userlist)
            }
        })
    }
    render (){
        const {userlist} = this.state
        return(
            <Page
                title = "Page Baru Dias"
                breadcrumbs={[{ name: 'Page Baru Dias', active: true }]}
                className="Page Baru Dias"
            >
                <Card >
                    <CardHeader><h3>User List</h3></CardHeader>
                    
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
                            {userlist && userlist.map((list) =>
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
                </Card>

            </Page>
        );
    }
}

export default PageBaru;