from flask import Flask

from auth.routes import auth_bp


def create_app():
    app = Flask(__name__)

    @app.before_request
    def before_request():
        # TODO set up DB connection
        pass

    @app.after_request
    def after_request(res):
        # TODO return DB connection to pool
        return res

    # register blueprints
    app.register_blueprint(auth_bp)

    # add app error handlers, could have separate blueprint for this
    # Handle 404, 405, etc etc
    @app.errorhandler(Exception)
    def catchall(e: Exception):
        # TODO handle this
        return '500 error'

    @app.route('/')
    def hello():
        return 'hello world'

    return app

