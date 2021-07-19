<?php


if (! defined('FLOAT_HUNDRED')) define('FLOAT_HUNDRED', floatval(100));
if (! defined('FLOAT_NEG_ONE')) define('FLOAT_NEG_ONE', floatval(-1));
if (! defined('FLOAT_ONE')) define('FLOAT_ONE', floatval(1));
if (! defined('FLOAT_TWO')) define('FLOAT_TWO', floatval(2));
if (! defined('FLOAT_ZERO')) define('FLOAT_ZERO', floatval(0));


if (! function_exists('float_cmp')) {
  function float_cmp($f1,$f2, $precision = 3) // are 2 floats equal
  {
    $e = pow(10, $precision);
    $i1 = round($f1 * $e);
    $i2 = round($f2 * $e);
    return ($i1 == $i2);
  }
}
if (! function_exists('float_gtr')) {
  function float_gtr($big,$small, $precision = 3) // is one float bigger than another
  {
    $e = pow(10, $precision);
    $ibig = round($big * $e);
    $ismall = round($small * $e);
    return ($ibig > $ismall);
  }
}
if (! function_exists('float_gtre')) {
  function float_gtre($big,$small, $precision = 3) // is on float bigger or equal to another
  {
    $e = floatval(pow(10, $precision));
    $ibig = round($big * $e);
    $ismall = round($small * $e);
    return ($ibig >= $ismall);
  }
}
if (! function_exists('float_max')) {
  function float_max($a, $b, $precision = 3)
  {
    if (float_gtr($a, $b, $precision)) return $a;
    return $b;
  }
}
if (! function_exists('float_min')) {
  function float_min($a, $b, $precision = 3)
  {
    if (float_gtr($a, $b, $precision)) return $b;
    return $a;
  }
}
if (! function_exists('float_sort')) {
  function float_sort($a, $b)
  {
    if (float_gtr($a[0], $b[0])) return 1;
    if (float_cmp($a[0], $b[0])) return 0;
    return -1;
  }
}
