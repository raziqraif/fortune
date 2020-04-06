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
            AuthToken.create(profile=self.profile, token=tok)
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
