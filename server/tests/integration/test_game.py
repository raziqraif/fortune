from datetime import datetime, timedelta
from http import HTTPStatus
from unittest.mock import Mock, patch, MagicMock
import json
import pytz

from db import db, Profile, Coin, AuthToken
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

    # @patch('game.routes.require_authentication', mock_require_authentication())
    def test_create_game_with_valid_info(self):
        res = self.client.post('/game/',
            data=json.dumps({
                'title': 'jfkldsajklfd',
                'startingCash': 42,
                'endsOn': (datetime.utcnow().replace(tzinfo=pytz.utc) + timedelta(days=7)).isoformat(),
                'activeCoins': [
                    {
                        'id': 1,
                        'name': 'Bitcoin'
                    }
                ]
            }),
            headers={
                'Authorization': 'Bearer ' + self.token,
            },
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.OK), res._status_code)
        res = self.client.get(f'/game/{res.json["id"]}/', headers={
            'Authorization': 'Bearer ' + self.token
        })
        self.assertEqual(int(HTTPStatus.OK), res._status_code)

    def test_get_game_with_invalid_pk_fails(self):
        res = self.client.get('/game/42')
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)

    @patch('auth.decorators.get_auth_token', MagicMock(return_value=Mock(profile='hi')))
    def test_get_game_with_invalid_starting_cash_fails(self):
        res = self.client.post('/game/',
            data=json.dumps({
                'title': 'jfkldsajklfd',
                'startingCash': 'hi',
                'endsOn': (datetime.utcnow().replace(tzinfo=pytz.utc) + timedelta(days=7)).isoformat(),
                'activeCoins': [
                    {
                        'id': 1,
                        'name': 'Bitcoin'
                    }
                ]
            }),
            headers={
                'Authorization': 'Bearer ' + self.token,
            },
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)
        res = self.client.post('/game/',
            data=json.dumps({
                'title': 'jfkldsajklfd',
                'startingCash': -1000,
                'endsOn': (datetime.utcnow().replace(tzinfo=pytz.utc) + timedelta(days=7)).isoformat(),
                'activeCoins': [
                    {
                        'id': 1,
                        'name': 'Bitcoin'
                    }
                ]
            }),
            headers={
                'Authorization': 'Bearer ' + self.token,
            },
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)
        self.assertTrue('positive' in json.dumps(res.json))

    def test_get_game_with_invalid_active_coin_fails(self):
        res = self.client.post('/game/',
            data=json.dumps({
                'title': 'jfkldsajklfd',
                'startingCash': 42,
                'endsOn': (datetime.utcnow().replace(tzinfo=pytz.utc) + timedelta(days=7)).isoformat(),
                'activeCoins': [
                    {
                        'id': 42,
                        'name': 'InvalidCoin'
                    }
                ]
            }),
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)

    def test_get_game_with_invalid_ends_on_date_fails(self):
        res = self.client.post('/game/',
            data=json.dumps({
                'title': 'jfkldsajklfd',
                'startingCash': 42,
                'endsOn': (datetime.utcnow().replace(tzinfo=pytz.utc) - timedelta(minutes=1)).isoformat(),
                'activeCoins': [
                    {
                        'id': 1,
                        'name': 'Bitcoin'
                    }
                ]
            }),
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)

