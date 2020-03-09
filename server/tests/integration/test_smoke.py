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

