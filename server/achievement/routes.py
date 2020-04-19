from flask import Blueprint, request, jsonify
import os
import string
from werkzeug.exceptions import BadRequest
import pytz

from auth.decorators import require_authentication
from db import Achievement, AchievementProfile
from .serializers import AchievementProfile, Achievements
from .services import get_achievement_profile_by_profile_id, get_achievement_by_achievement_id, add_achievement_by_achievement_id_and_profile_id, get_achievements

achievement_bp = Blueprint('achievement', __name__, url_prefix='/achievement')

@achievement_bp.route('/profile', methods=['GET'])
@require_authentication
def get_achievement_profile(profile):
    achievementProfile = get_achievement_profile_by_profile_id(profile)
    return jsonify(AchievementProfile.serialize({
        'achievementProfile': achievementProfile
    }))

@achievement_bp.route('/', methods=['GET'])
def get_achievements():
    achievements = get_achievements
    return jsonify(Achievements.serialize({
        'achievements': achievements
    }))
