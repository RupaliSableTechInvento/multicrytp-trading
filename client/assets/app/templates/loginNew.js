var Login = {};
((function() {

  this.init = function() {
    _render.content();
  }
  var _core = {
    login: API.login,
    validateFields: function() {},
    showErrorMsg: function(form, type, msg) {
      var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
                <span></span>\
            </div>');

      form.find('.alert').remove();
      alert.prependTo(form);
      alert.animateClass('fadeIn animated');
      alert.find('span').html(msg);
    },

  }

  var _bind = {
    login: function() {
      $('#m_aside_left').css('display', 'none');

      $('.m-nav-sticky').css('display', 'none');

      $('#m_login_signin_submit').click(function(e) {
        e.preventDefault();
        var btn = $(this);
        var form = $(this).closest('form');

        form.validate({
          rules: {
            email: {
              required: true,
              email: true
            },
            password: {
              required: true,
              minlength: 6

            }
          },
          messages: {
            email: {
              required: "please enter your email"
            },
            password: {
              required: "please provide a password",
              minlength: "your password must be at least 6 characters long"
            }

          }
        });

        if (!form.valid()) {
          return;
        }

        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        var dataObj = {
          email: $('#txtlogin').val(),
          password: $('#txtpwd').val(),
        }

        form.ajaxSubmit({
          url: "/login",

          type: "POST",
          success: function(successData) {
            if (successData.isError) {
              setTimeout(function() {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                _core.showErrorMsg(form, 'danger', 'Incorrect username or password. Please try again.');
              }, 2000);

            } else {
              console.log("sucessdata=>", successData);
              var first_name = successData.user.first_name;
              var last_name = successData.user.last_name;
              // var BTC_isAddressCreated = successData.user.wallets['BTC'].isAddressCreated;
              // var LTC_isAddressCreated = successData.user.wallets['LTC'].isAddressCreated;
              // var DOGE_isAddressCreated = successData.user.wallets['DOGE'].isAddressCreated;


              // localStorage.setItem('BTC_isAddressCreated', BTC_isAddressCreated)
              // localStorage.setItem('LTC_isAddressCreated', LTC_isAddressCreated)
              // localStorage.setItem('DOGE_isAddressCreated', DOGE_isAddressCreated)
              localStorage.setItem("token", successData.data);
              localStorage.setItem('email', dataObj.email);
              localStorage.setItem("first_name", first_name);
              localStorage.setItem("last_name", last_name);
              localStorage.setItem('email', dataObj.email);
              localStorage.setItem('user_id', successData.user.id);
              $('.m-dropdown__inner ').css('display', 'block');
              window.location.replace("/");

            }


          },
          error: function(err) {
            setTimeout(function() {
              btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
              showErrorMsg(form, 'danger', 'Incorrect username or password. Please try again.');
            }, 2000);
            alert("login error=>", err);
          }
        });
      });

      $('#m_login_forget_password').click(function() {
        window.location.replace("#/forgetPassword");
      });
      $('#m_login_signup').click(function() {
        window.location.replace("#/signup");
      });


    }
  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/login.html', 'login', function() {

        _bind.login()

      })
    }
  }
}).bind(Login))()
//Login.init();