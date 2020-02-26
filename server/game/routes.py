from flask import Blueprint, request, jsonify

from db import Game, GameProfile, Coin, db
from .serializers import GameCreateRequest

game_bp = Blueprint('game', __name__, url_prefix='/game')


@game_bp.route('/new_game', methods=['POST'])
def create():
    # TODO handle create game
    validated_data: dict = GameCreateRequest.deserialize(request.json)
    ends_at = validated_data['endsOn']
    starting_cash = validated_data['startingCash']
    name = validated_data['title']
    shareable_link = "ABCDEFG"
    shareable_code = "TUVWXYZ"
    try:
        game = Game.create(
            name = name,
            starting_cash = starting_cash,
            shareable_link = shareable_link,
            shareable_code = shareable_code,
            ends_at = ends_at
        )

    except Exception as e:
        return "Failure to create Game: {}".format(str(e))
    
    print("Game is ", game)

    game.save()
    # return "Game created. Game id={}".format(game.id)
    return validated_data

@game_bp.route('/get', methods=['GET'])
def get():
    return Game.get(Game.starting_cash == 5000)

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

