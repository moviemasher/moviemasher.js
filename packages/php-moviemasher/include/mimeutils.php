<?php

@include_once('MIME/Type.php');
include_once(dirname(__FILE__) . '/loadutils.php');
load_utils('file');

if (! function_exists('mime_from_extension')) {
  function mime_from_extension($ext) {
    $mime_types = array('323' => 'text/h323',
      'aif' => 'audio/x-aiff',
      'aifc' => 'audio/x-aiff',
      'aiff' => 'audio/x-aiff',
      'asf' => 'video/x-ms-asf',
      'asr' => 'video/x-ms-asf',
      'asx' => 'video/x-ms-asf',
      'au' => 'audio/basic',
      'avi' => 'video/x-msvideo',
      'bas' => 'text/plain',
      'pbj' => 'text/plain',
      'wmv' => 'video/x-ms-wmv',
      'bmp' => 'image/bmp',
      'c' => 'text/plain',
      'cmx' => 'image/x-cmx',
      'cod' => 'image/cis-cod',
      'css' => 'text/css',
      'etx' => 'text/x-setext',
      'f4v' => 'video/mp4',
      'f4p' => 'video/mp4',
      'flv' => 'video/x-flv',
      'flr' => 'x-world/x-vrml',
      'gif' => 'image/gif',
      'h' => 'text/plain',
      'h264' => 'video/mpeg',
      'htc' => 'text/x-component',
      'htm' => 'text/html',
      'html' => 'text/html',
      'htt' => 'text/webviewhtml',
      'ico' => 'image/x-icon',
      'ief' => 'image/ief',
      'jfif' => 'image/pipeg',
      'jpe' => 'image/jpeg',
      'jpeg' => 'image/jpeg',
      'jpg' => 'image/jpeg',
      'lsf' => 'video/x-la-asf',
      'lsx' => 'video/x-la-asf',
      'm2ts' => 'video/mpeg',
      'm3u' => 'audio/x-mpegurl',
      'm4v' => 'video/x-m4v', 
      'mht' => 'message/rfc822',
      'mhtml' => 'message/rfc822',
      'mid' => 'audio/mid',
      'mov' => 'video/quicktime',
      'movie' => 'video/x-sgi-movie',
      'mp2' => 'video/mpeg',
      'mp3' => 'audio/mpeg',
      'mp4' => 'video/mpeg',
      'mpa' => 'video/mpeg',
      'mpe' => 'video/mpeg',
      'mpeg' => 'video/mpeg',
      'mpeg4' => 'video/mpeg',
      'mpg' => 'video/mpeg',
      'mpv2' => 'video/mpeg',
      'nws' => 'message/rfc822',
      'pbm' => 'image/x-portable-bitmap',
      'pgm' => 'image/x-portable-graymap',
      'png' => 'image/png',
      'pnm' => 'image/x-portable-anymap',
      'ppm' => 'image/x-portable-pixmap',
      'qt' => 'video/quicktime',
      'ra' => 'audio/x-pn-realaudio',
      'ram' => 'audio/x-pn-realaudio',
      'ras' => 'image/x-cmu-raster',
      'rgb' => 'image/x-rgb',
      'rmi' => 'audio/mid',
      'rtx' => 'text/richtext',
      'sct' => 'text/scriptlet',
      'snd' => 'audio/basic',
      'stm' => 'text/html',
      'svg' => 'image/svg+xml',
      'swf' => 'application/x-shockwave-flash',
      'tif' => 'image/tiff',
      'tiff' => 'image/tiff',
      'tsv' => 'text/tab-separated-values',
      'txt' => 'text/plain',
      'uls' => 'text/iuls',
      'vcf' => 'text/x-vcard',
      'vrml' => 'x-world/x-vrml',
      'wav' => 'audio/x-wav',
      'wrl' => 'x-world/x-vrml',
      'wrz' => 'x-world/x-vrml',
      'xaf' => 'x-world/x-vrml',
      'xbm' => 'image/x-xbitmap',
      'xml' => 'text/xml',
      'xof' => 'x-world/x-vrml',
      'xpm' => 'image/x-xpixmap',
      'xwd' => 'image/x-xwindowdump',
    );
    $result = FALSE;
    if ($ext && isset($mime_types[$ext]))
    {  
      $result = $mime_types[$ext];
    }
    return $result;
  }
}
if (! function_exists('mime_from_path')) {
  function mime_from_path($path) {
    $result = FALSE;
    if ($path)
    {
      $extension = strtolower(file_extension($path));
      if ($extension)
      {
        $result = mime_from_extension($extension);
        if (! $result)
        {
          if (function_exists('mime_content_type'))
          {
            $result = @mime_content_type($path);
          }
        }
        if (! $result)
        {
          $result = mime_type_of_file($path);
        }
      }
    }
    return $result;
  }
}
if (! function_exists('mime_type')) {
  function mime_type($mime) {
    $result = FALSE;
    if ($mime)
    {
      $pos = strpos($mime, '/');
      if ($pos !== FALSE) 
      {
        $result = substr($mime, 0, $pos);
      }
    }
    return $result;
  }
}
if (! function_exists('mime_type_from_extension')) {
  function mime_type_from_extension($extension) {
    return mime_type_from_path('file.' . $extension);
  }
}
if (! function_exists('mime_type_from_path')) {
  function mime_type_from_path($path) {
    $result = FALSE;
    if ($path)
    {
      $mime = mime_from_path($path);
      if ($mime)
      {
        $result = mime_type($mime);
      }
    }
    return $result;
  }
}
if (! function_exists('mime_type_of_file')) {
  function mime_type_of_file($path) {
    $result = FALSE;
    if (class_exists('MIME_Type'))
    {
      $result = MIME_Type::autoDetect($path);
      if (PEAR::isError($result)) $result = FALSE;
    }
    return $result;
  }
}
