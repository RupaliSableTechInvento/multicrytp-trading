var bcypher = require('blockcypher');
import usersModel from '../models/usersModel'

import jwt from 'jsonwebtoken';
import env from "../env";
import async from 'async'

console.log('Welcome to BlockCypher');
const URL_ROOT = 'https://api.blockcypher.com/v1/';
const TOKEN = 'e42bb9107d4d49e6b74d4153bddcde3c';
var bcapibtc = new bcypher('btc', 'test3', TOKEN);
var bcapiltc = new bcypher('ltc', 'main', TOKEN);
var bcapidoge = new bcypher('doge', 'main', TOKEN);
var bitcoin = require("bitcoinjs-lib");
var bigi = require("bigi");
var buffer = require('buffer');
var CAValidator = require('crypto-address-validator');
var coin = { BTC: bcapibtc, LTC: bcapiltc, DOGE: bcapidoge };

const walletController = {

  createWalletWithAddress: (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    console.log("createWalletWithAddress ==>", decoded._id, req.body.dataObj);

    var CoinCode = req.body.dataObj.coin;
    var name = decoded._id;
    var item = coin[req.body.dataObj.coin];
    var data = { name: name.toString(), addresses: [] }
    console.log("Coin==>item coinCode", item, CoinCode);
    item.createWallet(data, function(err, wallets) {
      if (err) {
        return
        res.json({
          isError: true,
          data: err
        });

      } else {
        if (!wallets.error) {


          item.genAddrWallet(wallets.name, function(err, walletsData) {
            if (err) {
              res.json({
                isError: true,
                data: err
              });
            } else {
              var tempObj = {};
              tempObj[CoinCode] = walletsData;
              walletsData.isAddressCreated = true;
              var $setObj = {};
              var updateQuery = 'wallets.' + CoinCode;
              $setObj[updateQuery] = walletsData;
              console.log("$setObj=>", $setObj);

              //  wallets[CoinCode];
              console.log("tempObj=>", tempObj, updateQuery, walletsData);

              usersModel.findOneAndUpdate({
                email: decoded.email
              }, {
                $set: $setObj
              }, {
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
            }
          })
        } else {
          res.json({
            isError: true,
            data: wallets.error
          });

        }
      }
    });
  },
  getCoin_WalletData: (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    console.log("getCoin_WalletData ==>", decoded._id);
    usersModel.find({
      'email': decoded.email
    }, (err, users) => {
      if (err) return res.json({
        isError: true,
        data: err
      });

      if (users) {
        res.json({
          isError: false,
          data: users,
        });
      } else {
        res.redirect('/#/login');
      }

    });
  },
  getAddrFull: (req, res) => {
    // var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    console.log("getAddrFull ==>", req.query);
    // var perpage = req.query.pagination.perpage;
    // var page = req.query.pagination.page;
    var CoinCode = req.query.dataObj.coin;
    var address = req.query.dataObj.address;
    var item = coin[CoinCode];
    console.log("Coin==>getAddr item coinCode", item, CoinCode);

    item.getAddrFull(address, {}, function(err, body) {
      console.log("getAddr==> result", body);

      // res.json({
      //   isError: false,
      //   meta: {
      //     page: req.query.pagination.page,

      //     perpage: req.query.pagination.perpage,
      //     total: body.n_tx,

      //   },
      //   data: { body: body.txs },
      // }, )

      res.json(body);
    })

  },
  getAddrBal: (req, res) => {

    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    console.log("getAddrBal ==>", decoded._id, req.body.dataObj);

    var CoinCode = req.body.dataObj.coin;
    var address = req.body.dataObj.address;
    var item = coin[req.body.dataObj.coin];
    // var data = { name: name.toString(), addresses: [] }
    console.log("Coin==>getAddrBal item coinCode", item, CoinCode);
    item.getAddrFull(address, {}, function(err, body) {
      console.log("getAddrFull==>0", body);

      res.json(body);
    })

  },
  newTransaction: (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], env.App_key);
    console.log("newTransaction ==>", decoded._id, req.body.dataObj);

    var CoinCode = req.body.dataObj.coin;
    var address = req.body.dataObj.address;
    var item = coin[req.body.dataObj.coin];
    var amount = req.body.dataObj.amount;
    var receiverAddress = req.body.dataObj.receiverAddress;
    console.log();

    usersModel.find({
      'email': decoded.email
    }, (err, users) => {
      if (err) {
        return res.json({
          isError: true,
          data: err
        });
      } else {
        if (users) {
          var wallets = {}
          var privateKey = '';
          var senderAddress = '';

          var dataRes = users[0].wallets;
          console.log("newTransaction user data==>", users, dataRes);

          for (var key in dataRes) {
            if (key.toString() == CoinCode.toString()) {

              var wallet_namesData = dataRes[key]
              console.log("newTransaction key matched.==>", wallet_namesData.private);
              privateKey = wallet_namesData.private
              senderAddress = wallet_namesData.address
            }

          }
          if (privateKey) {

            amount = parseInt(amount);
            var tx = {
              inputs: [{ addresses: [senderAddress] }],
              outputs: [{ addresses: [receiverAddress], value: amount }]
            };



            item.newTX(tx, function(err, newTXres) {

              if (err) {
                console.log("newTX error==>", err);

              } else {
                newTXres.pubkeys = [];
                //private key for that address
                var keys = new bitcoin.ECPair(bigi.fromHex(privateKey));
                newTXres.signatures = newTXres.tosign.map(function(tosign, n) {
                  newTXres.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
                  return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
                });
                item.sendTX(newTXres, function(err, result) {
                    if (err) {
                      // console.log("sendTX error==>", err);

                      res.json({
                        isError: true,
                        data: result,
                      });

                    } else {
                      // console.log("sendTX==>", result);
                      res.json({
                        isError: false,
                        data: result,
                      });



                    }
                  })
                  // getAddrBal(toaddress);

              }


            })

          }





        }
      }

    });


    // var data = { name: name.toString(), addresses: [] }
    // console.log("Coin==>getAddrBal item coinCode", item, CoinCode);
    // item.getAddrFull(address, {}, function(err, body) {
    //   console.log("getAddrFull==>0", body);

    //   res.json(body);
    // })
  },
  getTX: (req, res) => {
    var hash = req.body.dataObj.hash;
    var CoinCode = req.body.dataObj.coin;
    var item = coin[req.body.dataObj.coin];
    // item.getTXConf(hash, function(err, body) {
    //   console.log("getTXConf==>0", body);

    //   res.json(body);
    // })
    item.getChain(function(err, body) {
        console.log("getChain==>", err, body);
        res.json(body);
      })
      // item.getTX(hash, {}, function(err, body) {
      //     // console.log("getTX==>", body);
      //     res.json(body);
      //   })
      // getTX = function(hash,{}, cb) {
      //   this._get('/txs/' + hash, {}, function(error, body) {
      //     cb(error, body);
      //   });
      // };
  },

  listWallets: (req, res) => {
    item.listWallets(function(err, wallets) {
      if (err) {
        // console.log("error in item");

      } else {
        console.log('listWallets==>', wallets);
        wallets.wallet_names.forEach(element => {


        });

      }
    })
  },
  delWallet: (req, res) => {
    //req wallet name as parameter
    item.delWallet(element, function(err, res) {
      if (err) {
        console.log("error in delWallet==>", err);

      }
      console.log("res==>", res);

    })
  },
  validateAddress: (req, res) => {
    console.log(" validateAddress req==>", req.query, req.body);

    var CoinCode = req.query.coin;
    var address = req.query.receiverAddress;
    var network = '';
    network = coin[CoinCode];
    var networkType = network.chain;
    console.log('CoinCode address', address, CoinCode);


    var valid = CAValidator.validate(address, CoinCode, networkType);
    if (valid) {
      console.log('This is a valid address');
      res.json({
        isError: false,
        valid: valid
      })
    } else {
      console.log('Address INVALID');

      res.json({ isError: true, valid: valid })
    }

  }
}
export default walletController;