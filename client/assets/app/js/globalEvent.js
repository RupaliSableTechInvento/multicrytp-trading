var GlobalEvent = {};
((function() {
  var NotificationMSG = '';
  var tempArray = [];
  var tempObj = {};
  var unReadMsgsCount = '',
    totalUnReadMsgsCount = '';
  var toChatboxId
  var token = localStorage.getItem('token')
  checkIfToken(token);
  getAllMessages();
  var friend = 'sablerupali358@gmail.com';

  $('#logoutbtn').unbind().click(function() {
    console.log("logout btn clicked");
    console.log("token in logout=>", token);
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
          // $('.olUserList').empty();
          socket.disconnect();
          window.location.reload("");
        }

      },
      error: function(err) {
        console.log("logout err=>", err);
      }
    })

  })




  if (token && (token.length > 0)) {
    var socket = null;
    var arrNotificationMsgId = [];

    // $(".olUserList").empty();
    // socket = io.connect('http://localhost:8080');
    socket = io();



    socket.on('connect', function() {

      socket.emit('getActiveList', token, function(data) {
        console.log("getActiveList Data", data);
      })

      socket.emit('get friends', function(data) {
        console.log("data get freinds", data)
      });

      socket.on('users', function(data) {
        console.log("users using soket io ", data);
      });
      socket.emit('setUser', 'hello world');

      socket.on('Notification_for_msg', function(dataMsg) {
        console.log("Notification_for_msg => ", dataMsg);
        if (!arrNotificationMsgId.includes(dataMsg._id)) {
          arrNotificationMsgId.push(dataMsg._id)
          var email = dataMsg.sender;
          console.log("Email to spit in notification");
          // var str = email.split("@");

          // var toChatboxId = str[0];
          var str = email.replace(/[^A-Z0-9]/ig, "_");


          // var toChatboxId = str[0];
          var toChatboxId = str;
          var htmlChatMSg = '';

          var chatTime = (moment(dataMsg.date).format('LTS'));
          var data = {
            first_name: dataMsg.senderName,
            message: dataMsg.message,
            chatTime: chatTime,
            data_User: email,
            data_time: dataMsg.date,
          };
          if ($('.direct-chat-msg:last-child').attr('data-User') == email) {
            htmlChatMSg = renderOnlyTextMsgReceive(data)
          } else {
            htmlChatMSg = renderImgTextMsgReceive(data)
          }


          $('#' + toChatboxId + ' .chat-msg').append(htmlChatMSg);
          Notifications();
        }

      });


      socket.on('friend_all', function(data) {
        console.log(" Online user  friend_all => ", data);
      });
      socket.on('greeting', function(data) {
        console.log(" greeting => ", data);
      });
      socket.on('friend_Ol', function(olUserEmail) {
        console.log("friend_Ol", olUserEmail);
        $(".olUserList li").each(function() {
          if ($(this).attr('data-email') == olUserEmail) {
            $(this).find("span").addClass("online")
              // $(this).find("span").addClass("active_Now")
          }
        });
      });
      socket.on('friend_list', function(friendListData) {
        var friendList = '';
        console.log("users friend_list using soket io", friendListData);
        for (let index = 0; index < friendListData.length; index++) {
          //     friendList += `<li data-email=` + friendListData[index].senderEmail + `class="contact active">
          // 		<div class="wrap">
          //     <span class="contact-status online"></span>
          //     <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="">

          //   </div>
          //  </li>`;
          friendList +=

            `<li data-email=` + friendListData[index].senderEmail + `>
          <div style="display:inline-flex">
            <span></span>
            <div class="_1gyw" style="margin-right:10px">

              <img src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" width="32" height="32" alt="" class="img">
            </div>
            <div class="friendName">` + friendListData[index].senderFirstName + `</div>

          </div>
        </li>`;


          //   `<li class="contact"data-email=` + friendListData[index].senderEmail + ` style="margin-top:10px">
          //     <div class="wrap" style="display:inline-flex">
          //     <span class="contact-status"></span>
          //     <div class="_1gyw" style="margin-right:10px">

          //     <img src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg"width="32" height="32" alt="" class="img">
          //     </div>	
          //   <div class="friendName" >` + friendListData[index].senderFirstName + `</div>

          // </div>
          // </li>`;
          //       <div class="friendStatus">
          //       <span aria-label="Active now">
          //       </span>
          // </div>
          // <li class="_42fz" data-email=` + friendListData[index].senderEmail + `>
          // <a >
          // <div class="_55lp"><div class="_55lq" aria-hidden="true">
          // <div class="_1gyw _55lt" style="width: 32px; height: 32px;">
          // <img src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" width="32" height="32" alt="" class="img">
          // </div></div>
          // <div class="_5bon">
          // <div class="_568z">
          // <div class="_568-"></div>
          // <span aria-label="Active now" style="background: rgb(66, 183, 42); border-radius: 50%; display: inline-block; height: 6px; margin-left: 4px; width: 6px;">
          // </span></div></div><div class="_55lr">` + friendListData[index].senderFirstName + `</div><div class="_55ls"></div></div></a></li>`;


          // friendList += "<li data-email=" + friendListData[index].senderEmail + ">" + friendListData[index].senderFirstName + "</li>";
        }
        $(".olUserList").html(friendList);
        userList();
      });
      socket.on('pending_list', function(data) {

        var requestCount = data.length;

        var friend_req_list = '';

        $('.friend_req_count').html(requestCount + "  New")
        if (requestCount > 0) {
          $('.friend_req_list').empty();
          for (let index = 0; index < data.length; index++) {
            friend_req_list += `<div class="m-list-timeline__item">
                                      <span class="m-list-timeline__badge -m-list-timeline__badge--state-success"></span>
                                      <span class="m-list-timeline__text">` +
              data[index].senderFirstName + `</span>
                                      <span class="m-list-timeline__time ">

                                    <button type="button" data-user="` + data[index].senderEmail + `"class="btn m-btn m-btn--gradient-from-success m-btn--gradient-to-accent  btnAcceptReq">Accept</button>

                                      </span>
                                    </div>`;

          }
          $('.friend_req_list').append(friend_req_list);
        }

      });

    });

  }

  function Notifications() {

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
    console.log("totalUnReadMsgsCount=>", totalUnReadMsgsCount);
    $('#msgNotification_count').html(totalUnReadMsgsCount + '  New')
  }

  function closePopUp(id) {
    //console.log("id to close=>", id);
    $('.closePopUp').unbind().click(function() {
      $(this).closest(".popup-box").removeClass("popup-box-on")
    });
  }

  function userList() {
    console.log("userList  function call");
    $(".olUserList li").unbind().click(function() {
      var toEmail = $(this).attr('data-email');
      // var str = toEmail.split("@");
      var str = toEmail.replace(/[^A-Z0-9]/ig, "_");
      var dataMsg = '';
      // var toChatboxId = str[0];
      var toChatboxId = str;
      var newChatHtml = '';
      var data = {
        friend: toEmail
      }
      if ($('#' + toChatboxId).length > 0) {
        $('#' + toChatboxId).addClass('popup-box-on');
      } else {
        getAllMessageswithFriend(data, function(dataMsg) {
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
              };

              if (dataMsg[index].sender == toEmail) {

                if (index > 0 && dataMsg[index].reciever == dataMsg[index - 1].reciever) {

                  htmlChatMSg = renderOnlyTextMsgReceive(data);
                } else {

                  htmlChatMSg = renderImgTextMsgReceive(data)
                }

              } else {

                if (index > 0 && dataMsg[index].reciever == dataMsg[index - 1].reciever) {
                  htmlChatMSg = renderOnlyTextMsgSend(data);
                } else {
                  htmlChatMSg = renderImgTextMsgSend(data)
                }

              }

              $('#' + toChatboxId + ' .chat-msg').append(htmlChatMSg);

            }

          }

        });


        var data = {
          toChatboxId: toChatboxId,
          data_FrndEmail: toEmail,
          olUserName: $(this).text(),
        };
        newChatHtml = chatPopUP(data)

        $("#chatboxblocks").append(newChatHtml);
        // _bind.closePopUp(toChatboxId);
        // $('#' + toChatboxId).addClass('popup-box-on');
      }
      closePopUp(toChatboxId);
      // var chatTimeStamp = new Date();
      // chatTimeStamp = moment(chatTimeStamp).format('MMMM Do YYYY');
      // $('.chatTimeStamp').html(chatTimeStamp);
      var olUserEmail = $(this).attr('data-email');
      // $('.olUserName` + toChatboxId + `').html(olUserName);
      sendMessage(olUserEmail, toChatboxId);
      popupScroll();
    });
  }

  function sendMessage(olUserEmail, toChatboxId) {



    $('.status_message' + toChatboxId).on('input', function(e) {
        //emit friend as typing..
      })
      // var token = localStorage.getItem('token')
    var today = new Date();
    $('.status_message' + toChatboxId).keydown(function() {
      var chatTime = (moment(today).format('LTS'));
      var htmlChatMSg = '';

      var message = $(this).val();

      if ($(this).val() != "" && $(this).val() != undefined && $(this).val() != null && (event.keyCode == 13 && $(this).val().length > 0)) {

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
        socket.emit('private_message', msg);
        var data = {
          first_name: first_name,
          message: message,
          chatTime: chatTime,
          data_User: email,
          data_time: today,
        };
        if ($('.direct-chat-msg:last-child').attr('data-User') == email) {

          htmlChatMSg = renderOnlyTextMsgSend(data)
        } else {

          htmlChatMSg = renderImgTextMsgSend(data)

        }

        $('#' + toChatboxId + ' .chat-msg').append(htmlChatMSg);

        ;
        // $('#' + toChatboxId + ' .chat-msg ').attr('data-User', email);
        $(this).val('');
      }
    });

  }

  function SetDateHeader(chatTimeStamp1) {
    var chatTimeStamp = '';
    // console.log("chatTimeStamp==>", chatTimeStamp1);
    chatTimeStamp = moment(chatTimeStamp1).format('MMMM Do YYYY');
    $('.chatTimeStamp').html(chatTimeStamp);
  }

  function getAllMessages() {
    var msgListCountHTML = '';
    var Data = [];
    var message = [];
    var count = '',
      senderName = '';

    // var token = localStorage.getItem('token');
    var isToken = checkIfToken(token)
    if (isToken) {
      $.ajax({
        url: "/getAllMessages",
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
                console.log(" msgListCountHTML==>", Data[index])
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
                  console.log("Variable==>", tempObj[variable].senderName);
                  msgListCountHTML += ` <div class="m-list-timeline__item">
                      <span class="m-list-timeline__badge -m-list-timeline__badge--state-success"></span>
                      <span class="m-list-timeline__text" id=` + variable + ` data-email=` + variable + `>` +
                    tempObj[variable].senderName +
                    `     
                      </span>
                      <span class="m-list-timeline__time">` +
                    tempObj[variable].count +
                    `   
                            </span>
                          </div>`;



                }
              }

              $('.UnreadMsgData').append(msgListCountHTML);

            }
            console.log("unReadMsgsCount==>", unReadMsgsCount, Data.length);

          }


        },
        error: function(err) {
          alert(err);
        }
      })



    }
  }

  function getAllMessageswithFriend(data, cb) {

    // var token = localStorage.getItem('token');
    var isToken = checkIfToken(token)
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
          alert(err);
        }
      })
    }

  }

  function chatPopUP(data) {
    var toChatboxId = data.toChatboxId;
    var olUserName = data.olUserName;
    var data_FrndEmail = data.data_FrndEmail;
    var newChatHtml = `<div class="popup-box chat-popup popup-box-on qnimate" data-FrndEmail=` + data_FrndEmail + ` id="` + toChatboxId + `">
    <div class="popup-head">
      <div class="popup-head-left pull-left">
      <img src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" alt="iamgurdeeposahan">
      <label class="olUserName" >` + olUserName + `</label></div>
      <div class="popup-head-right pull-right">
        <div class="btn-group">
          <button class="chat-header-button" data-toggle="dropdown" type="button" aria-expanded="false">
          <i class="flaticon-cogwheel-2"></i></i> </button>
          <ul role="menu" class="dropdown-menu pull-right">
            <li><a href="#">Media</a></li>
            <li><a href="#">Block</a></li>
            <li><a href="#">Clear Chat</a></li>
            <li><a href="#">Email Chat</a></li>
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
    </div>`;
    return newChatHtml;
  }

  function renderImgTextMsgReceive(data) {
    var first_name = data.first_name;
    var message = data.message;
    var chatTime = data.chatTime;
    var data_User = data.data_User;
    var data_time = data.data_time;
    var htmlChatMSg = ` <div class="direct-chat-msg " data-User=` + data_User + ` data-time=` + data_time + `>
    <div class="direct-chat-info clearfix">
    
    </div>
    <div class="popup-head-left pull-left">
    <img src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" alt="iamgurdeeposahan">
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

  function renderOnlyTextMsgSend(data) {
    var first_name = data.first_name;
    var message = data.message;
    var chatTime = data.chatTime;
    var data_User = data.data_User;
    var data_time = data.data_time;
    var htmlChatMSg = ` <div class="direct-chat-msg "data-User=` + data_User + ` data-time=` + data_time + `>
    
    <div class="direct-chat-text direct-chat-text2" id="direct-chat-text">` + message + `
     
    </div>
    <div class="direct-chat-info clearfix">
      <span class="direct-chat-timestamp direct-chat-text2 "id="chatTime">` + chatTime + `</span>
    </div>  
      </div>`;
    return htmlChatMSg;
  }

  function renderOnlyTextMsgReceive(data) {
    var first_name = data.first_name;
    var message = data.message;
    var chatTime = data.chatTime;
    var data_User = data.data_User;
    var data_time = data.data_time;
    var htmlChatMSg = ` <div  class="direct-chat-msg " data-User=` + data_User + ` data-time=` + data_time + `>
    <div class="popup-head-left pull-left">
    <img src="http://bootsnipp.com/img/avatars/bcf1c0d13e5500875fdd5a7e8ad9752ee16e7462.jpg" alt="iamgurdeeposahan">
    </div>
    <div class="direct-chat-text direct-chat-text1" id="direct-chat-text">` + message + `
     
    </div>
    <div class="direct-chat-info clearfix  direct-chat-text1">
      <span class="direct-chat-timestamp pull-right "id="chatTime">` + chatTime + `</span>
    </div>  
      </div>`;
    return htmlChatMSg;
  }


  function popupScroll() {
    var lastScrollTop = 0;
    $('.popup-messages').scroll(function(event) {
      var st = $(this).scrollTop();
      // var distance = $(this).offset().top;


      var date = $('.direct-chat-msg:first-child').attr('data-time');
      var friendEmail = $(this).parent().attr('data-FrndEmail');
      var str = friendEmail.replace(/[^A-Z0-9]/ig, "_");
      var toChatboxId = str;
      console.log("data-FrndEmail==>", friendEmail);
      var data = {
        friend: friendEmail,
        date: date
      }

      if (st == 0) {
        // alert('top of the div');
        console.log("Scroll top reached......", date);
        getAllMessageswithFriend(data, function(dataMsg) {
          dataMsg = (dataMsg).reverse();
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
              };


              if (dataMsg[index].sender == friendEmail) {

                if (index > 0 && dataMsg[index].reciever == dataMsg[index - 1].reciever) {

                  htmlChatMSg = renderOnlyTextMsgReceive(data);
                } else {

                  htmlChatMSg = renderImgTextMsgReceive(data)
                }

              } else {

                if (index > 0 && dataMsg[index].reciever == dataMsg[index - 1].reciever) {
                  htmlChatMSg = renderOnlyTextMsgSend(data);
                } else {
                  htmlChatMSg = renderImgTextMsgSend(data)
                }

              }

              $('#' + toChatboxId + ' .chat-msg').prepend(htmlChatMSg);

            }

          }
        })


      }


      //   if (st > lastScrollTop) {} else {
      //     // console.log("Scrolling UP")
      //     getAllMessageswithFriend(data, function(dataMsg) {
      //       if (dataMsg) {
      //         var htmlChatMSg = '';
      //         var email = localStorage.getItem('email');
      //         for (let index = 0; index < dataMsg.length; index++) {
      //           var chatTime = (moment(dataMsg[index].date).format('LTS'));
      //           if (index == 0) {
      //             SetDateHeader(dataMsg[index].date)
      //           }

      //           if (index > 0 && dataMsg[index].date > dataMsg[index - 1].date) {
      //             // console.log(" Date to set", dataMsg[index].date, dataMsg[index - 1].date);
      //             SetDateHeader(dataMsg[index].date)
      //           }
      //           var data = {
      //             first_name: dataMsg[index].senderName,
      //             message: dataMsg[index].message,
      //             chatTime: chatTime,
      //             data_User: dataMsg[index].sender,
      //           };

      //           if (dataMsg[index].sender == friendEmail) {

      //             if (index > 0 && dataMsg[index].reciever == dataMsg[index - 1].reciever) {

      //               htmlChatMSg = renderOnlyTextMsgReceive(data);
      //             } else {

      //               htmlChatMSg = renderImgTextMsgReceive(data)
      //             }

      //           } else {

      //             if (index > 0 && dataMsg[index].reciever == dataMsg[index - 1].reciever) {
      //               htmlChatMSg = renderOnlyTextMsgSend(data);
      //             } else {
      //               htmlChatMSg = renderImgTextMsgSend(data)
      //             }

      //           }

      //           $('#' + toChatboxId + ' .chat-msg').append(htmlChatMSg);

      //         }

      //       }
      //     })

      //  }

      lastScrollTop = st;
    });
  }

  function checkIfToken(token) {
    if (token && token.length > 0) {
      $.ajax({
        url: "/getUserInfo",
        type: "get",
        headers: {
          "authorization": token,
        },
        success: function(successData) {
          if (!successData.isError) {
            var userData = successData.data[0];

            $('.m-card-user__name').html(userData.first_name + ' ' + userData.last_name),

              $('.m-card-user__email').html(userData.email),
              // $('#phone_no').val(userData.phone_no),
              $('#m-card-user__img').attr('src', userData.imgURL)
          }

        },
        error: function(err) {
          alert(err);
        }
      })
      $('.loginOutUser').hide();
      $('.loginUser').show();
      return true;
    }
    $('.loginUser').hide();
    $('.loginOutUser').show();
    return false;
  }

  // }


}).bind(GlobalEvent))()