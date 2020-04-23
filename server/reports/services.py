from datetime import datetime
from decimal import Decimal
from math import ceil

from werkzeug.exceptions import BadRequest

from db import db, Game, GameCoin, Coin, GameProfile, Profile, Report


@db.atomic()
def create_report(game_id, issuer_id, offender_id, flagged_message):
    game = Game.get_or_none(Game.id == game_id)
    issuer = Profile.get_or_none(Profile.id == issuer_id)
    offender = Profile.get_or_none(Profile.id == offender_id)
    if not game:
        raise BadRequest("Game could not be found")
    if not issuer:
        raise BadRequest("Issuer's profile could not be found")
    if not offender:
        raise BadRequest("Offender's profile could not be found")

    report = Report.create(
        game=game.id,
        issuer=issuer.id,
        offender=offender.id,
        flagged_message=flagged_message,
    )
    return report


@db.atomic()
def get_reports_at_page(page: int, page_size: int, sort_by_status_descending: bool):
    """ Returns
        - reports in the requested page (sorted by criteria)
        - total reports
    """

    page_size = max(page_size, 1)
    page = max(page, 1)

    reports = Report.select()

    if sort_by_status_descending:
        reports = reports.order_by(+Report.resolved)

    total_reports = reports.count()
    reports = reports.paginate(page, page_size).execute()

    return reports, total_reports


@db.atomic()
def update_report(report_id, user_action, message):
    report: Report = Report.get_or_none(Report.id == report_id)
    if not report:
        raise BadRequest("Report does not exist")
    try:
        Report.update({
            Report.takenAction: user_action,
            Report.resolved: True
        }).where(Report.id == report_id)
    except:
        raise BadRequest("Failed to update report")

    if user_action == "None":
        return

    profile = Profile.get_or_none(Profile.id == report.offender.id)
    if not profile:
        raise BadRequest("Offender account could not be found.")

    elif user_action == "Warning":
        from users.services import warn_user
        # warning = "Your message in {} game has been flagged as inappropriate/abusive. Repeated offense may result"\
        #           "in an account ban. Message: {}".format(report.game.name, report.flaggedMessage)
        warn_user(profile.id, message)

    elif user_action == "Ban":
        from users.services import ban_user
        ban_user(profile.id)
