import React from 'react';
import PropTypes from 'prop-types';
import { Spinner, Progress } from 'reactstrap';

const propTypes = {
  status: PropTypes.number
};

/*--------------------------------------------------------------

  Dipakai sebagai placeholder data didalam tabel jika tidak ada
  data didalam tabel tersebut.

  Digunakan juga untuk menampilkan status pengambilan data.

  Props(input):
   - status: number
      Digunakan untuk memilih status apa yang akan ditampilkan
      spinner.

  Cara kerja:
    nomor digunakan untuk memilih tipe pesan yang ditampilkan
    1: loading
    2: data kosong
    3: tidak ada koneksi

--------------------------------------------------------------*/
class LoadingSpinner extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    const status = this.props.status;
    var loader,nodata,noconnection, loadData;
    loader =
      <tr style={{textAlign: "center"}}>
        <td colSpan= "10">
          <Spinner size="lg" type="grow" color="primary" />
          <br/>
          Loading...
        </td>
      </tr>
    ;

    nodata =
      <tr style={{textAlign: "center"}}>
        <td colSpan= "17">
          <br></br>
          <Spinner size="lg"  color="info" colSpan="17"/>
          <br/>
        </td>
      </tr>
    ;

    loadData =
    <tr style={{textAlign: "center"}}>
      <td colSpan= "17">
        <Spinner size="lg" type="grow" color="primary" />
        <br/>
        Loading...
      </td>
    </tr>

    noconnection =
      <tr style={{textAlign: "center"}}>
        <td colSpan= "17">
          <Spinner size="lg" type="grow" color="danger" />
          <br/>
          No Data
        </td>
      </tr>
    ;
    switch(status){
      case 4:
        return loadData;
      case 3:
        return noconnection;
      case 2:
        return nodata;
      case 1:
        return loader;
      default:
        return null;
    }
  }
}
LoadingSpinner.propTypes = propTypes;

export default LoadingSpinner;