<?php

// File name
$file=$_GET["file"];

// Connect
$con = mysql_connect('localhost','root');
if (!$con) {
  die('Could not connect: ' . mysql_error());
}
mysql_select_db("znode_db", $con);

// Clear unsaved table
mysql_query("DROP TABLE unsaved");

// Copy saved table to unsaved
mysql_query("CREATE TABLE unsaved SELECT * FROM ".$file."", $con);

// Disconnect
mysql_close($con);

?>