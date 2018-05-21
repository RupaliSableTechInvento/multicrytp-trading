var ChangePassword = {};
((function() {
  this.init = function() {
    console.log("new change password.js");
    _render.content();
  }
  var _core = {
    changePassword: API.changePassword,
  }

  var _bind = {
    changePassword: function() {
      console.log("change password call");
      $("#m_login_changePassword_submit").unbind().click(async function() {
        var token = localStorage.getItem('token');
        console.log("token=>", token);
        var dataObj1 = {
          oldpassword: $("#txtoldPassword").val(),
          newpssword: $("#txtnewPassword").val(),
          passwordcnfrm: $("#txtconfirmPassword").val(),
        }
        var isError = false;
        var isPassLengthValid = (dataObj1.newpssword.length <= 6);
        if (isPassLengthValid) {
          isError = true;
          console.log("Password length is short.")
        } else {
          var dataObj = {
            oldpassword: $("#txtoldPassword").val(),
            newpssword: $("#txtnewPassword").val(),
            passwordcnfrm: $("#txtconfirmPassword").val(),
          }
          if (dataObj.newpssword !== dataObj.passwordcnfrm) {
            console.log("Password not matched.")
            isError = true;
          } else if (isError === false) {

            const res = await _core.changePassword(dataObj, token);
            console.log("res=>", res);

          } else {
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
ChangePassword.init();