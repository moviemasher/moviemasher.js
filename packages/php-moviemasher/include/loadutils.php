<?php

function load_utils() {
  $result = FALSE;
  $names = func_get_args();
  $z = sizeof($names);
  for ($i = 0; $i < $z; $i++){
    $name = $names[$i];
    @include_once(dirname(dirname(__FILE__)) . '/override/' . $name . 'utils.php');
    $result = @include_once(dirname(__FILE__) . '/' . $name . 'utils.php');
  }
  return $result;
}
