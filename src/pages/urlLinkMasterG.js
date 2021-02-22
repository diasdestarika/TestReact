    //-->>  MASTER G  <<--//
    var base_url_all = 'https://staging-api.cfu.pharmalink.id/spaddho/data';
    //URL REASON
    var url_getTotalReasonPage = "https://api.docnet.id/CHCMasterG/getTotalReasonPage";
    var url_getListReason      = "https://api.docnet.id/CHCMasterG/getReasonList";
    var url_addNewReason       = "https://api.docnet.id/CHCMasterG/addNewReason";
    var url_editReason         = "https://api.docnet.id/CHCMasterG/editMReason";

    //URL Expedisi
    var url_getTotalExpedisiPage = "https://api.docnet.id/CHCMasterG/getTotalExpeditionPage";
    var url_getExpedisiList      = "https://api.docnet.id/CHCMasterG/getExpeditionList";
    var url_addNewExpedition     = "https://api.docnet.id/CHCMasterG/addNewExpedition";
    var url_editMExpedition      = "https://api.docnet.id/CHCMasterG/editMExpedition";

     //URL MinimalSP, Minimal SP NIE, Minimal SP SIA SIPA
     var url_getListMinimalSP          = "https://api.docnet.id/CHCMasterG/getMinimalSPList";
     var url_addMinimalSP              = "https://api.docnet.id/CHCMasterG/addMinimalSP";
     var url_editMinimalSP              = "https://api.docnet.id/CHCMasterG/editMinimalSP";

     var url_getListMinimalSPNIE       = "https://api.docnet.id/CHCMasterG/getMinimalSPNIEList";
     var url_addMinimalSPNIE           = "https://api.docnet.id/CHCMasterG/addMinimalSPNIE";
     var url_editMinimalSPNIE           = "https://api.docnet.id/CHCMasterG/editMinimalSPNIE";

     var url_getListMinimalSPSIASIPA   = "https://api.docnet.id/CHCMasterG/getMinimalSPSiaSipaList";
     var url_addMinimalSPSIASIPA       = "https://api.docnet.id/CHCMasterG/addMinimalSPSiaSipa";    
     var url_editMinimalSPSIASIPA       = "https://api.docnet.id/CHCMasterG/editMinimalSPSiaSipa";    

     //URL MOBIL
     var url_getTotalMobilPage          = "https://api.docnet.id/CHCMasterG/getTotalMobilPage";
     var url_getMobilList               = "https://api.docnet.id/CHCMasterG/getMobilList";
     var url_newMasterMobil             = "https://api.docnet.id/CHCMasterG/newMasterMobil";
     var url_updateMasterMobil          = "https://api.docnet.id/CHCMasterG/updateMasterMobil";

      //URL Biaya Expedisi
      var url_getTotalBiayaExpedisiPage    = "https://api.docnet.id/CHCMasterG/getTotalBiayaExpedisiPage";
      var url_getBiayaExpedisiList         = "https://api.docnet.id/CHCMasterG/getBiayaExpedisiList";
      var url_getAllNamaKota               = "https://api.docnet.id/CHCMasterG/getAllNamaKota";
      var url_getAllKodeExpedisi           = "https://api.docnet.id/CHCMasterG/getAllKodeEkspedisi";
      var url_addBiayaExpedisi             = "https://api.docnet.id/CHCMasterG/addBiayaExpedisi";
      var url_editBiayaExpedisi            = "https://api.docnet.id/CHCMasterG/editBiayaExpedisi";

      //URL TITIPAN LK
      var url_getTotalHeaderTitipanLKPage  = "https://api.docnet.id/CHCMasterG/getTotalHeaderTitipanLKPage";
      var url_getHeaderTitipanLK           = "https://api.docnet.id/CHCMasterG/getHeaderTitipanLK";
      var url_getNmKaryawan                = "https://api.docnet.id/CHCMasterG/getNmKaryawan";
      var url_saveNewTitipanLK             = "https://api.docnet.id/CHCMasterG/saveNewTitipanLK";
      var url_getDetailTitipanLK           = "https://api.docnet.id/CHCMasterG/getDetailTitipanLK/";
      var url_printTitipanLK               = "https://api.docnet.id/CHCMasterG/printTitipanLK";

      export {url_getTotalReasonPage,url_getListReason,url_addNewReason,url_editReason,url_getTotalExpedisiPage,
        url_getExpedisiList,url_addNewExpedition,url_editMExpedition,url_getListMinimalSP,url_addMinimalSP,
        url_getListMinimalSPNIE,url_addMinimalSPNIE,url_getListMinimalSPSIASIPA,url_addMinimalSPSIASIPA,
        url_getTotalMobilPage,url_getMobilList,url_newMasterMobil,url_updateMasterMobil,url_getTotalBiayaExpedisiPage,
        url_getBiayaExpedisiList,url_getAllNamaKota,url_getAllKodeExpedisi,url_addBiayaExpedisi,url_editBiayaExpedisi,
        url_getTotalHeaderTitipanLKPage,url_getHeaderTitipanLK,url_getNmKaryawan,url_saveNewTitipanLK,url_getDetailTitipanLK,
        url_printTitipanLK, url_editMinimalSP, url_editMinimalSPNIE, url_editMinimalSPSIASIPA}

    //-->>  MASTER G  <<--//


    //URL UNIT
    var url_getUnitListByPaging="http://10.0.112.175:8081/getUnitList";
    var url_insertMasterUnit="http://10.0.112.175:8081/newUnit";
    var url_setUnitActiveYN ="http://10.0.112.175:8081/updateStatusUnit";

    //URL DEPT
    var url_getDeptListByPaging ="http://10.0.112.175:8081/getDeptList"
    var url_insertMasterDept ="http://10.0.112.175:8081/newDept"
    var url_updateDept ="http://10.0.112.175:8081/updateDept";

    //url dimension
    var url_getDimensiListByPaging = "http://10.0.112.175:8081/getDimensiProdList"
    var url_newDimensiProd = "http://10.0.112.175:8081/newDimensiProd"
    var url_updateDataDimensiProd = "http://10.0.112.175:8081/updateDataDimensiProd"
    
    export {url_getUnitListByPaging,url_insertMasterUnit,url_setUnitActiveYN,
        url_getDeptListByPaging,url_insertMasterDept,url_updateDept,
        url_getDimensiListByPaging,url_newDimensiProd,url_updateDataDimensiProd};


    //MASTER KEMASAN
    var url_tampil_kemasan = "https://api.docnet.id/MasterKemasan/TampilSemuaKemasan";
    // export default url_tampil_kemasan    
    var url_cari_kodekemasan = "https://api.docnet.id/MasterKemasan/CariKodeKemasan";
    // export default url_cari_kodekemasan
    var url_cari_namakemasan = "https://api.docnet.id/MasterKemasan/CariNamaKemasan";
    // export default url_cari_namakemasan
    var url_tambah_kemasan = "https://api.docnet.id/MasterKemasan/TambahKemasan";
    // export default url_tambah_kemasan
    var url_edit_kemasan = "https://api.docnet.id/MasterKemasan/EditKemasan";
    // export default url_edit_kemasan
    var url_hapus_kemasan = "https://api.docnet.id/MasterKemasan/HapusKemasan";
    // export default url_hapus_kemasan 
    var url_tampil_kemasan_limit = 'https://api.docnet.id/MasterKemasan'
    
    //MASTER STRENGTH
    var url_CetakStrength_Count = "https://api.docnet.id/MasterStrength/CetakStrengthCount"
    var url_PencarianStrengthKode_Count = "https://api.docnet.id/MasterStrength/PencarianStrengthKodeCount"
    var url_PencarianStrengthNama_Count = "https://api.docnet.id/MasterStrength/PencarianStrengthNamaCount"
    var url_CetakStrength_Halaman = "https://api.docnet.id/MasterStrength/CetakStrengthHalaman"
    var url_PencarianStrengthKode_Halaman = "https://api.docnet.id/MasterStrength/PencarianStrengthKodeHalaman"
    var url_PencarianStrengthNama_Halaman = "https://api.docnet.id/MasterStrength/PencarianStrengthNamaHalaman"
    var url_TambahStrength = "https://api.docnet.id/MasterStrength/TambahStrength"
    var url_HapusStrength = "https://api.docnet.id/MasterStrength/HapusStrength"
    
    export {
            url_tampil_kemasan, url_tampil_kemasan_limit, url_cari_kodekemasan, url_cari_namakemasan,
            url_tambah_kemasan, url_edit_kemasan, url_hapus_kemasan,
            url_CetakStrength_Count, url_PencarianStrengthKode_Count, 
            url_PencarianStrengthNama_Count, url_CetakStrength_Halaman,
            url_PencarianStrengthKode_Halaman, url_PencarianStrengthNama_Halaman,
            url_TambahStrength, url_HapusStrength};