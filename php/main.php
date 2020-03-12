<?php

// 需要替换
define("AccessKey", "my access key");
define("SecretKey", "my secret key");
define("AppID","my app id");

define("Host", "https://devoauth.ones.game");


include "./ones.php";


$ones = new Ones();
var_dump($ones->login("xxxxx","scopes","state","device"));
echo "\n";

$h = new HTTPResponse($d);
var_dump($h);

echo "\n";