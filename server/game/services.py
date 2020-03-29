from datetime import datetime, timedelta
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
    gameProfile = GameProfile.get_or_none(GameProfile.game == game_id, GameProfile.profile == profile_id)
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
def get_coins_by_game_id_and_sorting(game_id, sorting_int, page_num, num_per_page):
    if sorting_int == 0:
        coins = Coin.select().join(GameCoin).where(GameCoin.game == game_id).paginate(page_num, num_per_page)
    if sorting_int == 1:
        coins = Coin.select().join(GameCoin).where(GameCoin.game == game_id).order_by(+Coin.name)
    if sorting_int == 2:
        coins = Coin.select().join(GameCoin).where(GameCoin.game == game_id).order_by(-Coin.name)
    if sorting_int == 3:
        coins = Coin.select().join(GameCoin).where(GameCoin.game == game_id).order_by(-Coin.price)
    if sorting_int == 4:
        coins = Coin.select().join(GameCoin).where(GameCoin.game == game_id).order_by(+Coin.price)        
    if not coins:
        raise BadRequest('Incorrect Sorting')
    return coins

@db.atomic()
def get_pricing_by_coins(coins, start_time):
    coins_and_prices = []
    for currentCoin in coins:
        prices = Ticker.select().join(Coin).where(Coin.id == currentCoin.id, Ticker.captured_at > start_time).order_by(-Ticker.captured_at)
        if not prices:
            raise BadRequest("Coin's prices not found")
        coins_and_prices.append({
            'coin': currentCoin,
            'prices': prices
        })
    return coins_and_prices

def get_start_time_from_time_span(time_span_int):
    if time_span_int == 0:
        return datetime.utcnow() - timedelta(hours = 1)
    if time_span_int == 1:
        return datetime.utcnow() - timedelta(days = 1)
    if time_span_int == 2:
        return datetime.utcnow() - timedelta(days = 7)
    if time_span_int == 3:
        return datetime.utcnow() - timedelta(months = 1)
    if time_span_int == 4:
        return datetime.utcnow() - timedelta(years = 1)
    raise BadRequest("Time span invalid: {}".format(str(time_span_int)))
