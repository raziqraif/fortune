from flask import Blueprint, request, jsonify

import string
import random

from db import Game, GameProfile, Coin, db
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

    except Exception as e:
        return "Failure to create Game: {}".format(str(e))

    game.save()
    return "Game created. Game id={}".format(game.id)

@game_bp.route('/get', methods=['GET'])
def get():
    return str(Game.select().where(Game.id == request.args.get('id')))

@game_bp.route('/edit/<id>', methods=['POST'])
def edit():
    # edit game
    # try:
    #     game = Game.query.filter_by(id=id).first()
    #     game.starting_cash = request.args.get('starting_cash')
    #     game.shareable_link = request.args.get('sharable_link')
    #     game.shareable_code = request.args.get('sharable_code')
    #     game.ends_at = request.args.get('ends_at')
    # except Exception as e:
    #     return "Failure to edit Game: {}".format(str(e))
    
    # db.session.add(game)
    # db.session.commit()
    # return "Game edited. Game id={}".format(game.id)
    return "editing game"

def randomString(length):
    options = string.ascii_uppercase.join(string.digits)
    return ''.join(random.choice(options) for i in range(length))

