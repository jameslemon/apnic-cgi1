<?php
    # Show me problems if I have any.
    ini_set('display_errors',1);
    error_reporting(E_ALL);

    # Get database credentials.
    require_once('../php/db-credentials.php');

    # Connect to database.
    require_once('../php/db/db-connect.php');

    if (!$con){
        echo '<p>Could not connect: ' . mysql_error() . '</p>';
    }
    else{
        # A successful connection.

        # Select table.
        require_once('../php/db/db-select.php');

        # Begin wrapper for JSONP.
        echo 'jsonAPNICMembers([';

        # Get results.
        $result = mysql_query("SELECT member.mem_id AS id, member.mem_name AS name, member.mem_size AS size, member.mem_country AS country, mem_webinfo.mem_blurb AS blurb, mem_webinfo.mem_url AS url, mem_webinfo.mem_logo AS logo FROM member LEFT JOIN mem_webinfo ON member.mem_id=mem_webinfo.mem_id WHERE member.mem_status = 'open' AND member.mem_type IN ('regular','confed-isp','confed-nir')");
        
        # Show problems.
        if(!$result){
            echo '<p>Could not query' . mysql_error()  . '</p>';
        }

        $counter = 1;
        # Convert results into json output rows.
        while($row = mysql_fetch_array($result)){
            if($counter > 1){
                echo ",";
            }
            echo "{";
            echo "\"id\":";
            echo $row['id'];
            echo ",";
            echo "\"name\":";
            echo "\"" . $row['name'] . "\"";
            echo ",";
            echo "\"size\":";
            echo "\"" . $row['size'] . "\"";
            echo ",";
            echo "\"economy\":";
            echo "\"" . $row['country'] . "\"";
            echo ",";
            echo "\"url\":";
            echo "\"" . $row['url'] . "\"";
            echo "}";
            $counter++;
        }
    }

    # End wrapper for JSONP.
    echo '])';

    # Close connection.
    require_once('../php/db/db-disconnect.php');
?>
