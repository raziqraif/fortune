from flask import Blueprint, request, jsonify
import os
import secrets
from uuid import uuid4

import string
import random

from db import Game, GameProfile, Coin, GameCoin, db
from .serializers import GameCreateRequest, CreateGameResponse
from .services import create_game, update_game

game_bp = Blueprint('game', __name__, url_prefix='/game')


#TODO
# We probably need a better way to generate shareable link, code, and ID.
@game_bp.route('/', methods=['POST'])
def create():
    validated_data: dict = GameCreateRequest.deserialize(request.json)
    ends_at = validated_data['endsOn']
    starting_cash = validated_data['startingCash']
    name = validated_data['title']
    shareable_link = f'{os.environ["HTTP_HOST"]}/game/{str(uuid4())}'
    shareable_code = randomString(4)
    active_coins = validated_data['activeCoins']
    game = create_game(
        name,
        starting_cash,
        shareable_link,
        shareable_code,
        ends_at,
        active_coins
    )
    return jsonify(CreateGameResponse.serialize(game))

@game_bp.route('/<game_id>', methods=['GET'])
def get(game_id):
    print(game_id)
    if not game_id:
        return jsonify(CreateGameResponse.serialize(Game.select(), many=True))
    return jsonify(CreateGameResponse.serialize(Game.get_or_none(Game.id == game_id)))

@game_bp.route('/<game_id>', methods=['PUT'])
def edit(game_id):
    # edit game
    validated_data: dict = GameCreateRequest.deserialize(request.json)
    update_game(
        game_id,
        validated_data['name'],
        validated_data['startingCash'],
        validated_data['endsOn'],
        active_coins=validated_data['activeCoins'],
    )
    
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

