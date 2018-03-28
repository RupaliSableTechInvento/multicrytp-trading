var Login = {};
((function() {

  this.init = function() {
    _render.content();
  }
  var _core = {
    submitForm: API.login
  }
  var _bind = {
    submitForm: function() {
      $('#btnlogin').unbind().click(function() {
        var input = $('.div-login input[type!=button]');

        for (var i = input.length - 1; i >= 0; i--) {
          if ($(input[i]).val() == "") {
            $(input[i]).addClass('error');
          } else {
            $(input[i]).removeClass('error');
          }
        }
        if ($('.div-login .error').length <= 0) {
          var dataObj = {
            email: $('#txtlogin').val(),
            password: $('#txtpwd').val(),
          }
          _core.submitForm(dataObj, function(res) {
            if (res.isError) {
              $("#lbl_msg").show();
              console.log("auth failed", res)
            } else {
              $("#lbl-login-sucess").show();
              $(headerElms.nav_menu).removeClass("hidden");
              $(headerElms.nav_menu_login).addClass("hidden");
              localStorage.setItem("token", res.token);
              localStorage.setItem('email', dataObj.email);
              //redirerect tp home page
              window.location.replace("/#/");
            }
            // if (res) {
            // 	console.log("res=>",res);
            // 	if(!res.token) {

            // 	}
            // 	else {


            // 	}

            // }
          })
        }

      })

    },
    bindRegisteruserForgetPass: function() {
      $(headerElms.lbl_redirect_register_user).unbind().click(function() {
        console.log("asdfd");
        window.location.href = "/#/register";
      })
      $(headerElms.lbl_redirect_reset_pwd).unbind().click(function() {
        window.location.href = "/#/forgetpassword";
      })
    },




  }

  var _render = {
    content: function() {
      renderMainFrame('templates/login/login.html', 'login', function() {
        _bind.submitForm()
        _bind.bindRegisteruserForgetPass();
      })
    }
  }
}).bind(Login))()