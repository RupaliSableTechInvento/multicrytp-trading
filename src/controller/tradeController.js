import postatrade from '../models/postatrade'
import tradeMoreInfo from '../models/tradeMoreInfo'
import usersModel from '../models/usersModel'
import async from 'async'
var moment = require('moment');
var mongoose = require('mongoose');
// var request = require('request');

const tradeController = {

  getAll: async(req, res, next) => {
    postatrade.find({}, (err, trade) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: trade
      });
    });
  },
  getPriceEquation: (req, res, next) => {
    // console.log("Req for getPriceEquation=>", req.query);
    // var dataObj = req.query.dataObj;
    // var much = 100;
    // var url = 'http://www.xe.com/currencyconverter/convert/?Amount=' + much + '&From=' + dataObj.from + '&To=' + dataObj.to;

    // console.log("url==>", url);
    // request(url, function(err, resp, body) {
    //   // body = JSON.parse(body);
    //   console.log(" response for getPriceEquation==>", body)
    //     // logic used to compare search results with the input from user
    //   if (!body.query.results.RDF.item) {
    //     craig = "No results found. Try again.";
    //   } else {
    //     craig = body.query.results.RDF.item[0]['about'];
    //     console.log("in else==>craig", craig);
    //   }
    // });
    // $.ajax({
    //   url: 'http://www.xe.com/currencyconverter/convert/?Amount=' + much + '&From=' + dataObj.from + '&To=' + dataObj.to,
    //   // url: 'https://api.cryptonator.com/api/ticker/' + dataObj.from + '-' + dataObj.to,
    //   type: "get",
    //   success: function(successData) {
    //     console.log("sucesss data in price equation in api.js=> ", successData);
    //     // resolve(successData)
    //   },
    //   error: function(err) {
    //     alert(err);
    //   }
    // })

  },

  getQuickByCryptocurrency: async(req, res, next) => {
    console.log("quickBUY/SELL");
    var request = req.query.query;
    var perpage = req.query.pagination.perpage;
    var page = req.query.pagination.page;
    var skip = 0;
    if (page > 1) {
      skip = perpage * (page - 1);
      console.log("perpage page skip=>", perpage, page, skip);
    }
    var amount = req.query.query.amount;
    var cryptoCurrency = req.query.query.cryptoCurrency;
    var location = req.query.query.location;
    var tradeMethod = req.query.query.tradeMethod;
    var traderType = req.query.query.traderType;
    var payment_method = req.query.query.payment_method;
    var currency = req.query.query.currency;
    // 'more_information.currency': currency,
    console.log("trader type   amount=>>", traderType, amount);

    postatrade.find({
      cryptoCurrency: cryptoCurrency,
      location: location,
      tradeMethod: tradeMethod,
      traderType: traderType,
      'more_information.min_trans_limit': {
        $lte: amount
      },
      'more_information.max_trans_limit': {
        $gte: amount
      },
      'more_information.currency': currency,
      payment_method: payment_method
    }, async(err, trade) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        meta: {
          page: req.query.pagination.page,
          pages: (await postatrade.find({
            cryptoCurrency: cryptoCurrency,
            location: location,
            tradeMethod: tradeMethod,
            traderType: traderType,
            'more_information.min_trans_limit': {
              $lt: amount
            },
            'more_information.max_trans_limit': {
              $gt: amount
            },
            'more_information.currency': currency,
            'payment_method': payment_method

          }).count() / (10)),
          perpage: req.query.pagination.perpage,
          total: await postatrade.find({
            cryptoCurrency: cryptoCurrency,
            location: location,
            'more_information.min_trans_limit': {
              $lt: amount
            },
            'more_information.max_trans_limit': {
              $gt: amount
            },
            tradeMethod: tradeMethod,
            traderType: traderType,
            'more_information.currency': currency,

            // payment_method: payment_method

          }).count(),
          sort: "asc",
          field: "_id",
        },
        data: trade,
      }, )

    }).limit(parseInt(req.query.pagination.perpage) || 10).skip(skip || '')
  },

  getByCurrencyLoc: async(req, res, next) => {
    var perpage = req.query.pagination.perpage;
    var query = {};
    var page = req.query.pagination.page;
    var skip = 0;
    if (page > 1) {
      skip = perpage * (page - 1);
      console.log("perpage page skip=>", perpage, page, skip);
    }
    var cryptoCurrency = req.query.query.subQuery.cryptoCurrency;
    var location = req.query.query.subQuery.location;
    var tradeMethod = req.query.query.tradeMethod;
    var traderType = req.query.query.traderType;
    console.log(cryptoCurrency, location, tradeMethod, traderType);
    if (location) {
      query = {
        cryptoCurrency: cryptoCurrency,
        location: location,
        tradeMethod: tradeMethod,
        traderType: traderType,
      }
    } else {
      query = {
        cryptoCurrency: cryptoCurrency,
        tradeMethod: tradeMethod,
        traderType: traderType,
      }
    }

    postatrade.find(

      //   cryptoCurrency: cryptoCurrency,
      //   // location: location,
      //   tradeMethod: tradeMethod,
      //   traderType: traderType,
      // }
      query, async(err, trade) => {
        if (err) return res.json({
          isError: true,
          data: err
        });
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
            perpage: req.query.pagination.perpage,
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

      }).limit(parseInt(req.query.pagination.perpage) || 10).skip(skip || '')
  },



  getTrade: async(req, res, next) => {
    var request = req.query.query;
    var perpage = req.query.pagination.perpage;
    var page = req.query.pagination.page;
    var skip = 0;
    if (page > 1) {
      skip = perpage * (page - 1);
      console.log("perpage page skip=>", perpage, page, skip);

    }
    var user = req.query.query.user;
    // var cryptoCurrency = req.query.query.cryptoCurrency;
    // var location = req.query.query.location;
    // var tradeMethod = req.query.query.tradeMethod;
    // var traderType = req.query.query.traderType;

    postatrade.find({
      user: user

    }, async(err, trade) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        meta: {
          page: req.query.pagination.page,
          pages: (await postatrade.find({
            user: user

          }).count() / (10)),
          perpage: req.query.pagination.perpage,
          total: await postatrade.find({
            user: user

          }).count(),
          sort: "asc",
          field: "_id",
        },
        data: trade,
      }, )

    }).limit(parseInt(req.query.pagination.perpage) || 10).skip(skip || '')
  },


  getOne: (req, res, next) => {
    console.log("req=> for get One tradeController", req.body, req.params, req.query);
    postatrade.findById(req.query.id, (err, trade) => {
      if (err) {
        res.json({
          isError: true,
          data: err
        });
      }
      res.json({
        isError: false,
        data: trade
      });
    });
  },

  create: async(req, res, next) => {

    var params = req.body;

    var userObj = await usersModel.find({
      '_id': req.body.user
    }, {
      _id: 0,
      first_name: 1
    });

    /*  params.firstName = await usersModel.findOne({ '_id': req.body.user }, { _id: 0, first_name: 1 }, (err, user) => {
       if (err) {
         res.json({ isError: true, data: err });
       } else { res.json({ isError: false, data: user }); }
     }); */
    params.firstName = userObj[0].first_name;
    console.log("params in posrt trade=>>", params);

    postatrade.create(params, function(err, trade) {
      if (err) return res.json({
        isError: true,
        data: err
      });
      else {
        tradeMoreInfo.create({
          'trade_id': trade._id,
          'user_id': trade.user
        }, function(err, tradeInfo) {
          if (err) return res.json({
            isError: true,
            data: err
          });
          else {
            usersModel.findOneAndUpdate({
              '_id': tradeInfo.user_id
            }, {
              "trade_info": tradeInfo._id
            }, function(err, UpdateUser) {
              if (err) return res.json({
                isError: true,
                data: err
              });
              res.json({
                isError: false,
                data: UpdateUser
              })
            })
          }
        })
      }
    })
  },

  update: (req, res, next) => {
    postatrade.findOneAndUpdate(req.params.id, req.body, {
      new: true
    }, (err, trade) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: trade
      })
    });
  },

  delete: (req, res, next) => {
    postatrade.remove({
      _id: req.params.id
    }, (err, ok) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
    });
    res.json({
      isError: false,
      data: true
    })
  },

  update: (req, res, next) => {
    var id = mongoose.Types.ObjectId(req.body.id);
    postatrade.findOneAndUpdate({
      '_id': id
    }, req.body, {
      new: true
    }, (err, user) => {
      if (err) return res.json({
        isError: true,
        data: err
      });
      res.json({
        isError: false,
        data: user
      })
    });
  },
};

export default tradeController;