<?php /*
This script is called in response to dropping a file for upload. A JSON
formatted object is posted as raw data, with a 'file' key containing a filename
and 'size' key indicating the number of bytes in the file. There is also an
optional 'label' key that defaults to the filename, 'extension' key that is
drawn from the filename, and 'type' key that's used if the mime type can't be
determined from the file extension. The JSON response will include an 'error'
key indicating any problem or an 'endpoint' key containing a URL to POST the
file to, a 'data' key containing additional parameters, and an 'api' key with
parameters to be sent to import_api.php after successfully uploading. 
*/

$response = array();
$log_responses = '';
$err = '';
$config = array();

if (! @include_once(dirname(__FILE__) . '/include/loadutils.php')) $err = 'Problem loading utility script';
if ((! $err) && (! load_utils('auth','service'))) $err = 'Problem loading utility scripts';

if (! $err) { // pull in configuration so we can log other errors
  $config = config_get();
  $err = config_error($config);
  $log_responses = $config['log_response'];
}
// autheticate the user (will exit if not possible)
if ((! $err) && (! auth_ok())) auth_challenge($config);

if (! $err) { // pull in other configuration and check for required input
  if (! $php_input = file_get_contents('php://input')) $err = 'JSON payload required';
  else if (! $request = @json_decode($php_input, TRUE)) $err = 'Could not parse JSON payload';
}
if (! $err) { 
  if ($config['log_request']) log_file(print_r($request, 1), $config);
  $request['uid'] = auth_userid();
  $request['mime'] = (empty($request['type']) ? '' : $request['type']);
  $request['type'] = '';
  $response = service_import_init($request, $config);
}
if ($err) $response['error'] = $err;
if (empty($response['error'])) $response['ok'] = 1;
$json = json_encode($response);
print $json . "\n\n";
if ($log_responses) log_file($json, $config);
