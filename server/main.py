import flask
import traceback

from flask import Flask 
from flask_cors import CORS

from auth.routes import auth_bp
from errors.handlers import errors_bp
from db import db

def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.before_request
    def before_request():
        db.connect()
        #pass

    @app.after_request
    def after_request(res):
        db.close()
        return res

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(errors_bp)

    @app.route('/')
    def hello():
        return 'hello world'

    return app
