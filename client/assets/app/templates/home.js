var Home = {};

((function() {
  this.init = function() {

    _render.content();
  }
  var _tabs = {
    buy: '.li-quick_buy',
    sell: '.li-quick_sell'
  }
  var _core = {
    getByCurrencyLoc: API.getByCurrencyLoc,
    getActiveUser: API.getActiveUser,
    acceptFriendRequest: API.acceptFriendRequest,
    addMessage: API.addMessage,

    setValueDropDwn: function(id, value) {
      $(id).empty();
      $(id).append(value);
    },

  }

  var _bind = {


    getByCurrencyLoc: async function(cryptoCurrency) {
      $('.m-header').css('display', 'block');
      $('.m-nav-sticky').css('display', 'block');
      $('.m-datatable__pager').css('display', 'none');
      $('.m-datatable__pager-info').css('display', 'none');
      $('.m-datatable--paging-loaded').css('display', 'none');
      var subQuery = {};
      var activeUSer = [];

      var payment_method, country, currency, amount, quickCurrency;
      var cryptoCurrencyCode = 'BTC';
      before = new Date();
      before.setMinutes(before.getMinutes() - 15);



      $('#select_ad-cryptocurrency li').on('click', async function() {
        var value = $(this).attr('name');
        $(this).addClass('  m-menu__item--active')
        cryptoCurrencyCode = $(this).attr('data-code');

        // console.log("Selected Currency code=>", cryptoCurrencyCode, value);
        _core.setValueDropDwn('#title_crytpocurrency', value)

      });

      $('#trade-tabs li').on('click', function() {

        $('#trade-tabs li').removeClass('active')
        $(this).addClass('active')
      })

      $('#trade-tabs li').on('click', function() {
        $('#trade-tabs li').removeClass('active')
        $(this).addClass('active')
      })

      $('#select_ad-online_provide li').on('click', function() {
        var value = $(this).attr('name');
        _core.setValueDropDwn('#title_online_provide', value)
        payment_method = value;
      })
      $('#select_ad-country li').on('click', function() {
        var value = $(this).attr('name');
        var country_code = $(this).attr('data-country-code');

        $('#select_ad-currency li').each(function(i) {
          var temp = $(this).attr('name');
          if (temp == country_code) {
            _core.setValueDropDwn('#titile_currency', country_code)

          }
        })
        _core.setValueDropDwn('#titile_country', value)
        country = value;
      })
      $('#select_ad-currency li').on('click', function() {
        var value = $(this).attr('name');
        _core.setValueDropDwn('#titile_currency', value)
        quickCurrency = value;
      })

      htmlShowMore = '';
      $('.li_showMore').unbind().click(function() {
        var traderType = $(this).attr("data-traderType")
        var tradeMethod = $(this).attr("data-tradeMethod")
          // console.log("trade type and trade method=>", tradeMethod, traderType);
        window.location.href = '#/showMoreDetail?cryptoCurrency=' + cryptoCurrency + '&tradeMethod=' + tradeMethod + '&code=' + cryptoCurrencyCode + '&traderType=' + traderType + '&location=india';
      })

      $('.search_btn').unbind().click(function() {
        amount = $('#txt_amt').val();
        var quickTraderType = $('#trade-tabs li.active').attr('data-traderType');
        quickCurrency = $('#titile_currency').text();
        // console.log("quickTraderType", quickTraderType);

        window.location.href = '#/quickOnline?cryptoCurrency=' + cryptoCurrency + '&amount=' + amount +
          '&payment_method=' + payment_method + '&cryptoCurrencyCode=' + cryptoCurrencyCode +
          '&country=' + country + '&currency=' + quickCurrency + '&traderType=' + quickTraderType;
      })

      await _core.getActiveUser(function(res) {
        var friendList = '';
        activeUSerData = res;
        if (res) {

          for (let index = 0; index < res.tokenModel.length; index++) {
            for (let j = 0; j < res.user.length; j++) {
              friendList = "<li>" + res.user[j]["first_name"] + "</li>";
              if (res.tokenModel[index].email == res.user[j].email) {
                activeUSer.push({
                  email: res.tokenModel[index].email,
                  name: res.user[j].first_name,
                  userActiveTime: res.tokenModel[index].userActiveTime
                });
              }

            }


          }

        }
      })

      var urlParams = _bind.getUrlVars();

      currencyUrl = urlParams.cryptoCurrency;
      if (urlParams.location) {
        var location = urlParams.location;
        var str = urlParams.cryptoCurrency;
        cryptoCurrency = str.toString(),
          cryptoCurrency = urlParams.cryptoCurrency;
        cryptoCurrencyCode = urlParams.code;

        subQuery = {
          location: location,
          cryptoCurrency: cryptoCurrency,
          cryptoCurrencyCode: cryptoCurrencyCode,
        }

      } else if (urlParams.cryptoCurrency) {
        var str = urlParams.cryptoCurrency;
        cryptoCurrency = str.toString(),
          cryptoCurrency = urlParams.cryptoCurrency;
        cryptoCurrencyCode = urlParams.code;

        subQuery = {
          cryptoCurrency: cryptoCurrency,
          cryptoCurrencyCode: cryptoCurrencyCode,
        }

      } else {

        $('#title_crytpocurrency').text('BITCOIN');
        subQuery = {
          cryptoCurrency: 'BITCOIN',
          cryptoCurrencyCode: 'BTC',
        }

      }

      //Data Table start
      await $('#m_datatable_latest_ordersOB').mDatatable({
        data: {
          type: 'remote',
          source: {
            read: {
              url: '/tradeByCurrencyLoc',
              method: 'GET',
              params: {
                query: {
                  subQuery: subQuery,
                  tradeMethod: 'ONLINE',
                  traderType: 'SELL',
                },
              }
            }
          },
          saveState: {
            cookie: true,
            webstorage: true
          },
          serverPaging: true,
          serverFiltering: true,
          serverSorting: true
        },

        layout: {
          theme: 'default',
          class: '',
          scroll: true,
          height: 380,
          footer: false
        },
        /*  sortable: true,
         filterable: false,
         pagination: true, */
        columns: [{
            field: "firstName",
            template: function(field, type, row) {
              for (let index = 0; index < activeUSer.length; index++) {
                // console.log("field.firstName", field.firstName, index, activeUSer[index].name);
                if (Date(activeUSer[index].userActiveTime) <= before) {
                  // console.log("time matched", Date(activeUSer[index].userActiveTime), before);
                }
                if (activeUSer[index].name == field.firstName) {
                  // console.log("activeUSer[index].name in if", activeUSer[index].name);
                  return '<label>' + field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
                }
              }
              return field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--metal"> </span>';
            },

            title: "Seller",
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
              _ref$location = _ref$location === undefined ? '' : _ref$location;
              var location = _ref$location.replace(/_/g, ' ')
              return _ref$payment_method + ' :<a href=./#/?cryptoCurrency=' + cryptoCurrency + '&code=' + cryptoCurrencyCode + '&location=' + _ref$location + '> ' + location + '</a>';
            },
            title: "Payment Method",
            sortable: false,
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
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.max_trans_limit",
            template: function(field) {
              // console.log("more_information field=>", field);
              var _ref$more_information = field.more_information;
              _ref$more_information = _ref$more_information === undefined ? '' : _ref$more_information;
              var min_trans_limit = _ref$more_information.min_trans_limit;
              var max_trans_limit = _ref$more_information.max_trans_limit;
              return (min_trans_limit || 0) + '-' + (max_trans_limit || 0);
            },
            title: "Limits",
            sortable: false,
            width: 80,
            responsive: {
              visible: 'lg'
            }
          }, {
            field: "traderType",
            title: "Trader Type",
            sortable: false,
            template: function(row) {
              var rowCurrency = row.more_information.currency;
              return '<a href="./#/sellBuyCurrency?id=' + row._id + '&cryptoCurrencyCode=' + cryptoCurrencyCode + '&currency=' + rowCurrency + '">' +
                '<input type="button" class="btn btn-info " name="Buy" id="traderType" value="Buy" style="color: white;  width: 70px; cursor:pointer;">' +
                '</a>';
            }
          }
        ]

      })
      await $('#m_datatable_latest_ordersLB').mDatatable({
        data: {

          type: 'remote',
          source: {
            read: {
              url: '/tradeByCurrencyLoc',
              method: 'GET',
              params: {
                query: {
                  subQuery: subQuery,
                  tradeMethod: 'LOCAL',
                  traderType: 'SELL',

                },
              }
            }
          },
          saveState: {
            cookie: true,
            webstorage: true
          },
          serverPaging: true,
          serverFiltering: true,
          serverSorting: true
        },

        layout: {
          theme: 'default',
          class: '',
          scroll: true,
          height: 380,
          footer: false
        },
        sortable: true,
        filterable: false,
        pagination: true,
        columns: [{
            field: "firstName",
            template: function(field, type, row) {
              for (let index = 0; index < activeUSer.length; index++) {
                // console.log("field.firstName", field.firstName, index, activeUSer[index].name);
                if (Date(activeUSer[index].userActiveTime) <= before) {
                  // console.log("time matched", Date(activeUSer[index].userActiveTime), before);
                }
                if (activeUSer[index].name == field.firstName) {
                  // console.log("activeUSer[index].name in if", activeUSer[index].name);
                  return '<label>' + field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
                }
              }
              return field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--metal"> </span>';
            },
            /*    template: function(field, type, row) {
                 if (field.firstName === ({ $in: activeUSer })) {
                   return field.firstName + '  active';

                 }
                 return field.firstName + '  inactive';
               }, */
            title: "Seller",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "",
            template: function(_ref) {
              var _ref$location = _ref.location;
              _ref$location = _ref$location === undefined ? '' : _ref$location;
              var location = _ref$location.replace(/_/g, ' ')
              return '<a href=./#/?cryptoCurrency=' + cryptoCurrency + '&code=' + cryptoCurrencyCode + '&location=' + _ref$location + '> ' + location + '</a>';
            },

            title: "Location",
            sortable: false,
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
              // console.log("more_information LB==>", _ref, _ref$more_information);
              var price_equation = _ref$more_information.price_equation;
              price_equation = parseFloat(price_equation);

              var currency = _ref$more_information.currency;
              return `<div>` + (price_equation.toFixed(2) || 0) + `</div>
              <div>` + (currency || '') + `</div>
               `;
            },

            title: 'Price/' + cryptoCurrencyCode,
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.max_trans_limit",
            template: function(field) {
              // console.log("more_information field=>", field);
              var _ref$more_information = field.more_information;
              _ref$more_information = _ref$more_information === undefined ? {} : _ref$more_information;
              var min_trans_limit = _ref$more_information.min_trans_limit;
              var max_trans_limit = _ref$more_information.max_trans_limit;
              return (min_trans_limit || 0) + '-' + (max_trans_limit || 0);
            },
            title: "Limits",
            sortable: false,
            width: 80,
            responsive: {
              visible: 'lg'
            }
          }, {
            field: "traderType",
            sortable: false,
            title: "Trader Type",
            template: function(row) {
              var rowCurrency = row.more_information.currency;
              return '<a href="./#/sellBuyCurrency?id=' + row._id + '&cryptoCurrencyCode=' + cryptoCurrencyCode + '&currency=' + rowCurrency + '">' +
                '<input type="button" class="btn btn-info  " name="Buy" id="traderType" value="Buy" style="color: white;  width: 70px; cursor:pointer;">' +
                '</a>';

              /* '<input type="button" name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="border-radius: 4px;color: white; background: #22b9ff;border: 1px solid #DEDEDE;padding: 7px; width: 70px; cursor:pointer;">' +
                  '</a>';
              */
            }
          }

        ]

      })
      await $('#m_datatable_latest_ordersOS').mDatatable({
        data: {
          type: 'remote',
          source: {
            read: {
              url: '/tradeByCurrencyLoc',
              method: 'GET',
              params: {
                // query: query,
                query: {
                  subQuery: subQuery,
                  tradeMethod: 'ONLINE',
                  traderType: 'BUY',

                },
              }
            }
          },
          saveState: {
            cookie: true,
            webstorage: true
          },
          serverPaging: true,
          serverFiltering: true,
          serverSorting: true
        },

        layout: {
          theme: 'default',
          class: '',
          scroll: true,
          height: 380,
          footer: false
        },
        sortable: true,
        filterable: false,
        pagination: true,
        columns: [{
            field: "firstName",
            template: function(field, type, row) {
              for (let index = 0; index < activeUSer.length; index++) {
                // console.log("field.firstName", field.firstName, index, activeUSer[index].name);
                if (Date(activeUSer[index].userActiveTime) <= before) {
                  // console.log("time matched", Date(activeUSer[index].userActiveTime), before);
                }
                if (activeUSer[index].name == field.firstName) {
                  // console.log("activeUSer[index].name in if", activeUSer[index].name);
                  return '<label>' + field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
                }
              }
              return field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--metal"> </span>';
            },
            /*   template: function(field, type, row) {
                if (field.firstName === ({ $in: activeUSer })) {
                  return field.firstName + '  active';

                }
                return field.firstName + '  inactive';
              }, */
            title: "Buyer",
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
              _ref$location = _ref$location === undefined ? '' : _ref$location;
              var location = _ref$location.replace(/_/g, ' ')
              return _ref$payment_method + ' :<a href=./#/?cryptoCurrency=' + cryptoCurrency + '&code=' + cryptoCurrencyCode + '&location=' + location + '> ' + location + '</a>';
            },
            title: "Payment Method",
            sortable: false,
            width: 250,
            responsive: {
              visible: 'lg'
            }
          },
          {
            field: "more_information.price_equation",

            template: function(_ref) {

              var _ref$more_information = _ref.more_information;
              _ref$more_information = _ref$more_information === undefined ? {} : _ref$more_information;
              // console.log("more_information OS==>", _ref, _ref$more_information);
              var price_equation = _ref$more_information.price_equation;
              price_equation = parseFloat(price_equation);

              var currency = _ref$more_information.currency;
              return `<div>` + (price_equation.toFixed(2) || 0) + `</div>
              <div>` + (currency || '') + `</div>
               `;
            },

            title: 'Price/' + cryptoCurrencyCode,
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.max_trans_limit",
            template: function(field) {
              // console.log("more_information field=>", field);
              var _ref$more_information = field.more_information;
              _ref$more_information = _ref$more_information === undefined ? {} : _ref$more_information;
              var min_trans_limit = _ref$more_information.min_trans_limit;
              var max_trans_limit = _ref$more_information.max_trans_limit;
              return (min_trans_limit || 0) + '-' + (max_trans_limit || 0);
            },
            title: "Limits",
            sortable: false,
            width: 80,
            responsive: {
              visible: 'lg'
            }
          }, {
            field: "traderType",
            sortable: false,
            title: "Trader Type",
            template: function(row) {


              var rowCurrency = row.more_information.currency;
              return '<a href="./#/sellBuyCurrency?id=' + row._id + '&cryptoCurrencyCode=' + cryptoCurrencyCode + '&currency=' + rowCurrency + '">' +
                // return ' <a href="./#/sellBuyCurrency?id=' + row._id + ' ">' +

                '<input type="button" class="btn btn-info  " name="Sell" id="traderType" value="Sell" style="color: white;  width: 70px; cursor:pointer;">' +
                '</a>';
            }
          }

        ]
      })

      await $('#m_datatable_latest_ordersLS').mDatatable({
        data: {
          type: 'remote',
          source: {
            read: {
              url: '/tradeByCurrencyLoc',
              method: 'GET',
              processing: true,
              serverSide: true,
              params: {
                // query: query,
                query: {
                  subQuery: subQuery,
                  tradeMethod: 'LOCAL',
                  traderType: 'BUY',

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
          serverSorting: false

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
                // console.log("field.firstName", field.firstName, index, activeUSer[index].name);
                if (Date(activeUSer[index].userActiveTime) <= before) {
                  // console.log("time matched", Date(activeUSer[index].userActiveTime), before);
                }
                if (activeUSer[index].name == field.firstName) {
                  // console.log("activeUSer[index].name in if", activeUSer[index].name);
                  return '<label>' + field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
                }
              }
              return field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--metal"> </span>';
            },
            /*    template: function(field, type, row) {
                 if (field.firstName === ({ $in: activeUSer })) {
                   return field.firstName + '  active';

                 }
                 return field.firstName + '  inactive';
               }, */
            title: "Seller",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "",
            template: function(_ref) {
              var _ref$location = _ref.location;
              _ref$location = _ref$location === undefined ? {} : _ref$location;
              var location = _ref$location.replace(/_/g, ' ')
              return '<a href=./#/?cryptoCurrency=' + cryptoCurrency + '&code=' + cryptoCurrencyCode + '&location=' + _ref$location + '> ' + location + '</a>';
            },
            title: "Location",
            sortable: false,
            width: 250,
            responsive: {
              visible: 'lg'
            }
          },
          {
            field: "more_information.price_equation",
            template: function(_ref) {

              var _ref$more_information = _ref.more_information;
              _ref$more_information = _ref$more_information === undefined ? {} : _ref$more_information;
              // console.log("more_information LS==>", _ref, _ref$more_information);
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
              var _ref$more_information = field.more_information;
              _ref$more_information = _ref$more_information === undefined ? {} : _ref$more_information;
              var min_trans_limit = _ref$more_information.min_trans_limit;
              var max_trans_limit = _ref$more_information.max_trans_limit;
              return (min_trans_limit || 0) + '-' + (max_trans_limit || 0);
            },
            title: "Limits",
            sortable: false,
            width: 80,
            responsive: {
              visible: 'lg'
            }
          }, {
            field: "traderType",
            title: "Trader Type",
            sortable: false,

            template: function(row) {

              var rowCurrency = row.more_information.currency;
              return '<a href="./#/sellBuyCurrency?id=' + row._id + '&cryptoCurrencyCode=' + cryptoCurrencyCode + '&currency=' + rowCurrency + '">' +
                // return ' <a href="./#/sellBuyCurrency?id=' + row._id + '">' +
                /*   '<input type="button" name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="border-radius: 4px;color: white; background: #22b9ff;border: 1px solid #DEDEDE;padding: 7px; width: 70px; cursor:pointer;">' +
                  '</a>';
                */
                '<input type="button" class="btn btn-info  " name="Sell" id="traderType" value="Sell" style="color: white;  width: 70px; cursor:pointer;">' +
                '</a>';
            }
          }

        ]
      })

      $('.m-datatable__table').css('min-height', '0');

    },

    getUrlVars: function() {
      var vars = [],
        hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      //var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1);
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        // console.log("hash=>", hash);
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      // console.log("vars=>", vars);
      return vars;
    },

    changeBuyActiveTab: function(elem, className) {
      $(elem).addClass(className)
    },



  }
  var _render = {
    content: function() {

      renderMainFrame('assets/snippets/pages/user/home.html', 'home', function() {
          // _bind.addUserInfo();
          _bind.getByCurrencyLoc('BITCOIN');
          // _bind.changeCurrency();  
          _bind.changeBuyActiveTab(_tabs.buy, 'active');
          // _bind.getAllMessages();
          // _bind.userList();
        })
        // $( "#maintradeblock" ).load( "ajax/test.html" );
    }
  }
}).bind(Home))()