<?php
ini_set("display_errors", "Off");
$email = $_GET['email'];
ini_set("display_errors", "On");
$status = ["failed", []];
if ($email == "") {
  array_push($status[1], "Email not present");
}
if ($status[1] == []) {
  $status[0] = "processing";
  $jsonstr = '{"email": "'.$email.'"}';
  $argfile = fopen("argfile.json", "w");
  fwrite($argfile, $jsonstr);
  $output = shell_exec('python3 get-sheet.py');
  $cleanout = str_replace("\n", "", $output);
  $status[0] = json_decode($cleanout)->status;
  if ($status[0] == 'exists') {
    $status[1] = json_decode($cleanout)->url;
  }
}
echo '{"email": "'.$email.'", "status": '.json_encode($status, JSON_UNESCAPED_SLASHES).'}';
?>