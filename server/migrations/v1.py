from datetime import datetime, timedelta
from decimal import Decimal

from playhouse.migrate import PostgresqlMigrator, migrate

from db import MODELS, Coin, Game, GameProfile, Profile, GameCoin, Achievement, Goal

def up(db):
    with db.atomic():
        migrator = PostgresqlMigrator(db)
        db.bind(MODELS, bind_refs=False, bind_backrefs=False)
        db.create_tables(MODELS)
        if Coin.get_or_none(Coin.id == 1) is None:
            Coin.create(name='Bitcoin', symbol='BTC')
            Coin.create(name='Ethereum', symbol='ETH')
            Coin.create(name='Litecoin', symbol='LTC')
            Coin.create(name='Coin 3', symbol='CO3')
            Coin.create(name='Coin 4', symbol='CO4')
            Coin.create(name='Coin 5', symbol='CO5')

        global_indef = Game.create(name='Global Indefinite',
                        starting_cash=10000.00,
                        shareable_link='INDEF',
                        shareable_code='INDEF',
                        ends_at=None)

        # insert achievements into database
        Achievement.create(name="Win", description="Finish in first place in a private game")
        Achievement.create(name="Double net worth", description="Achieved by doubling your net worth in a game")
        Achievement.create(name="Identity Crisis", description="Change your username")
        
        # insert goals into database
        Goal.create(name="Entrepreneur", description="Create a private game")

        all_coins = Coin.select()
        for coin in all_coins:
            GameCoin.create(game=global_indef, coin=coin)


        global_timed = Game.create(name='Global Timed',
                        starting_cash=10000.00,
                        shareable_link='TIMED',
                        shareable_code='TIMED',
                        ends_at=datetime.utcnow() + timedelta(minutes=1))
        # CHANGEME for devel purposes, making it 1 min for now
        GameCoin.create(game=global_timed, coin=Coin.get())

def down(db):
    with db.atomic():
        migrator = PostgresqlMigrator(db)
        db.drop_tables(MODELS)
