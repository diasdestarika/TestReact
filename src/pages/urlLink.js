/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
if (window.location.hostname.includes('staging-logistic')) {
    console.log('STAGING-logistic');
    //URL LOGIN
    var url_login = 'https://staging-api.cfu.pharmalink.id/auth/login';
    var url_changeForgottenPassword =
        'https://staging-api.cfu.pharmalink.id/auth/forgotpassword';
    var url_verifyOTP = 'https://staging-api.cfu.pharmalink.id/auth/verifyotp';
    var url_changePassword =
        'https://staging-api.cfu.pharmalink.id/auth//changePassword';
    var url_loginChangePassword =
        'https://staging-api.cfu.pharmalink.id/auth//login/changePassword';

    //URL TEAM PAK DEANDLES (GUDANG TN, EXTERNAL EKSPEDISI CHC)
    var base_url_all = 'https://staging-api.cfu.pharmalink.id/retur/';

    //API
    var url_order2 =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllDataMonitoringROGD?';
    var url_product =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllSummaryProduct?';
    var url_product2 =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllDetailProduct?';
    var url_b2b =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllDataMonitoringROGDNotPelapak?';
    var url_allGudang =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllGudang?type=allAuth';
    var url_noSP =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllOrderNoSP?';
    var url_order =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllDataMonitoringROGD?';

    //MONITORING RO
    var url_allDepo =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllGudang?';
    var url_kurangSlongsong =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllSelongsongRonaldo?';
    var url_kelebihanSlongsong =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllSelongsongRonaldo?';

    //ORDER PELAPAK
    var url_printorder =
        'https://staging-api.cfu.pharmalink.id/monitoring-pelapak-eksternal/orderPelapak?print=';
    var url_orderpelapak =
        'https://staging-api.cfu.pharmalink.id/monitoring-pelapak-eksternal/orderPelapak?gudangID=';

    // PILIH TYPE ECOMMERCE
    var url_pilihEcommerce =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllOutlet?';

    // URL CEK RESI
    var url_cekResi =
        'https://staging-api.pharmanet.id/DEVELOPMENT/Shopee/getAirwayBillOutlet.php?OrderID=';

    // URL SP DO
    var devBackend = 'http://10.0.111.27:8080/do/DO'; // Backend utk development
    var cloudBackend = 'https://staging-api.cfu.pharmalink.id/do/DO'; // Backend yang sudah di cloud
    var backend = cloudBackend;
    var url_getProductList = `https://staging-api.cfu.pharmalink.id/bridging-internal/pharmanetcl?type=barcode`;

    var url_spdoWebSocket = `https://staging-api.cfu.pharmalink.id/do/scanBarcodeMessage`;
    var url_spdoTampilOption = `${backend}/TampilOption`;
    var url_spdoTampilHeader = `${backend}/TampilHeader`; // /{paramater_spdo_type (0 = Floor | 1 = Apotik)}
    var url_spdoTampilSP = `${backend}/TampilSP`;
    var url_spdoTampilDetailSP = `${backend}/TampilDetailSP`;
    var url_spdoTampilDetailSPRefresh = `${backend}/TampilDetailSPRefresh`;
    var url_spdoUpdateScanBarcode = `${backend}/UpdateScanBarcode`;
    var url_spdoUpdateScan = `${backend}/UpdateScan`;
    var url_spdoBuatDO = `${backend}/BuatDO`; // /{isLapak (0 | 1)}
    var url_spdoPrintDO = `${backend}/PrintDO`;
    var url_spdoUpdateBatch = `${backend}/UpdateBatch`;
    var url_spdoTambahBatchProcod = `${backend}/TambahBatchProcod`;
    var url_spdoGetBatchList = `https://staging-api.cfu.pharmalink.id/gudang-cabang/stock/detail?type=viewBatch`; // &procod=0100426&outcode=A63

    // URL SPADDHO
    var url_spaddho = 'https://staging-api.cfu.pharmalink.id/spaddho/data';
    var url_getProName =
        'https://staging-api.cfu.pharmalink.id/master-produk/produk?procode=';
    var url_getProNames =
        'https://staging-api.cfu.pharmalink.id/master-produk/produk?findby=procodes';

    var base_url_ekspedisi_eksternal =
        'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/';
    var url_getBatch =
        'https://staging-api.cfu.pharmalink.id/gudang-cabang/stock/detail';

    // DASHBOARD
    var url_getDashboard =
        'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetOutstanding?type=all&gudangID=';
} else if (window.location.hostname.includes('logistic')) {
    console.log('logistic');

    //URL LOGIN
    var url_login = 'https://api.cfu.pharmalink.id/auth/login';
    var url_changeForgottenPassword =
        'https://api.cfu.pharmalink.id/auth/forgotpassword';
    var url_verifyOTP = 'https://api.cfu.pharmalink.id/auth/verifyotp';
    var url_changePassword = 'https://api.cfu.pharmalink.id/auth/changePassword';
    var url_loginChangePassword =
        'https://api.cfu.pharmalink.id/auth/login/changePassword';

    //URL TEAM PAK DEANDLES (GUDANG TN)
    var base_url_all = 'https://api.cfu.pharmalink.id/retur/';

    //API
    var url_order2 =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetAllDataMonitoringROGD?';
    var url_product =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetAllSummaryProduct?';
    var url_product2 =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetAllDetailProduct?';
    var url_b2b =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetAllDataMonitoringROGDNotPelapak?';
    var url_allGudang =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetAllGudang?type=allAuth';
    var url_noSP =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetAllOrderNoSP?';
    var url_order =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetAllDataMonitoringROGD?';

    //MONITORING RO
    var url_allDepo =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetAllGudang?';
    var url_kurangSlongsong =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetAllSelongsongRonaldo?';
    var url_kelebihanSlongsong =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetAllSelongsongRonaldo?';

    //ORDER PELAPAK
    var url_printorder =
        'https://api.cfu.pharmalink.id/monitoring-pelapak-eksternal/orderPelapak?print=';
    var url_orderpelapak =
        'https://api.cfu.pharmalink.id/monitoring-pelapak-eksternal/orderPelapak?gudangID=';

    // PILIH TYPE ECOMMERCE
    var url_pilihEcommerce =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetAllOutlet?';

    // URL CEK RESI
    var url_cekResi =
        'https://api.pharmanet.id/DEVELOPMENT/Shopee/getAirwayBillOutlet.php?OrderID=';

    // URL SP DO
    var devBackend = 'http://10.0.111.27:8080/do/DO'; // Backend utk development
    var cloudBackend = 'https://api.cfu.pharmalink.id/do/DO'; // Backend yang sudah di cloud
    var backend = cloudBackend;
    var url_getProductList = `https://api.cfu.pharmalink.id/bridging-internal/pharmanetcl?type=barcode`;

    var url_spdoWebSocket = `https://api.cfu.pharmalink.id/do/scanBarcodeMessage`;
    var url_spdoTampilOption = `${backend}/TampilOption`;
    var url_spdoTampilHeader = `${backend}/TampilHeader`; // /{paramater_spdo_type (0 = Floor | 1 = Apotik)}
    var url_spdoTampilSP = `${backend}/TampilSP`;
    var url_spdoTampilDetailSP = `${backend}/TampilDetailSP`;
    var url_spdoTampilDetailSPRefresh = `${backend}/TampilDetailSPRefresh`;
    var url_spdoUpdateScanBarcode = `${backend}/UpdateScanBarcode`;
    var url_spdoUpdateScan = `${backend}/UpdateScan`;
    var url_spdoBuatDO = `${backend}/BuatDO`; // /{isLapak (0 | 1)}
    var url_spdoPrintDO = `${backend}/PrintDO`;
    var url_spdoUpdateBatch = `${backend}/UpdateBatch`;
    var url_spdoTambahBatchProcod = `${backend}/TambahBatchProcod`;
    var url_spdoGetBatchList = `https://api.cfu.pharmalink.id/gudang-cabang/stock/detail?type=viewBatch`; // &procod=0100426&outcode=A63

    // URL SPADDHO
    var url_spaddho = 'https://api.cfu.pharmalink.id/spaddho/data';
    var url_getProName =
        'https://api.cfu.pharmalink.id/master-produk/produk?procode=';
    var url_getProNames =
        'https://api.cfu.pharmalink.id/master-produk/produk?findby=procodes';

    var base_url_ekspedisi_eksternal =
        'https://api.cfu.pharmalink.id/eksternal-ekspedisi/';

    var url_getBatch = 'https://api.cfu.pharmalink.id/gudang-cabang/stock/detail';
    // DASHBOARD
    var url_getDashboard =
        'https://api.cfu.pharmalink.id/monitoring-gudang/GetOutstanding?type=all&gudangID=';
} else if (window.location.hostname.includes('localhost')) {
  console.log('LOCALHOST-logistic');
  var url_refund = 'https://staging-api.cfu.pharmalink.id/refund-sales/data'
  //URL LOGIN
  var url_login = 'https://staging-api.cfu.pharmalink.id/auth/login';
  var url_changeForgottenPassword =
    'https://staging-api.cfu.pharmalink.id/auth/forgotpassword';
  var url_verifyOTP = 'https://staging-api.cfu.pharmalink.id/auth/verifyotp';
  var url_changePassword =
    'https://staging-api.cfu.pharmalink.id/auth//changePassword';
  var url_loginChangePassword =
    'https://staging-api.cfu.pharmalink.id/auth//login/changePassword';

  //URL TEAM PAK DEANDLES (GUDANG TN)
  var base_url_all = 'https://staging-api.cfu.pharmalink.id/retur/';

  //API
  var url_order2 =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllDataMonitoringROGD?';
  var url_product =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllSummaryProduct?';
  var url_product2 =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllDetailProduct?';
  var url_b2b =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllDataMonitoringROGDNotPelapak?';
  var url_allGudang =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllGudang?type=allAuth';
  var url_noSP =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllOrderNoSP?';
  var url_order =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllDataMonitoringROGD?';

  //MONITORING RO
  var url_allDepo =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllGudang?';
  var url_kurangSlongsong =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllSelongsongRonaldo?';
  var url_kelebihanSlongsong =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllSelongsongRonaldo?';

  //ORDER PELAPAK
  var url_printorder =
    'https://staging-api.cfu.pharmalink.id/monitoring-pelapak-eksternal/orderPelapak?print=';
  var url_orderpelapak =
    'https://staging-api.cfu.pharmalink.id/monitoring-pelapak-eksternal/orderPelapak?gudangID=';

  // PILIH TYPE ECOMMERCE
  var url_pilihEcommerce =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetAllOutlet?';

  // URL CEK RESI
  var url_cekResi =
    'https://staging-api.pharmanet.id/DEVELOPMENT/Shopee/getAirwayBillOutlet.php?OrderID=';

  // URL SP DO
  var devBackend = 'http://10.0.111.27:8080/do/DO'; // Backend utk development
  var cloudBackend = 'https://staging-api.cfu.pharmalink.id/do/DO'; // Backend yang sudah di cloud
  var backend = cloudBackend;
  var url_getProductList = `https://staging-api.cfu.pharmalink.id/bridging-internal/pharmanetcl?type=barcode`;

  var url_spdoWebSocket = `https://staging-api.cfu.pharmalink.id/do/scanBarcodeMessage`;
  var url_spdoTampilOption = `${backend}/TampilOption`;
  var url_spdoTampilHeader = `${backend}/TampilHeader`; // /{paramater_spdo_type (0 = Floor | 1 = Apotik)}
  var url_spdoTampilSP = `${backend}/TampilSP`;
  var url_spdoTampilDetailSP = `${backend}/TampilDetailSP`;
  var url_spdoTampilDetailSPRefresh = `${backend}/TampilDetailSPRefresh`;
  var url_spdoUpdateScanBarcode = `${backend}/UpdateScanBarcode`;
  var url_spdoUpdateScan = `${backend}/UpdateScan`;
  var url_spdoBuatDO = `${backend}/BuatDO`; // /{isLapak (0 | 1)}
  var url_spdoPrintDO = `${backend}/PrintDO`;
  var url_spdoUpdateBatch = `${backend}/UpdateBatch`;
  var url_spdoTambahBatchProcod = `${backend}/TambahBatchProcod`;
  var url_spdoGetBatchList = `https://staging-api.cfu.pharmalink.id/gudang-cabang/stock/detail?type=viewBatch`; // &procod=0100426&outcode=A63

  // URL SPADDHO
  var url_spaddho = 'https://staging-api.cfu.pharmalink.id/spaddho/data';
  // var url_spaddho = 'http://localhost:4411/spaddho/data';
  // var url_spaddho = 'https://api.cfu.pharmalink.id/spaddho/data';

  var url_getProName =
    'https://staging-api.cfu.pharmalink.id/master-produk/produk?procode=';
  var url_getProNames =
    'https://staging-api.cfu.pharmalink.id/master-produk/produk?findby=procodes';

  var base_url_ekspedisi_eksternal =
    'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/';

  var url_getBatch =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/stock/detail';

  // var url_spaddho = 'https://api.cfu.pharmalink.id/spaddho/data';
  // var url_getProName =
  //   'https://api.cfu.pharmalink.id/master-produk/produk?procode=';
  // var url_getProNames =
  //   'https://api.cfu.pharmalink.id/master-produk/produk?findby=procodes';

  // DASHBOARD
  var url_getDashboard =
    'https://staging-api.cfu.pharmalink.id/monitoring-gudang/GetOutstanding?type=all&gudangID=';
}

export {
  url_refund,
    url_login,
    url_allGudang,
    url_changeForgottenPassword,
    url_verifyOTP,
    url_changePassword,
    url_loginChangePassword,
    url_product,
    url_product2,
    url_b2b,
    url_kelebihanSlongsong,
    url_kurangSlongsong,
    url_allDepo,
    url_order,
    url_printorder,
    url_orderpelapak,
    url_noSP,
    url_pilihEcommerce,
    url_cekResi,
    base_url_all,
    url_getProductList,
    url_spdoWebSocket,
    url_spdoTampilOption,
    url_spdoTampilHeader,
    url_spdoTampilSP,
    url_spdoTampilDetailSP,
    url_spdoTampilDetailSPRefresh,
    url_spdoUpdateScanBarcode,
    url_spdoBuatDO,
    url_spdoPrintDO,
    url_spdoUpdateBatch,
    url_spdoTambahBatchProcod,
    url_spaddho,
    url_getProName,
    url_getProNames,
    url_spdoUpdateScan,
    url_spdoGetBatchList,
    base_url_ekspedisi_eksternal,
    url_getBatch,
    url_getDashboard,

};
