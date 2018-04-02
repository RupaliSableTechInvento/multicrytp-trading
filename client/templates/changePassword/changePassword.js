var ChangePassword = {};
((function() {

  this.init = function() {
    _render.content();
  }
  var _core = {
    changePassword: API.changePassword,
    validateFields: function() {},
    validateOldPassword: function(oldpassword) {
      if (oldpassword) {

      }


    }

  }

  var _bind = {
    changePassword: function() {
      $(headerElms.btn_change_pwd).unbind().click(function() {
        var input = $('.container input[type!=button]');

        for (var i = input.length - 1; i >= 0; i--) {
          if ($(input[i]).val() == "") {
            $(input[i]).addClass('error');
          } else {
            $(input[i]).removeClass('error');
          }

        }
        var token = localStorage.getItem('token');
        if ($('.container.error').length <= 0) {
          $(headerElms.lbl_error).empty();

          if (input.val().length <= 0) {
            $(headerElms.input_id_cnfrm_password).addClass('error');
          } else {
            var dataObj = {
              oldpassword: $(headerElms.input_id_old_password).val(),
              newpssword: $(headerElms.input_id_new_password).val(),
              passwordcnfrm: $(headerElms.input_id_cnfrm_password).val(),
            }
            var isError = false;
            var isPassLengthValid = (dataObj.newpssword.length <= 6);
            $(headerElms.lbl_error).empty();
            $(headerElms.lbl_error).show();
            if (isPassLengthValid) {
              $(headerElms.lbl_error).append("<p>password is too short  </p>");
              isError = true;
            }
            /*     if ((!_core.validateOldPassword(dataObj.oldpassword))) {
                  $(headerElms.lbl_error).empty();
                  $(headerElms.lbl_error).append("<p> Old password is not matched </p>");
                  isError = true;
                } */
            if (dataObj.newpssword !== dataObj.passwordcnfrm) {
              $(headerElms.lbl_error).append("<p> Password missmatch </p>");
              isError = true;
            } else if (isError === false) {
              $(headerElms.lbl_error).hide();
              _core.changePassword(dataObj, token, function(res) {
                if (res && res.isError) {
                  $(headerElms.lbl_error).show();
                  $(headerElms.lbl_error).append(res.data);
                } else {
                  window.location.href = "#/";
                }
              })

            }






          }

        }

      })
    }
  }
  var _render = {
    content: function() {
      renderMainFrame('templates/changePassword/changePassword.html', 'editProfile', function() {
        _bind.changePassword()


      })
    }
  }
}).bind(ChangePassword))()