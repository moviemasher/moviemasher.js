<?php /*
This script is called by the Transcoder when processing of an upload has completed and
transferred without error. If we can authenticate the request, we inject a new media
object into the user's data space for the newly uploaded file. If an error is encountered
a 400 header is returned and it is logged, if possible.
*/

$err = '';
$config = array();

if (! @include_once(dirname(__FILE__) . '/include/loadutils.php')) $err = 'Problem loading utility script';
if ((! $err) && (! load_utils('api','data'))) $err = 'Problem loading utility scripts';

if (! $err) { // pull in configuration so we can log other errors
  $config = config_get();
  $err = config_error($config);
}
if (! $err) { // see if the request is authenticated (does not redirect or exit)
  if (! auth_ok_callback()) $err = 'Unauthenticated access';
}
if (! $err) { // pull in other configuration and check for required input
  if (! $php_input = file_get_contents('php://input')) $err = 'JSON payload required';
  else if (! $json_object = @json_decode($php_input, TRUE)) $err = 'Could not parse JSON payload';
  if ($config['log_api_response']) log_file($php_input, $config);
}
if (! $err) {
  $job = (empty($json_object['job']) ? '' : $json_object['job']);
  if (! $job ) $err = 'Parameter job required';
}
if (! $err) { 
  if (! empty($json_object['commands'])) log_file("COMMANDS:\n" . implode($json_object['commands'], "\n"), $config);
  if (! empty($json_object['log'])) log_file("LOG:\n" . $json_object['log'], $config);
  if (! empty($json_object['error'])) {
    log_file($json_object['error'], $config);
  } else {
    $response = array('completed' => 1);
    $media_data = api_import_data($json_object, $config);
    if (! empty($media_data['error'])) $err = $media_data['error'];
    else $err = data_save_media($media_data, $json_object['uid'], $config);
    if ($err) $response['error'] = $err;
    else {
      $response['type'] = $media_data['type'];
      $response['no_video'] = $json_object['no_video'];
    }
    $php_input = json_encode($response);
  }
}      
if (! (empty($config) || empty($job) || empty($php_input))) {
  if (! file_write_temporary($job . '.json', $php_input, $config)) $err = 'Complete callback could not write progress file';
}
if ($err) {
  header('HTTP/1.1: 400 Bad Request');
  header('Status: 400 Bad Request');
  print $err;
  log_file($err, $config);
}
