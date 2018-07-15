import mongoose from 'mongoose';
import messagesSchema from './../schema/messages';

const messagesModel = mongoose.model('messages', messagesSchema);

export default messagesModel;