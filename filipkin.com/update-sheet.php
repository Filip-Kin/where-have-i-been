<?php
ini_set("display_errors", "Off");
$sid = $_GET['id'];
$device = $_GET['device'];
$history = json_decode(file_get_contents('php://input'));
ini_set("display_errors", "On");
$status = ["failed", []];
if ($sid == "") {
  array_push($status[1], "ID not present");
}
if ($device == "") {
  array_push($status[1], "Device not present");
}
if ($history == "") {
  array_push($status[1], "History not present");
}
if ($status[1] == []) {
  $status[0] = "processing";
  $jsonstr = '{"device": "'.$device.'", "sid": "'.$sid.'"}';
  $argfile = fopen("argfile.json", "w");
  fwrite($argfile, $jsonstr);
  $histfile = fopen("history.json", "w");
  fwrite($histfile, json_encode($history));
  $output = shell_exec('python3 update-history.py');
  $cleanout = str_replace("\n", "", $output);
  $status[0] = $cleanout;
}
echo '{"id": "'.$sid.'", "status": '.json_encode($status, JSON_UNESCAPED_SLASHES).'}';
?>
