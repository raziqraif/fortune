import datetime

import peewee
from playhouse.pool import PooledPostgresqlDatabase

import os

# FIXME research the specificity of each api's ticker prices
# WOW, just discovered a HUGE bug. Basically we can't do this, we must
# for some reason declare each DecimalField separately
DECIMAL_FIELD = peewee.DecimalField(max_digits=20, decimal_places=8)
DATABASE = {
    'HOST': os.environ['DB_HOST'],
    'NAME': os.environ['DB_NAME'],
    'USER': os.environ['DB_USER'],
    'PASSWORD': os.environ['DB_PASSWORD'],
}

db = PooledPostgresqlDatabase(
	DATABASE['NAME'],
	max_connections=None,
	stale_timeout=300,
	timeout=None,
	user=DATABASE['USER'],
	password=DATABASE['PASSWORD'],
	host = DATABASE['HOST'])

class BaseModel(peewee.Model):
    class Meta:
        database = db


class Profile(BaseModel):
    joined_at = peewee.DateTimeField(default=datetime.datetime.utcnow)
    username = peewee.TextField(unique=True)
    hashed_password = peewee.TextField()
    socket_id = peewee.TextField(unique=True, null=True)


class AuthToken(BaseModel):
    profile = peewee.ForeignKeyField(Profile, backref='auth_tokens')
    issued_at = peewee.DateTimeField(default=datetime.datetime.utcnow)
    token = peewee.TextField(unique=True)


class Game(BaseModel):
    name = peewee.TextField()
    starting_cash = peewee.DecimalField(max_digits=20, decimal_places=8)
    shareable_link = peewee.TextField(unique=True)
    shareable_code = peewee.TextField(unique=True)
    ends_at = peewee.DateTimeField(null=True)

    @property
    def coins(self):
        return list(Coin
            .select()
            .join(GameCoin)
            .join(Game)
            .where(GameCoin.game_id == self.id))


class GameProfile(BaseModel):
    game = peewee.ForeignKeyField(Game)
    profile = peewee.ForeignKeyField(Profile, backref='game_profiles')
    cash = peewee.DecimalField(max_digits=20, decimal_places=8)


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
    price = peewee.DecimalField(max_digits=20, decimal_places=8)
    captured_at = peewee.DateTimeField(default=datetime.datetime.utcnow)
    # don't want to take up precious db space?, just making a float
    price_change_day_pct =  peewee.DecimalField(max_digits=20, decimal_places=8, null=True)


class Trade(BaseModel):
    ticker = peewee.ForeignKeyField(Ticker, backref='trades')
    game_profile = peewee.ForeignKeyField(GameProfile, backref='trades')
    filled_at = peewee.DateTimeField(default=datetime.datetime.utcnow)
    # FIXME is this correct?
    type = peewee.TextField(choices=['buy', 'sell'])
    quantity = peewee.DecimalField(max_digits=20, decimal_places=8)


class GameProfileCoin(BaseModel):
    game_profile = peewee.ForeignKeyField(GameProfile)
    coin = peewee.ForeignKeyField(Coin)
    coin_amount = peewee.DecimalField(max_digits=20, decimal_places=8)

class Achievement(BaseModel):
    name = peewee.TextField(unique=True)
    description = peewee.TextField(unique=True)

class AchievementProfile(BaseModel):
    achievement = peewee.ForeignKeyField(Achievement)
    profile = peewee.ForeignKeyField(Profile, backref='achievement_profiles')
    achieved_at = peewee.DateTimeField(default=datetime.datetime.utcnow)

class Goal(BaseModel):
    name = peewee.TextField(unique=True)
    description = peewee.TextField(unique=True)

class GoalProfile(BaseModel):
    goal = peewee.ForeignKeyField(Goal)
    profile = peewee.ForeignKeyField(Profile, backref='goal_profiles')
    achieved_at = peewee.DateTimeField(default=datetime.datetime.utcnow)

class Notification(BaseModel):
    profile = peewee.ForeignKeyField(Profile)
    content = peewee.TextField()
    created_at = peewee.DateTimeField(default=datetime.datetime.utcnow)


class PriceAlert(BaseModel):
    profile = peewee.ForeignKeyField(Profile)
    above = peewee.BooleanField()
    created_at = peewee.DateTimeField(default=datetime.datetime.utcnow)
    coin = peewee.ForeignKeyField(Coin, backref='alerts')
    strike_price = peewee.DecimalField(max_digits=20, decimal_places=8)
    hit = peewee.BooleanField(default=False)

class Friends(BaseModel):
    requester = peewee.ForeignKeyField(Profile)
    requestee = peewee.ForeignKeyField(Profile)
    status = peewee.IntegerField() # 0 = pending, 1 = accept, 2 = reject

MODELS = [Profile, AuthToken, Game, GameProfile, Coin,
    GameCoin, Ticker, Trade, GameProfileCoin, Achievement, AchievementProfile, Notification, PriceAlert, Goal, GoalProfile, Friends]
