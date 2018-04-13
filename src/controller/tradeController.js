import postatrade from '../models/postatrade'
import tradeMoreInfo from '../models/tradeMoreInfo'
import usersModel from '../models/usersModel'
import async from 'async';

var mongoose = require('mongoose');

const tradeController = {

  getAll: async(req, res, next) => {
    postatrade.find({}, (err, trade) => {
      if (err) return res.json({ isError: true, data: err });
      res.json({ isError: false, data: trade });
    });
  },

  getByCurrencyLoc: async(req, res, next) => {
    var request = Object.assign({}, req.query);
    delete request.limit;
    delete request.skip;
    postatrade.find(request, async(err, trade) => {
      if (err) return res.json({ isError: true, data: err });
      res.json({ isError: false, data: trade, count: await postatrade.find(request).count() }, )

    }).limit(parseInt(req.query.limit) || '').skip(parseInt(req.query.skip) || 0)

  },

  getOne: (req, res, next) => {
    postatrade.findById(req.params.id, (err, trade) => {
      if (err) {
        x ``
        res.json({ isError: true, data: err });
      }
      res.json({ isError: false, data: trade });
    });
  },

  create: async(req, res, next) => {

    var params = req.body;

    var userObj = await usersModel.find({ '_id': req.body.user }, { _id: 0, first_name: 1 });

    /*  params.firstName = await usersModel.findOne({ '_id': req.body.user }, { _id: 0, first_name: 1 }, (err, user) => {
       if (err) {
         res.json({ isError: true, data: err });
       } else { res.json({ isError: false, data: user }); }
     }); */
    params.firstName = userObj[0].first_name;
    console.log("params name =", params.firstName);

    postatrade.create(params, function(err, trade) {
      if (err) return res.json({ isError: true, data: err });
      else {
        tradeMoreInfo.create({ 'trade_id': trade._id, 'user_id': trade.user }, function(err, tradeInfo) {
          if (err) return res.json({ isError: true, data: err });
          else {
            usersModel.findOneAndUpdate({ '_id': tradeInfo.user_id }, { "trade_info": tradeInfo._id }, function(err, UpdateUser) {
              if (err) return res.json({ isError: true, data: err });
              res.json({ isError: false, data: UpdateUser })
            })
          }
        })
      }
    })
  },

  update: (req, res, next) => {
    postatrade.findOneAndUpdate(req.params.id, req.body, { new: true }, (err, trade) => {
      if (err) return res.json({ isError: true, data: err });
      res.json({ isError: false, data: trade })
    });
  },

  delete: (req, res, next) => {
    postatrade.remove({ _id: req.params.id }, (err, ok) => {
      if (err) return res.json({ isError: true, data: err });
    });
    res.json({ isError: false, data: true })
  },

  update: (req, res, next) => {
    var id = mongoose.Types.ObjectId(req.body.id);
    postatrade.findOneAndUpdate({ '_id': id }, req.body, { new: true }, (err, user) => {
      if (err) return res.json({ isError: true, data: err });
      res.json({ isError: false, data: user })
    });
  },
};

export default tradeController;