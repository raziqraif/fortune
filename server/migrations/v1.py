from decimal import Decimal

from playhouse.migrate import PostgresqlMigrator, migrate

from db import MODELS, Coin, Game, GameCoin, GameProfile, Profile
from datetime import datetime, timedelta

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
            print("ID = ", global_indef.id)
            GameCoin.create(game=global_indef, coin=Coin.get())
        # FIXME: After merge, make sure that Global games are created first before calling this function
        for_demo(db)


def for_demo(db):
    from datetime import datetime, timedelta
    import pytz
    from auth.services import register
    from game.services import create_game

    with db.atomic():
        superadmin = register("superadmin", "superadmin").profile
        admin = register("admin", "admin").profile

        active_coins = [{"id": i} for i in range(1, 4)]
        create_game("DEMO",
                    Decimal(10000),
                    "DEMO",
                    "DEMO",
                    datetime(year=2022, month=1, day=1, hour=1, minute=1, second=0).replace(tzinfo=pytz.utc)
                    + timedelta(days=0),
                    active_coins,
                    superadmin
                    )
        # To demonstrate title truncating
        create_game("A Really Long Game Title Because Why Not",
                    Decimal(10000),
                    "LongGameLink",
                    "LongGameCode",
                    datetime(year=2022, month=1, day=1, hour=1, minute=1, second=0).replace(tzinfo=pytz.utc)
                    + timedelta(days=1),
                    active_coins,
                    admin
                    )
        for i in range(1, 131):
            create_game("Game " + str(i),
                        Decimal(10000),
                        "SHAREABLE_" + str(i),
                        "JOIN_" + str(i),
                        datetime(year=2022, month=1, day=1, hour=1, minute=1, second=0).replace(tzinfo=pytz.utc)
                        + timedelta(weeks=i),
                        active_coins,
                        admin
                        )

def down(db):
    with db.atomic():
        migrator = PostgresqlMigrator(db)
        db.drop_tables(MODELS)
