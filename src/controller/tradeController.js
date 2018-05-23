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

    var perpage = req.query.pagination.perpage;
    var page = req.query.pagination.page;
    /*   req.query.pagination.page = 0;
      req.query.pagination.pages = 0;
      req.query.pagination.perpage = 0;
      req.query.pagination.total = 0; */
    // console.log("perpage , page ,total , pages", perpage, page, req.query.pagination.total, req.query.pagination.pages);

    var skip = 0;
    if (page > 1) {
      skip = perpage * page;
    }
    var request = req.query.query;
    var cryptoCurrency = req.query.query.cryptoCurrency;
    var location = req.query.query.location;
    var tradeMethod = req.query.query.tradeMethod;
    var traderType = req.query.query.traderType;
    postatrade.find({
      cryptoCurrency: cryptoCurrency,
      location: location,
      tradeMethod: tradeMethod,
      traderType: traderType,
    }, async(err, trade) => {
      if (err) return res.json({ isError: true, data: err });
      res.json({
        isError: false,
        meta: {
          page: req.query.pagination.page,
          pages: (await postatrade.find({
            cryptoCurrency: cryptoCurrency,
            location: location,
            tradeMethod: tradeMethod,
            traderType: traderType,
          }).count() / (10)),
          perpage: 10,
          total: await postatrade.find({
            cryptoCurrency: cryptoCurrency,
            location: location,
            tradeMethod: tradeMethod,
            traderType: traderType,
          }).count(),
          sort: "asc",
          field: "_id",
        },
        data: trade,
      }, )

    }).limit(parseInt(req.query.pagination.perpage) || '').skip(skip || '')
  },
  getOne: (req, res, next) => {
    console.log("req=> for get One tradeController", req.body, req.params, req.query);
    postatrade.findById(req.query.id, (err, trade) => {
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