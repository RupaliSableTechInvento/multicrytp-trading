var SellBuyCurrency = {};
((function() {
  this.init = function() {
      console.log("init sellBuyCurrency.js");
      _render.content();
    }
    //
  var _core = {
    getCurrencySellerBuyerInfo: API.getCurrencySellerBuyerInfo,
    sendMessage: API.sendMessage,

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
        '<li> sunday :' + opening_hours.sunday.start + '-' + opening_hours.sunday.end + '</li>' +
        '<li> monday :' + opening_hours.monday.start + '-' + opening_hours.monday.end + '</li>' +
        '<li> tuesday :' + opening_hours.tuesday.start + '-' + opening_hours.tuesday.end + '</li>' +
        '<li> wednesday :' + opening_hours.wednesday.start + '-' + opening_hours.wednesday.end + '</li>' +
        '<li> thursday :' + opening_hours.thursday.start + '-' + opening_hours.thursday.end + '</li>' +
        '<li> friday :' + opening_hours.friday.start + '-' + opening_hours.friday.end + '</li>' +
        '<li> saturday:' + opening_hours.saturday.start + '-' + opening_hours.saturday.end + '</li>' +
        '</ul>';
      $(".Opening_hours").append(htmlTradeHeader);
    },

    setPrice: function(price, currency, cryptoCurrencyCode) {
      var price = _core.chkNullValue(price);

      if (price == undefined || '') {

      } else {
        price = Number(price);
        price = price.toFixed(2);
      }
      var htmlTradeHeader = '';
      htmlTradeHeader += ' <a href="#" class="m-widget2__link">' +
        price + currency + ' /' + cryptoCurrencyCode +
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
      console.log("payment_method", payment_details)
      var htmlTradeHeader = '';
      htmlTradeHeader += '<p>' + ' <a href="payment_method" class="m-widget2__link">' +
        payment_details + ' </a>' +
        '<i class="fa fa-exclamation-circle" title=" LocalBitcoins.com is not authorized, approved, endorsed or sponsored by this specific payment method or its trademark owner. The payment method is listed here for informative purposes only to display that the advertiser is willing to settle the trade by using this specific payment method. LocalBitcoins.com cannot guarantee that the listed payment method is actually used for making the settlement."> </i>' +
        '</p>'
      $(".payment_method").append(htmlTradeHeader);
    },
    setUser: function(user, user_id, cryptoCurrency) {
      var htmlTradeHeader = '';

      // $('#userPopUP').popover({ html: true });

      htmlTradeHeader +=
        '<p>' +
        '<a href="#/userProfile?id=' + user_id + '&currency=' + cryptoCurrency + '">' + user + '</a>' +
        '</p>';

      /*  htmlTradeHeader += '<i class="fa fa-user">' + '</i>' +
         user + '<span title="" class="online-status online-status-recent" data-original-title="User ' + user + ' last seen online 19&nbsp;minutes ago">' +
         '<i class="fa fa-circle">' +
         '</i>' +
         '</span>'; */

      $(".username").append(htmlTradeHeader);

    },
    setTradeLimits: function(max_trans_limit, min_trans_limit, currency) {
      var _ref$max_trans_limit = max_trans_limit;
      var _ref$min_trans_limit = min_trans_limit;
      _ref$max_trans_limit = _ref$max_trans_limit === undefined || '' ? 0 : _ref$max_trans_limit;
      _ref$min_trans_limit = _ref$min_trans_limit === undefined || '' ? 0 : _ref$min_trans_limit;
      // = max_trans_limit = max_trans_limit === undefined || '' ? 0 : max_trans_limit;
      // var min_trans_limit = min_trans_limit = min_trans_limit === undefined || '' ? 0 : min_trans_limit;

      var htmlTradeHeader = '';
      htmlTradeHeader += '<p>' + _ref$min_trans_limit +
        '-' +
        _ref$max_trans_limit + ' ' +
        currency + '</p>';
      $(".trade_limits").append(htmlTradeHeader);

      htmlTradeHeader = '';
      htmlTradeHeader += ' The biggest amount you can sell to this ad is  ' + _ref$max_trans_limit + ' INR.';
      $("#under_min_error").append(htmlTradeHeader);

      htmlTradeHeader = '';
      htmlTradeHeader += 'The smallest amount you can sell to this ad is  ' + _ref$min_trans_limit + '    INR.';
      $("#over_max_error").append(htmlTradeHeader);
    },
    setLocation: function(location, cryptoCurrency, cryptoCurrencyCode) {
      console.log("location", location)
      var htmlTradeHeader = '';
      htmlTradeHeader += `<p>` +
        `<a href=./#/?cryptoCurrency=` + cryptoCurrency + `&code=` + cryptoCurrencyCode + `&location=` + location + `> ` + location + `</a></p>`;
      $(".location").append(htmlTradeHeader);
    },
    verifyTrader: function(cryptoCurrency, traderType, location, payment_details, user, tradeMethod, code) {
      var cryptoCurrency = _core.chkNullValue(cryptoCurrency);
      var location = _core.chkNullValue(location);
      var payment_details = _core.chkNullValue(payment_details);
      var tradeMethod = _core.chkNullValue(tradeMethod);
      var user = _core.chkNullValue(user);

      console.log("To set Header currency, location, payment_details, tradeMethod, user==>", cryptoCurrency, location, payment_details, tradeMethod, user);

      var htmlTradeHeader = '';
      if (tradeMethod == 'ONLINE') {

        $('.paymentWindow').removeClass('hidden');
        $('.paymentWindow').show();
        if (traderType == 'SELL') {
          htmlTradeHeader +=
            '<h3 class="m-portlet__head-text">' + ' ' +
            'Buy ' + cryptoCurrency + ' using' + ' ' + payment_details + ' ' + location + ' ' + '  with Indian Rupee (INR)' +
            '</h3> ';

        } else {


          htmlTradeHeader +=
            '<h3 class="m-portlet__head-text ">' + ' ' +
            'Buy' + ' ' + cryptoCurrency + ' using' + ' ' + payment_details + '  Transfer   ' + location + ' ' + '  with Indian Rupee (INR)' +
            '</h3>';

        }

      } else {
        if (traderType == 'SELL') {

          htmlTradeHeader +=
            '<h3  class="m-portlet__head-text ">' + ' ' +
            'Sell your ' + cryptoCurrency + '  ' + '  with cash' +
            '</h3> ';
          //   '<p class="ad-description">' +
          //   'LocalBitcoins.com' + ' user' + ' <i>' +
          //   user + '  ' +
          //   '</i>' + ' wishes to buy bitcoins from you.'
          // '</p>';
        } else {
          // $('.Opening_hours_main').show();
          htmlTradeHeader += '<h3 class="m-portlet__head-text ">' + ' ' +
            'Buy' + ' ' + cryptoCurrency + '  with cash ' +
            '</h3> ';

        }
      }
      $(".headTitle").append(htmlTradeHeader);


    }

  }

  var _bind = {
    getCurrencySellerBuyerInfo: function() {
      console.log("sellBuyCurrency.js");
      var htmlContent = '<div class="popover" style="margin-left:70px" ;padding:20px><div class="arrow">' +
        '</div><h3 class="popover-title" > This is title</h3>' +
        '<div class="popover-content" id="popoverContent"></div>' +
        '<div class="popover-footer" style="  background: ghostwhite; ">' +
        '<a  class="btn btn-metal m-btn m-btn--icon m-btn--wide">' +
        '<span id="addClass" onclick="myFunction()">' +
        '<i class="fa fa-facebook-messenger"></i>' +
        '<span style="margin-left:10px">Message</span>' +
        '</span>' +
        '</a></div></div>';

      $("#removeClass").click(function() {
        $('#qnimate').removeClass('popup-box-on');
      });

      $('[data-toggle="popover"]').popover({
        html: true,
        placement: "bottom",

        template: htmlContent,
        onchange: function() {
          $("#addClass").click(function() {
            console.log(" clickedddddddd");
            $('#qnimate').addClass('popup-box-on');
          });
        }

        // trigger: "hover",
        // content = "Some content inside the popover<br>jkjkkfkdjfdkjf<hr>",
      });

      $('#send_message').click(function() {

        var message = $('#status_message').val();
        var datObject = {
          message: message,
        }
        var token = localStorage.getItem('token');

        var isToken = GlobalEvent.checkIfToken(token)
        if (isToken) {
          _core.getCurrencySellerBuyerInfo(message, token, function(res) {
            if (res) {
              console.log("response when msg send");
            }
          })
        }


      })

      $('#popup_username').click(function() {
        console.log("popup user click");
        $("#addClass").click(function() {
          console.log(" clickedddddddd");
          $('#qnimate').addClass('popup-box-on');
        });
      })
      var urlParams = _core.getUrlVars();
      var id = urlParams.id;

      var cryptoCurrencyCode = urlParams.cryptoCurrencyCode;
      var currency = urlParams.currency;

      console.log("User id=>", id, cryptoCurrencyCode);
      _core.getCurrencySellerBuyerInfo(id, function(res) {
        if (res) {
          console.log("response from getCurrencySellerBuyerInfo", res);

          if (res.isError) {
            console.log("response from getCurrencySellerBuyerInfo", res.isError);
          }
          var data = res.data;
          var cryptoCurrency = data.cryptoCurrency;
          var traderType = data.traderType;
          var location = data.location;
          var payment_details = data.payment_method;
          var user_id = data.user;
          var user = data.firstName;
          var traderType = data.traderType;
          var tradeMethod = data.tradeMethod;
          var max_trans_limit = data.more_information.max_trans_limit;
          var min_trans_limit = data.more_information.min_trans_limit;
          var price = data.more_information.price_equation;
          var terms_of_trade = data.more_information.terms_of_trade;
          var opening_hours = data.more_information.opening_hours;
          $('#ad_paymentMethod').append(payment_details);
          if (data.payment_window) {
            var payment_window = data.payment_window;
            var hours = Math.floor(parseInt(payment_window) / 60);
            var minutes = parseInt(payment_window) % 60;
            $('#paymentWindow').html(hours + ' hour and ' + minutes + ' minutes.');
          }

          _core.verifyTrader(cryptoCurrency, traderType, location, payment_details, user, tradeMethod);
          _core.setPrice(price, currency, cryptoCurrencyCode);
          _core.setLocation(location, cryptoCurrency, cryptoCurrencyCode);
          _core.setOpeninghours(opening_hours);
          _core.setUser(user, user_id, cryptoCurrency);
          _core.setTerms(terms_of_trade, user);
          _core.setTradeLimits(max_trans_limit, min_trans_limit, currency);

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

function myFunction() {
  $("#addClass").click(function() {
    console.log(" clickedddddddd");
    $('#qnimate').addClass('popup-box-on');
  });
}