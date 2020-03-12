from datetime import datetime
from decimal import Decimal
import json
import os
import random
import sys
import time

import psycopg2
from psycopg2.extras import NamedTupleCursor
import requests

from db import db, Coin, Ticker, DATABASE
from scripts.serializers import TickersResponse


NOMICS_API_KEY = os.environ['NOMICS_API_KEY']
NOMICS_BASE_URL = 'https://api.nomics.com/v1'
WAIT = 3


def get_api_url(*coins):
    return f'{NOMICS_BASE_URL}/currencies/ticker?ids={",".join(coins)}&key={NOMICS_API_KEY}'


DATABASE = {
    'host': DATABASE['HOST'],
    'dbname': DATABASE['NAME'],
    'user': DATABASE['USER'],
    'password': DATABASE['PASSWORD'],
}

#@db.atomic()
def ping(*coins):
    conn = psycopg2.connect(**DATABASE)
    cur = conn.cursor(cursor_factory=NamedTupleCursor)
    res = requests.get(get_api_url(*coins))
    for coin_res in res.json():
        symbol = coin_res['symbol']
        cur.execute('select id from coin where symbol = %s', (symbol,))
        coin_id = cur.fetchone()
        #coin = Coin.get(Coin.symbol == symbol)
        price = Decimal(coin_res['price'])
        price_change_day_pct = Decimal(coin_res['1d']['price_change_pct'])
        print(f'{symbol}: {price} {price_change_day_pct}%')
        cur.execute("""
            insert into ticker (coin_id, price, price_change_day_pct)
            values (%s, %s, %s) returning *
        """, (coin_id, price, price_change_day_pct))
        yield cur.fetchone()
        #yield Ticker.create(coin=coin, price=price, price_change_day_pct=price_change_day_pct)
    cur.close()
    conn.close()


def stubbed():
    conn = psycopg2.connect(**DATABASE)
    cur = conn.cursor(cursor_factory=NamedTupleCursor)
    res = []
    cur.execute('select id from coin')
    for coin_id in cur.fetchall():
        #last_ticker = (Ticker
        #    .select()
        #    .where(Ticker.coin == coin)
        #    .order_by(Ticker.captured_at.desc())
        #    .limit(1))
        cur.execute("""
            select * from ticker where coin_id = %s order by captured_at desc
            limit 1
        """, (coin_id,))
        last_ticker = cur.fetchone()
        if last_ticker is None:
            price = random.uniform(500, 12000)
            print(f'Creating first ticker for {coin_id}: {price} 0%')
            cur.execute("""
                insert into ticker (coin_id, price, price_change_day_pct, captured_at) values
                (%s, %s, %s, %s) returning *
            """, (coin_id, price, 0, datetime.utcnow()))
            #res.append(Ticker.create(
            #    coin=coin,
            #    price=price,
            #    price_change_day_pct=0,
            #))
            res.append(cur.fetchone())
        else:
            #last_ticker = last_ticker.get()
            new_price = last_ticker.price * Decimal(random.uniform(0.98, 1.02))
            price_change_day_pct = (new_price - last_ticker.price) / last_ticker.price
            print(f'{coin_id}: {new_price} {price_change_day_pct}%')
            cur.execute("""
                insert into ticker (coin_id, price, price_change_day_pct,
                captured_at) values (%s, %s, %s, %s) returning *
            """, (coin_id, new_price, price_change_day_pct, datetime.utcnow()))
            #res.append(Ticker.create(coin=coin, price=new_price, price_change_day_pct=price_change_day_pct))
            res.append(cur.fetchone())
    conn.commit()
    cur.close()
    conn.close()
    return res


def begin(socketio):
    env = os.environ['FLASK_ENV']
    if env == 'testing':
        # TODO stubbed implementation
        return
    elif env == 'development':
        #while True:
        #    socketio.emit('message', 'hiiii')
        #    time.sleep(WAIT)
        #if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        #    return
        #coins = Coin.select()
        # while True:
        #     socketio.emit('message', 'hiiii')
        #     time.sleep(WAIT)
        while True:
            tickers = list(stubbed())
            print('emitting hi===================', flush=True)
            socketio.emit('message', 'hi')
            socketio.emit('message', json.dumps(TickersResponse.serialize(tickers, many=True)))
            time.sleep(WAIT)
    elif env == 'production':
        while True:
            tickers = list(ping('BTC', 'ETH', 'LTC'))
            socketio.emit('message', json.dumps(TickersResponse.serialize(tickers, many=True)))
            time.sleep(WAIT)

