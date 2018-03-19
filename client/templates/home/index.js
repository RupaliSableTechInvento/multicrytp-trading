var Home = {};
((function() { 

  this.init = function() {
    _render.content();
  }

  var _render = {
    content: function() {
      renderMainFrame('templates/home/index.html', 'home', function() {
    	})
  	}
}
}).bind(Home))()
