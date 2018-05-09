$(document).ready(function() {
  console.log("new password=>", $('#pass').val());

  $('#submit-form').unbind().click(function() {
    if ($('#pass').val() == $('#cpass').val()) {
      if ($('#pass').val().length > 6) {
        var temp = window.location.href.split('recover?')[1];
        var token = temp.split('=')[1];
        console.log("token", token);

        $.ajax({
          url: "/recoverPassword",
          headers: {
            'authorization': token
          },
          data: { password: $('#pass').val() },
          type: "post",
          success: function(successData) {
            console.log(" your password is set  =>", successData.data);
            window.location.href = "assets/snippets/pages/user/login.html";


          },
          error: function(err) {
            console.log("recoverpassword err=>", err);
          }
        })
      } else {
        console.log("password length is short");

      }

    } else {
      console.log("password missmatched ");
    }
  })
})