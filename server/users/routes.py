from flask import Blueprint, jsonify, request, json
from typing import List
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound

from auth.decorators import require_authentication
from db import Profile
from .serializers import User, UsersResponse
from .services import get_users_except_admins

users_bp = Blueprint('users', __name__, url_prefix='/users')


@users_bp.route('/users', methods=['GET'])
@require_authentication
def users_for_admin(profile):
    if not profile.is_admin:
        raise Unauthorized("You don't have permission")   # FIXME: This redirects to Login page. We probably dont want
        # that

    users: List[Profile] = get_users_except_admins()
    resp = UsersResponse()
    resp.users = []
    for usr in users:
        user = User()
        user.username = usr.username
        user.id = usr.id
        resp.users.append(user)

    return jsonify(UsersResponse.serialize(resp))
