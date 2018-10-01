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
    getPostTrade_ByUser: API.getPostTrade_ByUser,
    readURL: function(imgInput) {
      if (imgInput.files && imgInput.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          console.log("img changed");
          $("#img_upload_pic").attr('src', e.target.result);
          // make ajax call and save base64 in database
          var imgURL = e.target.result;
          console.log("imgURl", imgURL);
          _core.addUserProfilePic(imgURL, headerElms.token, function(res) {
            if (res) {
              $('#img_upload_pic').removeClass('m-loader m-loader--info')
              console.log("Profile Pic Upload status==>", res);
              if (!res.isError) {

                alert("profile img uploaded successfully", res)
              } else {
                console.log("profile imag unable to upload ==>", res.err);
              }
            }

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
      var isToken = GlobalEvent.checkIfToken(token)
      if (isToken) {
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

            if (!userData.verification.email_verified) {
              $('#set_up_email').removeClass('hidden')
              $('#email_verified').html('<label style="color: red";>' + userData.verification.email_verified + '</label>')
            } else {
              $('#set_up_email').addClass('hidden')
              $('#email_verified').html('<label style="color:green";>' + userData.verification.email_verified + '</label>');
            }
          }
        })

        _core.getPostTrade_ByUser(token, function(res) {
          console.log("getPostTrade_ByUser==>", res);
          var tradeArray = res.data;
          var Counter_Buy = 0;
          var Counter_sell = 0;
          for (let index = 0; index < tradeArray.length; index++) {
            if (tradeArray[index].traderType === 'BUY') {
              Counter_Buy++;
            } else {
              Counter_sell++;
            }

          }
          $('#TotalPostTrade').html(tradeArray.length);
          $('#sellPostTrade').html(Counter_sell);
          $('#buyPostTrade').html(Counter_Buy)

        })
      }
      $('#set_up_email').click(function(e) {
        e.preventDefault()
        var token = localStorage.getItem('token')
        var btn = $(this);
        var form = $(this).closest('form');
        btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

        var isToken = GlobalEvent.checkIfToken(token)
        if (isToken) {
          _core.emailVerification(token, function(res) {
            if (res) {
              if (res.isError) {
                console.log(res.data);
                var errorRes = res.data;
                if (responseCode = 534) {
                  //user email is not valid
                  btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                  // form.clearForm();
                  // form.validate().resetForm();
                  setTimeout(function() {
                    _core.showErrorMsg(form, 'danger', 'Email is not valid. ');

                  }, 2000)
                }
                if (responseCode = 535) {
                  //server Authentication error..
                  btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                  // form.clearForm();
                  // form.validate().resetForm();
                  setTimeout(function() {
                    _core.showErrorMsg(form, 'danger', 'Server is busy please try again. ');

                  }, 2000)
                }


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
                    // form.clearForm();
                    // form.validate().resetForm();
                    _core.showErrorMsg(form, 'success', 'Thank you. Your Email is verified');
                  }, 2000);
                  $('.E_mail_Verified').empty()
                  $('.E_mail_Verified').html('<label style="color:green";>' + email_verified + '</label>')

                }
              }
            }
          })

        }



      })
      $('#changepassword').unbind().click(function() {
        window.location.href = '#/changepassword'

      })


      $('#save-changes').unbind().click(function() {
        var phone_no = $('#phone_no').val();
        var btn = $(this);
        var form = $(this).closest('form');
        var isToken = GlobalEvent.checkIfToken(token)
        if (isToken) {
          var isFormValid = false;
          var first_name = $('#first_name').val()
          var last_name = $('#last_name').val()
          var email = $('#email').val()
          var phone_no = $('#phone_no').val();
          if (phone_no.length == 10 && first_name && last_name && email) {
            isFormValid = true

          } else {

            btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

            setTimeout(function() {
              _core.showErrorMsg(form, 'danger', 'Enter valid form details.');

            }, 2000)
          }
          if (isFormValid) {
            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
            var dataObj = {
              first_name: first_name,
              last_name: last_name,
              email: email,
              phone_no: phone_no
            }
            _core.addUserInfo(token, dataObj, function(res) {
              console.log("addUserInfo after res", res);
              if (res.success) {
                setTimeout(function() {
                  btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                  form.clearForm();
                  form.validate().resetForm();

                  _core.showErrorMsg(form, 'success', 'Thank you. Your profile updated sucessfully..');
                }, 2000);
                console.log("Sucess..", res);
              } else {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                console.log("cant update profile==>", res.data);
              }
            })
          }
        }


      })
      $("#imgupload").change(function() {
        // alert(this.files[0].size);
        var iSize = ($("#imgupload")[0].files[0].size / 1024);
        if (iSize / 1024 > 1) {
          $('#imghint').removeClass('hidden')
          alert("Please reselect Image its too large")
            // if (((iSize / 1024) / 1024) > 1) {
            //   iSize = (Math.round(((iSize / 1024) / 1024) * 100) / 100);
            //   console.log(iSize + "Gb");
            // } else {
            //   iSize = (Math.round((iSize / 1024) * 100) / 100)
            //   console.log(iSize + "Mb");
            // }
        } else {
          iSize = (Math.round(iSize * 100) / 100)
          if (iSize > 70) {
            $('#imghint').removeClass('hidden')

            alert("Please Reselect Image its too large")
          } else {
            $('#imghint').addClass('hidden')

            $('#img_upload_pic').addClass('m-loader m-loader--info')
            _core.readURL(this);

          }
          console.log(iSize + "kb");
        }

        // _core.readURL(this);


      });
      $("#userProfilePic").click(function(e) {
        $('#imgupload').trigger('click');

      })
    },
    
  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/profile.html', 'profile', function() {
        console.log("render in profile.js");
        // _bind.verification();
        _bind.profileSettings();
        // _bind.addUserInfo();

      })
    }
  }
}).bind(Profile))();