<?php
session_start();
require_once("../php/twitteroauth-master/twitteroauth/twitteroauth.php"); //Path to twitteroauth library
require_once("../php/twitteroauth-credentials.php"); // Twitter keys, tokens, secrets.

$jsonp_callback = isset($_GET['callback']) ? $_GET['callback'] : null;
 
$twitteruser = "apnic";
$notweets = 5;
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
  
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$tweets = $connection->get("https://api.twitter.com/1.1/search/tweets.json?q=%23apnic38");

print $jsonp_callback ? "$jsonp_callback(".json_encode($tweets).")" : json_encode($tweets);
?>
