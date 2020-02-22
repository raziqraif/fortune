from flask import Blueprint, request, jsonify

from .serializers import LoginRequest


auth_bp = Blueprint('auth', __name__, url_prefix='/auth')


@auth_bp.route('/login', methods=['POST'])
def login():
    # TODO handle login
    validated_data: dict = LoginRequest.deserialize(request.json)
    return jsonify(validated_data)
