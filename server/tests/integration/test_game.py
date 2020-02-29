from datetime import datetime, timedelta
from http import HTTPStatus
import json
import pytz

from db import db, Profile, Coin
from tests.utils import DbTest, AuthDbTest


class GameTest(AuthDbTest):

    def setUp(self):
        super().setUp()
        with db.atomic() as txn:
            Coin.create(name='Bitcoin', symbol='BTC')
            Coin.create(name='Ethereum', symbol='ETH')
            Coin.create(name='Litecoin', symbol='LTC')

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
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.OK), res._status_code)
        res = self.client.get(f'/game/{res.json["id"]}/')
        self.assertEqual(int(HTTPStatus.OK), res._status_code)

    def test_get_game_with_invalid_pk_fails(self):
        res = self.client.get('/game/42')
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)

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
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)
        self.assertTrue('non-negative' in json.dumps(res.json))

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

