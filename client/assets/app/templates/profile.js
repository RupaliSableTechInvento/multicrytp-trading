var Profile = {};
((function() {
  console.log("profile.js=>");
  this.init = function() {
    _render.content();
  }
  var _core = {
    logout: API.logout,
    getUserInfo: API.getUserInfo,
    verification: API.verification,
    emailVerification: API.emailVerification,
    addUserInfo: API.addUserInfo,
    addUserProfilePic: API.addUserProfilePic,
    readURL: function(imgInput) {
      if (imgInput.files && imgInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          console.log("img changed");
          $("#img_upload_pic").attr('src', e.target.result);
          // make ajax call and save base64 in database
          var token = localStorage.getItem('token')
          var imgURL = e.target.result;
          console.log("imgURl", imgURL);
          _core.addUserProfilePic(imgURL, token, function(res) {

            console.log("Profile Pic Upload status==>", res);
          })
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
      var token = localStorage.getItem('token')
      _core.getUserInfo(token, function(res) {

        console.log("getUserInfor..", res);
        if (!res.isError0) {
          var userData = res.data[0];
          $('#first_name').val(userData.first_name),
            $('#last_name').val(userData.last_name),
            $('#email').val(userData.email),
            $('#phone_no').val(userData.phone_no)
          if (!userData.imgURL) {
            $('#img_upload_pic').attr('src', 'assets/app/media/img/users/Defaultuser.png')
          } else {
            $('#img_upload_pic').attr('src', userData.imgURL)

          }
          // $('#img_upload_pic').attr('src', userData.imgURL)
          // $('#email_verified').html('' + userData.verification.email_verified);
          if (!userData.verification.email_verified) {
            $('#set_up_email').removeClass('hidden')
            $('#email_verified').html('<label style="color: red";>' + userData.verification.email_verified + '</label>')
          } else {
            $('#set_up_email').addClass('hidden')
            $('#email_verified').html('<label style="color:green";>' + userData.verification.email_verified + '</label>');
          }
        }
      })


      $('#m_profile_set_up_email').click(function(e) {
        e.preventDefault()
        var token = localStorage.getItem('token')
        var btn = $(this);
        var form = $(this).closest('form');
        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
        _core.emailVerification(token, function(res) {
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

                _core.showErrorMsg(form, 'success', 'Thank you. please check your Email');
              }, 2000);
              if (res.data == 'email_verified') {
                setTimeout(function() {
                  btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                  form.clearForm();
                  form.validate().resetForm();

                  _core.showErrorMsg(form, 'success', 'Thank you. Your Email is verified');
                }, 2000);
                $('.E_mail_Verified').empty()
                $('.E_mail_Verified').html('<label style="color:green";>' + email_verified + '</label>')

              }
            }
          }
        })



      })


      $('#save-changes').unbind().click(function() {
        var dataObj = {
          first_name: $('#first_name').val(),
          last_name: $('#last_name').val(),
          email: $('#email').val(),
          phone_no: $('#phone_no').val()
        }
        _core.addUserInfo(dataObj, function(res) {
          if (res.success) {
            console.log("Sucess..", res);
          }
        })
      })
      $("#imgupload").change(function() {
        _core.readURL(this);
        console.log("img accepting");

      });
      $("#userProfilePic").click(function(e) {
        $('#imgupload').trigger('click');

      })
    },

    verification: function() {
      var token = localStorage.getItem('token')
      var dataObj = {
        token: token
      }

      _core.verification(dataObj, function(res) {

        if (res) {}
      })
    }

  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/profile.html', 'profile', function() {
        console.log("render in profile.js");
        _bind.verification();
        _bind.profileSettings();
        // _bind.addUserInfo();

      })
    }
  }
}).bind(Profile))();