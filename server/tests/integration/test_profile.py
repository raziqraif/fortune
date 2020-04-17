from http import HTTPStatus
import json

from db import *
from tests.utils import AuthDbTest

class ProfileTests(AuthDbTest):
    def setUp(self):
        super().setUp()
        with db.atomic() as txn:
            self.profile = Profile.create(
                username='username',
                hashed_password='password'
            )
            self.token = AuthToken.create(profile=self.profile, token='validtoken').token

    def test_change_username_with_existing_username(self):
        res = self.client.put('/auth/username',
            data=json.dumps({
                'username': 'username'
            }),
            headers={
                'Authorization': 'Bearer ' + self.token,
            },
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)

    def test_change_username_success(self):
        new_username = 'new username'
        res = self.client.put('/auth/username',
            data=json.dumps({
                'username': new_username
            }),
            headers={
                'Authorization': 'Bearer ' + self.token,
            },
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.OK), res._status_code)
        existing_profile = Profile.get_or_none(Profile.id == self.profile.id)
        assert existing_profile is not None
        self.assertEqual(existing_profile.username, new_username)