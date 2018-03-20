import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import autoIncrement from "mongoose-auto-increment";

const tradeMoreInfoSchema = new mongoose.Schema({
  trade_id:{
    type:String,
  },
  user_id:{
    type:String,
  }
});

tradeMoreInfoSchema.plugin(uniqueValidator);


export default tradeMoreInfoSchema;
