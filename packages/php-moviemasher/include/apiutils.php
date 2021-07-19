<?php

include_once(dirname(__FILE__) . '/loadutils.php');
load_utils('auth','id','float','log','mime','service');

if (! function_exists('api_export')) {
  function api_export($input = array(), $output = array(), $config = array()) {
    $result = array();
    if (! $config) $config = config_get();
    $result['error'] = config_error($config);
    // create export job
    if (empty($result['error'])) $result = api_job_export($input, $output, $config);
    // queue job
    if (empty($result['error'])) $result = api_queue_job($result, $config);
    return $result;
  }
}
if (! function_exists('api_import')) {
  function api_import($input = array(), $output = array(), $config = array()) {
    $result = array();
    if (! $config) $config = config_get();
    $result['error'] = config_error($config);
    // create import job
    if (empty($result['error'])) $result = api_job_import($input, $output, $config);
    // queue job
    if (empty($result['error'])) $result = api_queue_job($result, $config);
    return $result;
  }
}
if (! function_exists('api_import_data')) {
  function api_import_data($response = array(), $config = array()) {
    $media_data = array();
    if (! $config) $config = config_get();
    $err = config_error($config);
    if (! $err) {
      $id = (empty($response['id']) ? '' : $response['id']);
      $uid = (empty($response['uid']) ? '' : $response['uid']);
      if (! ($id && $uid)) $err = 'Parameters id, uid required';
    }
    if (! $err) { // pull in other configuration and check for required input
      $import_video_rate = $config['import_video_rate'];
      $import_extension = $config['import_extension'];
      $media_url = service_import_url($response, $config);
      //log_file('api_import_data ' . $media_url . ' ' . print_r($response, 1), $config);
    }
    if (! $err) {
      $media_extension = (empty($response['extension']) ? '' : $response['extension']);
      $type = (empty($response['type']) ? '' : $response['type']);
      switch ($type) {
        case 'image': {
          $import_video_rate = '1';
          $import_extension = $media_extension;
          break;
        }
        case 'video':
        case 'audio': break;
        default: {
          $err = 'could not determine type of preprocessed upload';
        }
      }
      if (! ($import_extension && $type)) $err = 'Could not determine type and extension';
    }
    if (! $err) {
      $duration = (empty($response['duration']) ? '' : $response['duration']);
      $label = (empty($response['label']) ? '' : $response['label']);
      $media_data['id'] = $id;
      $media_data['label'] = $label;
      // add source with original for rendering
      $media_data['source'] = path_concat(path_concat($media_url, $id), $config['import_original_basename'] . '.' . $media_extension);
      $frame_path = path_concat(path_concat($media_url, $id), $config['import_dimensions'] . 'x' . $import_video_rate);
      $audio = 1;
      $did_icon = 0;
      $did_url = 0;
      switch($type) {
        case 'image': {
          $frame_path = path_concat($frame_path, '0.' . $import_extension);
          $media_data['url'] = $frame_path;
          $media_data['icon'] = $frame_path;
          break;
        }
        case 'video': {
          $audio = ! ((empty($response['no_audio']) || ('false' == $response['no_audio'])) ? '' : $response['no_audio']);
          $video = ! ((empty($response['no_video']) || ('false' == $response['no_video'])) ? '' : $response['no_video']);
          if ($video) {
            $frames = floor($duration * $import_video_rate);
            $zero_padding = strlen($frames);
            $media_data['url'] = path_add_slash_end($frame_path);
            $media_data['fps'] = $import_video_rate;
            $media_data['pattern'] = '%.' . $import_extension;
            $media_data['icon'] = path_concat($frame_path, str_pad(ceil($frames / 2), $zero_padding, '0', STR_PAD_LEFT) . '.' . $import_extension);
            $did_icon = 1;
          } else {
            $type = 'audio';
            $did_url = 1;
            $media_data['url'] = path_concat(path_concat($media_url, $id), $config['import_audio_basename'] . '.' . $config['import_audio_extension']);
          }
          // intentional fall through to audio
        }
        case 'audio': {
          if (! $duration) $err = 'Could not determine duration';
          else {
            $media_data['duration'] = $duration;
            if ($audio) {
              if (! $did_url) $media_data['audio'] = path_concat(path_concat($media_url, $id), $config['import_audio_basename'] . '.' . $config['import_audio_extension']);
              $media_data['wave'] = path_concat(path_concat($media_url, $id), $config['import_waveform_basename'] . '.' . $config['import_waveform_extension']);
              if (! $did_icon) $media_data['icon'] = $media_data['wave'];
            } else $media_data['audio'] = '0'; // put in a zero to indicate that there is no audio
          }
          break;
        }
      }
      $media_data['group'] = $media_data['type'] = $type;
    }
    if ($err) $media_data['error'] = $err;
    return $media_data;
  }
}
if (! function_exists('api_export_data')) {
  function api_export_data($response = array(), $config = array()) {
    $export_data = array();
    if (! $config) $config = config_get();
    $err = config_error($config);
    if (! $err) {
      $id = (empty($response['id']) ? '' : $response['id']);
      $job = (empty($response['job']) ? '' : $response['job']);
      $uid = (empty($response['uid']) ? '' : $response['uid']);
      $type = (empty($response['type']) ? '' : $response['type']);
      $extension = (empty($response['extension']) ? '' : $response['extension']);
      if (! ($id && $extension && $type && $job && $uid)) $err = 'Parameters uid, job, id, extension, type required';
    }
    if (! $err) { // pull in other configuration and check for required input
      $media_url = service_export_url($response, $config);
      $export_data['id'] = $id;
      $export_data['source'] = path_concat(path_concat($media_url, $id), (empty($config["export_{$type}_basename"]) ? $job : $config["export_{$type}_basename"]) . '.' . $extension);
    }
    if ($err) $export_data['error'] = $err;
    return $export_data;
  }
}
if (! function_exists('api_job_export')) {
  function api_job_export($input = array(), $output = array(), $config = array()) {
    $result = array();
    if (! $config) $config = config_get();
    $err = config_error($config);
    if (! $err) { // pull in other configuration and check for required input
      // make sure required input parameters have been set
      $id = (empty($input['id']) ? '' : $input['id']);
      $input_mash = (empty($input['mash']) ? array() : $input['mash']);
      if (! ($id && $input_mash)) $err = 'Required input parameters omitted';
    }
    if (! $err) { // try to analyze mash
      $about_mash = __api_about_mash($input_mash);
      if (! empty($about_mash['error'])) {
        //log_file(print_r($about_mash, 1), $config);
        $err = $about_mash['error'];
      } else if (! $about_mash['duration']) $err = 'Mash has no duration';
    }
    if (! $err) { // build inputs and job request
      $inputs = array();
      $type = ($about_mash['has_video'] ? 'video' : 'audio');
      $input_mash = array('type' => 'mash', 'mash' => $input_mash);
      $inputs[] = $input_mash;
      $output['type'] = $type;
      $output['has_audio'] = $about_mash['has_audio'];
      $output['has_video'] = $about_mash['has_video'];
      $output['id'] = $id;
      $output['title'] = $about_mash['label'];
      $result = api_job_render($inputs, $output, $config);
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('api_job_render')) {
  function api_job_render($inputs, $output, $config) {
    $result = array('inputs' => $inputs, 'outputs' => array());
    if (! $config) $config = config_get();
    $err = config_error($config);
    if (! $err) { // pull in other configuration and check for required input
      // make sure required output parameters have been set
      $id = (empty($output['id']) ? '' : $output['id']);
      if (! ($id)) $err = 'Required output parameters omitted';
    }
    if (! $err) {
      $type = (empty($output['type']) ? 'video' : $output['type']);
      $title = (empty($output['title']) ? '' : $output['title']);
      if ($type == 'video') {
        $export_extension = $config['export_extension'];
        $export_audio_codec = $config['export_audio_codec'];
      } else {
        $type = 'audio';
        $export_extension = $config['export_audio_extension'];
        $export_audio_codec = $config['export_audio_codec_audio'];
      }
      if (empty($output['uid'])) $output['uid'] = auth_userid();
      $result['destination'] = service_destination($output, $config);
      $base_source = service_export_base_source($config);
      if ($base_source) $result['base_source'] = $base_source;
      //log_file('BASE_SOURCE: ' . print_r($base_source, 1), $config);
      $progress_callback_payload = array('job' => '{job.id}', 'progress' => '{job.progress}');
      $complete_callback_payload = array(
        'job' => '{job.id}',
        'id' => $id,
        'uid' => $output['uid'],
        'type' => $type,
        'extension' => $export_extension,
        'error' => '{job.error}',
        'log' => '{job.log}',
        'commands' => '{job.commands}',
        'stream' => '{job.outputs.0.stream}',
      );
      if (! empty($output['include_progress'])) $result['callbacks'][] = service_export_progress_callback($progress_callback_payload, $config);
      if (! empty($output['include_complete'])) $result['callbacks'][] = service_export_complete_callback($complete_callback_payload, $config);
      // add Output for rendered video or audio file, with no transfer tag of its own
      $job_output = array('type' => $type, 'required' => 1);
      $job_output['extension'] = $export_extension;
      $job_output['name'] = (empty($config["export_{$type}_basename"]) ? '{job.id}' : $config["export_{$type}_basename"]);
      if ($config['export_meta_title'] && $title) $job_output['metadata'] = $config['export_meta_title'] . '="' . $title . '"';
      if ($type == 'video') {
        $job_output['video_codec'] = $config['export_video_codec'];
        $job_output['video_bitrate'] = $config['export_video_bitrate'];
        $job_output['video_rate'] = $config['export_video_rate'];
        $job_output['dimensions'] = $config['export_dimensions'];
      }
      else $job_output['no_video'] = '1';
      $job_output['audio_codec'] = $export_audio_codec;
      $job_output['audio_bitrate'] = $config['export_audio_bitrate'];
      $job_output['audio_rate'] = $config['export_audio_rate'];
      $result['outputs'][] = $job_output;
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('api_job_import')) {
  function api_job_import($input = array(), $output = array(), $config = array()) {
    $result = array('callbacks' => array(), 'inputs' => array(), 'outputs' => array());
    if (! $config) $config = config_get();
    $err = config_error($config);

    if (! $err) { // check for required input

      if (empty($input['uid'])) $input['uid'] = auth_userid();

      // make sure required input parameters have been set
      $id = (empty($input['id']) ? '' : $input['id']);
      $extension = (empty($input['extension']) ? '' : $input['extension']);
      $type = (empty($input['type']) ? mime_type_from_extension($extension) : $input['type']);
      $label = (empty($input['label']) ? $id : $input['label']);
      if (! ($id && $extension && $type)) $err = 'Required parameter omitted';
    }
    if (! $err) { // create job for transcoder
      $input_tag = array('type' => $type);
      if ($type != 'audio') $input_tag['fill'] = 'none';
      // DESTINATION
      $result['destination'] = service_destination($input, $config);
      // CALLBACKS
      $progress_callback_payload = array(
        'job' => '{job.id}',
        'progress' => '{job.progress}',
      );
      $complete_callback_payload = array(
        'job' => '{job.id}',
        'id' => $id,
        'uid' => $input['uid'],
        'extension' => $extension,
        'type' => $type,
        'label' => $label,
        'error' => '{job.error}',
        'log' => '{job.log}',
        'commands' => '{job.commands}',
        'no_audio' => '{job.inputs.0.no_audio}',
        'no_video' => '{job.inputs.0.no_video}',
      );
      if ('image' != $type) $complete_callback_payload['duration'] = '{job.duration}';
      if (! empty($output['include_progress'])) $result['callbacks'][] = service_import_progress_callback($progress_callback_payload, $config);
      if (! empty($output['include_complete'])) $result['callbacks'][] = service_import_complete_callback($complete_callback_payload, $config);
      $input_tag['source'] = service_source($input, $config);
      $result['inputs'][] = $input_tag;
      // OUTPUTS
      if ($type == 'image') {
        // add output for image file
        $result['outputs'][] = array(
          'type' => 'image',
          'name' => '0',
          'path' => $config['import_dimensions'] . 'x1',
          'dimensions' => $config['import_dimensions'],
          'extension' => $extension,
          'quality' => $config['import_image_quality'],
        );
      }
      else {
        // add output for audio/video file
        $result['outputs'][] = array(
          'type' => 'audio',
          'precision' => 0,
          'audio_bitrate' => $config['import_audio_bitrate'],
          'name' => $config['import_audio_basename'],
          'extension' => $config['import_audio_extension'],
          'audio_rate' => $config['import_audio_rate'],
        );


        // add output for waveform file
        $result['outputs'][] = array(
          'type' => 'waveform',
          'forecolor' => $config['import_waveform_forecolor'],
          'backcolor' => $config['import_waveform_backcolor'],
          'name' => $config['import_waveform_basename'],
          'dimensions' => $config['import_waveform_dimensions'],
          'extension' => $config['import_waveform_extension'],
        );
      }
      if ($type == 'video') {
        // add output for sequence files
        $result['outputs'][] = array(
          'type' => 'sequence',
          'video_rate' => $config['import_video_rate'],
          'quality' => $config['import_image_quality'],
          'extension' => $config['import_extension'],
          'dimensions' => $config['import_dimensions'],
          'path' => '{output.dimensions}x{output.video_rate}',
        );
      }
    }
    if ($err) $result['error'] = $err;
    return $result;
  }
}
if (! function_exists('api_progress_completed')) {
  function api_progress_completed($progress = array()){
    $completed = 0;
    $completings = 0;
    if (is_array($progress)) {
      foreach($progress as $k => $v){
        if ('ing' == substr($k, -3)) $completings += $v;
        else $completed += $v;
      }
    }
    return ($completings ? $completed / $completings : 0);
  }
}
if (! function_exists('api_queue_job')) {
  function api_queue_job($data, $config = array()) {
    $result = array();
    if (! $config) $config = config_get();
    $result['error'] = config_error($config);
    // queue job
    if (empty($result['error'])) {
      if ($config['log_api_request']) log_file("{$config['client']} request:\n" . json_encode($data), $config);
      // post job to the Transcoder
      $result = service_enqueue($data, $config);
      if (empty($result['error']) && empty($result['id'])) $result['error'] = 'Got no Job ID';
    }
    return $result;
  }
}
function __api_about_mash($mash){
  $result = array('error' => '', 'duration' => 0, 'has_audio' => 0, 'has_video' => 0, 'label' => '');
  if (empty($mash)) $result['error'] = 'mash is empty';
  if (! $result['error']) {
    $types = array('audio', 'video');
    $media = (empty($mash['media']) ? array() : $mash['media']);
    $medias = array();
    foreach($media as $m) $medias[$m['id']] = $m;
    $quantize = (empty($mash['quantize']) ? 10 : $mash['quantize']);
    if (! empty($mash['label'])) $result['label'] = $mash['label'];
    foreach($types as $type){
      $tracks = (empty($mash[$type]) ? array() : $mash[$type]);
      $y = sizeof($tracks);
      for ($j = 0; $j < $y; $j++) {
        $track = $tracks[$j];
        $z = sizeof($track['clips']);
        for ($i = 0; $i < $z; $i++){
          $clip = $track['clips'][$i];
          $media = (empty($medias[$clip['id']]) ? $clip : $medias[$clip['id']]);
          $media_type = (empty($media['type']) ? '' : $media['type']);
          switch($media_type){
            case 'audio':
              if (__api_clip_has_audio($clip, $media)) $result['has_audio'] = true;
              else continue; // completely ignore muted audio
              break;
            case 'video':
              if (__api_clip_has_audio($clip, $media)) $result['has_audio'] = true;
              // fall through to default, for visuals
            default:
              $result['has_video'] = true;
              break;
          }
          $result['duration'] = max($result['duration'], ($clip['frame'] + $clip['frames']) / $quantize);
        }
      }
    }
  }
  return $result;
}
function __api_clip_has_audio($clip, $media){
  $has = FALSE;
  $url = '';
  $type = $media['type'];
  switch($type){
    case 'audio': {
      $url = (empty($media['url']) ? (empty($media['source']) ? '' : $media['source']) : $media['url']);
      break;
    }
    case 'video': {
      $url = (isset($media['audio']) ? ((0 === $media['audio']) ? '' : $media['audio']) : (empty($media['url']) ? (empty($media['source']) ? '' : $media['source']) : $media['url']));
      break;
    }
  }
  if ($url) {
    $has = ! isset($clip['gain']);
    if (! $has) $has = ! __api_gain_mutes($clip['gain']);
  }
  return $has;
}
function __api_gain_mutes($gain){
  if (strpos($gain, ',') !== FALSE) {
    $does_mute = TRUE;
    $gains = explode(',', $gain);
    $z = sizeof($gains) / 2;
    for ($i = 0; $i < $z; $i++){
      $does_mute = float_cmp(floatval($gains[1 + $i * 2]), FLOAT_ZERO);
      if (! $does_mute) break;
    }
  } else $does_mute = float_cmp(floatval($gain), FLOAT_ZERO);
  return $does_mute;
}
