const BASE_URL = 'http://127.0.0.1:5000/' // localhost URL
// const BASE_URL = '' // codespace URL

$('#guess_form').submit(async (e) => {
    e.preventDefault();

    const guess = $('#guess_input').val();

    if (!guess)
        return;

    // make API call?
    const result = await axios.post(BASE_URL + '/api/guess', JSON.stringify({
        'guess': guess
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((result) => {
            alert(result.data.result);
        }).catch((err) => {
            console.log(err);
            alert('Error:', err);
        });
})