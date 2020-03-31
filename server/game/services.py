from datetime import datetime
from decimal import Decimal

import pytz
from werkzeug.exceptions import BadRequest

from db import db, Game, GameCoin, Coin, GameProfile, GameProfileCoin, Ticker


@db.atomic()
def create_gamecoins_for_game(game, active_coins):
    if len(active_coins) == 0:
        raise BadRequest('At least one coin must be allowed in a game')
    res = []
    for coin in active_coins:
        coin = Coin.get_or_none(Coin.id == coin['id'])
        if coin is None:
            raise BadRequest('Invalid coin')
        res.append(GameCoin.create(
            game=game,
            coin=coin,
        ))
    return res


@db.atomic()
def create_game(
    name,
    starting_cash,
    shareable_link,
    shareable_code,
    ends_at,
    active_coins,
    profile):
    # bounds check, validate
    if ends_at < datetime.utcnow().replace(tzinfo=pytz.utc):
        raise BadRequest('Invalid game ending date')
    if starting_cash <= Decimal(0):
        raise BadRequest('Starting cash must be positive')
    game = Game.create(
        name=name,
        starting_cash=starting_cash,
        shareable_link=shareable_link,
        shareable_code=shareable_code,
        ends_at=ends_at,
    )
    create_gamecoins_for_game(game, active_coins)
    GameProfile.create(
        game=game,
        profile=profile,
        cash=game.starting_cash,
    )
    return game

@db.atomic()
def update_game(
    game_id,
    name,
    starting_cash,
    ends_at,
    active_coins,
    ):
    game = Game.get_or_none(Game.id == game_id)
    if not game:
        raise BadRequest(f'A game with id {game_id} does not exist')
    game.name = name
    game.starting_cash = starting_cash
    game.ends_at = ends_at
    # delete all GameCoins for this game and just re-create
    GameCoin.delete().where(Game.id == game_id)
    create_gamecoins_for_game(game, active_coins)
    return game


@db.atomic()
def get_game_by_id(game_id):
    game = Game.get_or_none(Game.id == game_id)
    if not game:
        raise BadRequest('Game not found')
    return game

@db.atomic()
def get_coins_by_game_id(game_id):
    coins = Coin.select().join(GameCoin).where(GameCoin.game == game_id)
    if not coins:
        raise BadRequest('Coins not found')
    return coins

@db.atomic()
def get_game_profile_by_profile_id_and_game_id(profile_id, game_id):
    gameProfile = GameProfile.get_or_none(GameProfile.game == game_id and GameProfile.profile == profile_id)
    if not gameProfile:
        raise BadRequest('User not in game')
    return gameProfile

@db.atomic()
def get_game_profile_coins_by_game_profile_id(game_profile_id):
    gameProfileCoins = GameProfileCoin.select().where(GameProfileCoin.game_profile == game_profile_id)
    if not gameProfileCoins:
        return []
    return gameProfileCoins

@db.atomic()
def buy_coin(coin_id, coin_amount, game_profile):
    ticker = Ticker.select().where(Ticker.coin == coin_id).order_by(Ticker.captured_at.desc()).get()
    new_cash = game_profile.cash - (ticker.price * coin_amount)
    if new_cash < 0:
        raise BadRequest('Not enough cash to buy this coin amount')
    gameProfileCoin = GameProfileCoin.get_or_none(GameProfileCoin.game_profile == game_profile.id, GameProfileCoin.coin == coin_id)
    if gameProfileCoin is None:
        GameProfileCoin.create(
            game_profile = game_profile.id,
            coin = coin_id,
            coin_amount = coin_amount
        )
        GameProfile.update(cash=new_cash).where(GameProfile.id == game_profile.id)
        return coin_amount
    else:
        new_coin_amount = gameProfileCoin.coin_amount + coin_amount
        GameProfileCoin.update(coin_amount=new_coin_amount).where(GameProfileCoin.id == gameProfileCoin.id)
        GameProfile.update(cash=new_cash).where(GameProfile.id == game_profile.id)
        return new_coin_amount

@db.atomic()
def sell_coin(coin_id, coin_amount, game_profile):
    gameProfileCoin = GameProfileCoin.get_or_none(GameProfileCoin.game_profile == game_profile.id, GameProfileCoin.coin == coin_id)
    if gameProfileCoin is None or gameProfileCoin.coin_amount < coin_amount:
        raise BadRequest('Not enough of these coins to sell')
    ticker = Ticker.select().where(Ticker.coin == coin_id).order_by(Ticker.captured_at.desc()).get()
    new_cash = game_profile.cash + (ticker.price * coin_amount)
    new_coin_amount = gameProfileCoin.coin_amount - coin_amount
    GameProfileCoin.update(coin_amount=new_coin_amount).where(GameProfileCoin.id == gameProfileCoin.id)
    GameProfile.update(cash=new_cash).where(GameProfile.id == game_profile.id)
    return new_coin_amount
