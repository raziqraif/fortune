from datetime import datetime, timedelta
from decimal import Decimal

import pytz
from notifications.services import broadcast, send_notification
from werkzeug.exceptions import BadRequest
from db import db, Game, GameCoin, Coin, GameProfile, GameProfileCoin, Ticker, Profile


@db.atomic()
def get_users_except_admins():
    users = Profile.select().where(~Profile.is_admin, ~Profile.is_banned).execute()
    return users


@db.atomic()
def ban_user(profile_id: int):
    rows = Profile.update({Profile.is_banned: True}).where(Profile.id == profile_id).execute()
    if rows == 0:
        raise BadRequest("Cannot ban user")

    profile = Profile.get_or_none(Profile.id == profile_id)
    if not profile:
        raise BadRequest("Profile not found")
    print("BANNED PROFILE IS BANNED:", profile.is_banned)

    broadcast(profile, "ban", "Your account has been banned for violating our policy.", True)


@db.atomic()
def warn_user(profile_id, message):
    profile = Profile.get_or_none(Profile.id == profile_id)
    if not profile:
        raise BadRequest("Cannot find the user's profile.")

    send_notification(profile, "Warning: " + message)
