$(document).ready(function() {
  $('#submit-form').unbind().click(function() {
    if ($('#pass').val() == $('#cpass').val()) {
      var token=window.location.href.split('recover/')[1];
      $.ajax({
        url:"/recoverPassword",
        headers:{
          'authorization':token
        }
        data:{password:$('#pass').val()},
        type:"post",
        success:function (successData) {
          alert(successData);
        },
        error:function (err) {
          alert(err);
        }
      })
    }
  })
})
