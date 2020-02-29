import importlib
import os
import sys

from db import DATABASE

from playhouse.migrate import PostgresqlDatabase

def migrate(up_or_down, version):
    db = PostgresqlDatabase(
        DATABASE['NAME'],
        user=DATABASE['USER'],
        password=DATABASE['PASSWORD'],
        host = DATABASE['HOST'],
    )
    if up_or_down == 'up':
        mod = importlib.import_module(version)
        mod.up(db)
    elif up_or_down == 'down':
        mod = importlib.import_module(version)
        mod.down(db)
    else:
        raise Exception('Must specify "up" or "down" for migration')

if __name__ == '__main__':
    migrate(*sys.argv[1:])