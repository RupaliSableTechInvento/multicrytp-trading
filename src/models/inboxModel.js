import mongoose from 'mongoose';
import inboxSchema from './../schema/inbox';

const inboxModel = mongoose.model('inbox', inboxSchema);

export default inboxModel;