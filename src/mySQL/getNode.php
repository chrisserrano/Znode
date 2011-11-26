<?php

// File name
$file=$_GET["file"];
// Node number
$node=$_GET["node"];

// Connect
$con = mysql_connect('localhost','root');
if (!$con) {
  die('Could not connect: ' . mysql_error());
}
mysql_select_db("znode_db", $con);

// Retrieve the node name
$sql="SELECT * FROM ".$file." WHERE NodeNum = '".$node."' AND AttribType = 'n'";
$result = mysql_query($sql);

// Echo the node name
echo "<div class='className' spellcheck='false'>";
while($row = mysql_fetch_array($result)) {
  echo $row['AttribName'];
}
echo "</div>";

// Retrieve the node attribs
$sql="SELECT * FROM ".$file." WHERE NodeNum = '".$node."' AND AttribType != 'n'";
$result = mysql_query($sql);

// Echo the node attribs
echo "<div class='attribs' spellcheck='false'><ul>";
while($row = mysql_fetch_array($result)) {
	echo "<li class='ui-state-default'>";
	echo "<div class='ui-icon ui-icon-help' id='editIcon'></div>";
	echo "<div class='ui-icon ui-icon-closethick'></div>";
	echo "<div id=attrib>";
	echo $row['AttribType'];
	echo ": ";
	echo $row['AttribName'];
	echo "</div";
	echo "</li>";
}
echo "</div></ul>";

// Disconnect
mysql_close($con);

?>