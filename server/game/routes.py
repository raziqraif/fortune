from flask import Blueprint, request, jsonify

import string
import random

from db import Game, GameProfile, Coin, GameCoin, db
from .serializers import GameCreateRequest

game_bp = Blueprint('game', __name__, url_prefix='/game')


#TODO
# We probably need a better way to generate shareable link, code, and ID.
@game_bp.route('/new_game', methods=['POST'])
def create():
    validated_data: dict = GameCreateRequest.deserialize(request.json)
    ends_at = validated_data['endsOn']
    starting_cash = validated_data['startingCash']
    name = validated_data['title']
    id = random.randrange(10000)
    shareable_link = randomString(16)
    shareable_code = randomString(4)
    try:
        game = Game.create(
            id = id,
            name = name,
            starting_cash = starting_cash,
            shareable_link = shareable_link,
            shareable_code = shareable_code,
            ends_at = ends_at
        )
        for coin in validated_data['activeCoins']:
            GameCoin.create(
                game = game,
                coin = Coin.get(Coin.id == coin['id'])
            )

    except Exception as e:
        return "Failure to create Game: {}".format(str(e))

    game.save()
    return "Game created. Game id={}".format(game.id)

@game_bp.route('/get', methods=['GET'])
def get():
    return str(Game.select().where(Game.id == request.args.get('id')))

@game_bp.route('/edit', methods=['POST'])
def edit():
    # edit game
    validated_data: dict = GameCreateRequest.deserialize(request.json)
    
    try:
        q = Game.update({
            Game.ends_at: validated_data['endsOn'],
            Game.starting_cash: validated_data['startingCash'],
            Game.name: validated_data['title']
        }).where(Game.id == request.args.get('id'))
        q.execute()
    except Exception as e:
        return "Failure to edit Game: {}".format(str(e))
    
    return "Game id={} formatted".format(request.args.get('id'))

def randomString(length):
    options = string.ascii_uppercase.join(string.digits)
    return ''.join(random.choice(options) for i in range(length))

