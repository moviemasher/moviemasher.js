<?php /*
This script is called directly from the Movie Masher client, in response to clicks in browser
navigation and scrolling. The count, index and group values are sent as GET parameters.
Additional GET parameters are used to limit the result set. If the user is authenticated
the script searches either the relevant JSON file, depending on group parameter. Media
matching parameters are included in result set, paged with count and index parameters. If
an error is encountered it is ignored and an empty result set is returned. This script is
called repeatedly as the user scrolls down, until an empty result set is returned.
*/

$response = array();
$err = '';
$config = array();

if (! @include_once(dirname(__DIR__) . '/include/loadutils.php')) $err = 'Problem loading utility script';
if ((! $err) && (! load_utils('auth','data'))) $err = 'Problem loading utility scripts';

if (! $err) { // pull in configuration so we can log other errors
  $config = config_get();
  $err = config_error($config);
}
// autheticate the user (will exit if not possible)
if ((! $err) && (! auth_ok())) auth_challenge($config);

if (! $err) {
  $id = (empty($_GET['id']) ? 0 : $_GET['id']);
  // see if we want requests logged, and potentially do so
  $log_responses = (empty($config['log_response']) ? '' : $config['log_response']);
  if ($config['log_request']) log_file($_SERVER['QUERY_STRING'], $config);
  // make sure required parameters have been sent
  if (! $id ) $err = 'Parameter id required';
}
if (! $err) {
  $mash_data = data_mash($id, auth_userid(), $config);
  if (! empty($mash_data['error'])) $err = $mash_data['error'];
  else $response['data'] = $mash_data;
}
if ($err) $response['error'] = $err;
else $response['ok'] = 1;
$json = json_encode($response);
print $json . "\n\n";
if (! empty($log_responses)) log_file($json, $config);
