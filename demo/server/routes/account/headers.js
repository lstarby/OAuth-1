/**
 * header请求参数验证
 */


const account = require("../../controller/account/account")

//token验证
function checkToken(req, res, next) {
    // 取token 数据
    let access_token = req.headers['access-token'];
    let uid = req.headers['uid'];

    // check token 
    if (access_token && uid) {

        account.verify(access_token, uid, (err, userobj) => {
            if (err != 0) {
                res.json({
                    code: 1,
                    msg: "error_token",
                    data: ''
                });
            } else {

                req.user = userobj
                req.user.uid = uid

                console.log(userobj)
                next();
            }
        })
    } else {
        res.json({
            code: 1,
            msg: "error_param",
            data: {}
        });
    }
}


exports.checkToken = checkToken;