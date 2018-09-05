import usersModel from '../models/usersModel'
import tokenModel from './../models/tokenModel';
import messagesModel from '../models/messagesModel'

import mail_responseModel from '../models/mail_responseModel'
import postatrade from '../models/postatrade'
import jwt from 'jsonwebtoken';
import env from "../env";

const nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var encode = require('hashcode').hashCode;
const usersController = {
  getAllUnreadMessages: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    console.log("getAllMessages reqest from==>", decoded.email)
    messagesModel.find({
      'reciever': decoded.email,
      'isRead': false,
    }, (err, messages) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: messages
      });

    });
  },


  getAllMessagesWithFriend: (req, res, next) => {

    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    // console.log("getAllMessagesWithFriend reqest from==>", decoded.email, req.query.data)
    var friend = req.query.data.friend;
    var date = req.query.data.date;
    var temp = req.query.data.limit;
    var limit = '';

    var query = '';
    if (date) {
      query = {
        $or: [
          { $and: [{ sender: decoded.email }, { reciever: friend }] },
          { $and: [{ sender: friend }, { reciever: decoded.email }] }
        ],
        "date": { $lt: date }
      }
    } else {
      query = {
        $or: [
          { $and: [{ sender: decoded.email }, { reciever: friend }] },
          { $and: [{ sender: friend }, { reciever: decoded.email }] }
        ]
      }
    }



    messagesModel.find(
      query
    ).sort({ 'date': -1 }).limit(10)


    .exec(function(err, messages) {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: messages
      });
    });
  },

  turstUser: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);

    var trustUserTo = req.body.trustUserTo
    console.log("turstUser==>", req.body);

    var dataObj = {
      senderEmail: decoded.email,
      senderFirstName: decoded.first_name,
      status: 'trust'
    }
    console.log("turstUser==>", trustUserTo, dataObj);

    usersModel.find({ 'email': trustUserTo }, (errParent, resultParent) => {

      if (!errParent) {
        var turstByList = resultParent[0].trustBy || [];
        console.log("turstByList==> resultParent", turstByList);
        var isFound = turstByList.find((item) => item.senderEmail == decoded.email);
        if (isFound) {
          res.json({
            isError: false,
            isFound: true
          });
        }
        console.log("isfound==>", isFound);
        if (!isFound || turstByList.length === 0) {
          console.log("not found");
          usersModel.findOneAndUpdate({
            'email': trustUserTo
          }, { $push: { 'trustBy': dataObj } }, {
            upsert: true
          }, (err, users) => {
            if (err) return res.json({
              isError: true,
              data: err
            });
            res.json({
              isError: false,
              data: users
            });
          });
        }
      }
    })
  },

  unblockUser: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    var unblockUserTo = req.body.unblockUserTo
    var dataObj = {
      senderEmail: decoded.email,
      senderFirstName: decoded.first_name,
      status: 'Unblocked'
    }
    console.log("unblockUser=>", decoded.email, dataObj);

    var query = {
      'email': decoded.email
    }
    usersModel.find(query, (err, result) => {
      if (!err) {
        console.log("friends list", result);
        var friendsList = result[0].friends;
        if (friendsList) {


          friendsList.forEach((item, index) => {
            if (item.senderEmail == unblockUserTo) {
              usersModel.findOneAndUpdate({
                [`friends.${index}.senderEmail`]: item.senderEmail
              }, {
                $set: {
                  [`friends.${index}.status`]: 'Friend'
                }
              }, (errBlock, resultFriend) => {

                if (errBlock) return res.json({
                  isError: true,
                  data: err
                });


                usersModel.findOneAndUpdate({
                  'email': unblockUserTo
                }, { $push: { blockBy: dataObj } }, {
                  upsert: true
                }, (err, users) => {
                  if (err) return res.json({
                    isError: true,
                    data: err
                  });
                  res.json({
                    isError: false,
                    data: result
                  });
                });


              })
            }
          })
        }

      }
    })


  },
  blockUser: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    var blockUserTo = req.body.blockUserTo
    var dataObj = {
      senderEmail: decoded.email,
      senderFirstName: decoded.first_name,
      status: 'blocked'
    }
    console.log("blockUser=>", decoded.email, dataObj);

    var query = {
      'email': decoded.email
    }
    usersModel.find(query, (err, result) => {
      if (!err) {
        console.log("friends list", result);
        var friendsList = result[0].friends;
        if (friendsList) {


          friendsList.forEach((item, index) => {
            if (item.senderEmail == blockUserTo) {
              usersModel.findOneAndUpdate({
                [`friends.${index}.senderEmail`]: item.senderEmail
              }, {
                $set: {
                  [`friends.${index}.status`]: 'Blocked'
                }
              }, (errBlock, resultFriend) => {

                if (errBlock) return res.json({
                  isError: true,
                  data: err
                });


                usersModel.findOneAndUpdate({
                  'email': blockUserTo
                }, { $push: { blockBy: dataObj } }, {
                  upsert: true
                }, (err, users) => {
                  if (err) return res.json({
                    isError: true,
                    data: err
                  });
                  res.json({
                    isError: false,
                    data: result
                  });
                });


              })
            }
          })
        }

      }
    })


  },
  setMsgRead: (req, res, next) => {
    // console.log("setMsgRead ==>", req.body, req.query);
    var arrMsgID = [];
    arrMsgID = req.body.data;
    console.log("arrMsgID", arrMsgID);
    var _id = '';
    var arrMsgIDList = arrMsgID.map(function(aField) {
      // return mongoose.Types.ObjectId(aField);
      return aField
      console.log(aField);
    })


    var bulk = messagesModel.collection.initializeUnorderedBulkOp();

    arrMsgID.forEach((item, index) => {
      _id = mongoose.Types.ObjectId(item)
        // var id = arrMsgID[index];
      bulk.find({ _id: _id }).updateOne({ $set: { isRead: true } });

    })
    bulk.execute((err, messages) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: messages
      });
    });







  },
  getFriendsList: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    console.log("addUserInfo", decoded.email)
    usersModel.find({
      'email': decoded.email
    }, { "friends": 1, "_id": 0 }, (err, users) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: users
      });
    });
  },
  getUserInfo: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    console.log("decoded.email=>", decoded.email);
    usersModel.find({
      'email': decoded.email
    }, (err, users) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      console.log("users==>", users);
      if (users) {
        res.json({
          isError: false,
          data: users
        });
      } else {
        res.redirect('/#/login');
      }

    });
  },


  acceptFriendRequest: (req, res, next) => {

    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    var senderEmail = req.body.senderEmail;
    console.log("acceptFriendRequest senderEmail==>", senderEmail);

    var query = {
      'email': decoded.email
    }
    usersModel.find(query, (err, result) => {
      if (!err) {
        console.log("friends list", result);
        var friendsList = result[0].friends;
        friendsList.forEach((item, index) => {
          if (item.senderEmail == senderEmail) {
            usersModel.findOneAndUpdate({
              [`friends.${index}.senderEmail`]: senderEmail
            }, {
              $set: {
                [`friends.${index}.status`]: 'Friend'
              }
            }, (errFriend, resultFriend) => {

              if (errFriend) return res.json({
                isError: true,
                data: err
              });

              var dataObj = {
                senderEmail: decoded.email,
                senderFirstName: decoded.first_name,
                status: 'Friend'
              }

              usersModel.findOneAndUpdate({
                'email': senderEmail
              }, { $push: { friends: dataObj } }, {
                upsert: true
              }, (err, users) => {
                if (err) return res.json({
                  isError: true,
                  data: err
                });
                res.json({
                  isError: false,
                  data: users
                });
              });


            })
          }
        })


      }
    })

  },

  addUserProfilePic: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    var imgURL = req.body.imgURL;
    usersModel.findOneAndUpdate({
      'email': decoded.email
    }, {
      $set: {
        imgURL: imgURL
      }
    }, (err, data) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      else {
        res.json({
          isError: false,
          data: data
        })
      }
    });
  },
  addMessage: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    var sender = decoded.email;
    var data = req.body;
    data.sender = sender;
    data.date = new Date();
    console.log("Data for message==>", data);
    messagesModel.create(data, function(err, message) {
      if (err) return res.json(err);
      res.json({
        isError: false,
        data: message,
      })
    })
  },

  friendReq: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    var to = req.body.To;
    console.log("To  Details=>", to);

    var dataObj = {
      senderEmail: decoded.email,
      senderFirstName: decoded.first_name,
      status: 'Pending'
    }
    console.log("Senders Details=>", dataObj);
    usersModel.find({ 'email': to }, (errParent, resultParent) => {
      if (!errParent) {
        var friendsList = resultParent[0].friends || [];
        console.log("friendList==>", friendsList);
        var isFound = friendsList.find((item) => item.senderEmail == decoded.email);
        if (isFound) {
          res.json({
            isError: false,
            isFound: true
          });
        }
        console.log("isfound==>", isFound);
        if (!isFound || friendsList.length === 0) {
          console.log("not found");
          usersModel.findOneAndUpdate({
            'email': to
          }, { $push: { friends: dataObj } }, {
            upsert: true
          }, (err, users) => {
            if (err) return res.json({
              isError: true,
              data: err
            });
            res.json({
              isError: false,
              data: users
            });
          });
        }
      }
    })
  },
  unfriend: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    var unfriendTo = req.body.unfriendTo;
    var query = {
      'email': decoded.email
    }
    console.log("unfriend==>", query, req.body);

    usersModel.find(query, (err, result) => {
      if (!err) {
        var friendsList = result[0].friends;
        friendsList.forEach((item, index) => {
          if (item.senderEmail == unfriendTo) {
            usersModel.findOneAndUpdate({
              [`friends.${index}.senderEmail`]: item.senderEmail
            }, {
              $set: {
                [`friends.${index}.status`]: 'unFriend'
              }
            }, (errFriend, resultFriend) => {

              if (errFriend) return res.json({
                isError: true,
                data: err
              });
            })
          }
        })


      }
    })

  },

  getAll: async(req, res, next) => {
    usersModel.find({}, (err, users) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: users
      });
    });

  },
  addUserInfo: async(req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    usersModel.findOneAndUpdate({

      'email': decoded.email
    }, req.body, {
      new: true
    }, (err, user) => {
      if (err) return res.json({
        success: false,
        data: err
      });
      res.json({
        success: true,
        data: user
      })
    });

  },
  userProfile: (req, res, next) => {
    // var _id = Number(req.query.id);

    var _id = mongoose.Types.ObjectId(req.query.id);
    console.log("id=>", _id);
    usersModel.findOne({
      _id: _id
    }, (err, user) => {

      if (err) {
        res.json({
          isError: true,
          data: err
        });
      } else {
        var email = user.email;
        console.log("Email==>", email);
        if (user) {
          tokenModel.findOne({ 'email': email }, (err, tokenData) => {
            res.json({
              isError: false,
              data: { user: user, tokenData: tokenData }
            });
          }).sort({ _id: -1 }).limit(1)
        }


      }
    });
  },


  getOne: (req, res, next) => {
    // console.log("------------",next);
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    usersModel.findOne({
      'email': decoded.email
    }, (err, user) => {
      if (err) {
        res.json({
          isError: true,
          data: err
        });
      } else {
        res.json({
          isError: false,
          data: user
        });
      }
    });
  },

  create: (req, res, next) => {
    usersModel.create(req.body, function(err, user) {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: user
      })
    })
  },

  update: (req, res, next) => {
    // var id = mongoose.Types.ObjectId(req.body.id);
    usersModel.findOneAndUpdate({
      '_id': req.body.id
    }, req.body, {
      new: true
    }, (err, user) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: user
      })
    });
  },

  delete: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    usersModel.findOneAndUpdate({
      'email': decoded.email
    }, {
      isActive: 'inactive'
    }, (err, ok) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      else {
        res.json({
          isError: true,
          data: true
        })
      }
    });
  },
  forgetPassword: (req, res, next) => {
    var email = req.body.email;
    var host = req.headers.host;

    usersModel.find({
      'email': req.body.email
    }, function(err, result) {
      if (err) {
        res.json({
          isError: true,
          data: err
        })
      } else {
        if (result != "") {
          var d = new Date();
          var v = new Date();
          v.setMinutes(d.getMinutes() + 30);
          const token = jwt.sign({
            exp: Math.floor(v),
            email: req.body.email,
          }, env.App_key);
          console.log(result);
          nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'itstechinvento@gmail.com',
                pass: 'techinvento123'
              }
            });

            // setup email data with unicode symbols
            let mailOptions = {
              from: 'itstechinvento@gmail.com', // sender address
              to: email, // list of receivers
              subject: 'Create New Password', // Subject line
              text: 'As requested,here is a link to allow you to select a new password', // plain text body
              html: '<a href=http://' + host + '/recover?accessToken=' + token + '>Click to recover password</a>' // html body

              // html: '<a href=http://localhost:3000/recover?accessToken=' + token + '>Click to recover password</a>' // html body
            };
            console.log("Mailoptions", mailOptions);

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              var information = JSON.stringify(info);

              console.log('Transporter', err, information);
              mail_responseModel.create({
                'email': email,
                'error': error,
                'info': information
              }, function(err, mail_response) {
                if (err) {
                  console.log("mail_responseModel error=>", err);
                } else {
                  console.log("mail_responseModel No error", mail_response);
                }
              })


              if (error) {
                return console.log("error--11--", error);
                res.json({
                  isError: true,
                  data: error
                });
              } else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                res.json({
                  isError: false,
                  data: 'Please check your Email'
                });

              }

              // Preview only available when sending through an Ethereal account
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });

            // res.json({ isError: false, data: 'Please check your Email' });

            //    res.json(mailOptions);
          });
        } else {
          res.json({
            isError: true,
            data: 'please provide a valid mail'
          });
        }
      }
    })
  },

  storeBasicUserInfo: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    var id = req.body.id;
    usersModel.findOneAndUpdate({
      'email': decoded.email
    }, {
      'basicInfo': req.body
    }, {
      new: true
    }, (err, user) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: user
      })
    });
  },


  isVerified: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    console.log("isVerified==>", decoded.email);

    usersModel.findOneAndUpdate({
      'email': decoded.email
    }, (err, user) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: user
      });
    });

  },

  emailVerification: (req, res, next) => {
    var host = req.headers.host;
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    console.log("Emailverification==>", decoded.email);
    usersModel.find({
      'email': decoded.email
    }, function(err, result) {
      if (err) {
        res.json({
          isError: true,
          data: err
        })
      } else {
        if (result != "") {
          var d = new Date();
          var v = new Date();
          v.setMinutes(d.getMinutes() + 30);
          const token = jwt.sign({
            exp: Math.floor(v),
            email: decoded.email,
          }, env.App_key);
          console.log(result);
          nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'itstechinvento@gmail.com',
                pass: 'techinvento123'
              }
            });
            var htmlforemail = ``;
            let mailOptions = {
              from: 'itstechinvento@gmail.com', // sender address
              to: decoded.email, // list of receivers
              subject: 'Email Verification', // Subject line
              text: 'Please Click below link to Verify Your Email address', // plain text body
              html: 'Please<a id ="varified"href=http://' + host + '/ev/' + token + '>Click Here to processed email verification</a>',
            };
            transporter.sendMail(mailOptions, (error, info) => {

              if (error) {
                res.json({
                  isError: true,
                  data: error
                });
                return console.log("error--11--", error);
              } else {
                mail_responseModel.create({
                  'email': decoded.email,
                  'error': error,
                  'info': info
                }, function(err, mail_response) {
                  if (err) {
                    console.log("mail_responseModel error=>", err);
                  } else {
                    console.log("mail_responseModel ", mail_response);
                  }
                })
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                res.json({
                  isError: false,
                  data: 'Please check your email'
                });
              }
            });
          });
        } else {
          res.json({
            isError: true,
            data: 'please provide a valid mail'
          });
        }
      }
    })
  },

  emailVerified: (req, res, next) => {
    var decoded = jwt.verify(req.params.token, env.App_key);
    var dt = new Date();
    var checkDate = new Date(decoded.exp);
    if (dt < checkDate) {
      console.log("----------");
      usersModel.findOneAndUpdate({
        "email": decoded.email
      }, {
        $set: {
          "verification.email_verified": true
        }
      }, (err, user) => {
        if (err) return res.json({
          isError: true,
          data: err
        });
        res.redirect('/#/profile');
        // res.send('verified')
        //res.json({ isError: false, data: "your E-Mail address is verified sucessfully" });

      });
    } else {
      res.json({
        isError: true,
        data: "session expire"
      });
    }
  },

  varifyToken: (req, res, next) => {
    console.log("in verify Token=>");
    var decoded = jwt.verify(req.params.token, env.App_key);
    var dt = new Date();
    var checkDate = new Date(decoded.exp);
    if (dt < checkDate) {
      console.log("----");
      var d = new Date();
      var v = new Date();
      v.setMinutes(d.getMinutes() + 60);
      const token = jwt.sign({
        exp: Math.floor(v),
        email: decoded.email,
      }, env.App_key);
      res.redirect('/recover/' + token)
    } else {
      res.json({
        isError: true,
        data: "session expire"
      });
    }
  },
  changePassword: (req, res, next) => {
    // console.log("req.headers--->", req.headers['authorization'], req.body);
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    req.body.password = encode().value(req.body.password);
    req.body.new_pasword = encode().value(req.body.new_pasword);
    usersModel.findOneAndUpdate({
      $and: [{
        "password": req.body.password
      }, {
        "email": decoded.email
      }]
    }, {
      $set: {
        "password": req.body.new_pasword,
      }
    }, (err, user) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: user
      });
      console.log("user=>", user);
    })
  },
  recoverPassword: (req, res, next) => {
    console.log("req in recover password api=>", req.body, req.query, req.params);
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    if (req.body.password != "" && req.body.password.length > 6) {
      req.body.password = encode().value(req.body.password);
      var checkDate = new Date(decoded.exp);
      var dt = new Date();
      console.log(dt, "------", checkDate);
      if (dt < checkDate) {
        usersModel.findOneAndUpdate({
          "email": decoded.email
        }, {
          $set: {
            "password": req.body.password
          }
        }, (err, user) => {
          if (err) return res.json(err);
          res.json({
            isError: false,
            data: user
          });
        });
      } else {
        res.json({
          isError: true,
          data: "session expire"
        });
      }
    } else {
      res.json({
        isError: true,
        data: "Please provide valid password"
      });
    }

  },
  changeEmail: (req, res, next) => {
    if (req.body.new_email) {
      req.body.password = encode().value(req.body.old_password);
      usersModel.findOneAndUpdate({
        $and: [{
          "password": req.body.password
        }, {
          "email": req.body.email
        }]
      }, {
        $set: {
          "email": req.body.new_email,
        }
      }, (err, user) => {
        if (err) return res.json({
          isError: true,
          data: err
        });
        res.json({
          isError: false,
          data: user
        });
      })
    } else {
      res.json({
        isError: true,
        data: "NULL"
      });
    }
  },


};


export default usersController;