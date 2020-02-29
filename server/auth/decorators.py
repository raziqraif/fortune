from functools import wraps

from flask import request
from werkzeug.exceptions import BadRequest, Unauthorized

from db import AuthToken, Profile


def get_auth_token(tok):
    try:
        return (AuthToken
            .select()
            .join(Profile)
            .where(AuthToken.token == tok)
            .get())
    except AuthToken.DoesNotExist:
        return None


def require_authentication(route_func):
    """
    Inspired by/partially taken from:
    https://github.com/TylerStanish/bucko/blob/master/auth/decorators.py

    If you use this decorator, it *must* be the last decorator, and the
    function it decorates *must* accept an argument. On success, this
    decorator will pass the user's profile to the view function as the first
    argument (and then additionally all positional and keyword arguments *after*
    the profile argument)

    e.g.
    @route('/<something_id>')
    @require_authentication
    def handler(profile, something_id):
                         ^^ other args *after* profile arg
        return jsonify(...)
    """
    @wraps(route_func)
    # TODO wrap this in a transaction? Or start/commit transactions in request
    # middleware?
    def wrapper(*args, **kwargs):
        auth = request.headers.get('Authorization')
        if not auth:
            # FIXME use a more fine-grained exception when such a pr gets merged
            raise BadRequest('Missing authorization token')
        # I figure we have a 'Bearer' prefix, e.g. Authorization: 'Bearer thetoken'
        # Although with this it could really be any prefix
        split = auth.split(' ')
        if len(split) <= 1:
            raise BadRequest('Malformed Authorization header')
        tok = split[1]
        auth_token = get_auth_token(tok)
        if auth_token is None:
            # FIXME use a more fine-grained exception when such a pr gets merged
            raise Unauthorized('Invalid token')
        return route_func(auth_token.profile, *args, **kwargs)
    return wrapper

