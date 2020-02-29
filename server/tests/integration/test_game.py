from datetime import datetime, timedelta
from http import HTTPStatus
import json

from db import db, Profile
from tests.utils import DbTest, AuthDbTest


class GameTest(AuthDbTest):

    def test_create_game_with_valid_info(self):
        res = self.client.post('/game/',
            data=json.dumps({
                'title': 'jfkldsajklfd',
                'startingCash': 42,
                'endsOn': (datetime.utcnow() + timedelta(days=7)).isoformat(),
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
