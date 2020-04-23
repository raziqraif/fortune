from datetime import datetime, timedelta
from decimal import Decimal

import pytz
from werkzeug.exceptions import BadRequest
from db import db, Game, GameCoin, Coin, GameProfile, GameProfileCoin, Ticker, Profile


@db.atomic()
def get_users_except_admins():
    users = Profile.select().where(~Profile.is_admin).execute()
    return users


@db.atomic()
def ban_user(profile_id: int):
    try:
        Profile.update(is_banned=True).where(Profile.id == profile_id)
    except:
        raise BadRequest("Cannot ban user")


@db.atomic()
def warn_user(profile_id, message):
    profile = Profile.get_or_none(Profile.id == profile_id)
    if not profile:
        raise BadRequest("Cannot find the user's profile.")

    from notifications.services import send_notification
    send_notification(profile, "Warning: " + message)
