<?php /*
This script is called from Movie Masher Applet.
The uploaded file is in _FILES['file'], but the script just grabs the first key.
If the file uploads correctly and its extension is acceptable, the following happens:
  * the base file name is changed to 'media'
  * a directory is created in the user's directory, the ID is used for the name
  * the file is moved to this directory, and a 'meta' directory is created alongside it
  * extension, type and name properties are cached to the 'meta' directory for later use
The media ID is passed as a parameter to import_api.php, by setting the 'url' attribute in response.
If an error is encountered it is displayed in a javascript alert, by setting the 'get' attribute.
If possible, the response to client is logged.
*/
$response = array();
$err = '';
$config = array();
$log_responses = '';

if (! @include_once(dirname(__FILE__) . '/include/loadutils.php')) $err = 'Problem loading utility script';
if ((! $err) && (! load_utils('auth','mime'))) $err = 'Problem loading utility scripts';

if (! $err) { // pull in configuration so we can log other errors
  $config = config_get();
  $err = config_error($config);
  $log_responses = $config['log_response'];
}
if (! $err) { // see if the user is authenticated (does not redirect or exit)
  if (! auth_ok()) $err = 'Unauthenticated access';
}
if (! $err) { // make sure required parameters have been set
  $id = (empty($_REQUEST['id']) ? '' : $_REQUEST['id']);
  $uid = auth_userid();
  $type = (empty($_REQUEST['type']) ? '' : $_REQUEST['type']);
  $extension = (empty($_REQUEST['extension']) ? '' : $_REQUEST['extension']);
  if (! $uid) $err = 'Required uid parameters omitted';
  if (! $id) $err = 'Required id parameters omitted';
  if (! $extension) $err = 'Required extension parameters omitted';
  if (! $type) $err = 'Required type parameters omitted';
}
if (! $err) { // make sure $_FILES populated
  if (empty($_FILES) || empty($_FILES['file'])) $err = 'No file was uploaded';
}
if (! $err) { // make sure file is valid
  $file = $_FILES['file'];
  if ($file['error']) {
    switch ($file['error']) {
      case UPLOAD_ERR_INI_SIZE:
        $err = "The uploaded file exceeds the upload_max_filesize directive in php.ini";
        break;
      case UPLOAD_ERR_FORM_SIZE:
        $err = "The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form";
        break;
      case UPLOAD_ERR_PARTIAL:
        $err = "The uploaded file was only partially uploaded";
        break;
      case UPLOAD_ERR_NO_FILE:
        $err = "No file was uploaded";
        break;
      case UPLOAD_ERR_NO_TMP_DIR:
        $err = "Missing a temporary folder";
        break;
      case UPLOAD_ERR_CANT_WRITE:
        $err = "Failed to write file to disk";
        break;
      case UPLOAD_ERR_EXTENSION:
        $err = "Uupload stopped by extension";
        break;
      default:
        $err = "Unknown upload error";
        break;
        }
  }
  else if (! is_uploaded_file($file['tmp_name'])) $err = 'Error uploading your file';
}
if (! $err) { // make sure we can determine mime type and extension from file name
  $file_name = stripslashes($file['name']);
  $file_size = $file['size'];
  $file_extension = file_extension($file_name);
  $mime = mime_from_path($file_name);
  if (! ($mime && $file_extension)) $err = 'Could not determine mime type or extension';
}
if (! $err) { // make sure mime type is supported
  $file_type = mime_type($mime);
  switch($file_type) {
    case 'audio':
    case 'video':
    case 'image': break;
    default: $err = 'Only audio, image and video files supported';
  }
}
if (! $err) { // make sure type and extension match
  if ($type != $file_type) $err = 'Type ' . $file_type . ' was not the expected type ' . $type;
  else if ($extension != $file_extension) $err = 'Extension ' . $file_extension . ' was not the expected extension ' . $extension;
}
if (! $err) { // enforce size limit from configuration, if defined
  $max = (empty($config["max_meg_{$type}"]) ? '' : $config["max_meg_{$type}"]);
  if ($max) {
    $file_megs = round($file_size / (1024 * 1024));
    if ($file_megs > $max) $err = ($type . ' files must be less than ' . $max . ' meg');
  }
}
if (! $err) { // try to move upload into its media directory and change permissions

  $path = path_concat(path_concat(path_concat(path_concat($config['web_root_directory'], $config['user_media_directory']), $uid), $id), $config['import_original_basename'] . '.' .  $file_extension);
  if (! file_safe($path, $config)) $err = 'Problem creating media directory '. $path;
  else if (! file_move_upload($file['tmp_name'], $path)) $err = 'Problem moving file';
  else if (! file_mode($path, $config)) $err = 'Problem setting permissions of media: ' . $path;
  else log_file('Saved to: ' . $path, $config);
  $response['status'] = 'uploaded ok';
}
if ($err) $response['error'] = $err;
else $response['ok'] = 1;
$json = json_encode($response);
print $json . "\n\n";
if (! empty($log_responses)) log_file($json, $config);
