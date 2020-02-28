from flask import Blueprint, request, jsonify

from db import AuthToken, Profile
from .serializers import LoginRequestSerializer, AuthTokenSerializer
from .services import register, login

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

