var Wallet = {};
var params = {};
var balance = '';

((function() {
  this.init = function() {
    _render.content();


  }
  var activeTabCode = '';

  var hash = '5105085ee3821411ddf09b6a8c0b8011d8e199e96aa738b53eb64b6ff62ddb01';

  var _core = {
    validateAddress: API.validateAddress,
    createWalletWithAddress: API.createWalletWithAddress,
    getCoin_WalletData: API.getCoin_WalletData,
    getAddrBal: API.getAddrBal,
    getAddrFull: API.getAddrFull,
    newTransaction: API.newTransaction,
    getTX: API.getTX,
    getCryptoCurrencyPriceEqNew: API.getCryptoCurrencyPriceEqNew,
    copyText: function() {
      $('#btnCopyaddress').unbind().click(function() {
        var copyText = $("#myAddress").text();
        $("#myAddress").select();
        var isCopied = document.execCommand("copy");
        if (isCopied) {
          alert('Share your address to receive Coins')
        }

      })

    },

    showErrorMsg: function(form, type, msg) {
      var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
        <span></span>\
      </div>');
      form.find('.alert').remove();
      alert.prependTo(form);
      alert.animateClass('fadeIn animated');
      alert.find('span').html(msg);
    }
  }
  var _bind = {
    Wallet: function() {
      //////console.log("Wallet,js wallet()");
      $('#m_datatable_Transaction').mDatatable({
        destroy: true
      })
      var form = $('#walletForm');

      var isToken = GlobalEvent.checkIfToken(headerElms.token)
      if (isToken) {

        _bind.checkDefaultSetting();
        _bind.attachEvent();
        _bind.sendRequest();
        ////console.log(headerElms.BTC_isAddressCreated, headerElms.LTC_isAddressCreated, headerElms.DOGE_isAddressCreated);
        $('#mainTablist li a').unbind().click(function() {
          form.clearForm();


          // _bind.checkDefaultSetting()
          var cryptoCurrency = $(this).text();
          // $('#currencyCodeOption').attr('selected', true)
          $("#currencyCode").val('AED').find("option[value='AED']").attr('selected', true)
          activeTabCode = $(this).attr('data-code');
          var dataObj = {
              coin: activeTabCode,
              hash: '71553a9b79226e8700af047b7992b2cec451f7e64609ca03b586acd5bf33e4c9'
            }
            _core.getTX(headerElms.token, dataObj, function(res) {
              console.log("getTX get chain response==>", res);
            })
          var address = '';
          var varRenderCoinDataSend = '';
          var paramsObj = {};
          params = {
            coin: activeTabCode,
            cryptoCurrency: cryptoCurrency
          }
          var str = activeTabCode + '_isAddressCreated';
          var check_isAddressCreated = localStorage.getItem('' + str)

          if (check_isAddressCreated === 'false') {
            //console.log("mainTab list clicked..", check_isAddressCreated, params);
            _bind.createWalletWithAddress(params)


          } else if (check_isAddressCreated === 'true') {
            //console.log("mainTab list clicked..", check_isAddressCreated);
            _bind.getCoin_WalletData(params)

          }

        })

        $('#txtamontCryptCurrency').change(function() {
          var amtCrytocurrency = $('#txtamontCryptCurrency').val();
          amtCrytocurrency = parseInt(amtCrytocurrency)
          $('#divresultAmt').addClass('m-loader m-loader--info')
          $('#resultAmt').empty();
          if (amtCrytocurrency > 0) {
            $('#amtErrorhint').addClass('hidden')

            _bind.computeAmont(amtCrytocurrency)
          } else {
            $('#amtErrorhint').removeClass('hidden')
              ////console.log("balance is 0");
            $('#resultAmt').empty();
            $('#resultAmt').val('0.000')

            $('#divresultAmt').removeClass('m-loader m-loader--info')

          }
        })
        $('#currencyCode').change(function() {
          var amtCrytocurrency = $('#txtamontCryptCurrency').val();
          amtCrytocurrency = parseInt(amtCrytocurrency)
          $('#divresultAmt').addClass('m-loader m-loader--info')
          $('#resultAmt').empty();
          if (amtCrytocurrency > 0) {
            _bind.computeAmont(amtCrytocurrency)
          } else {
            $('#resultAmt').empty();
            $('#resultAmt').val('0.000')
            $('#divresultAmt').removeClass('m-loader m-loader--info')
          }
        })

      }


    },
    attachEvent: function() {
      $(document).on('click', '#subTablist li a', function() {
        var tabDataRole = $(this).attr('data-role');

        switch (tabDataRole) {

          case 'receive':
            {
              var paramsObj = {};
              $('#m_tabs_3_3').addClass('m-loader m-loader--info')

              _core.getCoin_WalletData(headerElms.token, function(res) {
                if (!res.isError) {
                  ////console.log("getCoin_WalletData response==>", res);
                  var dataRes = res.data[0].wallets;
                  for (var key in dataRes) {
                    if (key.toString() == activeTabCode.toString()) {

                      paramsObj = {
                        cryptoCurrency: params.cryptoCurrency,
                        address: dataRes[key].address,
                        cryptoCurrencyCode: key,
                      }
                      params = paramsObj;
                      _bind.renderCoinDataReceive(params);

                    }
                  }
                }
              });

              break;
            }

          case 'transaction':
            {
              var cryptoCurrency = $('#mainTablist li a.active').text();
              var cryptoCurrencyCode = $('#mainTablist li a.active').attr('data-code');
              // $('#DataTableTransaction').addClass('');

              $('#m_datatable_Transaction').mDatatable().destroy()


              _core.getCoin_WalletData(headerElms.token, function(res) {
                if (!res.isError) {
                  ////console.log("getCoin_WalletData response==>", res);
                  var dataRes = res.data[0].wallets;
                  //console.log("dataRes==>", dataRes);
                  for (var key in dataRes) {
                    if (key.toString() == cryptoCurrencyCode.toString()) {
                      //console.log("key and cryptocurrency code==>", key, cryptoCurrencyCode);

                      if (dataRes[key].isAddressCreated) {
                        var dataObj = {
                          coin: cryptoCurrencyCode,
                          address: dataRes[key].address,
                        }
                        _bind.renderCoinDataTransaction(dataObj, cryptoCurrency)


                      } else {

                      }
                    }
                  }

                }

              });

              break;
            }
          case 'send':
            {

              _bind.renderCoinDataSend(params);

            }
        }

      })
    },
    renderSubTablistData: function(params) {
      //console.log("renderSubTablistData params==>", params);

      _bind.renderCoinDataSend(params);
    },
    sendRequest: function() {
      $('#btn_sendCoins').unbind().click(async function() {
        $(this).addClass('m-loader m-loader--info')
          // var amount = $('#resultAmt').val();
        var amount = $('#txtamontCryptCurrency').val();
        var receiverAddress = $('#receiverAddress').val()
        var form = $('#walletForm');

        var isTXValid = false;
        var isBalanceValid = false;
        isBalanceValid = balance > 0 ? true : false;

        isTXValid = (amount && receiverAddress) ? (amount > 0) ? true : false : false

        if (isBalanceValid) {
          ////console.log(" if isBalanceValid ", isBalanceValid);
          var validateAddressRes = await _bind.validateAddress(receiverAddress)
          if (validateAddressRes && isTXValid) {
            ////console.log("Transaction valid", isTXValid);

            var cryptoCurrencyCode = $('#mainTablist li a.active').attr('data-code');
            var dataObj = {
              coin: cryptoCurrencyCode,
              amount: amount,
              receiverAddress: receiverAddress,
            }

            _core.newTransaction(headerElms.token, dataObj, function(res) {
              if (res) {


                $('#btn_sendCoins').removeClass('m-loader m-loader--info')
                  ////console.log("newTransaction==>", res);

                if (res.isError) {
                  setTimeout(function() {
                    _core.showErrorMsg(form, 'danger', 'Transaction Filed.');

                  }, 2000);
                } else {
                  setTimeout(function() {
                    _core.showErrorMsg(form, 'success', 'Transaction successfull.');

                  }, 2000);
                }


              }
            })

          } else {

            $('#btn_sendCoins').removeClass('m-loader m-loader--info')

            setTimeout(function() {
              _core.showErrorMsg(form, 'danger', 'Transaction is not valid.');
            }, 2000);
          }


        } else {
          ////console.log(" else isBalanceValid ", isBalanceValid);
          $('#btn_sendCoins').removeClass('m-loader m-loader--info')

          setTimeout(function() {
            _core.showErrorMsg(form, 'danger', 'Not enough sendable balance. Try a smaller amount or refill your wallet.');
          }, 2000);
        }
      })

    },
    validateAddress: async function(receiverAddress) {
      var cryptoCurrencyCode = $('#mainTablist li a.active').attr('data-code');

      var dataObj = {
        coin: cryptoCurrencyCode,
        receiverAddress: receiverAddress,
      }
      const res = await _core.validateAddress(dataObj);
      // _core.validateAddress(dataObj, function(res) {
      ////console.log("validateAddress response", res);

      if (!res.isError) {
        return true;
      } else {
        return false;
      }

      // })

    },
    createWalletWithAddress: function(args) {
      //console.log("createWalletWithAddress args==> ", args);
      var coin = args.coin
      var paramsObj = {};
      var dataObj = {
        coin: coin
      }
      _core.createWalletWithAddress(headerElms.token, dataObj, function(res) {
        ////console.log("createWalletWithAddress==>>", res);
        if (res.isError) {
          _bind.getCoin_WalletData(args)

        } else {

          var dataRes = res.data.wallets;

          for (var key in dataRes) {
            if (key.toString() == activeTabCode.toString()) {

              paramsObj = {
                  cryptoCurrency: args.cryptoCurrency,
                  address: dataRes[key].address,
                  cryptoCurrencyCode: key,
                }
                ////console.log("renderCoinData function call from   createWalletWithAddress", r);

              params = paramsObj;
              _bind.renderSubTablistData(params)

            }

          }

        }
      })
    },
    getCoin_WalletData: function(args) {
      ////console.log("getCoin_WalletData args", args);
      var paramsObj = {};
      _core.getCoin_WalletData(headerElms.token, function(res) {
        if (!res.isError) {
          ////console.log("getCoin_WalletData response==>", res);

          var dataRes = res.data[0].wallets;
          for (var key in dataRes) {
            if (key.toString() == args.coin.toString()) {

              paramsObj = {
                cryptoCurrency: args.cryptoCurrency,
                address: dataRes[key].address,
                cryptoCurrencyCode: key,
              }
              params = paramsObj;
              _bind.renderSubTablistData(params)

            }
          }

        }

      });
    },

    checkDefaultSetting: function() {
      var address = '';
      var BTC_isAddressCreatedNew = localStorage.getItem('BTC_isAddressCreated')
      coin = 'BTC';
      cryptoCurrency = 'BitCoin'
      $('#divuserWalletData').addClass('m-loader m-loader--info')
      params = {
        coin: coin,
        cryptoCurrency: cryptoCurrency
      }
      if (BTC_isAddressCreatedNew === 'false') {

        _bind.createWalletWithAddress(params)

      } else if (BTC_isAddressCreatedNew === 'true') {
        _bind.getCoin_WalletData(params)

      }

    },
    renderCoinDataSend: function(args) {
      $('#userWalletData').empty();
      $('.tab-pane').removeClass('active')
      $('#m_tabs_3_1').addClass('active show')
      console.log("renderCoinDataSend params==>", args);
      var dataObj = {
        coin: args.cryptoCurrencyCode,
        address: args.address
      }

      $('#divuserWalletData').addClass('m-loader m-loader--info')

      _core.getAddrBal(headerElms.token, dataObj, function(res) {
        if (res) {
          //console.log("getAddrBal==>", res);

          $('#divuserWalletData').removeClass('m-loader m-loader--info')
          balance = res.balance;
          setUserWalletData(balance)
        }
      })

      var htmlSubTabList = '';
      htmlSubTabList = `
<li class="nav-item">
<a class="nav-link active" data-role="send" data-toggle="tab" href="#m_tabs_3_1">Send` + args.cryptoCurrency + `s </a>
</li>
<li class="nav-item">
<a class="nav-link  " data-role="receive" data-toggle="tab" href="#m_tabs_3_3">Receive` + args.cryptoCurrency + `s </a>
</li>
<li class="nav-item">
<a class="nav-link  "  data-role="transaction" data-toggle="tab" href="#m_tabs_3_4">Transactions</a>
</li>`;
      $('#subTablist').html(htmlSubTabList);

      function setUserWalletData(balance) {

        var htmlUserWalletData = '';
        htmlUserWalletData = `<div class="row">
<div class="col-xs-6 col-md-8">In your wallet:</div>
<div class="col-xs-6 col-md-4"><strong>` + balance + `</strong> ` + args.cryptoCurrencyCode + `</div>
</div>
<div class="row">
<div class="col-xs-6 col-md-8">Transaction fee: </div>
<div class="col-xs-6 col-md-4"><strong>0.00005</strong>` + args.cryptoCurrencyCode + `</div>
</div>
<hr>
<div class="row">
<div class="col-xs-6 col-md-8">You can send up to: </div>
<div class="col-xs-6 col-md-4"><strong>` + balance + `</strong> ` + args.cryptoCurrencyCode + `</div>
</div>`;
        $('#userWalletData').html(htmlUserWalletData);
      }
      // window.location.href = '#/accounts/wallet?cryptocurrencyCode=' + args.cryptoCurrencyCode;

    },
    renderCoinDataReceive: function(args) {
      //console.log('renderCoinDataReceive params', args);
      $('#m_tabs_3_3').removeClass('m-loader m-loader--info')
      var htmlrecieveCoinTitle = `<p>Give out the ` + args.cryptoCurrency + ` address below to receive ` + args.cryptoCurrency + `s.</p>`;
      $('#recieveCoinTitle').html(htmlrecieveCoinTitle)
      var htmlwalletAddress = `<input style="width:90%" id="myAddress" type="text" value="` + args.address + `"></input></div><a href="#" id="btnCopyaddress" class="btn btn-secondary m-btn m-btn--icon m-btn--icon-only">
       <i class="la la-sticky-note"></i>
     </a>`
      $('#walletAddress').html(htmlwalletAddress)
      _core.copyText();

    },
    renderCoinDataTransaction: async function(args, cryptoCurrency) {
      var confirmations = '';
      console.log("renderCoinDataTransaction args==:>", args);
      var txsArray = [];
      txsArray = args.txs
      $('#transaction_Title').html('Transaction Datails for ' + cryptoCurrency)
        // $('#m_datatable_Transaction').empty();
        // $('#m_datatable_Transaction').mDatatable()
      await $('#m_datatable_Transaction').mDatatable({
        data: {
          type: 'remote',
          source: {
            read: {
              url: '/getAddrFull',
              method: 'GET',
              processing: true,
              serverSide: true,
              params: {
                query: {
                  token: headerElms.token,
                  dataObj: args,
                },
              }

            }
          },
          saveState: {
            cookie: true,
            webstorage: true
          },
          serverPaging: true,
          serverFiltering: false,
          serverSorting: false,
          pagination: true,
        },
        pages: {
          desktop: {
            layout: 'default',
            pagesNumber: 6,
          },
          tablet: {
            layout: 'default',
            pagesNumber: 3,
          },
          mobile: {
            layout: 'compact',
          },
        },

        layout: {
          theme: 'default',
          class: '',
          scroll: true,
          height: 380,
          footer: false
        },
        sortable: false,
        filterable: false,

        columns: [{
            field: "confirmed",
            template: function(field, row) {
              console.log("field, row for confirmed", field, typeof field, row);
              if (field.confirmations > 0) {
                var confirmed_temp = field.confirmed;
                var confirmed_date = (moment(confirmed_temp).format('LLLL'))

                return confirmed_date;
              }
              // return (moment(field.confirmed).format('LLLL'));
            },
            title: 'Date',
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "Send",
            template: function(field, row) {
              console.log("field, row for send", field, typeof field, row);
              var tempInputsArray = field.inputs;
              if (field.confirmations > 0) {
                if (tempInputsArray[0].addresses[0] === (args.address)) {
                  return field.outputs[0].value;
                } else {
                  return 0;
                }
              }
            },
            title: 'Send',
            sortable: false,
            width: 100,
            textAlign: 'center'
          }, {
            field: "Received",
            template: function(field, row) {
              console.log("field, row received", field, typeof field, row);
              var tempInputsArray = field.inputs;
              if (field.confirmations > 0) {
                if (tempInputsArray[0].addresses[0] === (args.address)) {
                  return 0;
                } else {
                  return field.outputs[0].value;
                }
              }
            },
            title: 'Received',
            sortable: false,
            width: 100,
            textAlign: 'center'
          },


        ],

      })


    },

    computeAmont: function(amt) {
      ////console.log(amt);
      var resultPrice = '';
      var cryptoCurrency = '';
      $('#resultAmt').empty();
      cryptoCurrency = $('#mainTablist li a.active').text();
      var cryptoCurrencyCode = $('#mainTablist li a.active').attr('data-code');
      var currencyCode = $("#currencyCode option:selected").text();

      var dataObjPriceEq = {
        crytoCurrencyCode: cryptoCurrencyCode,
        currencyCode: currencyCode,
      }


      _core.getCryptoCurrencyPriceEqNew(dataObjPriceEq, function(res) {
        if (res) {
          $('#divresultAmt').removeClass('m-loader m-loader--info')
          var dataRes = res
          var price;

          for (var key in dataRes) {
            if (key.toString() == currencyCode.toString()) {
              ////console.log("Matched==>", dataRes[key]);
              price = dataRes[key].price;
              ////console.log(price);
              $('#resultAmt').val(price);

              var params = {
                coin: cryptoCurrencyCode,
                cryptoCurrency: cryptoCurrency
              }
              _bind.getCoin_WalletData(params)

            }

          }
        }

      });
    }

  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/wallet.html', 'wallet', function() {
        _bind.Wallet();
      })

    }
  }
}).bind(Wallet))();