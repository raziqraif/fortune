from flask import Blueprint, request, jsonify

from db import AuthToken, Profile
from .serializers import LoginRequestSerializer, AuthTokenSerializer, VerifyResponseSerializer
from .services import register, login
from .decorators import get_auth_token
from werkzeug.exceptions import BadRequest, Unauthorized

import datetime

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['POST'])
def login_route():
    # TODO handle login
    validated_data: dict = LoginRequestSerializer.deserialize(request.json)
    username = validated_data['username']
    password = validated_data['password']
    auth_token = login(username, password)
    return jsonify(AuthTokenSerializer.serialize(auth_token))


@auth_bp.route('/register', methods=['POST'])
def register_route():
    # TODO handle login
    validated_data: dict = LoginRequestSerializer.deserialize(request.json)
    username = validated_data['username']
    password = validated_data['password']
    auth_token = register(username, password)
    return jsonify(AuthTokenSerializer.serialize(auth_token))

@auth_bp.route('/verify', methods=['POST'])
def verify_route():
    auth = request.headers.get('Authorization')
    if not auth:
        return jsonify(VerifyResponseSerializer.serialize({}))
    split = auth.split(' ')
    if len(split) <= 1:
        raise BadRequest('Malformed Authorization header')
    tok = split[1]
    auth_token = get_auth_token(tok)
    if auth_token is None:
        return jsonify(VerifyResponseSerializer.serialize({}))
    profile = auth_token.profile
    return jsonify(VerifyResponseSerializer.serialize({
        'id': profile.id,
        'username': profile.username,
    }))