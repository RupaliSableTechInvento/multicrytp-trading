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
    logout: API.logout,
    checkIfToken: function(token) {
      if (token && token.length > 0) {
        return true;
      }
      return false;
    }

  }

  var _bind = {

    getByCurrencyLoc: async function(cryptoCurrency) {

      $('.m-header').css('display', 'block');
      $('.m-nav-sticky').css('display', 'block');
      $('.m-datatable__pager').css('display', 'none');

      $('.m-datatable__pager-info').css('display', 'none');
      $('.m-datatable--paging-loaded').css('display', 'none');


      var htmlShowMore;
      var activeUSer = [];
      var currentTime = [];
      var params;
      var currentTimeSys = new Date();
      before = new Date();
      before.setMinutes(before.getMinutes() - 15);
      console.log("time -15 min from current time", currentTimeSys, before);
      console.log("getByCurrencyLoc", cryptoCurrency)
      var params = { cryptoCurrency: cryptoCurrency }
      console.log("params=>", params);
      var urlParams = _bind.getUrlVars();


      console.log("url params=>", urlParams);
      currencyUrl = urlParams.currency;
      if (urlParams.currency) {
        var str = urlParams.currency;
        cryptoCurrency = str.toString(),
          cryptoCurrency = urlParams.currency;
        console.log("cryptoCurrency in if", cryptoCurrency);
      }

      htmlShowMore = '';
      $('.li_showMore').unbind().click(function() {
        var traderType = $(this).attr("data-traderType")
        var tradeMethod = $(this).attr("data-tradeMethod")
        console.log("trade type and trade method=>", tradeMethod, traderType);
        window.location.href = '#/showMoreDetail?currency=' + cryptoCurrency +
          '&tradeMethod=' + tradeMethod + '&traderType=' + traderType + '&location=india';
      })


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



      await $('#m_datatable_latest_ordersOB').mDatatable({
          data: {
            type: 'remote',
            source: {
              read: {
                url: '/tradeByCurrencyLoc',
                method: 'GET',
                params: {
                  query: {
                    cryptoCurrency: cryptoCurrency,
                    location: 'india',
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
          /*  sortable: true,
           filterable: false,
           pagination: true, */
          columns: [{
              field: "firstName",
              template: function(field, type, row) {
                for (let index = 0; index < activeUSer.length; index++) {
                  console.log("field.firstName", field.firstName, index, activeUSer[index].name);
                  if (Date(activeUSer[index].userActiveTime) <= before) {
                    console.log("time matched", Date(activeUSer[index].userActiveTime), before);
                  }
                  if (activeUSer[index].name == field.firstName) {
                    console.log("activeUSer[index].name in if", activeUSer[index].name);
                    return '<label>' + field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
                  }
                }
                return field.firstName + ' inactive';
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
              template: function(field, type, row) {
                if (field.online_selling.payment_details == undefined || '') {
                  field.online_selling.payment_details = '';
                }
                if (field.location == undefined || '') {
                  field.location = '';
                }

                return field.online_selling.payment_details + ' ' + field.location;
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
              title: "Price/BTC",
              sortable: false,
              width: 100,
              textAlign: 'center'
            },
            {
              field: "more_information.max_trans_limit",
              template: function(field, type, row) {
                if (field.more_information.min_trans_limit == undefined || '') {
                  field.more_information.min_trans_limit = '';
                }
                if (field.more_information.max_trans_limit == undefined || '') {
                  field.more_information.max_trans_limit = '';
                }

                return field.more_information.min_trans_limit + '-' + field.more_information.max_trans_limit;
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

                return '<a href="./#/sellBuyCurrency?id=' + row._id + '">' +
                  '<input type="button" class="btn btn-info  " name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="color: white;  width: 70px; cursor:pointer;">' +
                  '</a>';
              }
            }
          ]

        }),
        await $('#m_datatable_latest_ordersLB').mDatatable({
          data: {
            type: 'remote',
            source: {
              read: {
                url: '/tradeByCurrencyLoc',
                method: 'GET',
                params: {
                  query: {
                    cryptoCurrency: cryptoCurrency,
                    location: 'india',
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
                  console.log("field.firstName", field.firstName, index, activeUSer[index].name);
                  if (Date(activeUSer[index].userActiveTime) <= before) {
                    console.log("time matched", Date(activeUSer[index].userActiveTime), before);
                  }
                  if (activeUSer[index].name == field.firstName) {
                    console.log("activeUSer[index].name in if", activeUSer[index].name);
                    return '<label>' + field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
                  }
                }
                return field.firstName + ' inactive';
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
              template: function(field, type, row) {
                if (field.online_selling.payment_details == undefined || '') {
                  field.online_selling.payment_details = '';
                }
                if (field.location == undefined || '') {
                  field.location = '';
                }

                return field.online_selling.payment_details + ' ' + field.location;
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
              title: "Price/BTC",
              sortable: false,
              width: 100,
              textAlign: 'center'
            },
            {
              field: "more_information.max_trans_limit",
              template: function(field, type, row) {
                if (field.more_information.min_trans_limit == undefined || '') {
                  field.more_information.min_trans_limit = '';
                }
                if (field.more_information.max_trans_limit == undefined || '') {
                  field.more_information.max_trans_limit = '';
                }

                return field.more_information.min_trans_limit + '-' + field.more_information.max_trans_limit;
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
                return ' <a href="./#/sellBuyCurrency?id=' + row._id + '">' +


                  '<input type="button" class="btn btn-info  " name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="color: white;  width: 70px; cursor:pointer;">' +
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
                query: {
                  cryptoCurrency: cryptoCurrency,
                  location: 'india',
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
        sortable: true,
        filterable: false,
        pagination: true,
        columns: [{
            field: "firstName",
            template: function(field, type, row) {
              for (let index = 0; index < activeUSer.length; index++) {
                console.log("field.firstName", field.firstName, index, activeUSer[index].name);
                if (Date(activeUSer[index].userActiveTime) <= before) {
                  console.log("time matched", Date(activeUSer[index].userActiveTime), before);
                }
                if (activeUSer[index].name == field.firstName) {
                  console.log("activeUSer[index].name in if", activeUSer[index].name);
                  return '<label>' + field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
                }
              }
              return field.firstName + ' inactive';
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
            template: function(field, type, row) {
              if (field.online_selling.payment_details == undefined || '') {
                field.online_selling.payment_details = '';
              }
              if (field.location == undefined || '') {
                field.location = '';
              }

              return field.online_selling.payment_details + ' ' + field.location;
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
            title: "Price/BTC",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.max_trans_limit",
            template: function(field, type, row) {
              if (field.more_information.min_trans_limit == undefined || '') {
                field.more_information.min_trans_limit = '';
              }
              if (field.more_information.max_trans_limit == undefined || '') {
                field.more_information.max_trans_limit = '';
              }

              return field.more_information.min_trans_limit + '-' + field.more_information.max_trans_limit;
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
              return ' <a href="./#/sellBuyCurrency?id=' + row._id + '">' +

                '<input type="button" class="btn btn-info  " name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="color: white;  width: 70px; cursor:pointer;">' +
                '</a>';

              /*     '<input type="button" name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="border-radius: 4px;color: white; background: #22b9ff;border: 1px solid #DEDEDE;padding: 7px; width: 70px; cursor:pointer;">' +
                  '</a>';
               */
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
                query: {
                  cryptoCurrency: cryptoCurrency,
                  location: 'india',
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
                console.log("field.firstName", field.firstName, index, activeUSer[index].name);
                if (Date(activeUSer[index].userActiveTime) <= before) {
                  console.log("time matched", Date(activeUSer[index].userActiveTime), before);
                }
                if (activeUSer[index].name == field.firstName) {
                  console.log("activeUSer[index].name in if", activeUSer[index].name);
                  return '<label>' + field.firstName + '</label><span style=" margin-left:5px;min-height: 10px; min-width: 10px;height: 4px;width: 4px; vertical-align: super;" class="m-badge m-badge--success"> </span>';
                }
              }
              return field.firstName + ' inactive';
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
            template: function(field, type, row) {
              if (field.online_selling.payment_details == undefined || '') {
                field.online_selling.payment_details = '';
              }
              if (field.location == undefined || '') {
                field.location = '';
              }

              return field.online_selling.payment_details + ' ' + field.location;
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
            title: "Price/BTC",
            sortable: false,
            width: 80,
            textAlign: 'center'
          },
          {
            field: "more_information.max_trans_limit",
            template: function(field, type, row) {
              if (field.more_information.min_trans_limit == undefined || '') {
                field.more_information.min_trans_limit = '';
              }
              if (field.more_information.max_trans_limit == undefined || '') {
                field.more_information.max_trans_limit = '';
              }

              return field.more_information.min_trans_limit + '-' + field.more_information.max_trans_limit;
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
              return ' <a href="./#/sellBuyCurrency?id=' + row._id + '">' +
                /*   '<input type="button" name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="border-radius: 4px;color: white; background: #22b9ff;border: 1px solid #DEDEDE;padding: 7px; width: 70px; cursor:pointer;">' +
                  '</a>';
                */
                '<input type="button" class="btn btn-info  " name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="color: white;  width: 70px; cursor:pointer;">' +
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
        console.log("hash=>", hash);
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      console.log("vars=>", vars);
      return vars;
    },
    /*     changeCurrency: function() {
          $('.m-menu__item--rel').on('click', 'span', function() {
            console.log("clicked currency..", $(this).attr("name"))
            cryptoCurrencytemp = $(this).attr("name");
            //  _bind.getByCurrencyLoc(cryptoCurrencytemp);

          });
        }, */

    changeBuyActiveTab: function(elem, className) {
      $(elem).addClass(className)
    },
    changeBuySellTab: function() {
      $('.li-quick_buy').unbind().click(function() {
        console.log("active");
        $(_tabs.buy).addClass("active");
        $(_tabs.sell).removeClass("active")
      })
      $('.li-quick_sell').unbind().click(function() {
        $(_tabs.sell).addClass("active");
        $(_tabs.buy).removeClass("active")
      })
    },

    addUserInfo: function() {
      console.log("adduserInfo...");
      var token = localStorage.getItem('token')
      var checkIfToken = _core.checkIfToken(token);
      if (checkIfToken) {
        $('.m-card-user__email').empty();
        $('.m-card-user__name').empty();
        var email = localStorage.getItem('email');
        var first_name = localStorage.getItem('first_name');
        var last_name = localStorage.getItem('last_name');
        $('.m-card-user__email').append(email);
        $('.m-card-user__name').append(first_name + '  ' + last_name);
        $('#logoutbtn').unbind().click(function() {
          console.log("logout");
          _core.logout(token, function(res) {
            if (res) {
              localStorage.removeItem("token");
              localStorage.removeItem('email');
              localStorage.removeItem("first_name");
              localStorage.removeItem("last_name");
              localStorage.removeItem('user_id');
              window.location.replace("#/login");

            }

          })

        })
      } else {

        $('#loginbtn').unbind().click(function() {
          window.location.replace("#/login");
        })


      }

    },


  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/home.html', 'home', function() {
          _bind.addUserInfo();
          _bind.getByCurrencyLoc('BITCOIN');
          // _bind.changeCurrency();
          _bind.changeBuyActiveTab(_tabs.buy, 'active');
          _bind.changeBuySellTab();

        })
        // $( "#maintradeblock" ).load( "ajax/test.html" );
    }
  }
}).bind(Home))()