<?php
    date_default_timezone_set('Australia/Brisbane');
    header('Content-type: application/json');
    $php_datetime_format = "Y-m-d H:i:s P";
    $json = '{"datetime" : "' . date($php_datetime_format) . '", "timezone" : "Australia/Brisbane", "momentformat" : "YYYY-MM-DD HH:mm:ss Z", "phpformat" : "' . $php_datetime_format. '" }';
    $jsonp_callback = isset($_GET['callback']) ? $_GET['callback'] : null;
    print $jsonp_callback ? "$jsonp_callback($json)" : $json;
?>
