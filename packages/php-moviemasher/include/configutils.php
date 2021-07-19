<?php

// A convenient place to suppress errors and avoid corrupt json responses
ini_set('display_errors', 0);

include_once(dirname(__FILE__) . '/loadutils.php');
load_utils('service','http','log','path');

if (! function_exists('config_defaults')) {
  function config_defaults($config = array()) {
    $config['authentication'] =  (empty($config['authentication']) ? '' : $config['authentication']);
    $config['authentication_callback_mode'] =  (empty($config['authentication_callback_mode']) ? 'http' : $config['authentication_callback_mode']);
    $config['aws_access_key_id'] =  (empty($config['aws_access_key_id']) ? '' : $config['aws_access_key_id']);
    $config['aws_secret_access_key'] =  (empty($config['aws_secret_access_key']) ? '' : $config['aws_secret_access_key']);
    $config['export_audio_codec_audio'] = (empty($config['export_audio_codec_audio']) ? 'libmp3lame' : $config['export_audio_codec_audio']);
    $config['export_audio_bitrate'] = (empty($config['export_audio_bitrate']) ? '128' : $config['export_audio_bitrate']);
    $config['export_audio_codec'] = (empty($config['export_audio_codec']) ? 'aac' : $config['export_audio_codec']);
    $config['export_audio_extension'] = (empty($config['export_audio_extension']) ? 'mp3' : $config['export_audio_extension']);
    $config['export_audio_rate'] = (empty($config['export_audio_rate']) ? '44100' : $config['export_audio_rate']);
    $config['export_dimensions'] = (empty($config['export_dimensions']) ? '512x288' : $config['export_dimensions']);
    $config['export_extension'] = (empty($config['export_extension']) ? 'mp4' : $config['export_extension']);
    $config['export_video_rate'] = (empty($config['export_video_rate']) ? '30' : $config['export_video_rate']);
    $config['export_meta_title'] = (empty($config['export_meta_title']) ? '' : $config['export_meta_title']);
    $config['export_video_bitrate'] = (empty($config['export_video_bitrate']) ? '2000' : $config['export_video_bitrate']);
    $config['export_video_codec'] = (empty($config['export_video_codec']) ? 'libx264' : $config['export_video_codec']);
    $config['web_root_directory'] = (empty($config['web_root_directory']) ? $_SERVER['DOCUMENT_ROOT'] : $config['web_root_directory']);
    $config['temporary_directory'] = (empty($config['temporary_directory']) ? sys_get_temp_dir() : $config['temporary_directory']);
    $config['queue_directory'] = (empty($config['queue_directory']) ? path_concat($config['temporary_directory'], 'queue') : $config['queue_directory']);
    $config['import_audio_bitrate'] = (empty($config['import_audio_bitrate']) ? '128' : $config['import_audio_bitrate']);
    $config['import_audio_extension'] = (empty($config['import_audio_extension']) ? 'mp3' : $config['import_audio_extension']);
    $config['import_audio_basename'] = (empty($config['import_audio_basename']) ? 'audio' : $config['import_audio_basename']);
    $config['import_audio_rate'] = (empty($config['import_audio_rate']) ? '44100' : $config['import_audio_rate']);
    $config['import_dimensions'] = (empty($config['import_dimensions']) ? '256x144' : $config['import_dimensions']);
    $config['import_extension'] = (empty($config['import_extension']) ? 'jpg' : $config['import_extension']);
    $config['import_video_rate'] = (empty($config['import_video_rate']) ? '10' : $config['import_video_rate']);
    $config['import_image_quality'] = (empty($config['import_image_quality']) ? '1' : $config['import_image_quality']);
    $config['import_original_basename'] = (empty($config['import_original_basename']) ? 'original' : $config['import_original_basename']);
    $config['import_waveform_backcolor'] = (empty($config['import_waveform_backcolor']) ? 'FFFFFF' : $config['import_waveform_backcolor']);
    $config['import_waveform_basename'] = (empty($config['import_waveform_basename']) ? 'waveform' : $config['import_waveform_basename']);
    $config['import_waveform_dimensions'] = (empty($config['import_waveform_dimensions']) ? '8000x32' : $config['import_waveform_dimensions']);
    $config['import_waveform_extension'] = (empty($config['import_waveform_extension']) ? 'png' : $config['import_waveform_extension']);
    $config['import_waveform_forecolor'] = (empty($config['import_waveform_forecolor']) ? '000000' : $config['import_waveform_forecolor']);
    $config['user_media_host'] = (empty($config['user_media_host']) ? $_SERVER['HTTP_HOST'] : http_get_contents($config['user_media_host']));
    $config['callback_host'] = (empty($config['callback_host']) ? $_SERVER['HTTP_HOST'] : http_get_contents($config['callback_host']));
    $config['log_request'] = (empty($config['log_request']) ? '' : $config['log_request']);
    $config['log_response'] = (empty($config['log_response']) ? '' : $config['log_response']);
    $config['log_api_request'] = (empty($config['log_api_request']) ? '' : $config['log_api_request']);
    $config['log_api_response'] = (empty($config['log_api_response']) ? '' : $config['log_api_response']);
    $config['max_meg_audio'] = (empty($config['max_meg_audio']) ? '' : $config['max_meg_audio']);
    $config['max_meg_image'] = (empty($config['max_meg_image']) ? '' : $config['max_meg_image']);
    $config['max_meg_video'] = (empty($config['max_meg_video']) ? '' : $config['max_meg_video']);
    $config['log_file'] = (empty($config['log_file']) ? '' : $config['log_file']);
    $config['callback_directory'] = (empty($config['callback_directory']) ? substr(dirname(dirname(__FILE__)), strlen(path_add_slash_end($config['web_root_directory']))) : $config['callback_directory']);
    $config['install_directory'] = (empty($config['install_directory']) ? substr(dirname(dirname(dirname(__FILE__))), strlen(path_add_slash_end($config['web_root_directory']))) : $config['install_directory']);
    $config['callback_protocol'] = (empty($config['callback_protocol']) ? 'http' : $config['callback_protocol']);
    $config['cgi_directory'] = (empty($config['cgi_directory']) ? substr(dirname(dirname(__FILE__)), strlen(path_add_slash_end(path_concat($config['web_root_directory'], $config['install_directory'])))) : $config['cgi_directory']);
    $config['user_media_directory'] = (isset($config['user_media_directory']) ? $config['user_media_directory'] : path_concat(substr(dirname(dirname(dirname(__FILE__))), strlen(path_add_slash_end(path_concat($config['web_root_directory'], $config['install_directory'])))), 'user'));
    $config['user_media_url'] = (isset($config['user_media_url']) ? $config['user_media_url'] : $config['user_media_directory']);
    $config['user_media_protocol'] = (empty($config['user_media_protocol']) ? 'http' : $config['user_media_protocol']);
    $config['user_data_directory'] = (isset($config['user_data_directory']) ? $config['user_data_directory'] : path_concat(substr(dirname(dirname(dirname(__FILE__))), strlen(path_add_slash_end($config['web_root_directory']))), 'user'));
    $config['s3_bucket'] = (empty($config['s3_bucket']) ? '' : $config['s3_bucket']);
    $config['s3_region'] = (empty($config['s3_region']) ? '' : $config['s3_region']);
    $config['sqs_queue_url'] = (empty($config['sqs_queue_url']) ? '' : $config['sqs_queue_url']);
    $config['chmod_directory_new'] = (isset($config['chmod_directory_new']) ? $config['chmod_directory_new'] : '0775');
    $config = service_config_defaults($config);
    ksort($config);
    return $config;
  }
}
if (! function_exists('config_error')) {
  function config_error($config) {
    $err = '';
    $exception = 'http://169.254.169.254/latest/meta-data/public-hostname'; // for retrieving current EC2 Public DNS Name
    if (! $config) $config = config_get();
    if (! $config) $err = 'Problem getting configuration';
    if (! $err) {
      if ((! empty($config['user_media_host'])) && (strpos($config['user_media_host'], '/') !== FALSE) && ($config['user_media_host'] != $exception)) $err = 'Configuration option user_media_host cannot contain slashes';
    }

    if (! $err) {
      if ((! empty($config['callback_host'])) && (strpos($config['callback_host'], '/') !== FALSE) && ($config['callback_host'] != $exception)) $err = 'Configuration option callback_host cannot contain slashes';
    }
    if (! $err) $err = service_config_error($config);
    return $err;
  }
}
if (! function_exists('config_get')) {
  function config_get() {
    // this constant can be defined before calling this method to easily override
    if (! defined('MM_INI_FILE')) {
      $path = $_ENV['MM_INI_FILE'] ? $_ENV['MM_INI_FILE'] : 'moviemasher.ini';
      define('MM_INI_FILE', $path);
    }
    $config = @parse_ini_file(MM_INI_FILE);
    if (! $config) $config = array();
    else $config = config_defaults($config);
    return $config;
  }
}
if (! function_exists('config_path')) {
  function config_path($input, $char = '/') {
    if ($input && (strpos($input, '?') === FALSE) && (substr($input, - strlen($char)) != $char)) $input .= $char;
    return $input;
  }
}
