from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest

from auth.decorators import require_authentication
from db import Profile, Friends
from .services import create_request
from .serializers import FriendsRequest


friends_bp = Blueprint('friends', __name__, url_prefix='/friends')

@friends_bp.route('/', methods=['POST'])
@require_authentication
def send(profile):
    validated_data: dict = FriendsRequest.deserialize(request.json)
    requestee = validated_data['requestee']
    status = validated_data['status']

    friend_req = create_request(profile, requestee, status)
    return jsonify(FriendsResponse.serialize(friend_req))
    