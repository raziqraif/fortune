import eventlet
eventlet.monkey_patch()
import flask
from flask import request
from threading import Thread
import time
import traceback

from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO, emit

from auth.decorators import get_auth_token
from auth.routes import auth_bp
from errors.handlers import errors_bp
from game.routes import game_bp
from notifications.routes import notification_bp, alert_bp
from scripts.routes import tickers_bp
from play.routes import play_bp
from join.routes import join_bp
from db import * # FIXME get rid of * when you have db migrations
from notifications.services import register_socketio
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
    app.register_blueprint(notification_bp)
    app.register_blueprint(alert_bp)
    app.register_blueprint(tickers_bp)
    app.register_blueprint(play_bp)
    app.register_blueprint(join_bp)

    @app.route('/')
    def hello():
        return 'hello world'

    socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins='*')
    #socketio = SocketIO(app, async_mode='threading', cors_allowed_origins='*')

    @socketio.on('connect')
    def on_connect():
        tok = get_auth_token(request.args.get('token'))
        if tok:
            tok.profile.socket_id = request.sid
            tok.profile.save()
            tok.save()

    def cb(tickers):
        from scripts.serializers import TickersResponse
        socketio.emit('message', TickersResponse.serialize(tickers, many=True))

    register_socketio(socketio)
    socketio.start_background_task(begin, cb=cb)

    return app, socketio
