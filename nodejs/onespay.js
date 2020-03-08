const onesbase = require('./onesbase');

// 3,667.6000 1,977.6436
class OnesPay extends onesbase.OnesBase {
    constructor() {
        super();
    }

    //preuser2app
    prepay(params, callback) {
        let path = "/v1/pay/prepay";

        this.sendPOST(path, params, null, callback);
    }

    app2user(params, callback) {
        let path = "/v1/pay/app2user";

        this.sendPOST(path, params, null, callback);
    }

    // detail
    detail(order_id, callback) {
        let path = "/v1/order/detail";
        let params = {
            "order_id": order_id,
        };

        this.sendPOST(path, params, null, callback);
    }

}

module.exports = {
    OnesPay: OnesPay,
    PAY_STATUS_UNPAIED:0,
    PAY_STATUS_SUCCESS:1,
    PAY_STATUS_FAILED:2,
    PAY_STATUS_CANCEL:-1,
};