// jquery functions for drag and drop letters for spelling quiz
var correctLetters = 0;
var wordLength = 0;
var lastClass = '';

function genInit(fruit) {

    correctLetters= 0;
    wordLength = fruit.length;
    console.log(fruit);
    if (lastClass != '' && lastClass != fruit) {
        $('#selectedFruit').removeClass(lastClass);
    }
    $('#selectedFruit').addClass(fruit);
    lastClass = fruit;
    $('#letterPile').html( '' );
    $('#letterSlots').html( '' );
 
    var letters = fruit.split('');
    var dropins = fruit.split('');
    letters.sort( function() { return Math.random() - .5 });
    
    for ( var i=0; i<fruit.length; i++ ) {
        letters[i] = letters[i].toUpperCase();
        dropins[i] = dropins[i].toUpperCase();
        $('<div>' + letters[i] + '</div>').data( 'letter', letters[i] ).attr( 'id', 'letter'+letters[i] ).appendTo( '#letterPile' ).draggable( {
            containment: '#content',
            stack: '#letterPile div',
            cursor: 'move',
            revert: true
        } );
        $('<div>' + '</div>').data( 'letter', i ).attr( 'id','letter'+dropins[i] ).appendTo( '#letterSlots' ).droppable( {
            accept: '#letterPile div',
            hoverClass: 'hovered',
            drop: handleLetterDrop
        } );
    }
}
function handleLetterDrop( event, ui ) {

    var slotId = $(this).attr('id');
    var letterId = ui.draggable.attr('id');

    
    // If the letter was dropped to the correct slot,
    // change the letter color (by addClass('correct'), position it directly
    // on top of the slot, and do not allow it to be dragged. 
    // Also, do not allow this slot to be dropped into by another letter
    // again
 
    if ( slotId == letterId ) {
        ui.draggable.addClass( 'correct' );
        ui.draggable.draggable( 'disable' );
        $(this).droppable( 'disable' );
        ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
        ui.draggable.draggable( 'option', 'revert', false );
        correctLetters++;
    }
   
    // If all the letters have been placed correctly then display a message

    if ( correctLetters == wordLength ) {
        alert("Good Job!! Click Ok to refresh screen.");
        $('#selectedFruit').removeClass(lastClass);
        genInit('');
        
    }

}

$(".fruits").on('click', function() {
    var fruit = $(this).attr('id');
 /*   $('#selectedFruit').css({'background-image':'url(../images/'+fruit+'_small.jpg'});*/

    genInit(fruit);
 
});

$(document).ready(function() {
    $('#my-list').hoverscroll();
});
