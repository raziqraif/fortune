import werkzeug
import traceback
from flask import Blueprint, json, jsonify
from marshmallow.exceptions import ValidationError

errors_bp = Blueprint('errors', __name__)


@errors_bp.app_errorhandler(werkzeug.exceptions.HTTPException)
def handle_http_exception(e):
    """ Handle generic HTTP Exception """

    return _http_exception_resp(e)

@errors_bp.app_errorhandler(ValidationError)
def handle_marshmallow_exception(e: ValidationError):
    """ Handle marshmallow HTTP Exception """
    if hasattr(e, 'errors'):
        return jsonify({
            'error': e.errors,
        }), 400
    if hasattr(e, 'messages'):
        return jsonify({
            'error': e.messages[next(iter(e.messages.keys()))][0],
        }), 400

@errors_bp.app_errorhandler(werkzeug.exceptions.InternalServerError)
def handle_500(e):
    """ Handle Internal Server Error """

    # Flask could also raise this exception because of a non-500 error (if the error has no handler)
    # https://flask.palletsprojects.com/en/1.1.x/errorhandling/
    original_exception = getattr(e, "original_exception", None)
    if original_exception is None:
        # Direct 500 error
        return _http_exception_resp(e)
    else:
        # Indirect 500 error
        print(traceback.format_exc())
        return _unexpected_exception_resp()


# noinspection PyUnusedLocal
@errors_bp.app_errorhandler(Exception)
def handle_unexpected_exception(e: Exception):
    """ Handle any unexpected exception """

    print(traceback.format_exc())
    return _unexpected_exception_resp()


def _http_exception_resp(e: werkzeug.exceptions.HTTPException):
    """ Return the generic response for http exceptions """

    # https://flask.palletsprojects.com/en/1.1.x/errorhandling/
    response = e.get_response()
    response.data = json.dumps({
        "code": e.code,
        "name": e.name,
        "error": e.description
    })
    response.content_type = "application/json"
    return response


def _unexpected_exception_resp():
    """ Return the generic response for unexpected exceptions """

    # https://opensource.com/article/17/3/python-flask-exceptions
    status_code = 500
    success = False
    response = {
        'error': 'An unexpected error has occurred.',
    }
    return jsonify(response), status_code
