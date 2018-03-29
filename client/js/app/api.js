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
  resetPassword: function(dataObj, cb) {
    delete dataObj.errormsg;
    $.ajax({
      url: "/recoverPassword",
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
  changePassword: function(dataObj, cb) {
    $.ajax({
      url: "/users/changePassword",
      data: dataObj,
      type: "POST",
      headers: {
        "authorization": localStorage.getItem("token"),
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })
  }


}