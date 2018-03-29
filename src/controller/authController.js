import usersModel from './../models/usersModel';
import tokenModel from './../models/tokenModel';
import jwt from 'jsonwebtoken';
import env from "../env";
var encode = require('hashcode').hashCode;
const authController = {
  login: (req, res, next) => {
    req.body.password = encode().value(req.body.password);
    const credential = req.body;
    usersModel.findOne({
      email: credential.email,
      password: credential.password
    }, (err, user) => {
      if (err) res.json(err);
      if (user !== null) {
        var d = new Date();
        var v = new Date();
        v.setMinutes(d.getMinutes() + 60);
        const token1 = jwt.sign({
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          expiry:v
        }, env.App_key);
        let token = new tokenModel();
        console.log(user.email);
        var token2={'token':token1,email: user.email,isActive:"active",expiry:v};
        tokenModel.findOneAndUpdate({$and:[{email:user.email},{isActive:"active"}]},{$set:{isActive:"inactive"}},(err,data)=>{
          if (err) return res.json({isError:true,data:err});
          else{
            tokenModel.create(token2, function(err, token) {
              if (err) return res.json(err);
              res.json({isError:false,data:token1});
            })
          }
        })
      } else {
        res.json({isError:true,data:"email or password incorrect !"})
      }
    });
  },

  register: (req, res, next) => {
    console.log("req.body", req.body, req.params, req.query)
    if (req.body.password != "" && req.body.password.length > 6) {
      req.body.password = encode().value(req.body.password);
      let user = new usersModel(req.body);
      user.save(req.body, function(err, user) {
        if (err) return res.json(err);
        res.json(user)
      })
    }
    else{
      res.json("Please provide valid password");
    }
  },
  logout:(req, res, next) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    tokenModel.findOneAndUpdate({$and:[{'email':decoded.email},{'isActive':'active'}]},{$set:{'isActive':'inactive'}},(err,data)=>{
      if (err) {
        res.json({isError:true,data:err});
      }
      else{
        res.json({isError:false,data:data});
      }
    })
  },
};

export default authController;
