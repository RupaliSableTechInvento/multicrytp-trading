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
    }
  }
  var _bind = {
    profileSettings: function() {

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
          $('.set_up_email').unbind().click(function() {
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
          })

          if (mobile_verified) {
            $('.set_up_phoneNo').hide();
            $('.phone_no_Verified').append('<label style="color: green";>' + mobile_verified + '</label>')

          } else {
            $('.set_up_phoneNo').show();
            $('.phone_no_Verified').append('<label style="color: red";>' + mobile_verified + '</label>')
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