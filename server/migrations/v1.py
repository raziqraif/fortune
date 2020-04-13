from decimal import Decimal

from playhouse.migrate import PostgresqlMigrator, migrate

from db import MODELS, Coin, Game, GameProfile, Profile, GameCoin, Achievement


def up(db):
    with db.atomic():
        migrator = PostgresqlMigrator(db)
        db.bind(MODELS, bind_refs=False, bind_backrefs=False)
        db.create_tables(MODELS)
        Coin.create(name='Bitcoin', symbol='BTC')
        Coin.create(name='Ethereum', symbol='ETH')
        Coin.create(name='Litecoin', symbol='LTC')
        Coin.create(name='Dash', symbol='DASH')
        Coin.create(name='Coin 3', symbol='CO3')
        Coin.create(name='Coin 4', symbol='CO4')
        Coin.create(name='Coin 5', symbol='CO5')

        global_indef = Game.create(name='Global Indefinite',
                        starting_cash=10000.00,
                        shareable_link='INDEF',
                        shareable_code='INDEF',
                        ends_at=None)
        GameCoin.create(game=global_indef, coin=Coin.get())

        # insert achievements into database
        Achievement.create("win", "finish in first place in a private game")
        Achievement.create("double net worth", "achieved by doubling your net worth in a game")


def down(db):
    with db.atomic():
        migrator = PostgresqlMigrator(db)
        db.drop_tables(MODELS)
