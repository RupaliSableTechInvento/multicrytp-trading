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
          console.log("tradeByCurrencyLoc api =>", err);
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
          console.log("addUserInfo api =>", err);
        }
      })
    });
  },
  acceptFriendRequest: function(token, senderEmail, cb) {
    console.log("acceptFriendRequest==>");
    $.ajax({
      url: "/acceptFriendRequest",
      type: "post",
      data: { senderEmail: senderEmail },
      headers: {
        "authorization": token,
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        console.log("acceptFriendRequest api =>", err);
      }
    })
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

  getCryptoCurrencyPriceEquation: function(params) {
    return new Promise(resolve => {
      $.ajax({
        // url: 'http://free.currencyconverterapi.com/api/v5/convert?q=' + dataObj.from + '_' + dataObj.to,
        url: 'https://api.cryptonator.com/api/ticker/' + params.from + '-' + params.to,
        type: "get",

        success: function(successData) {
          console.log("sucesss data in getCryptoCurrencyPriceEquation in api.js=> ", successData);
          resolve(successData)
        },
        error: function(err) {
          console.log("getCryptoCurrencyPriceEquation api =>", err);
        }
      })
    });
  },
  getPriceEquation: function(dataObj) {
    return new Promise(resolve => {
      // console.log("dataobject in getPriceEquation=>", dataObj);
      $.ajax({
        // url: "/getPriceEquation",
        // data: { dataObj: dataObj },
        // url: 'http://www.xe.com/currencyconverter/convert/?Amount=' + much + '&From=' + dataObj.from + '&To=' + dataObj.to,
        // url: 'https://api.cryptonator.com/api/ticker/' + dataObj.from + '-' + dataObj.to,
        url: 'http://free.currencyconverterapi.com/api/v5/convert?q=' + dataObj.from + '_' + dataObj.to,
        type: "get",

        success: function(successData) {
          console.log("sucesss data in price equation in api.js=> ", successData);
          resolve(successData)
        },
        error: function(err) {
          console.log("getPriceEquation api =>", err);
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
        console.log("changePassword api =>", err);
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
  emailVerification: function(token, cb) {
    $.ajax({
      url: "/emailverification",
      headers: {
        'authorization': token
      },
      type: "POST",
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        console.log("emailVerification api =>", err);
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
        // alert(err);
        console.log("getActiveUser==>error", err);

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
        console.log("getCurrencySellerBuyerInfo api =>", err);
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
        console.log("userProfile api =>", err);
      }
    })

  },

  blockUser: function(token, blockUserTo, cb) {
    $.ajax({
      url: "/blockUser",
      type: "post",
      data: { blockUserTo: blockUserTo },
      headers: {
        "authorization": token,
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        console.log("blockUser api =>", err);
      }
    })
  },
  turstUser: function(token, trustUserTo, cb) {
    $.ajax({
      url: "/turstUser",
      type: "post",
      data: { trustUserTo: trustUserTo },
      headers: {
        "authorization": token,
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        console.log("turstUser api =>", err);
      }
    })
  },
  getFriendsList: function(token, cb) {
    $.ajax({
      url: "/getFriendsList",
      type: "get",
      headers: {
        "authorization": token,
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        console.log("getFriendsList api =>", err);
      }
    })

  },
  addMessage: function(dataObj, token, cb) {
    $.ajax({
      url: "/addMessage",
      type: "post",
      headers: {
        "authorization": token,
      },
      data: dataObj,
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        console.log("addMessage api =>", err);
      }
    })
  },

  friendReq: function(token, dataObj, cb) {
    $.ajax({
      url: "/friendReq",
      type: "post",
      headers: {
        "authorization": token,
      },
      data: dataObj,
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        console.log("friendReq api =>", err);
      }
    })


  },


  verification: function(token, cb) {
    $.ajax({
      url: "/isVerified",
      headers: {
        "authorization": token,
      },
      type: "get",
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        console.log("verification api =>", err);
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
        console.log("sendMessage api =>", err);
      }
    })
  },
  getUserInfo: function(token, cb) {
    $.ajax({
      url: "/getUserInfo",
      type: "get",
      headers: {
        "authorization": token,
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        // alert(err);
        console.log("getUserInfo==>error", err);

      }
    })
  },
  addUserProfilePic: function(imgURL, token, cb) {
    console.log(" addUserProfilePic ==>", imgURL);
    $.ajax({
      url: "/addUserProfilePic",
      type: "POST",
      data: { imgURL: imgURL },
      headers: {
        "authorization": token,
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        console.log("addUserProfilePic api =>", err);
      }
    })
  },

  getAllMessagesWithFriend: function(token, cb) {
    $.ajax({
      url: "/getAllMessagesWithFriend",
      type: "get",
      headers: {
        "authorization": token,
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        // alert(err);
        console.log("getAllMessagesWithFriend==>error", err);

      }
    })
  },
  getAllMessages: function(token, cb) {
    $.ajax({
      url: "/getAllMessages",
      type: "get",
      headers: {
        "authorization": token,
      },
      success: function(successData) {
        cb(successData)
      },
      error: function(err) {
        // alert(err);
        console.log("getAllMessages==>error", err);

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
        console.log("Post trade api =>", err);
      }
    })
  },
}