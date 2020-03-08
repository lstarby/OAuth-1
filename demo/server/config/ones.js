const env = require('./env')

var OnesGameConfig = {
    AppId: "qunheigame",
    AccessKey: "",
    SecretKey: "",
    OauthHost: "",
    OauthPort: "443",
    PayCallbackUrl: ""
}

if (env.ENV == "devnet") {
    OnesGameConfig.AccessKey = "bb151762043f59f287d1275ec4b46f6e";
    OnesGameConfig.SecretKey = "04e995f4f8135310b4a447affde15dff";
    OnesGameConfig.OauthHost = "devoauth.ones.game";
    // OnesGameConfig.OauthHost = "127.0.0.1";

    OnesGameConfig.PayCallbackUrl = "http://127.0.0.1:5502?action=pay&type="
} else if (env.ENV == "testnet") {

    OnesGameConfig.AccessKey = "";
    OnesGameConfig.SecretKey = "";
    OnesGameConfig.OauthHost = "devoauth.ones.game";
    OnesGameConfig.PayCallbackUrl = "http://127.0.0.1:5502?action=pay&type="

} else if (env.ENV == "mainnet") {

    OnesGameConfig.AccessKey = "";
    OnesGameConfig.SecretKey = "";
    OnesGameConfig.OauthHost = "oauth.ones.game";
    OnesGameConfig.PayCallbackUrl = "http://127.0.0.1:5502?action=pay&type="
}


// 测试环境域名：devoauth.ones.game
// 正式环境域名：oauth.ones.game

module.exports = {
    appId: OnesGameConfig.AppId,
    accessKey: OnesGameConfig.AccessKey,
    secretKey: OnesGameConfig.SecretKey,
    oauthHost: OnesGameConfig.OauthHost,
    oauthPort: OnesGameConfig.OauthPort,
    payCallbackUrl: OnesGameConfig.PayCallbackUrl,
}