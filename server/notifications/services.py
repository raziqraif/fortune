from decimal import Decimal

from db import db, Notification, Profile, PriceAlert, Coin


socketio = None

def register_socketio(sio):
    global socketio
    socketio = sio


@db.atomic()
def send_notification(to: Profile, text: str):
    if socketio is None:
        raise Exception('Tried to emit but socketio is not initialized!')
    Notification.create(profile=to, content=text)
    if not to.socket_id:
        return
    socketio.emit('notification', text, room=to.socket_id)


@db.atomic()
def get_notifications(profile: Profile, page_size=0, offset=0):
    return (Notification
        .select()
        .where(Notification.profile == profile)
        .order_by(Notification.created_at.desc())
        .paginate(offset, page_size))

@db.atomic()
def get_notifications_count(profile: Profile):
    return (Notification
        .select()
        .where(Notification.profile == profile)
        .count())

@db.atomic()
def get_price_alerts(profile: Profile):
    return (PriceAlert
        .select()
        .where((PriceAlert.profile == profile) & (PriceAlert.hit == False))
        .order_by(PriceAlert.created_at.desc()))


@db.atomic()
def create_price_alert(profile: Profile, coin: Coin, strike_price: Decimal, above=True):
    alert = PriceAlert.create(
        profile=profile,
        coin=coin,
        strike_price=strike_price,
        above=above,
    )
    above_below_str = 'above' if above else 'below'
    send_notification(
        profile,
        f'A price alert for {coin.name} was created when its price goes {above_below_str} ${strike_price}',
    )
    return alert
