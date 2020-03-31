from datetime import datetime
from decimal import Decimal
from math import ceil

from werkzeug.exceptions import BadRequest

from db import db, Game, GameCoin, Coin, GameProfile, Profile


@db.atomic()
def get_game_with_code(code: str):
    game = Game.get_or_none(Game.shareable_code == code)
    return game


@db.atomic()
def add_to_game(profile_id, game):
    game_profile = GameProfile.select().where(GameProfile.profile == profile_id,
                                              GameProfile.game == game.id)
    if game_profile.count() == 0:
        GameProfile.create(
            game=game.id,
            profile=profile_id,
            cash=game.starting_cash
        )
