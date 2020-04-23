from datetime import datetime, timedelta
from decimal import Decimal

import pytz
from werkzeug.exceptions import BadRequest
from db import db, Game, GameCoin, Coin, GameProfile, GameProfileCoin, Ticker, Profile


@db.atomic()
def get_users_except_admins():
    users = Profile.select().where(~Profile.is_admin).execute()
    return users
