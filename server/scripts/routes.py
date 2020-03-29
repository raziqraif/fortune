from flask import Blueprint, jsonify
from flask_socketio import SocketIO, send, emit

from db import Ticker
from .serializers import TickersResponse
from .service import get_tickers_24hr

tickers_bp = Blueprint('tickers', __name__, url_prefix='/tickers')

@tickers_bp.route('/1d', methods=['GET'])
def get():
    tickers = get_tickers_24hr()
    return jsonify(TickersResponse.serialize(tickers, many=True))
