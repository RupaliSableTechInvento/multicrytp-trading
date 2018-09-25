import usersModel from './../models/usersModel';
import tokenModel from './../models/tokenModel';
import jwt from 'jsonwebtoken';
import env from "../env";
import walletController from './walletController';
import tradeModel from '../models/postatrade';
var encode = require('hashcode').hashCode;

import express from 'express';
const app = express();

// var http = require('http')(9004);
// global = {};

const authController = {
  login: (req, res, next) => {
    req.body.password = encode().value(req.body.password);
    const credential = req.body;
    console.log("in login credential==>", credential);
    global.email = credential.email;
    usersModel.findOne({
      email: credential.email,
      password: credential.password
    }, (err, user) => {
      if (err) res.json(err);
      if (user) {
        console.log("User to get login=>", user)
        var d = new Date();
        var v = new Date();
        v.setMinutes(d.getMinutes() + 5);
        const token1 = jwt.sign({
          _id: user._id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          expiry: v
        }, env.App_key);
        let token = new tokenModel();
        console.log(user.email);
        var currentTime = new Date();
        var token2 = {
          'token': token1,
          email: user.email,
          isActive: "active",
          expiry: v,
          userActiveTime: currentTime
        };
        tokenModel.findOneAndUpdate({
          $and: [{
            email: user.email
          }, {
            isActive: "active"
          }]
        }, {
          $set: {
            isActive: "inactive"
          }
        }, (err, data) => {
          if (err) return res.json({
            isError: true,
            data: err
          });
          else {
            tokenModel.create(token2, function(err, token) {
              if (err) return res.json(err);
              res.json({
                isError: false,
                data: token1,
                user: {
                  first_name: user.first_name,
                  last_name: user.last_name,
                  id: user._id,
                }
              });
            })
          }
        })
      } else {
        res.json({
          isError: true,
          data: "email or password incorrect !"
        })
      }
    });
  },

  getActiveUser: async(req, res, next) => {
    await tokenModel.find({
      isActive: "active"
    }, (err, tokenModel) => {
      if (err) return res.json({
        isError: true,
        tokenModel: err
      });
      else {
        var emailObj = [];
        console.log("trade model result", tokenModel.length);
        for (let index = 0; index < tokenModel.length; index++) {
          emailObj.push(tokenModel[index].email);
        }
        console.log("active user email ", emailObj);

        usersModel.find({
          'email': {
            $in: emailObj
          }
        }, (err, user) => {
          if (err) return res.json({
            isError: true,
            user: err
          });
          else {
            return res.json({
              isError: false,
              tokenModel: tokenModel,
              user: user
            });
          }
        });
      }
    })
  },

  register: (req, res, next) => {
    console.log("req.body for register", req.body)
    var account_created = new Date();
    if (req.body.password != "" && req.body.password.length > 5) {
      req.body.password = encode().value(req.body.password);
      req.body.account_created = account_created;
      var name = req.body.email;
      console.log("name==>", name);

      req.body.wallets = {
        BTC: {
          isAddressCreated: false
        },
        LTC: {
          isAddressCreated: false
        },
        DOGE: {
          isAddressCreated: false
        },
      }
      console.log("req.body Register==>", req.body);


      let user = new usersModel(req.body);
      user.save(req.body, function(err, user) {

        if (err) return res.json(err);
        else {

          res.json(user)

        }
      })


      console.log("Account Created==>", account_created);

    } else {
      res.json("Please provide valid password");
    }
  },
  logout: (req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    tokenModel.findOneAndUpdate({
      $and: [{
        'email': decoded.email
      }, {
        'isActive': 'active'
      }, {
        'token': req.headers['authorization']
      }]
    }, {
      $set: {
        'isActive': 'inactive',
        'userInactiveTime': new Date()
      }
    }, (err, data) => {
      if (err) {
        res.json({
          success: false,
          data: err
        });
      } else {
        res.json({
          success: true,
          data: data
        });
      }
    })
  },
};

export default authController;