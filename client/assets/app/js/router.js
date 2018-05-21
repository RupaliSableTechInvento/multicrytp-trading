(function() {
  $(document).ready(function() {
    console.log("")
    var app = $.sammy(function() {
      this.element_selector = '#main-frame';
      this.get('#/', function(context) {
        /* if (!checkIfToken()) {
          console.log("router.js login");
          Login.init();

          return;
        } else {
          
         

        } */
        console.log("router.js home");
        Home.init();

      });

      this.get('#/login', function(context) {
        console.log("router.js Login");
        Login.init();
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
        ChangePassword.init();
      });
      this.get('#/sellBuyCurrency', function(context) {
        SellBuyCurrency.init();
      });


    })
    app.run('#/');

    function checkIfToken() {
      var isToken = localStorage.getItem('token')
      if (isToken && isToken.length > 0) {
        return true;
      }
      return false;
    }
  });
})();