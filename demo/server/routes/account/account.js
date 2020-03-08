/**
 * 用户子路由
 */
const express = require('express');
const Account = require('../../controller/account/account');
const router = express.Router();

router.post('/login', Account.login.bind(Account))

router.post('/logout', Account.logout.bind(Account))

module.exports = router