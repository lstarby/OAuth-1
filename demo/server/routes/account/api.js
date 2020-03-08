/**
 * 主路由
 */
const Account = require('./account')

module.exports = app => {
   
    app.use('/account', Account)
}