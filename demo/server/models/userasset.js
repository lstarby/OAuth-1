/**
 * @type 数据库model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assetSchema = new Schema({
    uid: String,
    open_id: String,
    create_time: Number,
    status: Number,
    balances: Object
})

const userasset = mongoose.model('userasset', assetSchema);

module.exports = userasset