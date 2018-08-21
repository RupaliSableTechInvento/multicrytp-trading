(function() {
  $(document).ready(function() {
    console.log("")
    var app = $.sammy(function() {
      this.element_selector = '#main-frame';
      this.get('#/', function(context) {
        if (!checkIfToken()) {
          Home.init();
          return;
        }

        console.log("router.js home");
        Home.init();

      });

      this.get('#/login', function(context) {
        if (checkIfToken()) {
          Home.init();
          return;
        }
        Login.init();
      });

      this.get('#/showMoreDetail', function(context) {
        console.log("showmoredetail in router .js");
        ShowMoreDetail.init();
      });
      this.get('#/quickOnline', function(context) {
        console.log("quickOnline in router .js");
        QuickOnline.init();
      });

      this.get('#/signup', function(context) {
        console.log("router.js signup");
        SignUp.init();
      });
      this.get('#/recoverPassword', function(context) {
        console.log("recoverPassword in router.js");
        RecoverPassword.init();
      });
      this.get('#/forgetPassword', function(context) {
        console.log("router.js forgetPassword");
        /*  if (checkIfToken()) {
           window.location = '#/';
           return;
         } */
        ForgetPassword.init();
      });
      this.get('#/changepassword', function(context) {
        console.log("#/changepassword");
        if (checkIfToken()) {
          ChangePassword.init();
          return;
        }
        Home.init();
      });
      this.get('#/profile', function(context) {
        if (checkIfToken()) {
          Profile.init();
          return;
        }
        Home.init();

      });
      this.get('#/userProfile', function(context) {

        UserProfile.init();

      });

      this.get('#/sellBuyCurrency', function(context) {
        console.log("Sell  By currency  in route");
        SellBuyCurrency.init();
        // if (checkIfToken()) {
        //   SellBuyCurrency.init();

        //   return;
        // }
        // Home.init();

      });

      this.get('#/postatrade', function(context) {
        if (checkIfToken()) {
          PostATrade.init();
          return;
        }
        Home.init();
      });
      this.get('#/currencySellerBuyerInfo', function(context) {
        console.log("CurrencySellerBuyerInfo in router .js");
        CurrencySellerBuyerInfo.init();
      });
      // GlobalEvent.init();
    })
    app.run('#/');

    // $('#logoutbtn').unbind().click(function() {
    //   console.log("logout btn clicked");
    //   var token = localStorage.getItem('token')
    //   console.log("token in logout=>", token);

    //   $.ajax({
    //     url: "/logout",
    //     headers: {
    //       'authorization': token
    //     },
    //     type: "get",
    //     success: function(successData) {
    //       if (successData.success) {
    //         localStorage.removeItem("token");
    //         localStorage.removeItem('email');
    //         localStorage.removeItem("first_name");
    //         localStorage.removeItem("last_name");
    //         localStorage.removeItem('user_id');
    //         window.location.replace("#/login");

    //       }
    //       socket.disconnect()
    //     },
    //     error: function(err) {
    //       console.log("logout err=>", err);
    //     }
    //   })

    // })

    // $('#loginbtn').unbind().click(function() {
    //   window.location.replace("#/login");
    // })

    function checkIfToken() {
      var isToken = localStorage.getItem('token')
      if (isToken && isToken.length > 0) {

        return true;
      }

      return false;
    }
  });
})();