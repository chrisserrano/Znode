<?php

// Form fields
$attribType = $_POST["attribType"];
$attribName = $_POST["attribName"];
//TODO node number

// Connect
$con = mysql_connect('localhost','root');
if (!$con) {
  die('Could not connect: ' . mysql_error());
}
mysql_select_db("znode_db", $con);

// Insert the attribute
mysql_query("INSERT INTO unsaved (NodeNum,AttribType,AttribName)
VALUES ('1', '".$attribType."', '".$attribName."')");

// Disconnect
mysql_close($con);

?>