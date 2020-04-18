from http import HTTPStatus
import json
import bcrypt

from db import *
from tests.utils import AuthDbTest

class ProfileTests(AuthDbTest):
    def setUp(self):
        super().setUp()
        with db.atomic() as txn:
            self.profile = Profile.create(
                username='username',
                hashed_password=bcrypt.hashpw('password'.encode(), bcrypt.gensalt()).decode()
            )
            self.token = AuthToken.create(profile=self.profile, token='validtoken').token
            self.headers = {
                'Authorization': 'Bearer ' + self.token
            }

    def test_change_username_with_existing_username(self):
        res = self.client.put('/auth/username',
            data=json.dumps({
                'username': 'username'
            }),
            headers=self.headers,
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)

    def test_change_username_success(self):
        new_username = 'new username'
        res = self.client.put('/auth/username',
            data=json.dumps({
                'username': new_username
            }),
            headers=self.headers,
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.OK), res._status_code)
        existing_profile = Profile.get_or_none(Profile.id == self.profile.id)
        assert existing_profile is not None
        self.assertEqual(existing_profile.username, new_username)

    def test_change_password_with_incorrect_old_password(self):
        res = self.client.put('/auth/password',
            data=json.dumps({
                'oldPassword': 'not_password',
                'newPassword': 'newPassword',
            }),
            headers=self.headers,
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.BAD_REQUEST), res._status_code)

    def test_change_password_success(self):
        new_password = 'new_password'
        res = self.client.put('/auth/password',
            data=json.dumps({
                'oldPassword': 'password',
                'newPassword': new_password
            }),
            headers=self.headers,
            content_type='application/json',
        )
        self.assertEqual(int(HTTPStatus.OK), res._status_code)
        existing_profile = Profile.get_or_none(Profile.id == self.profile.id)
        assert existing_profile is not None
        assert bcrypt.checkpw(new_password.encode(), existing_profile.hashed_password.encode())