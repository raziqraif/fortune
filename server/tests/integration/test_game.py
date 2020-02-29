from tests.utils import DbTest

from db import Profile


class GameTest(DbTest):
    def test_create_game_with_invalid_starting_cash(self):
        res = self.client.post('/game')
