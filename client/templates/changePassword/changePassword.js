var ChangePassword = {};
((function() {

  this.init = function() {
    _render.content();
  }
  var _core = {
    changePassword: API.changePassword,
    validateFields: function() {},

  }

  var _bind = {
    changePassword: function() {

    }
  }
  var _render = {
    content: function() {
      renderMainFrame('templates/changePassword/changePassword.html', 'editProfile', function() {
        _bind.changePassword()


      })
    }
  }
}).bind(ChangePassword))()