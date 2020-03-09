import os
import time

import requests

from db import db, Coin, Ticker


NOMICS_API_KEY = os.environ['NOMICS_API_KEY']
NOMICS_BASE_URL = 'https://api.nomics.com/v1'
WAIT = 10


@db.atomic()
def ping(*coins):
    res = requests.get(f'{NOMICS_BASE_URL}/currencies/ticker?ids={",".join(coins)}&key={NOMICS_API_KEY}')
    for coin_res in res.json():
        symbol = coin_res['symbol']
        coin = Coin.get(Coin.symbol == symbol)
        price = coin_res['price']
        print(f'{symbol}: {price}')
        Ticker.create(coin=coin, price=price)


def begin():
    while True:
        ping('BTC', 'ETH', 'LTC')
        time.sleep(WAIT)


if __name__ == '__main__':
    begin()

