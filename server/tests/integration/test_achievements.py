from datetime import datetime, timedelta
from http import HTTPStatus
from unittest.mock import Mock, patch, MagicMock
import json
import pytz

from db import db, AuthToken, Profile, Coin, Game, GameProfile, Ticker, Achievement, AchievementProfile
from tests.utils import DbTest, AuthDbTest


def mock_require_authentication():
    print('inside mock')
    def side_effect(route_func):
        print('inside side_effect')
        @wraps(route_func)
        def wrapper(*args, **kwargs):
            print('calling mocked')
            return route_func('todo standin profile', *args, **kwargs)
        return wrapper
    return MagicMock(side_effect=side_effect)

class GameTest(AuthDbTest):

    def setUp(self):
        super().setUp()
        with db.atomic() as txn:
            profile = Profile.create(username='theusername', hashed_password='thepassword')
            self.token = AuthToken.create(profile=profile, token='thevalidtoken').token

