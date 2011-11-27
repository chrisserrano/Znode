<?php

// Attribute name
$attribName=$_GET["attribName"];
// Attribute type
$attribType=$_GET["attribType"];

// Connect
$con = mysql_connect('localhost','root');
if (!$con) {
  die('Could not connect: ' . mysql_error());
}
mysql_select_db("znode_db", $con);

// Retrieve all the places where the attrib exists
$sql="SELECT * FROM unsaved WHERE AttribName = '".$attribName."' AND AttribType = '".$attribType."'";
$result = mysql_query($sql);

// TODO return the node numbers to JavaScript
echo "<div>Exists in node #: ";
while($row = mysql_fetch_array($result)) {
	echo $row['NodeNum'];
	echo " ";
}
echo "</div>";

// Disconnect
mysql_close($con);

?>