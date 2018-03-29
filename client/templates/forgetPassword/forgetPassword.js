var ForgetPassword = {};
((function() {

  this.init = function() {
    _render.content();
  }
  var _core = {
    forgetPassword: API.forgetPassword,
    validateFields: function() {},
    validateEmail: function(sEmail) {
      var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
      if (filter.test(sEmail)) {
        return true;
      }
      return false;
    }
  }

  var _bind = {
    forgetPassword: function() {
      $('#btn_recover_pwd').unbind().click(function() {

        var input = $('.container input[type!=button]');

        for (var i = input.length - 1; i >= 0; i--) {
          if ($(input[i]).val() == "") {
            $(input[i]).addClass('error');
          } else {
            $(input[i]).removeClass('error');
          }

        }
        if ($('.container.error').length <= 0) {
          $("#lbl_error").empty();
          var input = $('input');
          if (input.val().length <= 0) {
            $('.txtemail').addClass('error');
          } else {
            if ((!_core.validateEmail(input.val()))) {
              $("#lbl_error").empty();
              $("#lbl_error").show();
              $("#lbl_error").append("<p> Invalid Email address </p>");
            } else {
              $("#lbl_error").empty();

              _core.forgetPassword({ email: input.val() }, function(res) {
                if (res) {
                  if (res.errors) {
                    $('#txtemail').addClass('error');
                    console.log(res.error)
                  } else {
                    console.log("res", res);
                    $("#lbl_error").show();
                    $("#lbl_error").append("<p>please check your Email </p>");

                  }
                }
              })
            }
          }
        }
      });
    }
  }
  var _render = {
    content: function() {
      renderMainFrame('templates/forgetPassword/forgetPassword.html', 'forgetPassword', function() {
        _bind.forgetPassword()


      })
    }
  }
}).bind(ForgetPassword))()