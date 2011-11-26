<?php

// Connect
$con = mysql_connect('localhost','root');
if (!$con) {
  die('Could not connect: ' . mysql_error());
}

// Create MySQL database if it doesn't exist
mysql_query("CREATE DATABASE IF NOT EXISTS znode_db", $con);

// Create "unsaved" table if it doesn't exist
mysql_select_db("znode_db", $con);
$sql = "CREATE TABLE IF NOT EXISTS unsaved
(
id int NOT NULL AUTO_INCREMENT, 
PRIMARY KEY(id),
NodeNum int,
AttribType varchar(1),
AttribName varchar(32)
)";
$result = mysql_query($sql);

// Disconnect
mysql_close($con);

?>