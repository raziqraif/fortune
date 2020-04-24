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
    profile
):
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
    coins_query = Coin.select().join(GameCoin).where(GameCoin.game == game_id)
    if coins_query.count() == 0:
        raise BadRequest('Coins not found')
    coins = []
    for coin in coins_query:
        coins.append(coin)
    return coins


@db.atomic()
def get_game_profile_by_profile_id_and_game_id(profile_id, game_id):
    game_profile = GameProfile.get_or_none(GameProfile.game == game_id, GameProfile.profile == profile_id)
    if not game_profile:
        raise BadRequest('User not in game')
    return game_profile


@db.atomic()
def get_game_profile_coins_by_game_profile_id(game_profile_id):
    game_profile_coins_query = GameProfileCoin.select().where(GameProfileCoin.game_profile == game_profile_id)
    if game_profile_coins_query.count() == 0:
        return []
    game_profile_coins = []
    for gpc in game_profile_coins_query:
        game_profile_coins.append(gpc)
    return game_profile_coins


@db.atomic()
def get_coins_by_game_id_and_sorting(game_id, sorting_int, page_num, num_per_page):
    coins_query = Coin.select().join(GameCoin).where(GameCoin.game == game_id)
    if coins_query.count() == 0:
        raise BadRequest('Incorrect Sorting')
    if sorting_int == 1:
        coins_query = coins_query.order_by(+Coin.name)
    if sorting_int == 2:
        coins_query = coins_query.order_by(-Coin.name)
    if sorting_int == 3:
        coins_query = coins_query.order_by(-Coin.price)  # TODO: Double check if this should +/-
    if sorting_int == 4:
        coins_query = coins_query.order_by(+Coin.price)  # TODO: Double check if this should +/-

    coins_query = coins_query.paginate(page_num, num_per_page)
    coins = []
    for coin in coins_query:
        coins.append(coin)
    return coins


@db.atomic()
def get_pricing_by_coins(coins, start_time):
    coins_and_prices = []
    for currentCoin in coins:
        prices_query = Ticker.select()\
            .join(Coin)\
            .where(Coin.id == currentCoin.id, Ticker.captured_at > start_time)\
            .order_by(-Ticker.captured_at)
        if prices_query.count() == 0:
            raise BadRequest("Coin's prices not found")

        prices = []
        for price in prices_query:
            prices.append(price)
        coins_and_prices.append({
            'coin': currentCoin,
            'prices': prices
        })
    return coins_and_prices


def get_start_time_from_time_span(time_span_int):
    if time_span_int == 0:
        return datetime.utcnow() - timedelta(hours=1)
    if time_span_int == 1:
        return datetime.utcnow() - timedelta(days=1)
    if time_span_int == 2:
        return datetime.utcnow() - timedelta(weeks=1)
    if time_span_int == 3:
        return datetime.utcnow() - timedelta(weeks=4)
    if time_span_int == 4:
        return datetime.utcnow() - timedelta(weeks=52)
    raise BadRequest("Time span invalid: {}".format(str(time_span_int)))

@db.atomic()
def get_net_worth_by_game_profile_id(game_profile_id):
    gameProfile = GameProfile.get_or_none(GameProfile.id == game_profile_id)
    if not gameProfile:
        raise BadRequest('User not in game')

    netWorth = gameProfile.cash

    gameProfileCoins = get_game_profile_coins_by_game_profile_id(game_profile_id)
    for gameProfileCoin in gameProfileCoins:
        ticker = Ticker.select().where(Ticker.coin == gameProfileCoin.coin).order_by(Ticker.captured_at.desc())
        if ticker.count() == 0:
            raise BadRequest('One coin did not have prices')
        ticker = ticker.get()
        if not ticker:
            raise BadRequest('One coin did not exist')
        netWorth += ticker.price * gameProfileCoin.coin_amount
    return netWorth

@db.atomic()
def buy_coin(coin_id, coin_amount, game_profile):
    ticker = Ticker.select().where(Ticker.coin == coin_id).order_by(Ticker.captured_at.desc())
    if ticker.count() == 0:
        raise BadRequest('Coin has no prices')
    ticker = ticker.get()
    new_cash = game_profile.cash - (ticker.price * coin_amount)
    if new_cash < 0:
        raise BadRequest('Not enough cash to buy this coin amount')
    game_coin = GameCoin.get_or_none(GameCoin.game == game_profile.game, GameCoin.coin == coin_id)
    if game_coin is None:
        raise BadRequest('Coin does not exist in this game')
    gameProfileCoin = GameProfileCoin.get_or_none(GameProfileCoin.game_profile == game_profile.id,
                                                  GameProfileCoin.coin == coin_id)

    if gameProfileCoin is None:
        GameProfileCoin.create(
            game_profile=game_profile.id,
            coin=coin_id,
            coin_amount=coin_amount
        )

        rows = GameProfile.update(cash=new_cash).where(GameProfile == game_profile).execute()

        if rows == 0:
            raise BadRequest('Money could not be removed from your account')
        return coin_amount
    else:
        new_coin_amount = gameProfileCoin.coin_amount + coin_amount
        rows = GameProfile.update(cash=new_cash).where(GameProfile == game_profile).execute()
        if rows == 0:
            raise BadRequest('Money could not be removed from your account')
        GameProfileCoin.update(coin_amount=new_coin_amount).where(GameProfileCoin.id == gameProfileCoin.id).execute()
        return new_coin_amount


@db.atomic()
def sell_coin(coin_id, coin_amount, game_profile):
    gameProfileCoin = GameProfileCoin.get_or_none(GameProfileCoin.game_profile == game_profile.id, GameProfileCoin.coin == coin_id)
    if gameProfileCoin is None or gameProfileCoin.coin_amount < coin_amount:
        raise BadRequest('Not enough of these coins to sell')
    ticker = Ticker.select().where(Ticker.coin == coin_id).order_by(Ticker.captured_at.desc())
    if ticker.count() == 0:
        raise BadRequest('Coin has no prices')
    ticker = ticker.get()
    new_cash = game_profile.cash + (ticker.price * coin_amount)
    new_coin_amount = gameProfileCoin.coin_amount - coin_amount
    GameProfileCoin.update(coin_amount=new_coin_amount).where(GameProfileCoin.id == gameProfileCoin.id).execute()
    GameProfile.update(cash=new_cash).where(GameProfile.id == game_profile.id).execute()
    return new_coin_amount
