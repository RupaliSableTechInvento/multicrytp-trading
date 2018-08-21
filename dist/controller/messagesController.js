'use strict';

var _usersModel = require('../models/usersModel');

var _usersModel2 = _interopRequireDefault(_usersModel);

var _messagesModel = require('../models/messagesModel');

var _messagesModel2 = _interopRequireDefault(_messagesModel);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _env = require('../env');

var _env2 = _interopRequireDefault(_env);

var _http = require('http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var bodyParser = require('body-parser');
var users = [];
var keys = {};

module.exports = function (app, io) {
  var app = app;
  var io = io;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  var email = global.email || null;

  var friends = [];
  var pending = [];
  var all_friends = [];
  var curentUserEmail = '';
  io.sockets.on('connection', function (socket) {
    console.log("On Connection=>", socket.id);

    socket.on('getActiveList', function (token) {

      //console.log("getActiveList=>>", token);
      var decoded = _jsonwebtoken2.default.verify(token, _env2.default.App_key);
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
        _usersModel2.default.findOneAndUpdate({ "email": curentUserEmail }, { $set: { isActive: "active" } }, { friends: 1, _id: 0 }, function (err, doc) {
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
                    io.to(item.socketId).emit('friend_Ol', curentUserEmail);
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
      var decoded = _jsonwebtoken2.default.verify(msgObj.token, _env2.default.App_key);
      var sender = decoded.email;
      var senderName = '';
      var data = msgObj.dataObj;
      data.sender = sender;
      data.date = new Date();
      data.isRead = false;

      _usersModel2.default.find({ email: sender }, { last_name: 1, first_name: 1, _id: 0 }, function (err, user) {
        if (err) {
          res.json(err);
        } else {
          senderName = user[0].first_name + " " + user[0].last_name;
          console.log("Sender Name=>", senderName);
          data.senderName = senderName;

          _messagesModel2.default.create(data, function (err, message) {
            if (err) {
              console.log("Error in add message", err);
            } else {
              users.forEach(function (item, index) {
                if (item && item.email == data.reciever) {
                  console.log("Reciever found=>> ", item.email, data.reciever);
                  io.to(item.socketId).emit('Notification_for_msg', message);
                }
              });
            }
          });
        }
      });
    });

    keys[socket.id] = email;

    socket.on('group message', function (msg) {
      // //console.log(msg);
      io.emit('group', msg);
    });

    socket.on('disconnect', function () {
      console.log("disconned call", socket.id);

      _usersModel2.default.findOneAndUpdate({ "email": curentUserEmail }, { $set: { isActive: "inactive" } }, function (err, doc) {
        if (err) {
          // res.json(err);
        } else {
            //console.log("logout=>", doc)
          }
      });

      delete socket.id;
    });
    socket.on('reconnect', function () {
      console.log("soket reconnceting..");
    });
  });

  app.post('/friend_request', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Method", "'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
    friend = true;
    models.user.find({ "handle": req.body.my_handle, "friends.name": req.body.friend_handle }, function (err, doc) {
      if (err) {
        res.json(err);
      } else if (doc.length != 0) {

        res.send("Friend request already sent ");
      } else {

        models.user.update({
          handle: req.body.my_handle
        }, {
          $push: {
            friends: {
              name: req.body.friend_handle,
              status: "Pending"
            }
          }
        }, {
          upsert: true
        }, function (err, doc) {
          if (err) {
            res.json(err);
          }
          //            else{
          //                //console.log(doc);
          //            }
        });
        io.to(users[req.body.friend_handle]).emit('message', req.body);
      }
    });
  });

  app.post('/friend_request/confirmed', function (req, res) {
    //console.log("friend request confirmed : " + req.body);
    if (req.body.confirm == "Yes") {
      models.user.find({
        "handle": req.body.friend_handle,
        "friends.name": req.body.my_handle
      }, function (err, doc) {
        if (err) {
          res.json(err);
        } else if (doc.length != 0) {
          //console.log("Friend request confirmed : " + doc.length);
          //console.log("Friend request confirmed : friend request already sent " + doc);
          res.send("Friend request already accepted");
        } else {
          models.user.update({
            "handle": req.body.my_handle,
            "friends.name": req.body.friend_handle
          }, {
            '$set': {
              "friends.$.status": "Friend"
            }
          }, function (err, doc) {
            if (err) {
              res.json(err);
            } else {

              //console.log("friend request confirmed : Inside yes confirmed");
              io.to(users[req.body.friend_handle]).emit('friend', req.body.my_handle);
              io.to(users[req.body.my_handle]).emit('friend', req.body.friend_handle);
            }
          });
          models.user.update({
            handle: req.body.friend_handle
          }, {
            $push: {
              friends: {
                name: req.body.my_handle,
                status: "Friend"
              }
            }
          }, { upsert: true }, function (err, doc) {
            if (err) {
              res.json(err);
            }
            //            else{
            //                //console.log(doc);
            //            }
          });
        }
      });
    } else {

      models.user.update({
        "handle": req.body.my_handle
      }, {
        '$pull': {
          'friends': {
            "name": req.body.friend_handle
          }
        }
      }, function (err, doc) {
        if (err) {
          res.json(err);
        } else {
          //console.log("No");
        }
      });
    }
  });
};
//# sourceMappingURL=messagesController.js.map