/**
 * @type 数据库model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    open_id: String,
    access_token: String,
    access_expire_time: Number,
    refresh_token: String,
    refresh_expire_time: Number,
    scopes: String,
    create_time: Number,
    login_time: Number,
})

const userinfo = mongoose.model('userinfo', userSchema);

module.exports = userinfo