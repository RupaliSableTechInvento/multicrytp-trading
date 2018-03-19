var Login = {};
((function() { 

  this.init = function() {
    _render.content();
  }

  var _render = {
    content: function() {
      renderMainFrame('templates/login/login.html', 'login', function() {
    	})
  	}
}
}).bind(Login))()
