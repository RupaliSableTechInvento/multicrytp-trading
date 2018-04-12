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
    // console.log("req==>", req.body, req.params, req.query);
    var cryptocurrency = req.query.currency;
    var location = req.query.location;
    var tradeMethod = req.query.tradeMethod;
    var traderType = req.query.traderType;

    // console.log("req", req.query);
    // console.log("cryptocurrency in trade controller=>", cryptocurrency);
    // console.log("Location in trade controller=>", location);
    postatrade.find({
      "cryptoCurrency": req.query.currency,
      "location": req.query.location,
      "traderType": req.query.traderType,
      "tradeMethod": req.query.tradeMethod,
    }, (err, trade) => {
      if (err) return res.json({ isError: true, data: err });
      // console.log("data", data)
      //var userId = trade[0].user;
      // console.log("trade", trade)
      var tradeArr = [];

      for (var i = 0; i < trade.length; i++) {

        console.log("trade array", i)
          // var userId = 'user' in item ? item.user : '';
          // console.log("uer id=>", userId)
          // const userData = await usersModel.findOne({ '_id': trade[i].user });
          // item.user = userData;
          // item.userInfo = userData;
        trade[i].user = "";

        tradeArr.push(trade[i])
          // res.json({ isError: false, data: tradeArr })
          // console.log("trade item", index, trade.length)
          // if (index + 1 == trade.length) {

        // }
      };
      res.json({ isError: false, data: tradeArr })





      // res.json({ isError: false, data: trade });
    });




  },

  getOne: (req, res, next) => {
    postatrade.findById(req.params.id, (err, trade) => {
      if (err) {

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