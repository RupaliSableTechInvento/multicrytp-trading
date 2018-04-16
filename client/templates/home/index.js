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
    getUserInfo: API.getUserInfo,
    getUrlVars: function() {
      var vars = [],
        hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    },
    setHeader: function(traderType, tradeMethod, currency, location) {
      // console.log("traderType, tradeMethod, currency, location, i", traderType, tradeMethod, currency, location, i);
      var traderType = traderType.toLowerCase();
      var tradeMethod = tradeMethod.toLowerCase();
      var currency = currency.toLowerCase();
      console.log("currency=>", currency);
      var location = location.toLowerCase();
      var htmlTradeHeader = '';
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
        '</div>';
      traderType = "";
      return htmlTradeHeader;
    },

    setTradeData: function(firstName, location, price, max_trans_limit, min_trans_limit, btnTradeType) {
      var htmlTemp = '';
      htmlTemp += '<div class="div-flexrow ">' +
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
        '</div>';

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
      $(".trade_block").append(" ")
      return htmlShowMore;

    },
    settData: function() {
      var urlParams = _core.getUrlVars();
      currencyUrl = urlParams.currency;
      var SERVICES = [];
      if (urlParams.page == 'SHOW_MORE') {
        SERVICES.push(urlParams);
      } else {
        SERVICES = [
          { traderType: 'SELL', tradeMethod: 'LOCAL', currency: currencyUrl, location: 'india' },
          { traderType: 'SELL', tradeMethod: 'ONLINE', currency: currencyUrl, location: 'india' },
          { traderType: 'BUY', tradeMethod: 'ONLINE', currency: currencyUrl, location: 'india' },
          { traderType: 'BUY', tradeMethod: 'LOCAL', currency: currencyUrl, location: 'india' }
        ]
      }
      return SERVICES;
    }


  }
  var _bind = {
    getByCurrencyLoc: async function(coinType, location) {
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

        const res = await _core.getByCurrencyLoc(params)

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
          htmlTemp += _core.setShowMore(currencyres, tradeMethodres, traderTyperes, locationres);
          $(".trade_block").append(htmlTemp)
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
  }

  var _render = {
    content: function() {
      renderMainFrame('templates/home/index.html', 'home', function() {
        _bind.changeBuyActiveTab(_tabs.buy, 'active');
        _bind.changeBuySellTab();
        _bind.getByCurrencyLoc();

      })
    }
  }
}).bind(Home))()