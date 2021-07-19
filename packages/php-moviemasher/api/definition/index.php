<?php

$err = '';
$config = array();

if (! @include_once(dirname(dirname(dirname(__DIR__))) . '/include/loadutils.php')) {
  $err = 'Problem loading utility script';
}
if ((! $err) && (! load_utils('auth', 'data', 'cors'))) $err = 'Problem loading utility scripts';

if (! $err) { // pull in configuration so we can log other errors
  cors_headers();
  $config = config_get();
  $err = config_error($config);
}
if (! $err) {
  switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET': {
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
      break;
    }
    case 'POST': {
      # code...
      break;
    }
  }


  // $json_str = json_encode($config);
}
if ($err) {
  $config["error"] = $err;
  $json_str = json_encode($config);
}
print $json_str;
