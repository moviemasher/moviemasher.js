<?php /*
This script is called from JavaScript, in response to a click on the Save button. The JSON
formatted mash is posted as raw data, available in php://input The script saves the data
using methods in the datautils.php file. Any error should be available in the response's
'error' key, otherwise the 'ok' key is set to a true value.
*/

$response = array();
$err = '';
$config = array();

if (! @include_once(dirname(__FILE__) . '/include/loadutils.php')) $err = 'Problem loading utility script';
if ((! $err) && (! load_utils('auth','data'))) $err = 'Problem loading utility scripts';

if (! $err) { // pull in configuration so we can log other errors
  $config = config_get();
  $err = config_error($config);
}
// autheticate the user (will exit if not possible)
if ((! $err) && (! auth_ok())) auth_challenge($config);

if (! $err) { // pull in other configuration and check for required input
  $id = (empty($_REQUEST['id']) ? '' : $_REQUEST['id']);
  $php_input = file_get('php://input');
  $log_requests = $config['log_request'];
  $log_responses = $config['log_response'];
  if ($log_requests) log_file($_SERVER['QUERY_STRING']  . "\n" . $php_input, $config);
  if (! ($id && $php_input)) $err = 'Mash id and data required';
}
if (! $err) { // check to make sure JSON data is parsable
  if (! $request = @json_decode($php_input, TRUE)) $err = 'Could not parse JSON payload';
}
if (! $err) { // make sure label was set
  $label = $request['label'];
  if (! $label) $err = 'Could not determine mash label';
}
if (! $err) { // save mash xml to local file
  $err = data_save_mash($request, auth_userid(), $config);
}
if ($err) $response['error'] = $err;
else $response['ok'] = 1;
$json = json_encode($response);
print $json . "\n\n";
if (! empty($log_responses)) log_file($json, $config);
