from datetime import datetime
from decimal import Decimal
import sys

from db import *


def get_coin_from_symbol(symbol):
    if symbol == 'BTC':
        return 'Bitcoin'
    if symbol == 'ETH':
        return 'Ethereum'
    if symbol == 'LTC':
        return 'Litecoin'
    if symbol == 'ZEC':
        return 'Zcash'


def insert_gemini_line(line):
    split = line.split(',')
    timestamp = datetime.utcfromtimestamp(int(split[0]))
    captured_at = datetime.strptime(split[1], '%Y-%m-%d %H:%M:%S')
    currency_pair = split[2]
    open, high, low, close, volume = tuple(split[3:])

    coin_symbol = currency_pair[:3]
    fiat_symbol = currency_pair[3:]
    assert fiat_symbol == 'USD'
    coin = Coin.get_or_none(Coin.symbol == coin_symbol)
    if coin is None:
        coin = Coin.create(
            name=get_coin_from_symbol(coin_symbol),
            symbol=coin_symbol,
        )
    return Ticker.create(
        coin=coin,
        price=Decimal(close),
        captured_at=captured_at,
    )


def insert_file(filename):
    with open(filename) as f:
        lines = f.lines()
        for line in lines[2:]:
            if filename.startswith('gemini'):
                insert_gemini_line(line)


def insert(*args):
    for filename in args:
        insert_file(filename)


if __name__ == '__main__':
    insert(sys.argv[1:])

