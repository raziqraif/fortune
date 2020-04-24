from datetime import datetime
from decimal import Decimal
from math import ceil

from werkzeug.exceptions import BadRequest

from db import db, Game, GameCoin, Coin, GameProfile, Profile, Report, Message


@db.atomic()
def create_report(issuer: Profile, message_id: int):
    message = Message.get_or_none(Message.id == message_id)
    if not message:
        raise BadRequest("Reported message id does not exist")

    report = Report.create(
        game=message.game,
        issuer=issuer.id,
        offender=message.profile,
        message=message_id,
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
        reports = reports.order_by(+Report.resolved, -Report.id)

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
        }).where(Report.id == report_id).execute()
    except:
        raise BadRequest("Failed to update report")

    if user_action == "none":
        return

    profile = Profile.get_or_none(Profile.id == report.offender.id)
    if not profile:
        raise BadRequest("Offender account could not be found.")

    elif user_action == "warning":
        from users.services import warn_user
        # warning = "Your message in {} game has been flagged as inappropriate/abusive. Repeated offense may result"\
        #           "in an account ban. Message: {}".format(report.game.name, report.flaggedMessage)
        warn_user(profile.id, message)

    elif user_action == "ban":
        from users.services import ban_user
        ban_user(profile.id)
