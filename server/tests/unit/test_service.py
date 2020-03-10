from decimal import Decimal
import os
from unittest import TestCase
from unittest.mock import call, patch, Mock, MagicMock

from db import Coin, Ticker
from scripts.service import get_api_url, ping


class TestService(TestCase):

    def test_get_api_url(self):
        os.environ['NOMICS_BASE_URL'] = 'foo'
        url = get_api_url('BTC')
        self.assertEqual('https://api.nomics.com/v1/currencies/ticker?ids=BTC&key=foo', url)
        url = get_api_url('BTC', 'ETH')
        self.assertEqual('https://api.nomics.com/v1/currencies/ticker?ids=BTC,ETH&key=foo', url)
        url = get_api_url('BTC', 'ETH', 'LTC')
        self.assertEqual('https://api.nomics.com/v1/currencies/ticker?ids=BTC,ETH,LTC&key=foo', url)
    
    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [{'symbol': 'FOO', 'price': '56.12345678'}])))
    @patch('scripts.service.Coin')
    @patch('scripts.service.Ticker')
    def test_parsing_with_one_coin(self, mock_ticker, mock_coin):
        mock_coin.get.return_value = Coin(symbol='FOO', name='Foocoin')
        os.environ['NOMICS_BASE_URL'] = 'foo'
        ping('FOO')
        mock_ticker.create.assert_called_with(coin=mock_coin.get.return_value, price=Decimal('56.12345678'))

    @patch('requests.get', MagicMock(return_value=Mock(json=lambda: [
        {'symbol': 'FOO', 'price': '56.12345678'},
        {'symbol': 'BAR', 'price': '42.98765432'},
    ])))
    @patch('scripts.service.Coin')
    @patch('scripts.service.Ticker')
    def test_parsing_with_many_coins(self, mock_ticker, mock_coin):
        side_effect = [
            Coin(symbol='FOO', name='Foocoin'),
            Coin(symbol='BAR', name='Barcoin'),
        ]
        mock_coin.get.side_effect = side_effect
        os.environ['NOMICS_BASE_URL'] = 'foo'
        ping('FOO', 'BAR')
        calls = [
            call(coin=side_effect[0], price=Decimal('56.12345678')),
            call(coin=side_effect[1], price=Decimal('42.98765432')),
        ]
        mock_ticker.create.assert_has_calls(calls, any_order=False)

