from decimal import Decimal
import os
import random
import time

import requests

from db import db, Coin, Ticker


NOMICS_API_KEY = os.environ['NOMICS_API_KEY']
NOMICS_BASE_URL = 'https://api.nomics.com/v1'
WAIT = 10


def get_api_url(*coins):
    return f'{NOMICS_BASE_URL}/currencies/ticker?ids={",".join(coins)}&key={NOMICS_API_KEY}'


@db.atomic()
def ping(*coins):
    res = requests.get(get_api_url(*coins))
    for coin_res in res.json():
        symbol = coin_res['symbol']
        coin = Coin.get(Coin.symbol == symbol)
        price = Decimal(coin_res['price'])
        print(f'{symbol}: {price}')
        Ticker.create(coin=coin, price=price)


def stubbed(*coins):
    for coin in coins:
        last_ticker = (Ticker
            .select()
            .where(Ticker.coin == coin)
            .order_by(Ticker.captured_at.desc())
            .limit(1))
        if last_ticker.count() == 0:
            price = random.uniform(500, 12000)
            print(f'Creating first ticker for {coin.symbol}: {price}')
            Ticker.create(coin=coin, price=price)
        else:
            new_price = last_ticker.get().price * Decimal(random.uniform(0.98, 1.02))
            print(f'{coin.symbol}: {new_price}')
            Ticker.create(coin=coin, price=new_price)


def begin():
    env = os.environ['FLASK_ENV']
    if env == 'testing':
        # TODO stubbed implementation
        return
    elif env == 'development':
        if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
            return
        coins = Coin.select()
        while True:
            stubbed(*coins)
            time.sleep(WAIT)
    elif env == 'production':
        while True:
            ping('BTC', 'ETH', 'LTC')
            time.sleep(WAIT)


if __name__ == '__main__':
    begin()

