from flask import Blueprint, jsonify, request, json
from typing import List
from werkzeug.exceptions import BadRequest, Unauthorized, NotFound

from db import Report as ReportDB
from auth.decorators import require_authentication
from reports.serializers import ReportsResponse, Profile, Report, Game, UpdateReport, CreateReport
from reports.services import create_report, update_report, get_reports_at_page

reports_bp = Blueprint('reports', __name__, url_prefix='/reports')


@reports_bp.route('/', methods=['GET'])
@require_authentication
def reports_route(profile):
    if not profile.is_admin:
        raise Unauthorized("You don't have permission")   # FIXME: This redirects to Login page. We probably dont want
        # that

    try:
        page_size = int(request.args.get('numPerPage'))
        page = int(request.args.get('page'))
        sort_by_status_descending = request.args.get('sortByStatusDescending') == "true"
    except:
        raise BadRequest('Invalid parameters')

    reports: List[ReportDB]
    reports, total_reports = get_reports_at_page(page, page_size, sort_by_status_descending)

    resp = ReportsResponse()
    resp.reports = []
    resp.totalItems = total_reports
    for rpt in reports:
        issuer = Profile()
        issuer.id = rpt.issuer.id
        issuer.username = rpt.issuer.name
        offender = Profile()
        offender.id = rpt.offender.id
        offender.username = rpt.offender.name
        game = Game()
        game.id = rpt.game.id
        game.title = rpt.game.id

    return jsonify(ReportsResponse.serialize(resp))


@reports_bp.route('/', methods=['POST'])
@require_authentication
def create_report_route(profile):

    validated_data: dict = CreateReport.deserialize(request.json)
    game_id = validated_data["gameID"]
    offender_id = validated_data["offenderID"]
    flagged_message = validated_data["flaggedMessage"]
    issuer_id = profile.id

    create_report(game_id, issuer_id, offender_id, flagged_message)

    return jsonify({})


@reports_bp.route('/<report_id>', methods=['PUT'])
@require_authentication
def update_report_route(profile, report_id):
    if not profile.is_admin:
        raise Unauthorized("You don't have permission")   # FIXME: This redirects to Login page. We probably dont want
        # that
    validated_data: dict = UpdateReport.deserialize(request.json)
    user_action = validated_data['userAction']
    message = validated_data['message']

    update_report(report_id, user_action, message)

    return jsonify({})

