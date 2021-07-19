<?php


if (! function_exists('id_unique')) {
  function id_unique() {
    $id = '';
    if (function_exists('com_create_guid') === true) $id = trim(com_create_guid(), '{}');
    else $id = sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
    return $id;
  }
}
