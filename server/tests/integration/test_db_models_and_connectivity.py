import secrets

from tests.utils import DbTest

from db import *
from datetime import datetime

class DbTest(DbTest):
    
    def test_gamecoins(self):
        game = Game.create(
            name='The game',
            starting_cash=100,
            shareable_link='https://jfdksjalfldsa',
            shareable_code='1234abcd',
            ends_at=datetime.utcnow(),
        )
        btc = Coin.create(name='bitcoin', symbol='btc')
        eth = Coin.create(name='ethereum', symbol='eth')
        ltc = Coin.create(name='litecoin', symbol='ltc')
        gc1 = GameCoin.create(coin=btc, game=game)
        gc2 = GameCoin.create(coin=eth, game=game)
        self.assertCountEqual([btc, eth], list(game.coins))

    def test_querying_profile_authtokens_only_returns_own_authtokens(self):
        profile = Profile.create(
            username='someusername',
            hashed_password='th3p455w0rd'
        )
        # python docs recommend 32 bytes, although this is just a test. note for
        # future though
        # https://docs.python.org/3/library/secrets.html#how-many-bytes-should-tokens-use
        tok = secrets.token_urlsafe(32)
        auth_token = AuthToken.create(profile=profile, token=tok)
        profile1 = Profile.create(
            username='someotherusername',
            hashed_password='th3p455w0rd'
        )
        tok1 = secrets.token_urlsafe(32)
        auth_token1 = AuthToken.create(profile=profile1, token=tok1)

        self.assertCountEqual([auth_token], list(profile.auth_tokens))
        # check deep just to be safe...
        self.assertEqual(auth_token.token, profile.auth_tokens[0].token)
        self.assertCountEqual([auth_token1], list(profile1.auth_tokens))
        # check deep just to be safe...
        self.assertEqual(auth_token1.token, profile1.auth_tokens[0].token)

