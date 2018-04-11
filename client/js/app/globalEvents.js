$(document).ready(function() {

  var isToken = localStorage.getItem('token')
  if (isToken && isToken.length > 0) {
    $(headerElms.nav_menu).removeClass("hidden");
    $(headerElms.nav_menu_login).addClass("hidden");
  }

  $(headerElms.signup_menu).unbind().click(function() {
    window.location.replace("/#/register");
  })

  $(headerElms.login_menu).unbind().click(function() {
    window.location.replace("/#/login");
  })

  $(headerElms.droup_dwn_logout).unbind().click(function() {
    $(headerElms.nav_menu).addClass("hidden");
    $(headerElms.nav_menu_login).removeClass("hidden");
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    window.location.replace("/#/");
  })

  $(headerElms.sub_menus + '> div').unbind().click(function() {
    $(headerElms.sub_menus + '> div').removeClass('active');
    $(this).addClass('active');
  });
  $(headerElms.remark).unbind().click(function() {
    window.location.replace("/#/");
  });
  $(headerElms.droup_dwn_dashboard).unbind().click(function() {
    window.location.replace("/#/dashboard");
  });
  $(headerElms.droup_dwn_editProfile).unbind().click(function() {
    window.location.replace("/#/editprofile");
  });


})