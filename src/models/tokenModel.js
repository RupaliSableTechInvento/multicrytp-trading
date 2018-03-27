import mongoose from 'mongoose';
import tokenSchema from './../schema/token';

const tokenModel = mongoose.model('token', tokenSchema);

export default tokenModel;
