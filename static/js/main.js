// const BASE_URL = 'http://127.0.0.1:5000/' // localhost URL
const BASE_URL = 'https://cautious-succotash-x5rwp6qwxpx7hpvp7-5000.app.github.dev/' // codespace URL

$('#guess_form').submit(async (e) => {
    e.preventDefault();
    const guess = $('#guess_input').val();

    // alert the user if there's nothing submitted
    if (!guess)
        return alert('Guess is required.');

    // make API call
    await axios.post(BASE_URL + '/api/guess', JSON.stringify({
        'guess': guess
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((result) => {
            const message = result.data.result;
            if (message === "ok") {
                const prevScore = Number.parseInt($('#current_score').text())
                $('#current_score').text(prevScore + guess.length);
            }
        }).catch((err) => {
            console.log(err);
            alert('Error:', err);
        });
    $('#guess_input').val("")
})

$(document).ready((e) => {
    const countdown = setInterval(() => {
        if ($('#time_remaining').text() > 0) {
            const prevTime = Number.parseInt($('#time_remaining').text());
            $('#time_remaining').text(prevTime - 1);
        }
        else {
            clearInterval(countdown);
            $('#guess_input').attr('disabled', true);
            $('#submit_button').addClass('disabled');
            alert('Time\'s up!');
        }
    }, 1000)
})