from flask import Blueprint, request


auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['GET'])
def login():
    # TODO handle login
    return 'logging in...'

