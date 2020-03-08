/**
 * @type 数据库model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    uid: String,
    open_id: String,
    order_id: String,

    amount: String,
    ones_amount: String,
    coin_code: String,

    pay_time: Number,
    status: Number, //  0待支付 1已确认支付
    create_time: Number,
    type: String,
})

//建立索引提高查询效率
orderSchema.index({
    uid: 1,
    create_time: 1
});
// runSchema.createIndexes({user_id: 1,play_id:1})

const ordermodel = mongoose.model('assetorder', orderSchema);

module.exports = ordermodel