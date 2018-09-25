var ForgetPassword = {};
((function() {
  console.log("forgetPassword.js");
  this.init = function() {
    _render.content();
  }
  var _core = {
    forgetPassword: API.forgetPassword,
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
    }

  }

  var _bind = {
    forgetPassword: function() {
      $('#m_login_forget_password_submit').click(function(e) {
        e.preventDefault();
        var btn = $(this);
        var form = $(this).closest('form');

        form.validate({
          rules: {
            email: {
              required: true,
              email: true
            }
          }
        });

        if (!form.valid()) {
          return;
        }

        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

        form.ajaxSubmit({
          url: "/forgetPassword",
          type: "POST",
          success: function(successData) {
            console.log("please check your email");
            setTimeout(function() {
              btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false); // remove 
              form.clearForm(); // clear form
              form.validate().resetForm(); // reset validation states        
              _core.showErrorMsg(form, 'success', 'Cool! Password recovery instruction has been sent to your email.');
            }, 2000);
          },
          error: function(err) {
            setTimeout(function() {
              btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
              _core.showErrorMsg(form, 'danger', 'Unable to change password ');

            }, 2000)
            form.clearForm();
            window.location.replace("#/");
          }

        });
      });
      $('#m_login_signup').click(function() {
        window.location.replace("#/signup");

      })


    }
  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/forgetPassword.html', 'forgetPassword', function() {
        _bind.forgetPassword()
      })
    }
  }
}).bind(ForgetPassword))()