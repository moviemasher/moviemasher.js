<?php

include_once(dirname(__FILE__) . '/loadutils.php');
load_utils('config');



if (! function_exists('file_dir')) {
  function file_dir($file_path) {
    if (is_string($file_path)) {
      if (substr($file_path, -1) != '/') {
        $file_path = dirname($file_path) . '/';
      }
    }
    return $file_path;
  }
}
if (! function_exists('file_dir_delete_recursive')) {
  function file_dir_delete_recursive($path) {
    $result = FALSE;
    if ($path)
    {
      $file_prefix = '';
      if (substr($path, -1) == '*')
      {
        $file_prefix = basename($path, '*');
        $path = file_dir($path);
      }
      if (file_exists($path) && is_dir($path))
      {
        $path = path_add_slash_end($path);

        if ($handle = opendir($path))
        {
          $result = TRUE;
          while ($result && (FALSE !== ($file = readdir($handle))))
          {
            if (($file != ".") && ($file != ".."))
            {
              if ($file_prefix && (substr($file, 0, strlen($file_prefix)) != $file_prefix))
              {
                continue;
              }
              if (is_dir($path . $file))
              {
                $result = file_dir_delete_recursive($path . $file);
              }
              else
              {
                $result = @unlink($path . $file);
              }
            }
          }
          closedir($handle);
          if ((! $file_prefix) && $result) $result = @rmdir($path);
        }
      }
    }
    return $result;

  }
}
if (! function_exists('file_extension')) {
  function file_extension($url, $dont_change_case = 0) {
    $extension = '';
    if ($url)
    {
      $parsed = parse_url($url, PHP_URL_PATH);
      if ($parsed)
      {
        $extension = pathinfo($parsed, PATHINFO_EXTENSION);
        if (! $dont_change_case) $extension = strtolower($extension);
      }
    }
    return $extension;
  }
}
if (! function_exists('file_get')) {
  function file_get($path, $options = 1) {
    return @file_get_contents($path, $options);
  }
}
if (! function_exists('file_move_extension')) {
  function file_move_extension($extension, $archive_path, $media_path, $config = array()) {
    $result = FALSE;
    // make sure parameters are defined
    if ($extension && $archive_path && $media_path)
    {
      $archive_path = path_add_slash_end($archive_path);
      $media_path = path_add_slash_end($media_path);

      // make sure archive path exists
      if (file_exists($archive_path))
      {
        // make sure we have somewhere to move to
        if (file_safe($media_path, $config))
        {
          if ($handle = opendir($archive_path))
          {
            $result = TRUE;
            while ($result && (FALSE !== ($file = readdir($handle))))
            {
              if ($file != "." && $file != "..")
              {
                if (is_file($archive_path . $file))
                {
                  $ext = file_extension($archive_path . $file);
                  if ($ext == $extension) $result = file_move($archive_path . $file, $media_path . $file);
                }
              }
            }
            closedir($handle);
          }
        }
      }
    }
    return $result;
  }
}
if (! function_exists('file_move_upload')) {
  function file_move_upload($from, $to){
    return move_uploaded_file($from, $to);
  }
}
if (! function_exists('file_move')) {
  function file_move($from, $to){
    return @rename($from, $to);
  }
}
if (! function_exists('file_write_temporary')) {
  function file_write_temporary($path, $data, $config = array()){
    $result = FALSE;
    if (! $config) $config = config_get();
    if (! config_error($config)) $result = file_put(path_concat($config['temporary_directory'], $path), $data, $config);
    return $result;
  }
}
if (! function_exists('file_put')) {
  function file_put($path, $data, $config = array()) {
    $result = TRUE;
    $file_existed = file_exists($path);
    if (! $file_existed) $result = file_safe($path, $config);
    if ($result) {
      $result = @file_put_contents($path, $data);
      if (! $file_existed) {
        if ($result) $result = file_exists($path);
        if ($result) $result = file_mode($path, $config, TRUE);
      }
    }
    return $result;
  }
}
if (! function_exists('file_safe')) {
  function file_safe($path, $config = array()) {
    $result = FALSE;
    if ($path) {
      if (! $config) $config = config_get();
      if (! config_error($config)) {
        $ext = file_extension($path); // will be empty if path is directory
        $dirs = explode('/', $path);
        if ($ext) array_pop($dirs); // get rid of file name if path is file
        $to_create = array();
        $dir = join('/', $dirs);

        while ($dirs && (! file_exists($dir))) {
          $to_create[] = array_pop($dirs);
          $dir = join('/', $dirs);
        }
        $z = sizeof($to_create);
        if ($z) {
          for ($i = $z - 1; $i > -1; $i--){
            $dir .= '/' . $to_create[$i];
            $result = @mkdir($dir, octdec($config['chmod_directory_new']), TRUE);
            if ($result) $result = file_mode($dir, $config, TRUE);
            if (! $result) break;
          }
        }
        else $result = file_mode($dir, $config);
      }
    }
    return $result;
  }
}
if (! function_exists('files_in_dir')) {
  function files_in_dir($dir, $just_names = FALSE, $filter = 'files') {
    $result = FALSE;
    if ($dir && is_dir($dir))
    {
      $dir = path_add_slash_end($dir);
      if ($handle = opendir($dir))
      {
        $result = array();
        while (FALSE !== ($file = readdir($handle)))
        {
          if ($file != "." && $file != "..")
          {
            $full_path = $dir . $file;
            if (! $just_names) $file = $full_path;
            switch($filter)
            {
              case 'files':
                if (is_file($full_path)) $result[] = $file;
                break;
              case 'dirs':
                if (is_dir($full_path)) $result[] = $file;
                break;
              default:
                $result[] = $file;
            }
          }
        }
        closedir($handle);
      }
    }
    return $result;
  }
}
if (! function_exists('files_in_dir_recursive')) {
  function files_in_dir_recursive($full_path) {
    $files = array();
    if (is_dir($full_path))
    {
      if ($dh = opendir($full_path))
      {
        if (substr($full_path, -1) != '/') $full_path .= '/';
        while (($file = readdir($dh)) !== false)
        {
          if (substr($file, 0, 1) != '.')
          {
            $files = array_merge($files, files_in_dir_recursive($full_path . $file));
          }
        }
        closedir($dh);
      }
    }
    else $files[] = $full_path;
    return $files;
  }
}
if (! function_exists('file_mode')) {
  function file_mode($path, $config, $is_new = FALSE){
    $result = TRUE;
    $key = 'chmod_' . (is_dir($path) ? 'directory' : 'file');
    if ($is_new) $key .= '_new';
    if (isset($config[$key])) {
      $changing_mask = isset($config['chmod_umask']);
      if ($changing_mask) $old_mask = @umask($config['chmod_umask']);
      @chmod($path, octdec($config[$key]));
      if ($changing_mask)  @umask($old_mask);
    }
    return $result;
  }
}
