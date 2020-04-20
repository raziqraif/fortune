from decimal import Decimal
from datetime import datetime, timedelta
import os
import random
import sys
import time

import requests

from db import db, Coin, Ticker, PriceAlert
from notifications.services import send_notification


NOMICS_API_KEY = os.environ['NOMICS_API_KEY']
NOMICS_BASE_URL = 'https://api.nomics.com/v1'
WAIT = 10


def get_api_url(*coins):
    return f'{NOMICS_BASE_URL}/currencies/ticker?ids={",".join(coins)}&key={NOMICS_API_KEY}'


def check_price_alerts(latest_ticker: Ticker):
    # only get non-hit alerts
    alerts = PriceAlert.select().where((PriceAlert.hit == False) & (PriceAlert.coin == latest_ticker.coin))
    for alert in alerts:
        if alert.above:
            if alert.strike_price < latest_ticker.price:
                send_notification(alert.profile, f'{latest_ticker.coin.name} is now above {alert.strike_price}!')
                alert.hit = True
                alert.save()
        else:
            if alert.strike_price > latest_ticker.price:
                send_notification(alert.profile, f'{latest_ticker.coin.name} is now below {alert.strike_price}!')
                alert.hit = True
                alert.save()


@db.atomic()
def ping(*coins):
    res = requests.get(get_api_url(*coins))
    tickers = []
    for coin_res in res.json():
        symbol = coin_res['symbol']
        coin = Coin.get(Coin.symbol == symbol)
        price = Decimal(coin_res['price'])
        price_change_day_pct = Decimal(coin_res['1d']['price_change_pct'])
        print(f'{symbol}: {price} {price_change_day_pct}%')
        ticker = Ticker.create(coin=coin, price=price, price_change_day_pct=price_change_day_pct)
        tickers.append(ticker)
        check_price_alerts(ticker)
    return tickers


def stubbed(*coins):
    tickers = []
    for coin in coins:
        last_ticker = (Ticker
            .select()
            .where(Ticker.coin == coin)
            .order_by(Ticker.captured_at.desc())
            .limit(1))
        if last_ticker.count() == 0:
            price = random.uniform(500, 12000)
            print(f'Creating first ticker for {coin.symbol}: {price} 0%')
            ticker = Ticker.create(
                coin=coin,
                price=price,
                price_change_day_pct=0,
            )
            tickers.append(ticker)
        else:
            last_ticker = last_ticker.get()
            new_price = last_ticker.price * Decimal(random.uniform(0.98, 1.02))
            price_change_day_pct = (new_price - last_ticker.price) / last_ticker.price
            print(f'{coin.symbol}: {new_price} {price_change_day_pct}%')
            ticker = Ticker.create(coin=coin, price=new_price, price_change_day_pct=price_change_day_pct)
            check_price_alerts(ticker)
            tickers.append(ticker)
    return tickers


def begin(cb=None):
    env = os.environ['FLASK_ENV']
    if env == 'testing':
        # TODO stubbed implementation
        return
    elif env == 'development':
        if os.environ.get('WERKZEUG_RUN_MAIN') != 'true':
            return
        while True:
            coins = Coin.select()
            tickers = list(stubbed(*coins))
            if cb is not None:
                cb(tickers)
            time.sleep(WAIT)
    elif env == 'production':
        while True:
            tickers = list(ping('BTC', 'ETH', 'LTC'))
            if cb is not None: cb(tickers)
            time.sleep(WAIT)



@db.atomic()
def get_tickers_24hr():
    yesterday = datetime.utcnow() - timedelta(days=1)
    tickers = Ticker.select().where(Ticker.captured_at > yesterday)
    if not tickers:
        return []
    return tickers
