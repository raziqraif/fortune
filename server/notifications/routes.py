from decimal import Decimal

from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest

from auth.decorators import require_authentication
from db import AuthToken, Profile, Coin
from .services import get_notifications, get_price_alerts, create_price_alert
from .serializers import NotificationSerializer, CreatePriceAlertRequestSerializer, PriceAlertSerializer


notification_bp = Blueprint('notification', __name__, url_prefix='/notification')


@notification_bp.route('/', methods=['GET'])
@require_authentication
def get_notifications_route(profile):
    try:
        page_str = request.args.get('page')
        if page_str:
            page = int(page_str)
        else:
            page = 0
    except:
        raise BadRequest('Invalid page number')
    notifications = get_notifications(profile, 16, page)
    return jsonify(NotificationSerializer.serialize(notifications, many=True))


@notification_bp.route('/', methods=['POST'])
@require_authentication
def send_notification_route():
    raise NotImplementedError


alert_bp = Blueprint('alert', __name__, url_prefix='/alert')


@alert_bp.route('/', methods=['GET'])
@require_authentication
def get_price_alerts_route(profile):
    return jsonify(PriceAlertSerializer.serialize(get_price_alerts(profile), many=True))


@alert_bp.route('/', methods=['POST'])
@require_authentication
def create_price_alert_route(profile):
    validated_data: dict = CreatePriceAlertRequestSerializer.deserialize(request.json)
    try:
        strike_price = Decimal(validated_data['strike_price'])
    except:
        raise BadRequest('Invalid decimal number for strike price')
    coin_id = validated_data['coin_id']
    type = validated_data['type']
    coin = Coin.get_or_none(Coin.id == coin_id)
    if coin is None:
        raise BadRequest('Invalid coin id')
    if type == 'above':
        alert = create_price_alert(profile, coin, strike_price, above=True)
    elif type == 'below':
        alert = create_price_alert(profile, coin, strike_price, above=False)
    else:
        raise BadRequest('The type of a price alert must be "above" or "below"')
    return jsonify(PriceAlertSerializer.serialize(alert))
