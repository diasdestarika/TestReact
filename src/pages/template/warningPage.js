import Page from 'components/Page';
import Typography from 'components/Typography';
import { Button } from 'reactstrap'
import React from 'react';
import warning from './warning.png'

import {
    Card,
    CardBody,
    Col,
    Row,
} from 'reactstrap';

class warningPage extends React.Component {

render() {
    return (
        <Page title="Akses Ditolak!" style={{ textAlign: "center" }}>
            <Row>
                <Col>
                    <Card>
                        <CardBody>
                            <br>
                            </br>
                            <Typography type="h1">
                                OOPS!
                </Typography>
                            <br></br>
                            <img src={warning} height='200px' width='200px' alt="warning" />
                            <br></br>
                            <br></br>
                            <br></br>
                            <Typography type="h5">
                                Maaf Anda tidak dapat mengakses halaman ini karena anda tidak memiliki Hak Akses!
                </Typography>
                            <br></br>
                            <Button onClick={()=>this.props.history.push('/login')}>Kembali ke Halaman Login</Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Page>
    );
};

}
export default warningPage;
