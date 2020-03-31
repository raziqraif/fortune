from decimal import Decimal

from playhouse.migrate import PostgresqlMigrator, migrate

from db import MODELS, Coin, Game, GameProfile, Profile


def up(db):
    with db.atomic():
        migrator = PostgresqlMigrator(db)
        db.bind(MODELS, bind_refs=False, bind_backrefs=False)
        db.create_tables(MODELS)
        Coin.create(name='Bitcoin', symbol='BTC')
        Coin.create(name='Ethereum', symbol='ETH')
        Coin.create(name='Litecoin', symbol='LTC')
        Coin.create(name='Coin 3', symbol='CO3')
        Coin.create(name='Coin 4', symbol='CO4')
        Coin.create(name='Coin 5', symbol='CO5')

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

        seed_coin = {"id": 1}  # Should correspond to Bitcoin

        create_game("DEMO",
                    Decimal(10000),
                    "DEMO",
                    "DEMO",
                    datetime(year=2022, month=1, day=1, hour=1, minute=1, second=0).replace(tzinfo=pytz.utc)
                    + timedelta(days=0),
                    [seed_coin],
                    superadmin
                    )
        # To demonstrate title truncating
        create_game("A Really Long Game Because Why Not",
                    Decimal(10000),
                    "LongGameLink",
                    "LongGameCode",
                    datetime(year=2022, month=1, day=1, hour=1, minute=1, second=0).replace(tzinfo=pytz.utc)
                    + timedelta(days=1),
                    [seed_coin],
                    admin
                    )
        for i in range(1, 131):
            create_game("Game " + str(i),
                        Decimal(10000),
                        "SHAREABLE_" + str(i),
                        "JOIN_" + str(i),
                        datetime(year=2022, month=1, day=1, hour=1, minute=1, second=0).replace(tzinfo=pytz.utc)
                        + timedelta(weeks=i),
                        [seed_coin],
                        admin
                        )


def down(db):
    with db.atomic():
        migrator = PostgresqlMigrator(db)
        db.drop_tables(MODELS)
