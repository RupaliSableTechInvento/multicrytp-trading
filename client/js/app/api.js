var API = {
  login: function(dataObj, cb) {
    $.ajax({
      url: "/login",
      data: dataObj,
      type: "POST",
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })
  },
  register: function(dataObj, cb) {
    $.ajax({
      url: "/register",
      data: dataObj,
      type: "POST",
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })
  },
  forgetPassword: function(dataObj, cb) {
    $.ajax({
      url: "/forgetPassword",
      data: dataObj,
      type: "POST",
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })
  },
  resetPassword: function(dataObj, token, cb) {
    // delete dataObj.errormsg;
    console.log("[][][][]", window.localStorage.token, dataObj);
    // var token=window.localStorage.token;
    $.ajax({
      url: "/recoverPassword",
      headers: { 'authorization': token },
      data: dataObj,
      type: "POST",
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })
  },
  changePassword: function(dataObj, token, cb) {
    $.ajax({
      url: "/users/changePassword",
      data: dataObj,
      type: "POST",
      headers: {
        "authorization": token,
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })
  },
  postTrade: function(dataObj, token, cb) {
    $.ajax({
      url: "/trade",
      data: dataObj,
      type: "POST",
      headers: {
        "authorization": token,
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })
  },
  /*   getUserInfo: function(dataObj) {
      return new Promise(resolve => {
        console.log("dataobject in api.js=>", dataObj);
        $.ajax({
          url: "/users",
          data: dataObj,
          type: "get",
          success: function(successData) {
            resolve(successData)
          },
          error: function(err) {
            alert(err);
          }
        })
      });
    }, */
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
  }


}