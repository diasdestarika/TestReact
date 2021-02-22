import { STATE_FORGETPASS, STATE_LOGIN } from 'components/AuthForm';
import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PrivateRoute from 'components/Layout/PrivateRoute';
import PageSpinner from 'components/PageSpinner';
import CheckGudang from 'pages/Order/CheckGudang';
import AuthPage from 'pages/template/AuthPage';
import ResetPasswordForm from 'components/ResetPasswordForm';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import './styles/reduction.scss';
import * as firebase from 'firebase/app';
import EkspedisiIntegra from 'pages/ExternalEkspedisi/L1_EkspedisiIntegra';
// import 'firebase/performance';
// import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDPJxUKdofUnKhDCFOgZnQFjTqMWqqw56g',
  authDomain: 'neo-genesis-ordermonitoring.firebaseapp.com',
  databaseURL: 'https://neo-genesis-ordermonitoring.firebaseio.com',
  projectId: 'neo-genesis-ordermonitoring',
  storageBucket: 'neo-genesis-ordermonitoring.appspot.com',
  messagingSenderId: '937266444089',
  appId: '1:937266444089:web:b54f43bda668efd1199ae8',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const Dashboard = React.lazy(() => import('pages/template/DashboardPage'));
// Montoring
const OrderPageMalam = React.lazy(() =>
  import('pages/Pelapak/L1_OrderPageMalam'),
);
const OrderPageBesokSore = React.lazy(() =>
  import('pages/Pelapak/L3_OrderPageBesokSore'),
);
const OrderPageBesokPagi = React.lazy(() =>
  import('pages/Pelapak/L2_OrderPageBesokPagi'),
);
const OrderPageMalamNAPI = React.lazy(() =>
  import('pages/Pelapak/L6_OrderPageMalamnAPI'),
);
const OrderPageBesokSoreNAPI = React.lazy(() =>
  import('pages/Pelapak/L8_OrderPageBesokSorenAPI'),
);
const OrderPageBelumJadiSP = React.lazy(() =>
  import('pages/Pelapak/L9_OrderPageBelumJadiSP'),
);
const OrderPageBesokPagiNAPI = React.lazy(() =>
  import('pages/Pelapak/L7_OrderPageBesokPaginAPI'),
);
const OrderB2B = React.lazy(() => import('pages/B2B/P2_OrderB2BMalamIni'));
const OrderB2BBesokPagi = React.lazy(() =>
  import('pages/B2B/P3_OrderB2BBesokPagi'),
);
const OrderB2BBesokSore = React.lazy(() =>
  import('pages/B2B/P4_OrderB2BBesokSore'),
);
const OrderB2BTerlambat = React.lazy(() =>
  import('pages/B2B/P1_OrderB2BTerlambat'),
);
const OrderB2BKejarOnTime = React.lazy(() =>
  import('pages/B2B/P5_OrderB2BKejarOnTime'),
);
const OrderPelapak = React.lazy(() => import('pages/Order/OrderPelapak'));
const ResiPageAlready = React.lazy(() =>
  import('pages/Pelapak/L5_OrderPelapakKejarTidakCancel'),
);
const ResiPageNotYet = React.lazy(() =>
  import('pages/Pelapak/L4_OrderPelapakKejarOnTime'),
);
const DetailProduk = React.lazy(() =>
  import('pages/Order/DetailProdukKurangStock'),
);
const SummaryProduct = React.lazy(() =>
  import('pages/Order/SummaryProductKurangStock'),
);
const KelebihanSlongsong = React.lazy(() =>
  import('pages/Order/KelebihanSlongsong'),
);
const KekuranganSlongsong = React.lazy(() =>
  import('pages/Order/KekuranganSlongsong'),
);
const CetakResi = React.lazy(() => import('pages/Order/CetakResi'));

//Program Receiving
const ReceivingPage = React.lazy(() => import('pages/receiving/ReceivingPage'));
const ReceivingPageD = React.lazy(() =>
  import('pages/receiving/ReceivingDPage'),
);
const ReceivingPrint = React.lazy(() =>
  import('pages/receiving/ReceivingPrint'),
);
const ReceivingPageH = React.lazy(() =>
  import('pages/receiving/ReceivingHPage'),
);
const ReceivingPageN = React.lazy(() =>
  import('pages/receiving/ReceivingNPage'),
);
const HeaderStock = React.lazy(() => import('pages/receiving/HeaderStock'));
const DetailStock = React.lazy(() => import('pages/receiving/DetailStock'));
const MutasiStock = React.lazy(() => import('pages/receiving/MutasiStock'));
const MutasiStockDetail = React.lazy(() =>
  import('pages/receiving/MutasiStockDetail'),
);

const MutasiBook = React.lazy(() => import('pages/receiving/MutasiBook'));
const MutasiBookDetail = React.lazy(() =>
  import('pages/receiving/MutasiBookDetail'),
);
// Gudang TN
const ReturToGudang = React.lazy(() =>
  import('pages/Transfer-gudang/ReturToGudang'),
);
const ReturToGudangAddTransfer = React.lazy(() =>
  import('pages/Transfer-gudang/ReturToGudangAddTransfer'),
);
const ReturToGudangProductList = React.lazy(() =>
  import('pages/Transfer-gudang/ReturToGudangProductList'),
);
const ReturToGudangSavedDetails = React.lazy(() =>
  import('pages/Transfer-gudang/ReturToGudangSavedDetails'),
);
const ReturToGudangPrintPreview = React.lazy(() =>
  import('pages/Transfer-gudang/ReturToGudangPrintPreview'),
);

const TransferInMonitoring = React.lazy(() =>
  import('pages/Transfer-gudang/TransferInMonitoring'),
);

const TransferInMonitoringDetail = React.lazy(() =>
  import('pages/Transfer-gudang/TransferInMonitoringDetail'),
);

//Master SP Add HO
const SPAddHO = React.lazy(() => import('pages/spAddHO/SPAddHO'));
const SPAddHODetail = React.lazy(() => import('pages/spAddHO/SPAddHODetail'));
const AddSPHODetail = React.lazy(() => import('pages/spAddHO/AddSPHODetail'));

// Refund
const Refund = React.lazy(() => import('pages/refund/Refund'));

//  SP-DO
const spdoPage = React.lazy(() => import('pages/spdo/SpdoPage'));

//Laporan SP
const laporanSPHome = React.lazy(() => import('pages/LaporanSP/LaporanSPHome'));
const LaporanSPManual = React.lazy(() =>
  import('pages/LaporanSP/LaporanSPManual'),
);
const LaporanSPRonaldo = React.lazy(() =>
  import('pages/LaporanSP/LaporanSPRonaldo'),
);

//Eksternal Ekspedisi
const ExternalEkspedisi = React.lazy(() =>
  import('pages/ExternalEkspedisi/L1_EkspedisiIntegra'),
);

const ReprintResi = React.lazy(()=>
  import('pages/ExternalEkspedisi/L1_ReprintResi'),
)
// const ExternalEkspedisiCHC = React.lazy(() =>
//   import('pages/ExternalEkspedisi/L1_EkspedisiCHC'),
// );

//PENJALURAN
const EkspedisiScanner = React.lazy(() =>
  import('pages/Scan-Ekspedisi/ekspedisiScanner'),
);
const EkspedisiViewer = React.lazy(() =>
  import('pages/Scan-Ekspedisi/ekspedisiViewer'),
);


const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  state = {
    title: '',
    color: '',
    menuID: '',
    reqData: [],
  };

  setTitle = (title, color) => {
    this.setState({ title: title, color: color });
  };

  passData = (type, data) => {
    var tempArr = this.state.reqData;
    if (type === 'SPManual') {
      var newObj = {
        selectedTipeLaporan: data.selectedTipeLaporan,
        selectedJenisLaporan: data.selectedJenisLaporan,
        inputDate: data.inputDate,
        spNotPrintChecked: data.spNotPrintChecked,
        notFound: data.notFound,
        hasilSP: data.hasilSP,
      };
      tempArr.push(newObj);
      this.setState({
        reqData: tempArr,
      });
    }
    if (type === 'SPHarian') {
      var newObj = {
        hasilSP: data.hasilSP,
      };
      tempArr.push(newObj);
      this.setState({
        reqData: tempArr,
      });
    }
    if (type === 'clear') {
      this.setState({
        reqData: [],
      });
    }
  };

  getAccess() {
    var accessList = JSON.parse(window.localStorage.getItem('accessList'));
    if (accessList !== null && accessList !== undefined) {
      // console.log('MENU ID MASUK 1');
      if (Object.keys(accessList).includes('4')) {
        // console.log('MENU ID 4');
        this.setState({ menuID: '4' });
      }
      if (Object.keys(accessList).includes('21')) {
        // console.log('MENU ID 21');
        this.setState({ menuID: '21' });
      }
      if (Object.keys(accessList).includes('18')) {
        // console.log('MENU ID 18');
        this.setState({ menuID: '18' });
      }
      if (Object.keys(accessList).includes('5')) {
        // console.log('MENU ID 5');
        this.setState({ menuID: '5' });
      }
      if (Object.keys(accessList).includes('3')) {
        // console.log('MENU ID 3');
        this.setState({ menuID: '3' });
      } else {
        // console.log('MENU ID MASUK 2');
        return;
      }
    }
    // console.log('MENU ID MASUK 3');
    // return;
  }

  componentDidMount() {
    this.getAccess();
  }

  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_LOGIN} />
              )}
            />
            <LayoutRoute
              exact
              path="/lupapassword"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_FORGETPASS} />
              )}
            />
            <PrivateRoute
              exact
              menuID="1"
              path="/resetpassword"
              layout={EmptyLayout}
              component={props => (
                //<ResetPWd>
                <ResetPasswordForm {...props} />
              )}
            />
            <PrivateRoute
              exact
              menuID={this.state.menuID}
              path="/"
              layout={EmptyLayout}
              component={props => <CheckGudang {...props} />}
            />

            {/* {console.log('ISI MENU ID: ', this.state.menuID)} */}

            <MainLayout
              breakpoint={this.props.breakpoint}
              title={this.state.title}
              color={this.state.color}
            >
              <React.Suspense fallback={<PageSpinner />}>
                {/* RECEIVING */}
                <PrivateRoute
                  exact
                  menuID="18"
                  setTitle={this.setTitle}
                  path="/receivingPrint"
                  layout={EmptyLayout}
                  component={ReceivingPrint}
                />
                <PrivateRoute
                  exact
                  menuID="18"
                  setTitle={this.setTitle}
                  group="2"
                  path="/receivingFloor"
                  component={ReceivingPageH}
                />
                <PrivateRoute
                  exact
                  menuID="18"
                  setTitle={this.setTitle}
                  group="1"
                  path="/receivingApotek"
                  component={ReceivingPageH}
                />
                <PrivateRoute
                  exact
                  menuID="18"
                  setTitle={this.setTitle}
                  path="/receivingDetail"
                  component={ReceivingPageD}
                />
                <PrivateRoute
                  exact
                  menuID="18"
                  setTitle={this.setTitle}
                  path="/receivingNew"
                  component={ReceivingPageN}
                />
                <PrivateRoute
                  exact
                  menuID="19"
                  setTitle={this.setTitle}
                  path="/headerstock"
                  component={HeaderStock}
                />
                <PrivateRoute
                  exact
                  menuID="19"
                  setTitle={this.setTitle}
                  path="/detailstock"
                  component={DetailStock}
                />
                <PrivateRoute
                  exact
                  menuID="19"
                  setTitle={this.setTitle}
                  path="/detailstock/:outcode/:id/:proname"
                  component={DetailStock}
                />
                <PrivateRoute
                  exact
                  menuID="19"
                  setTitle={this.setTitle}
                  path="/mutasiStock/:id/:proname"
                  component={MutasiStock}
                />
                <PrivateRoute
                  exact
                  menuID="19"
                  setTitle={this.setTitle}
                  path="/mutasiStockDetail/:id/:proname/:batch"
                  component={MutasiStockDetail}
                />
                <PrivateRoute
                  exact
                  menuID="19"
                  setTitle={this.setTitle}
                  path="/mutasiBook/:id/:proname"
                  component={MutasiBook}
                />
                <PrivateRoute
                  exact
                  menuID="19"
                  setTitle={this.setTitle}
                  path="/mutasiBookDetail/:id/:proname/:batch"
                  component={MutasiBookDetail}
                />
                {/* GUDANG MONITORING */}
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID={this.state.menuID}
                  path="/Dashboard"
                  component={Dashboard}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderMalamIni"
                  setTitle={this.setTitle}
                  component={OrderPageMalam}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderBesokPagi"
                  setTitle={this.setTitle}
                  component={OrderPageBesokPagi}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderBesokSore"
                  setTitle={this.setTitle}
                  component={OrderPageBesokSore}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderPageBelumJadiSP"
                  setTitle={this.setTitle}
                  component={OrderPageBelumJadiSP}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderMalamIninAPI"
                  setTitle={this.setTitle}
                  component={OrderPageMalamNAPI}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderBesokPaginAPI"
                  setTitle={this.setTitle}
                  component={OrderPageBesokPagiNAPI}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderBesokSorenAPI"
                  setTitle={this.setTitle}
                  component={OrderPageBesokSoreNAPI}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderB2BTerlambat"
                  setTitle={this.setTitle}
                  component={OrderB2BTerlambat}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderB2B"
                  setTitle={this.setTitle}
                  component={OrderB2B}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderB2BBesokPagi"
                  setTitle={this.setTitle}
                  component={OrderB2BBesokPagi}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderB2BBesokSore"
                  setTitle={this.setTitle}
                  component={OrderB2BBesokSore}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderB2BKejarOnTime"
                  setTitle={this.setTitle}
                  component={OrderB2BKejarOnTime}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/OrderPelapak"
                  setTitle={this.setTitle}
                  component={OrderPelapak}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/Pesanan1"
                  setTitle={this.setTitle}
                  component={ResiPageAlready}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/Pesanan2"
                  setTitle={this.setTitle}
                  component={ResiPageNotYet}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/DetailProduct"
                  setTitle={this.setTitle}
                  component={DetailProduk}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/SummaryProduct"
                  setTitle={this.setTitle}
                  component={SummaryProduct}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/KelebihanSlongsong"
                  setTitle={this.setTitle}
                  component={KelebihanSlongsong}
                />
                <PrivateRoute
                  exact
                  menuID="5"
                  path="/KekuranganSlongsong"
                  setTitle={this.setTitle}
                  component={KekuranganSlongsong}
                />
                {/* <PrivateRoute
                  exact
                  menuID="5"
                  path="/CetakResi"
                  setTitle={this.setTitle}
                  component={CetakResi}
                /> */}
                {/* GUDANG TN */}
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID="20"
                  path="/ReturToGudang"
                  component={ReturToGudang}
                />
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID="20"
                  path="/JumlahTnIn"
                  component={TransferInMonitoring}
                />
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID="20"
                  path="/JumlahTnInDetail"
                  component={TransferInMonitoringDetail}
                />
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID="20"
                  path="/ReturToGudangAddTransfer"
                  component={ReturToGudangAddTransfer}
                />
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID="20"
                  path="/ReturToGudangProductList"
                  component={ReturToGudangProductList}
                />
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID="20"
                  path="/ReturToGudangPrintPreview"
                  component={ReturToGudangPrintPreview}
                />
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID="20"
                  path="/ReturToGudangSavedDetails"
                  component={ReturToGudangSavedDetails}
                />
                {/* Master SP Add HO */}
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID="23"
                  path="/spaddho"
                  component={SPAddHO}
                />
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID="23"
                  path="/spaddhodetail"
                  component={SPAddHODetail}
                />
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID="23"
                  path="/addsphodetail"
                  component={AddSPHODetail}
                />

                {/* SP DO */}
                <PrivateRoute
                  setTitle={this.setTitle}
                  exact
                  menuID="22"
                  path="/spdo"
                  component={spdoPage}
                />

                {/* REFUND */}
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID="23"
                  path="/refund"
                  component={Refund}
                />

                {/* Laporan SP */}
                <PrivateRoute
                  setTitle={this.setTitle}
                  exact
                  menuID="23"
                  path="/laporansphome"
                  component={laporanSPHome}
                  passData={this.passData}
                />

                <PrivateRoute
                  setTitle={this.setTitle}
                  exact
                  menuID="23"
                  path="/laporanspmanual"
                  component={LaporanSPManual}
                  passData={this.passData}
                  reqData={this.state.reqData}
                />

                <PrivateRoute
                  setTitle={this.setTitle}
                  exact
                  menuID="23"
                  path="/laporansph-1"
                  component={LaporanSPRonaldo}
                  passData={this.passData}
                  reqData={this.state.reqData}
                />

                {/* Eksternal Ekspedisi */}
                <PrivateRoute
                  setTitle={this.setTitle}
                  exact
                  menuID="5"
                  path="/Ekspedisi-Pelapak-Eksternal"
                  component={ExternalEkspedisi}
                />
                
                <PrivateRoute
                  setTitle={this.setTitle}
                  exact
                  menuID="5"
                  path="/Cetak-Ulang-Resi"
                  component={ReprintResi}
                />
                {/* <PrivateRoute
                  setTitle={this.setTitle}
                  exact
                  menuID="5"
                  path="/Ekspedisi-CHC"
                  component={ExternalEkspedisiCHC}
                /> */}

                {/* Ekspedisi Scanner */}
                <PrivateRoute
                  setTitle={this.setTitle}
                  exact
                  menuID="4"
                  path="/Ekspedisi-Scanner"
                  component={EkspedisiScanner}
                />

                {/* Ekspedisi View */}
                <PrivateRoute
                  setTitle={this.setTitle}
                  exact
                  menuID="4"
                  path="/Ekspedisi-Viewer"
                  component={EkspedisiViewer}
                />

              </React.Suspense>
            </MainLayout>
            <Redirect to="/" />
          </Switch>
        </GAListener>
      </BrowserRouter >
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
