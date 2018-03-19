var Register = {};
((function() { 

  this.init = function() {
    _render.content();
  }

  var _render = {
    content: function() {
      renderMainFrame('templates/register/register.html', 'register', function() {
    	})
  	}
}
}).bind(Register))()
