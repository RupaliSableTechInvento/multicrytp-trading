var Profile = {};
((function() {
  console.log("profile.js=>");
  this.init = function() {
    _render.content();
  }
  var _core = {
    verification: API.verification,
    emailVerification: API.emailVerification,
    readURL: function(imgInput) {
      if (imgInput.files && imgInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          console.log("img changed");
          $("#img_upload_pic").attr('src', e.target.result);
        }
        reader.readAsDataURL(imgInput.files[0]);
      }
    },

    showErrorMsg: function(form, type, msg) {
      var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
        <button type="button" class="close" style="margin-top:10px" data-dismiss="alert" aria-label="Close"></button>\
        <span></span>\
      </div>');
      form.find('.alert').remove();
      alert.prependTo(form);
      alert.animateClass('fadeIn animated');
      alert.find('span').html(msg);
    }



  }
  var _bind = {
    profileSettings: function() {




      /*    $('form').submit(function(){
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
      });
 */


      $("#input_upload_pic").change(function() {
        _core.readURL(this);
        console.log("img accepting");

      });
      $(".upload_profile_pic").click(function(e) {
        $(headerElms.input_upload_pic).click()
      })
    },

    verification: function() {
      var token = localStorage.getItem('token');

      var dataObj = {
        token: token
      }

      _core.verification(dataObj, function(res) {

        if (res) {

          if (res.isError) {
            alert("error");

          }
          var email_verified = res.data[0].verification.email_verified;
          var mobile_verified = res.data[0].verification.mobile_verified;
          var first_name = res.data[0].first_name;
          var last_name = res.data[0].last_name;
          var email = res.data[0].email

          console.log("email_verified", email_verified, res.data[0].first_name);

          $("#first_name").val(first_name);
          $("#last_name").val(last_name),
            $("#email").val(email);
          $('.E_mail_Verified').empty();
          $('.phone_no_Verified').empty();
          if (email_verified) {
            $('.set_up_email').hide();

            $('.E_mail_Verified').html('<label style="color:green";>' + email_verified + '</label>');
            console.log("email verified true..");
          } else {
            $('.set_up_email').show();
            $('.E_mail_Verified').html('<label style="color: red";>' + email_verified + '</label>'),
              console.log("email verified false..");
          }

          //on setUp Email


          $('#m_profile_set_up_email').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');
            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            _core.emailVerification(email, function(res) {
              if (res) {
                if (res.isError) {

                  setTimeout(function() {
                    _core.showErrorMsg(form, 'danger', 'Email is not verified. ');

                  }, 2000)


                } else {
                  console.log("res=>>", res);


                  setTimeout(function() {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    form.clearForm();
                    form.validate().resetForm();
                    // display signup form
                    // displaySignInForm();
                    // var signInForm = login.find('.m-login__signin form');
                    //signInForm.clearForm();
                    //signInForm.validate().resetForm();
                    _core.showErrorMsg(form, 'success', 'Thank you. please check your Email');
                  }, 2000);
                  if (res.data == 'email_verified') {

                    setTimeout(function() {
                      btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                      form.clearForm();
                      form.validate().resetForm();
                      // display signup form
                      // displaySignInForm();
                      // var signInForm = login.find('.m-login__signin form');
                      //signInForm.clearForm();
                      //signInForm.validate().resetForm();
                      _core.showErrorMsg(form, 'success', 'Thank you. Your Email is verified');
                    }, 2000);
                    $('.E_mail_Verified').empty()
                    $('.E_mail_Verified').html('<label style="color:green";>' + email_verified + '</label>')

                  }
                }
              }
            })



          })



          /*   $('.set_up_email').unbind().click(function() {
              _core.emailVerification(email, function(res) {
                if (res) {
                  if (res.isError) {
                    console.log(res.error)
                  } else {
                    console.log("res=>>", res);
                    if (res.data == 'email_verified') {
                      $('.E_mail_Verified').empty()
                      $('.E_mail_Verified').html('<label style="color:green";>' + email_verified + '</label>')

                    }
                  }
                }
              })
            }) */

          if (mobile_verified) {
            $('.set_up_phoneNo').hide();
            $('.phone_no_Verified').append('<label style="color: green";>' + mobile_verified + '</label>')

          } else {
            // $('.set_up_phoneNo').show();
            // $('.phone_no_Verified').append('<label style="color: red";>' + mobile_verified + '</label>')
          }
        }
      })
    }

  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/profile.html', 'profile', function() {
        console.log("render in profile.js");
        _bind.verification();
        // _bind.profileSettings();
        // _bind.addUserInfo();

      })
    }
  }
}).bind(Profile))();