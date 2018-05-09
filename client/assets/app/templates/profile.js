var Profile = {};
((function() {

  this.init = function() {
    _render.content();
  }

  var _core = {
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

    }

  }

  var _render = {
    content: function() {
      _bind.profileSettings()
    }
  }
}).bind(Profile))()