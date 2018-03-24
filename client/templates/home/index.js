var Home = {};
((function() { 

  this.init = function() {
    _render.content();
  }

  var _tabs = {
    buy:'.li-quick_buy',
    sell:'.li-quick_sell'
  }

  var _bind = {
    changeBuyActiveTab:function (elem,className) {
      $(elem).addClass(className)
    },
    changeBuySellTab:function(){
      $('.li-quick_buy').unbind().click(function () {
        console.log("active");
        $(_tabs.buy).addClass("active");
        $(_tabs.sell).removeClass("active")
    })

    $('.li-quick_sell').unbind().click(function () {
      $(_tabs.sell).addClass("active");
      $(_tabs.buy).removeClass("active")
  })

  },

  logoutUser:function(){
    $('.dropdown-content').unbind().click(function(){
      console.log("logout");

      $(".div_right_header_log-in").addClass("hidden");
      $(".div_right_header").removeClass("hidden");
     /*  localStorage.removeItem('token');
      localStorage.removeItem('email'); */
      window.location.replace("/#/");
    })
  },
  singUpUser:function(){
    $('#div-signUp').unbind().click(function(){
      window.location.replace("/#/register");
    })
  },
  logInUser:function(){
    $('#div_logIn').unbind().click(function(){
      window.location.replace("/#/login");
    })
  },


}

  var _render = {
    content: function() {
      renderMainFrame('templates/home/index.html', 'home', function() {
        _bind.changeBuyActiveTab(_tabs.buy,'active');
        _bind.changeBuySellTab();
        _bind.logoutUser();
        _bind.singUpUser();
        _bind.logInUser();
    	})
  	}
}
}).bind(Home))()
