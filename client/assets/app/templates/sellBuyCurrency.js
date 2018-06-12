var SellBuyCurrency = {};
((function() {
  this.init = function() {
      console.log("init sellBuyCurrency.js");
      _render.content();
    }
    //
  var _core = {
    getCurrencySellerBuyerInfo: API.getCurrencySellerBuyerInfo,
    chkNullValue: function(isNull) {
      if (isNull == undefined || '') {
        return '';
      }
      return isNull;
    },

    getUrlVars: function() {
      var vars = [],
        hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      console.log("hashes=>", hashes);
      for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        console.log("hash=>", hash);

        vars.push(hash[0]);
        console.log("vars in loop=>", vars);

        vars[hash[0]] = hash[1];
      }
      console.log("vars=>", vars);
      return vars;
    },
    setTerms: function(terms_of_trade, user) {
      var terms_of_trade = _core.chkNullValue(terms_of_trade);
      var user = _core.chkNullValue(user);


      var htmlTradeHeader = '';
      htmlTradeHeader += '<h5 class="m-portlet__head-text ">' + ' ' +
        'Terms of trade with ' +
        '<i>' + user + '</i>' +
        '</h5>';
      $(".terms_of_tradeTitile").append(htmlTradeHeader);
      htmlTradeHeader = '';

      if (terms_of_trade == '' || terms_of_trade == undefined) {
        terms_of_trade = "No terms of Trade added";
      }
      htmlTradeHeader += '<p class="ad-description">' +
        terms_of_trade +
        '</p>';
      $(".terms_of_tradebody").append(htmlTradeHeader);


    },
    setOpeninghours: function(opening_hours) {
      // console.log(" opening_hours=>>", opening_hours);
      // console.log(" opening_hours.saturday.start   opening_hours.saturday.end", parseInt(opening_hours.saturday.start), opening_hours.saturday);
      var htmlTradeHeader = '';
      console.log("opening hours.length=>>", opening_hours.length);
      htmlTradeHeader += '<ul>' +
        '<li>sunday :' + opening_hours.sunday.start + '-' + opening_hours.sunday.end + '</li>' +
        '<li>monday :' + opening_hours.monday.start + '-' + opening_hours.monday.end + '</li>' +
        '<li>  tuesday :' + opening_hours.tuesday.start + '-' + opening_hours.tuesday.end + '</li>' +
        '<li>wednesday :' + opening_hours.wednesday.start + '-' + opening_hours.wednesday.end + '</li>' +
        '<li> thursday :' + opening_hours.thursday.start + '-' + opening_hours.thursday.end + '</li>' +
        '<li>friday :' + opening_hours.friday.start + '-' + opening_hours.friday.end + '</li>' +
        '<li> saturday:' + opening_hours.saturday.start + '-' + opening_hours.saturday.end + '</li>' +
        '</ul>';
      $(".Opening_hours").append(htmlTradeHeader);
    },

    setPrice: function(price) {
      var price = _core.chkNullValue(price);
      var htmlTradeHeader = '';
      htmlTradeHeader += ' <a href="#" class="m-widget2__link">' +
        price + 'INR / BTC' +
        '</a>';
      /*  htmlTradeHeader += '<div class="col-md-4">' +
         ' <h4>Price:</h4>' +
         '</div>' +
         '<div class="col-md-8">' +
         '<h4 class="price" id="ad_price">' +
         price + '  INR / BTC</h4>' +
         '</div>'; */
      $(".ad_price").append(htmlTradeHeader);
      //return htmlTradeHeader;
    },
    setpaymentMethod: function(payment_details) {
      var payment_details = _core.chkNullValue(payment_details);
      var htmlTradeHeader = '';
      htmlTradeHeader += '<p>' +
        payment_details + ' ' +
        '<i class="fa fa-exclamation-circle" title=" LocalBitcoins.com is not authorized, approved, endorsed or sponsored by this specific payment method or its trademark owner. The payment method is listed here for informative purposes only to display that the advertiser is willing to settle the trade by using this specific payment method. LocalBitcoins.com cannot guarantee that the listed payment method is actually used for making the settlement."> </i>' +
        '</p>'
      $(".ad_paymentMethod").append(htmlTradeHeader);
    },
    setUser: function(user) {
      var htmlTradeHeader = '';


      htmlTradeHeader += '<a href="#" class="m-widget2__link">' +
        user +
        '</a>';

      /*  htmlTradeHeader += '<i class="fa fa-user">' + '</i>' +
         user + '<span title="" class="online-status online-status-recent" data-original-title="User ' + user + ' last seen online 19&nbsp;minutes ago">' +
         '<i class="fa fa-circle">' +
         '</i>' +
         '</span>'; */
      $(".username").append(htmlTradeHeader);
    },
    setTradeLimits: function(max_trans_limit, min_trans_limit) {
      var max_trans_limit = _core.chkNullValue(max_trans_limit);
      var min_trans_limit = _core.chkNullValue(min_trans_limit);

      var htmlTradeHeader = '';
      htmlTradeHeader += '<p>' + min_trans_limit +
        '-' +
        max_trans_limit +
        ' INR</p>';
      $(".trade_limits").append(htmlTradeHeader);

      htmlTradeHeader = '';
      htmlTradeHeader += ' The biggest amount you can sell to this ad is  ' + max_trans_limit + ' INR.';
      $("#under_min_error").append(htmlTradeHeader);

      htmlTradeHeader = '';
      htmlTradeHeader += 'The smallest amount you can sell to this ad is  ' + min_trans_limit + '    INR.';
      $("#over_max_error").append(htmlTradeHeader);
    },
    setLocation: function(location) {
      var location = _core.chkNullValue(location);
      var htmlTradeHeader = '';
      htmlTradeHeader += '<p>' +
        '<a href="/country/IN">' + location + '</a>' +
        '</p>';
      $(".location").append(htmlTradeHeader);
    },
    verifyTrader: function(currency, traderType, location, payment_details, user, tradeMethod) {
      var currency = _core.chkNullValue(currency);
      var location = _core.chkNullValue(location);
      var payment_details = _core.chkNullValue(payment_details);
      var tradeMethod = _core.chkNullValue(tradeMethod);
      var user = _core.chkNullValue(user);
      /*  tradeMethod: 'LOCAL',
       traderType: 'SELL' */
      var htmlTradeHeader = '';
      if (tradeMethod == 'ONLINE') {
        $('.paymentWindow').show();
        if (traderType == 'SELL') {
          // $('.Opening_hours_main').show();
          htmlTradeHeader += '<h3 class="m-portlet__head-text">' + ' ' +
            'Sell ' + currency + ' using' + ' ' + payment_details + ' ' + location + ' ' + '  with Indian Rupee (INR)' +
            '</h3>' +
            '<p class="ad-description">' +
            'LocalBitcoins.com' + ' user' + ' <i>' +
            user + '  ' +
            '</i>' + ' wishes to buy bitcoins from you.'
          '</p>';
        } else {
          // $('.Opening_hours_main').hide();

          htmlTradeHeader += '<h3 class="m-portlet__head-text ">' + ' ' +
            'Buy' + ' ' + currency + ' using' + ' ' + payment_details + '  Transfer   ' + location + ' ' + '  with Indian Rupee (INR)' +
            '</h3>' +
            '<p class="ad-description">' +
            'LocalBitcoins.com' + ' user' + ' <i>' +
            user + '  ' +
            '</i>' + ' wishes to sell bitcoins to you.'
          '</p>';
        }

      } else {
        if (traderType == 'SELL') {
          // $('.Opening_hours_main').hide();

          htmlTradeHeader += '<h3  class="m-portlet__head-text ">' + ' ' +
            'Sell your ' + currency + '  ' + '  with cash' +
            '</h3>' +
            '<p class="ad-description">' +
            'LocalBitcoins.com' + ' user' + ' <i>' +
            user + '  ' +
            '</i>' + ' wishes to buy bitcoins from you.'
          '</p>';
        } else {
          // $('.Opening_hours_main').show();
          htmlTradeHeader += '<h3 class="m-portlet__head-text ">' + ' ' +
            'Buy' + ' ' + currency + '  with cash ' +
            '</h3>' +
            '<p class="ad-description">' +
            'LocalBitcoins.com' + ' user' + ' <i>' +
            user + '  ' +
            '</i>' + ' wishes to sell bitcoins to you.'
          '</p>';
        }
      }
      $(".headTitle").append(htmlTradeHeader);
    }

  }

  var _bind = {
    getCurrencySellerBuyerInfo: function() {
      console.log("sellBuyCurrency.js");
      var urlParams = _core.getUrlVars();
      var id = urlParams.id;
      console.log("User id=>", id);
      _core.getCurrencySellerBuyerInfo(id, function(res) {
        if (res) {
          console.log("response from getCurrencySellerBuyerInfo", res);
          data
          if (res.isError) {
            console.log("response from getCurrencySellerBuyerInfo", res.isError);
          }
          var data = res.data;
          var currency = data.cryptoCurrency.toLowerCase();
          var traderType1 = data.traderType.toLowerCase();
          var location = data.location.toLowerCase();
          var payment_details = data.online_selling.payment_details.toLowerCase();
          var user = data.firstName;
          var traderType = data.traderType;
          var tradeMethod = data.tradeMethod;
          var max_trans_limit = data.more_information.max_trans_limit;
          var min_trans_limit = data.more_information.min_trans_limit;
          var price = data.more_information.price_equation;
          var terms_of_trade = data.more_information.terms_of_trade;
          var opening_hours = data.more_information.opening_hours;
          _core.verifyTrader(currency, traderType, location, payment_details, user, tradeMethod)
          _core.setPrice(price);
          _core.setLocation(location);
          _core.setOpeninghours(opening_hours);
          _core.setUser(user);
          _core.setTerms(terms_of_trade, user);
          _core.setTradeLimits(max_trans_limit, min_trans_limit);
        }
      })

    }
  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/sellBuyCurrency.html', 'sellBuyCurrency', function() {

        _bind.getCurrencySellerBuyerInfo();

      })
    }
  }
}).bind(SellBuyCurrency))();