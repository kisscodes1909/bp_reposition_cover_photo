<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}
class RCP_BE {
	function __construct() {
		add_action('plugins_loaded', array($this, 'rcp_admin_init'));
	}

	function rcp_admin_init() {
		if ( ! function_exists('bp_is_active') ) {
			add_action('admin_notices', array($this, 'rcp_admin_notice'));
	    	return;
	  	}
	}

	function rcp_admin_notice() {
		?>
		<div class='error'>
			<p>
		  		<?php _e( 'Repostion cover photo needs BuddyPress activated!', 'bp-reposition-cover-photo' ); ?>
			</p>
		</div>		
		<?php
	}
}