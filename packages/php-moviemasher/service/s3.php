<?php

include_once(dirname(dirname(__FILE__)) . '/include/loadutils.php');
load_utils('id','date','path','log');

require(dirname(dirname(__FILE__)) . '/aws/vendor/autoload.php'); // pull in aws-sdk

function s3_file_source($input, $config){
  return array(
    'name' => $config['import_original_basename'],
    'extension' => $input['extension'],
    'type' => $config['user_media_protocol'],
    'host' => $config['user_media_host'],
    'path' => path_concat(path_concat($config['user_media_url'], $input['uid']), $input['id']),
  );
}
function s3_file_import_url($import, $config){
  $uid = (empty($import['uid']) ? '' : $import['uid']);
  return path_concat($config['user_media_protocol'] . '://' . $config['user_media_host'], path_concat($config['user_media_url'], $uid));
}
function s3_file_export_url($import, $config){
 return s3_file_import_url($import, $config);
}
function s3_file_config_defaults($config){
  if (empty($config['s3_acl'])) $config['s3_acl'] = 'public-read';
  if (empty($config['s3_expires'])) $config['s3_expires'] = '+ 1 hour';
  if (empty($config['s3_region'])) $config['s3_region'] = '';
  return $config;
}
function s3_file_config_error($config = array()){
  $err = '';
  if ((! $err) && empty($config['s3_bucket'])) $err = 'Configuration option s3_bucket required';
  if ((! $err) && empty($config['user_media_host'])) $err = 'Configuration option user_media_host required';
  if (! $err){
    if (substr($config['user_media_host'], 0, strlen($config['s3_bucket'])) != $config['s3_bucket']) {
      if (empty($config['user_media_url'])) $err = 'Configuration option user_media_url required if user_media_host does not begin with s3_bucket';
      else if (substr($config['user_media_url'], 0, strlen($config['s3_bucket'])) != $config['s3_bucket']) {
        $err = 'Either user_media_host or user_media_url must begin with s3_bucket';
      }
    }
  }
  return $err;
}

function s3_file_destination($output, $config, $prefix = 's3'){
  return array(
    'type' => $prefix,
    'bucket' => $config[$prefix . '_bucket'],
    'region' => $config[$prefix . '_region'],
    'path' => path_concat(path_concat($config['user_media_directory'], $output['uid']), $output['id']),
  );
}
function s3_file_import_init($import, $config) {
    $response = array();
    $err = '';
    if (! $err){
    $response['api'] = array();
    $response['data'] = array();
    $response['method'] = 'post';

    $id = id_unique();
    $bucket = $config['s3_bucket'];
    $region = ($config['s3_region'] ? $config['s3_region'] : 'us-east-1');
    $key = path_strip_slash_start($config['user_media_directory']);
    // remove bucket name from url if it's there
    if (substr($key, 0, strlen($bucket)) == $bucket) $key = substr($key, strlen(path_add_slash_end($bucket)));
    $key = path_concat(path_concat(path_concat($key, $import['uid']), $id), $config['import_original_basename'] . '.' . $import['extension']);
    $options_array = array(
      'version' => 'latest',
      'region'  => $region
    );
    if ($config['aws_secret_access_key'] && $config['aws_access_key_id']) {
      $options_array['credentials'] = array();
      $options_array['credentials']['key'] = $config['aws_access_key_id'];
      $options_array['credentials']['secret'] = $config['aws_secret_access_key'];
    }
    try {
      $s3 = new Aws\S3\S3Client($options_array);
      $formInputs = ['acl' => $config['s3_acl'], 'key' => $key];
      if (! $config['aws_access_key_id']) {
        $credentials = $s3->getCredentials()->wait();
        $formInputs['X-Amz-Security-Token'] = $credentials->getSecurityToken();
      }
      $conditions = [['bucket' => $config['s3_bucket']]];
      $expiration = date(DATE_FORMAT_TIMESTAMP, time() + 5 * 60);
      foreach($formInputs as $k => $v) $conditions[] = [$k => $v];
      $postObject = new \Aws\S3\PostObjectV4(
          $s3,
          $config['s3_bucket'],
          $formInputs,
          $conditions,
          $expiration
      );
      $response['data'] = $postObject->getFormInputs();
      $response['endpoint'] = $postObject->getFormAttributes()['action'];
    } catch (Exception $e) {
      $err = $e->getMessage();
    }
    // data key children all become part of the POST file upload request
    $response['api']['id'] = $id;
    $response['api']['type'] = $import['type'];
    $response['api']['extension'] = $import['extension'];
    $response['api']['label'] = $import['label'];
  }
  if ($err) $response['error'] = $err;
  return $response;
}
