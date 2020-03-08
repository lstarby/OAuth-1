/**
 * 用户controller（例如登录、注册等操作逻辑在此实现）
 */
const UserModel = require('../../models/userinfo')
const UserAssetModel = require('../../models/userasset')
const env = require('../../config/env')
const onesConfig = require('../../config/ones')

const onesAccount = require('../../onesoauth/onesaccount');

class Account {

    async login(req, res, next) {

        console.log("login")
        var self = this

        var params = req.body

        var access_code = params.access_code;
        var expire_time = params.expire_time;
        var scopes = params.scopes;
        var device = params.device;
        var state = params.state;
        var domain = params.domain ? params.domain : "";

        //request dragon api login

        let client = new onesAccount.OnesAccount();

        var app_id = onesConfig.appId

        console.log(access_code, app_id, scopes, state, device)
        client.login(access_code, app_id, scopes, state, device, function (code, msg, data) {
            console.log("ones login ####", code, msg, data)
            if (code == 0) {
                self.dologin(res, data, domain)
            } else {
                console.log("login err", code, msg)
                return res.json({
                    code: code,
                    msg: msg
                })
            }
        });
    }

    async dologin(res, data, domain) {

        var open_id = data.open_id;
        UserModel.findOne({
            open_id: open_id
        }, function (err, userdata) {

            var login_time = parseInt(Date.now() / 1000)

            if (userdata != null) {
                console.log("login update ing")

                var wherestr = {
                    'open_id': open_id
                };
                var updatestr = {
                    access_token: data.access_token,
                    access_expire_time: data.access_expire_time,
                    // refresh_token: data.refresh_token,
                    // refresh_expire_time: data.refresh_expire_time,
                    login_time: login_time,
                };

                UserModel.findOneAndUpdate(wherestr, {
                    $set: updatestr
                }, function (err, doc) {
                    if (err ) {
                        console.log("login err UserModel update:", err);
                    }

                    var uid = doc._id
                    console.log("login", uid, data.open_id)
                    return res.json({
                        code: 0,
                        msg: "",
                        data: {
                            uid: uid,
                            access_token: data.access_token,
                            access_expire_time: data.access_expire_time,
                            // refresh_token: data.refresh_token,
                            // refresh_expire_time: data.refresh_token_et,
                            open_id: data.open_id,
                            device: data.device,
                            login_time: login_time,
                        }
                    })
                })

            } else {
                // save 
                var user = new UserModel({
                    open_id: data.open_id,
                    device: data.device,
                    access_token: data.access_token,
                    access_expire_time: data.access_expire_time,
                    // refresh_token: data.refresh_token,
                    // refresh_expire_time: data.refresh_token_et,
                    scopes: data.scopes,
                    create_time: parseInt(Date.now() / 1000),
                    login_time: login_time
                });

                user.save(function (err, doc) {

                    if (err) {
                        console.log('login err UserModel save', err)
                        return res.json({
                            code: -1,
                            msg: ""
                        })
                    }

                    // console.log(doc)

                    var uid = doc._id;
                    var asset = new UserAssetModel({
                        _id: uid,
                        uid: uid,
                        open_id: data.open_id,
                        create_time: parseInt(Date.now() / 1000),
                        status: 0,
                        balances: {},
                    })

                    asset.save(function (err, doc) {
                        if (err) {
                            console.log("login err UserAssetModel save", err)
                            return res.json({
                                code: -1,
                                msg: ""
                            })
                        }

                        return res.json({
                            code: 0,
                            msg: "",
                            data: {
                                uid: uid,
                                access_token: data.access_token,
                                access_expire_time: data.access_expire_time,
                                open_id: data.open_id,
                                login_time: login_time,
                            }
                        })

                    })
                });
            }
        })
    }

    async check(req, res, next) {
        var uid = req.uid;
        var access_token = req.access_token;
        console.log("check", "uid:", uid, "access_token:", access_token)

        if (uid == "" || access_token == "") {
            return res.json({
                code: 1,
                msg: "error_params",
            });
        }

        UserModel.findOne({
            _id: uid
        }, function (err, doc) {
            if (doc == null) {
                return res.json({
                    code: 1,
                    msg: "error_params",
                });
            }
            if (doc.access_token != access_token) {
                return res.json({
                    code: 1,
                    msg: "error_params",
                });
            }

            var source = doc.source
            let client = new onesAccount.OnesAccount();

            client.detail(doc.open_id, function (code, msg, data) {
                console.log("check", code, msg, data)

                if (code == 1) {
                    return res.json({
                        code: 0,
                        msg: "",
                        data: {
                            uid: doc._id,
                            open_id: doc.open_id,
                        }
                    })
                } else {
                    return res.json({
                        code: code,
                        msg: msg
                    })
                }
            });

        });
    }

    async logout(req, res, next) {
        var uid = req.uid;
        var access_token = req.access_token;

        UserModel.findOneAndUpdate({
            _id: uid
        }, {
            $set: {
                access_token: "",
            }
        }, function (err, doc) {

            if (doc != null && doc.type == 0) {
                return res.json({
                    code: 0,
                    msg: "",
                    data: {}
                })
            } else {

                // var access_token = "";
                let client = new onesAccount.OnesAccount();

                client.logout(access_token, function (code, msg, data) {
                    if (code == 0) {
                        return res.json({
                            code: 0,
                            msg: "",
                            data: {}
                        })
                    } else {

                        return res.json({
                            code: 0,
                            msg: "",
                            data: {}
                        })
                    }
                });
            }

        })
    }

    verify(access_token, uid, callback) {
        UserModel.findOne({
            _id: uid
        }, function (err, doc) {
            if (err == null && doc != null) {

                if (doc.access_token == access_token) { //todo check expire_time
                    callback(0, doc)

                } else {
                    callback(-1, {})
                }

            } else {
                callback(-1, {})
            }
        })
    }
}

module.exports = new Account()