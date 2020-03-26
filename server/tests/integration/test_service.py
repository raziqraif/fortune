from decimal import Decimal
import os
from unittest.mock import patch, Mock, MagicMock

from db import Ticker, Coin
from scripts.service import ping
from tests.utils import DbTest


class TestService(DbTest):
    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
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
        {'symbol': 'BTC', 'price': '56.12345678', '1d': {'price_change_pct': '-2.33334567'}},
    ])))
    def test_parsing_with_many_ping_calls(self):
        os.environ['NOMICS_BASE_URL'] = 'foo'
        ping('BTC')
        btc = Coin.get(Coin.symbol == 'BTC')
        btc_ticker = Ticker.get(Ticker.coin == btc)
        self.assertEqual(btc_ticker.price, Decimal('56.12345678'))
        self.assertEqual(btc_ticker.price_change_day_pct, Decimal('-2.33334567'))
        Ticker.delete().execute()
        ping('BTC')
        btc = Coin.get(Coin.symbol == 'BTC')
        btc_ticker = Ticker.get(Ticker.coin == btc)
        self.assertEqual(btc_ticker.price, Decimal('56.12345678'))
        self.assertEqual(btc_ticker.price_change_day_pct, Decimal('-2.33334567'))

    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
    ])))
    def test_parsing_with_no_coins(self):
        os.environ['NOMICS_BASE_URL'] = 'foo'
        num_tickers_before = Ticker.select().count()
        ping()
        num_tickers_after = Ticker.select().count()
        self.assertEqual(num_tickers_before, num_tickers_after)

    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
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
        {'symbol': 'DASH', 'price': '56.12345678', '1d': {'price_change_pct': '-1.23456789'}},
    ])))
    def test_parsing_with_four_character_symbol(self):
        os.environ['NOMICS_BASE_URL'] = 'foo'
        ping('DASH')
        dash = Coin.get(Coin.symbol == 'DASH')
        ticker = Ticker.get(Ticker.coin == dash)
        self.assertEqual(ticker.price, Decimal('56.12345678'))
        self.assertEqual(ticker.price_change_day_pct, Decimal('-1.23456789'))

    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
        {'symbol': 'FOO', 'price': '56.12345678', '1d': {'price_change_pct': '-1.23456789'}},
    ])))
    def test_raises_error_if_token_not_exists(self):
        os.environ['NOMICS_BASE_URL'] = 'foo'
        with self.assertRaises(Exception):
            ping('FOO')

