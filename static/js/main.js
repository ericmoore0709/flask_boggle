// const BASE_URL = 'http://127.0.0.1:5000/' // localhost URL
const BASE_URL = 'https://cautious-succotash-x5rwp6qwxpx7hpvp7-5000.app.github.dev/' // codespace URL

const displayError = (msg) => {
    $('#error').text(msg);
}

/**
 * Process the guess submitted by input form. If a valid guess is made, send a request to the backend API and handle the response, increasing the score as the game goes on.
 */
$('#guess_form').submit(async (e) => {
    e.preventDefault();
    const guess = $('#guess_input').val();

    // alert the user if there's nothing submitted
    if (!guess) {
        displayError('Guess is required.');
        return;
    }

    // make API call
    await axios.post(BASE_URL + '/api/guess', JSON.stringify({
        'guess': guess
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((result) => {
            const message = result.data.data.result || result.data.message;
            if (message === "ok") {
                displayError('');
                const prevScore = Number.parseInt($('#current_score').text())
                $('#current_score').text(prevScore + guess.length);
            }
            else if (message === "not-a-word") {
                displayError(`'${guess}' is not a word.`);
            }
            else if (message === "not-on-board") {
                displayError(`'${guess}' not found on board.`);
            }
            else if (message === 'already-used') {
                displayError(`'${guess}' already used.`);
            }
        }).catch((err) => {
            console.log(err);
            displayError(err)
        });
    $('#guess_input').val("")
})

/**
 * Fire when the document is loaded and ready.
 */
$(document).ready((e) => {

    /**
     * Counts down the time when the window loads. When countdown reaches zero, clear, disable guesses, and send score to backend.
     */
    const countdown = setInterval(() => {
        if ($('#time_remaining').text() > 0) {
            const prevTime = Number.parseInt($('#time_remaining').text());
            $('#time_remaining').text(prevTime - 1);
        }
        else {
            clearInterval(countdown);
            $('#guess_input').attr('disabled', true);
            $('guess_input').attr('placeholder', 'Time\'s up!');
            $('#submit_button').addClass('disabled');
            displayError('')
            send_score(Number.parseInt($('#current_score').text()))
        }
    }, 1000)
})

/**
 * Makes an API call to the backend to record final score.
 * @param {*} score - the score to record
 * @returns nothing?
 */
const send_score = async (score) => {

    // if score isn't passed in, isn't an int, or is just zero, return.
    if (!score)
        return
    if (!Number.parseInt(score))
        return

    // else, pass the score to the API
    await axios.post(BASE_URL + '/api/record', JSON.stringify({
        'score': score
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((result) => {
            const status = result.data.status;
            if (status === 201) {
                displayError('Game submitted.');
            }
        }).catch((err) => {
            console.log(err);
            displayError('Error: ' + err);
        });

}