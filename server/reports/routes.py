from flask import Blueprint, jsonify, request, json
from typing import List
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound

from auth.decorators import require_authentication
from db import Profile
# from .serializers import
# from .services import

reports_bp = Blueprint('reports', __name__, url_prefix='/reports')


@reports_bp.route('/', methods=['GET'])
@require_authentication
def get_reports(profile):
    if not profile.is_admin:
        raise Unauthorized("You don't have permission")   # FIXME: This redirects to Login page. We probably dont want
        # that

    return jsonify({})


@reports_bp.route('/', methods=['POST'])
@require_authentication
def create_reports(profile):

    return jsonify({})


@reports_bp.route('/<report_id>', methods=['POST'])
@require_authentication
def create_reports(profile, report_id):

    return jsonify({})


@reports_bp.route('/<report_id>', methods=['PUT'])
@require_authentication
def create_reports(profile, report_id):

    return jsonify({})

