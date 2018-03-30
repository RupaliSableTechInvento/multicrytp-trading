var ProfileSettings = {};
((function() {

  this.init = function() {
    _render.content();
  }
  var _core = {
    profileSettings: API.profileSettings,
    validateFields: function() {},
    readURL: function(imgInput) {
      if (imgInput.files && imgInput.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          console.log("img changed");

          $(headerElms.img_upload_pic).attr('src', e.target.result);
        }

        reader.readAsDataURL(imgInput.files[0]);
      }

    },
    validateEmail: function(sEmail) {
      var filter = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/;
      if (filter.test(sEmail)) {
        return true;
      }
      return false;
    }


  }

  var _bind = {
    profileSettings: function() {
      $(headerElms.btn_update_profile).unbind().click(function() {

          var dataObj = {
            first_name: $('#txt_firstname').val(),
            last_name: $('#txt_lastname').val(),
            nick_name: $('#txt_nickname').val(),
            email: $('#txt_email').val(),
            dob: $('#txt_dob').val(),
            cno: $('#txt_cno').val(),
            location: $('#txt_location')
          }
          if ((!_core.validateEmail(dataObj.email))) {
            $("#lbl_error").show();

            $("#lbl_error").empty();
            $("#lbl_error").append("<p> Invalid Email address </p>");

          }




        }),

        $(headerElms.input_upload_pic).change(function() {
          _core.readURL(this);
          console.log("img accepting");
        });

    }
  }
  var _render = {
    content: function() {
      renderMainFrame('templates/profileSettings/profileSettings.html', 'profileSettings', function() {
        _bind.profileSettings()


      })
    }
  }
}).bind(ProfileSettings))()