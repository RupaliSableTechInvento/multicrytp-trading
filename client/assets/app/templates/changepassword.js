var ChangePassword = {};
((function() {
  this.init = function() {

    _render.content();
  }
  var _core = {
    changePassword: API.changePassword,
    validateLength: function(data) {
      if (data.length >= 6) {
        return true;
      }
      return false;

    },

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

      // console.log("change password call");
      // $("#m_login_changePassword_submit").unbind().click(async function() {
      $("#m_login_changePassword_submit").unbind().click(function() {
        var btn = $(this);
        var form = $(this).closest('form');
        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        var token = localStorage.getItem('token');
        var password = $("#txtoldPassword").val()
        var new_pasword = $("#txtnewPassword").val()
        var passwordcnfrm = $("#txtconfirmPassword").val()
        var isPassLengthValid = _core.validateLength(new_pasword);
        if (!isPassLengthValid) {
          isError = true;
          setTimeout(function() {
            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
            _core.showErrorMsg(form, 'danger', 'Password length must be greater than 6 digit. ');
          }, 2000)
          form.clearForm();
        } else {
          if (isPassLengthValid && (new_pasword == passwordcnfrm)) {
            var dataObj = {
              password: password,
              new_pasword: new_pasword,
              passwordcnfrm: passwordcnfrm,
            }


            var isToken = GlobalEvent.checkIfToken(token)
            if (isToken) {
              _core.changePassword(dataObj, token, function(res) {
                console.log("res=>", res);
                if (res && res.isError) {
                  setTimeout(function() {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    _core.showErrorMsg(form, 'danger', 'Unable to change password.');

                  }, 2000)
                  form.clearForm();
                } else {
                  setTimeout(function() {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    form.clearForm();
                    form.validate().resetForm();
                    _core.showErrorMsg(form, 'success', 'Your password changed sucessfully.');
                  }, 2000);
                  form.clearForm();
                  window.location.href = "#/profile";

                }
              })

            }

          } else {

            setTimeout(function() {
              btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
              _core.showErrorMsg(form, 'danger', 'Password is not matched. ');

            }, 2000)
            form.clearForm();
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