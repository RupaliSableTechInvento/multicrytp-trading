var RecoverPassword = {};
((function() {
  this.init = function() {
    _render.content();
  }
  var _core = {
    recoverPassword: API.recoverPassword,

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
    recoverPassword: function() {
      $('#submit-form_btn').click(function() {
        var btn = $(this);
        var form = $(this).closest('form');

        form.validate({
          rules: {
            password: {
              required: true,
              minlength: 6

            },
            rpassword: {
              required: true,
              minlength: 6,
              equalTo: "#password"

            },

          },
          messages: {

            password: {
              required: "please provide a password",
              minlength: "your password must be at least 6 characters long"

            },
            rpassword: {
              required: "please provide a password",
              minlength: "your password must be at least 6 characters long",
              equalTo: "please enter the same password as above",

            },

          }
        });

        if (!form.valid()) {
          return;
        }

        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        var temp = window.location.href.split('recoverPassword?')[1];
        var token = temp.split('=')[1];
        console.log("token", token);


        _core.recoverPassword($('#password').val(), token, function(res) {

          if (res) {

            if (res.isError) {
              setTimeout(function() {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                _core.showErrorMsg(form, 'danger', 'Unable to reset your password."' + res.data + '" ');

              }, 2000)

            } else {
              setTimeout(function() {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                form.clearForm();
                form.validate().resetForm();
                _core.showErrorMsg(form, 'success', 'Your password reset sucessfully. please login');
              }, 2000);

              window.location.href = "#/login";
              console.log("res", res);

            }


          }

        })




        // After validation code

        /*         if ($('#password').val() == $('#passwordcnfrm').val()) {
                  if (password.length > 6) {
                    console.log("length is greater than 6");
                    var temp = window.location.href.split('recoverPassword?')[1];
                    var token = temp.split('=')[1];
                    console.log("token", token);
                    console.log("new password=>", $('#password').val());



                    _core.recoverPassword($('#password').val(), token, function(res) {

                      if (res) {
                        if (res.isError) {


                          setTimeout(function() {
                            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

                            _core.showErrorMsg(form, 'danger', 'Unable to reset your password."' + res.data + '" ');

                          }, 2000)

                        } else {
                          setTimeout(function() {
                            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                            form.clearForm();
                            form.validate().resetForm();
                            _core.showErrorMsg(form, 'success', 'Your password reset sucessfully. please login');
                          }, 2000);

                          window.location.href = "#/login";
                          console.log("res", res);
                         
                        }
                      }
                    })

                  
                  } else {

                    setTimeout(function() {
                      btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

                      _core.showErrorMsg(form, 'danger', 'Password length must be greater than 6 digit. ');

                    }, 2000)

                  }

                } else {

                  setTimeout(function() {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

                    _core.showErrorMsg(form, 'danger', 'password  is not matched . ');

                  }, 2000)

                  console.log("password missmatched ");
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
//RecoverPassword.init();