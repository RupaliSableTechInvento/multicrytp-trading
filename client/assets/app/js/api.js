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
  addUserInfo: function(dataObj) {
    return new Promise(resolve => {
      // console.log("dataobject in api.js=>", dataObj);
      $.ajax({
        url: "/users/addUserInfo",
        type: "post",
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




  /*   getPriceEquation: function(dataObj) {
      return new Promise(resolve => {
        // console.log("dataobject in api.js=>", dataObj);
        $.ajax({
          url: "/getPriceEquation",
          type: "get",
          data: dataObj,
          success: function(successData) {
            console.log("sucesss data in price equation=> ", successData);
            resolve(successData)
          },
          error: function(err) {
            alert(err);
          }
        })
      });
    }, */
  getPriceEquation: function(dataObj) {
    return new Promise(resolve => {
      console.log("dataobject in getPriceEquation=>", dataObj);

      $.ajax({
        url: 'https://api.cryptonator.com/api/ticker/' + dataObj.from + '-' + dataObj.to,
        type: "get",

        success: function(successData) {
          console.log("sucesss data in price equation=> ", successData);
          resolve(successData)
        },
        error: function(err) {
          alert(err);
        }
      })
    });
  },

  changePassword: function(params, token, cb) {
    console.log("params=>", params, token)

    $.ajax({
      url: "/users/changePassword",
      data: params,
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

  logout: function(token, cb) {
    $.ajax({
      url: "/logout",
      headers: {
        'authorization': token
      },
      type: "get",
      success: function(successData) {
        cb(successData)

      },
      error: function(err) {
        console.log("logout err=>", err);
      }
    })
  },
  emailVerification: function(email, cb) {
    $.ajax({
      url: "/emailverification",
      data: {
        email: email
      },
      type: "POST",
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })

  },
  recoverPassword: function(params, token, cb) {
    console.log("params=> recover password api call", params, token)
    $.ajax({
      url: "/recoverPassword",
      headers: {
        'authorization': token
      },
      data: {
        password: $('#password').val()
      },
      type: "post",
      success: function(successData) {
        cb(successData)
        console.log(" your password is set  =>", successData.data);
        /*         window.location.replace("#/login");
         */
      },
      error: function(err) {
        console.log("recoverpassword err=>", err);
      }
    })
  },
  getActiveUser: function(cb) {
    $.ajax({
      url: "/getActiveUser",
      type: "get",
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })
  },
  getCurrencySellerBuyerInfo: function(id, cb) {
    // console.log("dataobject in api.js=>", dataObj);
    $.ajax({
      url: "/sellerBuyerInfo",
      type: "get",
      data: {
        id: id
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })

  },
  userProfile: function(id, cb) {
    $.ajax({
      url: "/userProfile",
      type: "get",
      data: {
        id: id
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })

  },


  verification: function(dataObj, cb) {
    $.ajax({
      url: "/isVerified",
      data: dataObj,
      type: "get",
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        alert(err);
      }
    })

  },



  sendMessage: function(dataObj, token, cb) {
    $.ajax({
      url: "/sendMessage",
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
}