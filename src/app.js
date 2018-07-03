import express from 'express';
import 'babel-polyfill';
import './database/db';
import env from './env';
import routes from './routes';
import bodyParser from 'body-parser';
import authenticated from './middlewares/authenticated';
import async from 'async';
var BlockIo = require('block_io');
var version = 2; // API version
var block_io = new BlockIo('e1e0-ea6a-d686-dd2e', 'Abhi1Abhi1Abhi1', version);
// block_io.get_new_address({'label1': 'shibe1'}, console.log);
// let param1=null,param2=null;
// block_io.get_my_addresses({},function (data,a) {
// var addr = a;
// console.log(addr);
// for (var i = 0; i < addr.data.addresses.length; i++) {
//    console.log(addr.data.addresses[i]);
// }
// });
// block_io.get_current_price({}, console.log);
// block_io.get_my_archived_addresses({}, console.log);
// block_io.archive_address({'addresses': '2NFqxPiKTA13iZpyt3jt5ftPz5VbFuVu5eU'},console.log);
block_io.get_my_archived_addresses({}, function(err, data) {

});
// block_io.get_network_fee_estimate({'amounts': '0', 'to_addresses': '2NFqxPiKTA13iZpyt3jt5ftPz5VbFuVu5eU'},console.log);
// block_io.get_my_addresses({}, console.log);
// block_io.create_forwarding_address({'to_address': '39mQmjBtG9yPbQfDqF1hjr15bjYjANAZCT'},console.log);
// console.log("addr",addr);
// setTimeout(function () {
//   console.log("addr",param1,param2);
// }, 5000);


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('client'))

app.use('/users', authenticated);
app.use('/users/*', authenticated);
routes(app);

app.listen(env.Api_port, () => {
  console.log(`Api listening on port ${env.Api_port}!`);
});


var mosca = require('mosca');
var mqtt = require('mqtt');

var http = require('http')
var httpServ = http.createServer()
var ascoltatore = {
  //using ascoltatore
  type: 'mongo',
  url: 'mongodb://admin:admin@ds111529.mlab.com:11529/heroku_1qmzqz96',
  pubsubCollection: 'ascoltatore',
  mongo: {}
};

var server = new mosca.Server({
  http: {
    port: 1884,
    bundle: true,
    static: './',
    backend: ascoltatore

  }
});
server.attachHttpServer(httpServ);

/* 
var message = {
  topic: 'hiii',
  payload: 'abcde', // or a Buffer
  qos: 0, // 0, 1, or 2
  retain: false // or true
};
 */



var client = mqtt.connect('mqtt://test.mosquitto.org')
  // client = mqtt.createClient(1884, 'localhost');
client = mqtt.connect('mqtt://user:pass@localhost?clientId=123abc');

server.on('ready', setup);

function setup() {

  console.log('Mosca server is up and running 1')
}

// client.subscribe('presence');
/* 
console.log('Client publishing.. ');
client.publish('presence', 'Client 1 is alive.. Test Ping! ' + Date());

client.end(); */

server.published = function(packet, client, cb) {
  if (packet.topic.indexOf('echo') === 0) {
    return cb();
  }

  var newPacket = {
    topic: 'echo/' + packet.topic,
    payload: packet.payload,
    retain: packet.retain,
    qos: packet.qos
  };

  console.log('newPacket published', newPacket);

  // server.publish(newPacket, cb);
}

// fired whena client is connected
server.on('clientConnected', function(client) {
  console.log('client connected', client.id);
});
// fired when a message is received
server.on('published', function(packet, client) {
  console.log(' on Published  packet payload: ', packet.payload);
});
// fired when a client subscribes to a topic
server.on('subscribed', function(topic, client) {
  console.log(' on subscribed : ', topic);
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