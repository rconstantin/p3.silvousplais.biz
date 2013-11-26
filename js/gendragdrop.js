// jquery functions for drag and drop letters for spelling quiz
var correctLetters = 0;
var wrongGuess = 0;
var wordLength = 0;
var lastClass = '';
var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var cloneCount = 0;
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

    if ((degree == 1) || (degree == 2)) {
        var letters = fruit.split('');
        letters.sort( function() { return Math.random() - .5 });
    }
    else if (degree == 3) {
        var letters = generateRandomList(fruit);
        letters.sort( function() { return Math.random() - .5 });
    }
    else {
        // entire alphabet
        var letters = alphabet;
        cloneCount = 5;
    }
    
    var slotWidth = ((fruit.length*90)-30)+'px';

    var pileWidth = 100+'px';

    if (degree != 2) {
        pileWidth = Math.min((letters.length * 90-30),980)+'px';
    }

    $('#letterSlots').css('width',slotWidth);
    $('#letterPile').css('width',pileWidth);
    if (letters.length > 11) {
        $('#letterPile').css('height','230px');
    }
    else {
        $('#letterPile').css('height','130px');
    }
    var dropins = fruit.split('');
    var dropFunction = handleLetterDrop;
    if (degree == 4) {
        dropFunction = handleLetterDropAdvanced;
        $('#solution_title').html('Any Letter can be dropped to any location');
    }
    for ( var i=0; i<fruit.length; i++ ) {

        dropins[i] = dropins[i].toUpperCase();
 
        $('<div>' + '</div>').data( 'letter', i ).attr( 'id', dropins[i] ).appendTo( '#letterSlots' ).droppable( {
            accept: '#letterPile div',
            hoverClass: 'hovered',
            drop: dropFunction
        } );
    }
    var topi = 220;
    for ( var i=0; i<letters.length; i++ ) {
        letters[i] = letters[i].toUpperCase();
        if (degree == 4) {
        
            var lefti = 10 + (i%13) * 75;
            if (i==13) {
                topi = 340;
            }
                
            for (var j = 0; j <cloneCount; j++) {
                $('<div>' + letters[i] + '</div>').data( 'letter', letters[i] ).attr( 'id', letters[i]+j ).css('position','absolute').css('left', lefti+'px').css('top', topi+'px').appendTo( '#letterPile' ).draggable( {
                containment: '#content',
                stack: '#letterPile div',
                cursor: 'move',
                revert: true
                } );
            }
        }
        else if (degree == 2) {
            $('<div>' + letters[i] + '</div>').data( 'letter', letters[i] ).attr( 'id', letters[i] ).css('position','absolute').appendTo( '#letterPile' ).draggable( {
            containment: '#content',
            stack: '#letterPile div',
            cursor: 'move',
            revert: true
            } );
        }
        else {
            $('<div>' + letters[i] + '</div>').data( 'letter', letters[i] ).attr( 'id', letters[i] ).appendTo( '#letterPile' ).draggable( {
            containment: '#content',
            stack: '#letterPile div',
            cursor: 'move',
            revert: true
            } );
        }
    }
}
function handleLetterDrop( event, ui ) {

    var slotId = $(this).attr('id');
    var letterId = ui.draggable.attr('id').split('');
    
    // If the letter was dropped to the correct slot,
    // change the letter color (by addClass('correct'), position it directly
    // on top of the slot, and do not allow it to be dragged. 
    // Also, do not allow this slot to be dropped into by another letter
    // again

    if ( slotId == letterId[0] ) {
        ui.draggable.addClass( 'correct' );
        ui.draggable.draggable( 'disable' );
        $(this).droppable( 'disable' );
        ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
        ui.draggable.draggable( 'option', 'revert', false );
        correctLetters++;
        var left = wordLength-correctLetters;
        var string = "Check!! Still "+left +' Letters to go:)';
        $('#output').html(string);
    }
   
    // If all the letters have been placed correctly then display a message

    if ( correctLetters == wordLength ) {
        /*
        alert("Good Job!! Click Ok to refresh screen.");
        $('#selectedFruit').removeClass(lastClass);
        $('#fruitSpellCheck').show();
        genInit('');
        */
        $('#output').html('');
        $('#output').append('Good Job: You win! :)<br>');   

        
        $('#output').append('Starting a new game in 5 seconds...<br>');   
        
        // Let them see the results for 3 seconds, then just refresh this page to start a new game
        setTimeout(function(){
            location.reload();
        },5000);
 
    }

}
var top = 1000;
function handleLetterDropAdvanced( event, ui ) {

    var slotId = $(this).attr('id');
    var letterId = ui.draggable.attr('id').split('');
    // z-index to make latest dragged element on top: by setting the z-index smaller
    $(ui.draggable).css('z-index',top--);
    ui.draggable.position( { of: $(this), my: 'left top', at: 'left top' } );
    ui.draggable.draggable( 'option', 'revert', false );
    if (slotId == letterId[0]) {
        $(this).droppable( 'disable' );
        ui.draggable.draggable( 'disable' );
        ui.draggable.css('background','green');
        correctLetters++;
        var left = wordLength-correctLetters;
        var string = "Check:) Still "+left +' Letters to go:)<br>';
        $('#output').html(string);
    }
    else {
        ui.draggable.css('background','red');
        wrongGuess++;
        var left = wordLength-correctLetters;
        var string = "Wrong:( "+wrongGuess+ " wrong guess";
        if (wrongGuess > 1) {
            string = string + "ses";
        }
        string = string+"... "+left+' Letters to go:)<br>';
        $('#output').html(string);
    }
    if ( correctLetters == wordLength ) {
        /*
        alert("Good Job!! Click Ok to refresh screen.");
        $('#selectedFruit').removeClass(lastClass);
        $('#fruitSpellCheck').show();
        genInit('');
        */
        $('#output').html('');
        $('#output').append('Good Job: You win! :)<br>');   

        
        $('#output').append('Starting a new game in 5 seconds...<br>');   
        
        // Let them see the results for 3 seconds, then just refresh this page to start a new game
        setTimeout(function(){
            location.reload();
        },5000);
    }
}


$(".fruits").on('click', function() {
    var fruit = $(this).attr('id');
    displayGameRules();
    genInit(fruit);
 
});
$('input,select').change( function() {

    $('#output').html('');
    displayGameRules();
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

function displayGameRules() {

    var degree = $('#difficulty').val();

    $('#gameRules').html('');
    if (degree == 1) {
        $('#gameRules').html('Beginner Spelling Rules:<br> Fruit Letters are randomly shuffled in Pile. <br> Any letters can be dragged and dropped <br>but will only stick if in the correct position <br>');
    }
    else if (degree == 2) {
        $('#gameRules').html('Moderate (not as easy) Spelling Rules:<br> Letters are randomly stacked in Pile. <br> Top Letter will only be succesfully dropped <br> in correct position <br>');
    }
    else if (degree == 3) {
        $('#gameRules').html('Challenging (more difficult) Spelling Rules:<br> Fruit Letters are randomly mixed with other letters (Total of 20). <br> Only letters from chosen fruit will stick <br> to correct position<br>');
    }
    else {
        $('#gameRules').html('Advanced (most difficult) Spelling Rules:<br> Entire Alphabet is listed. <br> Any letter can be dragged and dropped <br> Incorrectly dropped letters will have red background <br> Correct picks in correct position will force green background<br> Game will end when all correct letters are in right slot.');
    }
}

