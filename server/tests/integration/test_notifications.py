import json
from http import HTTPStatus
import secrets

from db import *
from notifications.services import send_notification
from tests.utils import AuthDbTest


class NotificationsTest(AuthDbTest):

    def setUp(self):
        super().setUp()
        with db.atomic() as txn:
            self.profile = Profile.create(
                username='someusername',
                hashed_password='th3p455w0rd'
            )
            tok = 'correct-token'
            self.token = AuthToken.create(profile=self.profile, token=tok)
            profile = Profile.create(
                username='someotherusername',
                hashed_password='th3p455w0rd'
            )
            tok = 'correct-token1'
            AuthToken.create(profile=profile, token=tok)

    def test_send_notification_creates_notifications(self):
        msg = 'This is a notification'
        send_notification(self.profile, msg)
        Notification.get((Notification.content == msg) & (Notification.profile == self.profile))
    
    def test_create_price_alert(self):
        res = self.client.post('/alert',
            headers={
                'Authorization': f'Bearer {self.token.token}',
            },
            data=json.dumps({
                'strikePrice': '0.000',
                'coinId': 1,
                'type': 'above',
            }),
            content_type='application/json'
        )
        self.assertEqual(200, res._status_code)

    def test_create_and_get_price_alerts(self):
        res = self.client.post('/alert',
            headers={
                'Authorization': f'Bearer {self.token.token}',
            },
            data=json.dumps({
                'strikePrice': '0.000',
                'coinId': 1,
                'type': 'above',
            }),
            content_type='application/json'
        )
        self.assertEqual(200, res._status_code)
        res = self.client.get('/alert',
            headers={
                'Authorization': f'Bearer {self.token.token}',
            }
        )
        self.assertEqual(200, res._status_code)
        self.assertEqual(1, len(res.json))

    def test_create_price_alert_with_invalid_coin_id(self):
        res = self.client.post('/alert',
            headers={
                'Authorization': f'Bearer {self.token.token}',
            },
            data=json.dumps({
                'strikePrice': '0.000',
                'coinId': 42,
                'type': 'above',
            }),
            content_type='application/json'
        )
        self.assertEqual(400, res._status_code)

    def test_create_price_alert_with_invalid_type(self):
        res = self.client.post('/alert',
            headers={
                'Authorization': f'Bearer {self.token.token}',
            },
            data=json.dumps({
                'strikePrice': '0.000',
                'coinId': 1,
                'type': 'bla',
            }),
            content_type='application/json'
        )
        self.assertEqual(400, res._status_code)

    def test_create_price_alert_with_invalid_strike_price(self):
        res = self.client.post('/alert',
            headers={
                'Authorization': f'Bearer {self.token.token}',
            },
            data=json.dumps({
                'strikePrice': 'bla',
                'coinId': 1,
                'type': 'above',
            }),
            content_type='application/json'
        )
        self.assertEqual(400, res._status_code)
