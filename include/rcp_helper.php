<?php
function rcp_allow_reposition_photo() {
	/*
	*	User is logged
	*	User is Admin
	*	Current user is user profile.
	*/
	$permission = false;
	if( is_user_logged_in() && (
		current_user_can('administrator') || get_current_user_id() ==  bp_displayed_user_id()
		) ) {
		$permission = true;
	}
	return $permission; 
}