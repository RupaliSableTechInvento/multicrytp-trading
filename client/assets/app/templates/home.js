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

  }

  var _bind = {
    getByCurrencyLoc: async function(cryptoCurrency) {
      $('#m_aside_left').css('display', 'block');
      $('.m-header').css('display', 'block');
      $('.m-nav-sticky').css('display', 'block');


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


      // $("#m_datatable_latest_ordersLS").mDataTable().destroy()
      await $('#m_datatable_latest_ordersLS').mDatatable({
        data: {
          type: 'remote',
          source: {
            read: {
              // url: 'http://localhost:3000/tradeByCurrencyLoc?cryptoCurrency=BITCOIN&location=india&tradeMethod=LOCAL&traderType=SELL&limit=10' ,
              url: 'http://localhost:3000/tradeByCurrencyLoc/',
              method: 'GET',
              params: {
                query: {
                  cryptoCurrency: cryptoCurrency,
                  location: 'india',
                  tradeMethod: 'LOCAL',
                  traderType: 'SELL'
                },
              }
            }
          },
          pageSize: 20,
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
            title: "Seller",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "location",
            title: "Location",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.price_equation",
            title: "price/BTC",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.max_trans_limit",
            template: function(field, type, row) {
              return field.more_information.min_trans_limit + '-' + field.more_information.max_trans_limit;
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
              return '<input type="button" name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="border-radius: 4px;color: white; background: #22b9ff;border: 1px solid #DEDEDE;padding: 7px; width: 70px;">';
            }
          }

        ]

      })


      await $('#m_datatable_latest_ordersLB').mDatatable({
        data: {
          type: 'remote',
          source: {
            read: {
              // url: 'http://localhost:3000/tradeByCurrencyLoc?cryptoCurrency=BITCOIN&location=india&tradeMethod=LOCAL&traderType=SELL&limit=10' ,
              url: 'http://localhost:3000/tradeByCurrencyLoc/',
              method: 'GET',
              params: {
                query: {
                  cryptoCurrency: cryptoCurrency,
                  location: 'india',
                  tradeMethod: 'LOCAL',
                  traderType: 'BUY'
                },
              }
            }
          },
          pageSize: 20,
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
            title: "Seller",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "location",
            title: "Location",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.price_equation",
            title: "price/BTC",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.max_trans_limit",
            title: "Limits",
            width: 80,
            responsive: {
              visible: 'lg'
            }
          }, {
            field: "traderType",
            title: "traderType",
            template: function(row) {
              return '<input type="button" name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="border-radius: 4px;color: white; background: #22b9ff;border: 1px solid #DEDEDE;padding: 7px; width: 70px;">';
            }
          }

        ]

      })
      await $('#m_datatable_latest_ordersOS').mDatatable({
        data: {
          type: 'remote',
          source: {
            read: {
              // url: 'http://localhost:3000/tradeByCurrencyLoc?cryptoCurrency=BITCOIN&location=india&tradeMethod=LOCAL&traderType=SELL&limit=10' ,
              url: 'http://localhost:3000/tradeByCurrencyLoc/',
              method: 'GET',
              params: {
                query: {
                  cryptoCurrency: cryptoCurrency,
                  location: 'india',
                  tradeMethod: 'ONLINE',
                  traderType: 'SELL'
                },
              }
            }
          },
          pageSize: 20,
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
            title: "Seller",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "location",
            title: "Location",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.price_equation",
            title: "price/BTC",
            sortable: false,
            width: 100,
            textAlign: 'center'
          },
          {
            field: "more_information.max_trans_limit",
            title: "Limits",
            width: 80,
            responsive: {
              visible: 'lg'
            }
          }, {
            field: "traderType",
            title: "traderType",
            template: function(row) {
              return '<input type="button" name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="border-radius: 4px;color: white; background: #22b9ff;border: 1px solid #DEDEDE;padding: 7px; width: 70px;">';
            }
          }

        ]
      })

      await $('#m_datatable_latest_ordersOB').mDatatable({
          data: {
            type: 'remote',
            source: {
              read: {
                // url: 'http://localhost:3000/tradeByCurrencyLoc?cryptoCurrency=BITCOIN&location=india&tradeMethod=LOCAL&traderType=SELL&limit=10' ,
                url: 'http://localhost:3000/tradeByCurrencyLoc/',
                method: 'GET',
                params: {
                  query: {
                    cryptoCurrency: cryptoCurrency,
                    location: 'india',
                    tradeMethod: 'ONLINE',
                    traderType: 'BUY'
                  },
                }
              }
            },
            pageSize: 20,
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
              title: "Seller",
              sortable: false,
              width: 100,
              textAlign: 'center'
            },
            {
              field: "location",
              title: "Location",
              sortable: false,
              width: 100,
              textAlign: 'center'
            },
            {
              field: "more_information.price_equation",
              title: "price/BTC",
              sortable: false,
              width: 100,
              textAlign: 'center'
            },
            {
              field: "more_information.max_trans_limit",
              title: "Limits",
              width: 80,
              responsive: {
                visible: 'lg'
              }
            }, {
              field: "traderType",
              title: "traderType",
              template: function(row) {
                return '<input type="button"  name="' + row.traderType + '" id="traderType" value="' + row.traderType + '" style="border-radius: 4px;color: white; background: #22b9ff;border: 1px solid #DEDEDE;padding: 7px; width: 70px;">';
              }
            }

          ]

        }),
        $('.m-datatable__table').css('min-height', '0');

      $('.m_datatable').on('click', '#traderType', function() {
        console.log("clicked..", $(this).attr("name"))
          // $(this).attr("data-frame")
      });


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
    changeCurrency: function() {
      $('.m-menu__item--rel').on('click', 'span', function() {
        console.log("clicked currency..", $(this).attr("name"))
        cryptoCurrencytemp = $(this).attr("name");
        //  _bind.getByCurrencyLoc(cryptoCurrencytemp);

      });
    },

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
      /*  if (localStorage.getItem("token") !== null) {

         $('.m-card-user__email').empty();
         $('.m-card-user__name').empty();
         var email = localStorage.getItem('email');
         var first_name = localStorage.getItem('first_name');
         var last_name = localStorage.getItem('last_name');
         $('.m-card-user__email').append(email);
         $('.m-card-user__name').append(first_name + '  ' + last_name);
         // m-dropdown__inner
       } */
      $('.m-card-user__email').empty();
      $('.m-card-user__name').empty();
      var email = localStorage.getItem('email');
      var first_name = localStorage.getItem('first_name');
      var last_name = localStorage.getItem('last_name');
      $('.m-card-user__email').append(email);
      $('.m-card-user__name').append(first_name + '  ' + last_name);
      $('#logoutbtn').unbind().click(function() {
        console.log("logout");
        window.location.replace("#/login");
        localStorage.removeItem("token");
        localStorage.removeItem('email');
        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");
        localStorage.removeItem('user_id');
      })
    }
  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/home.html', 'home', function() {
          _bind.addUserInfo();
          _bind.getByCurrencyLoc('BITCOIN');
          _bind.changeCurrency();
          _bind.changeBuyActiveTab(_tabs.buy, 'active');
          _bind.changeBuySellTab();

        })
        // $( "#maintradeblock" ).load( "ajax/test.html" );
    }
  }
}).bind(Home))()