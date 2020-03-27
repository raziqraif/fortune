import json

from main import SocketIO

from tests.utils import DbTest, AuthDbTest
from db import Profile


class SmokeTest(AuthDbTest):
    def test_hello_world(self):
        res = self.client.get('/')
        self.assertEqual('hello world', res.data.decode())

    def test_can_create_db_record(self):
        username = 'someuser'
        profile = Profile.create(username=username, hashed_password='fksdjfj')
        self.assertEqual(username, profile.username)
        profile.delete_instance()

    def test_test_websocket_client_builder(self):
        sc = self.socketio.test_client(self.app, flask_test_client=self.client)
    
    def test_websocket_connection(self):
        sc = self.socketio.test_client(self.app, flask_test_client=self.client)
        self.assertTrue(sc.is_connected())

    def test_can_use_server_while_using_websocket(self):
        sc = self.socketio.test_client(self.app, flask_test_client=self.client)
        self.assertTrue(sc.is_connected())
        res = self.client.get('/')
        self.assertEqual('hello world', res.data.decode())

    def test_robust_can_use_server_while_using_websocket(self):
        sc = self.socketio.test_client(self.app, flask_test_client=self.client)
        self.assertTrue(sc.is_connected())
        res = self.client.post(
            '/auth/register',
            data=json.dumps({'username': 'theusername', 'password': 'password'}),
            content_type='application/json'
        )
        self.assertEqual(200, res._status_code)
        res = self.client.post(
            '/auth/login',
            data=json.dumps({'username': 'theusername', 'password': 'password'}),
            content_type='application/json'
        )
        self.assertEqual(200, res._status_code)
