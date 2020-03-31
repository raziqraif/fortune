from playhouse.migrate import PostgresqlMigrator, migrate

import bcrypt
import pytz
from datetime import datetime, timedelta
from db import MODELS, Coin, Game, GameCoin, Profile, GameProfile, GameProfileCoin, Ticker


def up(db):
    with db.atomic():
        migrator = PostgresqlMigrator(db)
        db.bind(MODELS, bind_refs=False, bind_backrefs=False)
        db.create_tables(MODELS)
        if Coin.get_or_none(Coin.id == 1) is None:
            Coin.create(name='Bitcoin', symbol='BTC')
            Ticker.create(
                coin=1,
                price=1000.00,
                price_change_day_pct=1.2
            )
            Coin.create(name='Ethereum', symbol='ETH')
            Coin.create(name='Litecoin', symbol='LTC')
            Coin.create(name='Coin 3', symbol='CO3')
            Coin.create(name='Coin 4', symbol='CO4')
            Coin.create(name='Coin 5', symbol='CO5')

            Game.create(
                name='Global?',
                starting_cash=10000.00,
                shareable_link='GLOB',
                shareable_code='Global',
                ends_at=datetime.utcnow().replace(tzinfo=pytz.utc) + timedelta(days=7)
            )

            GameCoin.create(game=1, coin=1)
            GameCoin.create(game=1, coin=2)
            GameCoin.create(game=1, coin=3)

            Profile.create(
                username='username',
                hashed_password=bcrypt.hashpw('password'.encode(), bcrypt.gensalt()).decode()
            )

            GameProfile.create(
                game=1,
                profile=1,
                cash=6000.00
            )

            GameProfileCoin.create(
                game_profile=1,
                coin=1,
                coin_amount=0.1
            )


def down(db):
    with db.atomic():
        migrator = PostgresqlMigrator(db)
        db.drop_tables(MODELS)
