from tests.utils import IntegrationTest


class SmokeTest(IntegrationTest):
    def test_hello_world(self):
        res = self.client.get('/')
        self.assertEqual('hello world', res.data.decode())

