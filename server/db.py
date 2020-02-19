import datetime

import peewee

# FIXME research the specificity of each api's ticker prices
DECIMAL_FIELD = peeweee.DecimalField(max_digits=20, decimal_places=8)
db = PooledPostgresqlDatabase(
	'fortune_db',
	max_connections=None,
	stale_timeout=300,
	timeout=None,
	user='postgres',
	password='cs307team11',
	host = 'fortune-db.cxu1dfkxusyr.us-east-2.rds.amazonaws.com')
	
class BaseModel(peewee.Model):
    class Meta:
        # TODO put the database here
        database = db


class Profile(BaseModel):
    joined_at = peewee.DateTimeField(default=datetime.datetime.utcnow)
    username = peewee.TextField(unique=True)
    hashed_password = peewee.TextField()


class AuthToken(BaseModel):
    profile = peewee.ForeignKeyField(Profile, backref='auth_tokens')
    issued_at = peewee.DateTimeField(default=datetime.datetime.utcnow)
    token = peewee.TextField(unique=True)


class Game(BaseModel):
    name = peewee.TextField(unique=True)
    starting_cash = DECIMAL_FIELD
    shareable_link = peewee.TextField(unique=True)
    shareable_code = peewee.TextField(unique=True)
    ends_at = peewee.DateTimeField()

    @property
    def coins(self):
        # TODO tyler please do this
        raise NotImplementedError


class GameProfile(BaseModel):
    game = peewee.ForeignKeyField(Game)
    profile = peewee.ForeignKeyField(Profile, backref='game_profiles')
    cash = DECIMAL_FIELD


class Coin(BaseModel):
    name = peewee.TextField(unique=True)
    symbol = peewee.TextField(unique=True)


class GameCoin(BaseModel):
    """
    NOTE: Don't use this, we could provide `@property`s on Game and Coin to join
    each together, this is more of a mapping class, see the design document
    """
    game = peewee.ForeignKeyField(Game)
    coin = peewee.ForeignKeyField(Coin)


class Ticker(BaseModel):
    coin = peewee.ForeignKeyField(Coin, backref='tickers')
    price = DECIMAL_FIELD
    captured_at = peewee.DateTimeField(default=datetime.datetime.utcnow)


class Trade(BaseModel):
    ticker = peewee.ForeignKeyField(Ticker, backref='trades')
    game_profile = peewee.ForeignKeyField(GameProfile, backref='trades')
    filled_at = peewee.DateTimeField(default=datetime.datetime.utcnow)
    # FIXME is this correct?
    type = peewee.TextField(choices=['buy', 'sell'])
    quantity = DECIMAL_FIELD


class GameProfileCoin(BaseModel):
    game_profile = peewee.ForeignKeyField(GameProfile)
    coin = peewee.ForeignKeyField(Coin)
    coin_amount = DECIMAL_FIELD

