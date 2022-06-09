( function( $ ) {
	/* initial modal */
	$( '.modal-a' ).on('click', '#star-game', function() {
		$( '.modal-a' ).fadeOut( 1500 );
		$( 'body' ).removeClass( 'silo-modal-open initial-modal' );
		var currentHeading = $( '#clues .active' );
		currentHeading.hide();
		currentHeading.attr( 'class', 'clue hidden absolute' );
		currentHeading.next( '.clue' ).fadeIn( 1500 );
		currentHeading.next( '.clue' ).attr( 'class', 'clue hidden active' );
		$( '#character-head' ).attr( 'class', 'bounce' );
		window.setTimeout( function(){
			$( '#character-head' ).attr( 'class', '' );
		}, 4000);
	} );
	/* true items */
	$( '#out-tree' ).on('click', '.active', function() {
		$( this ).attr( 'class', 'item' );
		$( this ).fadeOut( 1500 );
		$( this ).next( '.noitem' ).attr( 'class', 'item active' );
		var currentHeading = $( '#clues .active' );
		currentHeading.hide();
		currentHeading.attr( 'class', 'clue hidden absolute' );
		currentHeading.next( '.clue' ).fadeIn( 1500 );
		currentHeading.next( '.clue' ).attr( 'class', 'clue hidden active' );
		$( '#character-head' ).attr( 'class', 'bounce' );
		window.setTimeout( function(){
			$( '#character-head' ).attr( 'class', '' );
		}, 3000);
		var currentItem = $( '#on-tree .active' );
		currentItem.fadeIn( 1500 );
		currentItem.attr( 'class', 'visible' );
		currentItem.next( '.item' ).attr( 'class', 'item hidden active' );
	} );
	/* wrong items */
	$( '#mini-city' ).on('click', '.noitem', function() {
		var shakeItem = $( this );
		$( this ).attr( 'class', 'noitem shake' );
		window.setTimeout( function(){
			shakeItem.attr( 'class', 'noitem' );
		}, 1000);
	} );
	/* final modal */
	$( '#out-tree' ).on('click', '#star-01.active', function() {
		window.setTimeout( function(){
			$( '.modal-b' ).fadeIn( 1500 );
			$( 'body' ).addClass( 'silo-modal-open final-modal' );
		}, 1500);
	} );
} )( jQuery );