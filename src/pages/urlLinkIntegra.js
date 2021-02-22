var url_getData_EkspedisiIntegra = ''
var url_getPdf  = ''
var url_getResi = ''



if (window.location.hostname.includes('staging-logistic')) {

    url_getData_EkspedisiIntegra = 'https://staging-api.cfu.pharmalink.id/bridging-internal/reportingcl?type=getheaderorderretelab2b&gudang_id='
//     url_getPdf = 'https://staging-api.cfu.pharmalink.id/bridging-internal/reportingcl?type=getdetailorderretelab2b'//no_do=&gudang_id=
    url_getPdf = 'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/cetakpdfretelab2b?' //no_do=&gudang_id=
    url_getResi = 'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/bookorderjntb2b?'//no_do=&gudang_id=
    

  }

  else if (window.location.hostname.includes('logistic')) {

    url_getData_EkspedisiIntegra = 'https://api.cfu.pharmalink.id/bridging-internal/reportingcl?type=getheaderorderretelab2b&gudang_id='
  //     url_getPdf = 'https://staging-api.cfu.pharmalink.id/bridging-internal/reportingcl?type=getdetailorderretelab2b'//no_do=&gudang_id=
    url_getPdf = 'https://api.cfu.pharmalink.id/eksternal-ekspedisi/cetakpdfretelab2b?' //no_do=&gudang_id=
    url_getResi = 'https://api.cfu.pharmalink.id/eksternal-ekspedisi/bookorderjntb2b?'//no_do=&gudang_id=
    
  
  }
  
   else if (window.location.hostname.includes('localhost')) {

      url_getData_EkspedisiIntegra = 'https://staging-api.cfu.pharmalink.id/bridging-internal/reportingcl?type=getheaderorderretelab2b&gudang_id='
//       url_getPdf = 'https://staging-api.cfu.pharmalink.id/bridging-internal/reportingcl?type=getdetailorderretelab2b' //no_do=&gudang_id=
      url_getPdf = 'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/cetakpdfretelab2b?' //no_do=&gudang_id=
      url_getResi = 'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/bookorderjntb2b?' //no_do=&gudang_id=
  }
  
  export {
    url_getData_EkspedisiIntegra,
    url_getPdf,
    url_getResi
  };
