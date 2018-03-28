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
      if(checkIfToken()) {
        window.location = '#/';
        return;
      }
       Register.init();
     
    });
    this.get('#/dashboard', function(context){
      Dashboard.init();
   });
    this.get('#/forgetpassword', function(context){
      ForgetPassword.init();
    });
    this.get('#/resetpassword', function(context){
      ResetPassword.init();
    });



  })
  app.run('#/');

  function checkIfToken() {
    var isToken = localStorage.getItem('token')  
		if(isToken && isToken.length > 0) {
			$(".div_right_header_log-in").removeClass("hidden");
      $(".div_right_header").addClass("hidden");
      return true;
    }
    return false;
  }

});
})();
