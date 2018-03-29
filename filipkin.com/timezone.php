<?php
$ip = $_SERVER['REMOTE_ADDR'];;
if ($ip == "") {
  echo "0";
} else {
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, "http://freegeoip.net/json/".$ip);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  $out = json_decode(curl_exec($ch));
  curl_close($ch);
  $timezone = $out->time_zone;
  $timezone = new DateTimeZone($timezone);
  $timezoneOffset = $timezone->getOffset(new DateTime);
  echo '{"offset": '.($timezoneOffset/60/60).'}';
}
