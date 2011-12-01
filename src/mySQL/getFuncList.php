<?php

// Connect
$con = mysql_connect('localhost','root');
if (!$con) {
  die('Could not connect: ' . mysql_error());
}
mysql_select_db("znode_db", $con);

// Retrieve all the places where the attrib exists
$sql="SELECT * FROM unsaved_func";
$result = mysql_query($sql);

if($row = mysql_fetch_array($result)) {
	
} else {
	echo mysql_error();
}

echo "<ul>";
while($row = mysql_fetch_array($result)) {
	echo "<li>";
	echo $row['ClassName'];
	echo "</li>";
}
echo "</ul>";

// Disconnect
mysql_close($con);

?>