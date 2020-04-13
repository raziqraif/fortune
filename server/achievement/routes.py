from flask import Blueprint, request, jsonify
import os
import string
from werkzeug.exceptions import BadRequest
import pytz

from auth.decorators import require_authentication
# from db import Achievement, AchievementProfile
# from .serializers import GameCreateRequest, GameResponse, CoinsResponse, GetGameResponse
# from .services import 

achievement_bp = Blueprint('achievement', __name__, url_prefix='/achievement')