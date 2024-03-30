from boggle import Boggle
from flask import Flask, request, render_template, redirect, session
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
