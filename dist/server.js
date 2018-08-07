'use strict';

function SoketConnection() {
  io.on('connection', function (socket) {
    console.log("On Connection=>", socket.id);

    socket.on('getActiveList', function (token) {

      var decoded = jwt.verify(token, env.App_key);
      curentUserEmail = decoded.email;
      var isEmailFound = users.find(function (item) {
        return item && item.email && item.email == curentUserEmail;
      });
      //console.log("isEmailFound in users", users, isEmailFound);
      if (!isEmailFound) {
        users.push({
          email: curentUserEmail,
          socketId: socket.id
        });
        //console.log("Email Not present=>", users, curentUserEmail);
      } else {

        users.forEach(function (item) {
          if (item.email == curentUserEmail) {
            item.email = curentUserEmail;
            item.socketId = socket.id;
          }

          // item.email = curentUserEmail,
          //   item.socketId = socket.id
        });
        //console.log("Email present=>", users, curentUserEmail);
      }

      if (curentUserEmail) {
        usersModel.findOneAndUpdate({ "email": curentUserEmail }, { $set: { isActive: "active" } }, { friends: 1, _id: 0 }, function (err, doc) {
          if (err) {
            //console.log("error in io connection.=>", err);
            // res.json(err); 

          } else {
            friends = [];
            pending = [];
            all_friends = [];
            // //console.log("friends list: " + doc);
            var list = doc.friends.slice();
            //console.log(list);

            for (var i in list) {
              if (list[i].status == "Friend") {
                friends.push(list[i]);
                // //console.log("users[list[i].senderEmail]", users, users[list[i].senderEmail]);
                users.forEach(function (item) {
                  //console.log("In friends Item ==>", item);
                  if (item.email && list[i].senderEmail == item.email) {
                    //console.log("item.socketId, curentUserEmail ", item.socketId, curentUserEmail);
                    io.to(item.socketId).emit('friend_me', curentUserEmail);
                    io.emit('friend_all', curentUserEmail);
                  }
                });
              } else if (list[i].status == "Pending") {
                pending.push(list[i]);
              } else {
                continue;
              }
            }

            io.to(socket.id).emit('friend_list', friends);
            io.to(socket.id).emit('pending_list', pending);

            //  io.emit('users', users);
          }
        });
      }
    });

    socket.on('private_message', function (msgObj) {
      //console.log("private message", msgObj);
      var decoded = jwt.verify(msgObj.token, env.App_key);
      var sender = decoded.email;
      var data = msgObj.dataObj;
      data.sender = sender;
      data.date = new Date();
      data.isRead = false;
      //   //console.log("Data for message==>", data);
      messagesModel.create(data, function (err, message) {
        if (err) {
          //console.log("Error in add message", err) } else {


          //   //console.log("In msg==> ", users, message);

          users.forEach(function (item, index) {
            if (item && item.email == data.reciever) {
              //   //console.log("Reciever found=>> ", item.email, data.reciever);

              io.to(item.socketId).emit('Notification_for_msg', message);
            }
          });
        }
      });
    });

    //console.log("Connection :User is connected  ", socket.id, email);

    // io.to(socket.id).emit('handle', email);


    // const isEmailFound = users.find(item => item && item.email && item.email == email);

    // users[email] = socket.id;
    keys[socket.id] = email;
    //console.log("Users list : " + users);
    //console.log("keys list : " + keys);


    socket.on('disconnect', function () {
      console.log("disconned call", socket.id);
      // // var decoded = jwt.verify(token, env.App_key);
      // // var curentUserEmail = decoded.email;
      // socket.disconnect(true);
      // usersModel.findOneAndUpdate({ "email": curentUserEmail }, { $set: { isActive: "inactive" } },
      //   function(err, doc) {
      //     if (err) {
      //       // res.json(err);
      //     } else {
      //       //console.log("logout=>", doc)
      //     }
      //   });

      // // delete global.email;
      // // email = null;
      // users.forEach((item, index) => {
      //   if (item && item.email == curentUserEmail) {
      //     users.splice(index, 1);
      //   }
      // })
      // delete socket.id;
      // //console.log("After Disconnect Users List==>", users);
      // // delete users[keys[socket.id]];
      // // delete keys[socket.id];
      // io.emit('users', users);
      // // //console.log(users);
    });
  });
}
//# sourceMappingURL=server.js.map