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
          var token = window.location.hash.split("=")[1];
          if (input.val().length <= 0) {
            $('#lbl_error').addClass('error');
          } else {
            var dataObj = {
              password: $('#txtpwd').val(),
              passwordcnfrm: $('#txtpwdcnfrm').val(),
            }
            var isPassLengthValid = (dataObj.password.length <= 6);
            $("#lbl_error").empty();
            $("#lbl_error").show();
            if (isPassLengthValid) {
              $("#lbl_error").append("<p>password is too short  </p>");
            } else {
              if (dataObj.password !== dataObj.passwordcnfrm) {
                $("#lbl_error").append("<p> Password missmatch </p>");
              } else {
                $("#lbl_error").hide();
                console.log("===>", token);
                _core.resetPassword(dataObj, token, function(res) {

                  if (res) {
                    if (res.isError) {
                      $("#lbl_error").empty();
                      $("#lbl_error").show();
                      $("#lbl_error").append(res.data);
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