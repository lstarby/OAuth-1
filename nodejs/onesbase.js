const http = require('https');
const moment = require('moment');
const crypto = require('crypto');

const onesConfig = require('../config/ones')

var GMT_FORMAT = "ddd, DD MMM YYYY HH:mm:ss";

class OnesBase {
    constructor() {
        this.accessKey = onesConfig.accessKey;
        this.secretKey = onesConfig.secretKey;
        this.host = onesConfig.oauthHost;
        this.port = onesConfig.oauthPort;

        this.appId = onesConfig.appId;

        console.log(this.accessKey)
    }

    //
    getURL(path) {
        return this.host + path;
    }

    //
    sendGET(path, params, headers, callback) {
        let url = this.getURL(path);
        if (params !== null) {
            let ps = new url.URLSearchParams(params);
            url += "?" + ps.toString();
        }

        if (headers == null)
            headers = this.defaultHeaders('GET', path, null);

        let options = {
            hostname: this.host,
            port: this.port,
            path: path,
            method: 'GET',
            headers: headers
        };
        let req = http.request(options, callback);
        req.end();
    }

    //
    sendPOST(path, data, headers, cb) {
        var timenum = 5000;
        let jsData = JSON.stringify(data);
        if (headers == null)
            headers = this.defaultHeaders('POST', path, jsData);

        let req = http.request({
            hostname: this.host,
            port: this.port,
            path: path,
            method: "POST",
            headers: headers
        }, function (res) {
            let chunks = '';
            res.on('data', (chunk) => {
                chunks += chunk;
            });
            res.on('end', () => {
                if (!cb) {
                    return;
                }
                let response = new HTTPResponse(chunks);
                cb(response.getCode(), response.getMsg(), response.getData())
            });
        });
        var that = this
        req.setTimeout(timenum, function () {
            var e = new Error('http request timeout url:' + that.host + path);
            e.code = 'ESOCKETTIMEDOUT';
            e.connect = false;
            ////结束当前请求 https://nodejs.org/api/http.html#http_request_abort
            // this.abort();
            this.emit('error', e);
        }.bind(req));

        req.on("error", function (err) {
            if (!cb) {
                return;
            }
            cb(-1, err.message, err)
        })

        req.write(jsData);
        req.end();
    }

    //
    defaultHeaders(method, path, data) {
        let headers = {
            'App-Id': this.appId,
            'Date': moment().utc().format(GMT_FORMAT) + " GMT",
            'Content-Type': 'application/json',
            'user-agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"
        };

        if (data != null)
            headers['Content-sha1'] = this.sha1(data);

        headers['Auth'] = this.auth(method, path, headers);
        return headers;
    }

    //
    sha1(data) {
        let sha1 = crypto.createHash('sha1');
        sha1.update(data);
        return sha1.digest('hex');
    }

    //
    auth(method, path, headers) {
        let newHeaders = new Map();
        for (let k in headers) {
            let v = headers[k];
            newHeaders.set(k.toLowerCase(), v);
        }

        let contentMd5 = newHeaders.get('content-sha1') || "";
        let contentType = newHeaders.get('content-type') || "";
        let date = newHeaders.get('date') || "";

        let dragonHeaders = [];
        for (let [k, v] of newHeaders.entries()) {
            if (k.indexOf("dragonex-") > -1)
                dragonHeaders.push(k + ":" + v);
        }

        dragonHeaders.sort();
        let canonicalizedDragonExHeaders = "";
        if (dragonHeaders.length !== 0)
            canonicalizedDragonExHeaders = dragonHeaders.join("\n");

        let stss = [
            method.toUpperCase(),
            contentMd5,
            contentType,
            date,
            canonicalizedDragonExHeaders
        ];

        let sToSign = this.sign(stss.join("\n") + path, this.secretKey);
        return this.accessKey + ":" + sToSign;
    }

    sign(stss, secretKey) {
        return crypto.createHmac('sha1', secretKey).update(stss).digest().toString('base64');
    }

    //
    getToken() {
        return this.token || "";
    }

    // 
    setToken(val) {
        this.token = val;
    }
}


//
class HTTPResponse {
    constructor(body) {
        try {
            let d = JSON.parse(body)
            this.msg = d['msg'];
            this.data = d['data'];
            this.setCode(parseInt(d['code']));
        } catch (err) {
            console.log("body\t", body, err)

            this.msg = "dragonex response error"
            this.setCode(-1)
        }
    }

    getCode() {
        return this.code;
    }

    setCode(v) {
        this.code = v;
    }

    getMsg() {
        return this.msg;
    }

    setMsg(m) {
        this.msg = m;
    }

    getData() {
        return this.data;
    }

    setData(v) {
        this.data = v;
    }
}

module.exports = {
    OnesBase: OnesBase,
    HTTPResponse: HTTPResponse
};