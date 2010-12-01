/*

	 ____ ____ ____ ____ ____ ____ ____ ____ ____ 
	||s |||l |||i |||d |||e |||r |||i |||z |||e ||
	||__|||__|||__|||__|||__|||__|||__|||__|||__||
	|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\| 

	  
*/

MESSAGE_QUEUE_LOCK = false; // the global "queue lock" var is so you can't click until the previous click's message is finished displaying.

function sliderize(htmlMessage, messageStyle, messageBoxId, callback) {

	// a:) you'd want some default values here
	// b:) i don't know how to overload parameters yet in javascript so I'll just assume they all exist for now
	
	if (!MESSAGE_QUEUE_LOCK  && typeof htmlMessage != 'undefined') {

		MESSAGE_QUEUE_LOCK = true;
	
		//var messageBoxId = '#' + messageBoxId; // prepend the jQuery/CSS "ID signal" to the HTML element ID.
		
		
		// 0.) If the messageBox element doesn't even exist ... let's stick one at the top of the dom!
		//if ( ! $(messageBoxId).length ) {
			//$("#login").after("<div id='" + messageBoxId + "' style='border:1px solid #999999;padding:10px;'>" + htmlMessage + "</div>");
			//$("#login").before("<div id='" + messageBoxId + "' class='message'>here's you new box!</div>");
			//alert('No message box is present in this document.');
		//}
		
		// 1.) If the messageBox element does not have a slideBox parent, then add one
		
		if ( $(messageBoxId).parent().length ) {
			slideParentId = $(messageBoxId).parent()[0].id; // not the best way to get the id
			if ( slideParentId  != 'slideBox' ) {
				 $(messageBoxId).wrap("<div id='slideBox' style='border:0px solid red;margin-bottom:25px;'></div>");
			}
		}
		// 2.) If the messageBox is not hidden, then fade it out quickly
		if ( $(messageBoxId).css('display') != 'none' ) {
			
			$(messageBoxId).fadeOut(100); // this is the slide delay
			// the slide delay should be separated here from the fade out delay
			// this will require a better understading & framework of private functions and callbacks
		}		


		// The timer for the style change is not working :(
		$(messageBoxId)
			.html(htmlMessage)
			.removeClass('messageBad')
			.removeClass('messageGood')	
			.removeClass('messageCool')	
			.addClass(messageStyle);				

		
		
		// Until further notice you gotta turn on the visibility for a split second to grab the new height :(
		// ( not sure if it's possible to get the height of something whose display is 'none'
		var oldMessageBoxHeight = $(messageBoxId).height();
		$(messageBoxId).show();
		var messageBoxHeight = $(messageBoxId).height();
		$(messageBoxId).hide();

		
		if (!htmlMessage.length) { messageBoxHeight = 0 }
		
		
		
		// you only want to spend time changing the height if the message length is greater than 0
		// if ( !htmlMessage.length ) { messageBoxHeight = 0; }

		// This still needs code to hide everything in case the trimmed message length is 0.

		$("#slideBox").animate({ height: messageBoxHeight }, 700, function() {
				
			if ( messageBoxHeight ) {
					
				$(messageBoxId).fadeIn(250, function() {
						
					if (typeof callback == "function") {
						// if there was a callback then fire it now
						callback();
	
					}
					// this isn't set up right. the callback should occur regardless of whether the message was displayed
					// wait for the fade in to complete before releasing the lock
					MESSAGE_QUEUE_LOCK = false; // release the lock so someone else can send a message now !
					
				});
				
			} else {
			
				MESSAGE_QUEUE_LOCK = false;
				
			}
			
			
			
		});
		

	}

	return false;

}
