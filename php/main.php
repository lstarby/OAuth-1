<?php

// 需要替换
define("AccessKey", "bb151762043f59f287d1275ec4b46f6e");
define("SecretKey", "04e995f4f8135310b4a447affde15dff");
define("AppID","qunheigame");

define("Host", "https://devoauth.ones.game");


include "./ones.php";


$ones = new Ones();
var_dump($ones->login("xxxxx","scopes","state","device"));
echo "\n";

var_dump($ones->getUserDetail("6d602bd575da0fe1ddc7639e7a0370bb"));

$h = new HTTPResponse($d);
var_dump($h);

echo "\n";