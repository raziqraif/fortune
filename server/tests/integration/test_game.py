from http import HTTPStatus

from db import db, Profile
from tests.utils import DbTest


class GameTest(DbTest):

    def setUp(self):
        super().setUp()

    def test_create_game_with_invalid_starting_cash(self):
        res = self.client.post('/game', headers={
            'Authorization': 'Bearer'
        })
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)

        res = self.client.get('/testauth', headers={
            'Authorization': 'Bearer '
        })
        self.assertEqual(int(HTTPStatus.UNAUTHORIZED), res._status_code)

        res = self.client.get('/testauth', headers={
            'Authorization': 'Bearer incorrect-token'
        })
        self.assertEqual(int(HTTPStatus.UNAUTHORIZED), res._status_code)
