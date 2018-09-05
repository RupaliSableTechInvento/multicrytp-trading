var QuickOnline = {};
((function() {
  this.init = function() {
    _render.content();
  }
  var _core = {
    quickOnline: API.quickOnline,
    getActiveUser: API.getActiveUser,

    getUrlVars: function() {
      var vars = [],
        hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      //var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1);
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        console.log("hash=>", hash);
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      console.log("vars=>", vars);
      return vars;
    },


    verifyTrader: function(cryptoCurrency, traderType, location, tradeMethod) {

      var htmlTradeHeader = '';
      if (tradeMethod == 'ONLINE') {

        if (traderType == 'SELL') {

          htmlTradeHeader += '<h3  class="m-portlet__head-text ">' + ' ' +
            'Sell ' + cryptoCurrency + ' ' + ' Online  Transfer   in ' + location + ' ' + '  with Indian Rupee (INR)' +
            '</h3>';
        } else {

          htmlTradeHeader += '<h3  class="m-portlet__head-text ">' + ' ' +
            'Buy' + ' ' + cryptoCurrency + ' using' + ' Online  Transfer  in ' + location + ' ' + '  with Indian Rupee (INR)' +
            '</h3>';
        }

      } else {
        if (traderType == 'SELL') {
          htmlTradeHeader += '<h3  class="m-portlet__head-text ">' + ' ' +
            'Sell your ' + cryptoCurrency + '  ' + '  with cash' +
            '</h3>';
        } else {
          htmlTradeHeader += '<h3  class="m-portlet__head-text ">' + ' ' +
            'Buy' + ' ' + cryptoCurrency + '  with cash ' +
            '</h3>';

        }
      }
      $(".headTitle").append(htmlTradeHeader);
    }

  }

  var _bind = {
    quickOnline: async function() {

      var urlParams = _core.getUrlVars();
      var activeUSer = [];
      var currency = urlParams.currency;
      var cryptoCurrencyCode = urlParams.cryptoCurrencyCode;
      var cryptoCurrency = urlParams.cryptoCurrency;
      var location = urlParams.country;
      var payment_method = urlParams.payment_method;
      payment_method = decodeURI(payment_method);
      var amount = urlParams.amount;
      amount = parseInt(amount);
      var tradeMethod = 'ONLINE';
      var traderType = urlParams.traderType;
      var title = 'Buyer';
      if (traderType == 'BUY') {
        title = 'Seller'
      }
      _core.verifyTrader(cryptoCurrency, traderType, location, tradeMethod);

      await _core.getActiveUser(function(res) {
        activeUSerData = res;
        if (res) {
          console.log("response in getActive User=>>", res);
          for (let index = 0; index < res.tokenModel.length; index++) {
            for (let j = 0; j < res.user.length; j++) {
              console.log("Email=>", res.tokenModel[index].email, res.user[j].email);
              if (res.tokenModel[index].email == res.user[j].email) {
                activeUSer.push({ email: res.tokenModel[index].email, name: res.user[j].first_name, userActiveTime: res.tokenModel[index].userActiveTime });
              }

            }

          }

          console.log("active user data=>", activeUSer);

        }
      })


      if (urlParams.cryptoCurrency) {
        var str = urlParams.cryptoCurrency;
        cryptoCurrency = str.toString(),
          cryptoCurrency = urlParams.cryptoCurrency;
        console.log("cryptoCurrency in if", cryptoCurrency);
      }


      await $('#m_datatable_quickOnline').mDatatable({
        data: {
          type: 'remote',
          source: {
            read: {
              url: '/getQuickByCryptocurrency',
              method: 'GET',
              processing: true,
              serverSide: true,
              params: {
                query: {
                  cryptoCurrency: cryptoCurrency,
                  location: location,
                  tradeMethod: tradeMethod,
                  traderType: traderType,
                  payment_method: payment_method,
                  currency: currency,
                  amount: amount,
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
            field: "firstName",
            template: function(field, type, row) {
              for (let index = 0; index < activeUSer.length; index++) {
                console.log("field.firstName", field.firstName, index, activeUSer[index].name);
                if (activeUSer[index].name == field.firstName) {
                  console.log("activeUSer[index].name in if", activeUSer[index].name);
                  return '<label>' + field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
                }
              }
              return field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--metal"> </span>';
            },
            title: title,
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "",
            template: function(_ref) {
              var _ref$payment_method = _ref.payment_method;
              _ref$payment_method = _ref$payment_method === undefined ? '' : _ref$payment_method;
              var _ref$location = _ref.location;
              _ref$location = _ref$location === undefined ? '' : _ref$location.replace(/_/g, ' ');

              return _ref$payment_method + ' :<a href=./#/?cryptoCurrency=' + cryptoCurrency + '&code=' + cryptoCurrencyCode + '&location=' + _ref$location + '> ' + _ref$location + '</a>';
            },
            title: "Payment Method",
            width: 250,
            responsive: {
              visible: 'lg'
            }
          },
          {
            field: "more_information.price_equation",

            template: function(_ref) {
              var _ref$more_information = _ref.more_information;
              _ref$more_information = _ref$more_information === undefined ? '' : _ref$more_information;
              // console.log("more_information OB==>", _ref, _ref$more_information);
              var price_equation = _ref$more_information.price_equation;
              price_equation = parseFloat(price_equation);
              var currency = _ref$more_information.currency;
              return `<div>` + (price_equation.toFixed(2) || 0) + `</div>
              <div>` + (currency || '') + `</div>
               `;

            },

            title: 'Price/' + cryptoCurrencyCode,
            sortable: false,
            width: 80,
            textAlign: 'center'
          },
          {
            field: "more_information.max_trans_limit",
            template: function(field) {
              console.log("more_information field=>", field);
              var _ref$more_information = field.more_information;
              _ref$more_information = _ref$more_information === undefined ? '' : _ref$more_information;
              console.log("more_information1==>", _ref$more_information);
              var min_trans_limit = _ref$more_information.min_trans_limit;
              var max_trans_limit = _ref$more_information.max_trans_limit;
              return (min_trans_limit || 0) + '-' + (max_trans_limit || 0);
            },
            title: "Limits",
            width: 80,
            responsive: {
              visible: 'lg'
            }
          }, {
            field: "traderType",
            title: "traderType",

            template: function(row) {
              return ' <a href="./#/sellBuyCurrency?id=' + row._id + '&code=' + cryptoCurrencyCode + '">' +
                '<input type="button" name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="border-radius: 4px;color: white; background: #22b9ff;border: 1px solid #DEDEDE;padding: 7px; width: 70px; cursor:pointer;">' +
                '</a>';
            }
          }

        ]
      })


    }
  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/quickOnline.html', 'quickOnline', function() {
        _bind.quickOnline()


      })
    }
  }
}).bind(QuickOnline))()
// ShowMoreDetail.init();