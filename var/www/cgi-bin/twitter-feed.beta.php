<?php
session_start();
require_once("../php/lib/twitteroauth-master/twitteroauth/twitteroauth.php"); //Path to twitteroauth library
require_once("../php/twitteroauth-credentials.php"); // Twitter keys, tokens, secrets.
 
$twitteruser = "apnic";
$notweets = 5;
 
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
  
$connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);
 
$tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);
 
echo "jsonTwitter(". json_encode($tweets) . ")";
?>
