<?php /*
This script is called directly from JavaScript, in response to a click on the Render button.
The JSON formatted mash data has already been saved to user_data_directory/{auth_userid()}/$id.json
This script then generates a decode job JSON payload and posts it to the Transcoder.
The job ID is passed to export_monitor.php, by setting the 'job' attribute in response.
If an error is encountered it is displayed in a javascript alert, by setting the 'error' attribute.
If possible and options permit, responses and requests are logged.
*/
$response = array();
$log_responses = '';
$err = '';
$config = array();
if (! @include_once(dirname(__FILE__) . '/include/loadutils.php')) $err = 'Problem loading utility script';
if ((! $err) && (! load_utils('api','data'))) $err = 'Problem loading utility scripts';

if (! $err) { // pull in configuration so we can log other errors
  $config = config_get();
  $err = config_error($config);
  $log_responses = $config['log_response'];
}
if ((! $err) && (! auth_ok())) auth_challenge($config); // autheticate the user (will exit if not possible)
if (! $err) { // pull in other configuration and check for required input
  if (! $php_input = file_get_contents('php://input')) $err = 'JSON payload required';
  else if (! $request = @json_decode($php_input, TRUE)) $err = 'Could not parse JSON payload';
}
if (! $err) {
  if ($config['log_request']) log_file(print_r($request, 1), $config);
  $id = (empty($request['id']) ? '' : $request['id']);
  if (! $id ) $err = 'Parameter id required';
}
if (! $err) { // grab mash data from input or file
  $uid = auth_userid();
  if (empty($request['label'])) {
    $mash = data_mash($id, $uid, $config);
    if (! $mash) $err = 'Could not find mash ' . $id;
  } else { // assume we were sent a complete mash payload requiring saving
    $err = data_save_mash($request, $uid, $config);
    $mash = $request;
  }
}
if (! $err) { // post export transcode job
  $options = array('include_progress' => 0, 'include_complete' => 1);
  $result = api_export(array('id' => $id, 'mash' => $mash), $options, $config);
  if (! empty($result['error'])) $err = $result['error'];
  else $response['job'] = $result['id'];
}
if ($err) $response['error'] = $err;
else $response['ok'] = 1;
$json = json_encode($response);
print $json . "\n\n";
if ($log_responses) log_file($json, $config);
