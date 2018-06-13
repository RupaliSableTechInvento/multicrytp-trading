import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import autoIncrement from "mongoose-auto-increment";

const mailResponse = new mongoose.Schema({

  email: {
    type: String,
  },
  error: {
    type: String,
  },
  info: {
    type: String,
  }
});


mailResponse.plugin(uniqueValidator);

export default mailResponse;