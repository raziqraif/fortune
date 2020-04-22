from flask import Blueprint, request, jsonify
import os
import secrets
from uuid import uuid4
import string
import random
from werkzeug.exceptions import BadRequest
import pytz
import datetime
import time

from auth.decorators import require_authentication
from db import Game, GameProfile, Coin, GameCoin, db
from .serializers import (
    GameCreateRequest,
    GameResponse,
    CoinsResponse,
    GetGameResponse,
    GetCoinsResponse,
    TradeRequest,
    TradeResponse,
    CoinAndPrices,
    Cash,
    CreateMessageRequest,
    CreateMessageResponse,
    PlayersDataResponse,
    Player,
    MessagesDataResponse,
    Message)
from .services import (
    create_game,
    update_game,
    get_game_by_id,
    get_game_profile_by_profile_id_and_game_id,
    get_coins_by_game_id,
    get_game_profile_coins_by_game_profile_id,
    get_start_time_from_time_span,
    get_coins_by_game_id_and_sorting,
    get_net_worth_by_game_profile_id,
    get_pricing_by_coins,
    buy_coin,
    sell_coin,
    create_chat_message,
    get_players_in_a_game,
    get_chat_messages_data)

game_bp = Blueprint('game', __name__, url_prefix='/game')


UTC = pytz.UTC


# TODO
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
    netWorth = get_net_worth_by_game_profile_id(gameProfile.id)
    
    return jsonify(GetGameResponse.serialize({
        'game': game,
        'gameProfile': {
            'cash': gameProfile.cash,
            'netWorth': netWorth,
        },
    }))


@game_bp.route('/coins', methods=['GET'])
def get_coins():
    return jsonify(CoinsResponse.serialize(Coin.select(), many=True))


@game_bp.route('/<game_id>/coins', methods=['GET'])
@require_authentication
def get_game_coins(profile, game_id):
    try:
        int(game_id)
    except:
        raise BadRequest('Invalid game id')
    time_span = request.args.get('timeSpan')
    sort_by = request.args.get('sortBy')
    page_num = request.args.get('pageNum')
    num_per_page = request.args.get('numPerPage')
    try:
        time_span = int(time_span)
        sort_by = int(sort_by)
        page_num = int(page_num)
        num_per_page = int(num_per_page)
    except:
        raise BadRequest('Parameters not in correct form')

    game_profile = get_game_profile_by_profile_id_and_game_id(profile.id, game_id)
    start_time = get_start_time_from_time_span(time_span)
    coins = get_coins_by_game_id_and_sorting(
        game_id,
        sort_by,
        page_num,
        num_per_page
    )
    coins_and_prices = get_pricing_by_coins(coins, start_time)

    game_profile_coins = get_game_profile_coins_by_game_profile_id(game_profile.id)
    for coin_and_prices in coins_and_prices:
        coin_number = 0
        for game_profile_coin in game_profile_coins:
            if game_profile_coin.coin == coin_and_prices['coin'].id:
                coin_number = game_profile_coin.number
                break
        coin_and_prices['coin'].number = coin_number

    return jsonify(GetCoinsResponse.serialize({
        'coins_and_prices': coins_and_prices
    }))


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


@game_bp.route('<game_id>/chat/players', methods=['POST'])
@require_authentication
def players_data_for_chat(profile, game_id):
    try:
        int(game_id)
    except:
        raise BadRequest('Invalid game id')

    get_game_profile_by_profile_id_and_game_id(profile.id, game_id)
    # If doesn't exist, BadRequest was already thrown

    players = get_players_in_a_game(game_id)
    resp = PlayersDataResponse()
    resp.players = []
    for ply in players:
        player = Player()
        player.id = ply.id
        player.name = ply.username
        resp.players.append(player)

    resp.currentPlayerId = profile.id

    return jsonify(PlayersDataResponse.serialize(resp))


@game_bp.route('/<game_id>/chat', methods=['POST'])
@require_authentication
def create_message(profile, game_id):
    try:
        int(game_id)
    except:
        raise BadRequest('Invalid game id')

    validated_data: dict = CreateMessageRequest.deserialize(request.json)
    message = validated_data['message']

    get_game_profile_by_profile_id_and_game_id(profile.id, game_id)
    # If doesn't exist, BadRequest was already thrown

    message = create_chat_message(profile.id, game_id, message)

    resp = CreateMessageResponse()
    resp.id = message.id
    resp.authorId = message.profile.id
    # resp.createdOn = message.created_on
    resp.createdOn = int(time.mktime(message.created_on.timetuple())) * 1000
    resp.message = message.content

    return jsonify(
        CreateMessageResponse.serialize(resp)
    )


@game_bp.route('/<game_id>/chat', methods=['GET'])
@require_authentication
def get_messages_data(profile, game_id):
    try:
        int(game_id)
    except:
        raise BadRequest('Invalid game id')

    oldest_id = request.args.get('oldestID')
    newest_id = request.args.get('newestID')
    get_new_messages = request.args.get('getNewMessages')

    try:
        oldest_id = int(oldest_id)
        newest_id = int(newest_id)
        get_new_messages = bool(get_new_messages)
    except:
        raise BadRequest('Parameters not in correct form')

    get_game_profile_by_profile_id_and_game_id(profile.id, game_id)
    # If doesn't exist, BadRequest was already thrown

    messages, has_older_messages = get_chat_messages_data(game_id, oldest_id, newest_id, get_new_messages)

    resp = MessagesDataResponse()
    resp.messages = []
    for msg in messages:
        message = Message()
        message.id = msg.id
        message.authorId = msg.profile.id
        # https://stackoverflow.com/questions/5022447/converting-date-from-python-to-javascript
        message.createdOn = int(time.mktime(msg.created_on.timetuple())) * 1000
        message.message = msg.content
        resp.messages.append(message)
    resp.hasOlderMessages = has_older_messages

    return jsonify(
        MessagesDataResponse.serialize(resp)
    )
