import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import autoIncrement from "mongoose-auto-increment";

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  trade_info:{
    type: String,
  }
});
const sellerSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  payment_method: {
    type: String,
  },
  price_btc: {
    type: Number,
  },
  currency: {
    type: String,
  },
  limit_from: {
    type: Number,
  },
  limit_to: {
    type: Number,
  },
});


usersSchema.plugin(uniqueValidator);
usersSchema.plugin(autoIncrement.plugin, 'id');

export default usersSchema;
