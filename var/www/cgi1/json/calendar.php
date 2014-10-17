<?php
    $file = './calendar.json';
    if(file_exists($file)){
        $json = file_get_contents($file);
        $jsonp_callback = isset($_GET['callback']) ? $_GET['callback'] : null;
        print $jsonp_callback ? "$jsonp_callback($json)" : $json;
    }
?>
