import mongoose from 'mongoose';
import tradeMoreInfoSchema from './../schema/tradeMoreInfo';

const tradeMoreInfo = mongoose.model('trade_more_info', tradeMoreInfoSchema);

export default tradeMoreInfo;
