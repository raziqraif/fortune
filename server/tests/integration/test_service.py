from decimal import Decimal
import os
from unittest.mock import patch, Mock, MagicMock

from db import Ticker, Coin, PriceAlert, Profile, Notification
from scripts.service import ping
from tests.utils import DbTest


class TestService(DbTest):
    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
        # NOTE these must be actual coins defined in the migrations!
        {'symbol': 'BTC', 'price': '56.12345678', '1d': {'price_change_pct': '-2.33334567'}},
    ])))
    def test_parsing_with_one_coin(self):
        os.environ['NOMICS_BASE_URL'] = 'foo'
        ping('BTC')
        btc = Coin.get(Coin.symbol == 'BTC')
        btc_ticker = Ticker.get(Ticker.coin == btc)
        self.assertEqual(btc_ticker.price, Decimal('56.12345678'))
        self.assertEqual(btc_ticker.price_change_day_pct, Decimal('-2.33334567'))

    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
        # NOTE these must be actual coins defined in the migrations!
        {'symbol': 'BTC', 'price': '56.12345678', '1d': {'price_change_pct': '-1.23456789'}},
        {'symbol': 'ETH', 'price': '42.98765432', '1d': {'price_change_pct': '-8.98765432'}},
    ])))
    def test_parsing_with_many_coins(self):
        os.environ['NOMICS_BASE_URL'] = 'foo'
        ping('BTC', 'ETH')
        btc = Coin.get(Coin.symbol == 'BTC')
        eth = Coin.get(Coin.symbol == 'ETH')
        btc_ticker = Ticker.get(Ticker.coin == btc)
        eth_ticker = Ticker.get(Ticker.coin == eth)
        self.assertEqual(btc_ticker.price, Decimal('56.12345678'))
        self.assertEqual(btc_ticker.price_change_day_pct, Decimal('-1.23456789'))
        self.assertEqual(eth_ticker.price, Decimal('42.98765432'))
        self.assertEqual(eth_ticker.price_change_day_pct, Decimal('-8.98765432'))

    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
        # NOTE these must be actual coins defined in the migrations!
        {'symbol': 'FOO', 'price': '56.12345678', '1d': {'price_change_pct': '-2.33334567'}},
    ])))
    def test_price_alerts(self):
        os.environ['NOMICS_BASE_URL'] = 'foo'
        profile = Profile.create(username='theusername', hashed_password='thehashedpassword')
        coin = Coin.create(name='foocoin', symbol='FOO')
        alert = PriceAlert.create(
            profile=profile,
            above=True,
            coin=coin,
            strike_price=Decimal(0.1),
        )
        alert = PriceAlert.create(
            profile=profile,
            above=False,
            coin=coin,
            strike_price=Decimal(0.1),
        )
        ping('FOO')
        self.assertEqual(1, Notification.select().count())
        # ok, the line below throws an exception which causes all other tests to fail
        # as tearDown is not called and because db is in inconsistent state
        notif = Notification.get(Notification.profile == profile)
