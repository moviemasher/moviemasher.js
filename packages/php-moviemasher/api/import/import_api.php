<?php /*
This script is called from the CGI control, after import_init.php or
import_upload.php are called. $request contains information about the
imported media file with keys id, extension, type and label. If the
media file is remote, the url key will contain its location. The script
generates a job and posts it to Movie Masher Transcoder. The resultant
job ID is passed along with the media ID and type to import_monitor.php,
by setting the 'url' attribute in response. If an error is encountered
it is displayed in a javascript alert, by setting the 'get' attribute.
If possible, the response to client is logged.
*/

$response = array();
$err = '';
$config = array();
$log_responses = '';

if (! @include_once(dirname(__FILE__) . '/include/loadutils.php')) $err = 'Problem loading utility script';
if ((! $err) && (! load_utils('api'))) $err = 'Problem loading utility scripts';

if (! $err) { // pull in configuration so we can log other errors
  $config = config_get();
  $err = config_error($config);
  $log_responses = $config['log_response'];
}
if (! $err) { // see if the user is authenticated (does not redirect or exit)
  if (! auth_ok()) $err = 'Unauthenticated access';
}
if (! $err) { // pull in other configuration and check for required input
  if (! $php_input = file_get_contents('php://input')) $err = 'JSON payload required';
  else if (! $request = @json_decode($php_input, TRUE)) $err = 'Could not parse JSON payload';
}
if (! $err) {
  if ($config['log_request']) log_file(print_r($request, 1), $config);
  $options = array('include_progress' => 0, 'include_complete' => 1);

  $result = api_import($request, $options, $config);
  if (! empty($result['error'])) $err = $result['error'];
  else $response['monitor'] = array('job' => $result['id']);
}
if ($err) $response['error'] = $err;
else $response['ok'] = 1;

$json = json_encode($response);
print $json . "\n\n";
if ($log_responses) log_file($json, $config);
