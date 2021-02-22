/* eslint-disable no-redeclare */
if (window.location.hostname.includes('staging-logistic')) {
  console.log('WINDOW LOCATION: ', window.location.hostname);
  var url_getPO = 'https://staging-api.cfu.pharmalink.id/po/data?type=getPO';

  var url_getDaftarReceiving =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/Receiving/';

  var url_getDetailReceiving =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/Receiving/Detail/';

  var url_detailPO =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/Receiving/';

  var url_getKaryawan =
    'https://staging-api.cfu.pharmalink.id/bridging-horus/horus?type=karyawan';
} else if (window.location.hostname.includes('logistic')) {
  console.log('WINDOW LOCATION: ', window.location.hostname);
  var url_getPO = 'https://api.cfu.pharmalink.id/po/data?type=getPO';

  var url_getDaftarReceiving =
    'https://api.cfu.pharmalink.id/gudang-cabang/Receiving/';

  var url_getDetailReceiving =
    'https://api.cfu.pharmalink.id/gudang-cabang/Receiving/Detail/';

  var url_detailPO = 'https://api.cfu.pharmalink.id/gudang-cabang/Receiving/';

  var url_getKaryawan =
    'https://api.cfu.pharmalink.id/bridging-horus/horus?type=karyawan';
} else if (window.location.hostname.includes('localhost')) {
  console.log('WINDOW LOCATION: ', window.location.hostname);
  var url_getPO = 'https://staging-api.cfu.pharmalink.id/po/data?type=getPO';

  var url_getDaftarReceiving =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/Receiving/';
  // 'http://10.0.111.169:5555/gudang-cabang/Receiving/';

  var url_getDetailReceiving =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/Receiving/Detail/';
  // 'http://10.0.111.169:5555/gudang-cabang/Receiving/Detail/';

  var url_detailPO =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/Receiving/';
  // var url_detailPO = 'http://10.0.111.169:5555/gudang-cabang/Receiving/';

  var url_getKaryawan =
    'https://staging-api.cfu.pharmalink.id/bridging-horus/horus?type=karyawan';
}

var base_url_all = 'https://staging-api.cfu.pharmalink.id/retur/';

export {
  base_url_all,
  url_detailPO,
  url_getDaftarReceiving,
  url_getDetailReceiving,
  url_getKaryawan,
  url_getPO,
};
