from decimal import Decimal
import os
from unittest import TestCase
from unittest.mock import call, patch, Mock, MagicMock

from db import Coin, Ticker
from scripts.service import get_api_url, ping


class TestService(TestCase):

    def test_get_api_url(self):
        url = get_api_url('BTC')
        self.assertEqual('https://api.nomics.com/v1/currencies/ticker?ids=BTC&key=foo', url)
        url = get_api_url('BTC', 'ETH')
        self.assertEqual('https://api.nomics.com/v1/currencies/ticker?ids=BTC,ETH&key=foo', url)
        url = get_api_url('BTC', 'ETH', 'LTC')
        self.assertEqual('https://api.nomics.com/v1/currencies/ticker?ids=BTC,ETH,LTC&key=foo', url)
    
    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
        {'symbol': 'FOO', 'price': '56.12345678', '1d': {'price_change_pct': '-1.23456789'}}
    ])))
    @patch('scripts.service.Coin')
    @patch('scripts.service.Ticker')
    @patch('scripts.service.check_price_alerts')
    def test_parsing_with_one_coin(self, check_price_alerts_mock, mock_ticker, mock_coin):
        mock_coin.get.return_value = Coin(symbol='FOO', name='Foocoin')
        ping('FOO')
        mock_ticker.create.assert_called_with(
            coin=mock_coin.get.return_value,
            price=Decimal('56.12345678'),
            price_change_day_pct=Decimal('-1.23456789'),
        )

    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
    ])))
    @patch('scripts.service.Coin')
    @patch('scripts.service.Ticker')
    def test_parsing_with_no_coins(self, mock_ticker, mock_coin):
        ping()
        mock_ticker.assert_not_called()
        mock_coin.assert_not_called()

    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
        {'symbol': 'FOO', 'price': '56.12345678', '1d': {'price_change_pct': '-1.23456789'}},
        {'symbol': 'BAR', 'price': '42.98765432', '1d': {'price_change_pct': '-1.23456789'}},
    ])))
    @patch('scripts.service.Coin')
    @patch('scripts.service.Ticker')
    @patch('scripts.service.check_price_alerts')
    def test_parsing_with_many_coins(self, check_price_alerts_mock, mock_ticker, mock_coin):
        side_effect = [
            Coin(symbol='FOO', name='Foocoin'),
            Coin(symbol='BAR', name='Barcoin'),
        ]
        mock_coin.get.side_effect = side_effect
        ping('FOO', 'BAR')
        calls = [
            call(
                coin=side_effect[0],
                price=Decimal('56.12345678'),
                price_change_day_pct=Decimal('-1.23456789'),
            ),
            call(
                coin=side_effect[1],
                price=Decimal('42.98765432'),
                price_change_day_pct=Decimal('-1.23456789'),
            ),
        ]
        mock_ticker.create.assert_has_calls(calls, any_order=False)

    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
        {'symbol': 'FOO', 'price': '56.12345678', '1d': {'price_change_pct': '-1.23456789'}},
        {'symbol': 'BAR', 'price': '42.98765432', '1d': {'price_change_pct': '-1.23456789'}},
    ])))
    @patch('scripts.service.Coin')
    @patch('scripts.service.Ticker')
    @patch('scripts.service.check_price_alerts')
    def test_parsing_with_many_ping_calls(self, check_price_alerts_mock, mock_ticker, mock_coin):
        side_effect = [
            Coin(symbol='FOO', name='Foocoin'),
            Coin(symbol='BAR', name='Barcoin'),
        ]
        mock_coin.get.side_effect = side_effect
        ping('FOO', 'BAR')
        calls = [
            call(
                coin=side_effect[0],
                price=Decimal('56.12345678'),
                price_change_day_pct=Decimal('-1.23456789'),
            ),
            call(
                coin=side_effect[1],
                price=Decimal('42.98765432'),
                price_change_day_pct=Decimal('-1.23456789'),
            ),
        ]
        mock_ticker.create.assert_has_calls(calls, any_order=False)

        mock_coin.get.side_effect = side_effect
        ping('FOO', 'BAR')
        calls = [
            call(
                coin=side_effect[0],
                price=Decimal('56.12345678'),
                price_change_day_pct=Decimal('-1.23456789'),
            ),
            call(
                coin=side_effect[1],
                price=Decimal('42.98765432'),
                price_change_day_pct=Decimal('-1.23456789'),
            ),
        ]
        mock_ticker.create.assert_has_calls(calls, any_order=False)

    @patch('requests.get', MagicMock(return_value=Mock(json=None)))
    @patch('scripts.service.Coin')
    @patch('scripts.service.Ticker')
    def test_crashes_with_empty_api_response(self, mock_ticker, mock_coin):
        with self.assertRaises(Exception):
            ping('FOO')
