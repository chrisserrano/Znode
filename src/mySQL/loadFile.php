<?php

// Connect
$con = mysql_connect('localhost','root');
if (!$con) {
  die('Could not connect: ' . mysql_error());
}
mysql_select_db("znode_db", $con);

// Clear out all the nodes

// Load the table with the given name into the nodes

// Disconnect
mysql_close($con);

?>