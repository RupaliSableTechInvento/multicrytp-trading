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
    setShowMore: function() {
      var htmlShowMore = '';
      htmlShowMore +=
        '<div class=" pull-right">' +
        '<ul id="dropdown" class="popular-methods-dropdown">' +
        '<li class="dropdown">' +
        '<a class="dropdown-toggle" data-toggle="dropdown" href="#" >' +
        'Show more…' +
        '<b class="caret"></b>' +
        '</a>' +
        '</li>' +
        '</ul>' +

        '</div>';
      return htmlShowMore;

    },
    settData: function() {
      var currencyUrl = _core.getUrlVars().currency;
      var SERVICES = [
        { traderType: 'SELL', tradeMethod: 'LOCAL', currency: currencyUrl, location: 'india' },
        { traderType: 'SELL', tradeMethod: 'ONLINE', currency: currencyUrl, location: 'india' },
        { traderType: 'BUY', tradeMethod: 'ONLINE', currency: currencyUrl, location: 'india' },
        { traderType: 'BUY', tradeMethod: 'LOCAL', currency: currencyUrl, location: 'india' }
      ]
      return SERVICES;
    }


  }
  var _bind = {
    getByCurrencyLoc: async function(coinType, location) {
      var coinType = _core.getUrlVars().currency;
      var SERVICES = Object.assign([], _core.settData());
      var i = '';
      var traderType = '';
      var tradeMethod = '';
      var currency = '';
      var location = '';
      for (i = 0; i < 4; i++) {
        var htmlTemp = _core.setHeader(SERVICES[i].traderType, SERVICES[i].tradeMethod, SERVICES[i].currency, SERVICES[i].location);
        var params = { currency: SERVICES[i].currency || 'BITCOIN', location: SERVICES[i].location || 'india', tradeMethod: SERVICES[i].tradeMethod, traderType: SERVICES[i].traderType }
        const res = await _core.getByCurrencyLoc(params)

        if (res) {
          console.log("res", res);
          res.data.forEach(function(item) {
            var user = 'user' in item ? JSON.parse(item.user) : '';

            var first_name = user.first_name;
            // var first_name = 'user' in item ?  ('first_name' in item.user ? item.user.first_name : '') : '';

            // var name = 'name' in item ? item.name : '';
            console.log("Name=>", first_name);
            var location = 'location' in item ? item.location : '';
            var price = 'more_information' in item ? ('price_equation' in item.more_information ? item.more_information.price_equation : '') : '';
            var max_trans_limit = 'more_information' in item ? ('max_trans_limit' in item.more_information ? item.more_information.max_trans_limit : '') : '';
            var min_trans_limit = 'more_information' in item ? ('min_trans_limit' in item.more_information ? item.more_information.min_trans_limit : '') : '';
            var user_id = 'user' in item ? item.user : '';
            console.log("user id=>", user_id)

            //  const resUserInfo = await _core.getUserInfo(user_id)
            // console.log("User Info=>", resUserInfo)
            //return resUserInfo



            var btnTradeType = SERVICES[i].traderType.toLowerCase();
            htmlTemp +=
              '<div class="div-flexrow ">' +
              '<div class="flex_row_title">' +
              '<label class="flex_row_title_value" id="userName">' + first_name + '</label>' +
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
          })
          htmlTemp += _core.setShowMore();

          $(".div-bitcointradeData").append(htmlTemp)
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