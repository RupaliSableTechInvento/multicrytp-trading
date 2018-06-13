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
        ChangePassword.init();
      });
      this.get('#/profile', function(context) {
        if (checkIfToken()) {
          Profile.init();
          return;
        }
        Home.init();

      });
      this.get('#/sellBuyCurrency', function(context) {
        console.log("Sell  By currency  in route");
        if (checkIfToken()) {
          SellBuyCurrency.init();

          return;
        }
        Home.init();

      });

      this.get('#/postatrade', function(context) {
        if (checkIfToken()) {
          PostATrade.init();
          return;
        }
        Home.init();
      });

    })
    app.run('#/');

    function checkIfToken() {
      var isToken = localStorage.getItem('token')
      if (isToken && isToken.length > 0) {
        $('.loginOutUser').hide();
        $('.loginUser').show();
        //  $('.dropdown__wrapper_login').hide();


        return true;
      }
      $('.loginUser').hide();
      $('.loginOutUser').show();
      // $('.loginOutUser').removeAttr("style")


      return false;
    }
  });
})();