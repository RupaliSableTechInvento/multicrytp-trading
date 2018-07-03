var ChangePassword = {};
((function() {
  this.init = function() {

    _render.content();
  }
  var _core = {
    changePassword: API.changePassword,

    showErrorMsg: function(form, type, msg) {
      var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
        <span></span>\
      </div>');
      form.find('.alert').remove();
      alert.prependTo(form);
      alert.animateClass('fadeIn animated');
      alert.find('span').html(msg);
    }

  }
  var _bind = {
    changePassword: function() {
      console.log("change password call");
      // $("#m_login_changePassword_submit").unbind().click(async function() {
      $("#m_login_changePassword_submit").unbind().click(function() {
        var btn = $(this);
        var form = $(this).closest('form');

        console.log("buttton clicked");
        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

        var token = localStorage.getItem('token');
        console.log("token=>", token);
        var dataObj1 = {
          password: $("#txtoldPassword").val(),
          new_pasword: $("#txtnewPassword").val(),
          passwordcnfrm: $("#txtconfirmPassword").val(),
        }
        var isError = false;
        var isPassLengthValid = (dataObj1.new_pasword.length <= 6);
        console.log("isPassLengthValid", isPassLengthValid);
        if (isPassLengthValid) {
          isError = true;

          setTimeout(function() {
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

            _core.showErrorMsg(form, 'danger', 'Password length must be greater than 6 digit. ');

          }, 2000)


          //_core.showErrorMsg(form, 'danger', 'Password length is short please try again. ');
        } else {
          var dataObj = {
            password: $("#txtoldPassword").val(),
            new_pasword: $("#txtnewPassword").val(),
            passwordcnfrm: $("#txtconfirmPassword").val(),

          }
          if (dataObj.new_pasword !== dataObj.passwordcnfrm) {
            console.log("Password not matched.")
            setTimeout(function() {
              btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

              _core.showErrorMsg(form, 'danger', 'Password not matched. ');

            }, 2000)

            isError = true;
          } else if (isError === false) {
            console.log("No Error");

            //const res = _core.changePassword(dataObj, token);

            _core.changePassword(dataObj, token, function(res) {
              console.log("res=>", res);
              if (res && res.isError) {
                console.log("error");
              } else {
                setTimeout(function() {
                  btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                  form.clearForm();
                  form.validate().resetForm();
                  // display signup form
                  // displaySignInForm();
                  // var signInForm = login.find('.m-login__signin form');
                  //signInForm.clearForm();
                  //signInForm.validate().resetForm();
                  _core.showErrorMsg(form, 'success', 'Your password changed sucessfully.');
                }, 2000);
                //window.location.href('#/profile')
                window.location.href = "#/profile";

                // _core.showErrorMsg(form, 'success', 'Your password changed sucessfully.');

              }
            })

          } else {
            setTimeout(function() {
              btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

              _core.showErrorMsg(form, 'danger', 'Unable to  change password ');

            }, 2000)


            console.log("can't change password");
          }

        }
      })
    }
  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/changePassword.html', 'changePassword', function() {
        _bind.changePassword()
      })
    }
  }
}).bind(ChangePassword))();
//ChangePassword.init();