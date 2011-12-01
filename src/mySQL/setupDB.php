<?php

// Connect
$con = mysql_connect('localhost','root');
if (!$con) {
  die('Could not connect: ' . mysql_error());
}

// Create MySQL database if it doesn't exist
mysql_query("CREATE DATABASE IF NOT EXISTS znode_db", $con);

mysql_select_db("znode_db", $con);

// Create "unsaved" table
$sql = "CREATE TABLE IF NOT EXISTS unsaved
(
id int NOT NULL AUTO_INCREMENT, 
PRIMARY KEY(id),
NodeNum int,
AttribType varchar(1),
AttribName varchar(32)
)";
$result = mysql_query($sql);
// Clear "unsaved" table
mysql_query("TRUNCATE TABLE unsaved");

// Create "unsaved_func" table
$sql = "CREATE TABLE IF NOT EXISTS unsaved_func
(
id int NOT NULL AUTO_INCREMENT, 
PRIMARY KEY(id),
FuncName varchar(32),
ClassName varchar(32),
)";
$result = mysql_query($sql);
// Test unsaved_func values
mysql_query("INSERT INTO unsaved_func (FuncName,ClassName)
VALUES ('f1', 'c1')");
mysql_query("INSERT INTO unsaved_func (FuncName,ClassName)
VALUES ('f1', 'c2')");
mysql_query("INSERT INTO unsaved_func (FuncName,ClassName)
VALUES ('f2', 'c1')");
mysql_query("INSERT INTO unsaved_func (FuncName,ClassName)
VALUES ('f1', 'c3')");
// Clear "unsaved_func" table
//mysql_query("TRUNCATE TABLE unsaved_func");

// Disconnect
mysql_close($con);

?>