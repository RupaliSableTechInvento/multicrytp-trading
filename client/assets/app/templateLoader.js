(function() {
  window.renderMainFrame = function(url, nav, callback) {
    $('.main-frame').addClass('exit');
    // Loading.show({
    //   showTransparent:true
    // });
    setTimeout(function () {
      $("#main-frame").empty();
      $('#main-frame').load(url, function() {
          // Navigation.setActiveNav(nav);
          callback();
      });
    }, 600);

  }
 })();