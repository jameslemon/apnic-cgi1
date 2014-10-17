<?php
    // Clear the JSON file for a conference JSON blob.
    // JSON blobs generated from Squiz CMS. We copy them
    // onto cgi1 to speed things up.

    // Set defaults on existing JSON files.
    $file_path = '/var/www/cgi1/json/';
    $file_prefix = 'apnic';
    $file_ext = '.json';

    // End if no conference id specified (e.g. "?id=37" 
    if(!isset($_GET['id'])){
        print "Can't clear cache on file. No id param found.";
        return false;
    }
    $file_name = $_GET['id'];
    $file = $file_path . $file_prefix . $file_name . $file_ext;

    // If the file exists, then proceed.
    if(file_exists($file)){
        print "Clearing cache on file...";
        $squizpath = 'https://conference.apnic.net/data/'. $file_name . '/_nocache';
        file_put_contents($file, file_get_contents($squizpath));
        print "... done.";
        //$json = file_get_contents($file);
        //$jsonp_callback = isset($_GET['callback']) ? $_GET['callback'] : null;
        //print $jsonp_callback ? "$jsonp_callback($json)" : $json;
    }else{
        print "Can't clear cache on file. File not found. Check the id param.";
    }
?>
