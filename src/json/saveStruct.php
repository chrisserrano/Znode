<?php

if (isset($_POST["data"])){
  $data = $_POST["data"];
  $file = fopen("../files/structs/" . $_POST["name"] . ".json", "w") or die("error");
  fwrite($file, $data);
  fclose($file);
  echo "saved";
}