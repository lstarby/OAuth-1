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
	function getUserDetail() {
		$path = "/v1/user/detail";
		return $this->sendPOST($path, array(), null);
	}

	//
	function prePay() {
		$path = "/v1/pay/prepay";
		return $this->sendGET($path, null, null);
	}

	//
	function getOrderDetail($orderID) {
        $path = "/v1/order/detail";
        $data = array( 'order_id' => $orderID);

		return $this->sendPOST($path, $data, null);
	}
}