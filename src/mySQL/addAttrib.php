<?php

// Form fields
$nodeNum = $_POST["nodeNum"];
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
// Delete an existing name first
if ($attribType == "n") {
	mysql_query("DELETE FROM unsaved
	WHERE NodeNum = '".$nodeNum."' AND AttribType = 'n'");
}
mysql_query("INSERT INTO unsaved (NodeNum,AttribType,AttribName)
VALUES ('".$nodeNum."', '".$attribType."', '".$attribName."')");

// Disconnect
mysql_close($con);

?>