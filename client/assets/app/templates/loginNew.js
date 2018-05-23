var Login = {};
((function() {
  console.log("loginNew.js");
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
      // $('.m-header').css('display', 'none');
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
              required: true
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
        console.log("email=>", dataObj.email, dataObj.password);

        form.ajaxSubmit({
          url: "/login",
          //data: dataObj,
          type: "POST",
          success: function(successData) {
            if (successData.isError) {
              console.log("sucessdata=>", successData);
            } else {
              console.log("sucessdata=>", successData);
              var first_name = successData.user.first_name;
              var last_name = successData.user.last_name;
              localStorage.setItem("token", successData.data);
              localStorage.setItem('email', dataObj.email);
              localStorage.setItem("first_name", first_name);
              localStorage.setItem("last_name", last_name);
              localStorage.setItem('email', dataObj.email);
              localStorage.setItem('user_id', successData.user.id);
              // window.location.href = "/";
              /*  $('#m-card-user__name').html(first_name);
               $('#m-card-user__email').html(dataObj.email); */
              $('.m-dropdown__inner ').css('display', 'block');
              window.location.replace("/");
              // window.location = 'updateProductById/' + sku;



            }

            // similate 2s delay
            setTimeout(function() {
              btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
              _core.showErrorMsg(form, 'danger', 'Incorrect username or password. Please try again.');
            }, 2000);
          },
          error: function(err) {
            alert(err);
          }
        });
      });

      $('#m_login_forget_password').click(function() {
        console.log("m_login_forget_password button click");
        window.location.replace("#/forgetPassword");
      });
      $('#m_login_signup').click(function() {
        console.log("signUp button click");
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