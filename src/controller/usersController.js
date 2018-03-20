import usersModel from '../models/usersModel'
import postatrade from '../models/postatrade'
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
        usersModel.create(req.body, function (err, user) {
            if (err) return res.json(err);
            res.json(user)
        })
    },

    update: (req, res, next) => {
      // var id = mongoose.Types.ObjectId(req.body.id);
        usersModel.findOneAndUpdate({'_id':req.body.id}, req.body, {new: true}, (err, user) => {
            if (err) return res.json(err);
            res.json(user)
        });
    },

    delete: (req, res, next) => {
        usersModel.remove({_id: req.params.id}, (err, ok) => {
            if (err) return res.json(err);
        });
        res.json(true)
    },
    changePassword:(req, res, next) => {
      usersModel.findOneAndUpdate({ $and: [ { "password": req.body.password }, { "email": req.body.email } ] },{
        $set:{"password":req.body.new_password}
      },(err, user) => {
        if (err) return res.json(err);
        res.json(user);
      })
    },
    changeEmail:(req, res, next) => {
      if (req.body.new_email) {
        usersModel.findOneAndUpdate({ $and: [ { "password": req.body.password }, { "email": req.body.email } ] },{
          $set:{"email":req.body.new_email}
        },(err, user) => {
          if (err) return res.json(err);
          res.json(user);
        })
      }
      else{
          res.json("NULL");
      }
    }
};

export default usersController;
