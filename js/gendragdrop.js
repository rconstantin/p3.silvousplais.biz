// jquery functions for drag and drop letters for spelling quiz
// inspired by a game found in http://www.pcrgb.com/dragdrop.html where numbers 1 to 10 are dragged and dropped
var correctLetters = 0;
var wrongGuess = 0;
var wordLength = 0;
var lastClass = '';
var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var cloneCount = 0;
function genInit(fruit) {

    correctLetters= 0;
    wordLength = fruit.length;
    // removeClass(lastClass) is needed here in case the user decides mid-game to change the degree of difficulty
    // This is also usefull if user is allowed to change the fruit object to spell prior to end of current game (currently not allowed)
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
    // Show the Rules for specific level/degree of difficulty
    displayGameRules();
    $('#selectedFruit').addClass(fruit);    
    lastClass = fruit;

    $('#letterPile').html( '' );
    $('#letterSlots').html( '' );
    // Hide The rest of Fruits Menu to avoid selecting a new fruit mid-game
    $('#fruitSpellCheck').hide();
    var degree = $('#difficulty').val();
    // For degree 1 & 2 (beginner & Moderate): the list of letters consists of the fruit letters with position randomized
    if ((degree == 1) || (degree == 2)) {
        var letters = fruit.split('');
        letters.sort( function() { return Math.random() - .5 });
    }
    // For degree 3 (Challenging), additional letters are added to the mix to make it harder
    else if (degree == 3) {
        var letters = generateRandomList(fruit);
        letters.sort( function() { return Math.random() - .5 });
    }
    else {
        // entire alphabet is used irrespective of the fruit to spell
        var letters = alphabet;
        cloneCount = 5;
    }
    // Adjust the width and height of blocks depending on degree of difficulty: more for esthetics
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
        // Decided to use a separate function for the advanced case for easier readability of code at the expense of the DRY concept
        // Tradeoff between DRY and complexity of logic
        dropFunction = handleLetterDropAdvanced;
        $('#solution_title').html('Any Letter can be dropped to any location');
    }
    for ( var i=0; i<fruit.length; i++ ) {

        // Generate the droppable slots to accept the correct letter in correct order: id will be used to identify the correct letter location
        // Policy: use the upper case letters as ID's to be matched against letters dragged from the Pile of Letters
        $('<div>' + '</div>').data( 'letter', i ).attr( 'id', dropins[i] ).appendTo( '#letterSlots' ).droppable( {
            accept: '#letterPile div', // only accepts letters originating from the letterPile collection
            hoverClass: 'drop-hover', //class added to droppable when acceptable draggable is hovered over: colored yellow here
            drop: dropFunction // callback function called when object is dropped 
        } );
    }
    var topi = 220;
    for ( var i=0; i<letters.length; i++ ) {
        if (degree == 4) { // Advanced Case: with entire alphabet and each letter cloned (replicated) in place to allow for multiple drag&drop
            // Allow 13 letters per row with total of 2 rows, seperated by approxiamtely 10px
            var lefti = 10 + (i%13) * 75;
            if (i==13) {
                topi = 340;
            }
                
            for (var j = 0; j <cloneCount; j++) {
                // up to cloneCount (5) copies of same letter of alphabet stacked on top of each other
                // alternative to cloning which is not straightforward for draggable items (alternative to helper:clone which seems to clone after the element is dropped)
                var newProp = {'position':'absolute','left':lefti+'px','top':topi+'px'};
                $('<div>' + letters[i] + '</div>').data( 'letter', letters[i] ).attr( 'id', letters[i]+j ).css(newProp).appendTo( '#letterPile' ).draggable( {
                containment: '#wrapper', // allows dragging within the confine of the wrapper div
                stack: '#letterPile div', // control the z-index and brings the dragged items to the front
                revert: true // revert to original position if dragging is interrupted or policy violated (where applicable)
                } );
            }
        }
        else {
            if (degree == 2) { // Moderate Case
                var cssProp = {'position':'absolute'};
            }
            else { // Beginner Case OR Challenging Case
                var cssProp = {'position':'relative'};
            }
        
            $('<div>' + letters[i] + '</div>').data( 'letter', letters[i] ).attr( 'id', letters[i] ).css(cssProp).appendTo( '#letterPile' ).draggable( {
            containment: '#wrapper', // allows dragging within the confine of the wrapper div
            stack: '#letterPile div', // control the z-index and brings the dragged items to the front 
            revert: true // revert to original position if dragging is interrupted or policy violated (where applicable)
            } );
        }
    }
}
function handleLetterDrop( event, ui ) {

    var slotId = $(this).attr('id');
    var letterId = $(ui.draggable).attr('id').split('');
    
    // If the letter was dropped to the correct slot,
    // change the letter color (by addClass('correct'), position it directly
    // on top of the slot, and do not allow it to be dragged. 
    // Also, do not allow this slot to be dropped into by another letter
    // again

    if ( slotId == letterId[0] ) {
        $(ui.draggable).addClass( 'correct' ); // add color specific background for effect
        $(ui.draggable).draggable( 'disable' ); // do not allow element to be dragged after dropping in correct position
        $(this).droppable( 'disable' ); // do not allow other letters to be dropped on top of this one
        // Disclaimer: jquery-ui position seems to have a bug in safari when 'Zoom Out' is used to reduce size of page content
        // it seems the calculation of left & top of ui-draggable element gets confused.
        // No problem observed when using chrome of firefox. Note: Safari is ok if only text is zoomed out
        $(ui.draggable).position( { of: $(this), my: 'center', at: 'center' , collision: 'fit'} );
        $(ui.draggable).draggable( 'option', 'revert', false ); //disable the revert option
        correctLetters++; // increment the number of correctly spelled letters
        // Display results only if there are changes (i.e a good guess)
        displayResults(1);
    }

}
var top = 1000;
function handleLetterDropAdvanced( event, ui ) {

    var slotId = $(this).attr('id');
    var letterId = $(ui.draggable).attr('id').split('');
    // z-index to make latest dragged element on top: by setting the z-index smaller
    $(ui.draggable).css('z-index',top--);
    // allow any letter to be dropped in any location
    $(ui.draggable).position( { of: $(this), my: 'center', at: 'center' } );
    // disable the revert option
    $(ui.draggable).draggable( 'option', 'revert', false );
    var guess = 0;
    if (slotId == letterId[0]) {
        // Policy to simplify things on our young user: correct spell will turn background green and disable further drag/drop on this letter/location
        $(this).droppable( 'disable' ); 
        $(ui.draggable).draggable( 'disable' );
        $(ui.draggable).css('background','green');
        correctLetters++;
        guess = 1;
    }
    else {
        // If wrong letter is dropped: set background to red and increment wrong count.
        // unlike the above case, both draggable and droppable are still enabled so wrong letter can be moved around
        // and/or other letters can be dragged and drop in this location
        $(ui.draggable).css('background','red');

        wrongGuess++;
    }
 
    displayResults(guess);
}


$(".fruits").on('click', function() {
    var fruit = $(this).attr('id');
    genInit(fruit);
 
});
$('input,select').change( function() {

    $('#output').html('');
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

    $('#gameRules').css('background','white');
    var degree = $('#difficulty').val();

    $('#gameRules').html('');
    if (degree == 1) {
        $('#gameRules').html('Beginner Spelling Rules:<br> Fruit Letters are randomly shuffled in Pile. <br> Any letters can be dragged and dropped <br>but will only stick if in the correct position <br>');
    }
    else if (degree == 2) {
        $('#gameRules').html('Moderate (not as easy) Spelling Rules:<br> Letters are randomly stacked in Pile. <br> Top Letter will only be succesfully dropped <br> in correct position <br>');
    }
    else if (degree == 3) {

        $('#gameRules').html('Challenging (more difficult) Spelling Rules:<br> Fruit Letters are randomly mixed with <br> other letters (Total of 20). <br> Only letters from chosen fruit will stick <br> to correct position.');
    }
    else {
        $('#gameRules').html('Advanced (most difficult) Spelling Rules:<br> Entire Alphabet is listed. <br> Any letter can be dragged and dropped. <br> Incorrect picks will have red background. <br> Correct picks will have green background.<br> Game ends when word is correctly spelled.');
    }
}
function displayResults (guess) {
    $('#output').css('background','white');
    $('#output').css({'color':'green'}).html(string);
    $('#output').html('');
    if (wordLength != correctLetters) {

        var left = wordLength-correctLetters;
        var plural = (left == 1) ? ' letter' : ' letters';
        // display output stats
        var string = '';
        if (guess == 1) {
            string = "Check:) ";
        }
        else {
            string = "<font color='red'>Wrong:( </font>";
        }

        string = (correctLetters > 0) ? string + correctLetters + "Correct. ": string;
        string = string + "Still "+left +plural+" to go!<br>";
        $('#output').html(string);
        
        if (wrongGuess > 0) {
            var string = "<font color='red'>" + wrongGuess+ " wrong guess";
            if (wrongGuess > 1) {
                string = string + "ses";
            }
            string = string +  "</font>";
            $('#output').append(string);
        }
        
    }
    else {
        // end of game: success and reload!!
        $('#output').html('');
        $('#output').append("<font color='orange'> Good Job: You win! :)<br></font>");   

        
        $('#output').append("<font color='orange'> Starting a new game in 5 seconds...</font>");   
        
        // Let them see the results for 3 seconds, then just refresh this page to start a new game
        setTimeout(function(){
            location.reload();
        },5000);
    }
}
