<?php

include_once(dirname(__FILE__) . '/loadutils.php');
load_utils('config','json');

if (! function_exists('data_save')) {
  function data_save($type, $media_data = array(), $userid = '', $config = array()) {
    $err = '';
    if (empty($userid)) $err = 'parameter userid required';
    if (! $err) {
      if (! $config) $config = config_get();
      $err = config_error($config);
    }
    if (! $err) {
      $id = (empty($media_data['id']) ? '' : $media_data['id']);
      if (! $id) $err = 'data must contain an id key';
    }
    if (! $err) {
      $path_data = path_concat($config['user_data_directory'], $userid);
      $media_file_json_path = path_concat($config['web_root_directory'], path_concat($path_data, 'media_' . $type . '.json'));
      $media_file_existed = file_exists($media_file_json_path);
      if ($media_file_existed) $json_str = file_get($media_file_json_path);
      else $json_str = '[]';
      if (! $json_str) $err = 'Problem loading ' . $media_file_json_path;
      else {
        $media_file_json = json_decode($json_str, TRUE);
        if (! is_array($media_file_json)) $err = 'Problem parsing ' . $media_file_json_path;
      }
    }
    if (! $err) { // search media json file for id
      $media_object = array();
      $z = sizeof($media_file_json);
      for ($i = 0; $i < $z; $i++){
        if ($media_file_json[$i]['id'] == $id) {
          $media_object = &$media_file_json[$i];
          break;
        }
      }
      if (! $media_object) array_splice($media_file_json, 0, 0, array($media_data));
      else {
        foreach($media_data as $k => $v) $media_object[$k] = $v;
      }
      $json_str = json_encode($media_file_json);
      // write file
      if (! file_put($media_file_json_path, $json_str, $config)) $err = 'Problem writing ' . $media_file_json_path;
    }
    return $err;
  }
}
if (! function_exists('data_save_mash')) {
  function data_save_mash($data = array(), $userid = '', $config = array()) {
    $err = '';
    $id = (empty($data['id']) ? '' : $data['id']);
    if (! $id) $err = 'Parameter id required';
    if (! $err) {
      $path_data = path_concat($config['user_data_directory'], $userid);
      $file_json_path = path_concat(path_concat($config['web_root_directory'], $path_data), $id . '.json');
      $json_str = json_encode($data);
      // write file
      if (! file_put($file_json_path, $json_str, $config)) $err = 'Problem writing ' . $file_json_path;
    }
    if (! $err) { // add media data to existing media json file
      $new_media = array();
      $new_media['id'] = $id;
      $new_media['label'] = (empty($data['label']) ? 'Untitled Mash' : $data['label']);
      $err = data_save('mash', $new_media, $userid, $config);
    }
    return $err;
  }
}
if (! function_exists('data_update_mash')) {
  function data_update_mash($data = array(), $userid = '', $config = array()) {
    return data_save('mash', $data, $userid, $config);
  }
}
if (! function_exists('data_save_media')) {
  function data_save_media($media_data = array(), $userid = '', $config = array()) {
    $err = '';
    if (! $err) {
      $type = (empty($media_data['type']) ? '' : $media_data['type']);
      if (! $type) $err = 'media must contain type key';
    }
    if (! $err) $err = data_save($type, $media_data, $userid, $config);
    return $err;
  }
}
if (! function_exists('data_mash')) {
  function data_mash($id = '', $userid = '', $config = array()) {
    $response = array();
    $err = '';
    if (empty($userid) || empty($id)) $err = 'parameters id, userid required';
    if (! $err) {
      if (! $config) $config = config_get();
      $err = config_error($config);
    }
    if (! $err) {
      $mash_path = path_concat(path_concat(path_concat($config['web_root_directory'], $config['user_data_directory']), $userid), $id . '.json');
      $str = file_get($mash_path);
      if (! $str) $err = 'Could not load ' . $mash_path;
    }
    if (! $err) {
      $decoded = @json_decode($str, TRUE);
      if (! $decoded) $err = 'Could not parse ' . $mash_path;
      else $response = $decoded;
    }
    if ($err) $response['error'] = $err;
    return $response;
  }
}
if (! function_exists('data_search')) {
  function data_search($options = array(), $config = array()) {
    $found_obs = array();
    $json_obs = array();
    if (! $config) $config = config_get();
    if (! config_error($config)) {
      $dir_host = $config['web_root_directory'];
      $userid = (empty($options['uid']) ? '' : $options['uid']);
      $group = (empty($options['group']) ? '' : $options['group']);
      $index = (empty($options['index']) ? 0 : $options['index']);
      $count = (empty($options['count']) ? 1000 : $options['count']);
      $query = (empty($options['query']) ? '' : $options['query']);
      if ($group) {
        switch($group) { // group parameter determines which xml file we search through
          case 'mash':
          case 'video':
          case 'audio':
          case 'image': {
            if ($userid) {
              $path = path_concat(path_concat(path_concat($dir_host, $config['user_data_directory']), $userid), 'media_' . $group . '.json');
              if (file_exists($path)) $json_obs = array_merge(json_array(file_get($path)), $json_obs);
            }
            break;
          }
        }
        if ($json_obs) {
          foreach ($json_obs as $ob){
            $ok = 1;
            if ($query){
              reset($query); // loop through all parameters
              foreach($query as $k => $v) {
                $test = (string) $ob[$k];
                // will match if parameter is empty, equal to or (for label) within attribute
                $ok = ((! $v) || ($v == $test) || ( ($k == 'label') && (strpos(strtolower($test), strtolower($v)) !== FALSE) )) ;
                if (! $ok) break;
              }
            }
            if ($ok) {
              if ($index) $index --;
              else { // only add tag if within specified range
                $found_obs[] = $ob;
                $count --;
                if (! $count) break;
              }
            }
          }
        }
      }
    }
    return $found_obs;
  }

}
