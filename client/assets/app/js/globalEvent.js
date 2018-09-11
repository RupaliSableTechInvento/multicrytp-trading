var GlobalEvent = {
  socket: '',
  checkIfToken: function(token) {
    if (token && token.length > 0) {
      $.ajax({
        url: "/getUserInfo",
        type: "get",
        headers: {
          "authorization": token,
        },
        success: function(successData) {
          if (!successData.isError) {
            if (successData.data.length > 0) {
              var userData = successData.data[0];
              console.log("successData.data getUserInfo=> ", successData.data);
              if (userData) {
                $('.m-card-user__name').html(userData.first_name + ' ' + userData.last_name),
                  $('.m-card-user__email').html(userData.email)
                if (!userData.imgURL) {
                  $('#m-card-user__img').attr('src', 'assets/app/media/img/users/Defaultuser.png')
                } else {
                  $('#m-card-user__img').attr('src', userData.imgURL)

                }
              }
            } else {

              GlobalEvent.logOut(token);

            }
          }
        },
        error: function(err) {
          console.log("getUserInfo err=>", err);
        }
      })
      $('.loginOutUser').hide();
      $('.loginUser').show();
      return true;
    }
    window.location.replace("#");
    $('.loginUser').hide();
    $('.loginOutUser').show();
    return false;
  },



  logOut: function(token) {
    $.ajax({
      url: "/logout",
      headers: {
        'authorization': token
      },
      type: "get",
      success: function(successData) {
        if (successData.success) {
          localStorage.removeItem("token");
          localStorage.removeItem('email');
          localStorage.removeItem("first_name");
          localStorage.removeItem("last_name");
          localStorage.removeItem('user_id');
          // socket.disconnect();
          $('.loginUser').hide();
          $('.loginOutUser').show();
          window.location.reload("");
        }

      },
      error: function(err) {
        console.log("logout err=>", err);
      }
    })

  },
};

((function() {


  var friends = [];
  var blockUserList = []; //Get Friend list 
  var arrImgURL = []; //Get friends ImgArray
  var arrNotificationMsgId = []; //Notification msg IDs
  var temparray = [];
  var tempobj = {};
  // var NotificationMSG = '';
  var tempArray = [];
  var tempNotifArray = [];
  var tempObj = {};
  var tempNotifObj = {};
  var unReadMsgsCount = '', //count of  Unread Msg
    totalUnReadMsgsCount = ''; //count of All unread Msgs
  // var socket = null;
  var token = localStorage.getItem('token')

  getAllUnreadMessages();
  var friend = 'sablerupali358@gmail.com';

  $('#logoutbtn').unbind().click(function() {
    GlobalEvent.logOut(token);
  })
  $('#m_topbar_messages_icon').unbind().click(function() {
    $('#m_topbar_msgNotification_icon').removeClass('m-animate-blink');
    $('#msgNotification').removeClass('m-animate-shake');
  })

  // function acceptFriendRequest() {
  //   $(document).on('click', '.btnAcceptReq', function() {

  //     var senderEmail = $(this).attr('data-user');
  //     console.log("senderEmail==>", senderEmail);
  //     var token = localStorage.getItem('token');
  //     var str = senderEmail.replace(/[^A-Z0-9]/ig, "_");
  //     var strid = str + 'btnAcceptReq';
  //     var reqAccepted = str + 'reqAccepted';

  //     $.ajax({
  //       url: "/acceptFriendRequest",
  //       type: "post",
  //       data: { senderEmail: senderEmail },
  //       headers: {
  //         "authorization": token,
  //       },
  //       success: function(successData) {
  //         GlobalEvent.socket.emit('frndReqAccepted', token)       
  //           console.log("Request accepted now friend");
  //         $('#' + strid).addClass('hidden')
  //         $('#' + reqAccepted).removeClass('hidden')
  //       },
  //       error: function(err) {
  //         console.log("Accept friend request ", err);
  //       }
  //     })

  //   })
  // }


  if (token && (token.length > 0)) {

    // $(".olUserList").empty();
    // socket = io.connect('http://localhost:8080');
    // socket = io();
    GlobalEvent.socket = io();

    GlobalEvent.socket.on('connect', function() {
      $(document).on('click', '#btn_Confirm', function() {
        // $("#btn_Confirm").unbind().click(function() {
        console.log("btn click..", $('#sendFriendReq').attr('reqTo'));

        var dataObj = {
          To: $('#sendFriendReq').attr('reqTo'),
          token: token
        }

        var isToken = GlobalEvent.checkIfToken(token)
        if (isToken) {
          GlobalEvent.socket.emit('friendReq', dataObj)

          $.ajax({
            url: "/friendReq",
            type: "post",
            headers: {
              "authorization": token,
            },
            data: dataObj,
            success: function(successData) {
              var res = successData
              if (res) {
                var isFound = res.isFound;
                if (isFound) {

                  // console.log("Request already sent");
                  $('#allreadyFrndModal').modal('show');
                  $("#sendFriendReq").hide();
                  $("#sendUnFriendReq").hide();
                  $("#friendReqAlreadySend").show();
                }
              }

            },
            error: function(err) {
              console.log("friendReq api =>", err);
            }
          })

        }

      });
      $(document).on('click', '.btnAcceptReq', function() {

        var senderEmail = $(this).attr('data-user');
        console.log("senderEmail==>", senderEmail);
        var token = localStorage.getItem('token');
        var str = senderEmail.replace(/[^A-Z0-9]/ig, "_");
        var strid = str + 'btnAcceptReq';
        var reqAccepted = str + 'reqAccepted';

        $.ajax({
          url: "/acceptFriendRequest",
          type: "post",
          data: { senderEmail: senderEmail },
          headers: {
            "authorization": token,
          },
          success: function(successData) {
            var dataObj = {
              To: senderEmail,
              token: token
            }
            GlobalEvent.socket.emit('frndReqAccepted', dataObj)
            console.log("Request accepted now friend");
            $('#' + strid).addClass('hidden')
            $('#' + reqAccepted).removeClass('hidden')
          },
          error: function(err) {
            console.log("Accept friend request ", err);
          }
        })

      })
      GlobalEvent.socket.emit('getActiveList', token, function(data) {
        console.log("getActiveList Data", data);
      })

      GlobalEvent.socket.emit('get friends', function(data) {
        console.log("data get freinds", data)
      });

      GlobalEvent.socket.on('reqAcceptedByFrnd', function(data) {
        console.log("reqAcceptedByFrnd using soket io ", data);
      });
      GlobalEvent.socket.on('friendReqRecieve', function(data) {
        console.log("friendReq using soket io ", data);
        friendReq(data);
      });
      GlobalEvent.socket.on('users', function(data) {
        console.log("users using soket io ", data);
      });
      GlobalEvent.socket.emit('setUser', 'hello world');

      GlobalEvent.socket.on('Notification_for_msg', function(dataMsg) {
        console.log("Notification_for_msg => ", dataMsg);
        if (!arrNotificationMsgId.includes(dataMsg._id)) {
          arrNotificationMsgId.push(dataMsg._id)
          var email = dataMsg.sender;
          console.log("Email to spit in notification");
          $('#m_topbar_msgNotification_icon').show();
          $('#m_topbar_msgNotification_icon').addClass('m-animate-blink');
          $('#msgNotification').addClass('m-animate-shake');
          var str = email.replace(/[^A-Z0-9]/ig, "_");
          // var toChatboxId = str[0];
          var toChatboxId = str;
          var htmlChatMSg = '';
          if (arrImgURL) {
            for (let index = 0; index < arrImgURL.length; index++) {
              if (arrImgURL[index].email == dataMsg.sender) {
                data_userProfile = arrImgURL[index].imgURL;
                // console.log("img found..", data_userProfile);
              }
            }
          }

          var chatTime = (moment(dataMsg.date).format('LTS'));
          var data = {
            first_name: dataMsg.senderName,
            message: dataMsg.message,
            chatTime: chatTime,
            data_User: email,
            data_time: dataMsg.date,
            data_userProfile: data_userProfile
          };
          htmlChatMSg = renderImgTextMsgReceive(data)
          $('#' + toChatboxId + ' .chat-msg').append(htmlChatMSg);
          Notifications(dataMsg);
        }

      });


      GlobalEvent.socket.on('friend_all', function(data) {
        console.log(" Online user  friend_all => ", data);
      });
      GlobalEvent.socket.on('greeting', function(data) {
        console.log(" greeting => ", data);
      });

      GlobalEvent.socket.on('friend_Ol', function(olUserEmail) {
        console.log("friend_Ol", olUserEmail);
        $(".olUserList li").each(function() {
          if ($(this).attr('data-email') == olUserEmail) {
            console.log("Friend ol==>", olUserEmail);
            $(this).find("span").addClass("online")

          }
        });
      });
      GlobalEvent.socket.on('friend_list', async function(friendListData) {
        friends = [];
        tempobj = {}
        temparray = [];
        blockUserList = [];
        arrImgURL = [];
        var userProfile = '',
          friendList = '';
        console.log("users friend_list using soket io", friendListData);
        friends = friendListData.friends;
        arrImgURL = friendListData.arrImgURL;
        if (friendListData) {
          for (var index = 0; index < friends.length; index++) {
            if (!temparray.includes(friends[index].senderEmail)) {
              tempobj[friends[index].senderEmail] = { senderFirstName: friends[index].senderFirstName, status: friends[index].status }
              temparray.push(friends[index]);
            }
          }
          // for (var index = 0; index < friends.length; index++) {
          //   for (var variable in tempobj) {
          //     if (tempobj.hasOwnProperty(variable)) {
          //       if (Data[index].sender == variable) {
          //         tempObj[variable].message.push(Data[index].message);
          //         tempObj[variable].senderName = Data[index].senderName;
          //         tempObj[variable].count++;
          //       }

          //     }
          //   }
          // }
          console.log("tempObj==>", tempobj, temparray);
          for (var variable in tempobj) {


            for (var j = 0; j < arrImgURL.length; j++) {
              if (arrImgURL[j].email === variable) {
                // console.log(" array when matched...==>", arrImgURL[j].email, friends[i].senderEmail);
                if (tempobj[variable].status == 'Blocked') {
                  blockUserList.push(friends[i].senderEmail)
                  console.log("blockUserList=>", variable);
                }
                friendList += `<li data-email=` + variable + ` style="cursor:pointer">
                <div style="display:inline-flex">
                  <span class="_1gyw" style="height:5px;width:5px"></span>
                  <div class="_1gyw" style="margin-right:10px">
                    <img src="` + arrImgURL[j].imgURL + `" width="32" height="32" alt="" class="img">
                  </div>
                  <div class="friendName">` + tempobj[variable].senderFirstName + `</div>
                </div>
                </li>`;
              }

            }



            // if (tempobj.hasOwnProperty(variable)) {
            //   var senderName = status;
            //   console.log("Variable GetAllUnreadMsg==>", variable);
            //   msgListCountHTML += renderUnreadMsgData(variable, senderName, tempobj[variable].count);
            // }
          }




          // for (var i = 0; i < friends.length; i++) {
          //   for (var j = 0; j < arrImgURL.length; j++) {
          //     if (arrImgURL[j].email === friends[i].senderEmail) {
          //       // console.log(" array when matched...==>", arrImgURL[j].email, friends[i].senderEmail);
          //       if (friends[i].status == 'Blocked') {
          //         blockUserList.push(friends[i].senderEmail)
          //         console.log("blockUserList=>", friends[i].senderEmail);
          //       }
          //       friendList += `<li data-email=` + friends[i].senderEmail + ` style="cursor:pointer">
          //       <div style="display:inline-flex">
          //         <span class="_1gyw" style="height:5px;width:5px"></span>
          //         <div class="_1gyw" style="margin-right:10px">
          //           <img src="` + arrImgURL[j].imgURL + `" width="32" height="32" alt="" class="img">
          //         </div>
          //         <div class="friendName">` + friends[i].senderFirstName + `</div>
          //       </div>
          //       </li>`;
          //     }

          //   }
          // }
        } else {
          friendList += ' <label> Your friend list is empty</label>'
        }

        $(".olUserList").html(friendList);
        userList();
      });
      GlobalEvent.socket.on('pending_list', function(data) {
        friendReq(data);

        // var requestCount = data.length;

        // var friend_req_list = '';

        // $('.friend_req_count').html(requestCount + "  New")
        // if (requestCount > 0) {
        //   $('.friend_req_list').empty();
        //   for (let index = 0; index < data.length; index++) {
        //     var email = data[index].senderEmail;
        //     // tempNotifArray = [];
        //     // tempNotifObj = {};
        //     var str = email.replace(/[^A-Z0-9]/ig, "_");
        //     var strid = str + 'btnAcceptReq';
        //     var reqAccepted = str + 'reqAccepted';
        //     friend_req_list += `<div class="m-list-timeline__item">
        //                               <span class="m-list-timeline__badge -m-list-timeline__badge--state-success"></span>
        //                               <span class="m-list-timeline__text">` +
        //       data[index].senderFirstName + `</span>
        //                               <span class="m-list-timeline__time acceptReq">
        //                             <button type="button" data-user="` + data[index].senderEmail + `" id="` + strid + `"class="btn m-btn m-btn--gradient-from-success m-btn--gradient-to-accent btnAcceptReq">Accept</button>
        //                             <a type="button" data-user="` + data[index].senderEmail + `" id="` + reqAccepted + `"class="btn m-btn m-btn--gradient-from-info m-btn--gradient-to-accent hidden  reqAccepted">Friend</a>

        //                             </span>

        //                             </div>`;

        //   }
        //   $('.friend_req_list').append(friend_req_list);
        //   acceptFriendRequest();
        // }

      });

    });

  }

  function friendReq(data) {
    var requestCount = data.length;

    var friend_req_list = '';

    $('.friend_req_count').html(requestCount + "  New")
    if (requestCount > 0) {
      $('.friend_req_list').empty();
      for (let index = 0; index < data.length; index++) {
        var email = data[index].senderEmail;
        // tempNotifArray = [];
        // tempNotifObj = {};
        var str = email.replace(/[^A-Z0-9]/ig, "_");
        var strid = str + 'btnAcceptReq';
        var reqAccepted = str + 'reqAccepted';
        friend_req_list += `<div class="m-list-timeline__item">
                                <span class="m-list-timeline__badge -m-list-timeline__badge--state-success"></span>
                                <span class="m-list-timeline__text">` +
          data[index].senderFirstName + `</span>
                                <span class="m-list-timeline__time acceptReq">
                              <button type="button" data-user="` + data[index].senderEmail + `" id="` + strid + `"class="btn m-btn m-btn--gradient-from-success m-btn--gradient-to-accent btnAcceptReq">Accept</button>
                              <a type="button" data-user="` + data[index].senderEmail + `" id="` + reqAccepted + `"class="btn m-btn m-btn--gradient-from-info m-btn--gradient-to-accent hidden  reqAccepted">Friend</a>

                              </span>
                            
                              </div>`;

      }
      $('.friend_req_list').append(friend_req_list);
      // acceptFriendRequest();
    }

  }

  function chatPopUP(data) {
    if (totalUnReadMsgsCount <= 0) {
      $('#m_topbar_msgNotification_icon').hide();
    }

    if (blockUser.length > 0) {
      blockUser.includes(data.data_FrndEmail)
    }
    var toChatboxId = data.toChatboxId;
    var olUserName = data.olUserName;
    var data_FrndEmail = data.data_FrndEmail;
    var data_userProfile = data.data_userProfile;
    var newChatHtml = `
    <div class="popup-box chat-popup popup-box-on qnimate" data-FrndEmail=` + data_FrndEmail + ` id="` + toChatboxId + `">
    <div class="popup-head">
      <div class="popup-head-left pull-left">
      <img src=` + data_userProfile + ` width="32"  height="32"alt="assets/app/media/img/users/Defaultuser.png">
      <label class="olUserName" >` + olUserName + `</label></div>
      <div class="popup-head-right pull-right">
        <div class="btn-group">
          <button class="chat-header-button" data-toggle="dropdown" type="button" aria-expanded="false">
          <i class="flaticon-cogwheel-2"></i></i> </button>
          <ul role="menu" class="dropdown-menu pull-right" data-FrndEmail=` + data_FrndEmail + `>
            <li><a href="#">Media</a></li>
            <li class="blockUser"><a href="#">Block</a></li>
            <li class="unblockUser hidden"><a href="#">Unblock</a></li>
            <li><a href="#">Clear Chat</a></li>
            <li class="unfriendTo" ><a href="#">Unfriend</a></li>
          </ul>
        </div>
        <button data-widget="remove" class="closePopUp chat-header-button pull-right la la-close" type="button"><i class="glyphicon glyphicon-off"></i></button>
      </div>
    </div>
    <div class="popup-messages">
      <div class="direct-chat-messages">

        <div class="chat-box-single-line">
          <abbr class="timestamp chatTimeStamp" id="chatTimeStamp"></abbr>
        </div>
       
        <div class="chat-msg">

        </div>
        <div class="chat-msgReceive hidden">

        </div>

      </div>

      <div class="popup-messages-footer">
      <textarea class="status_message` + toChatboxId + `" id="status_message" placeholder="Type a message..." rows="10" cols="40" name="message"></textarea>
      <div class="btn-footer">
        <button class="bg_none"><i class="glyphicon glyphicon-film"></i> </button>
        <button class="bg_none"><i class="glyphicon glyphicon-camera"></i> </button>
        <button class="bg_none"><i class="glyphicon glyphicon-paperclip"></i> </button>
        <button class="bg_none pull-right"><i class="m-nav__link-icon	flaticon-like"></i> </button>
      </div>
    </div>
    </div>
    </div>`;
    return newChatHtml;
  }

  function closePopUp(id) {
    //console.log("id to close=>", id);
    $('.closePopUp').unbind().click(function() {
      $(this).closest(".popup-box").removeClass("popup-box-on")
    });
  }

  function getAllUnreadMessages() {
    console.log("getAllUnreadMessages");
    var msgListCountHTML = '';

    var Data = [];
    var message = [];
    var count = '',
      senderName = '';

    var token = localStorage.getItem('token');

    var isToken = GlobalEvent.checkIfToken(token)
    if (isToken) {
      $.ajax({
        url: "/getAllUnreadMessages",
        type: "get",
        headers: {
          "authorization": token,
        },
        success: function(successData) {
          if (!successData.isError) {
            var unReadMsgsCount = successData.data.length;
            Data = successData.data;
            var count = parseInt(unReadMsgsCount);
            if (count > 0) {
              $('#msgNotification_count').empty();
              $('#m_topbar_msgNotification_icon').removeClass('hidden')
              $('#msgNotification_count').html(unReadMsgsCount + '  New')

              for (var index = 0; index < Data.length; index++) {
                if (!tempArray.includes(Data[index].sender)) {
                  tempObj[Data[index].sender] = { senderName: senderName, count: 0, message: [] }
                  tempArray.push(Data[index].sender);
                }
              }
              for (var index = 0; index < Data.length; index++) {
                for (var variable in tempObj) {
                  if (tempObj.hasOwnProperty(variable)) {
                    if (Data[index].sender == variable) {
                      tempObj[variable].message.push(Data[index].message);
                      tempObj[variable].senderName = Data[index].senderName;
                      tempObj[variable].count++;
                    }

                  }
                }
              }
              console.log("tempObj==>", tempObj);
              for (var variable in tempObj) {
                if (tempObj.hasOwnProperty(variable)) {
                  var senderName = tempObj[variable].senderName;
                  console.log("Variable GetAllUnreadMsg==>", variable);
                  msgListCountHTML += renderUnreadMsgData(variable, senderName, tempObj[variable].count);
                }
              }

              $('.UnreadMsgData').append(msgListCountHTML);

            } else {
              console.log(" No unReadMsgs found==>", unReadMsgsCount);

            }

          }


        },
        error: function(err) {
          console.log("getAllUnreadMessages->", err);
        }
      })



    }
  }

  function getAllMessageswithFriend(data, cb) {
    console.log("getAllMessageswithFriend request=>", data);
    // var token = localStorage.getItem('token');
    var isToken = GlobalEvent.checkIfToken(token)
    if (isToken) {
      $.ajax({
        url: "/getAllMessagesWithFriend",
        type: "get",
        data: { data: data },
        headers: {
          "authorization": token,
        },
        success: function(successData) {
          console.log("all chat with friend==>", friend, successData);
          var msgArray = [];
          if (successData.data.length > 0) {
            msgArray = (successData.data).reverse();
            console.log("New array=>", msgArray);
          }
          cb(msgArray)

        },
        error: function(err) {
          console.log("getAllMessageswithFriend ", err);
        }
      })
    }

  }

  function Notifications(dataMsg) {
    var msgListCountHTML = '';
    console.log("dataMsg==> for notification", dataMsg);
    var email = dataMsg.sender;
    // tempNotifArray = [];
    // tempNotifObj = {};
    var str = email.replace(/[^A-Z0-9]/ig, "_");
    str = str + 'listId';
    // var count = 1;

    if (!tempNotifArray.includes(dataMsg.sender)) {
      tempNotifObj[dataMsg.sender] = { senderName: dataMsg.senderName, count: 0, message: [] }
      tempNotifArray.push(dataMsg.sender);
    }

    for (var variable in tempNotifObj) {
      if (tempNotifObj.hasOwnProperty(variable)) {
        if (dataMsg.sender == variable) {
          tempNotifObj[variable].message.push(dataMsg.message);
          tempNotifObj[variable].senderName = dataMsg.senderName;
          tempNotifObj[variable].count++;
        }

      }
    }
    console.log("tempNotifObj==>", tempNotifObj);
    if ($("#" + str).length == 0) {
      // console.log("list not present for notification");
      msgListCountHTML += renderUnreadMsgData(email, dataMsg.senderName, tempNotifObj[dataMsg.sender].count);
      $('.UnreadMsgData').append(msgListCountHTML);
    } else {
      // console.log("list present for notification");
      $("#" + str).find('.m-list-timeline__time').text(tempNotifObj[dataMsg.sender].count);
    }

    if (typeof Notification.counter == 'undefined') {
      Notification.counter = 0;
    }
    $('#m_topbar_msgNotification_icon').removeClass('hidden')
    Notification.counter++;
    if (unReadMsgsCount) {
      unReadMsgsCount = parseInt(unReadMsgsCount);
      totalUnReadMsgsCount = Notification.counter + unReadMsgsCount;
    } else {
      totalUnReadMsgsCount = Notification.counter;
    }
    $('#msgNotification_count').html(totalUnReadMsgsCount + '  New')


  }


  function popupScroll(data_userProfile) {
    var lastScrollTop = 0;
    $('.popup-messages').scroll(function(event) {
      var st = $(this).scrollTop();
      // var distance = $(this).offset().top;
      var arrMsgId = [];
      var arrSetReadMsg = [];
      var date = $('.direct-chat-msg:first-child').attr('data-time');
      var friendEmail = $(this).parent().attr('data-FrndEmail');
      var str = friendEmail.replace(/[^A-Z0-9]/ig, "_");
      var toChatboxId = str;
      // console.log("data-FrndEmail==>", friendEmail);
      var data = {
        friend: friendEmail,
        date: date
      }
      if (st == 0) {
        // alert('top of the div');
        //  console.log("gart", date);
        getAllMessageswithFriend(data, function(dataMsg) {
          console.log("getAllMessageswithFriend =>dataMsg", dataMsg);
          dataMsg = (dataMsg).reverse();
          if (dataMsg) {
            var htmlChatMSg = '';
            var email = localStorage.getItem('email');
            for (let index = 0; index < dataMsg.length; index++) {
              if (!arrMsgId.includes(dataMsg[index]._id)) {
                arrMsgId.push(dataMsg._id)
                var chatTime = (moment(dataMsg[index].date).format('LTS'));
                if (index == 0) {
                  SetDateHeader(dataMsg[index].date)
                }

                if (index > 0 && dataMsg[index].date > dataMsg[index - 1].date) {
                  // console.log(" Date to set", dataMsg[index].date, dataMsg[index - 1].date);
                  SetDateHeader(dataMsg[index].date)
                }
                var data = {
                  first_name: dataMsg[index].senderName,
                  message: dataMsg[index].message,
                  chatTime: chatTime,
                  data_User: dataMsg[index].sender,
                  data_time: dataMsg[index].date,
                  data_userProfile: data_userProfile
                };

                if (dataMsg[index].sender == friendEmail) {

                  htmlChatMSg = renderImgTextMsgReceive(data)
                  if (!dataMsg[index].isRead) {
                    arrSetReadMsg.push(dataMsg[index]._id);
                  }

                } else {
                  htmlChatMSg = renderImgTextMsgSend(data)

                }

                $('#' + toChatboxId + ' .chat-msg').prepend(htmlChatMSg);

              }

            }
            if (arrSetReadMsg.length > 0) {
              console.log("on Page Scroll==>", arrSetReadMsg);
              setMsgRead(arrSetReadMsg, friendEmail);
            }
          }
        })


      }


      lastScrollTop = st;
    });
  }

  function renderUnreadMsgData(variable, senderName, count) {

    var str = variable.replace(/[^A-Z0-9]/ig, "_");
    str = str + 'listId';
    var msgListCountHTML = '';
    msgListCountHTML += ` <div class="m-list-timeline__item" id=` + str + ` data-email=` + variable + `>
    <span class="m-list-timeline__badge -m-list-timeline__badge--state-success"></span>
    <span class="m-list-timeline__text">` +
      senderName +
      `  </span>
    <span class="m-list-timeline__time">` +
      count +
      `</span>
        </div>`;
    return msgListCountHTML;
  }

  function renderImgTextMsgReceive(data) {
    var first_name = data.first_name;
    var message = data.message;
    var chatTime = data.chatTime;
    var data_User = data.data_User;
    var data_time = data.data_time;
    var data_userProfile = data.data_userProfile
    var htmlChatMSg = ` <div class="direct-chat-msg " data-User=` + data_User + ` data-time=` + data_time + `>
    <div class="direct-chat-info clearfix">
    
    </div>
    <div class="popup-head-left pull-left">
    <img src=` + data_userProfile + ` width="32" height="32" alt="iamgurdeeposahan">
    </div>
    <!-- /.direct-chat-img -->
    <div class="direct-chat-text direct-chat-text1" id="direct-chat-text">` + message + `
     
    </div>
    <div class="direct-chat-info clearfix  direct-chat-text1">
      <span class="direct-chat-timestamp pull-right "id="chatTime">` + chatTime + `</span>
    </div>  
      </div>`;
    return htmlChatMSg;
  }

  function renderImgTextMsgSend(data) {
    var first_name = data.first_name;
    var message = data.message;
    var chatTime = data.chatTime;
    var data_User = data.data_User;
    var data_time = data.data_time;
    var htmlChatMSg = ` <div class="direct-chat-msg"  data-User=` + data_User + ` data-time=` + data_time + `>
    <div class="direct-chat-info clearfix">
     
    </div>
   
    <!-- /.direct-chat-img -->
    <div class="direct-chat-text direct-chat-text2" id="direct-chat-text">` + message + `
     
    </div>
    <div class="direct-chat-info clearfix">
      <span class="direct-chat-timestamp direct-chat-text2 "id="chatTime">` + chatTime + `</span>
    </div>  
      </div>`;
    return htmlChatMSg;
  }

  function setMsgRead(data, toEmail) {
    console.log("setMsgRead==>", data);
    var str = toEmail.replace(/[^A-Z0-9]/ig, "_");
    str = str + 'listId';
    $.ajax({
      url: "/setMsgRead",
      data: { data: data },
      type: "POST",
      success: function(successData) {
        console.log("successData==>setMsgRead ", successData);
        // if (successData.data.nModified > 0) {}
        var previousCount = $("#" + str).find('.m-list-timeline__time').text();
        var currentCount = parseInt(previousCount) - successData.data.nModified;
        if (currentCount > 0) {
          $("#" + str).find('.m-list-timeline__time').text(currentCount);

        }

        var currenttotalUnReadMsgsCount = parseInt(totalUnReadMsgsCount) - successData.data.nModified;
        if (currenttotalUnReadMsgsCount) {
          $('#msgNotification_count').html(currenttotalUnReadMsgsCount + '  New')

        }
      },
      error: function(err) {
        console.log("setMsgRead ", err);
      }
    })
  }

  function sendMessage(olUserEmail, toChatboxId) {

    $('.status_message' + toChatboxId).on('input', function(e) {
        //emit friend as typing..
      })
      // var token = localStorage.getItem('token')

    $('.status_message' + toChatboxId).keydown(function() {
      var today = new Date();
      var chatTime = (moment(today).format('LTS'));
      var htmlChatMSg = '';

      var message = $(this).val();

      if ($(this).val() && (event.keyCode == 13 && $(this).val().length > 0)) {

        var first_name = localStorage.getItem('first_name');
        var last_name = localStorage.getItem('last_name');
        var email = localStorage.getItem('email')
        var dataObj = {
          message: $(this).val(),
          reciever: olUserEmail,
        }
        var htmlChatMSg = '';
        var msg = { dataObj, token }
        var userChatObj = {};
        GlobalEvent.socket.emit('private_message', msg);
        var data = {
          first_name: first_name,
          message: message,
          chatTime: chatTime,
          data_User: email,
          data_time: today,
        };
        htmlChatMSg = renderImgTextMsgSend(data)


        $('#' + toChatboxId + ' .chat-msg').append(htmlChatMSg);

        ;
        // $('#' + toChatboxId + ' .chat-msg ').attr('data-User', email);
        $(this).val('');
      }
    });

  }

  function SetDateHeader(chatTimeStamp1) {
    var chatTimeStamp = '';
    chatTimeStamp = moment(chatTimeStamp1).format('MMMM Do YYYY');
    $('.chatTimeStamp').html(chatTimeStamp);
  }

  function blockUser() {
    $(document).on('click', '.blockUser', function() {

      var isToken = GlobalEvent.checkIfToken(token)
      var blockUserTo = $(this).parents('div .qnimate').attr('data-FrndEmail');

      if (isToken) {
        $.ajax({
          url: "/blockUser",
          type: "post",
          data: { blockUserTo: blockUserTo },
          headers: {
            "authorization": token,
          },
          success: function(successData) {
            console.log("blockUser=>", successData);
            $(this).children('a').text('Unblock');
            $(this).addClass('hidden');
            $('.unblockUser').removeClass('hidden')


          },
          error: function(err) {
            console.log("blockUser error =>", err);
          }
        })

      }
    })

  }

  function unblockUser() {
    $(document).on('click', '.unblockUser', function() {

      var isToken = GlobalEvent.checkIfToken(token)
      var unblockUserTo = $(this).parents('div .qnimate').attr('data-FrndEmail');

      if (isToken) {
        $.ajax({
          url: "/unblockUser",
          type: "post",
          data: { unblockUserTo: unblockUserTo },
          headers: {
            "authorization": token,
          },
          success: function(successData) {
            console.log("unblockUser=>", successData);
            // $(this).children('a').text('b');
            $(this).addClass('hidden');
            $(this).hide();
            $('.blockUser').removeClass('hidden')


          },
          error: function(err) {
            console.log("unblockUser error =>", err);
          }
        })

      }
    })

  }

  function unfriend() {
    $(document).on('click', '.unfriendTo', function() {


      var isToken = GlobalEvent.checkIfToken(token)
      var unfriendTo = $(this).parents('div .qnimate').attr('data-FrndEmail');
      // var unfriendTo = $(this).attr('data-FrndEmail');
      console.log("unfriend call==>", token, unfriendTo);

      if (isToken) {
        $.ajax({
          url: "/unfriend",
          type: "post",
          data: { unfriendTo: unfriendTo },
          headers: {
            "authorization": token,
          },
          success: function(successData) {
            cb(successData)
          },
          error: function(err) {
            console.log("unfriend error =>", err);
          }
        })

      }
    })

  }

  function userList() {
    console.log("userList  function call");
    $(".olUserList li").unbind().click(function() {
      var toEmail = $(this).attr('data-email');
      var olUserName = $(this).text();
      var data_userProfile = '';
      var arrSetReadMsg = [];
      var str = toEmail.replace(/[^A-Z0-9]/ig, "_");
      var toChatboxId = str;
      var newChatHtml = '';
      var dataMsg = {
          friend: toEmail
        }
        //  var data_userProfile = $(this).find('img').attr('src');
      if (arrImgURL) {
        for (let index = 0; index < arrImgURL.length; index++) {
          if (arrImgURL[index].email == toEmail) {
            data_userProfile = arrImgURL[index].imgURL;
            // console.log("img found..", data_userProfile);
          }
        }
      }

      if ($('#' + toChatboxId).length > 0) {
        $('#' + toChatboxId).addClass('popup-box-on');
      } else {
        getAllMessageswithFriend(dataMsg, function(dataMsg) {
          if (dataMsg) {
            var htmlChatMSg = '';

            var email = localStorage.getItem('email');
            for (let index = 0; index < dataMsg.length; index++) {
              var chatTime = (moment(dataMsg[index].date).format('LTS'));
              if (index == 0) {
                SetDateHeader(dataMsg[index].date)
              }
              if (index > 0 && dataMsg[index].date > dataMsg[index - 1].date) {
                // console.log(" Date to set", dataMsg[index].date, dataMsg[index - 1].date);
                SetDateHeader(dataMsg[index].date)
              }
              var data = {
                first_name: dataMsg[index].senderName,
                message: dataMsg[index].message,
                chatTime: chatTime,
                data_User: dataMsg[index].sender,
                data_time: dataMsg[index].date,
                data_userProfile: data_userProfile
              };

              if (dataMsg[index].sender == toEmail) {
                htmlChatMSg = renderImgTextMsgReceive(data)
                if (!dataMsg[index].isRead) {
                  arrSetReadMsg.push(dataMsg[index]._id);
                }

              } else {
                htmlChatMSg = renderImgTextMsgSend(data)
              }
              $('#' + toChatboxId + ' .chat-msg').append(htmlChatMSg);
            }
            if (arrSetReadMsg.length > 0) {
              setMsgRead(arrSetReadMsg, toEmail);
            }

          }

        });

        var dataChatPopUp = {
          toChatboxId: toChatboxId,
          data_FrndEmail: toEmail,
          olUserName: olUserName,
          data_userProfile: data_userProfile
        };
        newChatHtml = chatPopUP(dataChatPopUp)



        $("#chatboxblocks").append(newChatHtml);

        unfriend();
        blockUser();
        unblockUser();
        if (blockUserList.length > 0) {
          console.log("blockuser list==>", blockUserList, dataChatPopUp.data_FrndEmail);
          if (blockUserList.includes(dataChatPopUp.data_FrndEmail)) {
            console.log("block user found", toChatboxId);
            $('#' + toChatboxId.trim()).find('.blockUser').addClass('hidden');
            $('#' + toChatboxId.trim()).find('.unblockUser').removeClass('hidden');

          }
        } else {
          console.log("blockuser list IS EMPTY==>", blockUserList);
        }

      }
      closePopUp(toChatboxId);
      sendMessage(toEmail, toChatboxId);
      popupScroll(data_userProfile);

    });

    // $('.UnreadMsgData div').unbind().click(function() {
    $(document).on('click', '.UnreadMsgData div', function() {
      console.log("id==>", $(this).attr('data-email'));
      var toEmail = $(this).attr('data-email');
      var olUserName = $(this).find('.m-list-timeline__text').text();
      var limit = $(this).find('.m-list-timeline__time').text();
      var data_userProfile = '';
      var str = toEmail.replace(/[^A-Z0-9]/ig, "_");
      var toChatboxId = str;
      var arrSetReadMsg = [];
      var newChatHtml = '';
      var dataMsg = {
        friend: toEmail,
        limit: limit
      }
      if (arrImgURL) {
        for (let index = 0; index < arrImgURL.length; index++) {
          if (arrImgURL[index].email == toEmail) {
            data_userProfile = arrImgURL[index].imgURL;
          }
        }
      }
      if ($('#' + toChatboxId).length > 0) {
        $('#' + toChatboxId).addClass('popup-box-on');
      } else {
        getAllMessageswithFriend(dataMsg, function(dataMsg) {
          if (dataMsg) {
            var htmlChatMSg = '';
            var email = localStorage.getItem('email');
            for (let index = 0; index < dataMsg.length; index++) {
              var chatTime = (moment(dataMsg[index].date).format('LTS'));
              if (index == 0) {
                SetDateHeader(dataMsg[index].date)
              }
              if (index > 0 && dataMsg[index].date > dataMsg[index - 1].date) {
                // console.log(" Date to set", dataMsg[index].date, dataMsg[index - 1].date);
                SetDateHeader(dataMsg[index].date)
              }
              var data = {
                first_name: dataMsg[index].senderName,
                message: dataMsg[index].message,
                chatTime: chatTime,
                data_User: dataMsg[index].sender,
                data_time: dataMsg[index].date,
                data_userProfile: data_userProfile,
              };

              if (dataMsg[index].sender == toEmail) {
                htmlChatMSg = renderImgTextMsgReceive(data)
                if (!dataMsg[index].isRead) {
                  arrSetReadMsg.push(dataMsg[index]._id);
                }
              } else {
                htmlChatMSg = renderImgTextMsgSend(data)
              }
              $('#' + toChatboxId + ' .chat-msg').append(htmlChatMSg);
            }
            if (arrSetReadMsg.length > 0) {
              setMsgRead(arrSetReadMsg, toEmail);
            }

          }

        });

        var dataChatPopUp = {
          toChatboxId: toChatboxId,
          data_FrndEmail: toEmail,
          olUserName: olUserName,
          data_userProfile: data_userProfile
        };
        newChatHtml = chatPopUP(dataChatPopUp)
        $("#chatboxblocks").append(newChatHtml);
        unfriend();
        blockUser();
        unblockUser();

      }
      closePopUp(toChatboxId);
      $(this).find('.m-list-timeline__time').text('0');
      var totalCount = '';
      var tempTotalCount = parseInt($('#msgNotification_count').text());
      totalCount = tempTotalCount - parseInt(limit);

      $('#msgNotification_count').html(totalCount + '  New')

      sendMessage(toEmail, toChatboxId);
      popupScroll(data_userProfile);

    })


  }


  // }


}).bind(GlobalEvent))()