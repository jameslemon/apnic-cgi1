<?php
    file_put_contents("/var/www/cgi1/json/calendar.json", file_get_contents('http://www.apnic.net/events/calendar/dhtml/calendar.json/_nocache'));
?>
