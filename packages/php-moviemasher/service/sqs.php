<?php

include_once(dirname(dirname(__FILE__)) . '/include/loadutils.php');
load_utils('auth','path','date','json','http','log');

require(dirname(dirname(__FILE__)) . '/aws/vendor/autoload.php'); // pull in aws-sdk

function sqs_client_enqueue($data, $config){
  $result = array();
  $err = '';
  $region =  (empty($config['sqs_region']) ? (empty($config['s3_region']) ? 'us-east-1' : $config['s3_region']) : $config['sqs_region']); // fallback to same region as s3 bucket
  $message_id = '';
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
    $sqs = new Aws\Sqs\SqsClient($options_array);
    $response = $sqs->sendMessage([
      'MessageBody' => json_encode($data),
      'QueueUrl' => $config['sqs_queue_url'],
    ]);
    if ($config['log_api_response']) log_file("sqs response:\n" . print_r($response, 1), $config);
    if (empty($response['MessageId'])) $err = 'Got no MessageId in sqs response';
    else $result['id'] = $response['MessageId'];
  } catch (Exception $e) {
    $err = $e->getMessage();
  }
  if ($err) $result['error'] = $err;
  return $result;
}

function sqs_client_config_error($config = array()){
  $err = '';
  if ((! $err) && empty($config['sqs_queue_url'])) $err = 'Configuration option sqs_queue_url required';
  if ((! $err) && empty($config['temporary_directory'])) $err = 'Configuration option temporary_directory required';
  return $err;
}
