<?php
/*
Plugin Name: Buddypress Repostion Cover photo
Description: Allows Users reposition cover photo after upload it.
Author: Huu Nguyen Dac
Version: 1.0
License: GPL
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Domain Path: /languages
Text Domain: bp-reposition-cover-photo
*/

define('RCP_DIR', plugin_dir_path(__FILE__));
define('RCP_URL', plugin_dir_url(__FILE__));
define('RCP_VER', '3.0');
define('RCP_POSITION_USER_META_KEY', 'rcp_position');

class Buddypress_Reposition_Cover_Photo {
	/*
	*	@var instance of this class
	*/	
	private static $instance;

    /*
    *	Protected constructor to prevent creating a new instance.
    */	
	protected function __construct() {
		$this->bootstrap();
	}

	/*
	*	Prevent clone object of an instance.
	*/
	private function __clone() {}

	/*
	*	Prevent unserializing object of an instance.
	*/
    private function __wakeup(){}

    /*
    *	Get Instance.
    */
	public static function getInstance() {
		if( static::$instance === null ) {
			static::$instance = new static();
		}
		return static::$instance;
	} 

	public function bootstrap() {
		// Load files share between admin and public.
		require_once( RCP_DIR . 'include/rcp_helper.php' );
		require_once( RCP_DIR . 'public/rcp_fe.php' );
		require_once( RCP_DIR . 'admin/rcp_be.php' );
		$rcp_fe = new RCP_FE();
		$rcp_be = new RCP_BE();
	}
}


Buddypress_Reposition_Cover_Photo::getInstance();

add_filter('bp_attachments_get_cover_image_dimensions', 'test_function', 3, 10);
function test_function($wh, $settings, $component) {
	return array();
}

add_filter('bp_attachments_cover_image_ui_warnings', 'test_function_2', 999);
function test_function_2($warning) {
	return '';
}



