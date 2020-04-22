from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest

from auth.decorators import require_authentication
from db import Profile, Friends
from .services import create_request, get_friends_by_username, accept_request, get_pending_by_username
from .serializers import FriendsSerializer, FriendsList, PendingList, Friend


friends_bp = Blueprint('friends', __name__, url_prefix='/friends')

@friends_bp.route('/', methods=['POST'])
@require_authentication
def send(profile):
    validated_data: dict = FriendsSerializer.deserialize(request.json)
    requester_name = validated_data['requester']
    requestee_name = validated_data['requestee']
    status = validated_data['status']
    friend_req = create_request(requester_name, requestee_name, status)
    if friend_req is None:
        raise BadRequest('Could not create request')
    return jsonify(FriendsSerializer.serialize(friend_req))

@friends_bp.route('/accept', methods=['PUT'])
@require_authentication
def accept(profile):
    validated_data: dict = FriendsSerializer.deserialize(request.json)
    requester_name = validated_data['requester']
    requestee_name = validated_data['requestee']
    status = validated_data['status']
    accept = accept_request(requester_name, requestee_name)
    if accept is None:
        raise BadRequest('Could not accept request')

    try:
        q = Friends.update({Friends.status: 1}).where(Friends.id == accept.id)
        q.execute()
    except Exception as e:
        return "Failed to accept request: {}".format(str(e))
    return jsonify(FriendsSerializer.serialize(accept))

@friends_bp.route('/list/<username>', methods=['GET'])
def get_friends(username):
    friends = get_friends_by_username(username)
    return jsonify(FriendsList.serialize({'friendsList': friends,}))

@friends_bp.route('/pending/<username>', methods=['GET'])
def get_pending(username):
    pending = get_pending_by_username(username)
    return jsonify(PendingList.serialize({'pending': pending,}))
