var SignUp = {};
((function() {
  console.log("signup.js");
  this.init = function() {
    _render.content();
  }
  var _core = {
    signup: API.signup,
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
    signup: function() {
      $('#m_login_signup_submit').click(function(e) {
        e.preventDefault();
        var btn = $(this);
        var form = $(this).closest('form');

        form.validate({
          rules: {
            first_name: {
              required: true
            },
            last_name: {
              required: true
            },
            phone_no: {
              required: true,

            },
            email: {
              required: true,
              email: true
            },
            password: {
              required: true,
              minlength: 7

            },
            rpassword: {
              required: true,
              minlength: 7,
              equalTo: "#password"

            },
            agree: {
              required: true
            }
          },
          messages: {
            first_name: {
              required: "Please enter your first name"
            },
            last_name: {
              required: "Please enter your last name"
            },
            email: {
              required: "Please enter your email"

            },
            phone_no: {
              required: "Please enter your Phone number"
            },
            password: {
              required: "Please provide a password",
              minlength: "Your password must be at least 6 characters long"

            },
            rpassword: {
              required: "Please provide a password",
              minlength: "Your password must be at least 6 characters long",
              equalTo: "Please enter the same password as above",

            },
            agree: {
              required: "Please acceppt our policy"
            }

          }
        });

        if (!form.valid()) {
          return;
        }

        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        form.ajaxSubmit({
          url: "/register",
          type: "POST",
          data: {
            imgURL: "assets/app/media/img/users/Defaultuser.png"
          },
          success: function(successData) {
            // similate 2s delay
            setTimeout(function() {
              btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
              form.clearForm();
              form.validate().resetForm();
              // display signup form
              // displaySignInForm();
              // var signInForm = login.find('.m-login__signin form');
              //signInForm.clearForm();
              //signInForm.validate().resetForm();
              _core.showErrorMsg(form, 'success', 'Thank you. To complete your registration');
            }, 2000);
            window.location.replace("#/login");

          },
          error: function(err) {
            setTimeout(function() {
              _core.showErrorMsg(form, 'danger', 'registration is not completed. ');

            }, 2000)

            console.log("not registerd", err);
          }

        });
      });
      $('#m_login_signIn').click(function() {
        window.location.replace("#/login");

      })

    }
  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/signup.html', 'signup', function() {
        _bind.signup()


      })
    }
  }
}).bind(SignUp))()