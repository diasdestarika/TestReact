import React from 'react'
import Page from 'components/Page';
import {
    Row,
    Card,
    CardHeader,
    CardBody,
    Table,
    Button,
} from 'reactstrap'
import axios from 'axios';
import { database } from 'firebase';


class TestPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userlist : []
        }
    }

    componentDidMount(){
        this.getUserList()  
    }

    getUserList = () => {
        const url = 'https://randomuser.me/api/?results=10'
    

        fetch(url, {
            method: 'GET'
        })
        .then(response => {
            if (response.ok) {
              return response.json();
            }
        })
        .then(data => 
            {
                this.setState({
                    userlist : data.results
                });
                console.log('data : ', data)
            }    
        );
    }
    render (){
        const {userlist} = this.state
        return(
            <Page
                title = "Page Baru "
                breadcrumbs={[{ name: 'Test update', active: true }]}
                className="Page Baru "
            >
                <Card >
                    <CardHeader><h3>User List</h3></CardHeader>
                    <CardHeader style={{textAlign: 'right'}}>
                        <Button>
                            Ini Button
                        </Button>
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

export default TestPage;