import postatrade from '../models/postatrade'
import tradeMoreInfo from '../models/tradeMoreInfo'
import usersModel from '../models/usersModel'

var mongoose = require('mongoose');

const tradeController = {

    getAll: async (req, res, next) => {
        postatrade.find({}, (err, trade) => {
            if (err) return res.json({isError:true,data:err});
            res.json({isError:false,data:trade});
        });
    },

    getOne: (req, res, next) => {
        postatrade.findById(req.params.id, (err, trade) => {
          if (err) {

            res.json({isError:true,data:err});
          }
          res.json({isError:false,data:trade});
        });
    },

    create: (req, res, next) => {
        postatrade.create(req.body, function (err, trade) {
            if (err) return res.json({isError:true,data:err});
            else{
              tradeMoreInfo.create({'trade_id':trade._id,'user_id':trade.user},function (err, tradeInfo) {
                if (err) return res.json({isError:true,data:err});
                else{
                  usersModel.findOneAndUpdate({'_id':tradeInfo.user_id},{"trade_info":tradeInfo._id},function (err, UpdateUser) {
                    if (err) return res.json({isError:true,data:err});
                    res.json({isError:false,data:UpdateUser})
                  })
                }
              })
            }
        })
    },

    update: (req, res, next) => {
        postatrade.findOneAndUpdate(req.params.id, req.body, {new: true}, (err, trade) => {
            if (err) return res.json({isError:true,data:err});
            res.json({isError:false,data:trade})
        });
    },

    delete: (req, res, next) => {
        postatrade.remove({_id: req.params.id}, (err, ok) => {
            if (err) return res.json({isError:true,data:err});
        });
        res.json({isError:false,data:true})
    },

    update: (req, res, next) => {
      var id = mongoose.Types.ObjectId(req.body.id);
        postatrade.findOneAndUpdate({'_id':id}, req.body, {new: true}, (err, user) => {
            if (err) return res.json({isError:true,data:err});
            res.json({isError:false,data:user})
        });
    },
};

export default tradeController;
