from datetime import datetime
from decimal import Decimal

from werkzeug.exceptions import BadRequest

from db import db, Game, GameCoin, Coin


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
    for coin in active_coins:
        coin = Coin.get_or_none(Coin.id == coin['id'])
        if coin is None:
            raise BadRequest('Invalid coin')
        GameCoin.create(
            game=game,
            coin=coin,
        )
    return game
