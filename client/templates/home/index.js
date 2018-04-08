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
    getAllTrade: API.getAllTrade,
  }

  var _bind = {
    getAllTrade: function() {
      _core.getAllTrade(function(res) {
        if (res) {
          console.log("res", res);
          var htmlTemp = '';
          res.data.forEach(function(item) {
            var name = 'name' in item ? item.name : '';
            var location = 'trade_type' in item ? ('location' in item.trade_type ? item.trade_type.location : '') : '';
            var price = 'more_information' in item ? ('price_equation' in item.more_information ? item.more_information.price_equation : '') : '';
            var max_trans_limit = 'more_information' in item ? ('max_trans_limit' in item.more_information ? item.more_information.max_trans_limit : '') : '';
            var min_trans_limit = 'more_information' in item ? ('min_trans_limit' in item.more_information ? item.more_information.min_trans_limit : '') : '';
            htmlTemp += '<div class="div-flexrow ">' +
              '<div class="flex_row_title">' +
              '<label class="flex_row_title_value" id="userName">' + name + '</label>' +
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

              '<div class="flex_row_btn-buy"><input type="button" value="Buy" class="btncorners" /></div>' +
              '</div>';
            // htmlTemp += temp.replace("%Name%", name).replace("%Location%", location).replace("%Price%", price).replace("%min_trans_limit%", min_trans_limit).replace("%max_trans_limit%", max_trans_limit)

          })
          console.log("htmlTemp", htmlTemp)
          $("#trade_block").append(htmlTemp)
        } else {
          console.log("no response");
        }
      })

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
        _bind.getAllTrade()


        /*  _bind.singUpUser();
         _bind.logInUser(); */
      })
    }
  }
}).bind(Home))()