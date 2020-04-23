from datetime import datetime, timedelta
from http import HTTPStatus
from unittest.mock import Mock, patch, MagicMock
import json
import pytz

from db import db, AuthToken, Profile, Coin, Game, GameProfile, GameCoin, Ticker, GameProfileCoin, Message
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
            self.game = Game.create(
                name='Game',
                starting_cash=10000.00,
                shareable_link='aaaabbbbccccdddd',
                shareable_code='aaaa',
                ends_at=(datetime.utcnow().replace(tzinfo=pytz.utc) + timedelta(days=7)).isoformat()
            )
            profile = Profile.create(username='username', hashed_password='password')
            GameProfile.create(game=self.game, profile=profile, cash=-1.0)
            Message.create(
                game=self.game.id,
                profile=profile.id,
                content="first message",
                # use default value for created_on
            )
            self.token = AuthToken.create(profile=profile, token='thevalidtoken').token

    # @patch('game.routes.require_authentication', mock_require_authentication())
    def test_get_messages_success(self):
        res = self.client.get('/game/{}/chat?oldestID=-1&newestID=-1&getNewMessages=true'.format(self.game.id),
                              headers={
                                  'Authorization': 'Bearer ' + self.token,
                              },
                              content_type='application/json',
                              )
        self.assertEqual(int(HTTPStatus.OK), res._status_code)

    # @patch('game.routes.require_authentication', mock_require_authentication())
    def test_send_message_success(self):
        res = self.client.post('/game/{}/chat'.format(self.game.id),
                               data=json.dumps({
                                    'message': "random message"
                               }),
                               headers={
                                   'Authorization': 'Bearer ' + self.token,
                               },
                               content_type='application/json',
                               )
        self.assertEqual(int(HTTPStatus.OK), res._status_code)

    # @patch('game.routes.require_authentication', mock_require_authentication())
    def test_send_message_fail(self):
        res = self.client.post('/game/{}/chat'.format(self.game.id),
                               data=json.dumps({
                                   'message': ""
                               }),
                               headers={
                                   'Authorization': 'Bearer ' + self.token,
                               },
                               content_type='application/json',
                               )
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)

    # @patch('game.routes.require_authentication', mock_require_authentication())
    def test_get_players_data_success(self):
        res = self.client.get('/game/{}/chat/players'.format(self.game.id),
                              headers={
                                  'Authorization': 'Bearer ' + self.token,
                              },
                              content_type='application/json',
                              )
        self.assertEqual(int(HTTPStatus.OK), res._status_code)

