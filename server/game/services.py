from datetime import datetime
from decimal import Decimal

from werkzeug.exceptions import BadRequest

from db import db, Game, GameCoin, Coin


@db.atomic()
def create_gamecoins_for_game(game, active_coins):
    for coin in active_coins:
        coin = Coin.get_or_none(Coin.id == coin['id'])
        if coin is None:
            raise BadRequest('Invalid coin')
        yield GameCoin.create(
            game=game,
            coin=coin,
        )


@db.atomic()
def create_game(
    name,
    starting_cash,
    shareable_link,
    shareable_code,
    ends_at,
    active_coins):
    # bounds check, validate
    if ends_at < datetime.utcnow():
        raise BadRequest('Invalid game ending date')
    if starting_cash < Decimal(0):
        raise BadRequest('Starting cash must be non-negative')
    game = Game.create(
        name=name,
        starting_cash=starting_cash,
        shareable_link=shareable_link,
        shareable_code=shareable_code,
        ends_at=ends_at,
    )
    game = create_gamecoins_for_game(game, active_coins)
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
    for coin in active_coins:
        coin 
        GameCoin.create(
            game=game,
            coin=coin
        )
    game = create_gamecoins_for_game(game, active_coins)
    return game
