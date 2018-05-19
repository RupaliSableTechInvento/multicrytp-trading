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

  /*  getByCurrencyLoc: async(req, res, next) => {
     var searchQ = {
       cryptoCurrency: req.query.datatable.query.cryptoCurrency,
       location: req.query.datatable.query.location,
       tradeMethod: req.query.datatable.query.tradeMethod,
       traderType: req.query.datatable.query.traderType
     }
     postatrade.find(searchQ).limit(parseInt(req.query.datatable.query.limit)).toArray(function(err, data) {
         res.send({
           isError: false,
           data: { 'success': true, 'data': data },
           count: postatrade.find(searchQ).count()
         })
       })
   }, */


  getByCurrencyLoc: async(req, res, next) => {

    var request = req.query.query;
    var cryptoCurrency = req.query.query.cryptoCurrency;
    var location = req.query.query.location;
    var tradeMethod = req.query.query.tradeMethod;
    var traderType = req.query.query.traderType;
    console.log("request=>", request);
    // delete request.limit;
    // delete request.skip;
    // var count = postatrade.find({ cryptoCurrency: 'BITCOIN' }).count();
    // var count1 = count / 10;

    postatrade.find({
        cryptoCurrency: cryptoCurrency,
        location: location,
        tradeMethod: tradeMethod,
        traderType: traderType,
      }, async(err, trade) => {
        if (err) return res.json({ isError: true, data: err });
        res.json({
          isError: false,
          "meta": {
            "page": 1,
            "pages": 35,
            "perpage": 10,
            "total": await postatrade.find({
              cryptoCurrency: cryptoCurrency,
              location: location,
              tradeMethod: tradeMethod,
              traderType: traderType,
            }).count(),
            "sort": "asc",
            "field": "_id"
          },
          data: trade,
          //count: await postatrade.find().count()
        }, )

      })
      //.limit(parseInt(req.query.limit) || '').skip(parseInt(req.query.skip) || 0)
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