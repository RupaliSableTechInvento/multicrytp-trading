var changePassword = {};
((function() {
  console.log("ChangePassword.js")

  this.init = function() {
      console.log("init change password.js");
      _render.content();
    }
    //
  var _core = {
    changePassword = API.changePassword
    /*  
      getAPICall: async function(params, token) {
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
      } */


  }

  var _bind = {
    /*   getByCurrencyLoc: function() {
        console.log("getByCurrencyLoc get call");
        var params = { cryptoCurrency: 'BITCOIN', location: 'india', tradeMethod: 'LOCAL', traderType: 'SELL', limit: 10 }
        const res = _core.getAPICall(params)
        console.log("response", res);
        if (res && res.data.length > 0) {

        } else {
          console.log("no response");
        }
        // return res
      } */
    changePassword: function() {
      console.log("change password call");
      $("#m_login_changePassword_submit").unbind().click(async function() {
        var token = localStorage.getItem('token');
        console.log("token=>", token);
        var dataObj1 = {
          oldpassword: $("#txtoldPassword").val(),
          newpssword: $("#txtnewPassword").val(),
          passwordcnfrm: $("#txtconfirmPassword").val(),
        }
        var isError = false;
        var isPassLengthValid = (dataObj1.newpssword.length <= 6);
        if (isPassLengthValid) {
          isError = true;
          console.log("Password length is short.")
        } else {
          var dataObj = {
            oldpassword: $("#txtoldPassword").val(),
            newpssword: $("#txtnewPassword").val(),
            passwordcnfrm: $("#txtconfirmPassword").val(),
          }
          if (dataObj.newpssword !== dataObj.passwordcnfrm) {
            console.log("Password not matched.")
            isError = true;
          } else if (isError === false) {
            /*    $.ajax({
                 url: "/users/changePassword",
                 data: dataObj,
                 type: "POST",
                 headers: {
                   "authorization": token,
                 },
                 success: function(successData) {
                   if (successData && successData.isError) {
                     console.log("sucessdata", successData);

                   } else {
                     console.log("password sucessfully changed.", successData);
                   }
                 },
                 error: function(err) {
                   console.log(err);
                 }
               })  */
            const res = await _core.changePassword(dataObj, token);
            console.log("res=>", res);

          } else {
            console.log("can't change password");
          }

        }
      })
    }
  }
  var _render = {
    content: function() {
      console.log("render change password.js");
      _bind.changePassword();

    }
  }
}).bind(changePassword))();
//changePassword.init();