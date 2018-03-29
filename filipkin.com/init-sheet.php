<?php
ini_set("display_errors", "Off");
$email = $_GET['email'];
$device = $_GET['device'];
$history = $_POST['history'];
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
// Test data
/*$status[1] = [];
$device = 'Test';
$email = 'filipkinjan@gmail.com';
$history = json_decode('[{
    "id": "61161",
    "title": "Filip Kin",
    "url": "https://filipkin.com/",
    "direct": false,
    "visits": 1,
    "time": "2018-03-28 00:00:10"
}]');*/
if ($status[1] == []) {
  $status[0] = "processing";
  $jsonstr = '{"device": "'.$device.'", "email": "'.$email.'", "history": []}';
  $jsonout = json_decode($jsonstr);
  $jsonout->history = $history;
  $argfile = fopen("argfile.json", "w");
  fwrite($argfile, json_encode($jsonout, JSON_UNESCAPED_SLASHES));
  $output = shell_exec('python3 init-sheet.py');
  $cleanout = str_replace("\n", "", $output);
  $status[0] = json_decode($cleanout)->status;
  $status[1] = json_decode($cleanout)->url;
}
echo '{"email": "'.$email.'", "status": '.json_encode($status, JSON_UNESCAPED_SLASHES).'}';
?>
