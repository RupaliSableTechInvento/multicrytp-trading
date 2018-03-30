var Dashboard = {};
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
    changedNav_Tab: function() {
      $(headerElms.dashboard_menus + '> div').unbind().click(function() {
        $(headerElms.dashboard_menus + '> div').removeClass('active_tab');
        $(this).addClass('active_tab');
        $(headerElms.dashboard_menusData + '> div').removeClass('active_tab_data');
        console.log("$(this).attr(", $(this).attr("data-frame"));

        $("." + $(this).attr("data-frame")).addClass('active_tab_data');

      });

    },

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
      $(headerElms.img_upload_pic).click(function(e) {
        $(h.input_upload_pic).click()
      })

    }

  }

  var _render = {
    content: function() {
      renderMainFrame('templates/user/dashboard.html', 'dashboard', function() {
        console.log("entered dashboard");
        _bind.changedNav_Tab()
        _bind.profileSettings()
      })
    }
  }
}).bind(Dashboard))()