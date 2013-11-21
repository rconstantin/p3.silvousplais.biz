// jquery functions for drag and drop letters for spelling quiz
var correctLetters = 0;
var wordLength = 0;
var lastClass = '';
var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

function genInit(fruit) {

    correctLetters= 0;
    wordLength = fruit.length;
    
    $('#selectedFruit').removeClass(lastClass);

    if (fruit != '') {
        $("#selectedFruit").removeClass('hidden');
        $("#solution").removeClass('hidden');
        $('#alphabetList').removeClass('hidden');
    } else {
        $("#selectedFruit").addClass('hidden');
        $("#solution").addClass('hidden');
        $('#alphabetList').addClass('hidden');
        return;
    }

    $('#selectedFruit').addClass(fruit);
    lastClass = fruit;
    $('#letterPile').html( '' );
    $('#letterSlots').html( '' );
    // Hide The rest of Fruits Menu to avoid selecting a new fruit mid-game
    $('#fruitSpellCheck').hide();
    var degree = $('#difficulty').val();

    if (degree == 1) {
        var letters = fruit.split('');
    }
    else {
        var letters = generateRandomList(fruit);
    }

    letters.sort( function() { return Math.random() - .5 });
    var slotWidth = ((fruit.length*90)-30)+'px';
    var pileWidth = Math.min((letters.length * 90-30),950)+'px';
    $('#letterSlots').css('width',slotWidth);
    $('#letterPile').css('width',pileWidth);
    if (letters.length > 11) {
        $('#letterPile').css('height','230px');
    }
    else {
        $('#letterPile').css('height','130px');
    }
    var dropins = fruit.split('');
     
    for ( var i=0; i<fruit.length; i++ ) {

        dropins[i] = dropins[i].toUpperCase();
 
        $('<div>' + '</div>').data( 'letter', i ).attr( 'id','letter'+dropins[i] ).appendTo( '#letterSlots' ).droppable( {
            accept: '#letterPile div',
            hoverClass: 'hovered',
            drop: handleLetterDrop
        } );
    }

    for ( var i=0; i<letters.length; i++ ) {
         letters[i] = letters[i].toUpperCase();
        $('<div>' + letters[i] + '</div>').data( 'letter', letters[i] ).attr( 'id', 'letter'+letters[i] ).appendTo( '#letterPile' ).draggable( {
            containment: '#content',
            stack: '#letterPile div',
            cursor: 'move',
            revert: true
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
        /*
        alert("Good Job!! Click Ok to refresh screen.");
        $('#selectedFruit').removeClass(lastClass);
        $('#fruitSpellCheck').show();
        genInit('');
        */
        $('#output').append('Good Job: You won! :)<br>');   

        
        $('#output').append('Starting a new game in 10 seconds...<br>');   
        
        // Let them see the results for 3 seconds, then just refresh this page to start a new game
        setTimeout(function(){
            location.reload();
        },10000);
 
    }

}

$(".fruits").on('click', function() {
    var fruit = $(this).attr('id');

    genInit(fruit);
 
});
$('input,select').change( function() {

    genInit(lastClass);
 
});
$(document).ready(function() {
    $('#my-list').hoverscroll();
});

function generateRandomList (fruit) {
    var len = 22 - fruit.length; /* Fill 2 rows of letters*/
    var newword = fruit;

    while (len >0) {
        len--;
        var index = Math.floor(Math.random()*alphabet.length);
        newword += alphabet[index];
    }
    return (newword.split(''));
}
