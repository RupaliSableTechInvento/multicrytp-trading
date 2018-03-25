$(document).ready(function(){

  var isToken = localStorage.getItem('token')
  if(isToken && isToken.length > 0) {
      $(headerElms.nav_menu).removeClass("hidden");
      $(headerElms.nav_menu_login).addClass("hidden");
  }

  $(headerElms.signup_menu).unbind().click(function(){
    window.location.replace("/#/register");
  })

  $(headerElms.login_menu).unbind().click(function() {
      window.location.replace("/#/login");
  })

  $(headerElms.dropdown_content).unbind().click(function() {
    $(headerElms.nav_menu).addClass("hidden");
    $(headerElms.nav_menu_login).removeClass("hidden");
    localStorage.removeItem('token');
    localStorage.removeItem('email');
     window.location.replace("/#/");
  })

})
