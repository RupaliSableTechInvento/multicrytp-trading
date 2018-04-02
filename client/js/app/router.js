(function() {


  $(document).ready(function() {
    var app = $.sammy(function() {
      this.element_selector = '#main-frame';

      this.get('#/', function(context) {
        Home.init();
      });

      this.get('#/login', function(context) {
        Login.init();
      });

      this.get('#/register', function(context) {
        if (checkIfToken()) {
          window.location = '#/';
          return;
        }
        Register.init();

      });
      this.get('#/dashboard', function(context) {
        if (!checkIfToken()) {
          window.location = '#/';
          return;
        }
        Dashboard.init();
      });
      this.get('#/forgetpassword', function(context) {
        if (checkIfToken()) {
          window.location = '#/';
          return;
        }
        ForgetPassword.init();
      });
      this.get('#/resetpassword', function(context) {
        if (checkIfToken()) {
          window.location = '#/';
          return;
        }
        ResetPassword.init();
      });
      this.get('#/editprofile', function(context) {
        if (!checkIfToken()) {
          window.location = '#/';
          return;
        }
        EditProfile.init();
      });
      this.get('#/changepassword', function(context) {
        if (!checkIfToken()) {
          window.location = '#/';
          return;
        }
        ChangePassword.init();
      });
      this.get('#/profilesettings', function(context) {
        if (!checkIfToken()) {
          window.location = '#/';
          return;
        }
        ProfileSettings.init();
      });
      this.get('#/postatrade', function(context) {
        if (!checkIfToken()) {
          window.location = '#/';
          return;
        }
        PostATrade.init();
      });



    })
    app.run('#/');

    function checkIfToken() {
      var isToken = localStorage.getItem('token')
      if (isToken && isToken.length > 0) {
        $(".div_right_header_log-in").removeClass("hidden");
        $(".div_right_header").addClass("hidden");
        return true;
      }
      return false;
    }

  });
})();