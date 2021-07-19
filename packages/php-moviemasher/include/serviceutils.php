<?php

include_once(dirname(__FILE__) . '/loadutils.php');
load_utils('file','mime','config');

if (! function_exists('service_config_defaults')) {
  function service_config_defaults($config = array()){
    if (empty($config['client'])) $config['client'] = 'local';
    if (empty($config['file'])) $config['file'] = 'local';
    if (__service_load('client', $config)){
      $function_name = $config['client'] . '_client_config_defaults';
      if (function_exists($function_name)) $config = $function_name($config);
    }
    if (__service_load('file', $config)) {
      $function_name = $config['file'] . '_file_config_defaults';
      if (function_exists($function_name)) $config = $function_name($config);
    }
    return $config;
  }
}
if (! function_exists('service_config_error')) {
  function service_config_error($config = array()){
    $err = '';
    if ((! $err) && empty($config['client'])) $err = 'Configuration option client required';
    if ((! $err) && empty($config['file'])) $err = 'Configuration option file required';
    if ((! $err) && (($config['file'] == 'local') || ($config['client'] == 'local')) && ($config['client'] != $config['file'])) $err = 'Configuration option client and file must both be local if either is';
    if ((! $err) && (! __service_load('client', $config))) $err = 'Could not load client service ' . $config['client'];
    if ((! $err) && (! __service_load('file', $config))) $err = 'Could not load file service ' . $config['file'];
    if (! $err){
      $function_name = $config['client'] . '_client_config_error';
      if (function_exists($function_name)) $err = $function_name($config);
    }
    if (! $err){
      $function_name = $config['file'] . '_file_config_error';
      if (function_exists($function_name)) $err = $function_name($config);
    }
    return $err;
  }
}
if (! function_exists('service_import_init')) {
  function service_import_init($import, $config = array()){
    $result = array();
    if (! $config) $config = config_get();
    log_file(print_r($import, 1), $config);
    $err = config_error($config); // should wind up calling __service_load
    if (! $err) {
      $function_name = $config['file'] . '_file_import_init';
      if (! function_exists($function_name)) $err = $function_name . ' is not defined';
    }
    if ((! $err) && empty($import['size'])) $err = 'Import option size required';
    if ((! $err) && empty($import['file'])) $err = 'Import option file required';
    if ((! $err) && empty($import['extension'])) {
      $import['extension'] = file_extension($import['file']);
      if (! $import['extension']) $err = 'Import option extension required';
    }
    if ((! $err) && empty($import['mime'])) {
      $import['mime'] = mime_from_path($import['file']);
      if (! $import['mime']) $err = 'Import option mime required';
    }
    if ((! $err) && empty($import['type'])) {
      $import['type'] = mime_type($import['mime']);
      if (! $import['type']) $err = 'Import option type required';
      else {
        switch($import['type']) {
          case 'audio':
          case 'video':
          case 'image': break;
          default: $err = 'Import type ' . $import['type'] . ' unsupported';
        }
      }
    }
    if (! $err) { // enforce size limit from configuration, if defined
      $max = (empty($config["max_meg_{$import['type']}"]) ? '' : $config["max_meg_{$import['type']}"]);
      if ($max) {
        $file_megs = round($import['size'] / (1024 * 1024));
        if ($file_megs > $max) $err = ($import['type'] . ' files must be less than ' . $max . ' meg');
      }
    }
    if ((! $err) && empty($import['label'])) $import['label'] = $import['file'];
    //$err = $function_name;
    if (! $err) $result = $function_name($import, $config);
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('service_enqueue')) {
  function service_enqueue($data, $config = array()){
    $result = array();
    if (! $config) $config = config_get();
    $err = config_error($config); // should wind up calling __service_load
    if (! $err) {
      $function_name = $config['client'] . '_client_enqueue';
      if (function_exists($function_name)) $result = $function_name($data, $config);
      else $err = $function_name . ' is not defined';
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('service_destination')) {
  function service_destination($output, $config = array()){
    $result = array();
    if (! $config) $config = config_get();
    $err = config_error($config); // should wind up calling __service_load
    if (! $err) {
      $function_name = $config['file'] . '_file_destination';
      if (function_exists($function_name)) {
        $output['uid'] = (empty($output['uid']) ? '' : $output['uid']);
        $result = $function_name($output, $config);
      }
      else $err = $function_name . ' is not defined';
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('service_export_progress_callback')) {
  function service_export_progress_callback($payload, $config = array()){
    $result = array();
    if (! $config) $config = config_get();
    $err = config_error($config); // should wind up calling __service_load
    if (! $err) {
      $function_name = $config['client'] . '_client_export_progress_callback';
      if (! function_exists($function_name)) $function_name = '__export_progress_callback';
      $result = $function_name($payload, $config);
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('service_export_complete_callback')) {
  function service_export_complete_callback($payload, $config = array()){
    $result = array();
    if (! $config) $config = config_get();
    $err = config_error($config); // should wind up calling __service_load
    if (! $err) {
      $function_name = $config['client'] . '_client_export_complete_callback';
      if (! function_exists($function_name)) $function_name = '__export_complete_callback';
      $result = $function_name($payload, $config);
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('service_import_progress_callback')) {
  function service_import_progress_callback($payload, $config = array()){
    $result = array();
    if (! $config) $config = config_get();
    $err = config_error($config); // should wind up calling __service_load
    if (! $err) {
      $function_name = $config['client'] . '_client_import_progress_callback';
      if (! function_exists($function_name)) $function_name = '__import_progress_callback';
      $result = $function_name($payload, $config);
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('service_import_complete_callback')) {
  function service_import_complete_callback($payload, $config = array()){
    $result = array();
    if (! $config) $config = config_get();
    $err = config_error($config); // should wind up calling __service_load
    if (! $err) {
      $function_name = $config['client'] . '_client_import_complete_callback';
      if (! function_exists($function_name)) $function_name = '__import_complete_callback';
      $result = $function_name($payload, $config);
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('service_source')) {
  function service_source($input, $config = array()){
    $result = array();
    if (! $config) $config = config_get();
    $err = config_error($config); // should wind up calling __service_load
    if (! $err) {
      $function_name = $config['file'] . '_file_source';
      if (function_exists($function_name)) {
        $input['uid'] = (empty($input['uid']) ? '' : $input['uid']);
        $result = $function_name($input, $config);
      }
      else $err = $function_name . ' is not defined';
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('service_import_url')) {
  function service_import_url($input, $config = array()){
    $result = array();
    if (! $config) $config = config_get();
    $err = config_error($config); // should wind up calling __service_load
    if (! $err) {
      $function_name = $config['file'] . '_file_import_url';
      if (function_exists($function_name)) {
        $input['uid'] = (empty($input['uid']) ? '' : $input['uid']);
        $result = $function_name($input, $config);
      }
      else $err = $function_name . ' is not defined';
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('service_export_url')) {
  function service_export_url($input, $config = array()){
    $result = array();
    if (! $config) $config = config_get();
    $err = config_error($config); // should wind up calling __service_load
    if (! $err) {
      $function_name = $config['file'] . '_file_export_url';
      if (function_exists($function_name)) {
        $input['uid'] = (empty($input['uid']) ? '' : $input['uid']);
        $result = $function_name($input, $config);
      }
      else $err = $function_name . ' is not defined';
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('service_export_base_source')) {
  function service_export_base_source($config = array()){
    $result = array();
    if (! $config) $config = config_get();
    $err = config_error($config); // should wind up calling __service_load
    if (! $err) {
      $function_name = $config['file'] . '_file_export_base_source';
      if (function_exists($function_name)) { // optional method
        $result = $function_name($config);
      }
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}

function __export_progress_callback($payload, $config){
  return auth_data(array(
    'host' => $config['callback_host'],
    'type' => $config['callback_protocol'],
    'trigger' => 'progress',
    'method' => 'PUT',
    'path' => path_concat($config['callback_directory'], 'export/callback'),
    'data' => $payload,
  ), $config);
}
function __export_complete_callback($payload, $config){
  return auth_data(array(
    'host' => $config['callback_host'],
    'type' => $config['callback_protocol'],
    'trigger' => 'complete',
    'method' => 'POST',
    'path' => path_concat($config['callback_directory'], 'export/callback'),
    'data' => $payload,
  ), $config);
}
function __import_progress_callback($payload, $config){
  return auth_data(array(
    'host' => $config['callback_host'],
    'type' => $config['callback_protocol'],
    'trigger' => 'progress',

    'method' => 'PUT',
    'path' => path_concat($config['callback_directory'], 'import/callback'),
    'data' => $payload,
  ), $config);
}
function __import_complete_callback($payload, $config){
  return auth_data(array(
    'host' => $config['callback_host'],
    'type' => $config['callback_protocol'],
    'trigger' => 'complete',
    'method' => 'POST',
    'path' => path_concat($config['callback_directory'], 'import/callback'),
    'data' => $payload,
  ), $config);
}


function __service_load($file_or_client, $config){
  return @include_once(dirname(__DIR__) . '/service/' . $config[$file_or_client] . '.php');
}
