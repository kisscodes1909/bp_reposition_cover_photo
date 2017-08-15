jQuery(document).ready(function ($) {
	var rcp = {
		coverImageHeight : null,
		image : null,
		originPTop : null,
		context : 'upload-new-photo',
		init : function() {
			$headerCoverImage	  	= $('#buddypress #header-cover-image');
			this.coverImageHeight 	= $headerCoverImage.height();
			this.image			 	= $headerCoverImage.css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1');
			var backgroundPosition	= $headerCoverImage.css('background-position');

			/*
			* Set originPtop for image.
			* If context of repostion is upload new photo then originPTop equal 0 else it is edit position then OriginPtop = Old position.
			*/
			
			// Case edit position.
			if(backgroundPosition) {
				backgroundPosition	=	backgroundPosition.replace(/px/gi, '');
				backgroundPosition	=	backgroundPosition.split(" ");
				originPTop			=	backgroundPosition[1];
			} else {
				originPTop = 0;
			}

			// Case Upload new photo.

			if( this.context == 'upload-new-photo' ) {
				originPTop = 0;
			}

			this.originPTop = originPTop;
		},
		createDOM : function(srcImage="") {
			$bbContainerCoverImage	= $("#cover-image-container");
			$bbItemHeader			= $("#item-header");
			if( $('.rcp-container').size() >= 0 ) {
				$('.rcp-container').remove();
			}

			// Start create DOM
			var controller 		= "<div class='rcp-button-wrap'><button class='rcp-button save'> Save </button><button class='rcp-button cancel'> Cancel </button></div>";
			var rcpCoverResize 	= "<div id='rcp-cover-resize-wrapper'><img src="+ srcImage +" /></div>";
			var ctrlSaveVal		= "<input type='hidden' name='rcp-top-position' />";
			var loader			= "<div class='rcp-loader'></div>";
			$rcpContainer		= $($.parseHTML("<div class='rcp-container'>"+ rcpCoverResize + controller + ctrlSaveVal + loader + "</div>"));
			$rcpContainer.css({
				'height' 	: this.coverImageHeight + 'px',
			});
			// End create DOM for repostion cover

			$bbContainerCoverImage.after($rcpContainer);			
			$bbContainerCoverImage.css('visibility', 'hidden');
			$bbItemHeader.css('position', 'relative');
			$('.rcp-button.edit').show();
			$rcpContainer.show();
		},
		runUi: function() {
			self = this;
			$('#rcp-cover-resize-wrapper img')
			.css({
				'cursor' : 's-resize',
				'top'	 : self.originPTop + 'px'
			})
			.draggable({
				scroll: false,
				axis: "y",
				cursor: "s-resize",
				drag: function(event, ui) {
					y1 = $('#rcp-cover-resize-wrapper').height();
					y2 = $('#rcp-cover-resize-wrapper img').height();
					if( ui.position.top > 0 ) {
						ui.position.top = 0;
					} else if( ui.position.top <= (y1 - y2) ){
						ui.position.top = y1 - y2;
					}
				},
				stop: function(event, ui) {
					$("input[name=rcp-top-position]").val(ui.position.top);
				}
			})			
		},
		repositionCoverPhoto : function(context) {
			this.context = context;

			this.init();
			this.createDOM(this.image);
			this.adjustWidthImage(this.image)
			this.runUi();
			this.savePosition();
			this.cancelPosition();
		},
		adjustWidthImage : function(imageUrl) {
			var image = new Image();
			image.src = imageUrl;
			var wrapperImageWidth = $("#cover-image-container").width();
			if( image.width < wrapperImageWidth ) {
				$("#rcp-cover-resize-wrapper img").css('width', '100%');
			}
		},
		savePosition : function() {
			self = this;
			$('.rcp-button.save').one('click', function(){
			    var position = $("input[name=rcp-top-position]").val();
			    	position = position ? position : 0;
				self._ajaxSavePosition(position);
				self._updatePosition(position);
			});
		},
		_ajaxSavePosition : function(position) {
		    $.ajax({
				type: 'GET',
		    	url: RCP.ajaxUrl,
				data: {
					action: "rcp_update_position",
					userID: RCP.userID,
					position: position,
				},
				dataType: 	"json",
				beforeSend: function(xhr) {
					$('.rcp-loader').fadeIn();
				},
				success: function(respond, status, xhr) {
					$('.rcp-loader').fadeOut();
					$('.rcp-button.cancel').trigger('click');
				}
			});
		},
		_updatePosition : function(position) {
			$('#header-cover-image').css({
				'background-position' : '0 ' + position + 'px'
			});
		},
		cancelPosition : function() {
			$('.rcp-button.cancel').one('click', function(){
				$(".rcp-container").hide();
				$("#cover-image-container").css('visibility', 'visible');
			});
		},
		btnEditPosition : function() {
			/*
			*	Check user has cover photo then add button reposition
			*/
			if( !RCP.hasCoverPhoto ) return;
		
			var buttonHtml = '<div class="rcp-button-wrap"><button type="button" class="rcp-button edit">Reposition</button></div>';
			$('#cover-image-container').append($($.parseHTML(buttonHtml)));
			$('.rcp-button.edit').on('click', function(e){
				e.preventDefault();
				rcp.repositionCoverPhoto('edit-position');
			});
		},
		removeBtnEditPosition : function() {
			$('.rcp-button.edit').hide();
		}
	}


	/*
	*	Document loaded add button reposition photo.
	*/
	rcp.btnEditPosition();


	/* 
	* Bp trigger action upload new photo and delete photo.
	*/
	bp.CoverImage.Attachment.on('change:url', function( data ) {
		// Case user uploaded new cover photo.
		if( data.attributes.action == 'uploaded' ) {
			rcp.repositionCoverPhoto('upload-new-photo');
		}
		// Case user deleted cover photo.
		if( data.attributes.action == 'deleted' ) {
			rcp.removeBtnEditPosition();
		}
	});
});
