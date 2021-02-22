/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Label,
  FormGroup,
  Form,
  Tooltip,
} from 'reactstrap';
import Page from 'components/Page';
import { MdSearch, MdAutorenew, MdPrint } from 'react-icons/md';
import { MdLoyalty, MdSave } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl1 from '../urlLinkReceiving';
import LoadingSpinner from '../LoadingSpinner';

import * as firebase from 'firebase/app';

const perf = firebase.performance();

const initialCurrentData = {
  procod: '',
  prodes: '',
  ed: '',
  batch: '',
  qty: '',
};

class ReceivingPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingKaryawan: true,
      buttonPrint: 'block',
      tooltiPrint: 'block',
      disabledPrint: true,
      resetInfo: false,
      result: [],
      addList: [],
      currentData: { ...initialCurrentData },
      active_user_id: '10',
      loading: false,
      checked: false,
      barcode: '',
      enterButton: false,
      show: false,
      //981 , 001
      gudangID: window.localStorage.getItem('gID'),
      noPO: '',
      headerPO: {},
      detailPO: [],
      userID: '',
      passwordIC: '',
      currProcod: '', // procod yang lagi discan (untuk field edit procod)
      realCurrProcod: '', // procod yang discan
      currProd: {}, //array tampung hasil scan,
      id: 0, //current Procod Data
      lastBatch: {
        rcvd_ed: '',
        rcvd_nobatch: '',
        rcvd_quantityrecv: '',
        rcvd_quantitybonus: '',
      }, //last procod batch,
      listTampil: [], //array untuk data tampil,
      firstLoad: true,
      showField: true,
      selectedID: -1,
      namaKaryawan: '',
      magictemp: [],
      isAdding: true,
      isScan: false,
      dataAvailable: false,
    };
  }

  redirect = () =>
    this.props.history.push({
      pathname: '/login',
    });

  changePageState = (pageState, data = {}) => () => {
    if (pageState === 'HEADER') {
      if (this.props.location.state.group == 2) {
        this.props.history.push({
          pathname: '/receivingFloor',
        });
      } else if (this.props.location.state.group == 1) {
        this.props.history.push({
          pathname: '/receivingApotek',
        });
      }
    } else if (pageState === 'DETAIL') {
      this.props.history.push({
        pathname: '/receivingDetail',
        state: {
          data: data,
          ok: true,
        },
      });
    } else {
      this.props.history.push({
        pathname: '/receivingNew',
        state: {
          ok: true,
        },
      });
    }
  };

  showNotification = (currMessage, levelType) => {
    setTimeout(() => {
      if (!this.notificationSystem) {
        return;
      }
      this.notificationSystem.addNotification({
        title: <MdLoyalty />,
        message: currMessage,
        level: levelType,
      });
    }, 300);
  };

  getPO(noPO, group = 0) {
    const trace = perf.trace('getPO_NewRecv');
    trace.start();
    if (group === 1 && group === 2) {
      return;
    }
    var url = myUrl1.url_getPO + `&group=` + group + `&noPO=` + noPO;

    const option = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(url, option)
      .then(response => {
        trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        this.getDetailPO(group, data, this.state.gudangID);
      });
  }

  getDetailPO(group, dataPO, gudangID) {
    const trace = perf.trace('getDetailPO_NewRecv');
    trace.start();
    var url = `${myUrl1.url_detailPO + gudangID}?flag=N&group=${group}`;
    var profile = JSON.parse(window.localStorage.getItem('profile'));
    var payload = {
      ...dataPO,
    };

    payload['additionalData'] = {
      group: group,
      gudangID: gudangID,
      NIP: profile.mem_nip,
      userID: profile.mem_nip,
    };

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };
    fetch(url, option)
      .then(response => {
        trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        var allData = data;
        var data1 = allData.data;
        var header = data1.header;
        header['rcvh_group'] = group;
        var detail = data1.detail;
        var metadata = allData.metadata;
        var error = allData.error;
        var x = document.getElementById('receivingUpper');
        var y = document.getElementById('receivingBottom');
        if (error.status == false) {
          if (metadata.Status === 'TRUE') {
            if (x.style.display === 'none' && y.style.display === 'none') {
              x.style.display = 'block';
              y.style.display = 'block';
            }
            this.showNotification('Data Berhasil Ditemukan!', 'info');
            window.localStorage.setItem('listPO', JSON.stringify(data1));
            window.localStorage.setItem('confirmPO', JSON.stringify(data1));

            var z = document.getElementById('scanNoPO');
            this.setState(
              {
                headerPO: header,
                detailPO: detail,
                listTampil: detail,
                firstLoad: false,
              },

              () => (z.style.display = 'none'),
            );
          } else if (metadata.Status === 'FALSE') {
            this.showNotification(metadata.Message, 'error');
            if (metadata.Message.toLowerCase().includes('expired')) {
              window.localStorage.removeItem('tokenCookies');
              window.localStorage.removeItem('accessList');
              this.redirect();
            }
          }
        } else {
          this.showNotification(error.msg, 'error');
        }
      });
  }

  getDetailPOAgain(group, data, gudangID) {
    const trace = perf.trace('getDetailPOAgain_NewRecv');
    trace.start();
    var url =
      myUrl1.url_getDaftarReceiving +
      gudangID +
      '/' +
      data.rcvh_norecv +
      '?group=' +
      group;

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(url, option)
      .then(response => {
        trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        var allData = data;

        var data1 = allData.data;
        var header = data1.header;
        header['rcvh_group'] = group;
        var detail = data1.detail;
        var metadata = allData.metadata;
        var error = allData.error;
        if (error.status == false) {
          if (metadata.Status === 'TRUE') {
            window.localStorage.setItem('listPO', JSON.stringify(data1));
            window.localStorage.setItem('confirmPO', JSON.stringify(data1));
            // var detailTampil = this.showTable([...detail]);
            if (header.rcvh_niprecv !== '') {
              this.getKaryawanData(header.rcvh_niprecv);
            }

            this.setState({
              headerPO: header,
              detailPO: detail,
              listTampil: detail,
              firstLoad: false,
            });
          } else if (metadata.Status === 'FALSE') {
            this.showNotification(metadata.Message + 'BBBBB', 'error');
            if (metadata.Message.toLowerCase().includes('expired')) {
              window.localStorage.removeItem('tokenCookies');
              window.localStorage.removeItem('accessList');
              this.redirect();
            }
          }
        } else {
          this.showNotification(error.msg, 'error');
        }
      });
  }

  getKaryawanData(nip) {
    const trace = perf.trace('karyawanData_NewRecv');
    trace.start();
    var url = myUrl1.url_getKaryawan;
    var payload = {
      nip: [nip],
    };

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };
    fetch(url, option)
      .then(response => {
        trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
        }
      })
      .then(data => {
        var allData = data;
        //if found
        if (allData.error.stauts === true) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          if (allData.data === null) {
            return;
          } else {
            if (allData.data.length > 0) {
              this.setState({
                namaKaryawan: allData.data[0].nama,
                loadingKaryawan: true,
                disabledPrint: false,
              });
              this.updateObjectValue(nip, 'rcvh_niprecv', 'headerPO');
            } else {
              this.showNotification('NIP Karyawan tidak ditemukan!', 'error');
            }
          }
        }
      });
  }

  passwordIC = () => {
    // const trace = perf.trace('passwordIC_NewRecv');
    // trace.start();
    // var userID = this.state.userID;
    // var pwd = this.state.passwordIC;
    // var payload = {
    //   userID: userID,
    //   passwordIC: pwd,
    // };
    // const option = {
    //   method: 'POST',
    //   json: true,
    //   headers: {
    //     'Content-Type': 'application/json;charset=UTF-8',
    //     Authorization: window.localStorage.getItem('tokenCookies'),
    //   },
    //   body: JSON.stringify(payload),
    // };
    // fetch(url,option)
    //         if(status === true)
    //             toggle(nested_parent_scan)
    //         setState
    //             modal qty:true
  };

  confirmPO = () => {
    const { group } = this.props;
    const trace = perf.trace('confirm_PONewRecv');
    trace.start();
    this.fetchData();
    var url = myUrl1.url_detailPO + this.state.gudangID + '?flag=P';
    var { headerPO } = this.state;
    // var data1 = JSON.parse(window.localStorage.getItem('confirmPO'));
    var payload = { ...headerPO };
    var profile = JSON.parse(window.localStorage.getItem('profile')); //Ini untuk data pengguna
    payload['rcvh_userid'] = profile.mem_nip;

    var efDate = payload['rcvd_ed'];

    //get current time
    var today = new Date();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    payload['rcvh_group'] = parseInt(headerPO['rcvh_group']);
    efDate = efDate + 'T' + hours + ':' + minutes + ':' + seconds + 'Z';
    payload['rcvh_tglfaktur'] = new Date(payload['rcvh_tglfaktur']);
    payload['rcvh_tgldo'] = new Date(payload['rcvh_tgldo']);
    payload['rcvh_ed'] = new Date(payload['rcvh_ed']);
    payload['rcvh_tglrecv'] = new Date(payload['rcvh_tglrecv']);
    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };

    fetch(url, option)
      .then(response => {
        trace.stop();
        if (response.ok) {
          this.setState({
            modal_nested: false,
            modal_nested_parent: false,
            loading: false,
          });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        var allData = data;
        var data1 = allData.data;
        var metadata = allData.metadata;
        var error = allData.error;
        if (error.status == false) {
          if (metadata.Status === 'TRUE') {
            if (data1.Status === 'TRUE') {
              window.localStorage.removeItem('listPO');
              window.localStorage.removeItem('confirmPO');
              if (this.props.location.state.group == 2) {
                this.props.history.push({
                  pathname: '/receivingFloor',
                });
              } else if (this.props.location.state.group == 1) {
                this.props.history.push({
                  pathname: '/receivingApotek',
                });
              }
            } else {
              this.showNotification(data1.Message, 'error');
            }
          } else if (metadata.Status === 'FALSE') {
            this.showNotification(metadata.Message, 'error');
            if (metadata.Message.toLowerCase().includes('expired')) {
              window.localStorage.removeItem('tokenCookies');
              window.localStorage.removeItem('accessList');
              this.redirect();
            }
          }
        } else {
          this.showNotification(error.msg, 'error');
        }
      });
  };

  setDataStatus() {
    if (this.state.result !== null || this.state.result !== undefined) {
      this.setState({
        dataAvailable: true,
      });
    } else {
      this.setState({
        dataAvailable: false,
      });
    }
  }

  componentDidMount() {
    const { data, group } = this.props.location.state;
    var displayScan = document.getElementById('scanNoPO');
    var labelGroup = group == 2 ? 'FLOOR' : 'APOTEK';
    var gudangName = window.localStorage.getItem('gName');
    this.props.setTitle('RECEIVING ' + labelGroup + ' ' + gudangName, 'red');
    // console.log('DATA OVERALL', data);

    if (data !== undefined) {
      displayScan.style.display = 'none';
      this.getDetailPOAgain(group, data, this.state.gudangID);
    }

    // this.getKaryawanData()
  }

  deleteItem = todo => evt => {
    var { currProd } = this.state;
  };

  saveBatchUpdate = (newData, index) => evt => {
    // var index = index + 1;
    var { realCurrProcod, currProd } = this.state;
    const trace = perf.trace('saveBatchUpdate_PONewRecv');
    trace.start();
    var url = myUrl1.url_detailPO + this.state.gudangID + '?flag=S';
    console.log('FLAG S', url);

    var profile = JSON.parse(window.localStorage.getItem('profile'));
    var data1 = JSON.parse(window.localStorage.getItem('listPO'));
    var header = data1.header;
    if (typeof header.rcvh_group === 'string') {
      header.rcvh_group = parseInt(header.rcvh_group);
    }
    console.log('NEW DATA: ', newData);

    //COPY DATA FROM HEADER
    newData.batch[index]['rcvd_norecv'] = newData['rcvd_norecv'];
    newData.batch[index]['rcvd_procode'] = newData['rcvd_procode'];
    newData.batch[index]['rcvd_proname'] = newData['rcvd_proname'];
    newData.batch[index]['rcvd_sellunit'] = newData['rcvd_sellunit'];
    newData.batch[index]['rcvd_quantitysellunitpo'] =
      newData['rcvd_quantitysellunitpo'];
    newData.batch[index]['rcvd_sellpack'] = newData['rcvd_sellpack'];
    newData.batch[index]['rcvd_quantitypo'] = newData['rcvd_quantitypo'];
    newData.batch[index]['rcvd_quantitybonus'] = newData['rcvd_quantitybonus'];
    newData.batch[index]['rcvd_quantitybonuspo'] =
      newData['rcvd_quantitybonuspo'];
    newData.batch[index]['rcvd_passIc'] = newData['rcvd_passIc'];
    newData.batch[index]['rcvd_ed'] = this.state['lastBatch']['rcvd_ed'];

    // console.log('INDEX KEBERAPA: ', index);

    if (
      this.validateTglReturnBool(
        this.state['lastBatch']['rcvd_ed'],
        'rcvd_ed',
        'currProd',
        'detail',
      ) === false
    ) {
      return;
    }
    this.updateArrayObjectValue(
      this.state['lastBatch']['rcvd_nobatch'],
      'rcvd_nobatch',
      'currProd',
    );
    this.updateArrayObjectValue(
      parseInt(this.state['lastBatch']['rcvd_quantityrecv']),
      'rcvd_quantityrecv',
      'currProd',
    );
    this.updateArrayObjectValue(
      parseInt(this.state['lastBatch']['rcvd_quantitybonus']),
      'rcvd_quantitybonus',
      'currProd',
    );
    console.log(
      'HUEHUEHUE',
      this.state['lastBatch']['rcvd_quantityrecv'],
      this.state['lastBatch']['rcvd_nobatch'],
    );
    newData.batch[index]['rcvd_quantityrecv'] = parseInt(
      this.state['lastBatch']['rcvd_quantityrecv'],
    );
    newData.batch[index]['rcvd_nobatch'] = this.state['lastBatch'][
      'rcvd_nobatch'
    ];
    newData.batch[index]['rcvd_quantitybonus'] = parseInt(
      this.state['lastBatch']['rcvd_quantitybonus'],
    );

    console.log(
      'NEW DATA AHAY: ',
      newData.batch[index]['rcvd_quantityrecv'],
      newData.batch[index]['rcvd_nobatch'],
    );

    //INSERT TOTAL QTY

    var qtyPO = newData['rcvd_quantitypo'];
    var qtyBonusPo = newData['rcvd_quantitybonuspo'];
    var totalQty = 0;
    console.log('TOLOL BANGET GW', newData['batch']);
    var totalQtyBonusPO = 0;
    console.log(
      newData['batch'][0].rcvd_nobatch,
      newData['batch'][1].rcvd_nobatch,
    );
    if (newData['batch'][0].rcvd_nobatch === newData['batch'][1].rcvd_nobatch) {
      for (let i = 1; i < newData['batch'].length; i++) {
        var currObj = newData['batch'][i];
        totalQty += parseInt(currObj['rcvd_quantityrecv']);
        totalQtyBonusPO += parseInt(currObj['rcvd_quantitybonus']);
      }
      console.log('MAX QTY PO: ', qtyPO);
      console.log('MAX QTY BNS PO: ', qtyBonusPo);
      console.log('QTY PO: ', totalQty);
      console.log('QTY BNS PO: ', totalQtyBonusPO);
      console.log('TRUE/FALSE 1: ', qtyPO <= totalQty);
      console.log('TRUE/FALSE 2: ', qtyBonusPo >= totalQtyBonusPO);
      // totalQty += parseInt(currObj["rcvd_quantityrecv"] + currObj["rcvd_quantitybonus"]);
    } else if (
      newData['batch'][0].rcvd_nobatch !== newData['batch'][1].rcvd_nobatch
    ) {
      for (let i = 0; i < newData['batch'].length; i++) {
        var currObj = newData['batch'][i];
        totalQty += parseInt(currObj['rcvd_quantityrecv']);
        totalQtyBonusPO += parseInt(currObj['rcvd_quantitybonus']);
        // totalQty += parseInt(currObj["rcvd_quantityrecv"] + currObj["rcvd_quantitybonus"]);
        console.log('MAX QTY PO: ', qtyPO);
        console.log('MAX QTY BNS PO: ', qtyBonusPo);
        console.log('QTY PO: ', totalQty);
        console.log('QTY BNS PO: ', totalQtyBonusPO);
        console.log('TRUE/FALSE 1: ', qtyPO <= totalQty);
        console.log('TRUE/FALSE 2: ', qtyBonusPo >= totalQtyBonusPO);
      }
    }

    // var totalQty = currProd.rcvd_quantitypo;
    // var totalQtyBonusPO = currProd.rcvd_quantitybonuspo;

    if (totalQty <= qtyPO && qtyBonusPo >= totalQtyBonusPO) {
      newData.batch[index]['rcvd_quantitytotal'] = totalQty;
      newData.batch[index]['rcvd_quantitybonuspo'] = totalQtyBonusPO;
      //INSERT USER ID
      newData.batch[index]['rcvd_userid'] = profile.mem_nip;

      //FORMAT DATE
      var efDate = newData.batch[index]['rcvd_ed'];
      var x = document.getElementById('buttonAdd');

      console.log('EF DATE BEFORE: ', efDate);

      if (efDate !== null) {
        if (!efDate.includes('T')) {
          efDate = new Date(efDate);
          newData.batch[index]['rcvd_ed'] = efDate;
        } else {
          efDate = new Date(efDate);
          newData.batch[index]['rcvd_ed'] = efDate;
        }
      }
      console.log('EF DATE AFTER: ', efDate);

      var detail = newData.batch[index];
      console.log('ISI DETAIL: ', detail);
      detail['rcvd_procode'] = realCurrProcod;

      var payload = {
        header: header,
        detail: detail,
      };
      console.log('PAYLOAD SAVE 1: ', payload);
      console.log('PAYLOAD SAVE 2: ', currProd);
      // currProd.pop();

      const option = {
        method: 'POST',
        json: true,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: window.localStorage.getItem('tokenCookies'),
        },
        body: JSON.stringify(payload),
      };
      console.log('TEST PAYLOAD UNTUK SAVE', option);

      fetch(url, option)
        .then(response => {
          trace.stop();
          if (response.ok) {
            console.log('RESPONSE: ', response);
            return response.json();
          } else {
            this.showNotification('Koneksi ke server gagal!', 'error');
            this.setState({
              loading: false,
              efDate: '',
              lastBatch: {},
            });
          }
        })
        .then(data => {
          var lastindex = parseInt(
            currProd['batch'].length - 1 < 0 ? 0 : currProd['batch'].length - 1,
          );
          console.log('DATA BACKEND: ', data);
          console.log('DATA BACKEND: ', currProd['batch'].length - 1);

          var allData = data;
          var data1 = allData.data;
          var detail = data1.detail;
          var metadata = allData.metadata;
          var error = allData.error;
          if (error.status === false) {
            if (metadata.Status === 'TRUE') {
              this.addBatch(evt);
              if (x.hidden === false) {
                x.hidden = true;
              }
              this.showNotification('Data Berhasil Tersimpan', 'info');
              if (error.msg.toLowerCase().includes('expired')) {
                window.localStorage.removeItem('tokenCookies');
                window.localStorage.removeItem('accessList');
                this.redirect();
              }

              console.log('ISI DETAILNYA? ', detail);
              if (lastindex > 0) {
                this.setState(
                  {
                    listTampil: detail,
                    firstLoad: false,
                    isAdding: false,
                    isScan: true,
                    currProd: data.data.detail[0],
                  },
                  () => currProd.batch.pop(),
                );
              } else {
                this.setState(
                  {
                    listTampil: detail,
                    firstLoad: false,
                    isAdding: false,
                    isScan: true,
                    currProd: data.data.detail[0],
                  },
                  () => this.deleteLastIndex(),
                );
              }
            } else {
              this.showNotification(metadata.Message, 'error');
            }
          } else {
            this.showNotification(error.msg, 'error');
          }
        });
      setTimeout(3000, (evt.target.disabled = false));
    } else {
      this.showNotification('Quantity Melebihi Total PO', 'error');
      this.setState(
        {
          // listTampil: [],
          firstLoad: false,
        },
        () => console.log('ISI LIST TAMPIL', this.state.listTampil),
      );
    }
    return;
  };

  deleteLastIndex() {
    var lastindex = parseInt(
      this.state.currProd['batch'].length - 1 < 0
        ? 0
        : this.state.currProd['batch'].length - 1,
    );
    console.log('HIYA MASUK INDEX: ', lastindex);
    if (lastindex > 0) {
      this.state.currProd.batch.pop();
      console.log('HIYA MASUK GAN 1', this.state.currProd);
    } else {
      console.log('HIYA MASUK GAN 2', this.state.currProd);
    }
  }

  //modal Tambah
  state = {
    modal_tambah: false,
    modal_backdrop_tambah: false,
    modal_nested_parent_tambah: false,
    modal_nested_tambah: false,
    backdrop_tambah: true,
  };

  //modal Simpan
  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    backdrop: true,
  };

  //modal Scan
  state = {
    modal_scan: false,
    modal_backdrop_scan: false,
    modal_nested_parent_scan: false,
    modal_nested_scan: false,
    backdrop_scan: true,
  };

  //modal pilih Batch
  state = {
    modal_chooseBatch: false,
    found: {},
  };

  toggle = modalType => () => {
    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  fetchData = () => {
    this.setState({ loading: true });
  };

  testFunc = modalType => {
    if (this.state.modal_nested_parent && this.state.modal_nested) {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        modal_nested: false,
      });
    } else {
      if (!modalType) {
        return this.setState({
          modal: !this.state.modal,
        });
      }

      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      });
    }
  };

  gotoDetail = e => {
    e.target.style = {
      ...e.target.style,
      'text-decoration': 'none',
      'text-shadow': '1px 1px 1px #555',
    };
  };

  updateInputValue = field => evt => {
    this.setState({
      [`${field}`]: evt.target.value,
    });
    evt.preventDefault();
  };

  updateObjectValue(value, field, Data) {
    let currentData = this.state[Data];
    currentData[field] = value;
    this.setState(
      { currentData },
      // () =>
      // console.log('CURRENT DATA INPUT', currentData),
    );
  }

  updateArrayObjectValue(value, field, arrayName) {
    var index = parseInt(this.state.id);
    let currentData = this.state[arrayName];
    currentData['batch'][index][field] = value;
    this.setState(
      { arrayName: currentData },
      // () =>
      // console.log('CURRENT DATA ARRAYNAME', currentData),
    );
    // console.log("CURRENT ", currentData);
  }

  //UNTUK TERIMA HASIL SCAN DAN ADD QTY
  scanProcod = event => {
    if (
      event.key === 'Enter' &&
      event.target.value !== '' &&
      event.target.value.trim() !== '' &&
      event.target.value.trim().length > 0
    ) {
      var { currProd, id, realCurrProcod, listTampil } = this.state;
      var data1 = JSON.parse(window.localStorage.getItem('listPO'));
      var detail = data1.detail;
      var tempProcod = event.target.value.trim();
      var found;
      var searchList = listTampil;
      // console.log('SAMPAH 1: ', detail);
      // console.log('SAMPAH 2: ', searchList);
      this.canBeAdd();
      this.canBeScan();

      // ELEMENT SUDAH DI SIMPAN DI FOUND
      found = searchList.find(function (element) {
        return element.rcvd_procode === tempProcod;
      });

      // console.log('FOUND ISINYA: ', found.batch[0].rcvd_procode === '');

      if (found === undefined) {
        found = detail.find(function (element) {
          return element.rcvd_procode === tempProcod;
        });
      }
      //   if (found.batch)

      found = { ...found };
      //   console.log('INI FOUND APALAGI: ', found);

      //BATCH
      if (found === undefined) {
        this.showNotification('Procod tidak ada di daftar PO', 'error');
        //   } else if (found.batch[0].rcvd_procode === '') {
        //     var batch = [found['batch'][0]];

        //     var object = { ...batch[0], rcvd_quantityrecv: 0 };
        //     // var object = { ...batch[0], "rcvd_quantityrecv": 1 };
        //     batch[0] = { ...object };
        //     found = { ...found, batch: [...batch] };

        //     var setCurrProd = { ...found };
        //     console.log('SET CUPROD', setCurrProd);
        //     // delete setCurrProd.rcvd_nobatch;
        //     // delete setCurrProd.rcvd_norecv;
        //     // delete setCurrProd.rcvd_passIc;
        //     // delete setCurrProd.rcvd_quantitysellunitpo;
        //     // delete setCurrProd.rcvd_quantitytotal;
        //     // delete setCurrProd.rcvd_quantitybonuspo;
        //     // delete setCurrProd.rcvd_sellunit;
        //     // delete setCurrProd.rcvd_sellpack;

        //     this.setState({
        //       realCurrProcod: tempProcod,
        //       currProd: setCurrProd,
        //       lastBatch: { ...found['batch'][0] },
        //       showField: true,
        //     });
      } else {
        var batch = [...found['batch']];
        console.log(
          'MASUK KARNA PROCOD ADA',
          realCurrProcod !== tempProcod && found['batch'].length > 1,
        );

        if (realCurrProcod !== tempProcod && found['batch'].length > 1) {
          console.log(
            'MASUK KARNA length lebih dari 1',
            realCurrProcod !== tempProcod && found['batch'].length > 1,
          );
          //PROCOD BEDA, MULTIPLE BATCH
          var object = [];
          for (let i = 0; i < batch.length; i++) {
            object.push({ ...batch[i] });
          }
          var batch = [...object];
          found = { ...found, batch: [...batch] };

          //toggle("chooseBatch")
          this.setState(
            {
              realCurrProcod: tempProcod,
              modal_chooseBatch: true,
              found: { ...found },
              currProd: { ...found },
              lastBatch: { ...found['batch'][found['batch'].length - 1] },
            },
            () => console.log('ISI LAST BATCH ENTER', this.state.lastBatch),
          );
          return;
        } else {
          // console.log('MASUK KARNA length lebih dari 1 a');
          if (found.rcvd_passIc !== '') {
            // console.log('MASUK KARNA length lebih dari 1 b');
            this.toggle.bind(event, 'nested_parent_scan');
          } else {
            // console.log('MASUK KARNA length lebih dari 1 c');
            if (realCurrProcod !== tempProcod) {
              // console.log('MASUK KARNA length lebih dari 1 d');
              //PROCOD FIRST INPUT
              //   if (
              //     found['batch'][0]['rcvd_quantityrecv'] === 0 ||
              //     found['batch'][0]['rcvd_quantityrecv'] === ''
              //   ) {
              //     console.log(
              //         'MASUK KARNA length lebih dari 1 e'
              //       );
              //     var object = { ...batch[0], rcvd_quantityrecv: 0 };
              //     // var object = { ...batch[0], "rcvd_quantityrecv": 1 };
              //     batch[0] = { ...object };
              //     found = { ...found, batch: [...batch] };

              //     var setCurrProd = { ...found };

              //     this.setState({
              //       realCurrProcod: tempProcod,
              //       currProd: setCurrProd,
              //       lastBatch: { ...found['batch'][0] },
              //       showField: true,
              //     });
              //   } else {
              // console.log('MASUK KARNA length lebih dari 1 f');
              //PROCOD SUDAH PERNAH INPUT TAPI CUMAN 1 BATCH
              var quantity = found['batch'][0]['rcvd_quantityrecv'];
              if (found['batch'][0]['rcvd_quantityrecv'] <= quantity + 1) {
                // console.log('MASUK KARNA length lebih dari 1 g');
                var object = { ...batch[0], rcvd_quantityrecv: quantity + 0 };
                // var object = { ...batch[0], "rcvd_quantityrecv": quantity + 1 };

                batch[0] = { ...object };
                found = { ...found, batch: [...batch] };
                var setCurrProd = { ...found };
                this.setState({
                  realCurrProcod: tempProcod,
                  currProd: setCurrProd,
                  lastBatch: {
                    ...setCurrProd['batch'][setCurrProd['batch'].length - 1],
                  },
                  showField: true,
                });
              } else {
                // console.log('MASUK KARNA length lebih dari 1 h');
                alert('offside2');
              }
              // console.log('MASUK KARNA length lebih dari 1 i');
              // var quantity = found['batch'][0]['rcvd_quantityrecv'];
              // var object = { ...batch[0], rcvd_quantityrecv: quantity + 0 };
              // batch[0] = { ...object };
              // found = { ...found, batch: [...batch] };
              // var setCurrProd = { ...found };
              // this.setState({
              //   realCurrProcod: tempProcod,
              //   currProd: setCurrProd,
              //   lastBatch: {
              //     ...setCurrProd['batch'][setCurrProd['batch'].length - 1],
              //   },
              //   showField: true,
              // });
              //   }
              // console.log('MASUK KARNA length lebih dari 1 j');
            } else {
              // console.log('MASUK KARNA length lebih dari 1 k');
              //SAME PROCOD MULTIPLE BATCH INPUT
              var setCurrProd = { ...currProd };
              if (this.scanValidation({ ...setCurrProd })) {
                // console.log('MASUK KARNA length lebih dari 1 l');
                //scanValidation( setCurrProd["batch"])
                // console.log("TEST INPUT", this.state.lastBatch["rcvd_quantityrecv"]);
                setCurrProd['batch'][id]['rcvd_quantityrecv'] =
                  this.state.lastBatch['rcvd_quantityrecv'] + 1;

                this.setState({
                  currProd: { ...setCurrProd },
                  lastBatch: {
                    ...setCurrProd['batch'][setCurrProd['batch'].length - 1],
                  },
                });
              } else {
                // console.log('MASUK KARNA length lebih dari 1 m');
                this.showNotification('QTY Recv sudah sama dengan QTY PO');
              }
              // console.log('MASUK KARNA length lebih dari 1 n');
            }
          }
          // console.log('MASUK KARNA length lebih dari 1 o');
          this.setState({ show: true });
        }
      }
    } else if (
      event.key === 'Enter' &&
      event.target.value.trim().length === 0
    ) {
      // console.log('MASUK KARNA length lebih dari 1 p');
      alert('Procod Tidak Boleh Kosong');
    }
  };

  chooseBatch = event => {
    var { found, selectedID } = this.state;
    var id = selectedID;

    if (selectedID === -1) {
      this.setState(
        {
          currProd: { ...found },
          modal_chooseBatch: false,
          found: {},
          selectedID: -1,
        },
        () => this.addBatch(1),
      );
    } else {
      this.setState({
        id: selectedID,
        modal_chooseBatch: false,
        found: {},
      });
      var setCurrProd = { ...found };
      if (this.scanValidation({ ...found })) {
        //scanValidation( setCurrProd["batch"])
        setCurrProd['batch'][id]['rcvd_quantityrecv'] =
          parseInt(setCurrProd['batch'][id]['rcvd_quantityrecv']) + 1;
        this.setState({
          currProd: { ...setCurrProd },
          lastBatch: {
            ...setCurrProd['batch'][setCurrProd['batch'].length - 1],
          },
        });
      } else {
        alert('qty recv sudah sama dengan qty PO');
      }
    }
  };

  state = {
    addList: {},
  };

  addBatch(flag = null) {
    var { currProd } = this.state;
    // console.log('ISI DATA 1: ', data1);

    console.log('ISI CURRPROD', this.state.currProd.batch);

    var x = document.getElementById('buttonAdd');
    if (x.hidden === true) {
      x.hidden = false;
    }

    //ELEMENT SUDAH DI SIMPAN DI FOUND

    var newCurrProd = currProd.batch;

    var newList = {};
    newCurrProd.push(newList);

    var setCurrProd = currProd;
    console.log('ISI SETCURRPROD: ', setCurrProd['batch']);

    this.setState(
      {
        currProd: setCurrProd,
        // lastBatch: { ...setCurrProd['batch'][setCurrProd['batch'].length - 1] },
        id: setCurrProd['batch'].length - 1,
      },
      () =>
        this.setState(
          {
            lastBatch: {
              rcvd_ed: '',
              rcvd_nobatch: '',
              rcvd_quantityrecv: '',
              rcvd_quantitybonus: '',
            },
          },
          () => console.log('LAST BATCH ISINYA: ', this.state.currProd),
          this.canBeAdd(),
          this.canBeScan(),
        ),
    );
  }

  scanValidation(obj1 = null) {
    var obj = obj1['batch'];

    var objQtyRecv = obj.map(function (batch) {
      return batch.rcvd_quantityrecv;
    });
    // Result: [154, 110, 156]
    var totalQtyRecv = objQtyRecv.reduce(function (acc, score) {
      return acc + score;
    }, 0);

    if (!obj || parseInt(totalQtyRecv) + 1 > parseInt(obj1.rcvd_quantitypo)) {
      return false;
    } else {
      return true;
    }
  }

  validateTgl(value, field, arrayName, type) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    var d1 = Date.parse(value);
    var d2 = Date.parse(today);

    switch (type) {
      case 'header':
        // console.log('TANGGALNYA ADALAH HEADER: ', value);
        if (d1 > d2) {
          this.updateObjectValue(today, field, arrayName);
          this.showNotification(
            'Tanggal tidak boleh melebihi dari tanggal hari ini!',
            'error',
          );
        } else {
          this.updateObjectValue(value, field, arrayName);
        }
        break;

      case 'detail':
        // console.log('TANGGALNYA ADALAH DETAIL: ', value);
        if (d1 < d2) {
          this.updateArrayObjectValue(value, field, arrayName);
          this.updateObjectValue(value, field, 'lastBatch');
          this.showNotification(
            'Tanggal tidak boleh kurang dari tanggal hari ini!',
            'error',
          );
        } else {
          this.updateArrayObjectValue(value, field, arrayName);
          this.updateObjectValue(value, field, 'lastBatch');
        }
        break;

      default:
        break;
    }
  }

  validateTglReturnBool(value, field, arrayName, type) {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    var d1 = Date.parse(value);
    var d2 = Date.parse(today);

    switch (type) {
      case 'header':
        if (d1 > d2) {
          this.updateObjectValue(today, field, arrayName);
          this.showNotification(
            'Tanggal tidak boleh melebihi dari tanggal hari ini!',
            'error',
          );
          return false;
        } else {
          this.updateObjectValue(value, field, arrayName);
          return true;
        }

      case 'detail':
        if (d1 < d2) {
          // this.updateArrayObjectValue(value, field, arrayName);
          // this.updateObjectValue(value, field, "lastBatch");
          this.showNotification(
            'Tanggal tidak boleh kurang dari tanggal hari ini!',
            'error',
          );
          return false;
        } else {
          // this.updateArrayObjectValue(value, field, arrayName);
          this.updateObjectValue(value, field, 'lastBatch');
          return true;
        }

      default:
        break;
    }
  }

  updateFakturSupplier(value) {
    var { headerPO } = this.state;
    if (headerPO['rcvh_nofaktur'] === headerPO['rcvh_nodo']) {
      this.updateObjectValue(value, 'rcvh_nofaktur', 'headerPO');
      this.updateObjectValue(value, 'rcvh_nodo', 'headerPO');
      // var today = new Date();
      // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    } else {
      this.updateObjectValue(value, 'rcvh_nofaktur', 'headerPO');
    }
  }

  setDate(efDate) {
    var tglEfektifYear = efDate.substring(0, 4);
    var tglEfektifMonth = efDate.substring(5, 7);
    var tglEfektifDate = efDate.substring(8, 10);
    var tglEfektif =
      tglEfektifYear + '-' + tglEfektifMonth + '-' + tglEfektifDate;
    return tglEfektif;
  }

  showSupplier = (no = '', name = '') => {
    return no + ' - ' + name;
  };

  scanTF = event => {
    // true untuk manual, false untuk login
    if (true) {
      this.setState({ show: true, currProd: {} });
    } else {
      this.toggle.bind(event, 'nested_parent_scan');
    }
  };

  closeScan = () => {
    this.setState({
      show: false,
      // currProd: {},
      lastBatch: {
        rcvd_ed: '',
        rcvd_quantityrecv: '',
        rcvd_quantitybonus: '',
        rcvd_nobatch: '',
      },
      realCurrProcod: '',
      currProcod: '',
      isScan: false,
      isAdding: true,
    });
    var displayReceivingBottom = document.getElementById('receivingBottom');
    displayReceivingBottom.style.display = 'block';
    this.componentDidMount();
  };

  formatTabel(detail) {
    if (detail.batch.length > 1) {
      var objBatchRecv = detail.batch.map(function (batch) {
        return batch.rcvd_nobatch + '(' + batch.rcvd_quantityrecv + ')';
      });
      // Result: [154(2), 110(3), 156(4)]
      detail['rcvd_nobatch'] = objBatchRecv.join();

      var objQtyRecv = detail.batch.map(function (batch) {
        return batch.rcvd_quantityrecv;
      });
      detail['rcvd_quantityrecv'] = objQtyRecv.reduce(function (acc, score) {
        return acc + score;
      }, 0);
    } else {
      detail['rcvd_nobatch'] = detail.batch[0]['rcvd_nobatch'];
      detail['rcvd_quantityrecv'] = detail.batch[0]['rcvd_quantityrecv'];
    }
    return detail;
  }

  isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) return false;
    }
    return true;
  }

  handleClose = () => {
    this.setState({ inputtedName: '' });
  };

  convertDateToString(obj) {
    var dateString = obj.toString();
    return dateString;
  }

  myFunction = event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      return false;
    }
  };

  printReceiving() {
    this.setState({ buttonPrint: 'none', tooltiPrint: 'none' }, () =>
      window.print(),
    );

    setInterval(() => {
      if (this.state.buttonPrint === 'none') {
        this.setState({ buttonPrint: 'block', tooltiPrint: 'block' });
      }
    }, 3000);
  }

  render() {
    const {
      loading,
      show,
      noPO,
      headerPO,
      currProd,
      currProcod,
      lastBatch,
      listTampil,
      firstLoad,
    } = this.state;
    const { group } = this.props.location.state;
    var x = document.getElementById('receivingUpper');
    var y = document.getElementById('receivingBottom');
    var lastindex = 0;
    const isEnabled = this.canBeSubmitted();
    const isSave = this.canBeSave();
    var currentTodos = listTampil;

    if (currentTodos === null) {
      return null;
    }

    if (currentTodos.length > 0) {
      if (x.style.display === 'none' && y.style.display === 'none') {
        x.style.display = 'block';
        y.style.display = 'block';
      }
    }

    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        !firstLoad && this.formatTabel(todo);

        return (
          <tr key={i}>
            {true && (
              <th style={{ width: '15%', textAlign: 'center' }} scope="row">
                <Label> {todo.rcvd_procode}</Label>
              </th>
            )}
            <td style={{ width: '45%', textAlign: 'left' }}>
              {todo.rcvd_proname}
            </td>
            <td style={{ width: '15%', textAlign: 'right' }}>
              {todo.rcvd_quantitypo}
            </td>
            <td style={{ width: '15%', textAlign: 'right' }}>
              {todo.rcvd_quantitybonuspo}
            </td>
            <td style={{ width: '15%', textAlign: 'right' }}>
              {todo.rcvd_quantityrecv}
            </td>
            <td style={{ width: '15%', textAlign: 'right' }}>
              {todo.rcvd_quantitybonus}
            </td>
            <td style={{ width: '15%', textAlign: 'left' }}>
              {todo.rcvd_buypack}
            </td>
            <td style={{ width: '15%', textAlign: 'right' }}>
              {todo.rcvd_sellunit}
            </td>
            <td style={{ width: '15%', textAlign: 'left' }}>
              {todo.rcvd_nobatch}
            </td>
          </tr>
        );
      });

    return (
      <Page className="ReceivingHPage">
        <Row>
          <Col>
            <NotificationSystem
              dismissible={false}
              ref={notificationSystem =>
                (this.notificationSystem = notificationSystem)
              }
              style={NOTIFICATION_SYSTEM_STYLE}
            />

            <Card style={{ marginBottom: '1%' }}>
              <CardHeader id="scanNoPO" style={{ display: 'block' }}>
                <Form inline>
                  <Label
                    style={{
                      fontWeight: 'bold',
                      marginRight: '9.5%',
                      marginLeft: '0.5%',
                    }}
                  >
                    NO PO
                  </Label>
                  <Input
                    type="search"
                    className="text-left"
                    style={{ width: '20%' }}
                    disabled={listTampil.length > 0 ? true : false}
                    value={headerPO && headerPO.rcvh_nopo}
                    onChange={this.updateInputValue('noPO')}
                    onKeyPress={this.myFunction}
                  >
                    {/* {console.log("CEK LIST TAMPIL", listTampil)} */}
                  </Input>
                  <Button
                    disabled={
                      noPO === '' || listTampil.length > 0 ? true : false
                    }
                    onClick={() => this.getPO(noPO, group)}
                    style={{ marginLeft: '0.25%' }}
                  >
                    <MdSearch />
                  </Button>
                  {/* <Button onClick={this.myFunction} style={{ marginLeft: '0.25%' }}><MdSearch /></Button> */}
                </Form>
              </CardHeader>
              <CardHeader>
                <Row>
                  <Col
                    style={{
                      textAlign: 'center',
                      marginBottom: 0,
                      paddingBottom: 0,
                    }}
                  >
                    <Label
                      style={{
                        textAlign: 'center',
                        marginTop: '8px',
                        fontWeight: 'bold',
                        fontSize: '1.5em',
                      }}
                    >
                      Receive Note
                    </Label>
                  </Col>
                </Row>
              </CardHeader>
              <CardHeader>
                <FormGroup>
                  <CardBody id="receivingUpper" style={{ display: 'none' }}>
                    <Row md="1" sm="3" xs="3" style={{ marginBottom: '10px' }}>
                      <Label
                        className="text-left"
                        style={{ width: '15%', fontWeight: 'bold' }}
                      >
                        NO RECV
                      </Label>
                      <Input
                        disabled={true}
                        value={
                          headerPO && headerPO.rcvh_norecv
                            ? headerPO.rcvh_norecv
                            : null
                        }
                        className="text-left"
                        style={{ width: '20%' }}
                      ></Input>
                      <Label
                        className="text-left"
                        style={{
                          width: '13%',
                          fontWeight: 'bold',
                          marginLeft: '1%',
                        }}
                      >
                        TGL RECEIVE
                      </Label>
                      <Input
                        style={{ width: '20%' }}
                        disabled={listTampil.length > 0 ? true : false}
                        value={new Date(
                          headerPO && headerPO.rcvh_tglrecv,
                        ).toDateString()}
                        onChange={this.updateInputValue('noPO')}
                        onKeyPress={this.myFunction}
                      ></Input>
                      <Label
                        className="text-left"
                        style={{
                          width: '10%',
                          fontWeight: 'bold',
                          marginLeft: '1%',
                        }}
                      >
                        NO PO
                      </Label>
                      <Input
                        style={{ width: '20%' }}
                        disabled={listTampil.length > 0 ? true : false}
                        value={
                          headerPO && headerPO.rcvh_nopo
                            ? headerPO.rcvh_nopo
                            : null
                        }
                        onChange={this.updateInputValue('noPO')}
                        onKeyPress={this.myFunction}
                      ></Input>
                    </Row>

                    <Row md="2" sm="6" xs="6" style={{ marginBottom: '10px' }}>
                      <Label
                        className="text-left"
                        style={{ width: '15%', fontWeight: 'bold' }}
                      >
                        SUPPLIER
                      </Label>
                      <Input
                        className="text-left"
                        disabled={true}
                        style={{ width: '85%' }}
                        value={
                          headerPO &&
                          this.showSupplier(
                            headerPO.rcvh_nosup,
                            headerPO.rcvh_suppliername,
                          )
                        }
                      ></Input>
                    </Row>
                    <Row md="1" sm="3" xs="3" style={{ marginBottom: '10px' }}>
                      <Label
                        className="text-left"
                        style={{ width: '15%', fontWeight: 'bold' }}
                      >
                        FAKTUR SUPPLIER
                      </Label>
                      <Input
                        disabled
                        type="input"
                        className="text-left"
                        style={{ width: '20%' }}
                        value={headerPO && headerPO.rcvh_nofaktur}
                        onChange={event =>
                          this.updateFakturSupplier(event.target.value)
                        }
                      ></Input>
                      <Label
                        className="text-left"
                        style={{ width: '35%' }}
                      ></Label>
                      <Label
                        className="text-left"
                        style={{ width: '10%', fontWeight: 'bold' }}
                      >
                        TGL FAKTUR
                      </Label>
                      <Input
                        disabled
                        className="text-left"
                        style={{ width: '20%' }}
                        value={new Date(
                          headerPO && headerPO.rcvh_tglfaktur,
                        ).toDateString()}
                        onChange={event =>
                          this.validateTgl(
                            event.target.value,
                            'rcvh_tglfaktur',
                            'headerPO',
                            'header',
                          )
                        }
                      ></Input>
                    </Row>

                    <Row md="1" sm="3" xs="3" style={{ marginBottom: '10px' }}>
                      <Label
                        className="text-left"
                        style={{ width: '15%', fontWeight: 'bold' }}
                      >
                        SURAT JALAN
                      </Label>
                      <Input
                        type="input"
                        disabled
                        className="text-left"
                        style={{ width: '20%' }}
                        value={headerPO && headerPO.rcvh_nodo}
                        onChange={event =>
                          this.updateObjectValue(
                            event.target.value,
                            'rcvh_nodo',
                            'headerPO',
                          )
                        }
                      ></Input>
                      <Label
                        className="text-left"
                        style={{ width: '35%' }}
                      ></Label>
                      <Label
                        className="text-left"
                        style={{ width: '10%', fontWeight: 'bold' }}
                      >
                        TGL SURAT
                      </Label>
                      {/* {console.log(
                        'TANGGALNYA?: ',
                        headerPO && headerPO.rcvh_tgldo,
                      )} */}
                      <Input
                        disabled
                        className="text-left"
                        style={{ width: '20%' }}
                        value={new Date(
                          headerPO && headerPO.rcvh_tgldo,
                        ).toDateString()}
                        onChange={event =>
                          this.validateTgl(
                            event.target.value,
                            'rcvh_tgldo',
                            'headerPO',
                            'header',
                          )
                        }
                      ></Input>
                    </Row>
                    <Row
                      md="1"
                      sm="3"
                      xs="3"
                      style={{ alignContent: 'center' }}
                    >
                      <Label
                        className="text-left"
                        style={{ width: '15%', fontWeight: 'bold' }}
                      >
                        CEK FISIK(NIP)
                      </Label>
                      <Input
                        className="text-left"
                        disabled
                        style={{ width: '20%', textAlign: 'center' }}
                        value={headerPO && headerPO.rcvh_niprecv}
                      ></Input>
                      <Label
                        style={{
                          width: '17%',
                          fontWeight: 'bold',
                          marginLeft: '1%',
                          textAlign: 'left',
                        }}
                      >
                        NAMA KARYAWAN
                      </Label>
                      <Input
                        className="text-left"
                        disabled={true}
                        style={{ width: '47%' }}
                        value={
                          this.state.namaKaryawan === '' &&
                          this.state.loadingKaryawan === true
                            ? 'Sedang mengambil data...'
                            : this.state.namaKaryawan
                        }
                      />
                    </Row>
                  </CardBody>
                </FormGroup>
              </CardHeader>
            </Card>
            {show && (
              <Card style={{ marginBottom: '1%' }}>
                <CardHeader>
                  <CardBody>
                    <FormGroup>
                      <Row md="1" sm="3" xs="3">
                        <Label style={{ fontWeight: 'bold' }}>PROCOD</Label>
                        <Input
                          disabled={currProd.rcvd_proname !== undefined}
                          type="search"
                          id="procod"
                          onKeyPress={this.scanProcod}
                          autoComplete="off"
                          onChange={this.updateInputValue('currProcod')}
                          value={currProcod}
                          style={{ width: '10%', marginLeft: '1%' }}
                        ></Input>
                        <Label
                          style={{
                            fontWeight: 'bold',
                            marginLeft: '5%',
                            marginRight: '1%',
                          }}
                        >
                          PRODES
                        </Label>
                        <Input
                          style={{ width: '25%' }}
                          disabled={true}
                          value={
                            !this.isEmpty(currProd) && currProd.rcvd_proname
                              ? currProd.rcvd_proname
                              : null
                          }
                        ></Input>

                        <Label
                          style={{
                            color: 'red',
                            fontWeight: 'bold',
                            marginLeft: '7%',
                            marginRight: '1%',
                          }}
                        >
                          QTY P.O
                        </Label>
                        <Input
                          value={
                            !this.isEmpty(currProd) && currProd.rcvd_quantitypo
                              ? currProd.rcvd_quantitypo
                              : null
                          }
                          style={{ width: '5%', textAlign: 'right' }}
                          autoComplete="off"
                          disabled
                        ></Input>
                        <Label
                          style={{
                            color: 'red',
                            fontWeight: 'bold',
                            marginLeft: '3%',
                            marginRight: '1%',
                          }}
                        >
                          QTY P.O BONUS
                        </Label>
                        <Input
                          value={currProd.rcvd_quantitybonuspo}
                          // value={
                          //   !this.isEmpty(currProd) &&
                          //   currProd.rcvd_quantitybonuspo
                          //     ? currProd.rcvd_quantitybonuspo
                          //     : null
                          // }
                          disabled={true}
                          style={{ width: '5%', textAlign: 'right' }}
                          autoComplete="off"
                        ></Input>
                      </Row>
                    </FormGroup>
                    <FormGroup>
                      {/* BARU */}
                      <Table responsive striped>
                        <thead>
                          <tr>
                            <th></th>
                            <th>E.D</th>
                            <th>Batch</th>
                            <th>Qty Recv</th>
                            <th>Qty Recv Bonus</th>
                            <th></th>
                            {/* <th style={{}}></th> */}
                          </tr>
                        </thead>
                        <tbody>
                          <tr id="buttonAdd" hidden>
                            <td style={{ textAlign: 'center' }}>
                              <Input
                                style={{
                                  textAlign: 'center',
                                  margin: '0',
                                  display: 'inline-block',
                                  padding: '10px',
                                  position: 'relative',
                                }}
                                name="index"
                                type="radio"
                                defaultChecked={true}
                                onClick={this.updateInputValue('id')}
                                value={lastindex}
                                autoComplete="off"
                              ></Input>
                            </td>

                            <td>
                              <Input
                                type="date"
                                pattern="\d{4}-\d{2}-\d{2}"
                                className="text-left"
                                onChange={event =>
                                  this.updateObjectValue(
                                    event.target.value,
                                    'rcvd_ed',
                                    'lastBatch',
                                  )
                                }
                                id="rcvd_ed"
                                value={this.convertDateToString(
                                  lastBatch['rcvd_ed'],
                                )}
                                style={{ marginRight: '1%' }}
                                autoComplete="off"
                              ></Input>
                            </td>
                            <td>
                              <Input
                                type="input"
                                autocomplete="off"
                                className="text-left"
                                onChange={event =>
                                  this.updateObjectValue(
                                    event.target.value,
                                    'rcvd_nobatch',
                                    'lastBatch',
                                  )
                                }
                                value={lastBatch['rcvd_nobatch']}
                                id="rcvd_nobatch"
                                style={{ marginRight: '1%' }}
                                autoComplete="off"
                              ></Input>
                            </td>
                            <td>
                              <Input
                                type="input"
                                autocomplete="off"
                                style={{ textAlign: 'right' }}
                                id="rcvd_quantityrecv"
                                onChange={event => {
                                  this.updateObjectValue(
                                    event.target.value,
                                    'rcvd_quantityrecv',
                                    'lastBatch',
                                  );
                                }}
                                value={lastBatch['rcvd_quantityrecv']}
                                autoComplete="off"
                              ></Input>
                            </td>
                            <td>
                              <Input
                                type="input"
                                autocomplete="off"
                                id="rcvd_quantitybonus"
                                value={lastBatch['rcvd_quantitybonus']}
                                style={{ textAlign: 'right' }}
                                onChange={event => {
                                  this.updateObjectValue(
                                    event.target.value,
                                    'rcvd_quantitybonus',
                                    'lastBatch',
                                  );
                                }}
                              ></Input>
                            </td>
                            <td>
                              <Button
                                name="indexButton"
                                type="checbuttkbox"
                                value={lastindex}
                                color="info"
                                onClick={this.saveBatchUpdate(
                                  { ...currProd },
                                  lastindex,
                                )}
                                disabled={!isSave}
                              >
                                <MdSave />
                              </Button>
                              {/* ini button yang harus di validasi */}
                            </td>
                          </tr>
                          {/* }         */}
                        </tbody>
                      </Table>
                      {/* BARU */}
                    </FormGroup>
                    <Row style={{ marginTop: '1%' }}>
                      <Col>
                        <Button
                          id="buttonAddBatchProcod"
                          style={{ width: '10%' }}
                          onClick={e => this.addBatch()}
                          disabled={this.state.isAdding}
                        >
                          Tambah
                        </Button>
                        <Button
                          style={{ marginLeft: '10px', width: '15%' }}
                          onClick={this.closeScan}
                        >
                          Selesai Scan
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </CardHeader>
              </Card>
            )}

            <Card
              id="receivingBottom"
              className="mb-3"
              style={{ display: 'none' }}
            >
              <CardBody>
                <Table responsive striped>
                  <thead>
                    {
                      <tr>
                        <th style={{ width: '15%', textAlign: 'center' }}>
                          Procod
                        </th>
                        <th style={{ width: '45%', textAlign: 'left' }}>
                          Prodes
                        </th>
                        <th style={{ width: '15%', textAlign: 'right' }}>
                          Qty PO
                        </th>
                        <th style={{ width: '15%', textAlign: 'right' }}>
                          Qty Bonus PO
                        </th>
                        <th style={{ width: '15%', textAlign: 'right' }}>
                          Qty Recv
                        </th>
                        <th style={{ width: '15%', textAlign: 'right' }}>
                          Qty Bonus
                        </th>
                        <th style={{ width: '15%', textAlign: 'left' }}>
                          Buypack
                        </th>
                        <th style={{ width: '15%', textAlign: 'right' }}>
                          Sellunit
                        </th>
                        <th style={{ width: '15%', textAlign: 'left' }}>
                          Batch
                        </th>
                        {/* <th style={{ width: '15%' }} >E.D</th> */}
                      </tr>
                    }
                  </thead>
                  <tbody>
                    {renderTodos}
                    {!currentTodos && (
                      <tr>
                        <td
                          style={{ backgroundColor: 'white' }}
                          colSpan="11"
                          className="text-center"
                        >
                          TIDAK ADA DATA
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
              {/* <CardBody> */}
              <Card>
                <CardBody>
                  <Button
                    id="print"
                    style={{
                      float: 'left',
                      textAlign: 'center',
                      width: '10%',
                      display: this.state.buttonPrint,
                    }}
                    onClick={this.changePageState('HEADER')}
                  >
                    Kembali
                  </Button>
                  <Label
                    placement="bottom"
                    id="tooltipPrint"
                    isOpen={this.state.resetInfo}
                    style={{
                      display: this.state.tooltiPrint,
                      textAlign: 'right',
                      fontSize: '0.7em',
                      color: 'red',
                    }}
                    target="print"
                    toggle={() =>
                      this.setState({ resetInfo: !this.state.resetInfo })
                    }
                  >
                    *Button print akan menyala ketika Nama Karyawan sudah
                    ter-load
                  </Label>
                  <Button
                    id="print"
                    disabled={this.state.disabledPrint}
                    style={{
                      float: 'right',
                      textAlign: 'center',
                      width: '10%',
                      display: this.state.buttonPrint,
                    }}
                    onClick={() => this.printReceiving()}
                  >
                    <MdPrint />
                    Print
                  </Button>
                </CardBody>
              </Card>
            </Card>

            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested_parent_scan}
              toggle={this.toggle('nested_parent_scan')}
              size={'sm'}
              className={this.props.className}
            >
              {/* Modal Tambah*/}
              <ModalHeader toggle={this.toggle('nested_parent_scan')}>
                Password IC
              </ModalHeader>
              <ModalBody style={{ textAlign: 'center' }}>
                {/*value = localStorage   dari DATA SCAN*/}
                <FormGroup>
                  <Label>USER ID</Label>
                  <Input
                    style={{ height: '50px', width: '100px' }}
                    autoComplete="off"
                    onChange={this.updateInputValue('userID')}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>PASSWORD</Label>
                  <Input
                    style={{ height: '50px', width: '100px' }}
                    autoComplete="off"
                    onChange={this.updateInputValue('passwordIC')}
                  />
                </FormGroup>
                {/* <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label> */}
              </ModalBody>
              <ModalFooter>
                <Button
                  disabled={!isEnabled}
                  color="primary"
                  onClick={this.passwordIC}
                >
                  Login
                </Button>
                <Button
                  color="secondary"
                  onClick={this.toggle('nested_parent_scan')}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>

            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_qty}
              toggle={this.toggle('qty')}
              size={'sm'}
              className={this.props.className}
            >
              {/* Modal Tambah*/}
              <ModalHeader toggle={this.toggle('qty')}>Password IC</ModalHeader>
              <ModalBody style={{ textAlign: 'center' }}>
                <FormGroup>
                  <Label>USER ID</Label>
                  <Input
                    style={{ height: '50px', width: '100px' }}
                    autoComplete="off"
                    onChange={this.updateInputValue('')}
                  />
                </FormGroup>
                {/* <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label> */}
              </ModalBody>
              <ModalFooter>
                <Button
                  disabled={!isEnabled}
                  color="primary"
                  onClick={this.passwordIC}
                >
                  Login
                </Button>
                <Button
                  color="secondary"
                  onClick={this.toggle('nested_parent_scan')}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Modal>
          </Col>
        </Row>
      </Page>
    );
  }

  canBeSubmitted() {
    const { barcode } = this.state;
    return barcode.length > 0 && barcode.trim() !== '';
  }

  canBeScan() {
    var listTampil = this.state.listTampil;
    var currProd = this.state.currProd;
    var displayReceivingBottom = document.getElementById('receivingBottom');
    if (listTampil === null || listTampil === 0 || currProd === undefined) {
      this.setState({ isScan: false });
      displayReceivingBottom.style.display = 'block';
    } else {
      this.setState({ isScan: true });
      displayReceivingBottom.style.display = 'none';
    }
  }

  canBeAdd() {
    var currProd = this.state.currProd;
    // console.log('MASUK CURRPROD', currProd);
    if (!currProd.batch) {
      // console.log('MASUK IF');
      this.setState({ isAdding: false, isScan: true });
    } else {
      // console.log(
      //   'MASUK ELSE',
      //   currProd.rcvd_proname === undefined || this.state.currProcod === '',
      // );
      var lastindex = parseInt(
        currProd['batch'].length - 1 < 0 ? 0 : currProd['batch'].length - 1,
      );

      if (currProd.rcvd_proname === undefined || this.state.currProcod === '') {
        // console.log('MASUK IF DALAM ELSE');
        this.setState({ isAdding: true, isScan: true });
      } else if (this.isEmpty(currProd.batch[lastindex])) {
        // console.log('MASUK ELSE IF');
        this.setState({ isAdding: true, isScan: true });
      } else {
        // console.log('MASUK ELSE 2');
        this.setState({ isAdding: true, isScan: true });
      }
    }
  }

  canBeSave() {
    const { lastBatch } = this.state;
    return (
      lastBatch['rcvd_nobatch'].length !== 0 &&
      lastBatch['rcvd_ed'].length !== 0 &&
      lastBatch['rcvd_quantityrecv'].length !== 0 &&
      lastBatch['rcvd_quantitybonus'].length !== 0
    );
  }

  canBeSubmittedConfirm() {
    var { headerPO, listTampil, firstLoad, namaKaryawan } = this.state;
    var tanggalFaktur = headerPO && headerPO.rcvh_tglfaktur;
    var tanggalSurat = headerPO && headerPO.rcvh_tgldo;
    if (tanggalSurat === undefined && tanggalFaktur === undefined) {
      return;
    }
    if (listTampil === null || listTampil === undefined) {
      return;
    }

    var batch = listTampil[0] && listTampil[0].batch[0].rcvd_nobatch;

    if (
      headerPO !== undefined &&
      listTampil !== undefined &&
      listTampil !== null &&
      headerPO.rcvh_tgldo !== '' &&
      headerPO.rcvh_tglfaktur !== '' &&
      headerPO.rcvh_nodo !== '' &&
      headerPO.rcvh_nofaktur !== '' &&
      headerPO.rcvh_niprecv !== '' &&
      batch !== '' &&
      firstLoad === false &&
      namaKaryawan !== '' &&
      !tanggalFaktur.includes('Z') &&
      !tanggalSurat.includes('Z')
    ) {
      return false;
    } else {
      return true;
    }
  }
}
export default ReceivingPrint;
