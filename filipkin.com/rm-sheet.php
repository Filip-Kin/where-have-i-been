<?php
ini_set("display_errors", "Off");
$id = $_GET['id'];
ini_set("display_errors", "On");
$status = ["failed", []];
if ($id == "") {
  array_push($status[1], "ID not present");
}
if ($status[1] == []) {
  $status[0] = "processing";
  $jsonstr = '{"id": "'.$id.'"}';
  $jsonout = json_decode($jsonstr);
  $argfile = fopen("argfile.json", "w");
  fwrite($argfile, json_encode($jsonout, JSON_UNESCAPED_SLASHES));
  $output = shell_exec('python3 rm-sheet.py');
  $cleanout = str_replace("\n", "", $output);
  $status[0] = json_decode($cleanout).status;
}
echo '{"id": "'.$id.'", "status": '.json_encode($status, JSON_UNESCAPED_SLASHES).'}';
?>
