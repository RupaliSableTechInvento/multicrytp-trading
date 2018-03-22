import usersModel from '../models/usersModel'
import postatrade from '../models/postatrade'
import jwt from 'jsonwebtoken';
import env from "../env";
var mongoose = require('mongoose');

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
          res.json('http://localhost:3000/cp/' + token);
        } else {
          res.json('please provide a valid mail');
        }
      }
    })
  },

  storeBasicUserInfo: (req, res, next) => {
      var id =req.body.id;
      usersModel.findOneAndUpdate({'_id':id},{'basicInfo':req.body}, {new: true}, (err, user) => {
          if (err) return res.json(err);
          res.json(user)
      });
  },

  emailVarification:(req, res, next)=>{
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
          res.json('http://localhost:3000/ev/' + token);
        } else {
          res.json('please provide a valid mail');
        }
      }
    })
  },

  emailVarified:(req, res, next)=>{
    var decoded = jwt.verify(req.params.token, env.App_key);
    var dt = new Date();
    var checkDate=new Date(decoded.exp);
    if (dt<checkDate) {
      console.log("----------");
      usersModel.findOneAndUpdate({"email": decoded.email},{
        $set:{"varification.email_varified":"varified"}
      },(err, user) => {
        if (err) return res.json(err);
        res.json(user);
      });
    }
    else{
        res.json("session expire");
    }
  },

  varifyToken: (req, res, next) => {
    var decoded = jwt.verify(req.params.token, env.App_key);
    var dt = new Date();
    var checkDate=new Date(decoded.exp);
    if (dt<checkDate) {
      console.log("----");

      var d = new Date();
      var v = new Date();
      v.setMinutes(d.getMinutes() + 5);
      const token = jwt.sign({
        exp: Math.floor(v),
        email: decoded.email,
      }, env.App_key);
      res.redirect('/recover/'+token)
    }
    else{

        res.json("session expire");
    }
  },

  recoverPassword: (req, res, next) => {
    var decoded = jwt.verify(req.body.token, env.App_key);
    var dt = new Date();
    var checkDate=new Date(decoded.exp);
    if (dt<checkDate) {
      usersModel.findOneAndUpdate({"email": decoded.email},{
        $set:{"password":req.body.password}
      },(err, user) => {
        if (err) return res.json(err);
        res.json(user);
      });
    }
    else{
        res.json("session expire");
    }
  },

  changeEmail: (req, res, next) => {
    if (req.body.new_email) {
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
