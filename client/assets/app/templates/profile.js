var Profile = {};
((function() {
  console.log("profile.js=>");
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
    },
    addUserInfo: function() {
      console.log("profile.js=> addUserInfo");
      $('.m-card-profile__name').empty();
      $('.m-card-user__name').empty();
      $('.m-card-profile__email').empty();
      $('.m-card-user__email').empty();
      var email = localStorage.getItem('email');
      var first_name = localStorage.getItem('first_name');
      var last_name = localStorage.getItem('last_name');
      $('.m-card-profile__email').append(email);
      $('.m-card-user__email').append(email);

      $('.m-card-profile__name').append(first_name + ' ' + last_name);
      $('.m-card-user__name').append(first_name + ' ' + last_name);

      $('#logoutbtn').unbind().click(function() {
        console.log("logout");
        window.location.href = "assets/snippets/pages/user/login.html";
        localStorage.removeItem("token");
        localStorage.removeItem('email');
        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");
        localStorage.removeItem('email');
        localStorage.removeItem('user_id');
      })
    }

  }
  var _render = {
    content: function() {
      renderMainFrame('assets/snippets/pages/user/profile.html', 'profile', function() {
        console.log("render in profile.js");
        _bind.profileSettings();
        _bind.addUserInfo();

      })
    }
  }
}).bind(Profile))();