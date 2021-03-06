from decimal import Decimal
import math

from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest, Unauthorized

from auth.decorators import require_authentication
from db import AuthToken, Profile, Coin
from .services import get_notifications, get_price_alerts, create_price_alert, get_notifications_count, \
    send_notification_to_all, send_notification, get_profile_to_notify
from .serializers import NotificationSerializer, CreatePriceAlertRequestSerializer, PriceAlertSerializer, \
    PagedNotificationResponse, SendNotificationRequest

PAGE_SIZE = 6

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
        if page < 0:
            raise Exception
    except:
        raise BadRequest('Invalid page number')
    notifications = get_notifications(profile, PAGE_SIZE, page)
    notifications_count = math.ceil(get_notifications_count(profile) / PAGE_SIZE)
    return jsonify(PagedNotificationResponse.serialize({
        'page': page,
        'pages': notifications_count,
        'notifications': NotificationSerializer.serialize(notifications, many=True),
    }))


@notification_bp.route('/', methods=['POST'])
@require_authentication
def notify_all(profile):
    if not profile.is_admin:
        raise Unauthorized

    validated_data: dict = SendNotificationRequest.deserialize(request.json)
    try:
        message = validated_data['message']
    except:
        raise BadRequest("Invalid parameter")
    send_notification_to_all(message)

    return jsonify({})


@notification_bp.route('/<user_id>', methods=['POST'])
@require_authentication
def notify_user(profile, user_id):
    if not profile.is_admin:
        raise Unauthorized

    validated_data: dict = SendNotificationRequest.deserialize(request.json)
    try:
        message = validated_data['message']
    except:
        raise BadRequest("Invalid parameter")

    to_profile = get_profile_to_notify(user_id)
    send_notification(to_profile, message)

    return jsonify({})


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
        if strike_price < 0:
            raise BadRequest('The strike price cannot be negative')
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
