from http import HTTPStatus
from unittest import TestCase
from unittest.mock import Mock, patch

from flask import request
from werkzeug.exceptions import BadRequest, Unauthorized

from auth.decorators import require_authentication
from db import AuthToken, Profile

@require_authentication
def route(profile):
    return profile


class TestRequireAuthentication(TestCase):
    def test_stops_missing_header(self):
        m = Mock()
        m.headers.get.return_value = None
        with patch('auth.decorators.request', m):
            with self.assertRaises(BadRequest) as cm:
                profile = route()
            self.assertEqual(HTTPStatus.BAD_REQUEST, cm.exception.code)
            self.assertEqual('Missing authorization token', cm.exception.description)

    def test_stops_missing_token(self):
        m = Mock()
        m.headers.get.return_value = 'Bearer'
        with patch('auth.decorators.request', m):
            with self.assertRaises(BadRequest) as cm:
                profile = route()
            self.assertEqual(HTTPStatus.BAD_REQUEST, cm.exception.code)
            self.assertEqual('Malformed Authorization header', cm.exception.description)

    @patch('auth.decorators.get_auth_token')
    def test_stops_incorrect_token(self, auth_token_mock):
        auth_token_mock.return_value = None
        m = Mock()
        m.headers.get.return_value = 'Bearer invalid-token'
        with patch('auth.decorators.request', m):
            with self.assertRaises(Unauthorized) as cm:
                profile = route()
            self.assertEqual(HTTPStatus.UNAUTHORIZED, cm.exception.code)
            self.assertEqual('Invalid token', cm.exception.description)
        auth_token_mock.assert_called_with('invalid-token')

    @patch('auth.decorators.get_auth_token')
    def test_allows_correct_token(self, auth_token_mock):
        stub_profile = Profile(
            username='theusername',
            hashed_password='th3p455w0rd',
        )
        stub_authtoken = AuthToken(
            profile=stub_profile,
            token='valid-token',
        )
        auth_token_mock.return_value = stub_authtoken
        m = Mock()
        m.headers.get.return_value = 'Bearer valid-token'
        with patch('auth.decorators.request', m):
            profile = route()
            self.assertEqual(stub_profile.username, profile.username)
            self.assertEqual(stub_profile.hashed_password, profile.hashed_password)
        auth_token_mock.assert_called_with('valid-token')

