var EditProfile = {};
((function() {

  this.init = function() {
    _render.content();
  }
  var _core = {
    editProfile: API.forgetPassword,
    validateFields: function() {},

  }

  var _bind = {
    editProfile: function() {

    }
  }
  var _render = {
    content: function() {
      renderMainFrame('templates/editProfile/editProfile.html', 'editProfile', function() {
        _bind.editProfile()


      })
    }
  }
}).bind(EditProfile))()