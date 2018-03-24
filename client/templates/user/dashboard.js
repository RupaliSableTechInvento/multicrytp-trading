var Dashboard = {};
((function() { 

  this.init = function() {
    _render.content();
  }

  var _core={
  	
  }
  var _bind = {
    
     }

  var _render = {
    content: function() {
      renderMainFrame('templates/user/dashboard.html', 'dashboard', function() {
			console.log("entered dashboard");
    	})
  	}
}
}).bind(Dashboard))()
