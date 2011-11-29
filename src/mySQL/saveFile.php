<?php

// File name
$file=$_GET["file"];

// Connect
$con = mysql_connect('localhost','root');
if (!$con) {
  die('Could not connect: ' . mysql_error());
}
mysql_select_db("znode_db", $con);

// Drop original table first to overwrite
mysql_query("DROP TABLE IF EXISTS ".$file."");

// Copy unsaved table to new table with given name
mysql_query("CREATE TABLE ".$file." SELECT * FROM unsaved", $con);

// Disconnect
mysql_close($con);

?>