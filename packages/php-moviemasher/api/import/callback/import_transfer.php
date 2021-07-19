<?php /*
This script receives the encoded asset from Movie Masher Server as an archive file in $_FILES. The
file is extracted with archiveutils.php and selected files in archive are moved to the directory
named $id in the upload directory.
If an error is encountered a 400 header is returned and it is logged, if possible.
*/

$err = '';
$config = array();

if (! @include_once(dirname(__FILE__) . '/include/loadutils.php')) $err = 'Problem loading utility script';
if ((! $err) && (! load_utils('auth','id','archive'))) $err = 'Problem loading utility scripts';

if (! $err) { // pull in configuration so we can log other errors
  $config = config_get();
  $err = config_error($config);
}
if (! $err) { // see if the user is authenticated (does not redirect or exit)
  if (! auth_ok_callback($config)) $err = 'Unauthenticated access';
}
if (! $err) { // check to make sure required parameters have been sent
  $id = (empty($_REQUEST['id']) ? '' : $_REQUEST['id']);
  $uid = (empty($_REQUEST['uid']) ? '' : $_REQUEST['uid']);
  $extension = (empty($_REQUEST['extension']) ? '' : $_REQUEST['extension']);
  $type = (empty($_REQUEST['type']) ? '' : $_REQUEST['type']);
  if (! ($uid && $id && $extension && $type)) $err = 'Parameter uid, id, extension, type required';
}
if ((! $err) && empty($_FILES)) $err = 'No files supplied'; // make sure $_FILES is set and has item
if (! $err) { // make sure first item in $_FILES is valid
  foreach($_FILES as $k => $v) {
    $file = $_FILES[$k];
    break;
  }
  if (! $file) $err = 'No file supplied';
}
if (! $err) { // make sure there wasn't a problem with the upload
  if (! empty($file['error'])) $err = 'Problem with posted file: ' . $file['error'];
  elseif (! is_uploaded_file($file['tmp_name'])) $err = 'Not an uploaded file';
}

if (! $err) { // make sure file extension is valid
  $file_name = $file['name'];
  $file_ext = file_extension($file_name);
  if ($file_ext != 'tgz') $err = 'Unsupported extension: ' . $file_ext;
}
if (! $err) { // check that we can extract the archive to temp directory
  $media_dir = path_concat(path_concat(path_concat($config['web_root_directory'], $config['user_media_directory']), $uid), $id);  
  set_time_limit(0);
  $tmp_path = path_concat($config['temporary_directory'], id_unique());
  $archive_dir = $tmp_path;
  if (! archive_extract($file['tmp_name'], $archive_dir, $config)) $err = 'Could not extract to ' . $archive_dir;
}
if (! $err) { // move select files from the archive to media directory
  switch($type) {
    case 'audio':
    case 'video': {
      // move any soundtrack
      $frag = $config['import_audio_basename'] . '.' . $config['import_audio_extension'];
      $media_path = path_concat($media_dir, $frag);
      $archive_path = path_concat($archive_dir, $frag);
      if (file_exists($archive_path)) {
        if (! file_safe($media_path, $config)) $err = 'Could not create directories for ' . $media_path;
        elseif (! @rename($archive_path, $media_path)) $err = 'Could not move audio file from ' . $archive_path . ' to ' . $media_path;
        else {
          // move any soundtrack waveform graphic
          $frag = $config['import_waveform_basename'] . '.' . $config['import_waveform_extension'];
          $archive_path = path_concat($archive_dir, $frag);
          $media_path = path_concat($media_dir, $frag);
          if (file_exists($archive_path)) {
            if (! @rename($archive_path, $media_path)) $err = 'Could not move audio file from ' . $archive_path . ' to ' . $media_path;
          }
        }
      }
      break;
    }
  }
  if (! $err) {
    $frame_extension = $extension;
    switch($type) {
      case 'video':
        $frame_extension = 'jpg'; // otherwise use image's original extension (eg. png)
      case 'image': {
        $encoder_fps = $config['import_fps'];
        if ($type == 'image') $encoder_fps = '1';
        // move any frames
        $archive_path = path_concat($archive_dir, $config['import_dimensions'] . 'x' . $encoder_fps);
        if (file_exists($archive_path)) {
          $media_path = path_concat($media_dir, $config['import_dimensions'] . 'x' . $encoder_fps);
          if (! file_move_extension($frame_extension, $archive_path, $media_path, $config)) $err = 'Could not move ' . $frame_extension . ' files from ' . $archive_path . ' to ' . $media_path;
        }
        break;
      }
    }
  }
  // remove the temporary directory we created, and any remaining files (there shouldn't be any)
  file_dir_delete_recursive($tmp_path);
}
if ($err) {
  header('HTTP/1.1: 400 Bad Request');
  header('Status: 400 Bad Request');
  print $err;
  log_file($err, $config);
}
else log_file($media_path, $config);
