var OnesPay = {

    load: function () {
        if (OnesApp.isLogin()) {

            var params = OnesApp.getParams()
            var action = params.action
            if (action == "pay") {
                this.doPay()
            }
        }
    },

    pay: function (amount) {
        var data = {
            "amount": amount,
            "coin_code": "usdt",
            "device": "ios12"
        }

        $.ajax({
            type: "POST",
            url: OnesApp.getServerUrl() + "/asset/prepay",
            dataType: "json",
            data: data,
            headers: {
                "access-token": OnesApp.getAccessToken(),
                "uid": OnesApp.uid
            },
            success: function (res) {
                console.log(res)
                if (res.code == 0) {
                    var pay_url = res.data.pay_url
                    window.location.href = pay_url
                } else {
                    OnesApp.showAlert(res.msg)
                }
            },
            error: function (err) {
                console.log(err.statusText)
            }
        })
    },

    doPay: function () {
        console.log(OnesApp.uid)
        var data = OnesApp.getParams()
        $.ajax({
            type: "POST",
            url: OnesApp.getServerUrl() + "/asset/dopay",
            dataType: "json",
            data: data,
            headers: {
                "access-token": OnesApp.getAccessToken(),
                "uid": OnesApp.uid
            },
            success: function (res) {
                console.log(res)
                if (res.code == 0) {
                   OnesApp.showAlert("支付成功")
                } else {
                    OnesApp.showAlert(res.msg)
                }
            },
            error: function (err) {
                console.log(err.statusText)
            }
        })
    }
};

(function ($) {

    OnesPay.load();

    $("#ones-pay-btn").on('click', function (event) {
        event.preventDefault();

        var amount = $("#pay-amount").val();
        OnesPay.pay(amount)
    });

})(jQuery);