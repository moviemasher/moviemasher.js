<?php /*
This file provides hooks for the authentication mechanisms and is included by
most scripts. By default, it uses PHP's built in HTTP authentication but allows
ANY username/password combination to be used. The auth_challenge() function is
only called from endpoints that require a user id. The auth_userid() function is
called whenever paths are built to the user's content (uploads, rendered videos,
XML data files). The auth_data() function is called from when callbacks are
being generated for inclusion in the job XML for the transcoder.
*/

include_once(dirname(__FILE__) . '/loadutils.php');
load_utils('config');

if (! function_exists('auth_challenge')) {
  function auth_challenge($config) {
    $realm = (empty($config['authentication_prompt']) ? 'Any username and password will work for this example!' : $config['authentication_prompt']);
    // in this example we use HTTP authentication
    // if using sessions, you'll probably want to redirect to login page instead
    header('WWW-Authenticate: Basic realm="' . $realm . '"');
    header('HTTP/1.0 401 Unauthorized');
    exit;
  }
}
if (! function_exists('auth_ok')) {
  function auth_ok($config = array()) {
    $ok = FALSE;
    // check for configuration problem
    if (! $config) $config = config_get();
    if (! config_error($config)) {
      // check for aleady signed in
      $uid = auth_userid();
      $ok = !! $uid;
      if ($ok) { // we found a username, check for password
        switch($config['authentication']) {
          case '': break; // any password is okay, just look for user
          default: {
            $ok = FALSE;
            if (is_string($config['authentication'])) {
              $password = http_get_contents($config['authentication']);
              $supplied = (empty($_SERVER['PHP_AUTH_PW']) ? '' : $_SERVER['PHP_AUTH_PW']);
              $ok = ($password && $supplied && ($password == $supplied));
            }
          }
        }
      }
    }
    return $ok;
  }
}
if (! function_exists('auth_userid')) {
  function auth_userid() {
    // in this example the username serves as the ID, and is used to build user paths
    // if using sessions, a mechanism in your auth library probably returns a user ID
    return (empty($_SERVER['PHP_AUTH_USER']) ? '' : $_SERVER['PHP_AUTH_USER']);
  }
}
if (! function_exists('auth_ok_callback')) {
  function auth_ok_callback($config = array()) {
    $ok = FALSE;
    if (! $config) $config = config_get();
    if (! config_error($config)) {
      if ('session' == $config['authentication_callback_mode']){
        // will generate E_NOTICE if session was already started
        session_start(['use_only_cookies' => 0, 'read_and_close' => 1]);
      }
      $ok = auth_ok($config);
    }
    return $ok;
  }
}
if (! function_exists('auth_data')) {
  function auth_data($transfer = array(), $config = array()) {
    if (! $config) $config = config_get();
    if (! config_error($config)) {
      switch($config['authentication_callback_mode']){
        case 'http': {
          // use HTTP authentication - eg. http://User:Pass@www.example.com/path/
          $transfer['user'] = empty($_SERVER['PHP_AUTH_USER']) ? '' : $_SERVER['PHP_AUTH_USER'];
          $transfer['pass'] = empty($_SERVER['PHP_AUTH_PW']) ? '' : $_SERVER['PHP_AUTH_PW'];
        }
        case 'session': {
          // use session based authentication - eg. http://www.example.com/path/?PHPSESSID=abcdefghijklmnop
          if (empty($transfer['parameters'])) $transfer['parameters'] = [];
          $transfer['parameters'][session_name()] = session_id();
        }
      }
    }
    return $transfer;
  }
}
