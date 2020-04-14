from flask import Blueprint, request, jsonify
import os
import string
from werkzeug.exceptions import BadRequest
import pytz

from auth.decorators import require_authentication
from db import Achievement, AchievementProfile
from .serializers import GetAchievements
from .services import get_achievement_profile_by_profile_id

achievement_bp = Blueprint('achievement', __name__, url_prefix='/achievement')

@achievement_bp.route('/', methods=['GET'])
@require_authentication
def get_achievements(profile):
    achievementProfile = get_achievement_profile_by_profile_id(profile.id)
    return jsonify(GetAchievements.serialize({
        'achievementProfile': achievementProfile
    }))
