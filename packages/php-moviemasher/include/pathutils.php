<?php

if (! function_exists('path_add_slashes')) {
  function path_add_slashes($s) {
    return path_add_slash_start(path_add_slash_end($s));
  }
}
if (! function_exists('path_add_slash_end')) {
  function path_add_slash_end($s) {
    if (is_null($s) || empty($s)) $s = '';
    if (substr($s, -1) != '/') $s .= '/';
    return $s;
  }
}
if (! function_exists('path_add_slash_start')) {
  function path_add_slash_start($s) {
    if (is_null($s) || empty($s)) $s = '';
    if (substr($s, 0, 1) != '/') $s = '/' . $s;
    return $s;
  }
}
if (! function_exists('path_concat')) {
  function path_concat($s1, $s2) {
    if (is_null($s1) || empty($s1)) $s1 = '';
    if (is_null($s2) || empty($s2)) $s2 = '';
    if ((is_null($s1) || empty($s1)) || (is_null($s2) || empty($s2))) $s1 .= $s2;
    else $s1 = path_add_slash_end($s1) . path_strip_slash_start($s2);
    return $s1;
  }
}
if (! function_exists('path_strip_slashes')) {
  function path_strip_slashes($s) {
    return path_strip_slash_start(path_strip_slash_end($s));
  }
}

if (! function_exists('path_strip_slash_end')) {
  function path_strip_slash_end($s) {
    if (is_null($s) || empty($s)) $s = '';
    if ('/' == substr($s, -1)) $s = substr($s, 0, -1);
    return $s;
  }
}
if (! function_exists('path_strip_slash_start')) {
  function path_strip_slash_start($s) {
    if (is_null($s) || empty($s)) $s = '';
    if ('/' == substr($s, 0, 1)) $s = substr($s, 1);
    return $s;
  }
}
