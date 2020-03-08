/**
 * asset controller
 */
const UserAssetModel = require('../../models/userasset')
const AssetOrderModal = require('../../models/assetorder')

const onesConfig = require('../../config/ones')
const onesPay = require('../../onesoauth/onespay');


function randomString(len) {
    len = len || 32;
    var $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

class Asset {

    // balance
    async balance(req, res, next) {
        var params = req.body;

        var user = req.user;
        // console.log(user)
        var uid = user._id

        UserAssetModel.findOne({
            uid: uid
        }, function (err, doc) {

            if (err) {
                return res.json({
                    code: 1,
                    msg: "system db error"
                })
            }

            if (doc == null) {
                return res.json({
                    code: 0,
                    msg: "",
                    data: {
                        balances: {}
                    }
                })
            }

            return res.json({
                code: 0,
                msg: "",
                data: {
                    balances: doc.balances
                }
            })
        })
    }

    // deposit 
    async prepay(req, res, next) {
        var headers = req.headers

        var params = req.body;

        var amount = params.amount;
        amount = parseFloat(parseInt(100 * amount) / 100)

        var coin_code = params.coin_code;
        var device = params.device;
        var domain = params.domain;

        var user = req.user;
        var self = this

        // save order id
        var order = new AssetOrderModal({
            open_id: user.open_id,
            uid: user._id,
            amount: amount,
            coin_code: coin_code,
            status: 0,
            create_time: parseInt(Date.now() / 1000),
            type: "pay"
        });

        order.save(function (err, doc) {

            if (err != null) {
                console.log("Error:" + err);

                return res.json({
                    code: 1,
                    msg: '',
                    data: params,
                })
            } else {
                console.log("doc:" + doc);

                var trade_no = doc._id.toString()
                var order = {
                    open_id: user.open_id,
                    trade_no: trade_no,
                    coin_code: coin_code,
                    amount: amount + "",
                    scene: "onesplay pay",
                    desc: "onesplay pay",
                    device: device,
                    state: randomString(16),
                    redirect_url: onesConfig.payCallbackUrl + "pay",
                    domain: domain
                }
                self._prepay(req, res, next, order)
            }
        })
    }

    async dopay(req, res, next) {

        // active  update seed
        var params = req.body; //todo check param 
        var order_id = params.order_id

        var self = this
        AssetOrderModal.findOne({
            order_id: order_id
        }, function (err, orderrow) {

            if (err) {
                return res.json({
                    code: 1,
                    msg: "db error",
                    data: {}
                })
            }

            if (orderrow == null) {
                return res.json({
                    code: 0,
                    msg: "",
                    data: {
                        status: -1 //no order
                    }
                })
            }

            if (orderrow.uid != req.user.uid) {
                return res.json({
                    code: 0,
                    msg: "",
                    data: {
                        status: -1 //no order
                    }
                })
            }

            console.log("status", orderrow.status)
            if (orderrow.status == onesPay.PAY_STATUS_UNPAIED) {
                self._dopay(order_id, res)
                return
            } else if (orderrow.status == onesPay.PAY_STATUS_SUCCESS) {
                return res.json({
                    code: 0,
                    msg: "",
                    data: {
                        coin_code: orderrow.coin_code,
                        status: 0, // pay done
                    }
                })

            } else {
                return res.json({
                    code: 0,
                    msg: "",
                    data: {
                        coin_code: orderrow.coin_code,
                        status: 1
                    }
                })
            }

        })
    }

    async _dopay(order_id, res) {

        console.log("get ordering.......")
        let client = new onesPay.OnesPay();

        client.detail(order_id, function (code, msg, resData) {

            console.log("getorder", code, msg, resData)
            if (code != 0) {
                return res.json({
                    code: 1,
                    msg: code + msg
                })
            }
            var status = resData.status;

            if (!(status == onesPay.PAY_STATUS_SUCCESS ||
                    status == onesPay.PAY_STATUS_FAILED ||
                    status == onesPay.PAY_STATUS_CANCEL)) {
                return res.json({
                    code: 1,
                    msg: "status is error",
                    data: {}
                })
            }

            AssetOrderModal.findOneAndUpdate({
                order_id: order_id,
                status: onesPay.PAY_STATUS_UNPAIED
            }, {
                $set: {
                    status: status,
                    pay_time: resData.pay_time,
                    create_time: parseInt(Date.now() / 1000)
                }
            }, function (err, doc) {
                // console.log(doc)
                if (err != null || doc == null) {
                    console.log(err)
                    return res.json({
                        code: 1, //system error
                        msg: "",
                        data: {}
                    })
                }

                if (status != onesPay.PAY_STATUS_SUCCESS) {
                    return res.json({
                        code: 0,
                        msg: "",
                        data: {
                            status: 1
                        }
                    })
                }
                var uid = doc.uid
                var coin_code = doc.coin_code
                var amount = doc.amount;
                amount = parseInt(parseFloat(amount) * 10000)

                var balance_key = "balances.coin_" + coin_code

                var incObj = {}
                incObj[balance_key] = amount;

                console.log(uid, incObj)
                UserAssetModel.findOneAndUpdate({
                    uid: uid,
                }, {
                    $inc: incObj
                }, function (err, assetdoc) {

                    if (err != null || assetdoc == null) {
                        console.log(err)
                        return res.json({
                            code: 1, //system error
                            msg: "",
                            data: {}
                        })
                    }


                    return res.json({
                        code: 0,
                        msg: "",
                        data: {
                            coin_code: coin_code,
                            status: 0
                        }
                    })
                })
            })
        });

    }

    // order detail 
    async detail(req, res, next) {
        var params = req.body;
        var trade_no = params.trade_no
        var arr = trade_no.split("_");
        if (arr.length != 2 || arr[0] != "pay") {
            return res.json({
                code: 1,
                msg: "params error",
                data: {}
            })
        }

        var _id = arr[1];

        AssetOrderModal.findOne({
            _id: _id
        }, function (err, doc) {
            if (err) {
                return res.json({
                    code: 1,
                    msg: "db error",
                    data: {}
                })
            }

            // console.log(err, orderrow)
            if (doc == null) {
                return res.json({
                    code: 0,
                    msg: "",
                    data: {
                        status: -1 //no order
                    }
                })
            }
            return res.json({
                code: 0,
                msg: "",
                data: {
                    status: doc.status
                }
            })

        });
    }

    async _prepay(req, res, next, order) {

        let client = new onesPay.OnesPay();

        client.prepay(order, function (code, msg, data) {

            console.log(".............", order, data)
            if (code == 0) {
                AssetOrderModal.findOneAndUpdate({
                    _id: order.trade_no
                }, {
                    $set: {
                        order_id: data.order_id
                    }
                }, function (err, doc) {
                    console.log(err,doc)
                    return res.json({
                        code: 0,
                        msg: "",
                        data: data
                    })
                })

            } else {
                return res.json({
                    code: code,
                    msg: msg,
                })
            }
        });
    }
};

module.exports = new Asset()