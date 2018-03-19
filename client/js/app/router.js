(function(){


  $(document).ready(function(){
    var app = $.sammy(function () {
    this.element_selector = '#main-frame';
    
    this.get('#/', function(context){
        Home.init();
    });
	
	   this.get('#/login', function(context){
       Login.init();
    });

    this.get('#/register', function(context){
       Register.init();
    });


  })
  app.run('#/');
});
})();
