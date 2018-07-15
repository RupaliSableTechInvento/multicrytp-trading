'use strict';

var _usersModel = require('../models/usersModel');

var _usersModel2 = _interopRequireDefault(_usersModel);

var _http = require('http');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var path = require('path');
var bodyParser = require('body-parser');

module.exports = function (app, io) {
  console.log("global");
  var app = app;
  var io = io;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  var email = global.email || '';
  console.log("Email id in messages Controller=>", email);
  var users = {};
  var keys = {};
  var friends = [];
  var pending = [];
  var all_friends = [];

  if (email) {
    io.on('connection', function (socket) {
      console.log("Connection :User is connected  " + email);
      console.log("Connection : " + socket.id);
      io.to(socket.id).emit('handle', email);
      users[email] = email;
      keys[socket.id] = socket.id;
      console.log("Users list : " + users);
      console.log("keys list : " + keys);
      _usersModel2.default.findOneAndUpdate({ "email": email }, { $set: { isActive: "active" } }, { friends: 1, _id: 0 }, function (err, doc) {
        if (err) {
          res.json(err);
        } else {
          friends = [];
          pending = [];
          all_friends = [];
          console.log("friends list: " + doc);
          var list = doc.friends.slice();
          console.log(list);

          for (var i in list) {
            if (list[i].status == "Friend") {
              friends.push(list[i]);
            } else if (list[i].status == "Pending") {
              pending.push(list[i]);
            } else {
              continue;
            }
          }

          console.log("pending list: " + pending);
          console.log("friends list: " + friends);
          io.to(socket.id).emit('friend_list', friends);
          io.to(socket.id).emit('pending_list', pending);
          io.emit('users', users);
        }
      });

      socket.on('group message', function (msg) {
        console.log(msg);
        io.emit('group', msg);
      });

      socket.on('private message', function (msg) {
        console.log('message  :' + msg.split("#*@")[0]);
        models.messages.create({
          "message": msg.split("#*@")[1],
          "sender": msg.split("#*@")[2],
          "reciever": msg.split("#*@")[0],
          "date": new Date()
        });
        io.to(users[msg.split("#*@")[0]]).emit('private message', msg);
      });

      socket.on('disconnect', function () {
        console.log("disconned call", email);
        _usersModel2.default.findOneAndUpdate({ "email": email }, { $set: { isActive: "inactive" } }, function (err, doc) {
          if (err) {
            res.json(err);
          } else {
            console.log("logout=>", doc);
          }
        });

        delete users[keys[socket.id]];
        delete keys[socket.id];
        io.emit('users', users);
        console.log(users);
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