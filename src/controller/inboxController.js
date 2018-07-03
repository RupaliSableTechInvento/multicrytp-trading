import inboxModel from './../models/inboxModel';
import tokenModel from './../models/tokenModel';

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




const inboxController = {
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
  sendMessage: async(req, res, next) => {
    console.log("get all web service=>", req.body, req.params, req.query)
      /*    usersModel.find({}, (err, users) => {
           if (err) return res.json({ isError: true, data: err });
           res.json({ isError: false, data: users });
         }); */

  },



};

export default inboxController;


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