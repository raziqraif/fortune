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
            self.profile1 = Profile.create(
                username='someotherusername',
                hashed_password='th3p455w0rd'
            )
            tok = 'correct-token1'
            self.token1 = AuthToken.create(profile=self.profile1, token=tok)

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
    
    def test_users_can_access_only_own_notifications(self):
        msg = 'This is a notification'
        send_notification(self.profile, msg)
        Notification.get((Notification.content == msg) & (Notification.profile == self.profile))
        res = self.client.get(
            '/notification',
            headers={'Authorization': 'Bearer ' + self.token.token}
        )
        self.assertEqual(200, res._status_code)
        self.assertEqual(1, len(res.json['notifications']))

        res = self.client.get(
            '/notification',
            headers={'Authorization': 'Bearer ' + self.token1.token}
        )
        self.assertEqual(200, res._status_code)
        self.assertEqual(0, len(res.json['notifications']))

    def test_users_can_access_only_own_price_alerts(self):
        PriceAlert.create(
            profile=self.profile,
            above=True,
            coin=Coin.get_by_id(1),
            strike_price=100000,
        )
        res = self.client.get(
            '/alert',
            headers={'Authorization': 'Bearer ' + self.token.token}
        )
        self.assertEqual(200, res._status_code)
        self.assertEqual(1, len(res.json))

        res = self.client.get(
            '/alert',
            headers={'Authorization': 'Bearer ' + self.token1.token}
        )
        self.assertEqual(200, res._status_code)
        self.assertEqual(0, len(res.json))
