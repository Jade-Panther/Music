from flask import Flask, render_template, request, jsonify
from helpers import getLyrics, getSongs

#export FLASK_DEBUG=1

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html', songs=getSongs())

@app.route('/get-lyrics', methods=['POST'])
def getSongLyrics():
    data = request.get_json()
    lyrics = getLyrics(data['title'], data['author'])
    return jsonify({'lyrics': lyrics})

if __name__ == '__main__':
    app.run(debug=True)
    