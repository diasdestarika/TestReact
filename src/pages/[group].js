import {
  Box,
  Grid,
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableHead,
  Typography,
  TableBody,
  IconButton,
  Button,
  Paper,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormGroup,
  FormControlLabel,
  TextField,
  Checkbox,
  Autocomplete,
  Alert,
  FormHelperText,
  styled,
  
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import SyncIcon from '@mui/icons-material/Sync';


import { debounce, isEmpty } from "lodash";
import api from "../../../services/po";
import useToast from "../../../utils/toast";
import { getStorage } from "../../../utils/storage";
import { formatDate, formatNumber } from "../../../utils/text";

const PurchaseOrderAdd = () => {
  const router = useRouter();
  const [displayToast] = useToast();
  const debounceMountListProcode = useCallback(
    debounce(mountProductsSupplier, 400),
    []
  );

  const debounceMountMasterProduk = useCallback(
    debounce(mountMasterProduct, 400),
    []
  );

  const debounceMountProductBonus = useCallback(
    debounce(mountProductBonus, 400),
    []
  );

  const debounceMountCreatePO = useCallback(
    debounce(mountCreatePO, 400),
    []
  );

  const debounceMountAllTipePO = useCallback(
    debounce(mountAllTipePO, 400),
    []
  );

  const debounceMountListSupplier = useCallback(
    debounce(mountListSupplier, 400),
    []
  );

  const debounceMountAllOutlets = useCallback(
    debounce(mountAllOutlets, 400),
    []
  );

  // const pt_id = window.sessionStorage.getItem("ptID");
  // const gudangID = window.sessionStorage.getItem("gudangID");
  const pt = JSON.parse(getStorage("pt"))
  const pt_id = pt.pt_id;

  // const gudangID = 'B14';
  const userID = getStorage("userNIP")
  
  const language = 'EN';
  const [poDetails, setPODetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  var [listProcode, setListProcode] = useState([]);
  var [listGudang, setListGudang] = useState([]);
  const [inputProcode, setInputProcode] = useState({})
  const [inputGudang, setInputGudang] = useState({})

  var [groupPO, setGroupPO] = useState(router.query.group);
  var [totalNetto, setTotalNetto] = useState(0)
  var [bonus, setBonus] = useState(false);
  var [inputQtyProcode, setInputQtyProcode] = useState(0);

  const [modalProcode, setModalProcode] = useState(false)
  const [modalConfirm, setModalConfirm] = useState(false)
  var [modalType, setModalType] = useState("ADD");

  var [masterProduct, setMasterProduct] = useState({})
  var [alertBonus, setAlertBonus] = useState(false)
  var [insentif, setInsentif] = useState(0)
  var [salesAwal, setSalesAwal] = useState(0)
  var [procodBonus, setProcodBonus] = useState('')
  var [tipePO, setTipePO] = useState({})
  var [listSupplier, setListSupplier] = useState([])
  var [selectedSupplier, setSelectedSupplier] = useState({})


  useEffect(() => {
    if (!router.isReady) return;
    setGroupPO((groupPO = parseInt(router.query.group)))
    debounceMountAllTipePO();
    debounceMountListSupplier(parseInt(router.query.group));
    debounceMountAllOutlets(pt_id,2);
    // displayToast('error', 'test toast')  
    
  }, [router.isReady]);

  useEffect(() => {
    if (poDetails.length !== 0) {
      var total = poDetails.reduce(
        (prev, curr) =>
          prev +
          (curr.pod_bonusyn === "Y" ? 0 : curr.pod_nettobeli * curr.pod_qty),
        0
      );

      setTotalNetto(total);
    } else if (poDetails.length === 0) {
      setTotalNetto(0);
    }
  }, [poDetails]);

  useEffect(() => {
    console.log('SELECTED PROCODE', isEmpty(inputProcode))
    if(!isEmpty(inputProcode)){
      var procod = ''

      if(inputProcode.pro_code) {
        procod = inputProcode.pro_code
      } else {
        procod = inputProcode.pod_procod
      }
      
      debounceMountMasterProduk(procod, 14); //JANGAN LUPA PT JANGAN DITEMBAK
      debounceMountProductBonus(procod, selectedSupplier.sup_code);

    } else {
      setMasterProduct({})
      setAlertBonus(false)
      setProcodBonus('')
      setInsentif(0)
      setSalesAwal(0)

    }
  }, [inputProcode])

  useEffect(() => {
    console.log('EFFECT BONUS', bonus)
  }, [bonus])

  useEffect(() => {
    console.log('effect modal procode', listProcode.length === 0, modalProcode)
    if (listProcode.length === 0 && modalProcode && modalType === 'ADD'){
      debounceMountListProcode(selectedSupplier.sup_code, groupPO)
    }
  }, [modalProcode])

  useEffect(() => {
    setListProcode([])
    if (!isEmpty(selectedSupplier)){
      debounceMountListProcode(selectedSupplier.sup_code, groupPO)
    }
  }, [selectedSupplier])

  async function mountProductsSupplier(supcode, groupPO) {
    try {
      console.log('hit ke be list supplier', supcode, groupPO)
      setIsLoading((isLoading = true));
      const getProduct = await api.getListProductsBySupcode(supcode);
      const { data, error } = getProduct.data;
      console.log('TEST DATA product]', getProduct)
      if (error.status === false) {

        var tempProd = []
        console.log('GROUP PO', groupPO)
        if (groupPO === 1){
          tempProd = data.details.filter(
            (item) => item.pro_code.startsWith('01') || item.pro_code.startsWith('16') || item.pro_code.startsWith('18')
          );
        } else {
          tempProd = data.details.filter(
            (item) => !item.pro_code.startsWith('01') && !item.pro_code.startsWith('16') && !item.pro_code.startsWith('18')
          );
        }
        setListProcode((listProcode = tempProd));
      } else {
        displayToast('error', error.msg);
      }
      setIsLoading(false);
    } catch (error) {
      console.log('supplier prod', error);
      setIsLoading(false);
      displayToast('error', language === 'EN' ? 'Failed Connect to Server.' : 'Koneksi ke server gagal.')
    }
  }

  async function mountMasterProduct(procode, pt) {
    try {
      console.log('hit ke be', procode)
      setIsLoading((isLoading = true))
      const getProduct = await api.getMasterProductById(procode, pt);
      const { data, error } = getProduct.data;
      console.log('TEST DATA masterproduct', getProduct)
      if (error.status === true){
        displayToast('error', error.msg)
      } else {
        if (data !== undefined){
          setMasterProduct((masterProduct = data));
        } else {
          setMasterProduct((masterProduct = {}));
          displayToast("error", language === 'EN' ? 'Product terms not found.' : 'Syarat Produk tidak ditemukan');
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.log('master product', error);
      setIsLoading(false)
      displayToast('error', language === 'EN' ? 'Failed Connect to Server.' : 'Koneksi ke server gagal.')
    }
  }

  async function mountProductBonus(procode, supcode) {
    try {
      console.log('hit ke be', procode)
      setIsLoading(true)
      const getProduct = await api.getProductBonusbyID(procode, supcode);
      const { data, error } = getProduct.data;
      console.log('TEST DATA product bonus', getProduct)

      if (error.status === true){
        displayToast('error', error.msg)
      } else {
        if (data!== null) {
          
          setInsentif((insentif = data[0].Insentif))
          setSalesAwal((salesAwal = data[0].Sales_Awal))
          setProcodBonus((procodBonus = data[0].Product_ID))
          setAlertBonus((alertBonus = true))
  
        } else {
          setAlertBonus((alertBonus = false))
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.log('product bonus', error);
      setIsLoading(false)
      displayToast('error', language === 'EN' ? 'Failed Connect to Server.' : 'Koneksi ke server gagal.')
    }
  }

  async function mountCreatePO(payload) {
    try {
      console.log('hit ke be create', payload)
      setIsLoading(true)
      const createPO = await api.createPO(payload);
      const { data, error } = createPO.data;
      console.log('resp create PO ', createPO)
      if(error.status) {
        setIsLoading(false)
        displayToast('error', error.msg);
      }else {
        if(data.status === 'OK'){
          setIsLoading(false)
          setModalConfirm(false)
          displayToast('success', language === 'EN' ? data.message.Eng : data.message.Id)
          router.push(`/po/view/${createPO.data.metadata.poh_group}/${createPO.data.metadata.poh_nopo}`)
        } else {
          setIsLoading(false)
          displayToast('error', language === 'EN' ? data.message.Eng : data.message.Id)
        }
      }
    } catch (error) {
      console.log('create po', error);
      setIsLoading(false)
      displayToast('error', language === 'EN' ? 'Failed Connect to Server.' : 'Koneksi ke server gagal.')
    }
  }

  async function mountAllTipePO() {
    try {
      setIsLoading(true)
      const tipePO = await api.getAllTipePO();
      const { data, error } = tipePO.data;
      console.log('TEST DATA tipe po', tipePO)

      if (error.status === true){
        displayToast('error', error.msg)
      } else {
        if (data){
          var temp = data.find(function(item){
              return item.id === 1
            });
  
          if (temp){
            setTipePO((tipePO = temp));
          }else {
            displayToast('error', language === 'EN' ? 'PO Type not found' : 'Tipe PO tidak ditemukan')
          }
        } else {
          displayToast('error', language === 'EN' ? 'PO Type not found' : 'Tipe PO tidak ditemukan')
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.log('master tipe po', error);
      setIsLoading(false)
      displayToast('error', language === 'EN' ? 'Failed Connect to Server.' : 'Koneksi ke server gagal.')
    }
  }

  async function mountListSupplier(group) {
    try {
      setIsLoading((isLoading = true))
      const listSupplier = await api.getListSupplier(group);
      const { data, error } = listSupplier.data;
      console.log('TEST DATA list supplier', listSupplier)

      if (error.status === true){
        displayToast('error', error.msg)
      } else {
        setListSupplier(data)
      }
      setIsLoading(false)
    } catch (error) {
      console.log('master list supplier', error);
      setIsLoading(false)
      displayToast('error', language === 'EN' ? 'Failed Connect to Server.' : 'Koneksi ke server gagal.')
    }
  }

  async function mountAllOutlets(pt_id, type) {
    try {
      setIsLoading((isLoading = true))
      // const outlets = await api.getAllOutletsbyPT(pt_id, 2);//JANGAN LUPA UNCOMMENT
      const outlets = await api.getAllOutletsbyPT(pt_id, type);
      const { data, error } = outlets.data;
      console.log('TEST DATA outlets', data)

      if (error.status === true){
        displayToast('error', error.msg)
      } else {
        setListGudang(data)
      }
      setIsLoading(false)
    } catch (error) {
      console.log(error);
      setIsLoading(false)
      displayToast('error', language === 'EN' ? 'Failed Connect to Server.' : 'Koneksi ke server gagal.')
    }
  }


  function savePO() {
    // setIsLoading(true);
    // var url = `${url_getListPO}/${param.poh_nopo}/edit?ptid=${pt_id}`;
    // console.log('url save edit ', url)

    var obj = {
      pt_id: parseInt(pt_id), // dr pt yang dipilih user
      poh_tglpo: new Date(),
      poh_group: groupPO,
      poh_tipepo: tipePO.id,
      poh_nosup: selectedSupplier.sup_code,
      poh_top: 0, //JANGAN LUPA DISET
      poh_minvalue: 0, //JANGAN LUPA DISET
      poh_uangmukayn: "N", // dr supplier //JANGAN LUPA DISET
      poh_kota: parseInt(selectedSupplier.sup_citycode), // dr supplier
      poh_matauang: 0, //JANGAN LUPA DISET
      poh_sendtowarehouse: inputGudang.outcode,
      poh_print: 'N',
      poh_updateid: userID,
      poh_updatetime: new Date(),

      poh_tipeponama:tipePO.nama,
      //DATA DI SET DI BE
      poh_supname:selectedSupplier.sup_name,
      // poh_supbossname:"",
      // poh_supaddress:"",
      // poh_supphone:"",
      // poh_suppostal:"",
      // poh_supemail:"",
      // poh_outname: gudangName,
      // poh_outaddress:"",
      // poh_outphone:"",
      // poh_outpostal:"",
      // poh_outorderby:"",
      // poh_outsika:"",
      // poh_tipeponama:"",
      // poh_ptname:"",
      // poh_ptaddress:"",
      // poh_ptphone:"",
      // poh_ptfax:"",
      // poh_ptpostal:"",
      poh_pkpyn:selectedSupplier.sup_pkpyn,
      details: poDetails,
    };

    debounceMountCreatePO(obj)
  }

  function toggleModalProcode(type, data) {
    console.log('detail state', data)
    
    if (type === "ADD") {
      setModalType("ADD");
      setBonus(false);
    } else if (type === "EDIT") {
      setModalType("EDIT");
      setInputProcode((inputProcode = data));
      console.log('DATA KLIK EDIT', data)
      setInputQtyProcode(parseInt(data.pod_qty));
      setBonus(data.pod_bonusyn === "Y" ? true : false);

      console.log('open edit', data)
    } else {
      setInputProcode([]);
      setInputQtyProcode(0);
      setMasterProduct({});
      setBonus(false)
      setAlertBonus(false)
      setProcodBonus('')
      setInsentif(0)
      setSalesAwal(0)
    }
    setModalProcode(!modalProcode);
  }

  function detailObj(detail, procod, qty, bonusYN){
    var obj = {}
    if (bonusYN === 'N'){
      obj = {
        pt_id: parseInt(pt_id),
        pod_group: groupPO,
        pod_procod: procod,
        pod_qty: parseInt(qty),
        pod_sellunit: parseInt(detail.pro_sellunit),
        pod_sellpack: parseInt(detail.pro_sellpack),
        pod_buypack: parseInt(detail.pro_buypack),
        pod_grossbeli: detail.pro_grossprice,
        pod_nettobeli: detail.pro_nettprice,
        pod_disc: detail.pro_disc,
        pod_discvalue: detail.pro_discvalue,
        pod_disc2: detail.pro_disc2,
        pod_disc2value: detail.pro_disc2value,
        pod_vat: detail.pro_vat,
        pod_bonusyn: 'N',
        pod_proname : detail.pro_name,
        pod_sellpackname: detail.pro_sellpackname,
        pod_buypackname: detail.pro_buypackname,
        pod_keterangan: masterProduct.pro_keterangan,
        pod_minordpo: masterProduct.pro_minordpo,
        pod_kelipatan: masterProduct.pro_kelipatan,
        pod_procodbonus: alertBonus ? procodBonus : '',
        pod_belibonus: alertBonus ? salesAwal : 0,//JANGAN LUPA DI SET
        pod_dapatbonus:alertBonus ? insentif : 0, //JANGAN LUPA DI SET
        pod_ppnvalue: detail.pro_ppnvalue,
        pod_updateby: userID,
        // pod_updatetime: data.poh_updatetime
      };
    } else {
      console.log('data bonus', detail)
      obj = {
        pt_id: parseInt(pt_id),
        pod_group: groupPO,
        pod_procod: procod,
        pod_qty: Math.floor(qty),
        pod_sellunit: parseInt(detail.pro_sellunit),
        pod_sellpack: parseInt(detail.pro_sellpack),
        pod_buypack: parseInt(detail.pro_buypack),
        pod_grossbeli: 0,
        pod_nettobeli: 0,
        pod_disc: 0,
        pod_discvalue: 0,
        pod_disc2: 0,
        pod_disc2value: 0,
        pod_vat: 0,
        pod_bonusyn: "Y",
        pod_proname : detail.pro_name,
        pod_sellpackname: detail.pro_sellpackname,
        pod_buypackname: detail.pro_buypackname,
        pod_keterangan: masterProduct.pro_keterangan,
        pod_minordpo: 0,
        pod_kelipatan: 0,
        pod_procodbonus: "",
        pod_belibonus:0,
        pod_dapatbonus:0,
        pod_ppnvalue: 0,
        pod_updateby: userID,
        // pod_updatetime: data.poh_updatetime
      };
    }

    return obj
  }

  function createProcodeObject() {
    var data = inputProcode;
    var tempData = [...listProcode];
    var tempArr = [...poDetails];

    console.log('SAVE EDIT', data)
    //check checkbox terceklis / tidak
    if (bonus === true) {
      var nettoPrice = 0;
      var grossPrice = 0;
      var bonusYN = "Y";
    } else {
      nettoPrice = data.pro_nettprice;
      grossPrice = data.pro_grossprice;
      bonusYN = "N";
    }


    //jika modal "add" product
    if (modalType === "ADD") {

      //cari index product baru di detail PO sebelumnya
      var index = tempArr.findIndex(
        (item) => item.pod_procod === data.pro_code && item.pod_bonusyn === bonusYN
      );

      //jika bonus di ceklis
      if (bonus){

        //jika product sudah ada di detail (product bonus Y)
        if (index > -1){
          //tambah qty (product bonus Y)
          tempArr[index].pod_qty += parseInt(inputQtyProcode);
        } else {
          //tambah obj product bonus (product bonus Y)
          var objBonus = detailObj(data, data.pro_code, inputQtyProcode, 'Y')
          tempArr.push(objBonus);
        }
      } else { // jika bonus tidak diceklis

        //jika product sudah ada di detail (product bonus N)
        if (index > -1){
          //tambah qty (product bonus N)
          tempArr[index].pod_qty += parseInt(inputQtyProcode);
          if (alertBonus){ //dapat bonus
            //cari index product bonus di detail
            var indexBonus = tempArr.findIndex(
              (item) => item.pod_procod === procodBonus && item.pod_bonusyn === 'Y'
            );
            
            //hitung qty bonus dari qty non bonus
            var quantityBonus = (tempArr[index].pod_qty / salesAwal) * insentif
            
            //bonus sudah ada
            if (indexBonus > -1){

              //update qty
              tempArr[indexBonus].pod_qty = Math.floor(quantityBonus);
            } else { //bonus belum ada di detail

              if (data.pro_code !== procodBonus){
                //get data product untuk product bonus (antisipasi jika product & product bonus beda procod)
                var idxDataBonus = listProcode.findIndex(
                  (item) => item.pro_code === procodBonus
                )
    
                if (idxDataBonus < 0) {
                  data = {}
                  console.log('[ADD] Data product bonus tidak ada di list procod', procodBonus)
                } else {
                  data = listProcode[idxDataBonus]
                }
              }
              //tambah obj product bonus
              var objBonus = detailObj(data, procodBonus, quantityBonus, 'Y')
              tempArr.push(objBonus);
            }
          }
        } else { //jika product tidak ada di detail (product bonus N)
          var obj = detailObj(data, data.pro_code, inputQtyProcode, 'N')
          tempArr.push(obj);

          if (alertBonus){ //dapat bonus
            //cari index product baru di detail PO sebelumnya
            var indexBonus = tempArr.findIndex(
              (item) => item.pod_procod === procodBonus && item.pod_bonusyn === 'Y'
            );

            var quantityBonus = (inputQtyProcode / salesAwal) * insentif

            if (indexBonus > -1){
              tempArr[indexBonus].pod_qty = Math.floor(quantityBonus);
            } else {
              if (data.pro_code !== procodBonus){
                //get data product untuk product bonus (antisipasi jika product & product bonus beda procod)
                var idxDataBonus = listProcode.findIndex(
                  (item) => item.pro_code === procodBonus
                )
    
                if (idxDataBonus < 0) {
                  data = {}
                  console.log('Data product bonus tidak ada di list procod', procodBonus)
                } else {
                  data = listProcode[idxDataBonus]
                }
              }

              var objBonus = detailObj(data, procodBonus, quantityBonus, 'Y')
              tempArr.push(objBonus);
            }
          }
        }
      }
    }else if (modalType === "EDIT") {

      //checkbox diganti, hapus product dengan bonus YN yang lama
      if (data.pod_bonusyn !== bonusYN){
        //cari index by procod & bonus YN
        var indexLama = tempArr.findIndex(
          (item) => item.pod_procod === data.pod_procod && item.pod_bonusyn === data.pod_bonusyn
        );

        tempArr.splice(indexLama, 1);
      }

      //cari index dengan bonusYN baru
      var index = tempArr.findIndex(
        (item) => item.pod_procod === data.pod_procod && item.pod_bonusyn === bonusYN
      );

      //jika ada di detail (product dengan bonusYN baru)
      if (index > -1){

        //checkbox diganti
        if (data.pod_bonusyn !== bonusYN){
          //tambah qty
          tempArr[index].pod_qty += parseInt(inputQtyProcode);
        } else {
          //update qty
          tempArr[index].pod_qty = parseInt(inputQtyProcode);
        }

        //dapat bonus
        if (bonusYN === 'N' && alertBonus){
          var indexBonus = tempArr.findIndex(
            (item) => item.pod_procod === procodBonus && item.pod_bonusyn === 'Y'
          ); 

          var quantityBonus = (tempArr[index].pod_qty / salesAwal) * insentif

          if (indexBonus > -1) {
            tempArr[indexBonus].pod_qty = Math.floor(quantityBonus);
          } else {

            //get data product untuk product bonus (antisipasi jika product & product bonus beda procod)
            var idxDataBonus = listProcode.findIndex(
              (item) => item.pro_code === procodBonus
            )

            if (idxDataBonus < 0) {
              var dataBonus = {}
              console.log('Data product bonus tidak ada di list procod', procodBonus)
            } else {
              dataBonus = listProcode[idxDataBonus]
            }

            //tambah obj product bonus
            var objBonus = detailObj(dataBonus, procodBonus, quantityBonus, 'Y')
            tempArr.push(objBonus);
          }
        }
      } else { //jika tidak ada di detail (product dengan bonusYN baru)
        var obj = detailObj(data, data.pod_procod, inputQtyProcode, bonusYN)
        tempArr.push(obj)

        //dapat bonus
        if (bonusYN === 'N' && alertBonus){
          var indexBonus = tempArr.findIndex(
            (item) => item.pod_procod === procodBonus && item.pod_bonusyn === 'Y'
          ); 

          var quantityBonus = (inputQtyProcode / salesAwal) * insentif

          if (indexBonus > -1) {
            tempArr[indexBonus].pod_qty = Math.floor(quantityBonus);
          } else {
            var idxDataBonus = listProcode.findIndex(
              (item) => item.pro_code === procodBonus
            )

            if (idxDataBonus < 0) {
              var dataBonus = {}
              console.log('Data product bonus tidak ada di list procod', procodBonus)
            } else {
              dataBonus = listProcode[idxDataBonus]
            }

            var objBonus = detailObj(dataBonus, procodBonus, quantityBonus, 'Y')

            tempArr.push(objBonus);
          }
        }
      }
    }

    var tempFilter = tempArr.filter(
      (temp) => temp.pod_qty > 0
    )
    setPODetails(tempFilter);

    toggleModalProcode();
  }

  function checkMultipleQty() {
    var qty = inputQtyProcode;
    var multiple = masterProduct.pro_kelipatan ? masterProduct.pro_kelipatan : 1;
    var minQty = masterProduct.pro_minordpo ? masterProduct.pro_minordpo : 1;

    var round = multiple * (Math.round(parseFloat(qty)/parseFloat(multiple)));

    //kalau bonusYN = Y && qty sudah sesuai, return false
    if ((String(qty) === String(round) && qty >= minQty) || bonus === true) {
      return false; //bener
    } else {
      return  true; //salah
    }
  }

  function removeProcode(data) {
    var tempArr = [...poDetails];
    // var filteredArr = tempArr.filter(
    //   (item) => item.pod_procod !== data.pod_procod
    // );
    var indexRemove = tempArr.findIndex(
      (item) => item.pod_procod === data.pod_procod && item.pod_bonusyn === data.pod_bonusyn
    );

    if(indexRemove > -1 && data.pod_bonusyn === "N") {
      tempArr.splice(indexRemove, 1)
      
      //cek ada data bonus apa engga
      var indexRemoveBonus = tempArr.findIndex(
        (item) => item.pod_procod === data.pod_procod && item.pod_bonusyn === "Y"
      );
  
      if (indexRemoveBonus > -1){
        tempArr.splice(indexRemoveBonus, 1)
      }

    } else {
      tempArr.splice(indexRemove, 1)
    }

    setPODetails(tempArr);
  }

  function checkAdd() {
    if (poDetails.length > 27) {
      displayToast('error', language === 'EN' ? 'The number of products cannot exceed 28' : 'Jumlah produk tidak dapat melebihi 28')
    } else {
      toggleModalProcode("ADD");
    }
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#e0e0e0',
    ...theme.typography.body1,
    padding: theme.spacing(1),
    textAlign: 'start',
    color: theme.palette.text.secondary,
  }));

  // render
  return (
    <Box sx={{ width: "100%", p: 3, backgroundColor:"white" }}>
      <Grid container justifyContent="center">
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 0.5 }}>
            {groupPO === 1 ? 'ETHICAL' : 'FLOOR'} - CREATE
          </Typography>
      </Grid>
      <Divider sx={{ my: 2 }} />

      <Grid container justifyContent={"space-between"} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
           {language === "EN" ? "PO DATE" : "TANGGAL PO"}
          </Typography>
          <Item>&nbsp;{formatDate(new Date(), "ddd MMMM DD YYYY")}</Item>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
          {language === "EN" ? "PO TYPE" : "TIPE PO"}
          </Typography>
          <Item>&nbsp;{tipePO.nama}</Item>
        </Grid>
        
      </Grid>
      <Grid container justifyContent={"space-between"} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{mt: 2}}>
        <Grid item xs={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
            {language === "EN" ? "RECEIVING WAREHOUSE" : "GUDANG PENERIMA"}
          </Typography>
          {/* <Item>&nbsp;{gudangID}</Item> */}
          <Autocomplete 
              fullWidth
              size="small"
              clearIcon={false}
              loading={isLoading && listGudang.length === 0}
              getOptionLabel={(option) => option.outcode + ' - ' + option.name}
              options={listGudang}
              disabled = {!isEmpty(selectedSupplier)}
              onChange={(event, newValue) => {
                setInputGudang(newValue);
              }}
              // loading={loading}
              renderInput={(params) => (
                <TextField
                  value={inputGudang && inputGudang.outcode + ' - ' + inputGudang.name}
                  placeholder={language === 'EN' ? 'Choose a Warehouse' : 'Pilih Gudang'}
                  {...params}
                />
              )}
            />
        </Grid>
        <Grid item xs={6}>
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
            SUPPLIER
          </Typography>
          {/* <Item>&nbsp;</Item> */}
          <Autocomplete 
            fullWidth
            size="small"
            // clearIcon={false}
            loading={isLoading && listSupplier.length === 0}
            getOptionLabel={(option) => option.sup_code + ' - ' + option.sup_name}
            options={listSupplier}
            disabled = {poDetails.length > 0 || isEmpty(inputGudang) }
            onChange={(event, newValue) => {
              setSelectedSupplier(newValue);
            }}
            // loading={loading}
            renderInput={(params) => (
              <TextField
                disabled = {poDetails.length > 0 } //|| inputWarehouse.length === 0}
                value={selectedSupplier && selectedSupplier.sup_code + ' - ' + selectedSupplier.sup_name}
                placeholder={language === 'EN' ? 'Choose a Supplier' : 'Pilih Supplier'}
                {...params}
              />
            )}
          />
        </Grid>
      </Grid>
      <Grid container justifyContent={"space-between"} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{mt: 2}}>
        <Grid item xs={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
              MINIMUM VALUE PO
          </Typography>
          <Item>&nbsp;{selectedSupplier && selectedSupplier.pursup_minval}</Item>
        </Grid>
        <Grid item xs={4}>
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
            TOP
          </Typography>
          <Item>&nbsp;{selectedSupplier && selectedSupplier.finsup_top}</Item>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
            PKPYN
          </Typography>
          <Item>&nbsp;{selectedSupplier && selectedSupplier.sup_pkpyn}</Item>
        </Grid>
      </Grid>
      <Grid container justifyContent={"space-between"} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{mt: 2}}>
        <Grid item xs={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
              STATUS PRINT
          </Typography>
          <Item>&nbsp;N</Item>
        </Grid>
        <Grid item xs={6}>
           <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 0.5 }}>
            STATUS EMAIL
          </Typography>
          <Item>&nbsp;-</Item>
        </Grid>
      </Grid>


     {/* <Grid container justifyContent="space-between" sx={{mb:2}}>
      <Grid item>
        <FormGroup>
          <Typography variant="body1" sx={{ fontWeight:600,mt: 0.5, ml:1 }}>
            {language === 'EN' ? 'PO NUMBER' : 'NO PO'}
          </Typography>
          <Paper
            sx={{
              backgroundColor:"whitesmoke",
              color:'black',
              height: 35,
              width: 450,
              lineHeight: '30px',
            }}
          >
            <Typography variant="body1" sx={{ mt: 0.5, ml:1 }}>
              {poData.poh_nopo}
          </Typography>
          </Paper>
        </FormGroup>
      </Grid>
      <Grid item>
        <FormGroup>
          <Typography variant="body1" sx={{ fontWeight:600,mt: 0.5, ml:1 }}>
          {language === 'EN' ? 'PO DATE' : 'TANGGAL PO'}
          </Typography>
          <Paper
            sx={{
              backgroundColor:"whitesmoke",
              color:'black',
              height: 35,
              width: 450,
              lineHeight: '30px',
            }}
          >
            <Typography variant="body1" sx={{ mt: 0.5, ml:1 }}>
            {formatDate(poData.poh_tglpo, 'ddd MMMM DD YYYY')}
          </Typography>
          </Paper>
        </FormGroup>
      </Grid>
      <Grid item>
        <FormGroup>
          <Typography variant="body1" sx={{ fontWeight:600,mt: 0.5, ml:1 }}>
          {language === 'EN' ? 'PO TYPE' : 'TIPE PO'}
          </Typography>
          <Paper
            sx={{
              backgroundColor:"whitesmoke",
              color:'black',
              height: 35,
              width: 450,
              lineHeight: '30px',
            }}
          >
            <Typography variant="body1" sx={{ mt: 0.5, ml:1 }}>
            {poData.poh_tipeponama}
          </Typography>
          </Paper>
        </FormGroup>
      </Grid>
     </Grid>

     <Grid container justifyContent="space-between" sx={{mb:2}}>
      <Grid item>
        <FormGroup>
          <Typography variant="body1" sx={{ fontWeight:600,mt: 0.5, ml:1 }}>
          {language === 'EN' ? 'PO EXPIRED DATE' : 'TANGGAL EXPIRED PO'}
          </Typography>
          <Paper
            sx={{
              backgroundColor:"whitesmoke",
              color:'black',
              height: 35,
              width: 450,
              lineHeight: '30px',
            }}
          >
            <Typography variant="body1" sx={{ mt: 0.5, ml:1 }}>
            {formatDate(poData.poh_expireddate, 'ddd MMMM DD YYYY')}
          </Typography>
          </Paper>
        </FormGroup>
      </Grid>
      <Grid item>
        <FormGroup>
          <Typography variant="body1" sx={{ fontWeight:600,mt: 0.5, ml:1 }}>
            SUPPLIER
          </Typography>
          <Paper
            sx={{
              backgroundColor:"whitesmoke",
              color:'black',
              height: 35,
              width: 450,
              lineHeight: '30px',
            }}
          >
            <Typography variant="body1" sx={{ mt: 0.5, ml:1 }}>
            {poData.poh_supname}
          </Typography>
          </Paper>
        </FormGroup>
      </Grid>
      <Grid item>
        <FormGroup>
          <Typography variant="body1" sx={{ fontWeight:600,mt: 0.5, ml:1 }}>
          {language === 'EN' ? 'RECEIVING WAREHOUSE' : 'GUDANG PENERIMA'}
          </Typography>
          <Paper
            sx={{
              backgroundColor:"whitesmoke",
              color:'black',
              height: 35,
              width: 450,
              lineHeight: '30px',
            }}
          >
            <Typography variant="body1" sx={{ mt: 0.5, ml:1 }}>
            {poData.poh_outname}
          </Typography>
          </Paper>
        </FormGroup>
      </Grid>
     </Grid>

     <Grid container justifyContent="space-between" sx={{mb:2}}>
      <Grid item>
        <FormGroup>
          <Typography variant="body1" sx={{ fontWeight:600,mt: 0.5, ml:1 }}>
            MINIMUM VALUE PO
          </Typography>
          <Paper
            sx={{
              backgroundColor:"whitesmoke",
              color:'black',
              height: 35,
              width: 450,
              lineHeight: '30px',
            }}
          >
            <Typography variant="body1" sx={{ mt: 0.5, ml:1 }}>
            {poData.poh_minvalue}
          </Typography>
          </Paper>
        </FormGroup>
      </Grid>
      <Grid item>
        <FormGroup>
          <Typography variant="body1" sx={{ fontWeight:600,mt: 0.5, ml:1 }}>
            TOP
          </Typography>
          <Paper
            sx={{
              backgroundColor:"whitesmoke",
              color:'black',
              height: 35,
              width: 450,
              lineHeight: '30px',
            }}
          >
            <Typography variant="body1" sx={{ mt: 0.5, ml:1 }}>
            {poData.poh_top}
          </Typography>
          </Paper>
        </FormGroup>
      </Grid>
      <Grid item>
        <FormGroup>
          <Typography variant="body1" sx={{ fontWeight:600,mt: 0.5, ml:1 }}>
            PKPYN
          </Typography>
          <Paper
            sx={{
              backgroundColor:"whitesmoke",
              color:'black',
              height: 35,
              width: 450,
              lineHeight: '30px',
            }}
          >
            <Typography variant="body1" sx={{ mt: 0.5, ml:1 }}>
            {poData.poh_pkpyn}
          </Typography>
          </Paper>
        </FormGroup>
      </Grid>
     </Grid>

     <Grid container justifyContent="space-between" sx={{mb:6}}>
      <Grid item >
        <FormGroup>
          <Typography variant="body1" sx={{ fontWeight:600,mt: 0.5, ml:1 }}>
            STATUS PRINT
          </Typography>
          <Paper
            sx={{
              backgroundColor:"whitesmoke",
              color:'black',
              height: 35,
              width: 700,
              lineHeight: '30px',
            }}
          >
            <Typography variant="body1" sx={{ mt: 0.5, ml:1 }}>
            {poData.poh_print}
          </Typography>
          </Paper>
        </FormGroup>
      </Grid>
      <Grid item>
        <FormGroup>
          <Typography variant="body1" sx={{ fontWeight:600,mt: 0.5, ml:1 }}>
            STATUS EMAIL
          </Typography>
          <Paper
            sx={{
              backgroundColor:"whitesmoke",
              color:'black',
              height: 35,
              width: 700,
              lineHeight: '30px',
            }}
          >
            <Typography variant="body1" sx={{ mt: 0.5, ml:1 }}>
            {language === 'EN' ? poData.statusemailen : poData.statusemailid}
          </Typography>
          </Paper>
        </FormGroup>
      </Grid>
     </Grid> */}

     <Grid container justifyContent="flex-end" sx={{mb:2}}>
      <Grid item>
        <Button
          disabled={isEmpty(selectedSupplier) || isEmpty(tipePO)}
          sx={{ float: "right", mt:2}}
          variant="contained"
          startIcon={<AddIcon />}
          size="medium"
          onClick={() => checkAdd()}
        >
          {language === 'EN' ? 'Add Procode':'Tambah Procode'}
        </Button>
      </Grid>
     </Grid>

     <Paper sx={{mb:4}}>
        <TableContainer >
          <Table size="medium">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "600" }} align="center">No.</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>PROCODE</TableCell>
                <TableCell sx={{ fontWeight: "600" }}></TableCell>
                <TableCell sx={{ fontWeight: "600" }}>
                  {language === 'EN' ? 'PRODUCT NAME' : 'NAMA PRODUK'}
                </TableCell>
                <TableCell sx={{ fontWeight: "600" }}>QTY</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>BUYPACK</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>UNIT</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>SELLPACK</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="center">BONUS</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="right">GROSS</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="right">DISC</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="right">DISC 2</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>VAT</TableCell>
                <TableCell sx={{ fontWeight: "600" }}align="right">NETTO</TableCell>
                <TableCell sx={{ fontWeight: "600" }}align="right">TOTAL NETTO</TableCell>
                <TableCell sx={{ fontWeight: "600" }}align="center">ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {poDetails &&
                poDetails.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell>{item.pod_procod}</TableCell>
                    <TableCell>
                      {item.pod_keterangan !== 0 && (
                        <WarningIcon color="warning"/>
                      )}
                    </TableCell>
                    <TableCell>{item.pod_proname}</TableCell>
                    <TableCell>{item.pod_qty}</TableCell>
                    <TableCell>{item.pod_buypackname}</TableCell>
                    <TableCell >{item.pod_sellunit}</TableCell>
                    <TableCell >{item.pod_sellpackname}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.pod_bonusyn}
                        color={item.pod_bonusyn === 'N' ? 'error' : 'success'}
                        size="small"
                        sx={{fontWeight:900}}
                      />
                    </TableCell>
                    <TableCell align="right">{formatNumber(item.pod_grossbeli)}</TableCell>
                    <TableCell align="right">{item.pod_disc}%</TableCell>
                    <TableCell align="right">{item.pod_disc2}%</TableCell>
                    <TableCell >{item.pod_vat}%</TableCell>
                    <TableCell align="right">{formatNumber(item.pod_nettobeli)}</TableCell>
                    <TableCell align="right">{formatNumber(item.pod_nettobeli * item.pod_qty)}</TableCell>
                    <TableCell align="center">
                      <Grid container justifyContent={"center"}>
                        <Grid item>
                          <IconButton 
                            color="error" 
                            onClick={() => removeProcode(item)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton 
                            color="info" 
                            onClick={() => toggleModalProcode("EDIT", item)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow >
                  {/* <TableCell rowSpan={3} /> */}
                  <TableCell colSpan={13}/>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                      Total : 
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
                      {formatNumber(totalNetto)}  
                    </Typography>
                    
                  </TableCell>
                </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* <Grid container justifyContent="flex-end" spacing={2}>
          <Grid item>
          <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
              Total : 
            </Typography>
          </Grid>
          <Grid item md={2} sx={{textAlign:'right'}}>

          <Typography variant="body1" sx={{ fontWeight: 600, mt: 0.5 }}>
              {formatNumber(100000000000)}
            </Typography>
          </Grid>
          <Grid item md={1}>

          </Grid>
        </Grid> */}
      </Paper>

      <Divider sx={{ my: 2, mb: 2 }} />

      <Grid container justifyContent="center" spacing={2}>
        <Grid item>
          <Button
            style={{ float: "right"}}
            variant="contained"
            startIcon={<SaveIcon />}
            size="medium"
            color="success"
            disabled={
              poDetails.length === 0 || 
              poDetails.length > 28 || 
              isEmpty(inputGudang) || 
              isEmpty(selectedSupplier) || 
              pt_id === undefined ||  
              totalNetto < 0} //JANGAN LUPA GANTI KE min value supplier
            onClick={() => setModalConfirm(true)}
          >
            {language === 'EN' ? 'Save':'Simpan'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            style={{ float: "right"}}
            variant="contained"
            startIcon={<DeleteIcon />}
            size="medium"
            color="error"
            onClick={() => router.push(`/po`)}
          >
            {language === 'EN' ? 'Cancel':'Batal'}
          </Button>
        </Grid>
      </Grid>
      {/* MODAL PROCODE*/}
      <Dialog
        open={modalProcode}
        onClose={() => toggleModalProcode()}
        fullWidth
        PaperProps={{ sx: { position: "fixed", top: 10} }}
        >
        <DialogTitle sx={{fontWeight: 600}}>{language === 'EN' ? (modalType === 'ADD' ? 'ADD NEW PRODUCT' : 'EDIT PRODUCT') : (modalType === 'ADD'? 'TAMBAH PRODUK BARU':'EDIT PRODUK')}</DialogTitle>
        <DialogContent>
          <Grid container direction="column" sx={{mb:1}}>
            <Grid item>
              Procode
              {(!isEmpty(masterProduct) || masterProduct !== undefined) && ((masterProduct.pro_keterangan !== undefined && masterProduct.pro_keterangan !== 0) &&
                <Chip sx={{ml:1, mb:1}} size="small" color="warning" variant="outlined" label={language === 'EN' ? 'This product has a warning.' : 'Produk ini memiliki keterangan khusus.'}/>
              )}
            </Grid>
            <Grid item>
              {modalType === 'ADD' ? (
                <Autocomplete 
                  fullWidth
                  size="small"
                  clearIcon={false}
                  loading={isLoading && listProcode.length === 0}
                  getOptionLabel={(option) => option.pro_code + ' - ' + option.pro_name}
                  options={listProcode}
                  onChange={(event, newValue) => {
                    setInputProcode(newValue);
                  }}
                  // loading={loading}
                  renderInput={(params) => (
                    <TextField
                      value={inputProcode && inputProcode.pro_code + ' - ' + inputProcode.pro_name}
                      placeholder={language === 'EN' ? 'Choose a Procode' : 'Pilih Produk'}
                      {...params}
                    />
                  )}
                />
              ):(
                <TextField
                  disabled
                  fullWidth
                  value={inputProcode && inputProcode.pod_procod + ' - ' + inputProcode.pod_proname}
                />
              )}
              
            </Grid>
          </Grid>
          <Grid container direction="column" sx={{mb:1}}>
            <Grid item>
              Qty
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                type="number"
                size="small"
                min={0}
                value={inputQtyProcode}
                onChange={(e) => setInputQtyProcode(e.target.value)}
              />
              {bonus === false && <FormHelperText sx={{color:'red'}}>min. qty order: {masterProduct.pro_minordpo ? masterProduct.pro_minordpo : 1}, {language === 'EN' ?  'min. qty multiple':'min. kelipatan qty'} : {masterProduct.pro_kelipatan ? masterProduct.pro_kelipatan : 1}</FormHelperText>}

            </Grid>
          </Grid>
          <Grid container direction="column" sx={{mb:1}}>
            <FormGroup>
              <FormControlLabel 
                control={<Checkbox checked={bonus} onChange={() => setBonus(!bonus)} />} 
                label="Bonus" 
              />
            </FormGroup>
          </Grid>
          {(alertBonus && !bonus) &&
            <Grid container sx={{mb:1}}>
              <Alert
                severity="info"
                fullWidth
                // style={isShown ? {marginBottom: 0} : { display: 'none' }}
              >
                {/* <CIcon name="cilLightbulb"className="flex-shrink-0 me-2" width={18} height={18} style={{marginRight: '6px'}}/> */}
                {language === 'EN' ? 
                    'This product can get '+ insentif +' bonus for every '+ salesAwal +' purchase.' :
                    'Produk ini berhak mendapatkan bonus sebanyak '+ insentif +' setiap pembelian '+ salesAwal + '.'
                  }
              </Alert>
            </Grid>
            }
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="center" spacing={1}>
            <Grid item>
              <Button 
                color="success" 
                variant="contained"
                size="small"
                disabled={
                  parseInt(inputQtyProcode) === 0 ||
                  parseInt(inputQtyProcode) < 0 ||
                  isNaN(parseInt(inputQtyProcode)) ||
                  inputProcode.length === 0 ||
                  inputQtyProcode === "" ||
                  checkMultipleQty() ||
                  isEmpty(inputProcode) ||
                  isEmpty(masterProduct)||
                  isLoading
                }
                onClick={() => createProcodeObject()}
              >
                {language === 'EN' ? 'Save' : 'Simpan'}
              </Button>
            </Grid>
            <Grid item>
              <Button 
                color="error" 
                variant="contained"
                size="small"
                onClick={() => toggleModalProcode()}
              >
                {language === 'EN' ? 'Cancel' : 'Batal'}
              </Button>
            </Grid>

          </Grid>
        </DialogActions>
      </Dialog>
      {/* MODAL PROCODE*/}

      {/* MODAL KONFIRMASI ADD */}
      <Dialog
       open={modalConfirm}
       onClose={() => setModalConfirm(false)}
       fullWidth
       PaperProps={{ sx: { position: "fixed", top: 10} }}
       >
        <DialogTitle sx={{fontWeight: 600}}>{language === 'EN' ? 'Create PO Confirmation' : 'Konfirmasi Create PO'}</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
                {language === 'EN' ? 'Are you sure you want to create this PO?':'AApakah anda yakin ingin membuat PO ini?'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="medium"
            color="success"
            disabled={isLoading}
            onClick={() => savePO()}
          >
            
            {!isLoading && <span>{language === 'EN' ? 'Yes':'Ya'}</span>}
            {isLoading && <SyncIcon/>}
            {isLoading && <span>{language === 'EN' ? 'Processing...':'Sedang Diproses...'}</span>}
          </Button>
          {!isLoading && (
          <Button
            variant="contained"
            size="medium"
            color="error"
            onClick={() => setModalConfirm(false)}
          >
            {language === 'EN' ? 'No':'Tidak'}
          </Button>)}
        </DialogActions>
       </Dialog>
      {/* MODAL KONFIRMASI EDIT */}
    </Box>  
  
  
  );
};
export default PurchaseOrderAdd;