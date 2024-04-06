from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify
from uuid import uuid4

boggle_game = Boggle()
app = Flask(__name__)

# session key
app.secret_key = str(uuid4())


@app.get('/')
def index():
    board = session.get('board', default=boggle_game.make_board())
    session['board'] = board
    return render_template('index.html', board=board)


@app.post('/api/guess')
def guess():
    attempted_guess = request.json.get('guess', '')

    # if the value isn't there, return a data validation error DTO
    if not attempted_guess:
        return jsonify({
            'status': 400,
            'message': '\'guess\' is required.'
        })

    # else, see if the guess is a valid word and can be found in the board.
    board = session.get('board', [])
    if not board:
        return jsonify({
            'status': 404,
            'message': "Board not found."
        })

    result = ''
    previous_guesses = session.get('previous_guesses', [])
    if attempted_guess in previous_guesses:
        result = 'already-used'
    else:
        result = boggle_game.check_valid_word(board, attempted_guess)
        previous_guesses.append(attempted_guess)
        session['previous_guesses'] = previous_guesses

    return jsonify({
        'status': 200,
        'message': 'Here is the result.',
        'data': {
            'result': result
        }
    })


@app.post('/api/record')
def record():

    game_score = int(request.json.get('score', '0'))

    if not game_score:
        return jsonify({
            'status': 400,
            'message': '\'score\' (above 0) is required.'
        })

    # log score and increment game count
    games = session.get('games', [])
    games.append(game_score)
    session['games'] = games

    return jsonify({
        'status': 201,
        'message': 'score logged.',
        'data': {
            'high_score': max(games),
            'total_games': len(games)
        }
    })
