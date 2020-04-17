from decimal import Decimal

from playhouse.migrate import PostgresqlMigrator, migrate

from db import MODELS, Coin, Game, GameProfile, Profile, GameCoin

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
        GameCoin.create(game=global_indef, coin=Coin.get())


def down(db):
    with db.atomic():
        migrator = PostgresqlMigrator(db)
        db.drop_tables(MODELS)
