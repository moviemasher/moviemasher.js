<?php

include_once(dirname(__FILE__) . '/loadutils.php');
load_utils('file');

if (! function_exists('http_is_url')) {
  function http_is_url($url) {
    return ('http' == substr($url, 0, 4));
  }
}
if (! function_exists('http_execute_array')) {
  function http_execute_array($ch) {
    $result = array('error' => '', 'result' => '', 'status' => '');
    $result['result'] = curl_exec($ch);
    $result['info'] = curl_getinfo($ch);
    if (! empty($result['info']['http_code'])) {
      $result['status'] = $result['info']['http_code'];
      if ($result['status'] >= 400) $result['error'] = 'Received status code ' . $result['info']['http_code'];
    }
    if (empty($result['error'])) $result['error'] = curl_error($ch);
    return $result;
  }
}
if (! function_exists('http_get_contents')) {
  function http_get_contents($url) {
    if (http_is_url($url)) {
      $result = http_retrieve($url);
      if (! $result['error']) $url = $result['result'];
      else $url = '';
    }
    return $url;
  }
}
if (! function_exists('http_retrieve')) {
  function http_retrieve($url, $headers = array(), $options = array()) {
    $result = array('error' => 'HTTP Failure', 'result' => '', 'status' => '');
    $ch = curl_init($url);
    if ($ch) {
      $options[CURLOPT_RETURNTRANSFER] = 1;
      http_set_options($ch, $options, $headers);
      $result = http_execute_array($ch);
      $result['options'] = $options;
      curl_close($ch);
    }
    return $result;
  }
}
if (! function_exists('http_send')) {
  function http_send($url, $data, $headers = array(), $options = array()) {
    // $data can be string or array
    $result = array('error' => 'HTTP Failure', 'result' => '', 'status' => '');
    $ch = curl_init($url);
    if ($ch) {
      $options[CURLOPT_RETURNTRANSFER] = 1;
      if ($data) {
        $options[CURLOPT_POST] = 1;

        if (is_array($data)) {
          $a = array();
          foreach($data as $k => $v) {
            $a[] = urlencode($k) . '=' . urlencode($v);
          }
          $data = join('&', $a);
        }
        $options[CURLOPT_POSTFIELDS] = $data;
      }
      http_set_options($ch, $options, $headers);
      $result = http_execute_array($ch);
      $result['options'] = $options;
      curl_close($ch);
    }
    return $result;
  }
}
if (! function_exists('http_set_options')) {
  function http_set_options($ch, $options = array(), $headers = array()) {
    if (is_array($headers)) {
      $a = array();
      foreach($headers as $k => $v) {
        $a[] = "$k: $v";
      }
      $options[CURLOPT_HTTPHEADER] = $a;
    }
    if (! isset($options[CURLINFO_HEADER_OUT])) curl_setopt($ch, CURLINFO_HEADER_OUT, TRUE);
    if (! isset($options[CURLOPT_SSL_VERIFYPEER])) curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    if (! isset($options[CURLOPT_SSL_VERIFYHOST])) curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
    //if (! isset($options[CURLOPT_SSLVERSION])) curl_setopt($ch, CURLOPT_SSLVERSION, 3);
    if (! isset($options[CURLOPT_TIMEOUT])) curl_setopt($ch, CURLOPT_TIMEOUT, 600);
    if (! isset($options[CURLOPT_FAILONERROR])) curl_setopt($ch,CURLOPT_FAILONERROR, FALSE);
    if (! isset($options[CURLOPT_USERAGENT])) curl_setopt($ch,CURLOPT_USERAGENT, 'Movie Masher');
    foreach($options as $k => $v) {
      curl_setopt($ch, $k, $v);
    }
  }
}

