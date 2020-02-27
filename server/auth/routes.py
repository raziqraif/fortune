from flask import Blueprint, request, jsonify

from db import AuthToken, Profile
from .serializers import LoginRequest

import datetime

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    # TODO handle login
    validated_data: dict = LoginRequest.deserialize(request.json)
    username = validated_data['username']
    hashed_password = ['password']
    if (Profile.get(Profile.username == username) is None):
        print("Can create profile")
    else:
        print("Profile exists.")
    return jsonify(validated_data)

@auth_bp.route('/register', methods=['POST'])
def register():
    # TODO handle login
    validated_data: dict = LoginRequest.deserialize(request.json)
    username = validated_data['username']
    hashed_password = ['password']
    try:
        profile = Profile.get(Profile.username == username)
        # if no exception is raised, then a profile with the given username already exists
        return "Error: profile with username {} already exists.".format(username)
    except Profile.DoesNotExist as e:
        # if profile does not exist we can create 
        try:
            profile = Profile.create(
                username = username,
                hashed_password = hashed_password
            )
        except Exception as e:
            return "Failure to create profile: {}".format(str(e))
    return jsonify(validated_data)

