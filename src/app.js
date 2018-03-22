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
// block_io.get_my_archived_addresses({}, console.log);
// block_io.get_network_fee_estimate({'amounts': '0', 'to_addresses': '2NFqxPiKTA13iZpyt3jt5ftPz5VbFuVu5eU'},console.log);
// block_io.get_my_addresses({}, console.log);
// block_io.create_forwarding_address({'to_address': '39mQmjBtG9yPbQfDqF1hjr15bjYjANAZCT'},console.log);
// console.log("addr",addr);
// setTimeout(function () {
//   console.log("addr",param1,param2);
// }, 5000);


const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('client'))
app.use('/users', authenticated);
app.use('/users/*', authenticated);
routes(app);

app.listen(env.Api_port, () => {
    console.log(`Api listening on port ${env.Api_port}!`);
});
