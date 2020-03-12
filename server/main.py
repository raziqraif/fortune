import eventlet
eventlet.monkey_patch()
import flask
from threading import Thread
import time
import traceback

from flask import Flask 
from flask_cors import CORS
from flask_socketio import SocketIO, emit

from auth.routes import auth_bp
from errors.handlers import errors_bp
from game.routes import game_bp
from db import * # FIXME get rid of * when you have db migrations
from scripts.service import begin

def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    CORS(app)

    @app.before_request
    def before_request():
        db.connect(reuse_if_open=True)
        #pass

    @app.after_request
    def after_request(res):
        db.close()
        return res

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(errors_bp)
    app.register_blueprint(game_bp)

    @app.route('/')
    def hello():
        return 'hello world'

    socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins='*')
    #socketio = SocketIO(app, async_mode='threading', cors_allowed_origins='*')

    # as a decorator:
    @socketio.on('connect')
    def connect_handler():
        # If I emit here it works e.g. sio.emit('status-update', {'core0_in': 8, 'core1_in': 12,'cpu_usage_in': 5, 'users': 7})
        socketio.emit('message', 'whaddup')


    @socketio.on('disconnect')
    def disconnect():
        socketio.emit('message', 'why disconnect?')

    def haha(sio):
        while True:
            print('waaaaaaaaaaaaaaaaaaaaat')
            sio.emit('message', 'whaaaaaaaaaaaaaat')
            time.sleep(3)

    #socketio.start_background_task(haha, socketio)
    socketio.start_background_task(begin, socketio)
    #Thread(target=begin, kwargs={'cb': send_tickers}).start()

    return app, socketio

