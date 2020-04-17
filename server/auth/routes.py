from flask import Blueprint, request, jsonify

from db import AuthToken, Profile
from .serializers import (
    LoginRequestSerializer,
    AuthTokenSerializer,
    VerifyResponseSerializer,
    ChangeUsernameRequest
)
from .services import register, login, change_username
from .decorators import get_auth_token, require_authentication

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
        raise Unauthorized('Invalid token')
    profile = auth_token.profile
    return jsonify(VerifyResponseSerializer.serialize({
        'id': profile.id,
        'username': profile.username,
    }))

@auth_bp.route('/username', methods=['PUT'])
@require_authentication
def change_username_route(profile):
    validated_data: dict = ChangeUsernameRequest.deserialize(request.json)
    new_username = validated_data['username']
    change_username(profile_id, new_username)
    return jsonify(ChangeUsernameResponse.serialize({
        'username': new_username
    }))