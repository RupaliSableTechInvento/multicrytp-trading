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
  console.log("global");
  var app = app;
  var io = io;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  var email = global.email || null;
  // var email = "sablerupali358@gmail.com"
  console.log("Email id in messages Controller=>", email);

  var friends = [];
  var pending = [];
  var all_friends = [];
  var curentUserEmail = '';

  if (email) {
    io.on('connection', function (socket) {
      // socket.on('private_message', function(privateMsg) {
      //   console.log("privateMsg1111", privateMsg);
      //   io.emit('private_message', 'hello');

      // })

      socket.on('getActiveList', function (token) {

        console.log("getActiveList=>>", token);
        var decoded = _jsonwebtoken2.default.verify(token, _env2.default.App_key);
        curentUserEmail = decoded.email;
        var isEmailFound = users.find(function (item) {
          return item && item.email && item.email == curentUserEmail;
        });
        console.log("isEmailFound in users", users, isEmailFound);
        if (!isEmailFound) {
          users.push({
            email: curentUserEmail,
            socketId: socket.id
          });
          console.log("Email Not present=>", users, curentUserEmail);
        } else {

          users.forEach(function (item) {
            item.email = curentUserEmail, item.socketId = socket.id;
          });
          console.log("Email present=>", users, curentUserEmail);
        }

        if (curentUserEmail) {
          _usersModel2.default.findOneAndUpdate({ "email": curentUserEmail }, { $set: { isActive: "active" } }, { friends: 1, _id: 0 }, function (err, doc) {
            if (err) {
              console.log("error in io connection.=>", err);
              // res.json(err); 
            } else {
              friends = [];
              pending = [];
              all_friends = [];
              // console.log("friends list: " + doc);
              var list = doc.friends.slice();
              console.log(list);

              for (var i in list) {
                if (list[i].status == "Friend") {
                  friends.push(list[i]);
                  // console.log("users[list[i].senderEmail]", users, users[list[i].senderEmail]);
                  users.forEach(function (item) {
                    if (item.curentUserEmail && list[i].senderEmail == item.curentUserEmail) {
                      console.log("email found", item.socketId, curentUserEmail);
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

              // console.log("pending list: " + pending);
              // console.log("friends list: " + friends);
              io.to(socket.id).emit('friend_list', friends);
              io.to(socket.id).emit('pending_list', pending);

              //  io.emit('users', users);
            }
          });
        }
      });
      socket.on('private_message', function (msgObj) {
        console.log("private message", msgObj);

        var decoded = _jsonwebtoken2.default.verify(msgObj.token, _env2.default.App_key);
        var sender = decoded.email;
        console.log("in addmessage");
        var data = msgObj.dataObj;
        data.sender = sender;
        data.date = new Date();
        console.log("Data for message==>", data);
        _messagesModel2.default.create(data, function (err, message) {
          if (err) {
            console.log("Error in add message", err);
          } else {

            console.log("  message added..", users[msgObj.dataObj.reciever]);

            io.to(users[msgObj.dataObj.reciever]).emit('private_message', msgObj);
          }
        });
      });

      console.log("Connection :User is connected  ", socket.id, email);

      io.to(socket.id).emit('handle', email);

      // const isEmailFound = users.find(item => item && item.email && item.email == email);

      console.log("users", users);
      // users[email] = socket.id;
      keys[socket.id] = email;
      console.log("Users list : " + users);
      console.log("keys list : " + keys);

      socket.on('group message', function (msg) {
        // console.log(msg);
        io.emit('group', msg);
      });

      // socket.on('private_message', function(msgObj) {
      //   console.log("private message", msgObj);


      //   var decoded = jwt.verify(msgObj.token, env.App_key);
      //   var sender = decoded.email;
      //   console.log("in addmessage");
      //   var data = msgObj.dataObj;
      //   data.sender = sender;
      //   data.date = new Date();
      //   console.log("Data for message==>", data);
      //   messagesModel.create(data, function(err, message) {
      //     if (err) { console.log("Error in add message", err) } else {

      //       console.log("  message added..", users[msgObj.dataObj.reciever]);

      //       io.to(users[msgObj.dataObj.reciever]).emit('private_message', msgObj);
      //     }
      //   })
      // });


      // socket.on('private message', function(msg) {
      //   console.log('message  :' + msg.split("#*@")[0]);
      //   models.messages.create({
      //     "message": msg.split("#*@")[1],
      //     "sender": msg.split("#*@")[2],
      //     "reciever": msg.split("#*@")[0],
      //     "date": new Date()
      //   });
      //   io.to(users[msg.split("#*@")[0]]).emit('private message', msg);
      // });

      socket.on('disconnect', function () {
        console.log("disconned call", socket.id);
        // var decoded = jwt.verify(token, env.App_key);
        // var curentUserEmail = decoded.email;
        _usersModel2.default.findOneAndUpdate({ "email": curentUserEmail }, { $set: { isActive: "inactive" } }, function (err, doc) {
          if (err) {
            // res.json(err);
          } else {
            console.log("logout=>", doc);
          }
        });

        // delete global.email;
        // email = null;
        users.forEach(function (item, index) {
          if (item && item.curentUserEmail == curentUserEmail) {

            users.splice(index, 1);
          }
        });
        // delete users[keys[socket.id]];
        delete keys[socket.id];
        io.emit('users', users);
        // console.log(users);
      });
    });
  }

  app.post('/friend_request', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Method", "'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
    friend = true;
    models.user.find({ "handle": req.body.my_handle, "friends.name": req.body.friend_handle }, function (err, doc) {
      if (err) {
        res.json(err);
      } else if (doc.length != 0) {
        console.log("Friend request : " + doc.length);
        console.log("Friend request : friend request already sent " + doc);
        res.send("Friend request already sent ");
      } else {
        console.log("Friend request : " + doc.length);
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
          //                console.log(doc);
          //            }
        });
        io.to(users[req.body.friend_handle]).emit('message', req.body);
      }
    });
  });

  app.post('/friend_request/confirmed', function (req, res) {
    console.log("friend request confirmed : " + req.body);
    if (req.body.confirm == "Yes") {
      models.user.find({
        "handle": req.body.friend_handle,
        "friends.name": req.body.my_handle
      }, function (err, doc) {
        if (err) {
          res.json(err);
        } else if (doc.length != 0) {
          console.log("Friend request confirmed : " + doc.length);
          console.log("Friend request confirmed : friend request already sent " + doc);
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

              console.log("friend request confirmed : Inside yes confirmed");
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
            //                console.log(doc);
            //            }
          });
        }
      });
    } else {

      console.log("friend request confirmed : Inside No confirmed");
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
          console.log("No");
        }
      });
    }
  });
};
//# sourceMappingURL=messagesController.js.map