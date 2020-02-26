from db import *
from datetime import datetime
from decimal import Decimal
import sys


def get_coin_from_symbol(symbol):
    if symbol == 'BTC':
        return 'Bitcoin'
    if symbol == 'ETH':
        return 'Ethereum'
    if symbol == 'LTC':
        return 'Litecoin'
    if symbol == 'ZEC':
        return 'Zcash'


def get_bitfinex_time(split):
    captured_at = datetime.strptime(split[0], '%Y-%m-%d %I-%p')
    return timestamp, captured_at


def insert_bitfinex_line(line):
    split = line.split(',')
    timestamp, captured_at = get_bitfinex_time(split)
    currency_pair = split[1]
    open, high, low, close, volume = tuple(split[2:])

    # TODO watch this! Not all currencies are 3 characters!!!
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


def get_gemini_time(split):
    """
    The gemini file has timestamps and also with date and time it was recorded,
    however the other files don't seem to have timestamps at all and some even
    format in a weird way...
    """
    captured_at = datetime.strptime(split[1], '%Y-%m-%d %H:%M:%S')
    return captured_at


def insert_gemini_line(line):
    split = line.split(',')
    captured_at = get_gemini_time(split)
    currency_pair = split[2]
    open, high, low, close, volume = tuple(split[3:])

    # TODO watch this! Not all currencies are 3 characters!!!
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
        lines = f.readlines()
        for line in lines[2:]:
            if filename.startswith('gemini'):
                insert_gemini_line(line)
            elif filename.startswith('Bitfinex'):
                insert_bitfinex_line(line)


@db.atomic()
def insert(*args):
    for filename in args:
        print(f'inserting {filename}')
        insert_file(filename)
    print(f'inserted {len(args)} files.')


if __name__ == '__main__':
    if len(sys.argv) <= 1:
        print('Usage: python insert_historical_data.py file1 [file2 file3...]')
        exit(1)
    insert(*sys.argv[1:])

