const mongoose = require('mongoose');
const Schema = mongoose.schema;

const UserSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    name: String,
    password: String,
    photo: String,
    tweets: [{
        tweet: {type: Schema.types.ObjectId, ref: 'Tweet'}
    }]
});
module.exports = mongoose.model('User', UserSchema);