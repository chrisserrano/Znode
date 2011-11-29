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
while($row = mysql_fetch_array($result)) {
	echo "<div id='className' spellcheck='false'>";
	echo $row['AttribName'];
	echo "</div>";
}

// Retrieve the node attribs
$sql="SELECT * FROM ".$file." WHERE NodeNum = '".$node."' AND AttribType != 'n'";
$result = mysql_query($sql);

// Echo the node attribs
if ($row = mysql_fetch_array($result)) {
} else{
	echo mysql_error();
}
echo "<ul>";
while($row = mysql_fetch_array($result)) {
	echo "<li class='ui-state-default'>";
	echo "<div id=attribDel class='ui-icon ui-icon-closethick'></div>";
	echo "<div id=attrib>";
	echo $row['AttribType'];
	echo ": ";
	echo $row['AttribName'];
	echo "</div";
	echo "</li>";
}
echo "</ul>";

// Disconnect
mysql_close($con);

?>