'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inboxModel = require('./../models/inboxModel');

var _inboxModel2 = _interopRequireDefault(_inboxModel);

var _tokenModel = require('./../models/tokenModel');

var _tokenModel2 = _interopRequireDefault(_tokenModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var mosca = require('mosca');
/* 
var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://admin:admin@ds111529.mlab.com:11529/heroku_1qmzqz96',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var settings = {
  port: 1883,
  backend: ascoltatore
};

var server = new mosca.Server(settings);

server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', function(packet, client) {
  console.log('Published', packet.payload);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
} */

var inboxController = {
  /*   moscoServer: async() => {
      client = mqtt.createClient(1883, 'localhost');
      //here we start mosca
      var server = new mosca.Server(settings);
      server.on('ready', setup);
      // fired when the mqtt server is ready
      function setup() {
        console.log('Mosca server is up and running')
      }
      // fired whena client is connected
      server.on('clientConnected', function(client) {
        console.log('client connected', client.id);
      });
      // fired when a message is received
      server.on('published', function(packet, client) {
        // console.log('Published : ', packet.payload);
      });
      // fired when a client subscribes to a topic
      server.on('subscribed', function(topic, client) {
        console.log('subscribed : ', topic);
      });
      // fired when a client subscribes to a topic
      server.on('unsubscribed', function(topic, client) {
        console.log('unsubscribed : ', topic);
      });
      // fired when a client is disconnecting
      server.on('clientDisconnecting', function(client) {
        console.log('clientDisconnecting : ', client.id);
      });
      // fired when a client is disconnected
      server.on('clientDisconnected', function(client) {
        console.log('clientDisconnected : ', client.id);
      });
    },
   */
  sendMessage: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log("get all web service=>", req.body, req.params, req.query);
              /*    usersModel.find({}, (err, users) => {
                   if (err) return res.json({ isError: true, data: err });
                   res.json({ isError: false, data: users });
                 }); */

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function sendMessage(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }()

};

exports.default = inboxController;

/* 
var mqtt = require('mqtt')

client = mqtt.createClient(1883, 'localhost');

client.subscribe('presence');

console.log('Client publishing.. ');
client.publish('presence', 'Client 1 is alive.. Test Ping! ' + Date());

client.end();



var mqtt = require('mqtt')

client = mqtt.createClient(1883, 'localhost');

client.subscribe('presence');

client.on('message', function(topic, message) {
  console.log(message);
});

console.log('Client started...'); */
//# sourceMappingURL=inboxController.js.map