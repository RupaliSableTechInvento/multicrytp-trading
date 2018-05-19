var API = {
  getByCurrencyLoc: function(dataObj) {
    return new Promise(resolve => {
      // console.log("dataobject in api.js=>", dataObj);
      $.ajax({
        url: "/tradeByCurrencyLoc",
        type: "get",
        data: dataObj,
        success: function(successData) {
          resolve(successData)
        },
        error: function(err) {
          alert(err);
        }
      })
    });
  },

  changePassword: async function(params, token) {
    return new Promise(resolve => {
      console.log("params=>", params, token)
      $.ajax({
        url: "/users/changePassword",
        data: params,
        type: "POST",
        headers: {
          "authorization": token,
        },
        success: function(successData) {
          console.log("result=>", successData);
          if (successData.isError) {
            console.log("password could not be change")
          } else {
            console.log("password changed...")

          }
          resolve(successData);

        },
        error: function(err) {
          console.log("change password error=>", err);
        }
      })

    })
  },
  recoverPassword: async function(params, token) {

    console.log("params=> recover password api call", params, token)
    $.ajax({
      url: "/recoverPassword",
      headers: {
        'authorization': token
      },
      data: { password: $('#password').val() },
      type: "post",
      success: function(successData) {
        console.log(" your password is set  =>", successData.data);
        window.location.replace("#/login");

      },
      error: function(err) {
        console.log("recoverpassword err=>", err);
      }
    })


  },

}