<?php

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

class RCP_FE {
	function __construct() {
		add_action( 'bp_init', array( $this, 'bp_loaded' ),4 );
	}

	function bp_loaded() {
		add_action('wp_enqueue_scripts', array($this, 'rcp_fe_enqueue_scripts'));
		//RCP Ajax reposition.
		add_action('wp_ajax_rcp_update_position', array($this, 'rcp_update_position'));
		add_action('wp_ajax_nopriv_rcp_update_position', array($this, 'rcp_update_position'));
		//RCP Add style reposition
		add_action('wp_head', array($this, 'rcp_add_style_reposition'));
	}

	function rcp_fe_enqueue_scripts() {
		if( !rcp_allow_reposition_photo() ) return;

		//FE enqueue scripts
		wp_enqueue_script('rcp_jquery-ui', RCP_URL . 'assets/js/jquery-ui.js', array('jquery'), '1.12.1');
		wp_enqueue_script('rcp_main', RCP_URL . 'assets/js/reposition-cover-photo.js', array('jquery'), rand());
		wp_localize_script('rcp_main', 'RCP', array(
			'userID' 	=> bp_displayed_user_id(),
			'ajaxUrl' 	=> admin_url( 'admin-ajax.php' ),
			'hasCoverPhoto' => bp_attachments_get_user_has_cover_image(bp_displayed_user_id())
		));

		// FE enqueue styles
		wp_enqueue_style('rcp-main-style', RCP_URL . 'assets/css/main.min.css', array(), RCP_VER );		
	}

	function rcp_update_position() {
		$user_id 	= $_GET['userID'];
		$position 	= $_GET['position'];
		$result 	= update_user_meta( $user_id, RCP_POSITION_USER_META_KEY, $position);
		die(json_encode(1));
	}	

	function rcp_add_style_reposition() {
		$position = get_user_meta( bp_displayed_user_id(), RCP_POSITION_USER_META_KEY, true);
		?>
		<style type="text/css">
			#buddypress #header-cover-image {
				background-position: 0 <?php echo $position.'px'; ?>;
			}
		</style>
		<?php
	}	
}