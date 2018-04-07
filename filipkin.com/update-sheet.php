<?php
ini_set("display_errors", "Off");
$email = $_GET['email'];
$device = $_GET['device'];
$history = json_decode(file_get_contents('php://input'));
ini_set("display_errors", "On");
$status = ["failed", []];
if ($email == "") {
  array_push($status[1], "Email not present");
}
if ($device == "") {
  array_push($status[1], "Device not present");
}
if ($history == "") {
  array_push($status[1], "History not present");
}
if ($status[1] == []) {
  $status[0] = "processing";
  $jsonstr = '{"device": "'.$device.'", "email": "'.$email.'"}';
  $argfile = fopen("argfile.json", "w");
  fwrite($argfile, $jsonstr);
  $histfile = fopen("history.json", "w");
  fwrite($histfile, json_encode($history));
  $output = shell_exec('python3 update-sheet.py');
  $cleanout = str_replace("\n", "", $output);
  $status[0] = json_decode($cleanout)->status;
  $status[1] = json_decode($cleanout)->url;
}
echo '{"email": "'.$email.'", "status": '.json_encode($status, JSON_UNESCAPED_SLASHES).'}';
?>
