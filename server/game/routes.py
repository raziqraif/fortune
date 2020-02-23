from flask import Blueprint, request, jsonify

from db import Game, GameProfile, Coin

game_bp = Blueprint('game', __name__, url_prefix='/game')


@game_bp.route('/create', methods=['POST'])
def create():
    # TODO handle create game
    starting_cash = request.args.get('starting_cash')
    shareable_link = request.args.get('sharable_link')
    shareable_code = request.args.get('sharable_code')
    ends_at = request.args.get('ends_at')
    try:
        game = Game (
            starting_cash = starting_cash
            shareable_link = sharable_link
            shareable_code = sharable_code
            ends_at = ends_at
        )
    except Exception as e:
        return "Failure to create Game: {}".format(str(e))

    db.session.add(game)
    db.session.commit()
    return "Game created. Game id={}".format(game.id)

@game_bp.route('/edit/<id>', methods=['POST'])
    def edit():
    # edit game
    try:
        game = Game.query.filter_by(id=id).first()
        game.starting_cash = request.args.get('starting_cash')
        game.shareable_link = request.args.get('sharable_link')
        game.shareable_code = request.args.get('sharable_code')
        game.ends_at = request.args.get('ends_at')
    except Exception as e:
        return "Failure to edit Game: {}".format(str(e))
    
    db.session.add(game)
    db.session.commit()
    return "Game edited. Game id={}".format(game.id)

