var OnesApp = {
    access_token: null,
    serverUrl: "http://127.0.0.1:8080",
    params: {},

    app_id: "qunheigame",
    loginCallbackUrl: "http://127.0.0.1:5501/demo/webapp/?action=login",
    onesLoginUrl: "https://test.ones.game/oauth/login?",

    constructor: function () {

    },
    load: function () {

        var account = localStorage.getItem("onesapp_account")
        account = JSON.parse(account)
        if (account && account.access_token) {
            this.access_token = account.access_token
            this.open_id = account.open_id
            this.uid = account.uid
        }

        this.params = this.parseURL(location.href)
    },



    isLogin: function () {
        return this.access_token == "" || this.access_token == null || this.access_token == undefined ? false : true
    },

    getAccessToken: function () {
        return this.access_token
    },

    setAccessToken: function (access_token, uid, open_id) {
        var account = {
            access_token: access_token,
            open_id: open_id,
            uid: uid,
        }
        localStorage.setItem("onesapp_account", JSON.stringify(account))
        this.access_token = access_token
        this.open_id = open_id
        this.uid = uid
    },

    removeAccessToken: function () {
        localStorage.removeItem("onesapp_account")
    },

    getServerUrl: function () {
        return this.serverUrl
    },

    redirect: function (url) {
        window.location.href = url
    },

    getParams: function () {
        return this.params
    },
    showAlert: function (msg) {
        alert(msg)
    },

    randomString(len) {
        len = len || 32;
        var $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var maxPos = $chars.length;
        var pwd = '';
        for (i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    },

    parseURL(url) {

        if (url.indexOf("?") == -1) {
            return {};
        }
        var ret = {},
            seg = url.slice(url.indexOf("?") + 1).split('&'),
            len = seg.length,
            i = 0,
            s;

        for (; i < len; i++) {
            if (!seg[i]) {
                continue;
            }
            if (seg[i].indexOf("=") == -1) {
                continue
            }
            s = [
                seg[i].slice(0, seg[i].indexOf("=")),
                seg[i].slice(seg[i].indexOf("=") + 1),
            ]


            var s1 = s[1].split("#");

            ret[s[0]] = s1[0];
        }
        return ret;
    }
};

(function ($) {
    // var app = new OnesApp()
    OnesApp.load();
})(jQuery);