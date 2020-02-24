from http import HTTPStatus
import secrets

from db import *
from tests.utils import AuthDbTest


class RequireAuthenticationTest(AuthDbTest):

    def setUp(self):
        profile = Profile.create(
            username='someusername',
            hashed_password='th3p455w0rd'
        )
        tok = 'correct-token'
        auth_token = AuthToken.create(profile=profile, token=tok)

    def tearDown(self):
        AuthToken.delete().where(AuthToken.token == 'correct-token')
        Profile.delete().where(Profile.username == 'someusername')

    def test_stops_missing_header(self):
        res = self.client.get('/testauth')
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)

    def test_stops_missing_token(self):
        res = self.client.get('/testauth', headers={
            'Authorization': ''
        })
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)

    def test_stops_incorrect_token(self):
        res = self.client.get('/testauth', headers={
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

    def test_allows_correct_token(self):
        res = self.client.get('/testauth', headers={
            'Authorization': 'Bearer correct-token'
        })
        self.assertEqual(int(HTTPStatus.OK), res._status_code)

