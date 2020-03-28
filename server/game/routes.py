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
    GetCoinsRequest,
    GameCreateRequest,
    GameResponse,
    CoinsResponse,
    GetGameResponse,
    GetCoinsResponse
)
from .services import (
    create_game,
    update_game,
    get_game_by_id,
    get_game_profile_by_profile_id_and_game_id,
    get_coins_by_game_id,
    get_game_profile_coins_by_game_profile_id,
    get_start_time_from_time_span,
    get_coins_by_game_id_and_sorting
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

@game_bp.route('/<game_id>/coins', methods=['GET'])
@require_authentication
def get_game_coins(profile, game_id, timeSpan, sortBy, pageNum, numPerPage):
    try:
        int(game_id)
    except:
        raise BadRequest('Invalid game id')
    raise BadRequest('wow')
    gameProfile = get_game_profile_by_profile_id_and_game_id(profile.id, game_id)
    start_time = get_start_time_from_time_span(timeSpan)
    coins = get_coins_by_game_id_and_sorting(
        game_id,
        sortBy,
        pageNum,
        numPerPage
    )
    coins_and_prices = get_pricing_by_coins(coins, start_time)
    gameProfileCoins = get_game_profile_coins_by_game_profile_id(gameProfile.id)
    for coin_and_prices in coins_and_prices:
        coinNumber = 0
        for gameProfileCoin in gameProfileCoins:
            if gameProfileCoin.coin == coin_and_prices.coin.id:
                coinNumber = gameProfileCoin.number
                break
        coin_and_prices.coin.id = coinNumber
    return jsonify(GetCoinsResponse.serialize({
        'coins_and_prices': coins_and_prices
    }, many=True))


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

