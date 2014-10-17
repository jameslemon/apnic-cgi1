<?php
    $file_path = './';
    $file_prefix = '';
    $file_ext = '.json';
    $file_name = isset($_GET['file']) ? $_GET['file'] : 'blank';
    $file = $file_path . $file_prefix . $file_name . $file_ext;
    if(file_exists($file)){
        $json = file_get_contents($file);
        $jsonp_callback = isset($_GET['callback']) ? $_GET['callback'] : null;
        print $jsonp_callback ? "$jsonp_callback($json)" : $json;
    }
?>
