<?php

include "./base.php";

class ONES extends Base {
	//
	function __construct() {
	}

	// 
	function login($accessCode, $scopes, $state, $device) {

        $path = "/v1/account/login";
        
        $data = array(
             'access_code' => $accessCode,
             'app_id' => AppID,
             'scopes' => $scopes,
             'state' => $state,
             'device' => $device,
            );

		return $this->sendPOST($path, $data, null);
	}

	//
	function getUserDetail($openID) {
		$path = "/v1/user/detail";
		$data = array(
			"open_id"=>$openID
		);
		var_dump($data);
		return $this->sendPOST($path, $data, null);
	}

	//
	function prePay($open_id, $trade_no, $coin_code, $amount, $scene,$desc,$device,$state,$redirect_url) {
		$path = "/v1/pay/prepay";
		$data = array( 
				"open_id"=> $open_id,
				"trade_no"=> $trade_no,
				"coin_code"=> $coin_code,
				"amount"=> $amount,
				"scene"=>$scene,
				"desc"=> $desc,
				"device"=> $device,
				"state"=> $state,
				"redirect_url"=> $redirect_url,
		);

		return $this->sendGET($path, $data, null);
	}

	//
	function getOrderDetail($orderID) {
        $path = "/v1/order/detail";
        $data = array( 'order_id' => $orderID);

		return $this->sendPOST($path, $data, null);
	}
}