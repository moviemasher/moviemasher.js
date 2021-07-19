<?php /*
This script is called directly from the Movie Masher client, in response to clicks in browser
navigation and scrolling. The count, index and group values are sent as GET parameters.
Additional GET parameters are used to limit the result set. If the user is authenticated
the script searches either the relevant JSON file, depending on group parameter. Media
matching parameters are included in result set, paged with count and index parameters. If
an error is encountered it is ignored and an empty result set is returned. This script is
called repeatedly as the user scrolls down, until an empty result set is returned.
*/

$err = '';
$config = array();

if (! @include_once(dirname(__FILE__) . '/include/loadutils.php')) $err = 'Problem loading utility script';
if ((! $err) && (! load_utils('auth','data'))) $err = 'Problem loading utility scripts';

if (! $err) { // pull in configuration so we can log other errors
  $config = config_get();
  $err = config_error($config);
}
if (! $err) {
  // grab GET parameters
  $count = (empty($_GET['count']) ? 100 : $_GET['count']);
  $index = (empty($_GET['index']) ? 0 : $_GET['index']);
  $group = (empty($_GET['group']) ? '' : $_GET['group']);
  // see if we want requests logged, and potentially do so
  $log_requests = (empty($config['log_request']) ? '' : $config['log_request']);
  $log_responses = (empty($config['log_response']) ? '' : $config['log_response']);
  if ($log_requests) log_file($_SERVER['QUERY_STRING'], $config);
  // make sure required parameters have been sent
  if (! $group ) $err = 'Parameter group required';
}
if (! $err) {
  $query = array();
  foreach($_GET as $k => $v) {
    switch($k) {
      case 'index':
      case 'count':
      case 'group':
      case 'unique': break;
      default: $query[$k] = $v;
    }
  }
  $options = array();
  $options['group'] = $group;
  $options['index'] = $index;
  $options['count'] = $count;
  $options['query'] = $query;
  $options['uid'] = auth_userid();
  $json_str = json_encode(data_search($options, $config));
}
if ($err) {
  log_file($err, $config);
  print '[]';
} else print $json_str;
if (! empty($log_responses)) log_file($json_str, $config);
