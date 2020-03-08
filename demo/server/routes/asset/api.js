/**
 * 主路由
 */
const Asset = require('./asset')
const headers = require('../account/headers')

module.exports = app => {

    app.use('/asset', headers.checkToken)

    app.use('/asset', Asset)
}