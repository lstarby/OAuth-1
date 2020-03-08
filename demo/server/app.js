const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const accountRouter = require('./routes/account/api')
const assetRouter = require('./routes/asset/api')

// const errorRouter = require('./routes/web/error')
const db = require('./config/db')

const app = express();

//数据库连接
db.connect()

app.use(bodyParser.raw());

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");

    if (req.method == "OPTIONS") {
        var headers = {};

        // IE8 does not allow domains to be specified, just the *
        headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "*";
        res.writeHead(200, headers);
        res.end();
        return
    }
    next()
});

accountRouter(app)
assetRouter(app)

const server = require('http').createServer(app);

server.listen(8080);

console.log('服务已开启... 127.0.0.1:8080');