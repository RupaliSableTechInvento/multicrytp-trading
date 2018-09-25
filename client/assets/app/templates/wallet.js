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
      ////console.log("Wallet,js wallet()");
      var form = $('#walletForm');

      var isToken = GlobalEvent.checkIfToken(headerElms.token)
      if (isToken) {
        var dataObj = {
          coin: 'BTC',
          hash: '71553a9b79226e8700af047b7992b2cec451f7e64609ca03b586acd5bf33e4c9'
        }
        _core.getTX(headerElms.token, dataObj, function(res) {
          //console.log("getTX response==>", res);

        })
        _bind.checkDefaultSetting();
        _bind.attachEvent();
        _bind.sendRequest();
        //console.log(headerElms.BTC_isAddressCreated, headerElms.LTC_isAddressCreated, headerElms.DOGE_isAddressCreated);
        $('#mainTablist li a').unbind().click(function() {
          form.clearForm();
          // _bind.checkDefaultSetting()
          var cryptoCurrency = $(this).text();
          // $('#currencyCodeOption').attr('selected', true)
          $("#currencyCode").val('AED').find("option[value='AED']").attr('selected', true)
          activeTabCode = $(this).attr('data-code');
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

            _bind.createWalletWithAddress(params)


          } else if (check_isAddressCreated === 'true') {
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
              //console.log("balance is 0");
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
                  //console.log("getCoin_WalletData response==>", res);
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


              _core.getCoin_WalletData(headerElms.token, function(res) {
                if (!res.isError) {
                  //console.log("getCoin_WalletData response==>", res);
                  var dataRes = res.data[0].wallets;
                  for (var key in dataRes) {
                    if (key.toString() == activeTabCode.toString()) {

                      var dataObj = {
                        coin: cryptoCurrencyCode,
                        address: dataRes[key].address,
                      }
                      _core.getAddrFull(headerElms.token, dataObj, function(res) {
                        if (res) {
                          console.log("getAddrFull==> for Transaction", res);
                          var varenderCoinDataTransaction = {};
                          varenderCoinDataTransaction = {
                            n_tx: res.n_tx,
                            total_received: res.total_received,
                            total_sent: res.total_sent,
                            txs: res.txs
                          }
                          _bind.renderCoinDataTransaction(varenderCoinDataTransaction)
                        }
                      })

                    }
                  }

                }

              });




              // $('#divuserWalletData').addClass('m-loader m-loader--info')


              break;
            }
          case 'send':
            {
              //console.log(params);

              //console.log("renderCoinData function call from subTablist tab ", params);
              _bind.renderCoinDataSend(params);

            }
        }

      })
    },
    renderSubTablistData: function(params) {
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
          //console.log(" if isBalanceValid ", isBalanceValid);
          var validateAddressRes = await _bind.validateAddress(receiverAddress)
          if (validateAddressRes && isTXValid) {
            //console.log("Transaction valid", isTXValid);

            var cryptoCurrencyCode = $('#mainTablist li a.active').attr('data-code');
            var dataObj = {
              coin: cryptoCurrencyCode,
              amount: amount,
              receiverAddress: receiverAddress,
            }

            _core.newTransaction(headerElms.token, dataObj, function(res) {
              if (res) {


                $('#btn_sendCoins').removeClass('m-loader m-loader--info')
                  //console.log("newTransaction==>", res);

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
          //console.log(" else isBalanceValid ", isBalanceValid);
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
      //console.log("validateAddress response", res);

      if (!res.isError) {
        return true;
      } else {
        return false;
      }

      // })

    },
    createWalletWithAddress: function(args) {
      //console.log("createWalletWithAddress ", args);
      var activeTabCode = args.activeTabCode
      var paramsObj = {};
      var dataObj = {
        coin: activeTabCode
      }
      _core.createWalletWithAddress(headerElms.token, dataObj, function(res) {
        //console.log("createWalletWithAddress==>>", res);
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
                //console.log("renderCoinData function call from   createWalletWithAddress", r);

              params = paramsObj;
              _bind.renderSubTablistData(params)

            }

          }

        }
      })
    },
    getCoin_WalletData: function(args) {
      //console.log("getCoin_WalletData args", args);
      var paramsObj = {};
      _core.getCoin_WalletData(headerElms.token, function(res) {
        if (!res.isError) {
          //console.log("getCoin_WalletData response==>", res);

          var dataRes = res.data[0].wallets;
          for (var key in dataRes) {
            if (key.toString() == activeTabCode.toString()) {

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
      activeTabCode = 'BTC';
      cryptoCurrency = 'BitCoin'
      $('#divuserWalletData').addClass('m-loader m-loader--info')
      params = {
        activeTabCode: activeTabCode,
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
      //console.log("renderCoinDataSend params==>", params);
      var dataObj = {
        coin: args.cryptoCurrencyCode,
        address: args.address
      }

      $('#divuserWalletData').addClass('m-loader m-loader--info')

      _core.getAddrBal(headerElms.token, dataObj, function(res) {
        if (res) {
          console.log("getAddrBal==>", res);

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
    renderCoinDataTransaction: function(args) {
      var confirmations = '';
      console.log("renderCoinDataTransaction==:>", args);
      var txsArray = [];
      txsArray = args.txs
      console.log(txsArray);


      $('#m_datatable_Transaction').mDatatable({
        data: txsArray,
        // serverPaging: true,
        // serverFiltering: false,
        // serverSorting: false,
        // pagination: true,


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

            field: "total",
            template: function(field, type, row) {
              console.log("rendring Total==>", total, field);

              // for (let index = 0; index < activeUSer.length; index++) {
              //   console.log("field.firstName", field.firstName, index, activeUSer[index].name);
              //   if (activeUSer[index].name == field.firstName) {
              //     console.log("activeUSer[index].name in if", activeUSer[index].name);
              //     return '<label>' + field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
              //   }
              // }
              return total;
            },
            title: 'tiitle',
            sortable: false,
            width: 100,
            textAlign: 'center'
          },


        ]
      })



    },

    computeAmont: function(amt) {
      //console.log(amt);
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
              //console.log("Matched==>", dataRes[key]);
              price = dataRes[key].price;
              //console.log(price);
              $('#resultAmt').val(price);

              var params = {
                activeTabCode: cryptoCurrencyCode,
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