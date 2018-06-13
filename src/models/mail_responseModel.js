import mongoose from 'mongoose';
import mail_responseSchema from './../schema/mail_response';

const mail_responseModel = mongoose.model('mail_response', mail_responseSchema);

export default mail_responseModel;