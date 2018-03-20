import mongoose from 'mongoose';
import postTradeSchema from './../schema/trade';

const tradeModel = mongoose.model('trade', postTradeSchema);

export default tradeModel;
