/**
 * 用户子路由
 */
const express = require('express');
const Asset = require('../../controller/asset/asset');
const router = express.Router();

router.post('/prepay', Asset.prepay.bind(Asset))

router.post('/dopay', Asset.dopay.bind(Asset))

// router.post('/withdraw', Asset.withdraw.bind(Asset))

// router.post('/detail', Asset.detail.bind(Asset))

module.exports = router