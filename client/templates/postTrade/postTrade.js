var PostATrade = {};
((function() {

  this.init = function() {
    _render.content();
  }
  var _core = {
    postTrade: API.postTrade,
    validateFields: function() {},

  }

  var _bind = {
    postTrade: function() {
      $(headerElms.btn_publish_advertisement).unbind().click(function() {
        var dataObj = {
          "trade_type.iwant": $(".trade_type .radio input:checked").val(),
          "trade_type.location": $("#ad-location").val()

        }
        _core.postTrade(dataObj, function(res) {
          console.log("res", res)
        })
      })


    }
  }
  var _render = {
    content: function() {
      renderMainFrame('templates/postTrade/postTrade.html', 'postTrade', function() {
        _bind.postTrade()


      })
    }
  }
}).bind(PostATrade))()