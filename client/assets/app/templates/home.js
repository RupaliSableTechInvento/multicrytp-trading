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

      /*     getUrlVars: function() {
            var vars = [],
              hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
              hash = hashes[i].split('=');
              vars.push(hash[0]);
              vars[hash[0]] = hash[1];
            }
            return vars;
          }, */
      setHeader: function(traderType, tradeMethod, currency, location) {
        console.log("set header function in home.js")
          // console.log("traderType, tradeMethod, currency, location, i", traderType, tradeMethod, currency, location, i);
        var traderType = traderType.toLowerCase();
        var tradeMethod = tradeMethod.toLowerCase();
        var currency = currency.toLowerCase();
        console.log("currency=>", currency);
        var location = location.toLowerCase();
        var htmlTradeHeader = '';
        /* 
              htmlTradeHeader += '<div class="div-heading">' +
                '<label class="heading lbl_heading">' + traderType + ' ' + currency + 's ' + ' ' + ' ' + tradeMethod + ' ' + 'In' + ' ' + location + '</label>' +
                ' </div>' +
                '<div class="div-flex_heading">' +
                '<div class="div-flexheadingSub ">' +
                '<div class="title_seller"><label>Seller</label></div>' +
                '<div class="title_payment_method "><label>Payment Method</label></div>' +
                '<div class="title_price"><label>Price / BTC</label></div>' +
                '<div class="title_limits"><label>Limits</label></div>' +
                '<div class="title5 "><label></label></div>' +
                '</div>'; */

        htmlTradeHeader += '<div class="div-heading">' +
          '<h3 class="heading lbl_heading">' + traderType + ' ' + currency + 's ' + ' ' + ' ' + tradeMethod + ' ' + 'In' + ' ' + location + '</h3>' +
          ' </div>' +
          '<table class="m-datatable__table" style="display: block;">' +
          '<thead class="m-datatable__head">' +
          '<tr class="m-datatable__row">' +
          '<th data-field="Seller" class="m-datatable__cell m-datatable__cell--sort">' +
          '<span style="width: 150px;">Seller</span>' +
          '</th>' +
          '<th data-field="PaymentMethod" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 150px;">Payment Method</span>' +
          '</th>' +
          '<th data-field="Price" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 110px;">Price / BTC</span>' +
          '</th>' +
          '<th data-field="Limits" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 100px;">Limits</span>' +
          '</th>' +
          '<th data-field="Actions" class="m-datatable__cell m-datatable__cell--sort"><span style="width: 110px;"></span></th>' +
          '</tr>' +
          '</thead>' +
          '<tbody class="m-datatable__body mCustomScrollbar _mCS_6 mCS-autoHide"  position: relative; overflow: visible;" data-scrollbar-shown="true">' +
          '<div id="mCSB_6" class="mCustomScrollBox mCS-minimal-dark mCSB_vertical_horizontal mCSB_outside" tabindex="0" style="max-height: none;">' +
          '<div id="mCSB_6_container" class="mCSB_container" style="position: relative; top: 0px; left: 0px; width: 902px; min-width: 100%; overflow-x: inherit;" dir="ltr">';
        traderType = "";
        return htmlTradeHeader;
      },

      setTradeData: function(firstName, location, price, max_trans_limit, min_trans_limit, btnTradeType) {
        var htmlTemp = '';
        /*  htmlTemp += '<div class="div-flexrow ">' +
           '<div class="flex_row_title">' +
           '<label class="flex_row_title_value" id="userName">' + firstName + '</label>' +
           '<img src="img/Green_ball.png" style="height:10px;width:10px;"></img>' +
           '</div>' +
           '<div class="flex_row_payment-method ">' +
           '<label id="bankName">National bank transfer:</label>' +
           '<label class="tab_content_txt" id="location">' + location + '</label>' +
           '</div>' +
           '<div class="flex_heading_sub ">' +
           '<div><label id="priceE">' + price + '</label></div>' +
           '<div><label>GBP</label></div>' +
           '</div>' +
           '<div class="flex_row_limits"><label>' + min_trans_limit + '-' + max_trans_limit + '</label></div>' +
           '<div class="flex_row_btn-buy"><input type="button" value="' + btnTradeType + '" class="btncorners btn_trade_type" /></div>' +
           '</div>'; */

        htmlTemp += '<tr data-row="0" class="m-datatable__row div-flexrow">' +
          '<td data-field="OrderID" class="m-datatable__cell--sorted m-datatable__cell">' +
          '<span style="width: 150px;"> ' + firstName + '</span>' +
          '</td>' +
          '<td data-field="ShipDate" class="m-datatable__cell">' +
          ' <span style="width: 110px;">National bank transfer:</span>' +
          '<span style="width: 150px;">' + location + '</span>' +
          ' </td>' +
          ' <td data-field="Status" class="m-datatable__cell">' +
          '<span  style="width: 110px;">' + price + '</span>' +
          '<span style="width: 110px;"> GBP</span>' +
          '</td>' +
          '<td data-field="Type" class="m-datatable__cell">' +
          '<span style="width: 100px;">' +
          '<span style="width: 110px;>  ' + min_trans_limit + '-' + '</span>&nbsp;' +
          '<span style="width: 110px;>' + max_trans_limit + '</span>' +
          '</span>' +
          '</td>' +
          '<td data-field="ShipName" class="m-datatable__cell">' +
          '<span class="flex_row_btn-buy">' +
          '<input type="button" value="' + btnTradeType + '" class="btncorners btn_trade_type" style="border-radius: 4px;"/>' +
          '</span>' +
          '</td>' +

          '</tr>';

        return htmlTemp;
      },

      setFooter: function() {
        var htmlTemp = '';
        htmlTemp += '</div>' +
          '</div>' +
          /*  '<div id="mCSB_6_scrollbar_vertical" class="mCSB_scrollTools mCSB_6_scrollbar mCS-minimal-dark mCSB_scrollTools_vertical" style="display: block;">' +
           '<div class="mCSB_draggerContainer">' +
           '<div id="mCSB_6_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 50px; display: block; height: 86px; max-height: 290px; top: 0px;">' +
           '<div class="mCSB_dragger_bar" style="line-height: 50px;"></div>' +
           '</div>' +
           '<div class="mCSB_draggerRail"></div>' +
           '</div>' +
           ' </div>' +
           '<div id="mCSB_6_scrollbar_horizontal" class="mCSB_scrollTools mCSB_6_scrollbar mCS-minimal-dark mCSB_scrollTools_horizontal" style="display: block;">' +
           '<div class="mCSB_draggerContainer">' +
           '<div id="mCSB_6_dragger_horizontal" class="mCSB_dragger" style="position: absolute; min-width: 50px; display: block; width: 750px; max-width: 800.525px; left: 0px;">' +
           '<div class="mCSB_dragger_bar"></div>' +
           '</div>' +
           '<div class="mCSB_draggerRail"></div>' +
           '</div>' +
           '</div>' + */
          '</tbody>' +
          '</table>';
        return htmlTemp;

      },

      setShowMore: function(cryptoCurrency, tradeMethod, traderType, locationres) {
        var htmlShowMore = '';
        htmlShowMore +=
          '<div class=" pull-right">' +
          '<ul id="dropdown" >' +
          '<li class="dropdown">' +
          '<a  href="./#/?currency=' + cryptoCurrency + '&tradeMethod=' + tradeMethod + '&traderType=' + traderType + '&location=' + locationres + '&page=SHOW_MORE" >' +
          '<span class="showMore">Show more…</span>' +
          '<b class="caret"></b>' +
          '</a>' +
          '</li>' +
          '</ul>' +
          '</div>';
        $("#m_datatable_latest_orders").append(" ")
        return htmlShowMore;

      },
      settData: function() {
        //  var urlParams = _core.getUrlVars();
        currencyUrl = 'BITCOIN';
        var SERVICES = [];
        /*  if (urlParams.page == 'SHOW_MORE') {
           SERVICES.push(urlParams);
         } else {
           SERVICES = [
             { traderType: 'SELL', tradeMethod: 'LOCAL', currency: currencyUrl, location: 'india' },
             { traderType: 'SELL', tradeMethod: 'ONLINE', currency: currencyUrl, location: 'india' },
             { traderType: 'BUY', tradeMethod: 'ONLINE', currency: currencyUrl, location: 'india' },
             { traderType: 'BUY', tradeMethod: 'LOCAL', currency: currencyUrl, location: 'india' }
           ]
         } */
        SERVICES = [
          { traderType: 'SELL', tradeMethod: 'LOCAL', currency: currencyUrl, location: 'india' },
          { traderType: 'SELL', tradeMethod: 'ONLINE', currency: currencyUrl, location: 'india' },
          { traderType: 'BUY', tradeMethod: 'ONLINE', currency: currencyUrl, location: 'india' },
          { traderType: 'BUY', tradeMethod: 'LOCAL', currency: currencyUrl, location: 'india' }
        ]
        return SERVICES;
      },
      getAPICall: function(params) {
        return new Promise(resolve => {

          $.ajax({
            url: "/tradeByCurrencyLoc",
            type: "get",
            data: params,
            success: function(successData) {
              console.log("result=>", successData);
              resolve(successData);

            },
            error: function(err) {
              alert(err);
            }
          })

        })

      }
    }
    /*  var _bind = {
       getByCurrencyLoc: function() {
         console.log("bind function in home.js");
         var SERVICES = Object.assign([], _core.settData());
         var i = '';
         var traderType = '';
         var tradeMethod = '';
         var currency = '';
         var location = '';
         var cryptoCurrency = '';
         var currencyres = '';
         var tradeMethodres = '';
         var traderTyperes = '';
         var locationres = '';
         var htmlTemp = '';
         var num1 = 0;
         for (i = 0; i < SERVICES.length; i++) {
           var params = { cryptoCurrency: SERVICES[i].currency || 'BITCOIN', location: SERVICES[i].location || 'india', tradeMethod: SERVICES[i].tradeMethod, traderType: SERVICES[i].traderType, limit: 10 }

           var dataObj = { cryptoCurrency: 'BITCOIN', location: 'india', tradeMethod: 'LOCAL', traderType: 'SELL' }
           _core.getAPICall(params, function(res) {

             if (res && res.data.length > 0) {
               htmlTemp += _core.setHeader(SERVICES[num1].traderType, SERVICES[num1].tradeMethod, SERVICES[num1].currency || 'BITCOIN', SERVICES[num1].location);
               console.log("res and i=>", res, i);
               res.data.forEach(function(item) {
                 var firstName = 'firstName' in item ? (item.firstName) : '';
                 currencyres = 'cryptoCurrency' in item ? (item.cryptoCurrency) : '';
                 tradeMethodres = 'tradeMethod' in item ? (item.tradeMethod) : '';
                 traderTyperes = 'cryptoCurrency' in item ? (item.traderType) : '';

                 locationres = 'location' in item ? item.location : '';
                 var price = 'more_information' in item ? ('price_equation' in item.more_information ? item.more_information.price_equation : '') : '';
                 var max_trans_limit = 'more_information' in item ? ('max_trans_limit' in item.more_information ? item.more_information.max_trans_limit : '') : '';
                 var min_trans_limit = 'more_information' in item ? ('min_trans_limit' in item.more_information ? item.more_information.min_trans_limit : '') : '';
                 var user_id = 'user' in item ? item.user : '';
                 // console.log("user id=>", user_id)
                 var btnTradeType = SERVICES[num1].traderType.toLowerCase();

                 htmlTemp += _core.setTradeData(firstName, locationres, price, max_trans_limit, min_trans_limit, btnTradeType);
               })

               //htmlTemp += _core.setShowMore(currencyres, tradeMethodres, traderTyperes, locationres);

             } else {
               console.log("no response");
             }

             isFinish(num1);
             num1++;
           })


         }

         function isFinish(num) {
           if (num == SERVICES.length - 1) {
             htmlTemp += _core.setFooter();
             $("#m_datatable_latest_orders").html(htmlTemp);
           }
         }
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
     } */
  var _bind = {
    getByCurrencyLoc: async function() {
      var SERVICES = Object.assign([], _core.settData());
      var i = '';
      var traderType = '';
      var tradeMethod = '';
      var currency = '';
      var location = '';
      var cryptoCurrency = '';
      var currencyres = '';
      var tradeMethodres = '';
      var traderTyperes = '';
      var locationres = '';
      for (i = 0; i < SERVICES.length; i++) {
        var params = { cryptoCurrency: SERVICES[i].currency || 'BITCOIN', location: SERVICES[i].location || 'india', tradeMethod: SERVICES[i].tradeMethod, traderType: SERVICES[i].traderType, limit: 10 }

        const res = await _core.getAPICall(params)

        if (res && res.data.length > 0) {
          var htmlTemp = _core.setHeader(SERVICES[i].traderType, SERVICES[i].tradeMethod, SERVICES[i].currency || 'BITCOIN', SERVICES[i].location);

          console.log("res and i=>", res, i);
          res.data.forEach(function(item) {
            var firstName = 'firstName' in item ? (item.firstName) : '';
            currencyres = 'cryptoCurrency' in item ? (item.cryptoCurrency) : '';
            tradeMethodres = 'tradeMethod' in item ? (item.tradeMethod) : '';
            traderTyperes = 'cryptoCurrency' in item ? (item.traderType) : '';

            locationres = 'location' in item ? item.location : '';
            var price = 'more_information' in item ? ('price_equation' in item.more_information ? item.more_information.price_equation : '') : '';
            var max_trans_limit = 'more_information' in item ? ('max_trans_limit' in item.more_information ? item.more_information.max_trans_limit : '') : '';
            var min_trans_limit = 'more_information' in item ? ('min_trans_limit' in item.more_information ? item.more_information.min_trans_limit : '') : '';
            var user_id = 'user' in item ? item.user : '';
            // console.log("user id=>", user_id)
            var btnTradeType = SERVICES[i].traderType.toLowerCase();

            htmlTemp += _core.setTradeData(firstName, locationres, price, max_trans_limit, min_trans_limit, btnTradeType);
          })
          htmlTemp += _core.setFooter();
          $("#m_datatable_latest_orders").append(htmlTemp)
        } else {
          console.log("no response");
        }
        // return res
      }
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
      $('.m-card-user__email').empty();
      $('.m-card-user__name').empty();
      var email = localStorage.getItem('email');
      var first_name = localStorage.getItem('first_name');
      var last_name = localStorage.getItem('last_name');
      $('.m-card-user__email').append(email);
      $('.m-card-user__name').append(first_name + '  ' + last_name);
      $('#logoutbtn').unbind().click(function() {
        console.log("logout");
        window.location.href = "assets/snippets/pages/user/login.html";
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
      _bind.addUserInfo();
      _bind.getByCurrencyLoc();
      _bind.changeBuyActiveTab(_tabs.buy, 'active');
      _bind.changeBuySellTab();
      /* renderMainFrame('templates/home/index.html', 'home', function() {
        _bind.changeBuyActiveTab(_tabs.buy, 'active');
        _bind.changeBuySellTab();
        _bind.getByCurrencyLoc();

      }) */
      // $( "#maintradeblock" ).load( "ajax/test.html" );
    }
  }
}).bind(Home))()