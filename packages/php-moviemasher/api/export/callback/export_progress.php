<?php /*
This script is called from the Transcoder, when progress has occured during job processing.
If the request can be properly authenticated, the message body is saved to the temp directory
using the $job parameter provide as a base name.
Any error encountered during processing is logged if possible.
*/

$err = '';
$config = array();

if (! @include_once(dirname(__FILE__) . '/include/loadutils.php')) $err = 'Problem loading utility script';
if ((! $err) && (! load_utils('auth'))) $err = 'Problem loading utility scripts';

if (! $err) { // pull in configuration so we can log other errors
  $config = config_get();
  $err = config_error($config);
}
if (! $err) { // see if the request is authenticated (does not redirect or exit)
  if (! auth_ok_callback()) $err = 'Unauthenticated access';
}
if (! $err) { // pull in other configuration and check for required input
  if (! $php_input = file_get_contents('php://input')) $err = 'JSON payload required';
  else if (! $request = @json_decode($php_input, TRUE)) $err = 'Could not parse JSON payload';
}
if (! $err) { // check to make sure required parameters have been sent
  if ($config['log_api_response']) log_file($php_input, $config);
  $job = (empty($request['job']) ? '' : $request['job']);
  if (! $job ) $err = 'Parameter job required';
}
if (! (empty($config) || empty($job) || empty($php_input))) {
  if (! file_write_temporary($job . '.json', $php_input, $config)) $err = 'Could not write progress file';
}
if ($err) {
  header('HTTP/1.1: 400 Bad Request');
  header('Status: 400 Bad Request');
  log_file($err, $config);
}
