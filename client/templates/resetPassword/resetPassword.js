var ResetPassword = {};
((function() {

  this.init = function() {
    _render.content();
    console.log(API)
  }
  var _core = {
    resetPassword: API.resetPassword,
  }

  var _bind = {
    resetPassword: function() {
      $(headerElms.btn_reset_pwd).unbind().click(function() {

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
            $('#lbl_error').addClass('error');
          } else {
            var dataObj = {
              password: $('#txtpwd').val(),
              passwordcnfrm: $('#txtpwdcnfrm').val(),
              errormsg: $('#lbl_error'),
              token: window.location.hash.split("=")[1],
            }
            var isPassLengthValid = (dataObj.password.length <= 6);
            $(dataObj.errormsg).empty();
            $(dataObj.errormsg).show();
            if (isPassLengthValid) {
              $(dataObj.errormsg).append("<p>password is too short  </p>");
            } else {
              if (dataObj.password !== dataObj.passwordcnfrm) {
                $(dataObj.errormsg).append("<p> Password missmatch </p>");
              } else {
                $(dataObj.errormsg).hide();

                _core.resetPassword(dataObj, function(res) {
                  if (res) {
                    if (res.errors) {
                      $(dataObj.errormsg).append(res.error);
                      console.log(res.error)
                    } else {

                      console.log("res", res);
                      window.location.replace("/#/login");
                    }
                  }
                })
              }
            }

          }
        }
      })

    }
  }
  var _render = {
    content: function() {
      renderMainFrame('templates/resetPassword/resetPassword.html', 'resetPassword', function() {
        _bind.resetPassword();
      })
    }
  }
}).bind(ResetPassword))()