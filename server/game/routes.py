from flask import Blueprint, request, jsonify
import os
import secrets
from uuid import uuid4
import string
import random
from werkzeug.exceptions import BadRequest
import pytz

from auth.decorators import require_authentication
from db import Game, GameProfile, Coin, GameCoin, db
from .serializers import (
    GameCreateRequest,
    GameResponse,
    CoinsResponse,
    GetGameResponse,
    TradeRequest,
    TradeResponse,
    Cash,
)
from .services import (
    create_game,
    update_game,
    get_game_by_id,
    get_game_profile_by_profile_id_and_game_id,
    get_coins_by_game_id,
    get_game_profile_coins_by_game_profile_id,
    buy_coin,
    sell_coin
)

game_bp = Blueprint('game', __name__, url_prefix='/game')


UTC = pytz.UTC

#TODO
# We probably need a better way to generate shareable link, code, and ID.
@game_bp.route('/', methods=['POST'])
@require_authentication
def create(profile):
    validated_data: dict = GameCreateRequest.deserialize(request.json)
    local = pytz.timezone("UTC")
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
        active_coins,
        profile=profile,
    )
    return jsonify(GameResponse.serialize(game))


@game_bp.route('/<game_id>', methods=['GET'])
@require_authentication
def get(profile, game_id):
    try:
        int(game_id)
    except:
        raise BadRequest('Invalid game id')
    game = get_game_by_id(game_id)
    gameProfile = get_game_profile_by_profile_id_and_game_id(profile.id, game_id)
    gameProfileCoins = get_game_profile_coins_by_game_profile_id(gameProfile.id)
    coins = get_coins_by_game_id(game_id)
    for coin in coins:
        coinNumber = 0
        for gameProfileCoin in gameProfileCoins:
            if gameProfileCoin.coin == coin.id:
                coinNumber = gameProfileCoin.number
                break
        coin.number = coinNumber

    return jsonify(GetGameResponse.serialize({
        'game': game,
        'gameProfile': {
            'cash': gameProfile.cash
        },
        'coins': coins
    }))


@game_bp.route('/coins', methods=['GET'])
def get_coins():
    return jsonify(CoinsResponse.serialize(Coin.select(), many=True))


@game_bp.route('/<game_id>/coin', methods=['POST'])
@require_authentication
def buy_or_sell(profile, game_id):
    try:
        int(game_id)
    except:
        raise BadRequest('Invalid game id')
    validated_data: dict = TradeRequest.deserialize(request.json)
    coin_id = validated_data['coinId']
    coin_amount = validated_data['coinAmount']
    game_profile = get_game_profile_by_profile_id_and_game_id(profile.id, game_id)
    if coin_amount > 0:
        new_coin_amount = buy_coin(coin_id, coin_amount, game_profile)
    else:
        new_coin_amount = sell_coin(coin_id, -1 * coin_amount, game_profile)
    game_profile = get_game_profile_by_profile_id_and_game_id(profile.id, game_id)
    return jsonify(TradeResponse.serialize({
        'new_amount': new_coin_amount,
        'new_cash': game_profile.cash,
    }))

@game_bp.route('/<game_id>/coins', methods=['DELETE'])
@require_authentication
def liquefy(profile, game_id):
    try:
        int(game_id)
    except:
        raise BadRequest('Invalid game id')
    gameProfile = get_game_profile_by_profile_id_and_game_id(profile.id, game_id)
    gameProfileCoins = get_game_profile_coins_by_game_profile_id(gameProfile.id)
    for gameProfileCoin in gameProfileCoins:
        sell_coin(gameProfileCoin.coin, gameProfileCoin.coin_amount, gameProfile)
    gameProfile = get_game_profile_by_profile_id_and_game_id(profile.id, game_id)
    return jsonify(Cash.serialize({
        'cash': gameProfile.cash,
    }))

@game_bp.route('/<game_id>', methods=['PUT'])
@require_authentication
def edit(profile, game_id):
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
