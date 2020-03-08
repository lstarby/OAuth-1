var OnesLogin = {

    load: function () {

        if (OnesApp.isLogin()) {
            $(".open_id").text(OnesApp.open_id)
            $(".login-status").show()
            $(".logout-status").hide()
        } else {
            var params = OnesApp.getParams()
            var action = params.action
            if (action == "login") {
                this.doLogin()
            }
        }

    },

    login: function () {

        var state = OnesApp.randomString(16)
        var device = "h5app"
        var scopes = "1,2"

        var url = OnesApp.onesLoginUrl +
            "app_id=" + OnesApp.app_id +
            "&state=" + state +
            "&device=" + device +
            "&scopes=" + scopes +
            "&redirect_url=" + OnesApp.loginCallbackUrl
        window.location.href = url
    },

    doLogin: function () {
        var params = OnesApp.getParams()
        console.log(params)
        var data = {
            "app_id": params.app_id,
            "scopes": params.scopes,
            "state": params.state,
            "device": params.device,
            "access_code": params.access_code,
            "expire_time": params.expire_time
        }
        console.log("oauthLogin", data, OnesApp.getServerUrl() + "/oauth/login")

        $.ajax({
            type: "POST",
            url: OnesApp.getServerUrl() + "/account/login",
            dataType: "json",
            data: data,
            success: function (res) {
                console.log(res)
                if (res.code == 0) {
                    var access_token = res.data.access_token
                    var open_id = res.data.open_id
                    var uid = res.data.uid
                    OnesApp.setAccessToken(access_token, uid, open_id)
                    $(".open_id").text(open_id)
                    $('.login-status').show()
                    $('.logout-status').hide()
                } else {
                    OnesApp.showAlert(res.msg)
                    $(".login-status").hide();
                    $('.logout-status').show()

                }
            },
            error: function (err) {
                console.log(err.statusText)
            }
        })
    },

    logout: function () {
        $(".login-status").hide()
        $(".logout-status").show()

        OnesApp.removeAccessToken();
    }
};

(function ($) {

    $("#ones-login-btn").on('click', function (event) {
        event.preventDefault();
        OnesLogin.login()
    });

    $(".ones-logout-btn").on('click', function (event) {
        event.preventDefault();
        OnesLogin.logout()
    });

    OnesLogin.load();

})(jQuery);