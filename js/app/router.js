(function(){


  $(document).ready(function(){
    var app = $.sammy(function () {
    this.element_selector = '#main';
    this.get('#/', function(context){
      console.log("context",context);
        context.render('templates/home/index.html').appendTo(context.$element());
    });
  })
  app.run('#/');
});
})();
