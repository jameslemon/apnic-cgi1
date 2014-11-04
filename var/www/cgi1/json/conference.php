<?php header('content-type: application/json; charset=utf-8');

    require("/var/www/php/is_valid_callback.php");

    $file_path = './';
    $file_prefix = 'apnic';
    $file_ext = '.json';
    $file_name = isset($_GET['id']) ? $_GET['id'] : '39';
    $file = $file_path . $file_prefix . $file_name . $file_ext;

    # JSON/JSONP only if file exists
    if(file_exists($file)){
        $json = file_get_contents($file);

        #JSON if no callback
        if(! isset($_GET['callback'])){
            exit($json);
        }

        # JSONP if valid callback
        if(is_valid_callback($_GET['callback'])){
            exit("{$_GET['callback']}($json)");
        }
    }

    #Otherwise, bad request
    header('status: 400 Bad Request', true, 400);
?>
