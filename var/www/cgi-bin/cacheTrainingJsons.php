<?php
    file_put_contents("/var/www/cgi1/json/training/pages.json", file_get_contents('https://training.apnic.net/apps/training-search/misc/pages.json/_nocache'));
    file_put_contents("/var/www/cgi1/json/training/posts.json", file_get_contents('https://training.apnic.net/data/all-training-blog-posts.json/_nocache'));
    file_put_contents("/var/www/cgi1/json/training/courses.json", file_get_contents('https://training.apnic.net/data/all-training-courses.json/_nocache'));
    file_put_contents("/var/www/cgi1/json/training/staff.json", file_get_contents('https://training.apnic.net/data/all-training-staff.json/_nocache'));
    file_put_contents("/var/www/cgi1/json/training/sponsors.json", file_get_contents('https://training.apnic.net/data/all-training-sponsors.json/_nocache'));
    file_put_contents("/var/www/cgi1/json/training/events.json", file_get_contents('https://training.apnic.net/data/all-training-events.json/_nocache'));
?>
