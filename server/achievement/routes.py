from flask import Blueprint, request, jsonify
import os
import string
from werkzeug.exceptions import BadRequest
import pytz

from auth.decorators import require_authentication
from db import Achievement, AchievementProfile, Goal, GoalProfile
from .serializers import AchievementProfile, AchievementSerializer, GoalSerializer, GoalProfile
from .services import (
    get_achievement_profile_by_profile_id,
    get_goal_profile_by_profile_id,
)

achievement_bp = Blueprint('achievement', __name__, url_prefix='/achievement')
goal_bp = Blueprint('goal', __name__, url_prefix='/goal')

# Achievement routes

@achievement_bp.route('/profile', methods=['GET'])
@require_authentication
def get_achievement_profile(profile):
    achievementProfile = get_achievement_profile_by_profile_id(profile)
    return jsonify(AchievementProfile.serialize({
        'achievementProfile': achievementProfile
    }))

@achievement_bp.route('/', methods=['GET'])
def achievements():
    return jsonify(AchievementSerializer.serialize(Achievement.select(), many=True))


# Goal routes

@goal_bp.route('/profile', methods=['GET'])
@require_authentication
def get_goal_profile(profile):
    goalProfile = get_goal_profile_by_profile_id(profile)
    return jsonify(GoalProfile.serialize({
        'goalProfile': goalProfile
    }))

@goal_bp.route('/', methods=['GET'])
def goals():
    return jsonify(GoalSerializer.serialize(Goal.select(), many=True))
