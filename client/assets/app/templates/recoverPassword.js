var RecoverPassword = {};
((function() {
  this.init = function() {
    _render.content();
  }
  var _core = {
    recoverPassword: API.recoverPassword,
  }
  var _bind = {
    recoverPassword: function() {
      $('#submit-form_btn').click(function() {
        console.log("submit form btn click");
        var password = $('#password').val();
        var cnfrmpass = $('#passwordcnfrm').val();
        console.log("password and cnfrm", password, cnfrmpass);
        if ($('#password').val() == $('#passwordcnfrm').val()) {
          if ($('#password').val() > 6) {
            var temp = window.location.href.split('recoverPassword?')[1];
            var token = temp.split('=')[1];
            console.log("token", token);
            console.log("new password=>", $('#password').val());
            var res = _core.recoverPassword($('#password').val(), token);
            console.log("recoverPassword=>", res)

          } else {
            alert("length must be grater than 6 digit");
          }

        } else {
          console.log("password missmatched ");
        }

        /*  if ($('#password').val() == $('#cnfrmpass').val()) {
           if ($('#password').val().length > 6) {
           
             console.log("token", token);
             console.log("new password=>", $('#pass').val());
             var password = $('#pass').val();
             var res = _core.recoverPassword(password, token);
             console.log("recoverPassword=>", res)
           } else {
             console.log("password length is short");
           }
         } else {
           
         } */
      })

    }
  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/recover.html', 'recover', function() {
        _bind.recoverPassword();
      })

    }
  }
}).bind(RecoverPassword))()
RecoverPassword.init();