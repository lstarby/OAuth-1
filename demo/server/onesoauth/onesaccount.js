const onesbase = require('./onesbase');

class OnesAccount extends onesbase.OnesBase {
	constructor() {
		super();
	}

	//login
	login(access_code, app_id, scopes, state, device, callback) {
		let path = "/v1/account/login";
		let data = {
			"access_code": access_code,
			"app_id": app_id,
			"scopes": scopes,
			"state": state,
			"device": device
		};

		this.sendPOST(path, data, null, callback);
	}

	//logout 
	logout(access_token, callback) {
		let path = "/v1/account/logout";
		let data = {
			"access_token": access_token
		};
		this.sendPOST(path, data, null, callback);
	}

	// detail
	detail(open_id, callback) {
		let path = "/v1/account/detail";
		let data = {
			"open_id": open_id,
		};

		this.sendPOST(path, data, null, callback);
	}

}

module.exports = {
	OnesAccount: OnesAccount
};