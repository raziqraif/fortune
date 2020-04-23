from flask import Blueprint, request, jsonify

from db import AuthToken, Profile
from .serializers import (
    LoginRequestSerializer,
    AuthTokenSerializer,
    VerifyResponseSerializer,
    ChangeUsername,
    ChangePassword
)
from achievement.services import add_achievement_by_achievement_id_and_profile_id
from .services import register, login, change_username, change_password
from .decorators import get_auth_token, require_authentication
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

@auth_bp.route('/username', methods=['PUT'])
@require_authentication
def change_username_route(profile):
    validated_data: dict = ChangeUsername.deserialize(request.json)
    new_username = validated_data['username'].strip()
    change_username(profile.id, new_username)

    # satisfy the "change username" achivement
    add_achievement_by_achievement_id_and_profile_id(3, profile.id)
    return jsonify(ChangeUsername.serialize({
        'username': new_username
    }))

@auth_bp.route('/password', methods=['PUT'])
@require_authentication
def change_password_route(profile):
    validated_data: dict = ChangePassword.deserialize(request.json)
    old_password = validated_data['oldPassword']
    new_password = validated_data['newPassword']
    change_password(profile, old_password, new_password)
    return 'Password changed successfully'