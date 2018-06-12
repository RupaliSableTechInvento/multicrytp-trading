import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import autoIncrement from "mongoose-auto-increment";

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  email: {
    type: String,
  },
  isActive: {
    type: String,
  },
  expiry: {
    type: Date,
  },
  userActiveTime: {
    type: Date,
  }

});


tokenSchema.plugin(uniqueValidator);
// tokenSchema.plugin(autoIncrement.plugin, 'id');

export default tokenSchema;