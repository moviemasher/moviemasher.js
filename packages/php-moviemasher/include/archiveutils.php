<?php


/*
Required directly by example scripts that receive encoded assets via HTTP as tgz archive.
This file uses PEAR's Archive_Tar class to handle the extraction. Functions will return
FALSE if the class cannot be loaded.
*/

@include_once('Archive/Tar.php');
include_once(dirname(__FILE__) . '/loadutils.php');
load_utils('file');

if (! function_exists('archive_extract')) {
  function archive_extract($path, $archive_dir, $config = array()) {
    $result = FALSE;
    if (class_exists('Archive_Tar')) {
      if (file_safe(path_concat($archive_dir, 'file.txt'), $config)) {
        $tar = new Archive_Tar($path);
        $tar->extract($archive_dir);
        $result = file_exists($archive_dir);
      }
    }
    return $result;
  }
}
