<?php
    $file_path = './';
    $file_prefix = 'apnic';
    $file_ext = '.json';
    $file_name = isset($_GET['id']) ? $_GET['id'] : '39';
    $file = $file_path . $file_prefix . $file_name . $file_ext;
    if(file_exists($file)){
        $json = file_get_contents($file);
        $jsonp_callback = isset($_GET['callback']) ? $_GET['callback'] : null;
        print $jsonp_callback ? "$jsonp_callback($json)" : $json;
    }
?>
