import jwt from 'jsonwebtoken';
import env from "../env";
import tokenModel from './../models/tokenModel';
const authenticated = (req, res, next) => {
    const token = req.headers['authorization'];
    var today=new Date();
    tokenModel.findOne({$and:[{'token':token},{'isActive':'active'},{expiry:{$gt:today}}]},(err, user) =>{
      if (err) {
        res.json({isError:true,data:err});
      }
      else{
        if (user!=null) {
          // console.log("-------------",user);
          jwt.verify(token, env.App_key, (err, decode) => {
              if (err) {
                  res.json({isError:true,data:err})
              } else {
                  next()
              }
          });
        }
        else{
          res.json({isError:true,data:"Middle Order Login Again"})
        }
      }
    });

};
// const authenticated = (req, res, next) => {
//
// }
export default authenticated;
