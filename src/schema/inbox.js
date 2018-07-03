import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import autoIncrement from "mongoose-auto-increment";

const inbox = new mongoose.Schema({

  from: {
    type: String,
  },
  to: {
    type: Array,
  },
  sent: {
    type: Date,
  },
  msg: {
    type: String
  }
});


inbox.plugin(uniqueValidator);

export default inbox;