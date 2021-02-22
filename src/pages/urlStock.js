/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
if (window.location.hostname.includes('staging-logistic')) {
  console.log('STAGING');
  // MUTASI STOCK
  var url_gudangcode =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/stock/header';
  var url_batch =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/stock/detail';
  var url_mutasiStockProcod =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/stock/mutasi';
  var url_updateBatch =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/stock?type=revisibatch';
  // MUTASI STOCK
} else if (window.location.hostname.includes('logistic')) {
  console.log('PRODUCTION');
  // MUTASI STOCK
  var url_gudangcode =
    'https://api.cfu.pharmalink.id/gudang-cabang/stock/header';
  var url_batch = 'https://api.cfu.pharmalink.id/gudang-cabang/stock/detail';
  var url_mutasiStockProcod =
    'https://api.cfu.pharmalink.id/gudang-cabang/stock/mutasi';
  var url_updateBatch =
    'https://api.cfu.pharmalink.id/gudang-cabang/stock?type=revisibatch';
  // MUTASI STOCK
} else if (window.location.hostname.includes('localhost')) {
  console.log('LOCALHOST');
  // MUTASI STOCK
  var linkLocal = 'http://10.0.111.169:5555/';
  var linkKafka = 'https://staging-api.cfu.pharmalink.id/';
  var url_gudangcode =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/stock/header';
  var url_batch =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/stock/detail';
  var url_mutasiStockProcod =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/stock/mutasi';
  var url_updateBatch =
    'https://staging-api.cfu.pharmalink.id/gudang-cabang/stock?type=revisibatch';
  // MUTASI STOCK
}
export { url_gudangcode, url_batch, url_mutasiStockProcod, url_updateBatch };
