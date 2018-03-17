(function(){


  $(document).ready(function(){
    var app = $.sammy(function () {
    this.element_selector = '#main';
    this.get('#/', function(context){
      console.log("context",context);
        context.render('templates/home/index.html').appendTo(context.$element());
    });
	
	this.get('#/login', function(context){
      context.render('templates/login/login.html').appendTo(context.$element());
    });

    this.get('#/register', function(context){
      context.render('templates/register/register.html').appendTo(context.$element());
    });


  })
  app.run('#/');
});
})();
