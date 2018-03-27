import usersModel from '../models/usersModel'
import postatrade from '../models/postatrade'
import jwt from 'jsonwebtoken';
import env from "../env";
const nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var encode = require( 'hashcode' ).hashCode;
const usersController = {

  getAll: async (req, res, next) => {
    usersModel.find({}, (err, users) => {
      if (err) return res.json(err);
      res.json(users);
    });
  },

  getOne: (req, res, next) => {
    console.log("------------");
    usersModel.findById(req.params.id, (err, user) => {
      res.json(user || {});
    });
  },

  create: (req, res, next) => {
    usersModel.create(req.body, function(err, user) {
      if (err) return res.json(err);
      res.json(user)
    })
  },

  update: (req, res, next) => {
    // var id = mongoose.Types.ObjectId(req.body.id);
    usersModel.findOneAndUpdate({
      '_id': req.body.id
    }, req.body, {
      new: true
    }, (err, user) => {
      if (err) return res.json(err);
      res.json(user)
    });
  },

  delete: (req, res, next) => {
    usersModel.remove({
      _id: req.params.id
    }, (err, ok) => {
      if (err) return res.json(err);
    });
    res.json(true)
  },
  changePassword: (req, res, next) => {
    var email= req.body.email;
    usersModel.find({
      'email': req.body.email
    }, function(err, result) {
      if (err) {
        res.json(err)
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
                user: 'mailerabhi111@gmail.com',
                pass: 'Abhi@1234'
              }
            });

            // setup email data with unicode symbols
            let mailOptions = {
              from: 'mailerabhi111@gmail.com', // sender address
              to: email, // list of receivers
              subject: 'Change Password', // Subject line
              text: 'Please Click below link to change password', // plain text body
              html: '<a href=http://localhost:3000/cp/' + token + '>Click Here</a>' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log("error--11--", error);
                res.json("error--11--", error);
              } else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                res.json('Please check your Email');
              }
              // Preview only available when sending through an Ethereal account
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
        //    res.json(mailOptions);
          });
        } else {
          res.json('please provide a valid mail');
        }
      }
    })
  },

  storeBasicUserInfo: (req, res, next) => {
    var id = req.body.id;
    usersModel.findOneAndUpdate({
      '_id': id
    }, {
      'basicInfo': req.body
    }, {
      new: true
    }, (err, user) => {
      if (err) return res.json(err);
      res.json(user)
    });
  },

  emailVarification: (req, res, next) => {
    var email=req.body.email;
    usersModel.find({
      'email': req.body.email
    }, function(err, result) {
      if (err) {
        res.json(err)
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
                user: 'mailerabhi111@gmail.com',
                pass: 'Abhi@1234'
              }
            });
            let mailOptions = {
              from: 'mailerabhi111@gmail.com', // sender address
              to: email, // list of receivers
              subject: 'Change Password', // Subject line
              text: 'Please Click below link to change password', // plain text body
              html: 'Please<a href=http://localhost:3000/ev/' + token + '>Click Here</a>' // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                res.json("error--11--", error);
                return console.log("error--11--", error);
              } else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                res.json('Please check your email');
              }
            });
          });
        } else {
          res.json('please provide a valid mail');
        }
      }
    })
  },

  emailVarified: (req, res, next) => {
    var decoded = jwt.verify(req.params.token, env.App_key);
    var dt = new Date();
    var checkDate = new Date(decoded.exp);
    if (dt < checkDate) {
      console.log("----------");
      usersModel.findOneAndUpdate({
        "email": decoded.email
      }, {
        $set: {
          "varification.email_varified": "varified"
        }
      }, (err, user) => {
        if (err) return res.json(err);
        res.json("email_varified");
      });
    } else {
      res.json("session expire");
    }
  },

  varifyToken: (req, res, next) => {
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
      res.json("session expire");
    }
  },

  recoverPassword: (req, res, next) => {
    var decoded = jwt.verify(req.body.token, env.App_key);
    if (req.body.password != "" && req.body.password.length > 6) {
      req.body.password=encode().value(req.body.password);
      var dt = new Date();
      var checkDate = new Date(decoded.exp);
      if (dt < checkDate) {
        usersModel.findOneAndUpdate({
          "email": decoded.email
        }, {
          $set: {
            "password": req.body.password
          }
        }, (err, user) => {
          if (err) return res.json(err);
          res.json(user);
        });
      } else {
        res.json("session expire");
      }
    }
    else{
        res.json("Please provide valid password");
    }

  },

  changeEmail: (req, res, next) => {
    if (req.body.new_email) {
      req.body.password=encode().value(req.body.password);
      usersModel.findOneAndUpdate({
        $and: [{
          "password": req.body.password
        }, {
          "email": req.body.email
        }]
      }, {
        $set: {
          "email": req.body.new_email
        }
      }, (err, user) => {
        if (err) return res.json(err);
        res.json(user);
      })
    } else {
      res.json("NULL");
    }
  }
};

export default usersController;
